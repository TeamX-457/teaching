"use client"
import React, { useState, useEffect } from "react";
import { API_BASE } from "@/lib/config";

interface DualLanguageReaderProps {
  lessonId?: string;
  onBackToLibrary?: () => void;
}

export const DualLanguageReader: React.FC<DualLanguageReaderProps> = ({
  lessonId = "water-cycle",
  onBackToLibrary,
}) => {
  const [viewMode, setViewMode] = useState<"dual" | "eng" | "efik">("dual");
  const [activeSentenceId, setActiveSentenceId] = useState<number>(2);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [loadedLesson, setLoadedLesson] = useState<{ title: string } | null>(null);

  useEffect(() => {
    if (!lessonId || lessonId === "water-cycle") return;
    let isMounted = true;
    fetch(`${API_BASE}/api/lessons/${lessonId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.lesson) {
          setLoadedLesson(data.lesson);
        }
      })
      .catch((e) => console.warn("Using offline reader content:", e));

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const handleCopyOrthography = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 pt-6 pb-28">
      {/* Breadcrumbs & Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[#4d4635] text-[13px] font-medium">
          <button
            onClick={onBackToLibrary}
            className="hover:text-[#735c00] transition-colors flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Curriculum Modules</span>
          </button>
          <span className="text-[#d0c5af]">/</span>
          <span className="text-[#1c1b1b] font-semibold">STEM General Science</span>
          <span className="text-[#d0c5af]">/</span>
          <span className="px-2.5 py-0.5 bg-[#fef3c7] text-[#78350f] text-[11px] font-bold rounded-md">
            Primary 5 – JSS 1
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {copiedNotification && (
            <span className="text-[12px] bg-[#d4af37]/20 text-[#554300] px-2 py-1 rounded font-semibold animate-fade-in">
              ✓ Copied to clipboard
            </span>
          )}
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#eae7e7] text-[#1c1b1b] text-[13px] font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#e5e2e1] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#735c00]">bookmark</span>
            Save Lesson
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#eae7e7] text-[#1c1b1b] text-[13px] font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#e5e2e1] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Handout
          </button>
        </div>
      </div>

      {/* Lesson Top Control Header Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#eae7e7] mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#fef3c7] text-[#166534] border border-[#d4af37]/40 text-[11px] font-bold rounded uppercase tracking-wider">
                Orthography Approved
              </span>
              <span className="text-[#44403c] text-[12px] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#166534]">verified</span>
                Akwa Ibom &amp; Calabar Standard Validated
              </span>
            </div>
            <h1 className="font-['Libre_Caslon_Text',serif] text-[28px] md:text-[32px] font-bold text-[#1c1917] tracking-tight">
              {loadedLesson ? loadedLesson.title : "The Water Cycle & Ecosystems"}{" "}
              <span className="text-[#e8720c] italic font-normal text-[24px] md:text-[28px]">
                (Mkpañkpa Mmọñ ye Ndotukpo)
              </span>
            </h1>
            <p className="text-[15px] text-[#44403c] mt-1.5">
              Exploring atmospheric moisture, rainfall distribution, river basin wetlands, and historical indigenous
              flood prevention terms in Efik.
            </p>
          </div>

          {/* View Mode Switch Tabs */}
          <div className="flex items-center p-1 bg-[#f7f3ec] rounded-xl shrink-0 border border-[#e7e0d3]">
            <button
              onClick={() => setViewMode("dual")}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${viewMode === "dual"
                ? "bg-[#e8720c] text-white shadow-sm"
                : "text-[#44403c] hover:text-[#1c1917]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">vertical_split</span>
              <span>Dual Parallel View</span>
            </button>
            <button
              onClick={() => setViewMode("eng")}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${viewMode === "eng"
                ? "bg-[#e8720c] text-white shadow-sm"
                : "text-[#44403c] hover:text-[#1c1917]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_align_left</span>
              <span>English Only</span>
            </button>
            <button
              onClick={() => setViewMode("efik")}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${viewMode === "efik"
                ? "bg-[#e8720c] text-white shadow-sm"
                : "text-[#44403c] hover:text-[#1c1917]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">translate</span>
              <span>Efik Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reading Layout Grid Container */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* English Column */}
        {(viewMode === "dual" || viewMode === "eng") && (
          <section
            className={`flex flex-col gap-4 ${viewMode === "dual" ? "col-span-12 lg:col-span-6" : "col-span-12 max-w-3xl mx-auto w-full"
              }`}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#eae7e7] text-[#1c1b1b] text-[11px] font-bold tracking-wider">
                  ENG
                </span>
                <span className="text-[18px] font-bold text-[#1c1b1b]">Standard English Source</span>
              </div>
              <span className="text-[#7f7663] text-[12px]">4 Sections • 412 words</span>
            </div>

            {/* Paragraph Block 1 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#eae7e7] text-[#7f7663] text-[11px] font-bold uppercase tracking-wider">
                <span>SECTION 01: THE NATURAL EQUILIBRIUM</span>
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </div>

              {/* Sentence 1.1 */}
              <div
                onClick={() => setActiveSentenceId(1)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 1
                  ? "bg-[#ffe088]/25 ring-1 ring-[#735c00]/30 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">1.1</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    Water covers more than seventy percent of the Earth's surface and is essential for all living
                    organisms across forests, savannas, and river deltas.
                  </p>
                </div>
              </div>

              {/* Sentence 1.2 (Active Target) */}
              <div
                onClick={() => setActiveSentenceId(2)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer relative ${activeSentenceId === 2
                  ? "bg-[#ffe088]/30 shadow-sm ring-1 ring-[#735c00]/40"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                {activeSentenceId === 2 && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#735c00] rounded-l-lg"></div>
                )}
                <div className="flex items-start gap-2.5">
                  <span
                    className={`text-[12px] font-bold mt-0.5 shrink-0 ${activeSentenceId === 2 ? "text-[#735c00]" : "text-[#7f7663]"
                      }`}
                  >
                    1.2
                  </span>
                  <div className="flex flex-col gap-1">
                    <p
                      className={`font-['Libre_Caslon_Text',serif] text-[18px] leading-relaxed text-[#1c1b1b] ${activeSentenceId === 2 ? "font-bold" : ""
                        }`}
                    >
                      The vibrant colors of the textiles reflect our rich heritage, just as clear flowing streams
                      preserve the memory of ancestral soil.
                    </p>
                    {activeSentenceId === 2 && (
                      <div className="flex items-center gap-1.5 pt-1 text-[#735c00] text-[12px] font-semibold">
                        <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                        <span>Synchronized Focus with Paragraph 1.2</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sentence 1.3 */}
              <div
                onClick={() => setActiveSentenceId(3)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 3
                  ? "bg-[#ffe088]/25 ring-1 ring-[#735c00]/30 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">1.3</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    Solar radiation warms the upper river beds, transforming dense pools of liquid into rising vapor
                    that condenses within the cooler upper atmosphere.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Media Context Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7]">
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2 bg-[#f0eded]">
                <img
                  src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80"
                  alt="Riparian Hydro-cycle of the Cross River Basin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent text-white text-[12px] font-medium">
                  Figure 1.1: Riparian Hydro-cycle of the Cross River Basin (Esụk Calabar)
                </div>
              </div>
              <p className="text-[13px] text-[#4d4635] leading-relaxed">
                Teachers may refer students to the seasonal fluctuations between dry Harmattan trade winds and
                torrential Atlantic rainfall in Southeastern Nigeria.
              </p>
            </div>

            {/* Paragraph Block 2 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#eae7e7] text-[#7f7663] text-[11px] font-bold uppercase tracking-wider">
                <span>SECTION 02: CLOUD ACCUMULATION &amp; PRECIPITATION</span>
                <span className="material-symbols-outlined text-[16px]">cloud</span>
              </div>
              <div
                onClick={() => setActiveSentenceId(4)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 4
                  ? "bg-[#ffe088]/25 ring-1 ring-[#735c00]/30 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">2.1</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    When moisture saturated air currents strike high coastal ridges, condensation precipitates
                    rainfall that nourishes inland yam, cassava, and cocoa farmlands.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Efik Column */}
        {(viewMode === "dual" || viewMode === "efik") && (
          <section
            className={`flex flex-col gap-4 ${viewMode === "dual" ? "col-span-12 lg:col-span-6" : "col-span-12 max-w-3xl mx-auto w-full"
              }`}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-white text-[11px] font-bold tracking-wider">
                  EFIK
                </span>
                <span className="text-[18px] font-bold text-[#1c1b1b]">
                  Ikọ Efik (Standard Calabar Orthography)
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#ffe088] text-[#241a00] text-[11px] font-bold rounded">
                High Tonal Accuracy
              </span>
            </div>

            {/* Efik Paragraph Block 1 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#eae7e7] text-[#7f7663] text-[11px] font-bold uppercase tracking-wider">
                <span>IKPEHE 01: NDOTUKPO YE UNYENE MMỌÑ</span>
                <span className="material-symbols-outlined text-[16px]">school</span>
              </div>

              {/* Efik Sentence 1 */}
              <div
                onClick={() => setActiveSentenceId(1)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 1
                  ? "bg-[#d4af37]/25 ring-1 ring-[#735c00]/40 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">1.1</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    Mmọñ ọyọhọ se iwakde ikan mbak edip ye itiaita ke ikpehe eke ererimbot, ndien enye edi akpan ñkpọ
                    kpa mme nsio nsio unam ye eto ke ikọt ye mben inyañ.
                  </p>
                </div>
              </div>

              {/* Efik Sentence 2 (Synchronized Active Target) */}
              <div
                onClick={() => setActiveSentenceId(2)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer relative ${activeSentenceId === 2
                  ? "bg-[#d4af37]/25 shadow-sm ring-1 ring-[#735c00]/50"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                {activeSentenceId === 2 && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37] rounded-l-lg"></div>
                )}
                <div className="flex items-start gap-2.5">
                  <span
                    className={`text-[12px] font-bold mt-0.5 shrink-0 ${activeSentenceId === 2 ? "text-[#554300]" : "text-[#7f7663]"
                      }`}
                  >
                    1.2
                  </span>
                  <div className="flex flex-col gap-2 flex-1">
                    <p
                      className={`font-['Libre_Caslon_Text',serif] text-[18px] leading-relaxed text-[#1c1b1b] ${activeSentenceId === 2 ? "font-bold" : ""
                        }`}
                    >
                      Mme ndinem uduot ọfọn ẹwụt edisana inyene nnyịn, kpa nte mme nsia mmọñ ẹkemede ndikpeme mfiọk
                      ye itie nte mbon mbọm ẹkedude.
                    </p>

                    {/* Interactive Toolbar for Active Segment */}
                    {activeSentenceId === 2 && (
                      <div className="flex flex-wrap items-center justify-between pt-2 gap-2 border-t border-[#eae7e7]/60">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlayingAudio(true);
                            }}
                            className="px-2.5 py-1 bg-[#e8720c] hover:bg-[#c25e0a] text-white rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">volume_up</span>
                            <span>Listen to Sentence</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyOrthography(
                                "Mme ndinem uduot ọfọn ẹwụt edisana inyene nnyịn, kpa nte mme nsia mmọñ ẹkemede ndikpeme mfiọk ye itie nte mbon mbọm ẹkedude."
                              );
                            }}
                            className="px-2.5 py-1 bg-[#eae7e7] text-[#1c1b1b] text-[12px] font-semibold rounded-lg flex items-center gap-1 hover:bg-[#e5e2e1] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            <span>Copy Orthography</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[#ac332a] text-[11px] font-semibold bg-[#ffdad5] px-2 py-0.5 rounded">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          <span>Tone marks: Low (ẹ), Open Back Round (ọ), Velar Nasal (ñ)</span>
                        </div>
                      </div>
                    )}

                    {/* Pronunciation Guide Callout */}
                    {activeSentenceId === 2 && (
                      <div className="mt-1 p-2 bg-[#f6f3f2] rounded-lg flex items-center gap-2 border border-[#eae7e7]">
                        <div className="w-7 h-7 rounded-full bg-[#d4af37] text-[#554300] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">mic</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[#1c1b1b]">Phonetic Guide (IPA):</div>
                          <div className="text-[12px] text-[#4d4635] font-mono truncate">
                            /mme ndinem uduɔt ɔfɔn ɛwut edisana iɲene ɲin/
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Efik Sentence 3 */}
              <div
                onClick={() => setActiveSentenceId(3)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 3
                  ? "bg-[#d4af37]/25 ring-1 ring-[#735c00]/40 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">1.3</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    Utịn ọyọhọ mben inyañ ke ufiop, anam mmọñ akabade edi ntuñhiọñ emi ọdọkdekde ke enyọñ man
                    akabade obubịt obụm.
                  </p>
                </div>
              </div>
            </div>

            {/* Linguistic Notes & Etymology Insight */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#166534] text-[12px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
                <span>Morphological Breakdown</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#f6f3f2] rounded-lg border border-[#eae7e7]">
                  <span className="text-[10px] uppercase tracking-wide text-[#7f7663] font-bold">Root Verb</span>
                  <p className="font-bold text-[#735c00] text-[15px]">kpañ (to fold, encircle)</p>
                  <p className="text-[12px] text-[#4d4635] mt-0.5">
                    Base root for circular, cyclical hydrological systems.
                  </p>
                </div>
                <div className="p-3 bg-[#f6f3f2] rounded-lg border border-[#eae7e7]">
                  <span className="text-[10px] uppercase tracking-wide text-[#7f7663] font-bold">
                    Noun Compound
                  </span>
                  <p className="font-bold text-[#166534] text-[15px]">Mkpañkpa-mmọñ (Water-Cycle)</p>
                  <p className="text-[12px] text-[#4d4635] mt-0.5">
                    Standard scholarly synthesis coined by the Language Board.
                  </p>
                </div>
              </div>
            </div>

            {/* Efik Paragraph Block 2 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#eae7e7] text-[#7f7663] text-[11px] font-bold uppercase tracking-wider">
                <span>IKPEHE 02: EDIDEP YE NDỊBỌHỌ ENYỌÑ</span>
                <span className="material-symbols-outlined text-[16px]">cloud</span>
              </div>
              <div
                onClick={() => setActiveSentenceId(4)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${activeSentenceId === 4
                  ? "bg-[#d4af37]/25 ring-1 ring-[#735c00]/40 shadow-sm"
                  : "bg-[#f6f3f2]/60 hover:bg-[#f6f3f2]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[12px] text-[#7f7663] font-bold mt-0.5 shrink-0">2.1</span>
                  <p className="font-['Libre_Caslon_Text',serif] text-[17px] leading-relaxed text-[#1c1b1b]">
                    Ke ini ofụm emi ọyọhọde ye mmọñ osopde mme obot mben inyañ, edidep edi se ididepde ibeñe mme
                    inwang bia ye eto cocoa.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Floating Interactive Audio Player Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[1100px] z-40 bg-white/95 backdrop-blur-md border border-[#eae7e7] shadow-xl rounded-2xl p-3 md:p-4 transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Controls & Waveform */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8720c] to-[#c25e0a] text-white flex items-center justify-center hover:from-[#c25e0a] hover:to-[#a84d06] shadow-md shadow-[#e8720c]/30 transition-transform active:scale-95 shrink-0"
              title={isPlayingAudio ? "Pause Audio" : "Play Audio"}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPlayingAudio ? "pause" : "play_arrow"}
              </span>
            </button>

            {/* Prev / Next buttons */}
            <button
              onClick={() => setActiveSentenceId(Math.max(1, activeSentenceId - 1))}
              className="text-[#4d4635] hover:text-[#735c00] transition-colors p-1"
              title="Previous Sentence"
            >
              <span className="material-symbols-outlined text-[22px]">skip_previous</span>
            </button>
            <button
              onClick={() => setActiveSentenceId(Math.min(4, activeSentenceId + 1))}
              className="text-[#4d4635] hover:text-[#735c00] transition-colors p-1"
              title="Next Sentence"
            >
              <span className="material-symbols-outlined text-[22px]">skip_next</span>
            </button>

            {/* Animated Waveform Visualization */}
            <div className="flex items-end gap-[3px] h-7 flex-1 px-2 overflow-hidden">
              {[3, 5, 7, 4, 8, 6, 3, 7, 5, 4, 8, 6, 7, 3, 5, 8, 4, 2, 5, 3, 6, 2, 4, 1].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${i < 16
                    ? `bg-[#e8720c] ${isPlayingAudio ? "animate-pulse" : ""}`
                    : "bg-[#d0c5af]"
                    }`}
                  style={{ height: `${height * 3}px` }}
                />
              ))}
            </div>

            {/* Timestamp display */}
            <div className="text-[12px] font-mono text-[#1c1917] whitespace-nowrap shrink-0">
              <span className="text-[#e8720c] font-bold">01:42</span> / 04:15
            </div>
          </div>

          {/* Speed & Volume & Download */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Speed Pill Selector */}
            <div className="flex items-center bg-[#f7f3ec] rounded-lg p-0.5 text-[#1c1917] border border-[#e7e0d3]">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-all ${playbackSpeed === speed
                    ? "bg-white text-[#166534] shadow-sm font-bold"
                    : "hover:bg-[#eae7e7]"
                    }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Download MP3 Action */}
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm shadow-[#e8720c]/20 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Download Audio (MP3)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
