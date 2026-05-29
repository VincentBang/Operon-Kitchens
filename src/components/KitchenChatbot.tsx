import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { trackKitchenEvent } from '@/lib/analytics';
import { getKitchenChatbotResponse, kitchenChatbotWelcome, KitchenChatbotResponse } from '@/lib/chatbot';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  actions?: string[];
  requiresReview?: boolean;
}

const quickPrompts = [
  'What measurements should I prepare?',
  'Can I use engineered stone?',
  'How does deposit and HBC work?',
  'Can you review my existing quote?',
];

function createAssistantMessage(response: KitchenChatbotResponse): ChatMessage {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: 'assistant',
    text: response.text,
    actions: response.actions,
    requiresReview: response.requiresReview,
  };
}

export default function KitchenChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [currentResponse, setCurrentResponse] = useState<KitchenChatbotResponse>(kitchenChatbotWelcome);
  const [messages, setMessages] = useState<ChatMessage[]>([createAssistantMessage(kitchenChatbotWelcome)]);
  const summary = useMemo(() => {
    if (messages.length <= 1) return 'Ask about scope, materials or next steps.';
    return `${messages.filter((message) => message.role === 'user').length} question(s) asked`;
  }, [messages]);

  useEffect(() => {
    document.body.dataset.kitchenChatbotOpen = open ? 'true' : 'false';
    return () => {
      delete document.body.dataset.kitchenChatbotOpen;
    };
  }, [open]);

  const submitQuestion = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    const response = getKitchenChatbotResponse(cleanQuestion);
    setMessages((previous) => [
      ...previous,
      { id: `user-${Date.now()}`, role: 'user', text: cleanQuestion },
      createAssistantMessage(response),
    ]);
    setCurrentResponse(response);
    setInput('');
    setOpen(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitQuestion(input);
  };

  return (
    <div className="kitchenChatbot" data-open={open ? 'true' : 'false'}>
      <section id="kitchen-chatbot-panel" className="kitchenChatbotPanel" role="dialog" aria-label="Operon Kitchens assistant" aria-hidden={!open}>
        <header className="kitchenChatbotHeader">
          <div>
            <strong>Operon Kitchens assistant</strong>
            <span>Scope, material and quote guidance</span>
          </div>
          <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>x</button>
        </header>

        <div className="kitchenChatbotMessages" aria-live="polite">
          {messages.map((message) => (
            <article className={`kitchenChatbotMessage ${message.role}`} key={message.id}>
              <p>{message.text}</p>
              {message.requiresReview && <small>Needs professional confirmation before decisions are made.</small>}
              {message.actions && message.actions.length > 0 && (
                <ul>
                  {message.actions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div className="kitchenChatbotSummary">
          <strong>Details so far</strong>
          <span>{summary}</span>
        </div>

        <div className="kitchenChatbotQuickPrompts">
          {quickPrompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => submitQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form className="kitchenChatbotInput" onSubmit={handleSubmit}>
          <input
            aria-label="Kitchen assistant input"
            placeholder="Ask about kitchens or quote scope"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>

        <Link className="kitchenChatbotRoute" href={currentResponse.route.href} onClick={() => trackKitchenEvent('chatbot_cta_click', { intent: currentResponse.intent, href: currentResponse.route.href })}>
          {currentResponse.route.label}
        </Link>
      </section>

      <button
        className="kitchenChatbotToggle"
        type="button"
        aria-expanded={open}
        aria-controls="kitchen-chatbot-panel"
        onClick={() => setOpen((value) => {
          const next = !value;
          if (next) trackKitchenEvent('chatbot_open');
          return next;
        })}
      >
        <span>?</span>
        Ask Operon
      </button>
    </div>
  );
}
