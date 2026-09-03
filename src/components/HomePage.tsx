import React from 'react';
import {
  ArrowRight,
  ArrowDown,
  Target,
  Puzzle,
  Lightbulb,
  BookOpen,
  Star,
  Zap,
  Database,
  Globe,
  FileText,
  List,
  Plus,
  Minus,
  Settings,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface HomePageProps {
  onContinueLearning: () => void;
  onExploreTopics: () => void;
  onNavigateToTab: (
    tab: 'THEORY' | 'VIDEO' | 'GAME' | 'QUEST' | 'LAB' | 'QUIZ' | 'PROGRESS',
    targetOption?: string | number
  ) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onExploreTopics,
  onNavigateToTab,
}) => {
  // Hook for smooth reveal animation on scroll
  useScrollReveal();

  const handleStartLearning = () => {
    soundManager.playPrimaryClick();
    onExploreTopics();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-7 font-sans text-slate-900 dark:text-slate-100 animate-page-enter pb-10 select-text">
      {/* =========================================================================
          SECTION 01: HERO SECTION & SINGLE LINKED LIST DIAGRAM
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#0B1228] p-6 sm:p-10 rounded-2xl border border-slate-200/90 dark:border-purple-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Side: Curriculum Label, Main Heading, & Educational Description */}
          <div className="lg:col-span-6 flex flex-col gap-3.5">
            {/* Small Curriculum Label */}
            <div className="flex items-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#4F46E5] dark:text-purple-400 uppercase">
                THEORY CURRICULUM • MODULE 01 • CHAPTER 01
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-[1.12]">
              Single Linked <br />
              <span>List</span>
            </h1>

            {/* Educational Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
              Learn how a single linked list stores elements using nodes, how the nodes are connected, and the basic operations to traverse, insert, and delete elements.
            </p>
          </div>

          {/* Right Side: Visual Single Linked List Diagram (Head -> [10|●] -> [20|●] -> [30|●] -> NULL) */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end overflow-x-auto py-2">
            <div className="flex flex-col items-start min-w-[340px] sm:min-w-[420px]">
              {/* Nodes Row with Head Pointer */}
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Node 1 with Head Label above */}
                <div className="flex flex-col items-center">
                  {/* Head pointer indicator */}
                  <div className="flex flex-col items-center mb-1">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white leading-none">Head</span>
                    <ArrowDown className="w-3.5 h-3.5 text-[#4F46E5] dark:text-purple-400 stroke-[2.5]" />
                  </div>

                  {/* Node 1 Body [ 10 | ● ] */}
                  <div className="flex items-stretch bg-[#FAF9FF] dark:bg-[#131B38] border-2 border-[#818CF8] dark:border-purple-500/70 rounded-xl p-1 shadow-2xs">
                    <div className="bg-white dark:bg-[#0B1228] px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-purple-500/30 flex items-center justify-center min-w-[32px] sm:min-w-[38px]">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">10</span>
                    </div>
                    <div className="bg-[#EEF2FF] dark:bg-purple-950/60 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center justify-center ml-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] dark:bg-purple-400" />
                    </div>
                  </div>

                  {/* Node Label Below */}
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">Node 1</span>
                </div>

                {/* Arrow 1 -> 2 */}
                <div className="flex items-center -mt-4">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1] dark:text-purple-400 stroke-[2.5]" />
                </div>

                {/* Node 2 [ 20 | ● ] */}
                <div className="flex flex-col items-center">
                  {/* Spacer for Head height alignment */}
                  <div className="h-[22px] mb-1" />

                  {/* Node 2 Body */}
                  <div className="flex items-stretch bg-[#FAF9FF] dark:bg-[#131B38] border-2 border-[#818CF8] dark:border-purple-500/70 rounded-xl p-1 shadow-2xs">
                    <div className="bg-white dark:bg-[#0B1228] px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-purple-500/30 flex items-center justify-center min-w-[32px] sm:min-w-[38px]">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">20</span>
                    </div>
                    <div className="bg-[#EEF2FF] dark:bg-purple-950/60 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center justify-center ml-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] dark:bg-purple-400" />
                    </div>
                  </div>

                  {/* Node Label Below */}
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">Node 2</span>
                </div>

                {/* Arrow 2 -> 3 */}
                <div className="flex items-center -mt-4">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1] dark:text-purple-400 stroke-[2.5]" />
                </div>

                {/* Node 3 [ 30 | ● ] */}
                <div className="flex flex-col items-center">
                  {/* Spacer for Head height alignment */}
                  <div className="h-[22px] mb-1" />

                  {/* Node 3 Body */}
                  <div className="flex items-stretch bg-[#FAF9FF] dark:bg-[#131B38] border-2 border-[#818CF8] dark:border-purple-500/70 rounded-xl p-1 shadow-2xs">
                    <div className="bg-white dark:bg-[#0B1228] px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-purple-500/30 flex items-center justify-center min-w-[32px] sm:min-w-[38px]">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">30</span>
                    </div>
                    <div className="bg-[#EEF2FF] dark:bg-purple-950/60 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center justify-center ml-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] dark:bg-purple-400" />
                    </div>
                  </div>

                  {/* Node Label Below */}
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">Node 3</span>
                </div>

                {/* Arrow 3 -> NULL */}
                <div className="flex items-center -mt-4">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1] dark:text-purple-400 stroke-[2.5]" />
                </div>

                {/* NULL End Terminal */}
                <div className="flex flex-col items-center -mt-4">
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A] dark:text-slate-200 uppercase tracking-wide">
                    NULL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 02: THREE SUMMARY CARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-purple-500/15">
          {/* Card 1: Core Idea */}
          <div className="bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-purple-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-indigo-300 dark:hover:border-purple-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-300 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Core Idea</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Store elements in nodes linked using pointers.
              </p>
            </div>
          </div>

          {/* Card 2: Key Structure */}
          <div className="bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-purple-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-indigo-300 dark:hover:border-purple-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-300 shrink-0 font-serif font-bold text-xl">
              <span>Σ</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Key Structure</h2>
              <pre className="font-mono text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 mt-1 leading-tight font-medium bg-transparent p-0 overflow-x-auto">
{`class Node {
  int data;
  Node next;
}`}
              </pre>
            </div>
          </div>

          {/* Card 3: Main Advantage */}
          <div className="bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-purple-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-indigo-300 dark:hover:border-purple-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-300 shrink-0">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Main Advantage</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Dynamic size with efficient insertions and deletions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: 1. THE MAIN IDEA
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#0B1228] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-purple-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            1. The Main Idea
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Highlighted Statement & Explanation */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <h3 className="text-base sm:text-lg font-bold text-[#4F46E5] dark:text-purple-300 leading-snug">
              A sequence of nodes connected by links (pointers).
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Each node contains data and a reference (pointer) to the next node in the list.
            </p>
          </div>

          {/* Right Column: Visual Explanation of a Single Node */}
          <div className="lg:col-span-7 bg-[#F8FAFC] dark:bg-[#080D1F] border border-slate-200/80 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Single Node with Column Labels */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  {/* Data & Next labels */}
                  <div className="flex justify-between w-full px-2 mb-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span>Data</span>
                    <span>Next</span>
                  </div>

                  {/* Node Box [ 10 | ● ] */}
                  <div className="flex items-stretch bg-[#FAF9FF] dark:bg-[#131B38] border-2 border-[#818CF8] dark:border-purple-500/70 rounded-xl p-1 shadow-2xs">
                    <div className="bg-white dark:bg-[#0B1228] px-4 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-purple-500/30 flex items-center justify-center min-w-[48px]">
                      <span className="font-mono font-bold text-base text-[#0F172A] dark:text-white">10</span>
                    </div>
                    <div className="bg-[#EEF2FF] dark:bg-purple-950/60 px-3 py-2.5 rounded-lg flex items-center justify-center ml-1">
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] dark:bg-purple-400" />
                    </div>
                  </div>

                  {/* Node Label Below */}
                  <span className="text-xs font-bold text-[#0F172A] dark:text-slate-300 mt-1.5">Node</span>
                </div>

                {/* Arrow pointing to "Points to the next node" */}
                <ArrowRight className="w-5 h-5 text-[#6366F1] dark:text-purple-400 stroke-[2.5] shrink-0" />

                {/* "Points to the next node" pill card */}
                <div className="bg-[#EEF2FF] dark:bg-purple-950/50 border border-[#C7D2FE] dark:border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#4F46E5] dark:text-purple-300 text-center max-w-[110px] leading-snug">
                  Points to the next node
                </div>
              </div>

              {/* End of list note card */}
              <div className="bg-[#EEF2FF]/60 dark:bg-purple-950/30 border border-[#E0E7FF] dark:border-purple-500/20 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-[200px]">
                The last node points to <span className="font-mono font-bold text-[#0F172A] dark:text-white">NULL</span> (indicating the end of the list).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: 2. CONCEPT ROADMAP
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#0B1228] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-purple-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            2. Concept Roadmap
          </h2>
        </div>

        {/* 5-Stage Progression */}
        <div className="relative">
          {/* Connected Dashed Line Across the 5 Steps (desktop) */}
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-[#D5DEFD] dark:border-purple-500/30 z-0" />

          <div className="flex flex-col items-center md:grid md:grid-cols-5 md:gap-4 md:items-start relative z-10">
            {/* Stage 01: Node Structure */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'what-is-hashing');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 border-2 border-white dark:border-[#0B1228] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                01
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] dark:bg-[#131B38] border border-[#A7F3D0] dark:border-emerald-500/30 flex items-center justify-center text-[#10B981] dark:text-emerald-400 mb-2.5 shadow-2xs group-hover:border-emerald-400 transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Node <br className="hidden md:inline" /> Structure
              </h3>
            </div>

            {/* Mobile Connector Line: 01 -> 02 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#D5DEFD] dark:border-purple-500/40 my-2" />

            {/* Stage 02: Traversal */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'hash-table');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 border-2 border-white dark:border-[#0B1228] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                02
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#131B38] border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center text-[#3B82F6] dark:text-blue-400 mb-2.5 shadow-2xs group-hover:border-blue-400 transition-all">
                <List className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Traversal
              </h3>
            </div>

            {/* Mobile Connector Line: 02 -> 03 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#D5DEFD] dark:border-purple-500/40 my-2" />

            {/* Stage 03: Insertion */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'hash-function');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 border-2 border-white dark:border-[#0B1228] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                03
              </div>
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] dark:bg-[#131B38] border border-[#BAE6FD] dark:border-sky-500/30 flex items-center justify-center text-[#0284C7] dark:text-sky-400 mb-2.5 shadow-2xs group-hover:border-sky-400 transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Insertion
              </h3>
            </div>

            {/* Mobile Connector Line: 03 -> 04 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#D5DEFD] dark:border-purple-500/40 my-2" />

            {/* Stage 04: Deletion */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'what-is-a-collision');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 border-2 border-white dark:border-[#0B1228] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                04
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] dark:bg-[#131B38] border border-[#FECACA] dark:border-red-500/30 flex items-center justify-center text-[#EF4444] dark:text-red-400 mb-2.5 shadow-2xs group-hover:border-red-400 transition-all">
                <Minus className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Deletion
              </h3>
            </div>

            {/* Mobile Connector Line: 04 -> 05 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#D5DEFD] dark:border-purple-500/40 my-2" />

            {/* Stage 05: Applications */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'separate-chaining');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 border-2 border-white dark:border-[#0B1228] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                05
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EEF2FF] dark:bg-[#131B38] border border-[#C7D2FE] dark:border-indigo-500/30 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 mb-2.5 shadow-2xs group-hover:border-indigo-400 transition-all">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Applications
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: 3. WHY THIS TOPIC MATTERS
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#0B1228] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-purple-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] dark:bg-purple-950/70 border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center text-[#4F46E5] dark:text-purple-400">
            <Star className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            3. Why This Topic Matters
          </h2>
        </div>

        {/* 3 Value Cards Matching Exact References */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Dynamic Size (Subtle Purple/Lavender Tint) */}
          <div className="bg-[#FAF8FF] dark:bg-[#0E1326] border border-[#EDE9FE] dark:border-purple-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Dynamic Size</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Can grow or shrink during runtime.
              </p>
            </div>
          </div>

          {/* Card 2: Efficient Updates (Soft green/mint tint) */}
          <div className="bg-[#F0FDF4] dark:bg-[#0E1326] border border-[#DCFCE7] dark:border-purple-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Efficient Updates</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Insertions and deletions are easier compared to arrays.
              </p>
            </div>
          </div>

          {/* Card 3: Real-World Use (Subtle Blue Tint) */}
          <div className="bg-[#EEF2FF] dark:bg-[#0E1326] border border-[#E0E7FF] dark:border-purple-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Real-World Use</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Used in stacks, queues, graphs, hash tables, and many real-world systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: 4. READY TO START?
          ========================================================================= */}
      <section className="reveal-on-scroll bg-gradient-to-r from-[#F5F3FF] via-[#F8F6FF] to-[#FAF5FF] dark:from-[#0B1228] dark:via-[#0F1836] dark:to-[#0B1228] border border-[#E0E7FF] dark:border-purple-500/30 p-6 sm:p-8 rounded-2xl shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Educational Rocket Visual & Supporting Text */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* 3D Diagonal Rocket Illustration matching exact Reference Image (Static) */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center relative select-none">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                <defs>
                  {/* Gradients for 3D Shading */}
                  <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="65%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                  <linearGradient id="purpleNoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#4C1D95" />
                  </linearGradient>
                  <linearGradient id="purpleFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>
                  <linearGradient id="exhaustBeamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFEDD5" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#FED7AA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="cloudGrad" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#F1F5F9" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </radialGradient>
                  <radialGradient id="cloudShadowGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </radialGradient>
                </defs>

                {/* --- BILLOWING FLUFFY 3D CLOUDS (Background layers) --- */}
                <g>
                  {/* Deep shadow cloud base */}
                  <circle cx="24" cy="98" r="16" fill="#DDD6FE" opacity="0.45" />
                  <circle cx="44" cy="100" r="16" fill="#E2E8F0" opacity="0.8" />
                  <circle cx="68" cy="94" r="14" fill="#E2E8F0" opacity="0.7" />

                  {/* Mid-ground fluffy clouds */}
                  <circle cx="16" cy="90" r="14" fill="url(#cloudGrad)" />
                  <circle cx="34" cy="82" r="18" fill="url(#cloudGrad)" />
                  <circle cx="56" cy="84" r="17" fill="url(#cloudGrad)" />
                  <circle cx="76" cy="92" r="14" fill="url(#cloudGrad)" />
                  <circle cx="46" cy="96" r="16" fill="url(#cloudGrad)" />

                  {/* Highlights on cloud tops */}
                  <ellipse cx="32" cy="74" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="54" cy="76" rx="8" ry="4" fill="#FFFFFF" opacity="0.9" />
                </g>

                {/* --- EXHAUST PLUME STREAM (Connecting engine to cloud base) --- */}
                <g>
                  <path
                    d="M 52 68 Q 36 82 28 92 Q 44 80 58 62 Z"
                    fill="url(#exhaustBeamGrad)"
                  />
                  {/* Small bright core flame */}
                  <path
                    d="M 50 67 Q 40 76 34 82 Q 44 75 54 63 Z"
                    fill="#FDBA74"
                    opacity="0.9"
                  />
                  <path
                    d="M 49 67 Q 43 72 38 77 Q 45 72 52 64 Z"
                    fill="#F97316"
                  />
                </g>

                {/* --- ROCKET STRUCTURE (Oriented ~45deg diagonally) --- */}
                <g transform="rotate(45, 68, 52)">
                  {/* Left Purple Fin (flared out) */}
                  <path
                    d="M 54 58 C 42 64 38 74 42 78 C 50 76 56 70 58 64 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* Right Purple Fin (flared down/back) */}
                  <path
                    d="M 82 58 C 94 64 98 74 94 78 C 86 76 80 70 78 64 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* Red Engine Base / Mounting Ring */}
                  <path
                    d="M 56 68 L 80 68 L 77 74 L 59 74 Z"
                    fill="#EF4444"
                  />
                  {/* Orange Flame Emitter Nozzle */}
                  <path
                    d="M 62 74 Q 68 82 68 83 Q 68 82 74 74 Z"
                    fill="#F97316"
                  />

                  {/* Rocket Fuselage Body */}
                  <path
                    d="M 68 16 C 52 30 52 60 56 68 L 80 68 C 84 60 84 30 68 16 Z"
                    fill="url(#rocketBodyGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.5"
                  />

                  {/* Purple Nosecone */}
                  <path
                    d="M 68 16 C 60 23 55 31 54 37 L 82 37 C 81 31 76 23 68 16 Z"
                    fill="url(#purpleNoseGrad)"
                  />

                  {/* Purple Dorsal Spine Fin */}
                  <path
                    d="M 66 37 Q 68 56 65 67 L 71 67 Q 68 56 70 37 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* 3D Purple Porthole / Window */}
                  <circle cx="68" cy="46" r="8" fill="url(#purpleNoseGrad)" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="68" cy="46" r="5" fill="#3B0764" />
                  <circle cx="66" cy="44" r="1.75" fill="#FFFFFF" opacity="0.9" />
                </g>
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">
                4. Ready to Start?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Explore the concept of single linked lists and build a strong foundation in data structures.
              </p>
            </div>
          </div>

          {/* Right Side: Start Learning Button */}
          <button
            id="btn-home-start-learning"
            onClick={handleStartLearning}
            className="w-full md:w-auto px-8 py-4 bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-indigo-500/25 dark:shadow-purple-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};

