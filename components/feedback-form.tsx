"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitFeedback } from "@/app/actions/feedback";
import {
  initialFeedbackState,
  type FeedbackActionState,
} from "@/lib/feedback-action-types";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit feedback"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-600">{message}</p>;
}

export default function FeedbackForm() {
  const [state, formAction] = useActionState<FeedbackActionState, FormData>(
    submitFeedback,
    initialFeedbackState
  );

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Share your feedback
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your input helps us improve the product experience.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Name <span className="text-rose-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Jane Doe"
          />
          <FieldError message={state.errors?.name} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="you@example.com"
          />
          <FieldError message={state.errors?.email} />
        </div>

        <div>
          <label htmlFor="rating" className="mb-1 block text-sm font-medium text-slate-700">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            defaultValue="5"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <FieldError message={state.errors?.rating} />
        </div>

        <div>
          <label htmlFor="feedback" className="mb-1 block text-sm font-medium text-slate-700">
            Feedback <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows={5}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Tell us what you think..."
          />
          <FieldError message={state.errors?.feedback} />
        </div>

        {state.message ? (
          <p
            role="status"
            className={`rounded-lg px-3 py-2 text-sm ${
              state.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </section>
  );
}
