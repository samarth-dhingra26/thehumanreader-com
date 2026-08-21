export const FORM_ENDPOINTS = {
  scoreRequest: process.env.NEXT_PUBLIC_SCORE_FORM_ENDPOINT ?? "",
  paragraphReview: process.env.NEXT_PUBLIC_PARAGRAPH_FORM_ENDPOINT ?? "",
} as const;

export const CONTACT_EMAIL = "hello@thehumanreader.com";

// Update once a legal entity (LLC/DBA) is formed.
export const LEGAL_ENTITY_NAME = "The Human Reader";
export const LEGAL_EFFECTIVE_DATE = "August 21, 2026";
