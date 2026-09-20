# EduTranslate Efik - Heritage Learning React Components

Interactive, stateful React components built from the Heritage Learning Design System:
- **Input Hub** (`LessonInputHub`)
- **Dual-Language Reader** (`DualLanguageReader`)
- **Subject Library** (`SubjectLibrary`)
- **Audio Archives** (`AudioArchives`)

## How to Use

```tsx
import React from "react";
import EduTranslateApp from "./components/EduTranslateApp";

export default function App() {
  return <EduTranslateApp initialTab="input-hub" />;
}
```

### Direct Tab Switching

When you click on the navigation tabs in the header:
- **"Input Hub"** displays the rich text/curriculum input workspace with diacritic typing, word counter, and the Efik Orthography Guide.
- **"Dual-Language Reader"** displays the synchronized parallel English & Efik reader with sentence-level focus, phonetic IPA guides, and the audio playback bar.
- **"Subject Library"** displays your searchable curriculum collection with filters (STEM, Arts & Culture, Humanities, Civics, Offline) and direct "Read Lesson" cards that launch into the reader.
- **"Audio Archives"** displays the acoustic repository and offline audio packs.

## Required Fonts & Icons in your `index.html` or Next.js layout:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```
