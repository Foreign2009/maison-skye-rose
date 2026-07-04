interface AcademyQuoteProps {
  text: string;
  attribution?: string;
}

export function AcademyQuote({ text, attribution }: AcademyQuoteProps) {
  return (
    <blockquote className="border-l-2 border-[#d89ca4] pl-5 py-1 my-2">
      <p className="text-[#4f4a52] text-lg font-light leading-relaxed italic">
        &ldquo;{text}&rdquo;
      </p>
      {attribution && (
        <footer className="mt-2 text-xs text-[#4f4a52]/40 not-italic">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
