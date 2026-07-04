interface AcademyCalloutProps {
  title?: string;
  body: string;
}

export function AcademyCallout({ title, body }: AcademyCalloutProps) {
  return (
    <div className="rounded-2xl bg-[#f5f1f6] border border-[#d89ca4]/20 px-6 py-5">
      {title && (
        <p className="text-xs font-semibold tracking-widest uppercase text-[#d89ca4] mb-2">
          {title}
        </p>
      )}
      <p className="text-sm text-[#4f4a52]/80 leading-relaxed">{body}</p>
    </div>
  );
}
