"use client"
import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { LessonInputHub } from "./LessonInputHub";
import { DualLanguageReader } from "./DualLanguageReader";
import { SubjectLibrary } from "./SubjectLibrary";
import { AudioArchives } from "./AudioArchives";
import { Footer } from "./Footer";
import { AuthPage } from "./AuthPage";
import { API_BASE } from "@/lib/config";

export type NavTab = "input-hub" | "dual-language-reader" | "subject-library" | "audio-archives";

export interface EduTranslateAppProps {
  initialTab?: NavTab;
}

export const EduTranslateApp: React.FC<EduTranslateAppProps> = ({
  initialTab = "input-hub",
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("water-cycle");
  const [user, setUser] = useState<{ name: string; email: string } | null | undefined>(undefined);
  // undefined = loading, null = not logged in, object = logged in

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/get-session`, { credentials: "include" });
        const data = res.ok ? await res.json() : null;

        if (data?.user) {
          setUser({ name: data.user.name ?? data.user.email, email: data.user.email });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    checkSession();
  }, []);

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab("dual-language-reader");
  };

  const handleNewTranslation = () => {
    setActiveTab("input-hub");
  };

  const handleSignOut = async () => {
    await fetch(`${API_BASE}/api/auth/sign-out`, { method: "POST", credentials: "include" }).catch(() => { });
    setUser(null);
  };

  // Loading splash while checking session
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8720C] to-[#C25E0A] flex items-center justify-center shadow-lg animate-pulse ring-2 ring-[#D4AF37]/50">
            <span className="material-symbols-outlined text-[#FDE68A] text-[26px]">menu_book</span>
          </div>
          <p className="text-[13px] text-[#44403C] font-medium tracking-wide">Loading EduTranslate...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show auth gate
  if (user === null) {
    // return <AuthPage onAuthSuccess={(u) => setUser(u)} />;
  }

  // Authenticated — show full app
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col font-sans selection:bg-[#FDE68A] selection:text-[#78350F]">
      {/* Top Application Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} user={user ?? undefined} onSignOut={handleSignOut} />

      {/* Main Tab Content with smooth transition */}
      <main className="flex-1 w-full pt-16">
        {activeTab === "input-hub" && (
          <LessonInputHub
            onTranslateComplete={() => setActiveTab("dual-language-reader")}
          />
        )}

        {activeTab === "dual-language-reader" && (
          <DualLanguageReader
            lessonId={selectedLessonId}
            onBackToLibrary={() => setActiveTab("subject-library")}
          />
        )}

        {activeTab === "subject-library" && (
          <SubjectLibrary
            onSelectLesson={handleOpenLesson}
            onNewTranslation={handleNewTranslation}
          />
        )}

        {activeTab === "audio-archives" && (
          <AudioArchives onOpenReader={() => setActiveTab("dual-language-reader")} />
        )}
      </main>

      {/* Persistent Heritage Footer */}
      <Footer />
    </div>
  );
};

export default EduTranslateApp;
