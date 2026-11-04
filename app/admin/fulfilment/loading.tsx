export default function FulfilmentLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1eb] px-6" aria-busy="true">
      <p role="status" className="text-sm text-[#7b7480]">Loading website orders…</p>
    </main>
  );
}
