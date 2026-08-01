import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollTopButton.css';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
      <ArrowUp size={20} />
    </button>
  );
}
