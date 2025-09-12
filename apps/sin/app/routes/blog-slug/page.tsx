import type { Route } from "./+types/page";

function mdToHtml(md: string) {
  // minimal markdown renderer: headings, lists, blockquotes, links, code, images
  let html = md.trim();
  // code blocks
  html = html.replace(/```([\s\S]*?)```/gim, '<pre class="mt-4 rounded bg-gray-900 p-4 text-gray-100 overflow-x-auto"><code>$1</code></pre>');
  // headings
  html = html.replace(/^###\s+(.+)$/gim, '<h3 class="mt-6 text-lg font-semibold">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gim, '<h2 class="mt-8 text-xl font-semibold">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gim, '<h1 class="mt-10 text-2xl font-semibold">$1</h1>');
  // blockquote
  html = html.replace(/^>\s+(.*)$/gim, '<blockquote class="mt-4 border-l-4 pl-4 text-gray-600 dark:text-gray-300">$1</blockquote>');
  // images ![alt](src)
  html = html.replace(/!\[(.*?)\]\((https?:[^)]+)\)/gim, '<img alt="$1" src="$2" class="my-4 rounded" />');
  // inline code, emphasis, strong
  html = html.replace(/`([^`]+)`/gim, '<code class="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/gim, '<em>$1</em>');
  // links
  html = html.replace(/\[(.+?)\]\((https?:[^)]+)\)/gim, '<a class="underline" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // lists (unordered and ordered)
  html = html.replace(/^(?:\s*[-*+]\s.+(?:\n|$))+?/gim, (m) => {
    const items = m
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^\s*[-*+]\s+/, "").trim())
      .map((c) => `<li>${c}</li>`)
      .join("");
    return `<ul class="mt-4 list-disc pl-6">${items}</ul>`;
  });
  html = html.replace(/^(?:\s*\d+\.\s.+(?:\n|$))+?/gim, (m) => {
    const items = m
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^\s*\d+\.\s+/, "").trim())
      .map((c) => `<li>${c}</li>`)
      .join("");
    return `<ol class="mt-4 list-decimal pl-6">${items}</ol>`;
  });
  // paragraphs for remaining text blocks
  html = html
    .split(/\n{2,}/)
    .map((block) => (/^<h\d|^<pre|^<ul|^<ol|^<blockquote|^<img/.test(block.trim()) ? block : `<p class="mt-4 leading-relaxed">${block}\n</p>`))
    .join("\n");
  return html;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const slug = params.slug ?? "";
  const [metaRes, contentRes] = await Promise.all([
    fetch("/posts/index.json").then((r) => (r.ok ? r.json() : { posts: [] })),
    fetch(`/posts/${slug}.md`).then(async (r) => (r.ok ? await r.text() : "")),
  ]);
  const post = (metaRes.posts as Array<any>).find((p) => p.slug === slug);
  return { post, content: contentRes as string };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post, content } = (loaderData as { post?: { title: string; date?: string }; content: string }) ?? {};
  const html = mdToHtml(content || "");

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Post not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      {post.date && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toDateString()}</p>
      )}
      <article className="prose mt-6 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
