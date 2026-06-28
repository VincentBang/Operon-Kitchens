# Advanced Kitchen Design-Build Tool Data Contracts

Last updated: 23 June 2026

Deployment status: not needed. These are conceptual TypeScript-style contracts only. They do not create production tables or approve migrations.

## Shared Primitives

```ts
type PropertyType = 'house' | 'townhouse' | 'apartment' | 'strataApartment' | 'notSure';
type RenovationStage = 'earlyPlanning' | 'preparingForQuotes' | 'quoteInHand' | 'comparingQuotes' | 'readyForMeasure' | 'notSure';
type YesNoUnsure = 'yes' | 'no' | 'notSure';
type RecommendedPathwayType = 'quote' | 'quoteReview' | 'requestReview' | 'siteMeasure' | 'scopeBuilder';
type ReadinessState = 'gettingStarted' | 'coreContextAdded' | 'moreScopeDetailWouldHelp' | 'readyForNextPlanningStep';
```

## DesignBrief

```ts
interface DesignBrief {
  id: string;
  createdAt: string;
  sourceRoute: '/design-brief';
  suburbOrPostcode: string;
  propertyType: PropertyType;
  occupantRole?: 'ownerOccupier' | 'investor' | 'representative' | 'notSure';
  renovationStage: RenovationStage;
  timingRange?: 'researching' | 'oneToThreeMonths' | 'readySoon' | 'urgent' | 'notSure';
  currentKitchenProblems: string[];
  mustHaveOutcomes: string[];
  preferredLayoutDirection?: 'sameLayout' | 'openToChange' | 'needsAdvice' | 'notSure';
  styleDirection?: string;
  storagePriorities: string[];
  applianceIntentions: string[];
  roughBudgetRange?: string;
  existingQuoteStatus: 'none' | 'oneQuote' | 'multipleQuotes' | 'notSure';
  informationAvailable: {
    measurements: YesNoUnsure;
    roughPlan: YesNoUnsure;
    photos: YesNoUnsure;
    writtenQuote: YesNoUnsure;
    applianceSpecs: YesNoUnsure;
  };
  propertyAndAccess: {
    strataOrApartment: YesNoUnsure;
    liftAccess: YesNoUnsure;
    parkingConcern: YesNoUnsure;
    restrictedWorkHours: YesNoUnsure;
    knownApprovalRequirement: YesNoUnsure;
    knownStructuralChange: YesNoUnsure;
    knownServiceRelocation: YesNoUnsure;
  };
  privacyAcknowledged?: boolean;
}
```

## DesignBriefDraft

```ts
interface DesignBriefDraft {
  draftId: string;
  updatedAt: string;
  currentStep: string;
  value: Partial<DesignBrief>;
  persistenceMode: 'memoryOnly' | 'sessionOnly' | 'serverBacked';
}
```

Drafts must not place private customer data in public URLs. Browser storage, if approved later, should store the minimum necessary data and document the privacy trade-off.

## MissingInformationItem

```ts
interface MissingInformationItem {
  id: string;
  group:
    | 'propertyAndAccess'
    | 'measurementsAndPlans'
    | 'appliancesAndServices'
    | 'scopeAndFinishes'
    | 'quoteAndSiteMeasureReadiness';
  label: string;
  reason: string;
  requiredFor: RecommendedPathwayType[];
  severity: 'helpful' | 'important' | 'reviewRecommended';
}
```

## RecommendedPathway

```ts
interface RecommendedPathway {
  primary: {
    type: RecommendedPathwayType;
    href: '/quote' | '/quote/review' | '/request-review' | '/site-measure';
    label: string;
    reason: string;
  };
  secondary: Array<{
    type: RecommendedPathwayType;
    href: '/quote' | '/quote/review' | '/request-review' | '/site-measure';
    label: string;
    reason: string;
  }>;
  humanReviewRecommended: boolean;
  safetyMessage: 'Site measure and written scope confirmation are required before contract pricing.';
}
```

## KitchenScope

```ts
interface KitchenScope {
  layoutType: 'straight' | 'lShape' | 'uShape' | 'galley' | 'island' | 'peninsula' | 'notSure';
  dimensions: KitchenDimensions;
  zones: KitchenZone[];
  applianceChanges: string[];
  benchtopScope: 'none' | 'replace' | 'new' | 'notSure';
  splashbackScope: 'none' | 'replace' | 'new' | 'notSure';
  demolitionAndRemoval: YesNoUnsure;
  makeGoodWork: YesNoUnsure;
  serviceChanges: ServiceChange[];
  interfaces: {
    walls: YesNoUnsure;
    floors: YesNoUnsure;
    painting: YesNoUnsure;
  };
  accessConstraints: string[];
}
```

## KitchenDimensions

```ts
interface KitchenDimensions {
  roomLengthMm?: number;
  roomWidthMm?: number;
  ceilingHeightMm?: number;
  wallRuns: Array<{
    id: string;
    label: string;
    lengthMm?: number;
    openings?: string;
  }>;
  dimensionsConfidence: 'notProvided' | 'rough' | 'measured' | 'siteMeasureRequired';
}
```

## KitchenZone

```ts
interface KitchenZone {
  id: string;
  type: 'baseCabinets' | 'overheads' | 'tallCabinets' | 'pantry' | 'fridge' | 'cooktop' | 'oven' | 'sink' | 'dishwasher' | 'island' | 'other';
  positionKnown: YesNoUnsure;
  notes?: string;
}
```

## ServiceChange

```ts
interface ServiceChange {
  service: 'plumbing' | 'electrical' | 'gas' | 'ventilation' | 'lighting';
  changeType: 'sameLocation' | 'relocationLikely' | 'upgradeLikely' | 'unknown';
  licensedTradeReviewRequired: boolean;
  notes?: string;
}
```

## AllowanceItem

```ts
interface AllowanceItem {
  id: string;
  category: 'pcSum' | 'provisionalSum' | 'applianceAllowance' | 'benchtopAllowance' | 'tradeAllowance' | 'other';
  label: string;
  amountKnown: YesNoUnsure;
  scopeClear: YesNoUnsure;
  customerQuestion: string;
  riskLevel: 'low' | 'medium' | 'high';
}
```

## RiskFlag

```ts
interface RiskFlag {
  id: string;
  category:
    | 'scope'
    | 'allowance'
    | 'exclusion'
    | 'service'
    | 'access'
    | 'strata'
    | 'contract'
    | 'material'
    | 'siteCondition';
  label: string;
  reason: string;
  customerSafePrompt: string;
  requiresHumanReview: boolean;
}
```

## RiskSummary

```ts
interface RiskSummary {
  overallLabel: 'lowReviewRisk' | 'moderateReviewRisk' | 'humanReviewRecommended';
  flags: RiskFlag[];
  missingInclusions: string[];
  questionsToAsk: string[];
  recommendedPathway: RecommendedPathway;
}
```

## SiteMeasureChecklist

```ts
interface SiteMeasureChecklist {
  measurements: string[];
  access: string[];
  services: string[];
  appliances: string[];
  benchtopAndSplashback: string[];
  strataOrApartment: string[];
  olderProperty: string[];
  customerPreparation: string[];
}
```

## ReportRecord

```ts
interface ReportRecord {
  id: string;
  source:
    | 'designBrief'
    | 'scopeReadiness'
    | 'quoteReview'
    | 'siteMeasurePrep'
    | 'writtenScopeDraft';
  createdAt: string;
  status: 'draft' | 'internalReview' | 'readyForCustomer' | 'sent' | 'archived';
  customerFacingSections: string[];
  internalOnlyNotes?: string;
  humanReviewedBy?: string;
  safetyFooter: 'Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.';
}
```

## AdvancedReviewConsolePayload

Conceptual contract. The local projection helper in `src/lib/advancedReviewConsole.ts` now implements the customer-safe subset of this shape for Phase 5 slice 1. This does not approve persistence, Supabase migrations, Netlify Function changes or admin UI runtime changes.

```ts
interface AdvancedReviewConsolePayload {
  leadId: string;
  source: 'requestReview' | 'designBrief' | 'scopeBuilder' | 'quoteReview';
  createdAt: string;
  designBriefSummary?: string[];
  scopeSummary?: string[];
  allowanceRiskFlags?: RiskFlag[];
  missingInclusions?: string[];
  customerQuestions?: string[];
  siteMeasurePreparation?: string[];
  recommendedOperatorAction:
    | 'review_scope'
    | 'request_missing_information'
    | 'offer_site_measure'
    | 'prepare_quote_review'
    | 'mark_not_ready';
  safetyMessage: 'Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.';
}
```

## AdvancedReviewInternalState

Conceptual only. This may exist later only behind admin-token or stronger admin auth. Phase 5 slice 1 does not implement or persist this internal state.

```ts
interface AdvancedReviewInternalState {
  leadId: string;
  reviewStatus:
    | 'not_started'
    | 'needs_customer_clarification'
    | 'ready_for_manual_review'
    | 'site_measure_recommended'
    | 'written_scope_draft_needed'
    | 'closed';
  operatorNotes?: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
}
```

## Customer-Safe Boundary

These contracts must not expose:

- supplier costs
- internal rates
- margin or markup logic
- hidden pricing logic
- lead score
- lead priority
- admin priority
- internal notes
- service role keys

Internal-only values may exist later only in server/admin contracts and must not be passed into customer-facing components.
