"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { resendConfirmationEmail } from "@/app/(auth)/actions";

export function ResendEmailButton() {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleResend = () => {
    // Attempt to grab the email directly from the email input on the page
    const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]');
    let email = emailInput?.value.trim();

    if (!email) {
      const prompted = window.prompt("Enter your email to receive a new confirmation link:");
      if (!prompted) return;
      email = prompted.trim();
    }

    startTransition(async () => {
      const result = await resendConfirmationEmail(email);
      if (result.error) {
        setIsError(true);
        setStatusMessage(result.error);
      } else if (result.success) {
        setIsError(false);
        setStatusMessage(result.success);
      }
    });
  };

  return (
    <div className="pt-2 flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="link"
        className="p-0 h-auto text-xs text-sky-400 hover:text-sky-300 underline"
        disabled={isPending}
        onClick={handleResend}
      >
        {isPending ? "Sending link..." : "Resend confirmation email"}
      </Button>
      {statusMessage && (
        <span className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}>
          {statusMessage}
        </span>
      )}
    </div>
  );
}