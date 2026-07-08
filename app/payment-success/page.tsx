"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Check, MessageCircle } from "lucide-react";

import Navbar from "../components/Navbar";
import { trackPaymentReturnSuccess } from "../lib/analytics";
import { brand } from "../data/brand";

const BANKING_DETAILS = {
  bank:          process.env.NEXT_PUBLIC_BANK_NAME           ?? "",
  accountName:   process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME   ?? "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "",
  accountType:   process.env.NEXT_PUBLIC_BANK_ACCOUNT_TYPE   ?? "",
  branchCode:    process.env.NEXT_PUBLIC_BANK_BRANCH_CODE    ?? "",
};
const PAYMENT_TRACKED_KEY = "msr_eft_instructions_viewed";

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
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#4f4a52]/20 px-3 py-1.5 text-xs font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
    >
      {copied
        ? <Check size={13} className="text-green-600" />
        : <Copy size={13} />
      }
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function EFTConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef     = searchParams.get("ref")   ?? "—";
  const rawTotal     = parseFloat(searchParams.get("total") ?? "0");
  const totalDisplay = `R${rawTotal.toFixed(2)}`;

  useEffect(() => {
    if (sessionStorage.getItem(PAYMENT_TRACKED_KEY)) return;
    sessionStorage.setItem(PAYMENT_TRACKED_KEY, "1");
    trackPaymentReturnSuccess({});
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hi Maison Skye & Rose! 🌸\n\nI've placed an order and am sending proof of payment.\n\nOrder Reference: ${orderRef}\nAmount: ${totalDisplay}\n\nPlease find my proof of payment attached. Thank you!`
  );
  const whatsappUrl = `https://wa.me/${brand.social.whatsappNumber}?text=${whatsappMessage}`;

  const bankingRows = [
    { label: "Bank",           value: BANKING_DETAILS.bank,          copyable: false, highlight: false },
    { label: "Account Name",   value: BANKING_DETAILS.accountName,   copyable: false, highlight: false },
    { label: "Account Number", value: BANKING_DETAILS.accountNumber, copyable: true,  highlight: false },
    { label: "Account Type",   value: BANKING_DETAILS.accountType,   copyable: false, highlight: false },
    { label: "Branch Code",    value: BANKING_DETAILS.branchCode,    copyable: true,  highlight: false },
    { label: "Payment Reference", value: orderRef,                   copyable: true,  highlight: true  },
  ];

  return (
    <section className="mx-auto max-w-xl px-6 py-16 md:py-24">

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
        <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-[#4f4a52] md:text-5xl">
          Complete Your<br />Payment
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#7b7480]">
          Your order has been reserved. Complete your EFT below and send proof of payment via WhatsApp.
        </p>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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

        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b9298]">Amount Due</p>
            <p className="mt-0.5 text-2xl font-black text-[#4f4a52]">{totalDisplay}</p>
          </div>
          <CopyButton value={rawTotal.toFixed(2)} />
        </div>
      </motion.div>

      {/* Banking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
                highlight
                  ? "border border-[#e8dfd6] bg-[#faf7f3]"
                  : "bg-[#faf9f8]"
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
        transition={{ duration: 0.5, delay: 0.3 }}
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center text-xs leading-5 text-[#9b9298]"
      >
        Your order is reserved for 24 hours. Once payment is confirmed, we'll be in touch to arrange delivery.
      </motion.p>

    </section>
  );
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
        <EFTConfirmationContent />
      </Suspense>
    </main>
  );
}
