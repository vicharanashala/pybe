import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import { BookOpen, Rocket, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { startTour } = useTour();

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">

      {/* Banner Box — characters break out of the bottom edge */}
      <div className="relative w-full">

        <div className="bg-[#FFF8E7]/95 w-full border-4 border-black p-8 md:p-10 pb-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative">

          <Sparkles className="absolute top-5 left-5 text-orange-600 rotate-12" size={28} strokeWidth={2.5} />
          <Sparkles className="absolute top-5 right-5 text-orange-600 -rotate-12" size={20} strokeWidth={2.5} />

          <span className="inline-block bg-white border-4 border-black rounded-full px-4 py-1 text-sm font-black uppercase tracking-widest mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            A Python Story
          </span>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Learn Tuples with Bittu and Grandpa
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-800 max-w-xl mx-auto">
            Discover how Tuples work in Python! Follow the story of Bittu and his Grandpa,
            or jump straight into the interactive playground using the sidebar.
          </p>
        </div>
{/* Bittu — out in the left margin, vertically centered on the banner */}
<div
  id="bittu-img"
  className="absolute top-1/2 -left-28 md:-left-36 w-40 h-56 md:w-52 md:h-72 hover:-translate-y-[calc(5%+4px)] transition-transform duration-300"
  style={{ transform: 'translateY(-50%) rotate(-6deg)' }}
>
  <img src="/images/5.png" alt="Bittu" className="w-full h-full object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
</div>

{/* Grandpa — out in the right margin, vertically centered on the banner */}
<div
  id="grandpa-img"
  className="absolute top-1/2 -right-24 md:-right-36 w-40 h-56 md:w-52 md:h-72 hover:-translate-y-[calc(5%+4px)] transition-transform duration-300"
  style={{ transform: 'translateY(-50%) rotate(6deg)' }}
>
  <img src="/images/a1.png" alt="Grandpa" className="w-full h-full object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
</div>
      </div>

      {/* Action Buttons — sit close beneath the portraits, no dead gap */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg mt-14">
        <button
          onClick={() => startTour('home')}
          className="flex-1 py-4 px-5 bg-yellow-300 border-4 border-black rounded-xl font-black text-lg hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 text-center leading-snug"
        >
          <BookOpen size={22} strokeWidth={3} className="shrink-0" /> Story mode
        </button>

        <button
          id="btn-skip-story"
          onClick={() => navigate('/ordered')}
          className="flex-1 py-4 px-5 bg-lime-400 border-4 border-black rounded-xl font-black text-lg hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 text-center leading-snug"
        >
          <Rocket size={22} strokeWidth={3} className="shrink-0" /> Go for examples
        </button>
      </div>

      <p className="mt-6 text-sm font-bold text-gray-500">
        {/* New here? Story mode is the best place to start. */}
      </p>
    </div>
  );
}