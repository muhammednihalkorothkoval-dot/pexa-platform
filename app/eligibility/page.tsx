"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

type ScoreMap = Record<string, Record<string, number>>;

export default function EligibilityPage() {
  const searchParams = useSearchParams();
  const initialName = searchParams?.get("name") ?? "";
  const initialPhone = searchParams?.get("phone") ?? "";

  const [form, setForm] = useState({
    name: initialName,
    email: "",
    phone: initialPhone,
    intent: "",
    hours: "",
    experience: "",
    consistency: "",
    mindset: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getScore = () => {
    let score = 0;

    const scoring: ScoreMap = {
      intent: {
        income: 3,
        longterm: 3,
        explore: 0,
      },
      hours: {
        full: 3,
        part: 2,
        low: 0,
      },
      experience: {
        field: 2,
        service: 1,
        none: 0,
      },
      consistency: {
        yes: 3,
        maybe: 1,
        no: 0,
      },
      mindset: {
        push: 3,
        wait: 0,
      },
    };

    score += scoring.intent[form.intent] || 0;
    score += scoring.hours[form.hours] || 0;
    score += scoring.experience[form.experience] || 0;
    score += scoring.consistency[form.consistency] || 0;
    score += scoring.mindset[form.mindset] || 0;

    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const score = getScore();

    let status = "failed";

    if (score >= 10) status = "passed";
    else if (score >= 6) status = "review";

    const { error } = await supabase
      .from("eligibility_submissions")
      .insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          intent: form.intent,
          hours: form.hours,
          experience: form.experience,
          consistency: form.consistency,
          mindset: form.mindset,
          score,
          status,
        },
      ]);

    if (error) {
      console.error("Eligibility submission failed:", error);
      const isMissingTable = error.code === "PGRST205";
      setMessage(
        isMissingTable
          ? "Submission failed: the eligibility_submissions table is missing in Supabase."
          : `Submission failed: ${error.message}`
      );
      setLoading(false);
      return;
    }

    if (status === "passed") {
      const { error: approvedUserError } = await supabase
        .from("approved_users")
        .upsert(
          [
            {
              email: form.email,
              status: "approved",
            },
          ],
          { onConflict: "email", ignoreDuplicates: true }
        );

      if (approvedUserError) {
        console.warn("Approved user insert warning:", approvedUserError);
      }

      console.log("TRAINING WEBHOOK");
      console.log(
        "WEBHOOK URL",
        "https://n8n-production-303d4.up.railway.app/webhook/training-invite"
      );

      try {
        const response = await fetch(
          "https://n8n-production-303d4.up.railway.app/webhook/training-invite",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              phone: form.phone,
              email: form.email,
              score,
              status,
            }),
          }
        );

        if (!response.ok) {
          console.warn("TRAINING WEBHOOK WARNING", response.status);
        }
      } catch (webhookError) {
        console.warn("TRAINING WEBHOOK WARNING", webhookError);
      }

      setMessage("You are eligible. We will contact you for training.");
    } else if (status === "review") {
      setMessage("We will review your application.");
    } else {
      console.log("REJECTION WEBHOOK");
      console.log(
        "WEBHOOK URL",
        "https://n8n-production-303d4.up.railway.app/webhook/rejection-mail"
      );

      try {
        const response = await fetch(
          "https://n8n-production-303d4.up.railway.app/webhook/rejection-mail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              phone: form.phone,
              email: form.email,
              score,
              status,
            }),
          }
        );

        if (!response.ok) {
          console.warn("REJECTION WEBHOOK WARNING", response.status);
        }
      } catch (webhookError) {
        console.warn("REJECTION WEBHOOK WARNING", webhookError);
      }

      setMessage("Not eligible at the moment.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Eligibility Check
      </h1>

      {message && (
        <p className="mb-6 rounded border border-white/20 bg-white/10 px-4 py-3 text-center text-sm text-white">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          name="name"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select name="intent" required onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Why do you want to join?</option>
          <option value="income">Need stable income immediately</option>
          <option value="longterm">Want long-term earning</option>
          <option value="explore">Just exploring</option>
        </select>

        <select name="hours" required onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Daily working hours</option>
          <option value="full">6+ hours</option>
          <option value="part">3–5 hours</option>
          <option value="low">Less than 3 hours</option>
        </select>

        <select name="experience" required onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Past experience</option>
          <option value="field">Delivery / field job</option>
          <option value="service">Customer service</option>
          <option value="none">No experience</option>
        </select>

        <select name="consistency" required onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">Can you work 6 days/week?</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe</option>
          <option value="no">No</option>
        </select>

        <select name="mindset" required onChange={handleChange} className="w-full border p-3 rounded">
          <option value="">If bookings are low?</option>
          <option value="push">Improve & push</option>
          <option value="wait">Wait</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}
