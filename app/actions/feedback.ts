"use server";

import type { FeedbackActionState } from "@/lib/feedback-action-types";
import { getSupabaseClient } from "@/lib/supabase";

type FieldErrors = NonNullable<FeedbackActionState["errors"]>;

function getTrimmedValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitFeedback(
  _prevState: FeedbackActionState,
  formData: FormData
): Promise<FeedbackActionState> {
  const name = getTrimmedValue(formData, "name");
  const email = getTrimmedValue(formData, "email");
  const feedback = getTrimmedValue(formData, "feedback");
  const ratingRaw = getTrimmedValue(formData, "rating");
  const rating = Number(ratingRaw);

  const errors: FieldErrors = {};

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!feedback) {
    errors.feedback = "Feedback is required.";
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please provide a valid email address.";
    }
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be a number between 1 and 5.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error(
      "Supabase client is not configured. Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return {
      ok: false,
      message:
        "Server configuration is incomplete. Please set Supabase environment variables.",
    };
  }

  const { error } = await supabase.from("feedbacks").insert({
    name,
    email: email || null,
    rating,
    feedback,
  });

  if (error) {
    console.error("Failed to insert feedback", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return {
      ok: false,
      message: "Something went wrong while saving your feedback.",
    };
  }

  return {
    ok: true,
    message: "Thanks for your feedback!",
  };
}
