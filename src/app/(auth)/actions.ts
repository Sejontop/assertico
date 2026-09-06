// "use server";

// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { loginSchema, signupSchema } from "@/lib/validators";
// import type { AuthActionState } from "@/lib/auth-types";
// import { getCurrentUser } from "@/lib/auth";

// export async function login(
//   _prevState: AuthActionState,
//   formData: FormData
// ): Promise<AuthActionState> {
//   const parsed = loginSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   if (!parsed.success) {
//     return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
//   }

//   const supabase = await createClient();

//   // const { error } = await supabase.auth.signInWithPassword(parsed.data);
//   const { data, error } = await supabase.auth.signInWithPassword(
// parsed.data
// );

//   if (error) {
//     return { error: error.message };
//   }

//   const user = data.user;

// if (!user) {
// return { error: "Unable to retrieve user after login" };
// }

// const appUser = await getCurrentUser();

// if (appUser?.role === "ADMIN") {
//   redirect("/admin");
// }

//   redirect("/dashboard");
// }

// export async function signup(
//   _prevState: AuthActionState,
//   formData: FormData
// ): Promise<AuthActionState> {
//   const parsed = signupSchema.safeParse({
//     email: formData.get("email"), 
//     password: formData.get("password"),
//   });

//   if (!parsed.success) {
//     return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
//   }

//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.signUp({
//     email: parsed.data.email,
//     password: parsed.data.password,
//     options: {
//       emailRedirectTo: `${
//         process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
//       }/auth/callback`,
//     },
//   });

//   if (error) {
//     return { error: error.message };
//   }

  

//   if (data.session) {
//     redirect("/dashboard");
//   }

//   redirect("/login?message=check-email");
// }

// export async function logout(): Promise<void> {
//   const supabase = await createClient();
//   await supabase.auth.signOut();
//   redirect("/login");
// }

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validators";
import type { AuthActionState } from "@/lib/auth-types";
import { getCurrentUser } from "@/lib/auth";

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  const user = data.user;

  if (!user) {
    return { error: "Unable to retrieve user after login" };
  }

  const appUser = await getCurrentUser();

  if (appUser?.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/login?message=check-email");
}

export async function resendConfirmationEmail(
  email: string
): Promise<{ success?: string; error?: string }> {
  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "A new confirmation email has been sent!" };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}