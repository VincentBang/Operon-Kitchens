# Operon Kitchens Analytics Events

This is a kitchen-only event naming plan. It does not connect to production analytics yet.

| Event | Intended use |
| --- | --- |
| `estimate_start_click` | Track when a visitor chooses the estimate pathway. |
| `quote_review_start_click` | Track when a visitor chooses the existing quote review pathway. |
| `wizard_step_view` | Understand where customers reach in the quote wizard. |
| `wizard_step_complete` | Understand completion/drop-off by wizard step. |
| `file_upload_added` | Measure when photos, plans or quote files are added. |
| `estimate_summary_view` | Track estimate summary reach and confidence bands. |
| `quote_review_submit` | Track structured quote review intake submissions. |
| `area_cta_click` | Measure suburb and area page conversion intent. |
| `chatbot_open` | Track use of the planning assistant widget. |
| `chatbot_cta_click` | Track chatbot handoff to estimate or quote review routes. |
| `lead_score_generated` | Track kitchen-only lead quality bands after estimate summary generation. |

Recommended common properties:
- `route`
- `cta_location`
- `step_index`
- `step_name`
- `confidence_label`
- `manual_review_count`
- `file_category`
- `area`
- `intent`
- `lead_quality`
- `review_risk_label`
