"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactFAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50/80 transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gray-400 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-50 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
