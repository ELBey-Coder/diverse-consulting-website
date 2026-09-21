export default function RawPage({ html }: { html: string }) {
  const cleaned = (html || '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<button[^>]+id=["']dcChatbotLauncher["'][\s\S]*?<\/button>/gi, '')
    .replace(/<div[^>]+id=["']dcChatbotPanel["'][\s\S]*?<\/div>/gi, '');

  return (
    <div
      className="dc-page-shell"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
