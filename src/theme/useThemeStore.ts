import { create } from 'zustand'

export type ThemeName = 'sky' | 'sunset' | 'mint' | 'lilac'

interface ThemeState {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

// data-theme 속성을 <html>에 반영해서 index.css의 CSS 변수를 전환한다.
function applyThemeToDocument(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'sky',
  setTheme: (theme) => {
    applyThemeToDocument(theme)
    set({ theme })
  },
}))
