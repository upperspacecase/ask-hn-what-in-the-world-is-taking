"use client";

import { useState, type FormEvent } from "react";
import { FLAVORS, type FlavorId, type FlavorStatus } from "@/lib/ubuntu";

const STORAGE_KEY = "cve-watch-signup";

type Props = { cveId: string; flavors: FlavorStatus[] | null };

export default function SignupForm({ cveId, flavors }: Props) {
  const [flavor, setFlavor] = useState<FlavorId>("noble-linux");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const options = flavors ?? FLAVORS.map((f) => ({ ...f, status: "", version: "" }));
  const chosen = options.find((f) => f.id === flavor)!;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, flavor, cve: cveId }),
    });
    if (!res.ok) {
      setState("error");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, flavor, cve: cveId }));
    setState("done");
  }

  if (state === "done") {
    return (
      <p className="mt-6 max-w-3xl border-l-4 border-ink-strong pl-4 text-ink-strong">
        Got it. {email} is on the list for {cveId} on {chosen.label}. One email per status
        change: needed, pending, released.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-4xl flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="flavor">
        Release and kernel flavor
      </label>
      <select
        id="flavor"
        value={flavor}
        onChange={(e) => setFlavor(e.target.value as FlavorId)}
        className="h-12 cursor-pointer border-2 border-line bg-surface px-3 text-ink transition-colors duration-150 hover:border-muted focus:outline-none focus-visible:border-ink-strong sm:w-96"
      >
        {options.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
            {f.status ? ` (${f.status}${f.version ? ` ${f.version}` : ""})` : ""}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@yourcompany.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 sm:flex-1 border-2 border-line bg-surface px-3 text-ink transition-colors duration-150 hover:border-muted focus:outline-none focus-visible:border-ink-strong"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-12 cursor-pointer bg-accent px-6 font-semibold text-white transition-colors duration-150 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-strong focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        Track your first CVE
      </button>
      {state === "error" && (
        <p role="alert" className="text-ink-strong sm:self-center">
          Signup failed. Try again.
        </p>
      )}
    </form>
  );
}
