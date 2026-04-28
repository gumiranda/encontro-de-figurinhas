"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: readonly FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="faq" className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`grid lg:grid-cols-3 gap-3 lg:gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="lg:col-span-1 lg:pr-4">
            <span className="eyebrow">FAQ · AEO</span>
            <h3 className="mt-3 font-bold text-2xl md:text-3xl leading-tight text-pretty text-[#e1e4fa]">
              As perguntas que
              <br />
              os colecionadores fazem.
            </h3>
            <p className="mt-3 text-sm text-[#a6aabf]">
              Estruturado em{" "}
              <span className="font-mono text-[#95aaff]">FAQPage</span> schema
              para featured snippets do Google.
            </p>
          </div>

          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="rounded-xl border border-white/10 px-5 py-1 data-[state=open]:bg-[#95aaff]/[0.04] data-[state=open]:border-[#95aaff]/20 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-base md:text-lg text-[#e1e4fa] hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#a6aabf] leading-relaxed pb-4 faq-answer">
                    {faq.answer}
                    {faq.question.includes("rara") && (
                      <>
                        {" "}
                        <Link
                          href="/selecao/bra"
                          className="text-[#95aaff] underline"
                        >
                          Ver todas as raras da Seleção Brasileira →
                        </Link>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
