import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiImage, FiUser, FiCalendar, FiArrowRight, FiShield } from 'react-icons/fi';

const MOCK_GALLERY = [
  {
    id: 'RES-001',
    title: 'Pothole Repair - MG Road',
    category: 'Road',
    location: 'MG Road, Pune',
    reporter: 'Ravi S.',
    date: 'Oct 12, 2023',
    beforeImg: 'https://images.unsplash.com/photo-1544980766-733519be6107?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1621242044839-207038562305?q=80&w=800&auto=format&fit=crop',
    description: 'The major pothole that was causing accidents has been completely leveled and resurfaced.',
    resolvedProof: {
      details: 'Department workers spent 4 hours resurfacing this section using high-durability cold-mix asphalt. The area is now smooth and safe for heavy traffic.',
      verifiedBy: 'M. Kulkarni (Chief Engineer)',
      proofImages: [
        'https://images.unsplash.com/photo-1621242044839-207038562305?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=800&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'RES-002',
    title: 'Illegal Garbage Clearing',
    category: 'Waste',
    location: 'Kothrud, Pune',
    reporter: 'Anita M.',
    date: 'Oct 15, 2023',
    beforeImg: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    description: 'The dump site has been cleared, sanitized, and new "No Dumping" signs installed.',
    resolvedProof: {
      details: 'The site was cleared of 2 tons of waste. We have installed CCTV cameras to prevent future illegal dumping and converted the area into a small community garden.',
      verifiedBy: 'S. Patil (Sanitation Officer)',
      proofImages: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'RES-003',
    title: 'Street Light Restored',
    category: 'Electricity',
    location: 'Baner, Pune',
    reporter: 'Vikram K.',
    date: 'Oct 20, 2023',
    beforeImg: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=800&auto=format&fit=crop',
    description: 'Fixed non-functional solar street lights after reported wiring theft.',
    resolvedProof: {
      details: 'Wiring replaced with theft-resistant underground cabling. All 12 solar panels were cleaned and the battery units were upgraded for longer backup.',
      verifiedBy: 'J. Deshmukh (Electrical Supervisor)',
      proofImages: [
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548567041-102573266292?q=80&w=800&auto=format&fit=crop'
      ]
    }
  }
];

export default function ResolutionGallery() {
  return (
    <div className="page-wrapper">
      <div className="page-container max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">📸 Resolution Gallery</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Witness the transformation. See how citizen reports are turning into real-world fixes, building trust one issue at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {MOCK_GALLERY.map((item, idx) => (
            <div key={item.id} className="card group animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Images Container */}
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={item.beforeImg} alt="Before" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Before</div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={item.afterImg} alt="After" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">After</div>
                  </div>
                </div>

                {/* Details Container */}
                <div className="lg:w-1/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-resolved">
                      <FiCheckCircle size={12} /> Resolved
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{item.id}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
                    <div className="bg-civic-500/5 border border-civic-500/20 rounded-xl p-4">
                      <p className="text-civic-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FiShield size={12} /> Resolved Proof
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed mb-3 italic">
                        "{item.resolvedProof.details}"
                      </p>
                      <div className="flex gap-2 mb-3">
                        {item.resolvedProof.proofImages.map((img, i) => (
                          <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700">
                            <img src={img} alt="Proof" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-500 text-[10px] font-medium">
                        Verified by: <span className="text-slate-300">{item.resolvedProof.verifiedBy}</span>
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <FiMapPin className="text-civic-400" size={14} />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <FiUser className="text-civic-400" size={14} />
                        Fixed thanks to <span className="text-white font-semibold">@{item.reporter}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <FiCalendar className="text-civic-400" size={14} />
                        Completed on {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gallery Footer */}
        <div className="mt-20 text-center animate-fade-in">
          <div className="inline-block p-1 bg-gradient-to-r from-civic-500 to-sky-500 rounded-2xl mb-6">
            <div className="bg-slate-900 rounded-[14px] px-8 py-10">
              <h2 className="text-2xl font-bold text-white mb-2">Your report could be next!</h2>
              <p className="text-slate-400 mb-6">Join thousands of citizens improving their city today.</p>
              <Link to="/report" className="btn-primary inline-flex items-center gap-2">
                Report an Issue <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
