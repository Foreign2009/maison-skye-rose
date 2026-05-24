export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f5f1eb] p-6">

      <div className="mx-auto max-w-7xl">

        {/* HERO */}
        <div className="animate-pulse">

          <div className="h-5 w-52 rounded-full bg-[#e7e1d8]" />

          <div className="mt-8 h-20 w-[70%] rounded-[30px] bg-[#e7e1d8]" />

          <div className="mt-5 h-6 w-[50%] rounded-full bg-[#ece7df]" />

        </div>

        {/* COLLECTIONS */}
        <div className="mt-20 grid gap-6 md:grid-cols-2">

          <div className="h-[420px] rounded-[40px] bg-[#e7e1d8] animate-pulse" />

          <div className="h-[420px] rounded-[40px] bg-[#ece7df] animate-pulse" />

        </div>

        {/* PRODUCTS */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="rounded-[36px] bg-white p-5 shadow-sm"
            >

              <div className="h-[320px] rounded-[28px] bg-[#ece7df] animate-pulse" />

              <div className="mt-6 h-8 w-[70%] rounded-full bg-[#ece7df] animate-pulse" />

              <div className="mt-4 h-5 w-full rounded-full bg-[#f0ebe3] animate-pulse" />

              <div className="mt-3 h-5 w-[80%] rounded-full bg-[#f0ebe3] animate-pulse" />

              <div className="mt-8 h-12 w-36 rounded-full bg-[#ece7df] animate-pulse" />

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}