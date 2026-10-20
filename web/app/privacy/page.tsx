import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans min-h-screen w-full">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-brand-dark text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-brand-light text-xs font-extrabold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/20">
            Trust & Safety
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-brand-light/90 max-w-2xl mx-auto font-medium">
            Your privacy is very important to us. Learn how CharityHub collects, uses, and protects your personal information.
          </p>
          <p className="text-xs text-slate-400 font-bold mt-6 uppercase tracking-wider">
            Last Updated: October 2026
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Section 1 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand-action flex items-center justify-center font-extrabold text-lg">
              1
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Information We Collect</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium mb-4">
            To keep our platform 100% safe and transparent, we collect basic information depending on your role:
          </p>
          <ul className="space-y-3 text-sm md:text-base text-slate-600 font-medium list-disc pl-6">
            <li>
              <strong className="text-slate-900">For Students (Beneficiaries):</strong> We collect your name, university email, registration number, department, CGPA, CNIC number, guardian details, and verification documents (such as fee vouchers and student cards).
            </li>
            <li>
              <strong className="text-slate-900">For Donors:</strong> We collect your name, email address, donation amounts, transaction reference numbers (TID), and payment receipt screenshots.
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand-action flex items-center justify-center font-extrabold text-lg">
              2
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">How We Use Your Information</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium mb-4">
            We only use your data to run the charity system smoothly and fairly:
          </p>
          <ul className="space-y-3 text-sm md:text-base text-slate-600 font-medium list-disc pl-6">
            <li>To verify that every student applying for help is a real university student.</li>
            <li>To check payment receipts and confirm donations before updating campaign progress.</li>
            <li>To send you real-time notifications about your application status or donation approvals.</li>
            <li>To transfer collected funds safely to the student or university account.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand-action flex items-center justify-center font-extrabold text-lg">
              3
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Protecting Student Dignity & Documents</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            We respect the self-respect and privacy of every student. Your sensitive documents (like your CNIC, guardian income proof, and personal bank details) are <strong className="text-slate-900">strictly private</strong>. Only authorized CharityHub Administrators can view these documents for verification. When a campaign is published for donors, your personal documents are never shown publicly.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand-action flex items-center justify-center font-extrabold text-lg">
              4
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Data Sharing & Security</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            We <strong className="text-slate-900">never sell, rent, or trade</strong> your personal information to any third party. Your data is only shared with official university staff when necessary to verify your enrollment or clear your pending university dues.
          </p>
        </div>

        {/* Bottom Contact Box */}
        <div className="bg-brand-light/40 border border-brand-action/20 p-8 rounded-3xl text-center">
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Have Questions About Your Privacy?</h3>
          <p className="text-slate-600 text-sm font-medium mb-6">
            If you want to update your data or have any concerns, please reach out to our support team.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-3.5 bg-brand-action text-white font-extrabold rounded-xl shadow-md hover:opacity-90 transition-all text-sm"
          >
            Contact Support
          </Link>
        </div>

      </section>
    </div>
  );
}