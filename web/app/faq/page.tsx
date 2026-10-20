"use client";

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: "Main kaisay donate kar sakta hoon?",
    answer: "Aap 'Campaigns' page par ja kar kisi bhi active campaign ko select karein. Wahan di gayi university ya admin ki bank details par payment bhejein aur apni transaction receipt system mein upload kar dein."
  },
  {
    question: "Kiya mujhe mobile application install karna zaroori hai?",
    answer: "Nahi, aap hamari is website ke zariye bhi asani se donate kar sakte hain aur apna dashboard manage kar sakte hain. Website aur Mobile App dono ek hi system se connected hain."
  },
  {
    question: "Beneficiaries (students) ko kaisay verify kiya jata hai?",
    answer: "Har student ko apni application ke sath CNIC, Student Card, aur Guardian Income proof upload karna hota hai. Hamari admin team in documents ko university record ke sath physically verify karti hai uske baad hi campaign live hoti hai."
  },
  {
    question: "Kiya meri donation ka record mehfooz hai?",
    answer: "Jee haan, aapki tamam transactions ka record aapke Donor Dashboard mein mehfooz rehta hai aur aap kisi bhi waqt apni past receipts download kar sakte hain."
  },
  {
    question: "Agar kisi campaign mein zaroorat se zyada funds aa jayen toh kiya hota hai?",
    answer: "Agar kisi campaign ka target (e.g., Rs. 50,000) poora ho jaye aur mazeed funds aa jayen, toh admin un extra (surplus) funds ko kisi doosri zaroorat-mand active campaign mein adjust kar deta hai."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500 ease-in-out">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight sm:text-5xl transition-colors duration-500">
            Frequently Asked <span className="text-brand-action transition-colors duration-500">Questions</span>
          </h2>
          <p className="mt-4 text-xl text-slate-500">
            Platform ke hawalay se apke zehan mein aane wale aam sawalat ke jawabat.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-primary"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-bold text-brand-dark transition-colors duration-500">{faq.question}</span>
                <span className={`text-brand-action text-2xl transform transition-all duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-brand-light rounded-2xl p-8 border border-brand-primary/20 transition-colors duration-500">
          <h3 className="text-xl font-bold text-brand-dark mb-2 transition-colors duration-500">Aur koi sawal hai?</h3>
          <p className="text-slate-600 mb-6">Agar aapko mazeed maloomat chahiye toh hamari team se rabta karein.</p>
          <Link href="/contact" className="px-6 py-3 bg-brand-action text-white font-bold rounded-lg hover:opacity-90 transition-all duration-500 shadow-sm inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}