import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="w-full flex flex-col font-sans transition-colors duration-500 ease-in-out">
      
      {/* 1. HERO SECTION */}
      <section className="bg-brand-dark text-white py-16 md:py-24 transition-colors duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 transition-colors duration-500">
            Yeh System <span className="text-brand-primary transition-colors duration-500">Kaisay Kaam Karta Hai?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Charity Hub ko istemal karna bohot asaan hai. Chahe aap madad karna chahte hon ya madad hasil karna chahte hon, hamara process 100% transparent aur secure hai.
          </p>
        </div>
      </section>

      {/* 2. FOR BENEFICIARIES (Students) */}
      <section className="py-16 bg-white transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 transition-colors duration-500">For Students (Madad Lene Ke Liye)</h2>
            <div className="w-24 h-1 bg-brand-action mx-auto mt-4 rounded-full transition-colors duration-500"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Register</h3>
              <p className="text-slate-600 text-sm">Apne email ke zariye account banayein aur Beneficiary role select karein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Setup Profile</h3>
              <p className="text-slate-600 text-sm">Apni university, department aur CNIC details system mein enter karein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Request</h3>
              <p className="text-slate-600 text-sm">Fees ya hostel dues ki request banayein aur zaroori documents (Voucher/CNIC) upload karein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">4</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Receive Funds</h3>
              <p className="text-slate-600 text-sm">Admin verification aur campaign mukammal hone par funds directly aapke account mein.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOR DONORS */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 transition-colors duration-500">For Donors (Madad Karne Ke Liye)</h2>
            <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 rounded-full transition-colors duration-500"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Up</h3>
              <p className="text-slate-600 text-sm">Donor account banayein taake aap apni donations ka track rakh sakein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Campaigns</h3>
              <p className="text-slate-600 text-sm">Admin ki taraf se verified aur live campaigns ki list dekhein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Donate</h3>
              <p className="text-slate-600 text-sm">Apni marzi ki amount transfer karein aur receipt upload kar dein.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-white shadow-md transition-colors duration-500">4</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Track Impact</h3>
              <p className="text-slate-600 text-sm">Real-time notifications hasil karein jab campaign mukammal ho jaye.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="bg-white py-16 text-center border-t border-slate-200 transition-colors duration-500">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 transition-colors duration-500">Sab Kuch Samajh Aa Gaya?</h2>
          <Link href="/register" className="inline-block px-8 py-3 bg-brand-action text-white font-bold rounded-full hover:opacity-90 transition-all duration-500 shadow-md text-lg">
            Get Started Now
          </Link>
        </div>
      </section>
      
    </div>
  );
}