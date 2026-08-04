"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../checkout/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkExistingSession() {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace("/admin");
    }

    void checkExistingSession();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage("That email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl sm:p-10">
        <p className="text-center text-sm font-medium uppercase tracking-[0.25em] text-[#D4AF37]">Coffco</p>
        <h1 className="mt-3 text-center text-3xl font-bold">Admin sign in</h1>
        <p className="mt-3 text-center text-gray-400">Use the owner email and password you created in Supabase.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-300">
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-black p-4 outline-none transition focus:border-[#D4AF37]" />
          </label>

          <label className="block text-sm text-gray-300">
            Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-black p-4 outline-none transition focus:border-[#D4AF37]" />
          </label>

          {message && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{message}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
