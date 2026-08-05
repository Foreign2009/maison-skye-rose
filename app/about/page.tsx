import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About Maison Skye & Rose — Our Story and Our Beliefs",
  description:
    "Maison Skye & Rose began with a question: why should confidence only belong to people who can afford luxury pricing? Learn about our founding story, the names we carry, and why we believe quality and accessibility are not in opposition.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Maison Skye & Rose",
    description:
      "Our founding story, our beliefs, and the names behind the institution. Discover why confidence — not fragrance — is what we exist to deliver.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Maison Skye & Rose",
    description:
      "Our founding story, our beliefs, and the names behind the institution.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-24">

        {/* Opening */}
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Our Story
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.05em]">
          Maison Skye & Rose
        </h1>

        <div className="mt-12 max-w-2xl space-y-8 text-lg leading-9 text-zinc-600">
          <p>
            This institution was not built from a business plan. It was built
            from a question — one that began with a compliment and has never
            let go.
          </p>
        </div>

        {/* A Compliment Changed Everything */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            The Story
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            A Compliment Changed Everything
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              One afternoon, someone told a colleague that the fragrance she was
              wearing was beautiful. She smiled — and then, unexpectedly, stood
              a little taller. Something small shifted in the room. A person
              briefly felt that she was worth careful attention.
            </p>
            <p>
              Afterwards came curiosity. And then a price. And then a question
              that would not let go: why should that kind of confidence only
              belong to people who can afford that price?
            </p>
            <p>
              That question became this institution. Not as a business idea, but
              as a conviction — that the feeling of being carefully, honestly,
              beautifully presented to the world does not belong exclusively to
              those with access to luxury pricing. That quality and
              accessibility are not opposites. That you should not have to
              choose between them.
            </p>
            <p>
              We searched for trusted suppliers who shared that belief. We built
              slowly, carefully, and honestly. And Maison Skye & Rose began.
            </p>
          </div>
        </div>

        {/* The Names */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            The Names
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            Why Skye & Rose
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              Skye and Rose are the names of the founder's daughters. They are
              on everything this institution builds — not as branding, but as
              responsibility.
            </p>
            <p>
              Every product released, every promise made, every decision about
              how to treat a guest is made beneath those names. If we are
              careless, their names carry it. If we exaggerate to make a sale,
              their names carry it. If we stop caring once we have someone's
              trust, their names carry it.
            </p>
            <p>
              They were placed here deliberately — as a mechanism for integrity,
              a way of ensuring that everyone who builds within this institution,
              now and in every generation that follows, feels the full
              consequence of how they behave.
            </p>
            <p>
              Skye and Rose are not a brand. They are a standard. Every future
              decision made under them should be one their names can bear.
            </p>
          </div>
        </div>

        {/* What We Believe */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            What We Believe
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            Confidence Is What We Are Here to Deliver
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              The product of Maison Skye & Rose is confidence. Fragrance is the
              means.
            </p>
            <p>
              What a well-chosen, well-crafted fragrance produces — the quiet
              assurance of feeling well-presented to the world, the ease of
              entering a room without self-consciousness — that is what we exist
              to deliver. Not a bottle. A feeling. And we believe that feeling
              belongs to anyone who cares to have it.
            </p>
            <p>
              We believe that luxury, properly understood, has very little to do
              with price. It has to do with care — the care taken in making
              something, the honesty with which it is described, the attention
              extended to every person who chooses it. Craftsmanship. Beauty.
              Trust. These qualities are not the exclusive property of expensive
              things.
            </p>
            <p>
              We believe in long-term relationships over short-term
              transactions. In growing with the guests who believed in us before
              we were proven. In making decisions today that we will still be
              proud of in thirty years.
            </p>
            <p>
              We believe that trust, once given by a guest, is held in
              stewardship — not owned. It must be earned continuously, tended
              carefully, and never exploited. It is the most valuable thing this
              institution accumulates.
            </p>
          </div>
        </div>

        {/* How We Build */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            How We Build
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            Knowledge Before Recommendation
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              People make better decisions when they understand. That is the
              principle behind every investment we have made in knowledge,
              education, and honest guidance.
            </p>
            <p>
              We have built our fragrance platform — the catalogue, the scent
              profiles, the education, the guided discovery — because we believe
              an informed guest is better served than an efficiently processed
              one. Our aim is not to make guests dependent on our suggestions.
              It is to give them the understanding to make confident choices of
              their own.
            </p>
            <p>
              Technology assists this aim. Our systems are designed to educate,
              to explain their reasoning, and to help guests understand their
              own preferences more clearly. They do not manufacture urgency.
              They do not make recommendations without sharing why. They do not
              treat a guest's attention as something to be captured — only as
              something to be deserved.
            </p>
            <p>
              Every decision our platform makes on a guest's behalf is one we
              are willing to explain openly and stand behind without reservation.
            </p>
          </div>
        </div>

        {/* Accessible Luxury */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Our Philosophy
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            Accessible Luxury
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              We are not a luxury house. We are not a discount operation. We are
              an institution with a particular conviction: that quality and
              accessibility are not in opposition — and that the belief that
              they are is exactly the gatekeeping this institution was founded to
              reject.
            </p>
            <p>
              Accessible luxury is not a phase of our development. It is not a
              positioning strategy. It is the permanent philosophy of Maison
              Skye & Rose — present in every product, every price, and every
              decision about how to welcome a guest.
            </p>
            <p>
              It means we make things that are genuinely well-crafted, at prices
              that do not require exceptional wealth to afford. It means we never
              use accessibility as a justification for lower standards. It means
              that every guest, regardless of what they spend, is owed the same
              quality of honesty and the same quality of care.
            </p>
            <p>
              Our collection continues to grow. Future premium offerings may
              expand the range of experiences available within this institution
              — but never at the cost of treating any guest as less welcome than
              another. The measure of quality, here, is always the same.
            </p>
          </div>
        </div>

        {/* Growing Together */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            The Future
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            Growing Together
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              We hope one day to welcome guests through more than fragrance —
              body care, home fragrance, personal care, and categories we have
              not yet imagined. Wherever this institution grows, the same
              standard follows. The same care, the same craftsmanship, the same
              honesty in how things are described and delivered.
            </p>
            <p>
              Growth is not the goal. Building something worth inheriting is the
              goal. That means we grow with the guests who have believed in us
              — not away from them. Every new category we enter, every new
              market we reach, is bound by the same conviction that began with a
              question and a price.
            </p>
          </div>
        </div>

        {/* Our Promise */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Our Promise
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-zinc-900">
            This Will Not Change
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              However Maison Skye & Rose grows, this remains true:
            </p>
            <p>
              Every guest will be welcomed warmly. Every guest will be educated
              honestly. Every guest will be helped to choose with confidence.
              Every promise we make will be the kind we intend to keep.
            </p>
            <p>
              Every decision we take will be measured first against the trust
              placed in us — and only then against everything else.
            </p>
            <p>
              The institution may grow larger. The product range may broaden.
              The technology will change. The care we bring to every guest, the
              craftsmanship in every product, and the integrity with which we
              behave — these do not change.
            </p>
          </div>
        </div>

        {/* An Invitation */}
        <div className="mt-20 border-t border-zinc-100 pt-16">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            An Invitation
          </p>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-9 text-zinc-600">
            <p>
              This is only the beginning of our story.
            </p>
            <p>
              We would be honoured if it became part of yours.
            </p>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
