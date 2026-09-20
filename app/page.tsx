"use client"
import React from "react";
import { EduTranslateApp } from "./components/EduTranslateApp";


export default function Home() {
  return (
    <React.StrictMode>
      <EduTranslateApp initialTab="input-hub" />
    </React.StrictMode>
  )
}

