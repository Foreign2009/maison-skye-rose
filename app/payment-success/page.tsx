"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Check, MessageCircle, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import { trackPaymentReturnSuccess } from "../lib/analytics";
import { recordPurchase } from "../lib/customer/sync/CustomerProfileSync";
import { brand } from "../data/brand";
import { COLLECTION_PROVINCE, ALL_PROVINCES } from "../lib/commerce/delivery";

const BANKING_DETAILS = {
  bank:          process.env.NEXT_PUBLIC_BANK_NAME           ?? "",
  accountName:   process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME   ?? "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "",
  accountType:   process.env.NEXT_PUBLIC_BANK_ACCOUNT_TYPE   ?? "",
  branchCode:    process.env.NEXT_PUBLIC_BANK_BRANCH_CODE    ?? "",
};

const PAYMENT_TRACKED_KEY = "msr_eft_instructions_viewed";
const REF_FORMAT           = /^MSR-\d{8}-\d{5}$/;

type ConfirmationState =
  | { status: "loading" }
  | { status: "confirmed"; total: number; paymentStatus: string; province: string | null }
  | { status: "unauthorized" }
  | { status: "not_found" }
  | { status: "invalid_ref" }
  | { status: "network_error" }
  | { status: "server_error" };

type FulfilmentMode = "collection" | "delivery" | "unknown";

function getFulfilmentMode(province: string | null | undefined): FulfilmentMode {
  if (!province) return "unknown";
  if (province === COLLECTION_PROVINCE) return "collection";
  if (ALL_PROVINCES.includes(province)) return "delivery";
  return "unknown";
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${value}`}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#4f4a52]/20 px-3 py-1.5 min-h-[44px] text-xs font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
    >
      {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function buildContactUrl(message: string): string {
  return `https://wa.me/${brand.social.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function EFTConfirmationContent({ orderRef }: { orderRef: string }) {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ status: "loading" });
  const [retryTrigger, setRetryTrigger] = useState(0);

  // validRef is the reference string only when it passes format validation;
  // null otherwise. Used to avoid including unvalidated strings in messages.
  const validRef = REF_FORMAT.test(orderRef) ? orderRef : null;

  // Fetch receipt data. Aborts on ref change or retry to prevent overlapping
  // requests and stale state. The stale flag guards against the window where
  // the fetch response arrives as a microtask just before abort() is called.
  useEffect(() => {
    if (!REF_FORMAT.test(orderRef)) {
      setConfirmation({ status: "invalid_ref" });
      return;
    }
    const controller = new AbortController();
    let stale = false;
    setConfirmation({ status: "loading" });

    fetch(`/api/orders/${encodeURIComponent(orderRef)}`, { signal: controller.signal })
      .then(async (res) => {
        if (stale) return;
        if (res.status === 401) { setConfirmation({ status: "unauthorized" }); return; }
        if (res.status === 404) { setConfirmation({ status: "not_found" }); return; }
        if (!res.ok)            { setConfirmation({ status: "server_error" }); return; }
        const data = await res.json() as {
          orderRef:      string;
          total:         number;
          paymentStatus: string;
          province:      string | null;
        };
        if (stale) return;
        setConfirmation({
          status:        "confirmed",
          total:         data.total,
          paymentStatus: data.paymentStatus,
          province:      data.province ?? null,
        });
      })
      .catch((err) => {
        if (stale) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setConfirmation({ status: "network_error" });
      });

    return () => { stale = true; controller.abort(); };
  }, [orderRef, retryTrigger]);

  // Analytics — fire once per page view.
  useEffect(() => {
    if (sessionStorage.getItem(PAYMENT_TRACKED_KEY)) return;
    sessionStorage.setItem(PAYMENT_TRACKED_KEY, "1");
    trackPaymentReturnSuccess({});
  }, []);

  // Loyalty tracking — only on successful confirmation.
  useEffect(() => {
    if (confirmation.status !== "confirmed" || !validRef) return;
    try {
      const raw = localStorage.getItem(`msr_purchase_pending_${validRef}`);
      if (!raw) return;
      const slugs = JSON.parse(raw) as string[];
      recordPurchase(validRef, slugs);
      localStorage.removeItem(`msr_purchase_pending_${validRef}`);
    } catch { /* localStorage unavailable */ }
  }, [confirmation.status, validRef]);

  function handleRetry() {
    setRetryTrigger((t) => t + 1);
  }

  const sectionCls = "mx-auto max-w-xl px-6 pt-16 pb-24 md:py-24";

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (confirmation.status === "loading") {
    return (
      <section className={sectionCls} aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="mb-6 h-12 w-12 animate-pulse rounded-full bg-[#d89ca4]/30"
            aria-label="Loading order details"
          />
          <p className="text-sm text-[#7b7480]">Loading your order details…</p>
        </div>
      </section>
    );
  }

  // ── Unauthorized ─────────────────────────────────────────────────────────────
  if (confirmation.status === "unauthorized") {
    const contactUrl = buildContactUrl(
      `Hi Maison Skye & Rose! 🌸\n\nI'm trying to access my order receipt${validRef ? ` for ${validRef}` : ""} but I'm unable to verify my access. Could you help me?`
    );
    return (
      <section className={sectionCls}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef3f3]">
            <span className="text-3xl" aria-hidden="true">🔒</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#4f4a52]">
            We couldn&apos;t verify access to this receipt.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-[#7b7480]">
            Please open this receipt in the browser you used at checkout. If you
            still can&apos;t access it, contact us for help.
          </p>
          {validRef && (
            <p className="mt-4 text-xs text-[#9b9298]">Reference: {validRef}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 space-y-4"
        >
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 font-bold text-white transition-all duration-300 hover:bg-[#1ebe59] hover:scale-[1.01]"
          >
            <MessageCircle size={20} />
            Contact us about this order
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-full border border-[#4f4a52]/20 py-5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </section>
    );
  }

  // ── Invalid reference ─────────────────────────────────────────────────────────
  if (confirmation.status === "invalid_ref") {
    const contactUrl = buildContactUrl(
      "Hi Maison Skye & Rose! 🌸\n\nI need help finding my order receipt. Could you assist me?"
    );
    return (
      <section className={sectionCls}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef3f3]">
            <span className="text-3xl" aria-hidden="true">🔗</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#4f4a52]">
            This doesn&apos;t look like a valid receipt link.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-[#7b7480]">
            Please use the receipt link from your order confirmation. If you need
            help finding your order, contact us.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 space-y-4"
        >
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 font-bold text-white transition-all duration-300 hover:bg-[#1ebe59] hover:scale-[1.01]"
          >
            <MessageCircle size={20} />
            Contact us
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-full border border-[#4f4a52]/20 py-5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </section>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────────
  if (confirmation.status === "not_found") {
    const contactUrl = buildContactUrl(
      `Hi Maison Skye & Rose! 🌸\n\nI'm looking for my order receipt${validRef ? ` for ${validRef}` : ""} but it couldn't be found. Could you help me?`
    );
    return (
      <section className={sectionCls}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef3f3]">
            <span className="text-3xl" aria-hidden="true">🔍</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#4f4a52]">
            We couldn&apos;t find this receipt.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-[#7b7480]">
            The receipt link you followed doesn&apos;t match any order in our
            system. Please check the link, or contact us for help.
          </p>
          {validRef && (
            <p className="mt-4 text-xs text-[#9b9298]">Reference: {validRef}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 space-y-4"
        >
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 font-bold text-white transition-all duration-300 hover:bg-[#1ebe59] hover:scale-[1.01]"
          >
            <MessageCircle size={20} />
            Contact us
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-full border border-[#4f4a52]/20 py-5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </section>
    );
  }

  // ── Network / server error ────────────────────────────────────────────────────
  if (confirmation.status === "network_error" || confirmation.status === "server_error") {
    const contactUrl = buildContactUrl(
      `Hi Maison Skye & Rose! 🌸\n\nI'm having trouble loading my order receipt${validRef ? ` for ${validRef}` : ""}. Could you help me?`
    );
    return (
      <section className={sectionCls}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef3f3]">
            <span className="text-3xl" aria-hidden="true">⚠️</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#4f4a52]">
            We couldn&apos;t load your order details.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-[#7b7480]">
            There was a problem loading your receipt. Please try again, or
            contact us if the problem continues.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 space-y-4"
        >
          <button
            onClick={handleRetry}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#4f4a52] py-5 font-bold text-white transition-all duration-300 hover:bg-[#3d3840] hover:scale-[1.01]"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 font-bold text-white transition-all duration-300 hover:bg-[#1ebe59] hover:scale-[1.01]"
          >
            <MessageCircle size={20} />
            Contact us
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-full border border-[#4f4a52]/20 py-5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </section>
    );
  }

  // ── Confirmed ────────────────────────────────────────────────────────────────
  // confirmation.status === "confirmed"

  const fulfilmentMode: FulfilmentMode = getFulfilmentMode(confirmation.province);

  const whatsappMessage = encodeURIComponent(
    `Hi Maison Skye & Rose! 🌸\n\nI've placed an order and am sending proof of payment.\n\nOrder Reference: ${orderRef}\nAmount: R${confirmation.total.toFixed(2)}\n\nPlease find my proof of payment attached. Thank you!`
  );
  const whatsappUrl = `https://wa.me/${brand.social.whatsappNumber}?text=${whatsappMessage}`;

  const bankingRows = [
    { label: "Bank",             value: BANKING_DETAILS.bank,          copyable: false, highlight: false },
    { label: "Account Name",     value: BANKING_DETAILS.accountName,   copyable: false, highlight: false },
    { label: "Account Number",   value: BANKING_DETAILS.accountNumber, copyable: true,  highlight: false },
    { label: "Account Type",     value: BANKING_DETAILS.accountType,   copyable: false, highlight: false },
    { label: "Branch Code",      value: BANKING_DETAILS.branchCode,    copyable: true,  highlight: false },
    { label: "Payment Reference",value: orderRef,                      copyable: true,  highlight: true  },
  ];

  return (
    <section className={sectionCls}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#dff6e4]">
          <span className="text-4xl" aria-hidden="true">✓</span>
        </div>
        <p className="text-xs uppercase tracking-[0.45em] text-[#7bb78a]">
          Order Confirmed
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-[#4f4a52] md:text-5xl">
          Your Order<br />Is Confirmed
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#7b7480]">
          We&apos;re grateful for your trust. Your order is now in our care —
          complete the payment details below and send us proof via WhatsApp,
          and we&apos;ll take care of everything from there.
        </p>
      </motion.div>

      {/* What Happens Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#7bb78a]">
          What Happens Next
        </p>
        <div className="mt-5 space-y-4">
          {[
            "Complete your EFT using the banking details below.",
            "Send us proof of payment via WhatsApp — the button is ready for you.",
            fulfilmentMode === "collection"
              ? "We confirm your payment and contact you to arrange collection."
              : fulfilmentMode === "delivery"
                ? "We confirm your payment and arrange delivery with care."
                : "We confirm your payment and will be in touch.",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dff6e4] text-xs font-bold text-[#7bb78a]">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-[#7b7480]">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 rounded-[28px] bg-white p-7 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
          Order Reference
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-2xl font-black tracking-[-0.02em] text-[#4f4a52]">
            {orderRef}
          </span>
          <CopyButton value={orderRef} />
        </div>

        {/* Amount Due — sourced from the server, never from the URL */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">Amount Due</p>
            <p className="mt-0.5 text-2xl font-black text-[#4f4a52]">
              R{confirmation.total.toFixed(2)}
            </p>
          </div>
          <CopyButton value={confirmation.total.toFixed(2)} />
        </div>
      </motion.div>

      {/* Banking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-5 rounded-[28px] bg-white p-7 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
          Banking Details
        </p>
        <div className="mt-5 space-y-3">
          {bankingRows.map(({ label, value, copyable, highlight }) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 ${
                highlight ? "border border-[#e8dfd6] bg-[#faf7f3]" : "bg-[#faf9f8]"
              }`}
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">{label}</p>
                <p className={`mt-0.5 truncate text-sm font-bold ${highlight ? "text-[#d89ca4]" : "text-[#4f4a52]"}`}>
                  {value}
                </p>
              </div>
              {copyable && <CopyButton value={value} />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 space-y-4"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 font-bold text-white transition-all duration-300 hover:bg-[#1ebe59] hover:scale-[1.01]"
        >
          <MessageCircle size={20} />
          Send Proof of Payment via WhatsApp
        </a>

        <Link
          href="/"
          className="flex w-full items-center justify-center rounded-full border border-[#4f4a52]/20 py-5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
        >
          Continue Shopping
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-center text-xs leading-relaxed text-[#9b9298]"
      >
        {fulfilmentMode === "collection"
          ? "Please complete your payment within 24 hours to secure your order. Once confirmed, we'll be in touch to arrange your collection."
          : fulfilmentMode === "delivery"
            ? "Please complete your payment within 24 hours to secure your order. Once confirmed, we'll be in touch to arrange delivery."
            : "Please complete your payment within 24 hours to secure your order. Once confirmed, we'll be in touch."
        }
      </motion.p>

    </section>
  );
}

// Reads the URL reference and passes it as a prop so the receipt component
// is keyed by reference. When orderRef changes (client-side navigation), React
// unmounts the old instance and mounts a fresh one — clearing confirmation
// state, retryTrigger and the recordPurchase effect before B's fetch begins.
function EFTConfirmationWrapper() {
  const searchParams = useSearchParams();
  const orderRef     = searchParams.get("ref") ?? "";
  return <EFTConfirmationContent key={orderRef} orderRef={orderRef} />;
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#4f4a52]">
      <Navbar />
      <Suspense
        fallback={
          <section className="flex min-h-[70vh] items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-[#d89ca4]/30" />
          </section>
        }
      >
        <EFTConfirmationWrapper />
      </Suspense>
    </main>
  );
}
