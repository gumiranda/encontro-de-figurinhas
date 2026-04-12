interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section
      className="px-6 py-24 bg-[var(--landing-surface-container-low)]/50"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-heading"
          className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-12 text-center text-[var(--landing-on-surface)]"
        >
          Perguntas frequentes
        </h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-[var(--landing-surface-container)] rounded-xl border border-[var(--landing-outline-variant)]/10 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="font-[var(--font-headline)] font-semibold text-lg text-[var(--landing-on-surface)] pr-4">
                  {faq.question}
                </h3>
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--landing-primary)]/10 flex items-center justify-center text-[var(--landing-primary)] group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-[var(--landing-on-surface-variant)] font-[var(--font-body)]">
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
