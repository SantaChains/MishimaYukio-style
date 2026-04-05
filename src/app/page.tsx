import AuroraBackground from "./components/AuroraBackground";
import SakuraParticles from "./components/SakuraParticles";
import CursorGlow from "./components/CursorGlow";
import Hero from "./components/Hero";
import QuotesSection from "./components/QuotesSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      {/* 全局背景效果 */}
      <AuroraBackground />
      <SakuraParticles />
      <CursorGlow />

      {/* 页面内容 */}
      <div className="relative z-10">
        <Hero />
        <QuotesSection />
        <Footer />
      </div>
    </main>
  );
}
