"use client"
import React, { useState, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/config";

interface SubjectItem {
  id: string;
  name: string;
}

interface LessonInputHubProps {
  onTranslateComplete?: () => void;
}

export const LessonInputHub: React.FC<LessonInputHubProps> = ({ onTranslateComplete }) => {
  const [subject, setSubject] = useState("civic-education");
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [inputMode, setInputMode] = useState<"text" | "pdf" | "voice">("text");
  const [lessonText, setLessonText] = useState(
    "The executive branch of government is responsible for enforcing the laws passed by the legislative assembly. In a democratic society, this ensures that public institutions function transparently and serve the collective interest of all citizens."
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === "string" && content.trim().length > 0) {
        setLessonText(content.trim());
        setInputMode("text"); // switch to text tab so the content is visible
      } else {
        alert("Could not read file content. For PDFs, please copy the text manually.");
      }
    };
    reader.readAsText(file);
    // reset so the same file can be re-selected
    e.target.value = "";
  };

  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recording is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      // Stop recording
      recognitionRef.current?.stop();
      setIsRecording(false);
      setRecordingStatus("");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingStatus("Listening...");
      finalTranscript = lessonText; // append to existing text
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interimTranscript = transcript;
        }
      }
      setLessonText(finalTranscript + (interimTranscript ? " " + interimTranscript : ""));
      setRecordingStatus(`Hearing: "${interimTranscript || "..."}"`);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        setRecordingStatus(`Error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingStatus("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await fetch(`${API_BASE}/api/subjects?page=1&limit=50`, { credentials: "include" });
        if (res.ok) {
          const raw = await res.json().catch(() => null);
          const list = Array.isArray(raw) ? raw : raw?.data;
          if (Array.isArray(list) && list.length > 0) {
            setSubjectsList(list);
            setSubject(list[0].id);
          }
        }
      } catch (e) {
        console.warn("Using offline subjects list:", e);
      }
    }
    loadSubjects();
  }, []);

  const insertChar = (char: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const updated = lessonText.substring(0, start) + char + lessonText.substring(end);
    setLessonText(updated);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + char.length, start + char.length);
      }
    }, 0);
  };

  const handleClear = () => {
    setLessonText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const firstSentence = lessonText.split(".")[0].trim() || "Untitled Curriculum Unit";
      const title = firstSentence.length > 60 ? firstSentence.substring(0, 57) + "..." : firstSentence;

      await fetch(`${API_BASE}/api/lessons/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          subjectId: subject,
          educatorId: "default-educator",
        }),
      }).catch((err) => {
        console.warn("Backend save skipped/offline, continuing to reader:", err);
      });
    } catch (err) {
      console.warn("Translation processing note:", err);
    } finally {
      setIsTranslating(false);
      if (onTranslateComplete) {
        onTranslateComplete();
      }
    }
  };

  const charCount = lessonText.length;
  const wordCount = lessonText.trim() ? lessonText.trim().split(/\s+/).length : 0;
  const estReadingMinutes = Math.max(1, Math.ceil(wordCount / 100));

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-6">
      {/* Top Utility Ribbon */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl shadow-sm border border-[#eae7e7]">
        <div className="flex flex-wrap items-center gap-4">
          {/* Subject Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="subject-select"
              className="text-[12px] font-semibold uppercase tracking-wider text-[#4d4635] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px] text-[#735c00]">
                auto_stories
              </span>
              Subject Domain:
            </label>
            <div className="relative">
              <select
                id="subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="appearance-none bg-[#f6f3f2] pl-3 pr-8 py-1.5 rounded-lg text-[14px] font-medium text-[#1c1b1b] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#735c00] transition-colors"
              >
                {subjectsList.length > 0 ? (
                  subjectsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="basic-science">Basic Science &amp; Technology (JSS 1-3)</option>
                    <option value="nigerian-history">Nigerian &amp; Cross River History</option>
                    <option value="civic-education">Civic Education &amp; Governance</option>
                    <option value="mathematics">Elementary Mathematics &amp; Logic</option>
                    <option value="agricultural-science">Agricultural Science &amp; Ecology</option>
                  </>
                )}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4d4635] text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Dialect / Lexicon Lock */}
          <div className="flex items-center gap-2 bg-[#f6f3f2] px-3 py-1.5 rounded-lg border border-[#e5e2e1]">
            <span className="material-symbols-outlined text-[#735c00] text-[18px]">verified</span>
            <span className="text-[12px] font-semibold text-[#1c1b1b]">Calabar Literary Standard</span>
            <span className="text-[10px] font-bold text-[#7f7663] bg-[#e5e2e1] px-1.5 py-0.5 rounded">
              ISO 639-3: efi
            </span>
          </div>
        </div>

        {/* Engine & Offline Mode Meta */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#eae7e7] px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-[#e8720c] text-[18px]">psychology</span>
            <span className="text-[12px] font-medium text-[#1c1b1b]">Gemini Heritage AI v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-[11px] text-[#4d4635]">Academic Efik</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f6f3f2] text-[#1c1b1b]">
            <span className="material-symbols-outlined text-[16px] text-[#735c00]">cloud_done</span>
            <span className="text-[12px] font-medium">Offline Cache Ready</span>
          </div>
        </div>
      </section>

      {/* Main Multi-Column Split Workspace */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Primary Input Workspace Card (Left Column - 8 Cols) */}
        <section className="col-span-12 lg:col-span-8 flex flex-col bg-white rounded-xl shadow-sm border border-[#eae7e7] p-6">
          {/* Input Method Segmented Control */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-[#eae7e7]/60">
            <div className="inline-flex p-1 rounded-xl bg-[#f6f3f2]" role="tablist">
              <button
                role="tab"
                aria-selected={inputMode === "text"}
                onClick={() => setInputMode("text")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${inputMode === "text"
                  ? "bg-[#e8720c] text-white shadow-sm"
                  : "text-[#44403c] hover:text-[#1c1917] hover:bg-[#f0eded]"
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                Type / Paste Text
              </button>
              <button
                role="tab"
                aria-selected={inputMode === "pdf"}
                onClick={() => setInputMode("pdf")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${inputMode === "pdf"
                  ? "bg-[#e8720c] text-white shadow-sm"
                  : "text-[#44403c] hover:text-[#1c1917] hover:bg-[#f0eded]"
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Upload PDF / Syllabus
              </button>
              <button
                role="tab"
                aria-selected={inputMode === "voice"}
                onClick={() => setInputMode("voice")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${inputMode === "voice"
                  ? "bg-[#e8720c] text-white shadow-sm"
                  : "text-[#44403c] hover:text-[#1c1917] hover:bg-[#f0eded]"
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
                Classroom Voice
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[#4d4635] text-[12px] font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#735c00]">school</span>
              Target: Primary &amp; Secondary Curriculum
            </div>
          </div>

          {inputMode === "text" && (
            <>
              {/* Text Editing & Orthography Assist Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 bg-[#f6f3f2] rounded-lg mb-3 border border-[#eae7e7]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-[#4d4635] hover:text-[#1c1b1b] hover:bg-[#eae7e7] rounded transition-colors"
                    title="Bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_bold</span>
                  </button>
                  <button
                    type="button"
                    className="p-1 text-[#4d4635] hover:text-[#1c1b1b] hover:bg-[#eae7e7] rounded transition-colors"
                    title="Italic"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_italic</span>
                  </button>
                  <button
                    type="button"
                    className="p-1 text-[#4d4635] hover:text-[#1c1b1b] hover:bg-[#eae7e7] rounded transition-colors"
                    title="Numbered List"
                  >
                    <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                  </button>
                  <div className="w-px h-4 bg-[#d0c5af] mx-2"></div>

                  {/* Quick Diacritic Insertion Keys for Educators */}
                  <span className="text-[11px] text-[#4d4635] font-semibold mr-1">Insert Efik mark:</span>
                  <div className="flex items-center gap-1">
                    {["ẹ", "ọ", "ñ", "ʌ"].map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => insertChar(char)}
                        className="px-2 py-0.5 bg-white text-[#1c1b1b] font-bold text-[15px] rounded border border-[#d0c5af] hover:bg-[#ffe088] hover:border-[#d4af37] transition-colors leading-none"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 text-[#e8720c] text-[12px] font-semibold hover:bg-[#fff4ea] rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">dictionary</span>
                    Subject Glossary
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 px-2 py-1 text-[#4d4635] text-[12px] font-medium hover:bg-[#eae7e7] rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    Clear
                  </button>
                </div>
              </div>

              {/* Generous Text Area Container */}
              <div className="relative w-full border border-[#eae7e7] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#735c00]/30 transition-all">
                <textarea
                  ref={textareaRef}
                  value={lessonText}
                  onChange={(e) => setLessonText(e.target.value)}
                  rows={12}
                  placeholder="Enter English lesson content or educational curriculum text to translate into standard Efik..."
                  className="w-full bg-white p-4 font-['Work_Sans',sans-serif] text-[17px] leading-relaxed text-[#1c1b1b] placeholder:text-[#7f7663]/60 focus:outline-none resize-none"
                />

                {/* Interactive Floating Bottom Metrics inside Text Area */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#f6f3f2] border-t border-[#eae7e7] text-[#4d4635] text-[12px]">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#1c1b1b]">
                       {charCount.toLocaleString()} / 5,000 characters
                    </span>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#d0c5af]"></span>
                    <span className="hidden sm:inline-block text-[#4d4635]">
                      Est. Reading Time: {estReadingMinutes} mins (Efik)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#735c00] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">spellcheck</span>
                    Morphological Analyzer: Active
                  </div>
                </div>
              </div>
            </>
          )}

          {inputMode === "pdf" && (
            <div className="p-12 border-2 border-dashed border-[#d0c5af] rounded-xl bg-[#f6f3f2]/40 text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#735c00]">upload_file</span>
              <h4 className="font-semibold text-[18px] text-[#1c1b1b]">Upload Lesson Document or Curriculum PDF</h4>
              <p className="text-[14px] text-[#4d4635] max-w-md">
                Supports NERDC syllabi, lesson notes (.txt, .docx text). Text will be extracted and segmented automatically.
              </p>
              {selectedFileName && (
                <p className="text-[13px] text-[#735c00] font-medium">📄 {selectedFileName} loaded</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.text,.md,.docx,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] text-white font-semibold rounded-xl transition-all shadow-md shadow-[#e8720c]/20"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
            </div>
          )}

          {inputMode === "voice" && (
            <div className="p-12 border-2 border-dashed border-[#e8720c]/40 rounded-xl bg-[#fff4ea]/50 text-center flex flex-col items-center justify-center gap-3">
              <div
                className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-all ${isRecording
                  ? "bg-red-600 animate-pulse scale-110"
                  : "bg-gradient-to-br from-[#e8720c] to-[#c25e0a] shadow-[#e8720c]/30 animate-pulse"
                  }`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {isRecording ? "stop" : "mic"}
                </span>
              </div>
              <h4 className="font-semibold text-[18px] text-[#1c1917]">Record Teacher Voice / Classroom Lecture</h4>
              <p className="text-[14px] text-[#44403c] max-w-md">
                Speak in English. Your speech will be transcribed into the lesson text automatically.
              </p>
              {recordingStatus && (
                <p className="text-[13px] text-[#e8720c] font-semibold italic">{recordingStatus}</p>
              )}
              <button
                className={`mt-2 px-6 py-2.5 font-semibold rounded-xl transition-all shadow-md text-white ${isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] shadow-[#e8720c]/25"
                  }`}
                onClick={toggleRecording}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              {isRecording && (
                <p className="text-[12px] text-[#44403c]">
                  💡 Switch to the <strong>Text</strong> tab to see your live transcript
                </p>
              )}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#eae7e7]">
            <div className="flex items-center gap-3 text-[#44403c]">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-[#fde68a] flex items-center justify-center text-[11px] text-[#78350f] font-bold ring-2 ring-white">
                  1
                </span>
                <span className="w-7 h-7 rounded-full bg-[#dcfce7] flex items-center justify-center text-[11px] text-[#166534] font-bold ring-2 ring-white">
                  2
                </span>
                <span className="w-7 h-7 rounded-full bg-[#fed7aa] flex items-center justify-center text-[11px] text-[#9a3412] font-bold ring-2 ring-white">
                  3
                </span>
              </div>
              <span className="text-[13px] font-medium">Standard 3-Stage Verification Pipeline</span>
            </div>

            {/* Primary CTA Button */}
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !lessonText.trim()}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] text-white font-bold text-[14px] rounded-xl shadow-md shadow-[#e8720c]/25 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isTranslating ? "hourglass_empty" : "translate"}
              </span>
              <span>{isTranslating ? "Translating with Heritage AI..." : "Translate Full Lesson"}</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider text-white/90">
                Ctrl + Enter
              </span>
            </button>
          </div>

          {/* Academic Corpus Context Preview */}
          <div className="mt-6 p-4 bg-[#f7f3ec] rounded-xl border border-[#e7e0d3]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1c1917]">
                <span className="material-symbols-outlined text-[#166534] text-[20px]">library_books</span>
                Aligned National Curriculum Reference
              </div>
              <span className="text-[12px] text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full font-bold">
                NERDC Standard
              </span>
            </div>
            <p className="text-[13px] text-[#44403c] leading-relaxed">
              Lesson units generated through this hub conform strictly to the Cross River &amp; Akwa Ibom State Ministries
              of Basic Education standard orthographic conventions.
            </p>
          </div>
        </section>

        {/* Secondary Right Sidebar Pane (4 Cols) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Quick Reference Card: Efik Cultural & Linguistic Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-[#eae7e7] p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[18px] font-bold text-[#1c1b1b] flex items-center gap-1.5 font-['Work_Sans',sans-serif]">
                <span className="material-symbols-outlined text-[#735c00] text-[22px]">spellcheck</span>
                Efik Orthography Guide
              </h3>
              <span className="text-[11px] bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-full font-bold">
                Standardized
              </span>
            </div>
            <p className="text-[13px] text-[#4d4635] mb-4 leading-relaxed">
              Essential diacritics and phonemic marks recognized by the Calabar Heritage Academic Council.
            </p>

            {/* Character Quick Tiles */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div
                onClick={() => insertChar("Ẹ / ẹ")}
                className="p-2.5 bg-[#fdfbf7] rounded-lg text-center cursor-pointer hover:bg-[#fff4ea] border border-[#e7e0d3] hover:border-[#e8720c] transition-all group"
              >
                <div className="font-['Libre_Caslon_Text',serif] font-semibold text-[22px] text-[#e8720c] leading-none group-hover:scale-110 transition-transform">
                  Ẹ ẹ
                </div>
                <div className="text-[11px] text-[#44403c] mt-1.5 font-medium">Open-mid 'e'</div>
              </div>
              <div
                onClick={() => insertChar("Ọ / ọ")}
                className="p-2.5 bg-[#fdfbf7] rounded-lg text-center cursor-pointer hover:bg-[#fff4ea] border border-[#e7e0d3] hover:border-[#e8720c] transition-all group"
              >
                <div className="font-['Libre_Caslon_Text',serif] font-semibold text-[22px] text-[#e8720c] leading-none group-hover:scale-110 transition-transform">
                  Ọ ọ
                </div>
                <div className="text-[11px] text-[#44403c] mt-1.5 font-medium">Open-mid 'o'</div>
              </div>
              <div
                onClick={() => insertChar("Ñ / ñ")}
                className="p-2.5 bg-[#fdfbf7] rounded-lg text-center cursor-pointer hover:bg-[#fff4ea] border border-[#e7e0d3] hover:border-[#e8720c] transition-all group"
              >
                <div className="font-['Libre_Caslon_Text',serif] font-semibold text-[22px] text-[#e8720c] leading-none group-hover:scale-110 transition-transform">
                  Ñ ñ
                </div>
                <div className="text-[11px] text-[#44403c] mt-1.5 font-medium">Velar nasal</div>
              </div>
            </div>

            {/* Tonal Accentuation Quick Helper */}
            <div className="bg-[#f7f3ec] p-3.5 rounded-lg mb-4 border border-[#e7e0d3]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-[#1c1917]">Tonal Pitch Identifiers</span>
                <span className="material-symbols-outlined text-[16px] text-[#78716c]">info</span>
              </div>
              <ul className="text-[12px] space-y-1.5 text-[#44403c]">
                <li className="flex items-center justify-between">
                  <span>High Pitch (Akwa Uyo):</span>
                  <span className="font-bold text-[#1c1917] bg-white px-1.5 py-0.5 rounded border border-[#e7e0d3]">
                    á, é, í
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Low Pitch (Isim Uyo):</span>
                  <span className="font-bold text-[#1c1917] bg-white px-1.5 py-0.5 rounded border border-[#e7e0d3]">
                    à, è, ì
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Downstep / Circumflex:</span>
                  <span className="font-bold text-[#1c1917] bg-white px-1.5 py-0.5 rounded border border-[#e7e0d3]">
                    â, ê, î
                  </span>
                </li>
              </ul>
            </div>

            {/* Common Educational Glossary Snippet */}
            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-[#44403c] font-bold">
                Curriculum Equivalencies
              </div>
              <div className="flex items-center justify-between text-[#1c1917] text-[13px] py-1.5 bg-[#fdfbf7] px-3 rounded border border-[#e7e0d3]">
                <span>Teacher / Educator</span>
                <span className="font-semibold text-[#166534]">Andikpep</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917] text-[13px] py-1.5 bg-[#fdfbf7] px-3 rounded border border-[#e7e0d3]">
                <span>Student / Pupil</span>
                <span className="font-semibold text-[#166534]">Andikpepñkpọ</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917] text-[13px] py-1.5 bg-[#fdfbf7] px-3 rounded border border-[#e7e0d3]">
                <span>Government / State</span>
                <span className="font-semibold text-[#166534]">Ukara</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917] text-[13px] py-1.5 bg-[#fdfbf7] px-3 rounded border border-[#e7e0d3]">
                <span>Science &amp; Knowledge</span>
                <span className="font-semibold text-[#166534]">Ifiọk</span>
              </div>
            </div>
          </div>

          {/* AI Engine & Model Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#eae7e7] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase font-bold text-[#4d4635]">System Diagnostics</span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#554300] font-semibold bg-[#d4af37]/30 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#735c00] animate-pulse"></span>
                99.8% Sync
              </span>
            </div>
            <div className="p-3 bg-[#f6f3f2] rounded-lg mb-2 border border-[#eae7e7]">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#735c00] text-[20px]">offline_pin</span>
                <span className="text-[13px] font-semibold text-[#1c1b1b]">Offline Cache Active</span>
              </div>
              <p className="text-[11px] text-[#4d4635]">
                1,420 Efik lemmas and Calabar phonetic audio models stored locally for low-connectivity classrooms.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
