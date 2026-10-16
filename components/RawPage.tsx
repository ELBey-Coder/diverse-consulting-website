export default function RawPage({ html }: { html: string }) {
  const cleaned = (html || '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove old chatbot launcher button
    .replace(/<button[^>]+id=["']dcChatbotLauncher["'][\s\S]*?<\/button>/gi, '')
    // Remove old chatbot panel — match up to the closing </div> that is
    // followed by <script (handles nested divs inside the panel)
    .replace(/<div[^>]*id=["']dcChatbotPanel["'][\s\S]*?<\/div>\s*(?=<script)/gi, '')
    // Fallback: remove any remaining dcChatbot* elements individually
    .replace(/<(div|button|form|input)[^>]*id=["']dcChatbot[A-Za-z]*["'][^>]*>([\s\S]*?<\/\1>)?/gi, '');

  return (
    <div
      className="dc-page-shell"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
