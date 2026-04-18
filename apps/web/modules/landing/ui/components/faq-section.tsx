interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section
      className="px-6 py-24 bg-[var(--surface-container-low)]/50"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-heading"
          className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-12 text-center text-[var(--on-surface)]"
        >
          Perguntas frequentes
        </h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-[var(--surface-container)] rounded-xl border border-[var(--outline-variant)]/10 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="font-[var(--font-headline)] font-semibold text-lg text-[var(--on-surface)] pr-4">
                  {faq.question}
                </h3>
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-[var(--on-surface-variant)] font-[var(--font-body)]">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
