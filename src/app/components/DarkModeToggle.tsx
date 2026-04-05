'use client';

import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 检查localStorage或系统偏好
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  // 防止hydration不匹配，在客户端挂载前不渲染按钮
  if (!mounted || darkMode === null) {
    return (
      <div className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 w-10 h-10" />
    );
  }

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-200 hover:scale-110"
      aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {darkMode ? '🌞' : '🌙'}
    </button>
  );
}