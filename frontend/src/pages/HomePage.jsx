import { Link } from 'react-router-dom';
import {
  Boxes, Layers, Repeat2, GitBranch, Braces, List, BookOpen,
  Parentheses, Package2, FolderTree, FileText, TriangleAlert,
  Compass, Map, Telescope, ChevronDown, ArrowRight, Sparkles,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Logo from '../components/layout/Logo';

const features = [
  { icon: Compass, title: 'Learn by Doing', desc: 'Every topic comes with small, hands-on examples you can run and tweak.', accent: 'text-[#4f8cff]', bg: 'bg-[#eaf1ff]' },
  { icon: Map, title: 'Structured Path', desc: 'Go step by step from variables to real projects, in the right order.', accent: 'text-[#33b28c]', bg: 'bg-[#e6f8f1]' },
  { icon: Telescope, title: 'Explore Freely', desc: 'Jump to any topic. Learn at your own pace, your own way.', accent: 'text-[#ff5c8a]', bg: 'bg-[#ffe9f0]' },
];

const COLORS = [
  { accent: 'text-[#4f8cff]', bg: 'bg-[#eaf1ff]' },
  { accent: 'text-[#ff8a5c]', bg: 'bg-[#fff0e8]' },
  { accent: 'text-[#33b28c]', bg: 'bg-[#e6f8f1]' },
  { accent: 'text-[#a778ff]', bg: 'bg-[#f2ecff]' },
  { accent: 'text-[#ff5c8a]', bg: 'bg-[#ffe9f0]' },
  { accent: 'text-[#ffb800]', bg: 'bg-[#fff5db]' },
];

const topics = [
  { icon: Boxes, title: 'Variables', desc: 'Store and label data values to use throughout your program.' },
  { icon: Layers, title: 'Data Types', desc: 'Learn strings, integers, floats, and booleans in Python.' },
  { icon: Repeat2, title: 'Loops', desc: 'Repeat actions efficiently using for and while loops.' },
  { icon: GitBranch, title: 'Conditionals', desc: 'Make decisions in code with if, elif, and else statements.' },
  { icon: Braces, title: 'Functions', desc: 'Write reusable blocks of code that perform specific tasks.' },
  { icon: List, title: 'Lists', desc: 'Store and manage ordered collections of items easily.' },
  { icon: BookOpen, title: 'Dictionaries', desc: 'Work with key-value pairs to organize related data.' },
  { icon: Parentheses, title: 'Tuples', desc: 'Use immutable sequences to store fixed collections of data.' },
  { icon: Package2, title: 'OOP', desc: 'Model real-world entities using classes and objects.' },
  { icon: FolderTree, title: 'Modules', desc: 'Organize and reuse code across multiple Python files.' },
  { icon: FileText, title: 'File Handling', desc: 'Read from and write to files directly in Python.' },
  { icon: TriangleAlert, title: 'Exceptions', desc: 'Handle errors gracefully using try, except, and finally.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#eef4ff_0%,#fff8ec_100%)] overflow-hidden">
      <Navbar />

      {/* decorative background blobs */}
      <div className="pointer-events-none fixed -z-0 top-[-120px] left-[-100px] w-[340px] h-[340px] rounded-full bg-[#a9c3ff] opacity-30 blur-[60px]" />
      <div className="pointer-events-none fixed -z-0 top-[60px] right-[-120px] w-[300px] h-[300px] rounded-full bg-[#ffd98a] opacity-30 blur-[60px]" />
      <div className="pointer-events-none fixed -z-0 bottom-[200px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[#c9b2ff] opacity-20 blur-[60px]" />
      <div className="pointer-events-none fixed -z-0 bottom-[-100px] right-[-80px] w-[280px] h-[280px] rounded-full bg-[#9fe6c9] opacity-25 blur-[60px]" />

      <div className="relative z-10 max-w-[1140px] mx-auto px-6 pt-14 pb-24 text-center">

        {/* Hero */}
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#e7e9f5] text-[#3d5af1] text-xs font-semibold px-4 py-1.5 rounded-full shadow-[0_4px_14px_rgba(28,33,64,0.06)] mb-6 animate-fade-in">
          <Sparkles size={13} /> Learn Python the fun way
        </div>

        <div className="flex justify-center mb-4 animate-fade-in">
          <Logo size={60} />
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-[#3d5af1] to-[#7a5cff] bg-clip-text text-transparent animate-fade-in">
          PyBe
        </h1>
        <p className="text-lg text-[#5c6180] mb-4 animate-fade-in">Online Python Learning Platform</p>

        <a
          href="#get-started"
          onClick={(e) => { e.preventDefault(); document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold tracking-wide text-[#3d5af1] mb-8 hover:underline cursor-pointer"
        >
          Get Started
          <ChevronDown size={13} className="animate-bounce" />
        </a>

        {/* code preview */}
        <div className="max-w-[480px] mx-auto mb-10 bg-[#1c2140] rounded-2xl overflow-hidden text-left border border-white/5 shadow-[0_20px_50px_rgba(61,90,241,0.22),0_6px_16px_rgba(28,33,64,0.15)] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-1.5 px-3.5 py-3 bg-[#262b4d]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11.5px] text-[#8a8fb5] font-mono">first_steps.py</span>
          </div>
          <div className="px-5 py-4 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#464b74] mr-3.5">1</span><span className="text-[#6f7599]"># your first line of Python</span></div>
            <div><span className="text-[#464b74] mr-3.5">2</span><span className="text-[#6fa8ff]">print</span>(<span className="text-[#4fd6ac]">"Hello, future coder!"</span>)</div>
            <div><span className="text-[#464b74] mr-3.5">3</span><span className="text-[#ff8a5c]">for</span> i <span className="text-[#ff8a5c]">in</span> <span className="text-[#6fa8ff]">range</span>(3):</div>
            <div><span className="text-[#464b74] mr-3.5">4</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#6fa8ff]">print</span>(<span className="text-[#4fd6ac]">"Let's learn Python!"</span>)</div>
            <div><span className="text-[#464b74] mr-3.5">&nbsp;</span><span className="text-[#ffc93c]">&gt;&gt;&gt; Hello, future coder!</span></div>
            <div><span className="text-[#464b74] mr-3.5">&nbsp;</span><span className="text-[#ffc93c]">&gt;&gt;&gt; Let's learn Python!</span><span className="inline-block w-[7px] h-[15px] bg-[#ffc93c] align-middle animate-pulse" /></div>
          </div>
        </div>

        <div className="flex justify-center gap-12 flex-wrap mb-14">
          <div className="text-center"><div className="text-2xl font-extrabold text-[#3d5af1]">12+</div><div className="text-xs text-[#5c6180]">Core Topics</div></div>
          <div className="text-center"><div className="text-2xl font-extrabold text-[#3d5af1]">100%</div><div className="text-xs text-[#5c6180]">Beginner Friendly</div></div>
          <div className="text-center"><div className="text-2xl font-extrabold text-[#3d5af1]">0 → 1</div><div className="text-xs text-[#5c6180]">No Experience Needed</div></div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-[#eceef5] rounded-2xl p-6 shadow-[0_4px_14px_rgba(28,33,64,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(28,33,64,0.1)] transition-all">
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mx-auto mb-3.5`}>
                <f.icon size={22} className={f.accent} strokeWidth={1.8} />
              </div>
              <h4 className="text-[15.5px] font-bold mb-1.5 text-[#1c2140]">{f.title}</h4>
              <p className="text-xs text-[#5c6180] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div className="text-[13px] font-bold text-[#3d5af1] uppercase tracking-[1.2px] mb-2">What You'll Learn</div>
        <h2 className="text-[28px] font-extrabold mb-3 text-[#1c2140]">Core Python Topics</h2>
        <p className="text-sm text-[#5c6180] mb-10">Hover any card for a quick peek at what it covers.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 mb-4">
          {topics.map((t, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <div
                key={t.title}
                className="group bg-white border border-[#eceef5] rounded-2xl px-3.5 pt-6 pb-5 min-h-[130px] flex flex-col items-center justify-start shadow-[0_3px_10px_rgba(28,33,64,0.05)] hover:scale-[1.08] hover:shadow-[0_14px_26px_rgba(28,33,64,0.13)] transition-all relative overflow-hidden"
              >
                <div className={`w-10 h-10 rounded-[10px] ${c.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
                  <t.icon size={22} className={c.accent} strokeWidth={1.8} />
                </div>
                <h3 className="text-[15.5px] font-bold text-[#1c2140]">{t.title}</h3>
                <p className="text-xs text-[#5c6180] leading-snug mt-0 max-h-0 opacity-0 overflow-hidden group-hover:max-h-16 group-hover:opacity-100 group-hover:mt-2 transition-all">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#3d5af1] to-[#7a5cff] rounded-[22px] px-8 py-12 relative overflow-hidden shadow-[0_20px_50px_rgba(61,90,241,0.28)]">
          <p className="relative text-2xl font-extrabold text-white mb-2">Start learning today.</p>
          <div className="relative text-[13.5px] text-white/85 mb-6">Join PyBe and write your first line of Python in minutes.</div>
          <Link
            id="get-started"
            to="/register"
            className="relative inline-flex items-center gap-2 bg-white text-[#3d5af1] font-bold text-[15px] px-8 py-3.5 rounded-lg shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.2)] transition-all"
          >
            Sign Up / Login
            <ArrowRight size={16} />
          </Link>
        </div>

        <footer className="mt-10 text-sm text-[#9195b3]">
          © 2026 PyBe. <Link to="/about" className="hover:text-[#3d5af1]">About</Link>
        </footer>
      </div>
    </div>
  );
}
