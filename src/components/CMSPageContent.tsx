import type { ReactNode } from "react";
import type { StoryblokPageContent, StoryblokRichTextNode } from "../utils/storyblok";

interface CMSPageContentProps {
  content: StoryblokPageContent | null | undefined;
}

export function getCmsRenderMode(content: StoryblokPageContent | null | undefined) {
  return content?.renderMode || content?.render_mode || "append";
}

function getBody(content: StoryblokPageContent) {
  return content.body || content.content || content.richText || "";
}

function sanitizeCmsHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\sjavascript:/gi, "");
}

function isRichTextNode(value: unknown): value is StoryblokRichTextNode {
  return Boolean(value && typeof value === "object" && ("type" in value || "content" in value));
}

function applyMarks(text: ReactNode, marks: StoryblokRichTextNode["marks"] = []) {
  return marks.reduce<ReactNode>((node, mark, index) => {
    if (mark.type === "bold") return <strong key={index} className="font-black text-slate-900">{node}</strong>;
    if (mark.type === "italic") return <em key={index}>{node}</em>;
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      return (
        <a key={index} href={href} className="text-emerald-700 underline underline-offset-4" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
          {node}
        </a>
      );
    }
    return node;
  }, text);
}

function renderRichTextNode(node: StoryblokRichTextNode, index = 0): ReactNode {
  const children = (node.content || []).map((child, childIndex) => renderRichTextNode(child, childIndex));

  if (node.text) return applyMarks(node.text, node.marks);

  switch (node.type) {
    case "doc":
      return <div key={index} className="space-y-4">{children}</div>;
    case "paragraph":
      return <p key={index} className="text-sm sm:text-base text-slate-600 leading-7 font-medium">{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level || 2);
      if (level === 1) return <h1 key={index} className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{children}</h1>;
      if (level === 3) return <h3 key={index} className="text-lg font-extrabold text-slate-900 mt-6">{children}</h3>;
      return <h2 key={index} className="text-2xl font-black text-slate-950 mt-8">{children}</h2>;
    }
    case "bullet_list":
      return <ul key={index} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-600 leading-7 font-medium">{children}</ul>;
    case "ordered_list":
      return <ol key={index} className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-slate-600 leading-7 font-medium">{children}</ol>;
    case "list_item":
      return <li key={index}>{children}</li>;
    case "blockquote":
      return <blockquote key={index} className="border-l-4 border-emerald-500 bg-emerald-50/60 p-4 rounded-xl text-sm text-slate-700 leading-7">{children}</blockquote>;
    case "hard_break":
      return <br key={index} />;
    default:
      return children.length > 0 ? <div key={index}>{children}</div> : null;
  }
}

function renderTextBlocks(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-extrabold text-slate-900 mt-6">
            {block.replace(/^###\s+/, "")}
          </h3>
        );
      }

      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-black text-slate-950 mt-8">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      return (
        <p key={index} className="text-sm sm:text-base text-slate-600 leading-7 font-medium">
          {block}
        </p>
      );
    });
}

export default function CMSPageContent({ content }: CMSPageContentProps) {
  if (!content || getCmsRenderMode(content) === "hidden") return null;

  const title = content.title || content.headline;
  const description = content.excerpt || content.description;
  const html = content.bodyHtml || content.body_html || content.html;
  const body = getBody(content);
  const sections = content.sections || [];
  const hasRichText = isRichTextNode(body);
  const hasTextBody = typeof body === "string" && body.trim().length > 0;
  const hasContent = Boolean(title || description || html || hasTextBody || hasRichText || sections.length > 0);

  if (!hasContent) return null;

  return (
    <section className="bg-white border-t border-slate-100 py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {(title || description) && (
          <header className="space-y-3">
            {title && <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{title}</h1>}
            {description && <p className="text-base text-slate-500 leading-7 font-medium">{description}</p>}
          </header>
        )}

        {html && (
          <div
            className="prose prose-slate max-w-none text-slate-650"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
          />
        )}

        {!html && hasRichText && renderRichTextNode(body)}
        {!html && !hasRichText && hasTextBody && <div className="space-y-4">{renderTextBlocks(body)}</div>}

        {sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {sections.map((section, index) => (
              <article key={index} className="border border-slate-200 rounded-lg p-5 bg-slate-50/70 space-y-2">
                {(section.title || section.heading) && (
                  <h2 className="text-base font-black text-slate-900">{section.title || section.heading}</h2>
                )}
                {(section.text || section.body) && (
                  <p className="text-sm text-slate-600 leading-6 font-medium">{section.text || section.body}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
