"use client"
import React from "react";

interface AudioArchivesProps {
  onOpenReader?: () => void;
}

export const AudioArchives: React.FC<AudioArchivesProps> = ({ onOpenReader }) => {
  return (
    <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1 max-w-2xl">
        <div className="flex items-center gap-1.5 text-[#166534] text-[12px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
          <span>Acoustic Corpus</span>
          <span className="text-[#d0c5af]">/</span>
          <span className="text-[#44403c] font-normal">Akwa Ibom &amp; Calabar Speech Archives</span>
        </div>
        <h1 className="font-['Libre_Caslon_Text',serif] text-[32px] font-bold text-[#e8720c] tracking-tight">
          Audio Archives &amp; Voice Repository
        </h1>
        <p className="text-[15px] text-[#44403c]">
          Curated native spoken Efik classroom readings, pronunciation lexicons, and verified elder dialect recordings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="bg-white p-6 rounded-xl border border-[#e7e0d3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#fff4ea] text-[#e8720c] flex items-center justify-center mb-4 ring-1 ring-[#e8720c]/20">
              <span className="material-symbols-outlined text-[28px]">record_voice_over</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#1c1917]">Standard Pronunciation Corpus</h3>
            <p className="text-[13px] text-[#44403c] mt-1.5 leading-relaxed">
              1,420 phonemic audio pairs with high, low, and downstep tonal pitch markers for classroom educators.
            </p>
          </div>
          <button
            onClick={onOpenReader}
            className="mt-6 text-[#166534] hover:text-[#e8720c] font-bold text-[13px] flex items-center gap-1 transition-colors"
          >
            <span>Listen in Dual Reader</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e7e0d3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#fef3c7] text-[#78350f] flex items-center justify-center mb-4 ring-1 ring-[#d4af37]/30">
              <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#1c1917]">Oral Heritage Classroom Lectures</h3>
            <p className="text-[13px] text-[#44403c] mt-1.5 leading-relaxed">
              Curriculum aligned audio lectures recorded by certified educators across Akwa Ibom &amp; Cross River.
            </p>
          </div>
          <button
            onClick={onOpenReader}
            className="mt-6 text-[#166534] hover:text-[#e8720c] font-bold text-[13px] flex items-center gap-1 transition-colors"
          >
            <span>Explore STEM Recordings</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e7e0d3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center mb-4 ring-1 ring-[#166534]/20">
              <span className="material-symbols-outlined text-[28px]">cloud_download</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#1c1917]">Offline Compressed Packs</h3>
            <p className="text-[13px] text-[#44403c] mt-1.5 leading-relaxed">
              Download complete subject audio collections in low-bandwidth Opus/MP3 format for offline village schools.
            </p>
          </div>
          <button className="mt-6 text-[#e8720c] hover:text-[#c25e0a] font-bold text-[13px] flex items-center gap-1 transition-colors">
            <span>Download All (84 MB)</span>
            <span className="material-symbols-outlined text-[16px]">download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioArchives;
