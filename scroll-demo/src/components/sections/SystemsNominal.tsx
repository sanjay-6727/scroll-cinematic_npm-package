"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Check, Terminal, Code, Cpu, BookOpen } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";

type Tab = "install" | "api" | "usage";

export function SystemsNominal() {
  const [activeTab, setActiveTab] = useState<Tab>("install");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const installCommand = "npm install scroll-cinematic";
  const usageCode = `import { ScrollSequence } from "scroll-cinematic";

const DIALOGUES = [
  {
    id: "scene-1",
    show: 0.1,
    hide: 0.35,
    title: "01 — Introduction",
    text: "Cinematic scroll sequences create immersive experiences.",
    author: "Author Name",
    source: "DOCS — 2026",
  }
];

export default function HeroSection() {
  return (
    <ScrollSequence
      frames="/frames/frame_%04d.webp"
      frameCount={192}
      height="300vh"
      dialogues={DIALOGUES}
      title="Cinematic Scroll"
      subtitle="GPU accelerated frame sequencing"
    />
  );
}`;

  return (
    <section
      id="systems"
      className="relative border-t border-white/5 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[5fr_4fr] md:gap-20 mb-16">
          <AnimatedSection className="flex flex-col gap-6">
            <AnimatedItem>
              <EyebrowBadge>NPM PACKAGE // DOCUMENTATION</EyebrowBadge>
            </AnimatedItem>
            <AnimatedItem>
              <h2 className="max-w-[16ch] font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl">
                Ready for <span className="text-accent">Production</span> integration.
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <p className="max-w-[48ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                Integrate high-performance scroll-driven canvas frame sequences with zero external animation dependencies. Read the API, install the package, and configure in seconds.
              </p>
            </AnimatedItem>
          </AnimatedSection>
          
          <AnimatedSection className="flex flex-col justify-end items-start md:items-end">
            <AnimatedItem>
              <a
                href="https://www.npmjs.com/package/scroll-cinematic"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-200 hover:bg-accent/20 hover:border-accent/50 active:translate-y-[1px]"
              >
                View on NPM Registry
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </AnimatedItem>
          </AnimatedSection>
        </div>

        {/* Interactive Documentation Panel */}
        <AnimatedSection className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 border border-white/5 rounded-2xl bg-white/[0.01] p-6 md:p-8 backdrop-blur-xl">
          {/* Sidebar Menu */}
          <AnimatedItem className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/5 lg:pr-6 whitespace-nowrap scrollbar-none">
            {[
              { id: "install", label: "Installation", icon: Terminal },
              { id: "usage", label: "React Usage", icon: Code },
              { id: "api", label: "API Reference", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-accent/10 border border-accent/20 text-accent font-semibold"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </AnimatedItem>

          {/* Tab Content Panels */}
          <AnimatedItem className="min-h-[400px] flex flex-col justify-between">
            {activeTab === "install" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-foreground mb-2">Get Started Instantly</h3>
                  <p className="font-sans text-sm text-zinc-400">Install the core module to your project dependencies. Requires React v18 or newer.</p>
                </div>
                
                {/* Bash snippet */}
                <div className="relative group rounded-xl border border-white/8 bg-black/40 p-5 font-mono text-sm text-zinc-300">
                  <div className="flex justify-between items-center mb-3 text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    <span>CLI Command</span>
                    <button
                      onClick={() => handleCopy(installCommand, "cli")}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === "cli" ? (
                        <>
                          <Check size={12} className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <code className="text-accent font-semibold">{installCommand}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 font-sans">
                  {[
                    { title: "Zero Dependencies", desc: "No GSAP, three.js, Framer Motion dependency on the animation engine.", icon: Cpu },
                    { title: "Hardware Scaled", desc: "Canvas rendering fits seamlessly on both mobile screens and huge desktops.", icon: Terminal },
                    { title: "Preload Engine", desc: "Downloads images in parallel in background memory to guarantee zero lag.", icon: Code }
                  ].map((feat, idx) => {
                    const FeatIcon = feat.icon;
                    return (
                      <div key={idx} className="flex flex-col gap-2 p-4 border border-white/5 rounded-xl bg-white/[0.01]">
                        <div className="text-accent mb-1"><FeatIcon size={20} /></div>
                        <h4 className="text-sm font-semibold text-foreground">{feat.title}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-foreground mb-2">Basic Component Integration</h3>
                  <p className="font-sans text-sm text-zinc-400">Import and configure the `ScrollSequence` component in any React/Next.js App Router page.</p>
                </div>

                {/* Code snippet block */}
                <div className="relative group rounded-xl border border-white/8 bg-black/40 p-5 font-mono text-xs text-zinc-300 max-h-[300px] overflow-y-auto">
                  <div className="sticky top-0 flex justify-between items-center mb-3 text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 bg-black/10 backdrop-blur-sm">
                    <span>Component Implementation</span>
                    <button
                      onClick={() => handleCopy(usageCode, "code")}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === "code" ? (
                        <>
                          <Check size={12} className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-zinc-400 select-all">{usageCode}</pre>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="flex flex-col gap-6 font-sans">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">API Reference & Props</h3>
                  <p className="text-sm text-zinc-400">The following options can be passed to configure the <code>{"<ScrollSequence />"}</code> component.</p>
                </div>

                <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/20">
                  <table className="min-w-full divide-y divide-white/5 font-mono text-[11px] text-left">
                    <thead className="bg-white/[0.02] text-zinc-400 uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="px-4 py-3">Prop</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Default</th>
                        <th className="px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {[
                        { prop: "frames", type: "string | function", def: "REQUIRED", desc: "Template path to webp frames e.g. /frames/frame_%04d.webp" },
                        { prop: "frameCount", type: "number", def: "REQUIRED", desc: "Total number of images in sequence" },
                        { prop: "height", type: "string", def: "300vh", desc: "Height of the scrollable sequence section container" },
                        { prop: "dialogues", type: "Dialogue[]", def: "[]", desc: "Array of subtitles/timed overlays triggered by scroll" },
                        { prop: "stickyCanvas", type: "boolean", def: "true", desc: "Sticks canvas to viewport while scrolling container" },
                        { prop: "mobileZoom", type: "number", def: "1.3", desc: "Slight scale multiplier on screen widths ≤ 768px" },
                        { prop: "textFadeEnd", type: "number", def: "0.08", desc: "Progress threshold (0-1) where main title fades out" },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-3 text-accent font-semibold">{item.prop}</td>
                          <td className="px-4 py-3 text-zinc-400">{item.type}</td>
                          <td className="px-4 py-3 text-zinc-500">{item.def}</td>
                          <td className="px-4 py-3 text-zinc-400 font-sans text-xs">{item.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
