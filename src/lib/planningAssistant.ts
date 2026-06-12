export interface PlanningAssistantAnswer {
  topic: 'budget' | 'compliance' | 'materials' | 'measurements' | 'process' | 'general';
  answer: string;
  suggestedNextSteps: string[];
  requiresProfessionalReview: boolean;
}

const fallbackAnswer: PlanningAssistantAnswer = {
  topic: 'general',
  answer: 'Operon Kitchens can help turn early kitchen scope details into an estimate range with assumptions, exclusions and review flags. Price confirmation still needs site measure, selections and professional review.',
  suggestedNextSteps: [
    'Start the quote wizard with the information you have.',
    'Add photos, plans and measurements in millimetres where possible.',
    'Book professional review before relying on the estimate for contract decisions.',
  ],
  requiresProfessionalReview: true,
};

export function answerKitchenPlanningQuestion(question: string): PlanningAssistantAnswer {
  const text = question.trim().toLowerCase();
  if (!text) return fallbackAnswer;

  if (text.includes('deposit') || text.includes('hbc') || text.includes('insurance') || text.includes('contract')) {
    return {
      topic: 'compliance',
      answer: 'For NSW residential kitchen work, the estimate should flag deposit guidance and whether Home Building Compensation review is likely. This is not legal advice; contract terms and HBC documents need confirmation before taking money or starting work.',
      suggestedNextSteps: [
        'Keep any requested deposit at or below the 10% guidance shown in the estimate.',
        'Confirm HBC requirements when the residential project is over $20,000 including GST.',
        'Ask the reviewer to check contract wording before the job proceeds.',
      ],
      requiresProfessionalReview: true,
    };
  }

  if (text.includes('engineered stone') || text.includes('silica') || text.includes('benchtop') || text.includes('splashback')) {
    return {
      topic: 'materials',
      answer: 'The quote flow should steer restricted engineered-stone selections into review and suggest alternatives such as porcelain, stainless steel, timber, laminate or supplier-confirmed low-silica composites.',
      suggestedNextSteps: [
        'Select a supplier-confirmed benchtop and splashback option in the quote wizard.',
        'Ask suppliers to confirm silica and compliance information in writing.',
        'Keep any transition-claim documents attached for manual review.',
      ],
      requiresProfessionalReview: true,
    };
  }

  if (text.includes('measure') || text.includes('measurement') || text.includes('mm') || text.includes('millimetre')) {
    return {
      topic: 'measurements',
      answer: 'Kitchen estimates become clearer when measurements are supplied in millimetres with photos of services, openings, ceiling height, appliances and access points.',
      suggestedNextSteps: [
        'Measure wall runs, ceiling height and key appliance locations in millimetres.',
        'Photograph plumbing, gas, power, switchboard access and any existing damage.',
        'Use the design planner to attach a simple room sketch to the estimate.',
      ],
      requiresProfessionalReview: false,
    };
  }

  if (text.includes('budget') || text.includes('cost') || text.includes('price') || text.includes('allowance')) {
    return {
      topic: 'budget',
      answer: 'The best early budget view is an estimate range with visible inclusions, exclusions and confidence scoring. Avoid treating it as contract pricing until the site and selections are reviewed.',
      suggestedNextSteps: [
        'Separate must-have scope from optional upgrades.',
        'Check the line items for cabinetry, benchtop, trades, access and contingency.',
        'Ask for manual review where confidence is low or approvals are flagged.',
      ],
      requiresProfessionalReview: true,
    };
  }

  if (text.includes('process') || text.includes('next') || text.includes('timeline') || text.includes('review')) {
    return {
      topic: 'process',
      answer: 'A practical kitchen quote process starts with guided intake, then estimate review, then site measure and selection confirmation before written scope confirmation.',
      suggestedNextSteps: [
        'Complete the quote wizard.',
        'Prepare photos, plans or existing quote details for comparison.',
        'Use the review output to identify assumptions, exclusions and manual review flags.',
      ],
      requiresProfessionalReview: false,
    };
  }

  return fallbackAnswer;
}
