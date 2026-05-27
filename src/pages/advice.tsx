import { FormEvent, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { answerKitchenPlanningQuestion } from '@/lib/planningAssistant';
import { getLocalizedMessage, supportedLocales, SupportedLocale } from '@/lib/i18n';

const sampleQuestions = [
  'How much deposit should I pay?',
  'Can I use engineered stone?',
  'What measurements should I prepare?',
  'How do I keep the quote within budget?',
];

export default function AdvicePage() {
  const [question, setQuestion] = useState(sampleQuestions[0]);
  const [submittedQuestion, setSubmittedQuestion] = useState(sampleQuestions[0]);
  const [locale, setLocale] = useState<SupportedLocale>('en-AU');
  const answer = useMemo(() => answerKitchenPlanningQuestion(submittedQuestion), [submittedQuestion]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedQuestion(question);
  };

  return (
    <main>
      <Head>
        <title>Kitchen renovation advice | Operon Kitchens</title>
        <meta
          name="description"
          content="Customer-safe kitchen renovation planning guidance for estimates, measurements, compliance prompts, materials and quote review preparation."
        />
      </Head>
      <section className="section">
        <Link href="/" className="textLink">Back to Operon Kitchens</Link>
        <p className="eyebrow">Planning support</p>
        <h1>Kitchen renovation guidance before professional review.</h1>
        <p className="muted">
          Ask a planning question about budget, materials, compliance or measurements. Answers are guidance only and do not replace site review, trade confirmation or legal advice.
        </p>
      </section>

      <section className="section twoColumn">
        <form className="quoteResult" onSubmit={handleSubmit}>
          <h2>Ask a question</h2>
          <label className="field">
            <span>Question</span>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={5} />
          </label>
          <div className="choiceGrid compact">
            {sampleQuestions.map((item) => (
              <button className="button secondary" type="button" key={item} onClick={() => setQuestion(item)}>
                {item}
              </button>
            ))}
          </div>
          <button className="button primary" type="submit">Get guidance</button>
        </form>

        <article className="quoteResult">
          <p className="eyebrow">{answer.topic}</p>
          <h2>Answer</h2>
          <p>{answer.answer}</p>
          <h3>Suggested next steps</h3>
          <ul>
            {answer.suggestedNextSteps.map((step) => <li key={step}>{step}</li>)}
          </ul>
          {answer.requiresProfessionalReview && (
            <p className="warningText">Requires professional review or confirmation before decisions are made.</p>
          )}
        </article>
      </section>

      <section className="section cardGrid">
        <article className="infoCard">
          <h2>Language readiness</h2>
          <p>{getLocalizedMessage(locale, 'estimateNotice')}</p>
          <label className="field">
            <span>Preview language</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>
              {supportedLocales.map((option) => (
                <option key={option.code} value={option.code}>{option.label}</option>
              ))}
            </select>
          </label>
        </article>

        <article className="infoCard">
          <h2>What this guidance can do</h2>
          <p>It can help you prepare better measurements, clearer scope notes and safer questions for professional review.</p>
          <ul>
            <li>Explain planning terms in plain English.</li>
            <li>Point you to estimate or quote review pathways.</li>
            <li>Flag where licensed trades or site review may be needed.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
