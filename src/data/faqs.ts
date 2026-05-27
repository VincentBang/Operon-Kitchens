export interface Faq {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export const faqs: Faq[] = [
  {
    question: 'Is the online estimate a fixed quote?',
    answer: 'No. It is a planning estimate that shows scope assumptions, exclusions and confidence level. A fixed written quote requires professional review, measurements and confirmed selections.',
    category: 'quotes',
    sortOrder: 10,
  },
  {
    question: 'Why does quote confidence change?',
    answer: 'Confidence improves when measurements, photos, access details and product selections are clear. Layout changes, strata constraints and unknown service locations lower confidence until reviewed.',
    category: 'quotes',
    sortOrder: 20,
  },
  {
    question: 'Can I choose engineered stone?',
    answer: 'Engineered stone containing more than 1% crystalline silica is restricted for new work. The estimator points you toward alternatives such as porcelain, stainless steel, timber, laminate and supplier-confirmed low-silica composites.',
    category: 'compliance',
    sortOrder: 30,
  },
  {
    question: 'When is Home Building Compensation insurance flagged?',
    answer: 'The estimator flags HBC review when a residential project estimate is over $20,000 including GST. Cover should be confirmed before taking money or starting work.',
    category: 'compliance',
    sortOrder: 40,
  },
];
