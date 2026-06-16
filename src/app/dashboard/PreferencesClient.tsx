"use client";

import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/types";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const TOPICS = [
  { value: "pokemon", label: "Pokémon" },
  { value: "sports", label: "Sports cards" },
  { value: "psa", label: "PSA grading" },
  { value: "auctions", label: "Auctions" },
  { value: "breaks", label: "Breaks" },
];

interface Props {
  profile: Profile;
}

export default function PreferencesClient({ profile }: Props) {
  const [alertStates, setAlertStates] = useState<string[]>(
    profile?.alert_states ?? [],
  );
  const [topics, setTopics] = useState<string[]>(profile?.topic_prefs ?? []);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const toggleState = (s: string) =>
    setAlertStates((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleTopic = (t: string) =>
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const savePrefs = async () => {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_states: alertStates, topic_prefs: topics }),
    });
    setSaving(false);
    setSavedMsg(res.ok ? "Saved!" : "Failed to save");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-medium mt-2 mb-1">Preferences</h1>
          <p className="text-sm text-muted-foreground">
            Customise alerts and content topics
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-medium mb-2">State Alerts</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Get an email when a new show is added in any of these states
          </p>
          <div className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap gap-2">
              {US_STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleState(s)}
                  className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${
                    alertStates.includes(s)
                      ? "bg-primary text-primary-foreground"
                      : "border border-input hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium mb-2">Topics of Interest</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Personalise blog and chatbot recommendations
          </p>
          <div className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => toggleTopic(t.value)}
                  className={`h-9 px-4 rounded-md text-sm font-medium transition-colors ${
                    topics.includes(t.value)
                      ? "bg-primary text-primary-foreground"
                      : "border border-input hover:bg-accent"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={savePrefs}
            disabled={saving}
            className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save preferences"}
          </button>
          {savedMsg && (
            <span className="text-sm text-muted-foreground">{savedMsg}</span>
          )}
        </div>
      </div>
    </div>
  );
}
