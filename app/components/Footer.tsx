"use client"
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f7f3ec] border-t border-[#e7e0d3] mt-auto">
      {/* Akwa Ibom Tricolor Accent Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#166534] via-[#e8720c] to-[#d4af37] w-full" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-[#44403c] flex-wrap justify-center md:justify-start">
          <div className="w-7 h-7 rounded-lg bg-[#e8720c]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#e8720c] text-[18px]">menu_book</span>
          </div>
          <span className="text-[14px] font-bold text-[#1c1917] font-serif">EduTranslate Efik</span>
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#166534]/10 text-[#166534]">
            Land of Promise
          </span>
          <span className="text-[#78716c] text-[12px] ml-1">
            &copy; 2026 Akwa Ibom Heritage Learning Initiative &bull; NERDC Orthography Aligned
          </span>
        </div>

        <div className="flex items-center gap-4 text-[13px] text-[#44403c] flex-wrap justify-center">
          <a href="#" className="hover:text-[#e8720c] transition-colors font-medium">
            Standard Orthography Guide
          </a>
          <a href="#" className="hover:text-[#e8720c] transition-colors font-medium">
            Linguistic Corpus
          </a>
          <a href="#" className="hover:text-[#e8720c] transition-colors font-medium">
            Institutional Access
          </a>
          <a href="#" className="hover:text-[#e8720c] transition-colors font-medium">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
};
