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
