import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logger } from "@/lib/logger";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = "404 — OranAI";
    logger.warn("404 Error: User attempted to access non-existent route", {
      pathname,
      timestamp: new Date().toISOString(),
    });
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
}
