import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import type { StudentData } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  studentData: StudentData;
  onLogout: () => void;
}

export default function Layout({ children, studentData, onLogout }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-[#F8F9FA] overflow-hidden font-sans">
      <Header studentData={studentData} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto pt-20 pb-24 scroll-smooth overflow-x-hidden">
        <div className="w-full">
          {children}
        </div>
        <div className="h-10" />
      </main>

      {/* Bottom Nav dengan efek Glassmorphism yang lebih kuat */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-gray-100 z-[1000] pb-safe">
        <div className="w-full max-w-6xl mx-auto">
          <BottomNav />
        </div>
      </nav>
    </div>
  );
}