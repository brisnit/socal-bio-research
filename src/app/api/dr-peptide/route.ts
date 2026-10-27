import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { DR_PEPTIDE_REFUSAL_FALLBACK, DR_PEPTIDE_SYSTEM_PROMPT } from "@/lib/dr-peptide-prompt";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/dr-peptide
 *
 * Wire-compatible with the original site's endpoint, so the widget code is
 * unchanged: the request is `{ sessionId, messages: [{ role, content }] }` and
 * the response is an OpenAI-style SSE stream:
 *   data: {"choices":[{"delta":{"content":"..."}}]}\n\n ... data: [DONE]\n\n
 * Errors are JSON `{ error }` with a non-2xx status, which the widget shows.
 */

const bodySchema = z.object({
  sessionId: z.string().max(100).optional().default(""),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .min(1)
    .max(60),
});

const MODEL = process.env.DR_PEPTIDE_MODEL || "claude-opus-5-5";
const MAX_TURNS_SENT = 20;

function json(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return json(503, "Dr. Peptide is offline right now. Please use the contact form and a real person will help.");
  }

  const ip = clientIp(req);
  if (!rateLimit(`drp:${ip}`, 30, 10 * 60_000)) {
    return json(429, "You're sending messages quickly: please wait a few minutes and try again.");
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return json(400, "Dr. Peptide couldn't read that message. Please try again.");
  }

  const last = body.messages[body.messages.length - 1];
  if (last.role !== "user" || !last.content.trim()) return json(400, "Please type a question first.");
  if (last.content.length > 4000) return json(400, "That's a long one: please trim to 4000 characters or fewer.");

  // The widget's history starts with its canned greeting (assistant). The API
  // needs the conversation to start with a user turn, so drop leading
  // assistant messages and keep only the most recent turns.
  let history = body.messages.slice(-MAX_TURNS_SENT);
  while (history.length && history[0].role === "assistant") history = history.slice(1);
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));

  const client = new Anthropic();
  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, content: string) =>
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      let reply = "";
      try {
        const upstream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 2000,
          system: [{ type: "text", text: DR_PEPTIDE_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages,
          output_config: { effort: "low" },
          // Server-side refusal fallback: if the primary model's safety
          // classifier declines, the API re-runs the request on a fallback.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
        } as Parameters<typeof client.beta.messages.stream>[0]);

        for await (const event of upstream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            reply += event.delta.text;
            send(controller, event.delta.text);
          }
        }
        const final = await upstream.finalMessage();
        if (final.stop_reason === "refusal" && !reply.trim()) {
          reply = DR_PEPTIDE_REFUSAL_FALLBACK;
          send(controller, reply);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("[dr-peptide]", err);
        if (!reply) send(controller, "Dr. Peptide ran into a hiccup. Please try again, or use the contact form to reach a real person.");
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
        void logExchange(body.sessionId, last.content, reply, ip);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

/** Stores the exchange for admin review when Supabase is configured (see privacy policy). */
async function logExchange(sessionId: string, question: string, answer: string, ip: string) {
  const db = getAdminClient();
  if (!db) return;
  try {
    await db.from("chat_messages").insert({
      session_id: sessionId || null,
      question,
      answer,
      model: MODEL,
      ip_hash: await hashIp(ip),
    });
  } catch (err) {
    console.error("[dr-peptide] log failed", err);
  }
}

async function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT ?? "";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + ip));
  return Buffer.from(buf).toString("hex").slice(0, 32);
}
