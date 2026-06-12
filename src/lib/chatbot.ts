import { answerKitchenPlanningQuestion, PlanningAssistantAnswer } from '@/lib/planningAssistant';

export type KitchenChatbotIntent =
  | 'quote'
  | 'design'
  | 'review'
  | 'materials'
  | 'compliance'
  | 'measurement'
  | 'operator'
  | 'unsupported'
  | 'general';

export interface KitchenChatbotRoute {
  label: string;
  href: string;
}

export interface KitchenChatbotResponse {
  intent: KitchenChatbotIntent;
  text: string;
  actions: string[];
  route: KitchenChatbotRoute;
  requiresReview: boolean;
}

const routeMap: Record<Exclude<KitchenChatbotIntent, 'unsupported' | 'general' | 'operator'>, KitchenChatbotRoute> = {
  quote: { label: 'Start kitchen estimate', href: '/quote' },
  design: { label: 'Prepare for site measure', href: '/site-measure' },
  review: { label: 'Review existing quote', href: '/quote/review' },
  materials: { label: 'Review benchtop and material scope', href: '/kitchen-benchtop-options-after-engineered-stone-ban' },
  compliance: { label: 'Request review', href: '/request-review' },
  measurement: { label: 'Prepare for site measure', href: '/site-measure' },
};

function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

export function classifyKitchenChatbotIntent(input: string): KitchenChatbotIntent {
  const text = input.trim().toLowerCase();
  if (!text) return 'general';
  if (includesAny(text, ['human', 'person', 'call me', 'operator', 'consultant', 'speak to someone', 'talk to someone'])) return 'operator';
  if (includesAny(text, ['cheaper than', 'beat quote', 'beat this quote', 'price match', 'guarantee', 'guaranteed final'])) return 'unsupported';
  if (includesAny(text, ['review my quote', 'existing quote', 'compare quote', 'quote review', 'uploaded quote'])) return 'review';
  if (includesAny(text, ['design', 'planner', 'draw', 'sketch', 'layout'])) return 'design';
  if (includesAny(text, ['engineered stone', 'silica', 'benchtop', 'splashback', 'porcelain', 'laminate', 'material'])) return 'materials';
  if (includesAny(text, ['deposit', 'hbc', 'insurance', 'strata', 'basix', 'dbp', 'approval', 'licensed'])) return 'compliance';
  if (includesAny(text, ['measure', 'measurement', 'millimetre', 'millimeter', 'mm', 'photos', 'plans'])) return 'measurement';
  if (includesAny(text, ['quote', 'estimate', 'budget', 'cost', 'price', 'allowance'])) return 'quote';
  return 'general';
}

function responseFromAnswer(intent: KitchenChatbotIntent, answer: PlanningAssistantAnswer): KitchenChatbotResponse {
  const route =
    intent === 'materials' || intent === 'compliance' || intent === 'measurement' || intent === 'quote' || intent === 'design' || intent === 'review'
      ? routeMap[intent]
      : { label: 'Start kitchen estimate', href: '/quote' };

  return {
    intent,
    text: answer.answer,
    actions: answer.suggestedNextSteps,
    route,
    requiresReview: answer.requiresProfessionalReview,
  };
}

export function getKitchenChatbotResponse(input: string): KitchenChatbotResponse {
  const intent = classifyKitchenChatbotIntent(input);

  if (intent === 'unsupported') {
    return {
      intent,
      text: 'I cannot promise final pricing, beat another quote, or make a legal/compliance decision here. I can help you check whether the kitchen scope is clear enough for professional review.',
      actions: [
        'Compare inclusions and exclusions before comparing totals.',
        'Use the quote review page for an existing written quote.',
        'Use the quote wizard for an Operon Kitchens estimate range.',
      ],
      route: { label: 'Review existing quote', href: '/quote/review' },
      requiresReview: true,
    };
  }

  if (intent === 'operator') {
    return {
      intent,
      text: 'I can help prepare the context for a person to follow up. This is not live chat, but the quote flow can capture your project details for Operon Kitchens review.',
      actions: [
        'Start the quote wizard and add your contact details at the end.',
        'Prepare photos, plans or existing quote details if available.',
        'Use the notes field to explain what you want reviewed.',
      ],
      route: { label: 'Request follow-up through quote', href: '/quote' },
      requiresReview: true,
    };
  }

  if (intent === 'design') {
    return {
      intent,
      text: 'You can sketch the room, place simple kitchen elements and save the plan to attach to your estimate. It helps the reviewer understand shape, appliance positions and access before site measure.',
      actions: [
        'Measure in millimetres where possible.',
        'Add appliance and service locations.',
        'Save the plan before starting or updating the quote.',
      ],
      route: routeMap.design,
      requiresReview: false,
    };
  }

  if (intent === 'review') {
    return {
      intent,
      text: 'The quote review tool is useful when you already have a written quote and want to understand scope clarity, assumptions and missing items. It should not be treated as confirmed price comparison.',
      actions: [
        'Add or describe the existing quote details.',
        'Check whether cabinetry, benchtop, trades, GST and exclusions are visible.',
        'Ask for manual review when scope is unclear.',
      ],
      route: routeMap.review,
      requiresReview: true,
    };
  }

  return responseFromAnswer(intent, answerKitchenPlanningQuestion(input));
}

export const kitchenChatbotWelcome: KitchenChatbotResponse = {
  intent: 'general',
  text: 'Hi, I can help you understand kitchen quote scope, measurements, materials, PC sums, provisional sums, strata prompts and next steps before site measure. I do not provide final pricing or legal advice.',
  actions: [
    'Ask what to prepare before starting an estimate.',
    'Ask what to check in an existing quote.',
    'Ask which details may require site-measure confirmation.',
  ],
  route: { label: 'Start kitchen estimate', href: '/quote' },
  requiresReview: true,
};
