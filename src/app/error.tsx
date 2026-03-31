"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    logger.error("App route error", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-lg font-medium text-foreground">{t("app.error.title")}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || t("app.error.hint")}
      </p>
      <Button type="button" variant="outline" onClick={() => reset()}>
        {t("app.error.retry")}
      </Button>
    </div>
  );
}
