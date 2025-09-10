import React from "react";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AppBar from "@/components/AppBar";

const faqs = [
  {
    question: "How do I check in as a visitor?",
    answer:
      "To check in, go to the main kiosk or front desk, enter your details, and follow the on-screen instructions.",
  },
  {
    question: "Do I need an appointment to visit?",
    answer:
      "Some locations require appointments. Please check with the organization or your host before visiting.",
  },
  {
    question: "Can I pre-register my visit?",
    answer:
      "Yes, if your host has sent you a pre-registration link, you can fill in your information ahead of time.",
  },
  {
    question: "What should I bring for my visit?",
    answer:
      "Typically, a valid photo ID is required. Your host will inform you if anything else is needed.",
  },
];

export default function HelpCenter() {
  return (
    <div>
      <AppBar />
      <div className="max-w-5xl px-6 py-12 mx-auto">
        <h1 className="mb-10 text-5xl font-extrabold tracking-tight text-center text-gray-900">
          Visitor Help Center
        </h1>

        <div className="relative max-w-xl mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search visitor help topics..."
            className="py-3 pl-12 pr-4 border border-gray-200 rounded-full shadow-lg"
          />
          <Search className="absolute w-5 h-5 text-gray-500 top-3 left-4" />
        </div>

        <Accordion type="single" collapsible className="space-y-5">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <Card className="transition border border-gray-100 shadow-md rounded-3xl hover:shadow-lg">
                <CardContent className="p-6">
                  <summary className="text-xl font-semibold text-gray-800 cursor-pointer">
                    {faq.question}
                  </summary>
                  <div className="mt-3 text-base leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                </CardContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="p-10 mt-16 text-center shadow-inner bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">
            Still need help?
          </h2>
          <p className="mb-6 text-base text-gray-600">
            Reach out to the front desk or your host for immediate assistance.
          </p>
          <Button className="px-8 py-3 text-white transition bg-blue-600 rounded-full hover:bg-blue-700">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
