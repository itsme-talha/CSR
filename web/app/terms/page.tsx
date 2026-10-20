import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans min-h-screen w-full">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-brand-dark text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-brand-light text-xs font-extrabold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/20">
            Rules & Guidelines
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-base md:text-lg text-brand-light/90 max-w-2xl mx-auto font-medium">
            Please read these simple rules carefully before using CharityHub as a student or a donor.
          </p>
          <p className="text-xs text-slate-400 font-bold mt-6 uppercase tracking-wider">
            Effective Date: October 2026
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
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Agreement to Rules</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            By creating an account on CharityHub, you agree to follow these Terms of Service. Our platform is built on honesty and trust to help deserving students at COMSATS University. Anyone found breaking these rules will have their account permanently blocked.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg">
              2
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Rules for Students (Beneficiaries)</h2>
          </div>
          <ul className="space-y-3 text-sm md:text-base text-slate-600 font-medium list-disc pl-6">
            <li>
              <strong className="text-slate-900">True Information:</strong> All academic and financial details you provide (Registration Number, CGPA, CNIC, and Guardian Income) must be 100% real and accurate.
            </li>
            <li>
              <strong className="text-slate-900">Genuine Documents:</strong> You must upload clear and original photos or PDFs of your unpaid fee challans, student ID card, and CNIC.
            </li>
            <li>
              <strong className="text-slate-900">Zero Tolerance for Fake Proofs:</strong> Uploading edited or fake documents will result in immediate rejection of your application and permanent suspension of your account.
            </li>
            <li>
              <strong className="text-slate-900">Proper Use of Funds:</strong> Financial assistance must only be used for the approved purpose (Tuition Fee, Hostel Dues, Medical, or Transport).
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-lg">
              3
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Rules for Donors</h2>
          </div>
          <ul className="space-y-3 text-sm md:text-base text-slate-600 font-medium list-disc pl-6">
            <li>
              <strong className="text-slate-900">Voluntary Giving:</strong> All donations made on CharityHub are voluntary charity contributions and are non-refundable once disbursed to the student.
            </li>
            <li>
              <strong className="text-slate-900">Valid Receipts:</strong> After transferring funds via Bank, EasyPaisa, or JazzCash, donors must upload a valid payment screenshot and accurate Transaction ID (TID) so the Admin can verify the payment.
            </li>
            <li>
              <strong className="text-slate-900">Fake Receipts:</strong> Submitting fake or duplicate transaction receipts will lead to rejection of the donation record and account termination.
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-lg">
              4
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Admin Verification & Fund Transfer</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            CharityHub Administrators have the right to approve, reject, or ask for more documents for any student request. Once a campaign reaches its target goal, the Admin will transfer the funds and upload the official transfer receipt for full transparency.
          </p>
        </div>

        {/* Bottom Action Box */}
        <div className="bg-brand-light/40 border border-brand-action/20 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Need Clarification?</h3>
            <p className="text-slate-600 text-sm font-medium">
              Feel free to check our FAQs or contact our team if you have any questions.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link 
              href="/faq" 
              className="px-6 py-3 bg-white text-slate-800 border border-slate-200 font-extrabold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
              Read FAQs
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-brand-action text-white font-extrabold rounded-xl shadow-md hover:opacity-90 transition-all text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}