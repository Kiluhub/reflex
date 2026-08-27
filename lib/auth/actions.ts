"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // Authenticate the user with Supabase Auth.
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // For now, send failed authentication back to login.
  // We'll build proper UI error handling later.
  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  // Successful authentication gets a session cookie,
  // then the user enters the application.
  redirect("/");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  // Destroy the Supabase session.
  await supabase.auth.signOut();

  // Return the user to the login page.
  redirect("/login");
}