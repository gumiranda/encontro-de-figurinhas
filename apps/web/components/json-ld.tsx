interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  try {
    const json = JSON.stringify(data);
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("Schema serialization failed:", e);
    }
    return null;
  }
}
