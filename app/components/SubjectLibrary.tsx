import React, { useState, useEffect } from "react";
import { API_BASE } from "@/lib/config";

interface SubjectItem {
  id: string;
  name: string;
  slug?: string;
}

interface BackendLessonItem {
  id: string;
  title: string;
  subjectName?: string | null;
  totalPages?: number;
  createdAt: string;
}

interface SubjectLibraryProps {
  onSelectLesson: (lessonId: string) => void;
  onNewTranslation: () => void;
}

interface LessonCardData {
  id: string;
  title: string;
  efikTitle: string;
  category: "STEM" | "Arts & Culture" | "Humanities & History" | "Civics & Languages";
  date: string;
  description: string;
  wordCount: number;
  audioDuration: string;
  hasAudio: boolean;
  isOffline: boolean;
}

export const SubjectLibrary: React.FC<SubjectLibraryProps> = ({
  onSelectLesson,
  onNewTranslation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewLayout, setViewLayout] = useState<"grid" | "table">("grid");
  const [backendLessons, setBackendLessons] = useState<LessonCardData[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  const lessons: LessonCardData[] = [
    {
      id: "water-cycle",
      title: "The Water Cycle in Efik",
      efikTitle: "Mkpañkpa Mmọñ ye Ndotukpo",
      category: "STEM",
      date: "Oct 12, 2023",
      description:
        "Detailed bilingual unit covering evaporation, condensation, and tropical wetland preservation in Cross River.",
      wordCount: 412,
      audioDuration: "04:15",
      hasAudio: true,
      isOffline: true,
    },
    {
      id: "calabar-trade",
      title: "Pre-Colonial Calabar Trade Routes & Efik Monarchies",
      efikTitle: "Enying Mme Obong ye Urua Calabar",
      category: "Humanities & History",
      date: "Sep 28, 2023",
      description:
        "Historic riverway commerce, ancient Creek Town settlements, and diplomatic records preserved in standard literary orthography.",
      wordCount: 850,
      audioDuration: "08:30",
      hasAudio: true,
      isOffline: true,
    },
    {
      id: "nsibidi-justice",
      title: "Civic Rights, Nsibidi Symbols & Communal Justice",
      efikTitle: "Mbet ye Uwem Obio ke Nsibidi",
      category: "Civics & Languages",
      date: "Aug 14, 2023",
      description:
        "Constitutional civic rights parallel to indigenous Cross River consensus decision-making and ethical codes.",
      wordCount: 620,
      audioDuration: "06:10",
      hasAudio: true,
      isOffline: false,
    },
    {
      id: "photosynthesis-botany",
      title: "Photosynthesis & Rainforest Botany",
      efikTitle: "Mme Eto Ikọt ye Ifiọk Efik",
      category: "STEM",
      date: "Jul 22, 2023",
      description:
        "Plant cellular biology and medicinal herb taxonomy recorded with traditional Efik botanical designations.",
      wordCount: 540,
      audioDuration: "05:40",
      hasAudio: true,
      isOffline: true,
    },
    {
      id: "ekpe-governance",
      title: "Ekpe Society Traditional Governance & Ethical Laws",
      efikTitle: "Ekpe ye Nka Mme Efik",
      category: "Arts & Culture",
      date: "Jun 10, 2023",
      description:
        "Anthropological and sociological study of the Ekpe council legal system and judicial authority.",
      wordCount: 780,
      audioDuration: "07:20",
      hasAudio: true,
      isOffline: true,
    },
    {
      id: "mangrove-ecology",
      title: "Marine Ecology of Calabar Mangroves & Estuaries",
      efikTitle: "Inyañ ye Mben Mmọñ Efik",
      category: "STEM",
      date: "May 05, 2023",
      description:
        "Mangrove root conservation, artisanal fishing methods, and brackish aquatic biodiversity vocabulary.",
      wordCount: 920,
      audioDuration: "09:05",
      hasAudio: false,
      isOffline: false,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [subjectsRes, lessonsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/subjects?page=1&limit=50`, { credentials: "include" }),
          fetch(`${API_BASE}/api/lessons?page=1&limit=50`, { credentials: "include" }),
        ]);

        if (isMounted) {
          // Parse subjects
          if (subjectsRes.status === "fulfilled" && subjectsRes.value.ok) {
            const rawSubjects = await subjectsRes.value.json().catch(() => null);
            const list = Array.isArray(rawSubjects) ? rawSubjects : rawSubjects?.data;
            if (Array.isArray(list) && list.length > 0) {
              setSubjectsList(list);
              setIsLiveConnected(true);
            }
          }

          // Parse lessons
          if (lessonsRes.status === "fulfilled" && lessonsRes.value.ok) {
            const rawLessons = await lessonsRes.value.json().catch(() => null);
            const list = Array.isArray(rawLessons?.lessons) ? rawLessons.lessons : [];
            if (list.length > 0) {
              const mapped: LessonCardData[] = list.map((l: BackendLessonItem) => ({
                id: l.id,
                title: l.title,
                efikTitle: "Mkpañkpa Mme Ikọ",
                category: (l.subjectName as any) || "STEM",
                date: new Date(l.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                description: `Curriculum unit with ${l.totalPages || 1} translated pages in standard Calabar Efik.`,
                wordCount: (l.totalPages || 1) * 350,
                audioDuration: "05:20",
                hasAudio: true,
                isOffline: true,
              }));
              setBackendLessons(mapped);
              setIsLiveConnected(true);
            }
          }
        }
      } catch (err) {
        console.warn("Using offline curriculum lessons cache:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeLessonsList = backendLessons.length > 0 ? backendLessons : lessons;

  const categories = [
    { label: `All Lessons (${activeLessonsList.length})`, id: "All" },
    ...(subjectsList.length > 0
      ? subjectsList.map((s) => ({
        label: s.name,
        id: s.name,
      }))
      : [
        { label: "STEM (8)", id: "STEM" },
        { label: "Arts & Culture (6)", id: "Arts & Culture" },
        { label: "Humanities & History (7)", id: "Humanities & History" },
        { label: "Civics & Languages (3)", id: "Civics & Languages" },
      ]),
    { label: "Available Offline", id: "Offline" },
  ];

  const filteredLessons = activeLessonsList.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.efikTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === "All") return true;
    if (activeCategory === "Offline") return lesson.isOffline;
    return lesson.category === activeCategory;
  });

  return (
    <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 py-8 flex flex-col gap-6">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-1.5 text-[#735c00] text-[12px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">folder_special</span>
            <span>Archival Repository</span>
            <span className="text-[#d0c5af]">/</span>
            <span className="text-[#4d4635] font-normal">Cross River Curriculum Core</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${isLiveConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
            >
              {isLiveConnected ? "● Live Cloud Backend" : "○ Offline Cache"}
            </span>
          </div>
          <h1 className="font-['Libre_Caslon_Text',serif] text-[32px] font-bold text-[#e8720c] tracking-tight">
            My Lesson Library
          </h1>
          <p className="text-[15px] text-[#44403c]">
            Your archived lessons, translated curriculum units, and verified acoustic recordings in standard Efik
            orthography.
          </p>
        </div>

        {/* Action & Search Strip */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7f7663] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, lesson title, or Efik keyword..."
              className="w-full pl-10 pr-3 py-2 bg-white text-[#1c1917] placeholder:text-[#a8a29e] text-[14px] rounded-lg shadow-sm border border-[#e7e0d3] focus:outline-none focus:ring-2 focus:ring-[#e8720c] transition-all"
            />
          </div>
          <button
            onClick={onNewTranslation}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] text-white text-[14px] font-bold rounded-xl shadow-md shadow-[#e8720c]/25 hover:shadow-lg transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">
              add
            </span>
            <span>New Translation</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-xl shadow-sm border border-[#e7e0d3]">
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-[#44403c]">Total Translated Lessons</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Libre_Caslon_Text',serif] text-[26px] font-bold text-[#1c1917]">24</span>
            <span className="text-[12px] font-bold text-[#166534]">+3 this month</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-[#44403c]">Audio Native Pairings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Libre_Caslon_Text',serif] text-[26px] font-bold text-[#e8720c]">19 Units</span>
            <span className="text-[12px] text-[#44403c]">79%</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-[#44403c]">Curricular Orthography</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Libre_Caslon_Text',serif] text-[26px] font-bold text-[#1c1917]">Level 4</span>
            <span className="text-[12px] text-[#44403c]">Strict Calabar</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-[#44403c]">Synchronized Offline</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Libre_Caslon_Text',serif] text-[26px] font-bold text-[#166534]">19 Saved</span>
            <span className="material-symbols-outlined text-[#166534] text-[18px]">check_circle</span>
          </div>
        </div>
      </div>

      {/* Filters, Tabs & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${isActive
                    ? "bg-[#e8720c] text-white shadow-sm"
                    : cat.id === "Offline"
                      ? "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]"
                      : "bg-[#f7f3ec] text-[#44403c] hover:bg-[#e7e0d3] border border-[#e7e0d3]"
                  }`}
              >
                {cat.id === "Offline" ? (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">cloud_done</span>
                    {cat.label}
                  </span>
                ) : (
                  cat.label
                )}
              </button>
            );
          })}
        </div>

        {/* Sort & Display Toggles */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#4d4635]">Sort by:</span>
            <select className="bg-white text-[#1c1b1b] text-[13px] font-medium rounded-lg px-2.5 py-1.5 border border-[#eae7e7] shadow-sm focus:outline-none">
              <option>Recently Translated</option>
              <option>Alphabetical (A-Z)</option>
              <option>Word Count (High-Low)</option>
              <option>Audio Completeness</option>
            </select>
          </div>

          <div className="flex items-center bg-[#f7f3ec] rounded-lg p-0.5 border border-[#e7e0d3]">
            <button
              onClick={() => setViewLayout("grid")}
              aria-label="Grid view"
              className={`p-1.5 rounded transition-colors ${viewLayout === "grid" ? "bg-white text-[#e8720c] shadow-sm font-bold" : "text-[#44403c]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewLayout("table")}
              aria-label="Table view"
              className={`p-1.5 rounded transition-colors ${viewLayout === "table" ? "bg-white text-[#e8720c] shadow-sm font-bold" : "text-[#44403c]"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Content Grid */}
      {viewLayout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="flex flex-col justify-between bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-[#e7e0d3] hover:border-[#e8720c]/40 transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#166534] group-hover:h-1.5 group-hover:bg-[#e8720c] transition-all"></div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${lesson.category === "STEM"
                        ? "bg-[#fef3c7] text-[#78350f]"
                        : lesson.category === "Arts & Culture"
                          ? "bg-[#fed7aa] text-[#9a3412]"
                          : lesson.category === "Civics & Languages"
                            ? "bg-[#dcfce7] text-[#166534]"
                            : "bg-[#f7f3ec] text-[#44403c]"
                      }`}
                  >
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#44403c] text-[12px]">
                    <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                    <span>{lesson.date}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 mt-1">
                  <h3 className="font-['Libre_Caslon_Text',serif] text-[19px] font-bold text-[#1c1917] group-hover:text-[#e8720c] transition-colors leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-[13px] text-[#166534] italic font-semibold">{lesson.efikTitle}</p>
                </div>

                <p className="text-[13px] text-[#44403c] line-clamp-2 mt-1 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e7e0d3] text-[12px] text-[#44403c]">
                <div className="flex items-center gap-2">
                  <span>{lesson.wordCount} words</span>
                  {lesson.hasAudio && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-[#e8720c] font-semibold">
                        <span className="material-symbols-outlined text-[15px]">volume_up</span>
                        {lesson.audioDuration}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[#166534] font-bold group-hover:text-[#e8720c] group-hover:translate-x-1 transition-all">
                  <span>Read Lesson</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-[#eae7e7] overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#f6f3f2] text-[#4d4635] text-[12px] uppercase font-bold border-b border-[#eae7e7]">
              <tr>
                <th className="p-4">Lesson Topic</th>
                <th className="p-4">Category</th>
                <th className="p-4">Words</th>
                <th className="p-4">Audio Status</th>
                <th className="p-4">Offline</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae7e7]">
              {filteredLessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className="hover:bg-[#f6f3f2]/60 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-medium text-[#1c1b1b]">
                    <div>{lesson.title}</div>
                    <div className="text-[12px] text-[#735c00] italic">{lesson.efikTitle}</div>
                  </td>
                  <td className="p-4 text-[#4d4635]">{lesson.category}</td>
                  <td className="p-4 text-[#4d4635]">{lesson.wordCount}</td>
                  <td className="p-4">
                    {lesson.hasAudio ? (
                      <span className="text-[#e8720c] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        {lesson.audioDuration}
                      </span>
                    ) : (
                      <span className="text-[#7f7663]">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    {lesson.isOffline ? (
                      <span className="material-symbols-outlined text-[#735c00] text-[18px]">check_circle</span>
                    ) : (
                      <span className="text-[#7f7663]">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-[#735c00] font-bold text-[13px] hover:underline">
                      Open &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
