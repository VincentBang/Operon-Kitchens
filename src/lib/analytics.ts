export type AnalyticsEventName =
  | 'estimate_start_click'
  | 'quote_review_start_click'
  | 'wizard_step_view'
  | 'wizard_step_complete'
  | 'file_upload_added'
  | 'estimate_summary_view'
  | 'quote_review_submit'
  | 'area_cta_click'
  | 'chatbot_open'
  | 'chatbot_cta_click'
  | 'lead_score_generated';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  description: string;
  properties: string[];
}

export const analyticsEvents: AnalyticsEvent[] = [
  { name: 'estimate_start_click', description: 'Primary estimate CTA selected.', properties: ['route', 'cta_location'] },
  { name: 'quote_review_start_click', description: 'Quote review CTA selected.', properties: ['route', 'cta_location'] },
  { name: 'wizard_step_view', description: 'Wizard step becomes visible.', properties: ['step_index', 'step_name'] },
  { name: 'wizard_step_complete', description: 'Wizard step is completed.', properties: ['step_index', 'step_name'] },
  { name: 'file_upload_added', description: 'Customer adds a photo, plan or quote file.', properties: ['file_category', 'route'] },
  { name: 'estimate_summary_view', description: 'Estimate summary is shown.', properties: ['confidence_label', 'manual_review_count'] },
  { name: 'quote_review_submit', description: 'Structured quote review intake is submitted.', properties: ['readiness_label', 'file_count'] },
  { name: 'area_cta_click', description: 'Suburb or area page CTA is selected.', properties: ['area', 'cta_type'] },
  { name: 'chatbot_open', description: 'Chatbot is opened.', properties: ['route'] },
  { name: 'chatbot_cta_click', description: 'Chatbot route CTA is selected.', properties: ['intent', 'href'] },
  { name: 'lead_score_generated', description: 'Kitchen lead quality is calculated after estimate summary.', properties: ['lead_quality', 'confidence_label', 'review_risk_label'] },
];

export function trackKitchenEvent(name: AnalyticsEventName, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('operon-kitchens:analytics', { detail: { name, properties } }));
}
