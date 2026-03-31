"use client";

/**
 * 根布局级错误边界：须自带 html/body（不经过 RootLayout）。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            background: "#0a0a0a",
            color: "#fafafa",
          }}
        >
          <h1 style={{ fontSize: "1.125rem", fontWeight: 500 }}>Application error</h1>
          <p style={{ fontSize: "0.875rem", opacity: 0.8, maxWidth: "28rem", textAlign: "center" }}>
            {error.message || "A critical error occurred."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #fafafa",
              background: "transparent",
              color: "#fafafa",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
