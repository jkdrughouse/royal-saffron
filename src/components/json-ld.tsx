interface JsonLdProps {
    data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders a schema.org JSON-LD script tag.
 * Use inside Server Components (layout, page, etc.).
 */
export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data, no user input
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
