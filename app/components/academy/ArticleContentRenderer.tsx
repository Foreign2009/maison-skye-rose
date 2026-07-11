import type { AcademyContentBlock } from "../../lib/academy/types";
import { AcademyCallout } from "./AcademyCallout";
import { AcademyQuote } from "./AcademyQuote";
import Image from "next/image";
import Link from "next/link";
import { mkcCatalogue } from "../../lib/mkc/catalogue";

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
            const spotlightNotes = [
              ...fragrance.notes.top,
              ...fragrance.notes.heart,
              ...fragrance.notes.base,
            ].slice(0, 5);
            return (
              <div
                key={index}
                className="rounded-xl border border-[#e8e4e9] bg-white overflow-hidden"
              >
                <div className="flex gap-4 p-5">
                  <div className="shrink-0">
                    <Image
                      src={fragrance.images["10ml"]}
                      alt={fragrance.name}
                      width={72}
                      height={72}
                      className="rounded-lg bg-[#faf8f8] object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-0.5">
                      {fragrance.collection} Collection
                    </p>
                    <p className="text-sm font-bold text-[#4f4a52] leading-snug">
                      {fragrance.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-[#f5f1eb] px-2.5 py-0.5 text-[11px] font-medium text-[#7b7480]">
                        {fragrance.profile}
                      </span>
                      <span className="rounded-full bg-[#f5f1eb] px-2.5 py-0.5 text-[11px] font-medium text-[#7b7480]">
                        {fragrance.season}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#4f4a52]/70 leading-relaxed line-clamp-2">
                      {fragrance.mood}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {spotlightNotes.map((note) => (
                        <span
                          key={note}
                          className="rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-medium text-[#d89ca4]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#e8e4e9] bg-[#faf8f8] px-5 py-3 flex items-start justify-between gap-4">
                  <p className="text-xs italic text-[#4f4a52]/60 leading-relaxed">
                    {block.caption}
                  </p>
                  <Link
                    href={`/product/${fragrance.slug}`}
                    className="shrink-0 text-xs font-semibold text-[#d89ca4] hover:underline whitespace-nowrap"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
