"use client";

import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";

interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [headingRef, headingVisible] = useScrollReveal<HTMLHeadingElement>();
  const [faqsRef, faqsVisible] = useScrollRevealGroup(faqs.length);

  return (
    <section
      className="px-6 py-24 bg-[var(--surface-container-low)]/50"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          ref={headingRef}
          id="faq-heading"
          className={`font-[var(--font-headline)] text-3xl md:text-5xl tracking-tight mb-12 text-balance text-center text-[var(--on-surface)] transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Perguntas frequentes
        </h2>

        <div ref={faqsRef} className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className={`group bg-[var(--surface-container)] rounded-xl border border-[var(--outline-variant)]/10 overflow-hidden transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--primary)]/20 hover:shadow-[0_4px_16px_-4px_rgba(149,170,255,0.15)] ${faqsVisible[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="font-[var(--font-headline)] font-semibold text-lg text-[var(--on-surface)] pr-4">
                  {faq.question}
                </h3>
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-open:rotate-45 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 animate-fade-in-up">
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
