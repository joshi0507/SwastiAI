
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 mb-6">Our Mission</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            At SwasthAI, we believe that healthcare is a fundamental right. Our goal is to democratize access to world-class medical expertise through artificial intelligence and seamless digital workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-sky-600">The Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              We envision a world where patients in rural areas can connect with specialists in major cities instantly, where AI assists in early detection of symptoms, and where medical records are never lost.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-emerald-600">The Values</h2>
            <p className="text-slate-600 leading-relaxed">
              Integrity, Accessibility, and Innovation drive every line of code we write. We prioritize patient privacy and data security above all else, using state-of-the-art encryption.
            </p>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: "Dr. Sarah Chen", role: "Chief Medical Officer", img: "https://picsum.photos/200/200?random=1" },
              { name: "James Wilson", role: "Chief Technology Officer", img: "https://picsum.photos/200/200?random=2" },
              { name: "Ananya Rao", role: "Head of Operations", img: "https://picsum.photos/200/200?random=3" }
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="mb-4 relative inline-block">
                  <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-slate-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
