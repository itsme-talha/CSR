import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col font-sans transition-colors duration-500 ease-in-out">
      
      {/* 1. ABOUT HERO SECTION */}
      <section className="bg-brand-dark text-white py-16 md:py-24 transition-colors duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Hamara Maqsad, <span className="text-brand-primary transition-colors duration-500">Aapka Mustaqbil</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Charity Hub ek soch hai, ek aesa raasta jahan taleem hasil karne wale students ko mali (financial) pareshaniyo ka samna na karna paray. Hum donors aur deserving students ke darmiyan ek shafaf (transparent) pul (bridge) banate hain.
          </p>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="py-16 md:py-24 bg-white transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Hamara mission bohat simple hai: Har us student tak madad pohanchana jo fees, hostel dues, ya medical emergencies ki wajah se apni parhai chhorne par majboor hai. Hum chahte hain ke koi bhi bright mind sirf paiso ki kami ki wajah se zaya na ho.
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-10">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Ek aesi digital community build karna jahan log aasani se, mukammal bharosay ke sath contribute kar sakein, aur jahan har transaction 100% verified aur secure ho.
              </p>
            </div>
            <div className="bg-brand-light p-8 rounded-2xl border border-brand-primary/20 shadow-inner transition-colors duration-500">
              <h3 className="text-2xl font-bold text-brand-dark mb-6 transition-colors duration-500">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-brand-action text-xl transition-colors duration-500">✓</span>
                  <div>
                    <strong className="block text-slate-900">Transparency</strong>
                    <span className="text-slate-500 text-sm">Donors ko pata hota hai unka paisa kahan aur kisko gaya.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-action text-xl transition-colors duration-500">✓</span>
                  <div>
                    <strong className="block text-slate-900">Empathy</strong>
                    <span className="text-slate-500 text-sm">Hum students ki privacy aur self-respect ka mukammal khayal rakhte hain.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-action text-xl transition-colors duration-500">✓</span>
                  <div>
                    <strong className="block text-slate-900">Efficiency</strong>
                    <span className="text-slate-500 text-sm">Tez tareen verification aur funds disbursement system.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="bg-brand-light py-16 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 transition-colors duration-500">Is Safar Mein Hamara Saath Dein</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Aapki choti si madad kisi student ka poora mustaqbil badal sakti hai. Aaj hi register karein aur ek achay kaam ka hissa banein.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="px-6 py-3 bg-brand-action text-white font-bold rounded-lg hover:opacity-90 transition-all duration-500 shadow-md">
              Join as a Donor
            </Link>
            <Link href="/register" className="px-6 py-3 bg-white text-brand-action border border-brand-action font-bold rounded-lg hover:bg-gray-50 transition-all duration-500 shadow-sm">
              Apply for Help
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}