import type { AcademyContentBlock } from "../../lib/academy/types";
import { AcademyCallout } from "./AcademyCallout";
import { AcademyQuote } from "./AcademyQuote";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { FragranceSpotlight } from "../knowledge/FragranceSpotlight";

interface ArticleContentRendererProps {
  content: AcademyContentBlock[];
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
                id={headingId(block.text)}
                className="text-[#4f4a52] font-semibold text-xl pt-6 first:pt-0 scroll-mt-28 md:scroll-mt-36"
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
                  <li
                    key={noteIndex}
                    className="flex items-start gap-3 text-sm text-[#4f4a52]/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d89ca4]" />
                    {note}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return <AcademyQuote key={index} text={block.text} attribution={block.attribution} />;

          case "warning":
            return (
              <div
                key={index}
                className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4"
              >
                <p className="text-[#4f4a52]/80 text-sm leading-relaxed">
                  <span className="font-semibold text-amber-600">Note: </span>
                  {block.text}
                </p>
              </div>
            );

          case "comparison":
            return (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div className="rounded-xl border border-[#e8e4e9] bg-white px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-2">
                    {block.left.label}
                  </p>
                  <p className="text-sm text-[#4f4a52]/80 leading-relaxed">
                    {block.left.text}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e8e4e9] bg-white px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-2">
                    {block.right.label}
                  </p>
                  <p className="text-sm text-[#4f4a52]/80 leading-relaxed">
                    {block.right.text}
                  </p>
                </div>
              </div>
            );

          case "divider":
            return (
              <hr
                key={index}
                className="border-none border-t border-[#e8e4e9] my-2"
              />
            );

          case "callout":
            return <AcademyCallout key={index} title={block.title} body={block.body} />;

          case "fragrance-spotlight": {
            const fragrance = mkcCatalogue.find(
              (f) => f.id === block.fragranceId || f.slug === block.fragranceId
            );
            if (!fragrance) return null;
            return (
              <FragranceSpotlight
                key={index}
                fragrance={fragrance}
                caption={block.caption}
              />
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
