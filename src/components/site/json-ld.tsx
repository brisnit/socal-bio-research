export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** canonical + og:url for "/" with the trailing slash (React hoists these into <head>). */
export function RootUrlTags({ url }: { url: string }) {
  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </>
  );
}
