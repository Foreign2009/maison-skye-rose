import type { AcademyContentBlock } from "../../lib/academy/types";

interface ArticleContentRendererProps {
  content: AcademyContentBlock[];
}

export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="text-[#4f4a52]/80 leading-relaxed text-base">
                {block.text}
              </p>
            );

          case "heading":
            return (
              <h2
                key={index}
                className="text-[#4f4a52] font-semibold text-xl pt-4 first:pt-0"
              >
                {block.text}
              </h2>
            );

          case "tip":
            return (
              <div
                key={index}
                className="rounded-xl bg-[#fdf6f7] border border-[#d89ca4]/30 px-5 py-4"
              >
                <p className="text-[#4f4a52]/80 text-sm leading-relaxed">
                  <span className="font-semibold text-[#d89ca4]">Tip: </span>
                  {block.text}
                </p>
              </div>
            );

          case "note-list":
            return (
              <ul key={index} className="space-y-2 pl-1">
                {block.notes.map((note, noteIndex) => (
                  <li key={noteIndex} className="flex items-start gap-3 text-sm text-[#4f4a52]/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d89ca4]" />
                    {note}
                  </li>
                ))}
              </ul>
            );

          case "fragrance-spotlight":
            return null;

          default:
            return null;
        }
      })}
    </div>
  );
}
