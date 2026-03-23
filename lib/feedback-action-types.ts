/**
 * Shared types + initial state for the feedback Server Action.
 * Kept outside `app/actions/*` because a file with top-level `"use server"`
 * may only export async functions (see Next.js invalid-use-server-value).
 */
export type FeedbackActionState = {
  ok: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    rating?: string;
    feedback?: string;
  };
};

export const initialFeedbackState: FeedbackActionState = {
  ok: false,
  message: "",
};
