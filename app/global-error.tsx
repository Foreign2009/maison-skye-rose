"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f5f1eb", fontFamily: "sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1.5rem",
            color: "#4f4a52",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#d89ca4",
            }}
          >
            Error
          </p>
          <h1
            style={{
              marginTop: "1rem",
              fontSize: "2.5rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              marginTop: "1.5rem",
              maxWidth: "28rem",
              lineHeight: 1.75,
              color: "#7b7480",
            }}
          >
            A critical error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2.5rem",
              borderRadius: "9999px",
              background: "#d89ca4",
              padding: "1rem 2rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
