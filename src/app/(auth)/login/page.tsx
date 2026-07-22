import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { FormMessage } from "@/components/auth/form-message";

const INFO_MESSAGES: Record<string, string> = {
  "check-email": "Check your inbox to confirm your email before logging in.",
  "auth-error": "That confirmation link is invalid or has expired."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const infoMessage = message ? INFO_MESSAGES[message] : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Log in to continue to Assertico.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {infoMessage ? (
          <FormMessage variant="info">{infoMessage}</FormMessage>
        ) : null}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
