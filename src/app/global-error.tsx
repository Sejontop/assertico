"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "16px"
          }}
        >
          <h1 style={{ fontSize: "18px", fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "14px", color: "#888" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
