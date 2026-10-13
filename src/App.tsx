import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Film,
  Layers,
  Download,
  Terminal,
  Cpu,
  Clock,
  User,
  CheckCircle,
  Tv,
  Share2,
  BookOpen,
  HelpCircle,
  Gamepad2,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { Tutorial } from './types/tutorial';
import { PRESET_TUTORIALS } from './data/presetTutorials';
import { VideoStudioPlayer } from './components/video-player/VideoStudioPlayer';
import { AIStudioGeneratorModal } from './components/generator/AIStudioGeneratorModal';
import { SceneEditorModal } from './components/editor/SceneEditorModal';
import { ExportModal } from './components/export/ExportModal';
import { InteractiveSandboxMode } from './components/interactive/InteractiveSandboxMode';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [tutorials, setTutorials] = useState<Tutorial[]>(PRESET_TUTORIALS);
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(PRESET_TUTORIALS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabMode, setActiveTabMode] = useState<'video' | 'practice'>('video');

  // Modals state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Active tutorial
  const activeTutorial = tutorials.find((t) => t.id === selectedTutorialId) || tutorials[0];

  // URL query parameter synchronization (e.g. ?tutorial=roseram-101-getting-started)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tutParam = params.get('tutorial');
    if (tutParam) {
      const match = tutorials.find((t) => t.id === tutParam);
      if (match) setSelectedTutorialId(match.id);
    }
  }, [tutorials]);

  // Handle new tutorial generation
  const handleTutorialGenerated = (newTutorial: Tutorial) => {
    setTutorials([newTutorial, ...tutorials]);
    setSelectedTutorialId(newTutorial.id);
    setActiveTabMode('video');
  };

  // Handle scene editor save
  const handleTutorialUpdated = (updated: Tutorial) => {
    setTutorials(tutorials.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Filtered tutorials
  const filteredTutorials = tutorials.filter((tut) => {
    const matchesCategory = selectedCategory === 'All' || tut.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      tut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      isDark
        ? 'bg-zinc-950 text-zinc-100 selection:bg-rose-500/30 selection:text-rose-200'
        : 'bg-slate-50 text-slate-900 selection:bg-rose-500/20 selection:text-rose-900'
    }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between transition-colors ${
        isDark
          ? 'border-zinc-800/80 bg-zinc-950/90'
          : 'border-slate-200 bg-white/90 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-md shadow-rose-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Roseram Video Studio
              </span>
              <span className="text-[10px] bg-rose-500/10 text-rose-600 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-mono font-medium">
                Roseram.com
              </span>
            </div>
            <p className={`text-[10px] hidden sm:block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Interactive How-To Video Generator & Tutorial Studio
            </p>
          </div>
        </div>

        {/* Center / Right Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher: Video vs Hands-on Sandbox */}
          <div className={`flex items-center border rounded-lg p-0.5 text-xs ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTabMode('video')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                activeTabMode === 'video'
                  ? isDark
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'bg-white text-slate-900 font-semibold shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-500" />
              <span>Watch Video</span>
            </button>
            <button
              onClick={() => setActiveTabMode('practice')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                activeTabMode === 'practice'
                  ? isDark
                    ? 'bg-zinc-800 text-emerald-400 font-medium shadow-sm'
                    : 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Practice Sandbox</span>
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span className="text-[11px] font-medium hidden md:inline">
              {isDark ? 'Light Mode' : 'Light Mode (Active)'}
            </span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-rose-900/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Video</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Active Tutorial Showcase Section */}
        <section className="space-y-4">
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${
            isDark
              ? 'bg-zinc-900/40 border-zinc-800/60'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                  activeTutorial.themeColor === 'emerald'
                    ? isDark
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : activeTutorial.themeColor === 'cyan'
                    ? isDark
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : activeTutorial.themeColor === 'amber'
                    ? isDark
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                    : isDark
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {activeTutorial.category}
                </span>
                <span className={isDark ? 'text-zinc-600 text-xs' : 'text-slate-300 text-xs'}>•</span>
                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <Clock className="w-3 h-3" />
                  {activeTutorial.estimatedDuration}s total
                </span>
                <span className={isDark ? 'text-zinc-600 text-xs' : 'text-slate-300 text-xs'}>•</span>
                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <User className="w-3 h-3" />
                  Audience: {activeTutorial.targetAudience}
                </span>
              </div>

              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTutorial.title}
              </h1>
              <p className={`text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {activeTutorial.description}
              </p>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsEditorOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Edit Scenes & Narration"
              >
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>Customize</span>
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Export or Download"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Player or Practice Sandbox */}
          {activeTabMode === 'video' ? (
            <VideoStudioPlayer
              tutorial={activeTutorial}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenEditor={() => setIsEditorOpen(true)}
            />
          ) : (
            <InteractiveSandboxMode
              tutorial={activeTutorial}
              onExit={() => setActiveTabMode('video')}
            />
          )}

          {/* Scene Chapter Summary Bar */}
          <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors ${
            isDark
              ? 'bg-zinc-900/60 border-zinc-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>
                Tutorial Storyboard Scenes ({activeTutorial.scenes.length})
              </span>
              <span className={`font-mono text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                Click any step to inspect
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {activeTutorial.scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className={`p-2.5 rounded-lg border transition-colors flex flex-col justify-between ${
                    isDark
                      ? 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-slate-50 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className={`flex items-center justify-between text-[10px] font-mono mb-1 ${
                      isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}>
                      <span>Step {idx + 1}</span>
                      <span>{scene.duration}s</span>
                    </div>
                    <div className={`text-xs font-semibold truncate ${
                      isDark ? 'text-zinc-200' : 'text-slate-800'
                    }`}>
                      {scene.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-rose-600 font-mono uppercase mt-1 font-medium">
                    {scene.focusArea}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorial Library Section */}
        <section className={`space-y-4 pt-4 border-t ${
          isDark ? 'border-zinc-800/80' : 'border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Film className="w-4 h-4 text-rose-500" />
                Roseram.com How-To Video Library
              </h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Browse pre-built video guides covering agentic coding, multi-model routing, and campaign automation.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${
                isDark ? 'text-zinc-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or tags..."
                className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-500'
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-xs'
                }`}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Getting Started', 'Agentic Coding', 'Multi-Model', 'Campaign Studio', 'Deployment'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white font-medium border-rose-600 shadow-xs'
                      : isDark
                      ? 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Tutorials Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTutorials.map((tut) => {
              const isSelected = tut.id === selectedTutorialId;

              return (
                <div
                  key={tut.id}
                  onClick={() => {
                    setSelectedTutorialId(tut.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? isDark
                        ? 'bg-zinc-900 border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                        : 'bg-rose-50/40 border-rose-400 shadow-md ring-1 ring-rose-400'
                      : isDark
                      ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-rose-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Badge & Duration */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tut.category}
                      </span>
                      <span className={`text-xs flex items-center gap-1 font-mono ${
                        isDark ? 'text-zinc-400' : 'text-slate-500'
                      }`}>
                        <Clock className="w-3 h-3 text-slate-400" />
                        {tut.estimatedDuration}s
                      </span>
                    </div>

                    <h3 className={`font-bold text-sm transition-colors line-clamp-1 ${
                      isDark ? 'text-white group-hover:text-rose-400' : 'text-slate-900 group-hover:text-rose-600'
                    }`}>
                      {tut.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-zinc-400' : 'text-slate-600'
                    }`}>
                      {tut.description}
                    </p>
                  </div>

                  <div className={`pt-3 mt-3 border-t flex items-center justify-between ${
                    isDark ? 'border-zinc-800/60' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1">
                      {tut.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className={`text-[9px] px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-zinc-800/60 text-zinc-500' : 'bg-slate-100 text-slate-500'
                        }`}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                      <span>{isSelected ? 'Now Playing' : 'Watch Video'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roseram Feature Reference / FAQ Hub */}
        <section className={`border rounded-2xl p-5 sm:p-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-zinc-900/40 border-zinc-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              About Roseram.com & How-To Video Production
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isDark
                ? 'bg-zinc-950/70 border-zinc-800/80'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}>
              <div className={`font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-zinc-100' : 'text-slate-900'
              }`}>
                <Cpu className="w-4 h-4 text-violet-500" />
                <span>Multi-Model Prompt Routing</span>
              </div>
              <p className={isDark ? 'text-zinc-400' : 'text-slate-600 leading-relaxed'}>
                Roseram integrates Claude 3.7 Sonnet, GPT-4o, and Gemini 2.5 Pro without prompt fragmentation. The studio auto-routes prompts to the best model for code, planning, or speed.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isDark
                ? 'bg-zinc-950/70 border-zinc-800/80'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}>
              <div className={`font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-zinc-100' : 'text-slate-900'
              }`}>
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span>Bounded Automation & Diffs</span>
              </div>
              <p className={isDark ? 'text-zinc-400' : 'text-slate-600 leading-relaxed'}>
                Unlike unconstrained auto-coders, Roseram introduces human-in-the-loop review gates. The agent presents color-coded diffs and runs terminal tests in a secure sandbox.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isDark
                ? 'bg-zinc-950/70 border-zinc-800/80'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}>
              <div className={`font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-zinc-100' : 'text-slate-900'
              }`}>
                <Film className="w-4 h-4 text-cyan-600" />
                <span>Generative Campaign Studio</span>
              </div>
              <p className={isDark ? 'text-zinc-400' : 'text-slate-600 leading-relaxed'}>
                Provide any website URL to extract core value propositions and auto-generate high-converting email sequences, LinkedIn threads, and social launch copy.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 transition-colors ${
        isDark
          ? 'border-zinc-800/80 bg-zinc-950 text-zinc-500'
          : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">Roseram Video Studio</span>
          <span>•</span>
          <span>Interactive How-To Video Generator for Roseram.com</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Light Theme Active
          </span>
        </div>
      </footer>

      {/* Generator Modal */}
      <AIStudioGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onTutorialGenerated={handleTutorialGenerated}
      />

      {/* Scene Editor Modal */}
      <SceneEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        tutorial={activeTutorial}
        onSave={handleTutorialUpdated}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tutorial={activeTutorial}
      />
    </div>
  );
}
