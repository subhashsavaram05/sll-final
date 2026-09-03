import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Database,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Layers,
  ArrowDown,
  ArrowUp,
  Cpu,
  Edit3,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { SLLNode, SLLPointerState } from '../../types/sllGame';

interface SLLWorkspaceProps {
  nodes: SLLNode[];
  pointers: SLLPointerState;
  stagedNodes: SLLNode[];
  traversalOutput: number[];
  searchTarget: number | null;
  searchResult: 'found' | 'not_found' | 'searching' | 'idle';
  selectedAddress: number | null;
  onSelectNode: (address: number) => void;
  onOpenChangeNext: (address: number) => void;
  onSetHeadDirect?: (address: number) => void;
  onSetTailDirect?: (address: number) => void;
  onConnectNextDirect?: (fromAddr: number, toAddr: number | null) => void;
  onDeleteNodeDirect?: (address: number) => void;
  onInsertBetween?: (prevAddr: number | null, nextAddr: number | null) => void;
  isTraversing: boolean;
  isSearching: boolean;
  levelId: number;
  guideTargetAddress?: number | null;
  pendingConnectFrom?: number | null; // If set, user is picking a target node to connect NEXT to
  isSettingHeadMode?: boolean;
  isSettingTailMode?: boolean;
  currentStep?: number;
  totalSteps?: number;
  currentStepActionType?: string;
  currentStepInstruction?: string;
  currentStepTargetAddress?: number | null;
  wrongClickedAddress?: number | null;
  onNodeClickDirect?: (address: number) => void;
  onCancelDirectMode?: () => void;
}

export const SLLWorkspace: React.FC<SLLWorkspaceProps> = ({
  nodes,
  pointers,
  stagedNodes,
  traversalOutput,
  searchTarget,
  searchResult,
  selectedAddress,
  onSelectNode,
  onOpenChangeNext,
  onSetHeadDirect,
  onSetTailDirect,
  onConnectNextDirect,
  onDeleteNodeDirect,
  onInsertBetween,
  isTraversing,
  isSearching,
  levelId,
  guideTargetAddress,
  pendingConnectFrom,
  isSettingHeadMode,
  isSettingTailMode,
  currentStep,
  totalSteps,
  currentStepActionType,
  currentStepInstruction,
  currentStepTargetAddress,
  wrongClickedAddress,
  onNodeClickDirect,
  onCancelDirectMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [draggingFromAddr, setDraggingFromAddr] = useState<number | null>(null);
  const [dragOverAddr, setDragOverAddr] = useState<number | null>(null);
  const [isDragOverNull, setIsDragOverNull] = useState<boolean>(false);
  const [hoveredNodeAddr, setHoveredNodeAddr] = useState<number | null>(null);

  // Traverse the linked list from HEAD
  const orderedNodes: SLLNode[] = [];
  const visitedAddresses = new Set<number>();
  let hasCycle = false;

  let currAddr = pointers.headAddress;
  while (currAddr !== null) {
    if (visitedAddresses.has(currAddr)) {
      hasCycle = true;
      break;
    }
    visitedAddresses.add(currAddr);
    const node = nodes.find((n) => n.address === currAddr);
    if (node) {
      orderedNodes.push(node);
      currAddr = node.nextAddress;
    } else {
      break;
    }
  }

  // If HEAD is NULL but there are nodes in RAM, display them prominently in the main stage!
  const isAwaitingHead = orderedNodes.length === 0 && nodes.length > 0;
  const stageNodes = isAwaitingHead ? nodes : orderedNodes;
  const unlinkedNodes = isAwaitingHead ? [] : nodes.filter((n) => !visitedAddresses.has(n.address));
  const currentNode = nodes.find((n) => n.address === pointers.currentAddress);

  // Step and mode helpers
  const isHeadStep = currentStepActionType === 'set_head' || isSettingHeadMode;
  const isTailStep = currentStepActionType === 'set_tail' || isSettingTailMode;
  const isConnectStep = currentStepActionType === 'connect_next' || pendingConnectFrom !== null;
  const isCreateStep = currentStepActionType === 'create_node';
  const isDeleteStep = currentStepActionType === 'delete_node';
  const isAnyDirectMode = isSettingHeadMode || isSettingTailMode || pendingConnectFrom !== null;

  // Build prominent "CURRENT ACTION" instruction text
  let currentActionText = currentStepInstruction || 'Follow the task steps to build the Singly Linked List.';
  if (isHeadStep) {
    const target = currentStepTargetAddress ?? (stageNodes.length > 0 ? stageNodes[0].address : 'first node');
    currentActionText = `🎯 Select a node to set HEAD — Click the first node (Node ${target}) to make it HEAD.`;
  } else if (isTailStep) {
    const target = currentStepTargetAddress ?? (stageNodes.length > 0 ? stageNodes[stageNodes.length - 1].address : 'last node');
    currentActionText = `🎯 Select a node to set TAIL — Click the last node (Node ${target}) to make it TAIL.`;
  } else if (isConnectStep) {
    if (pendingConnectFrom) {
      currentActionText = `🔗 Connect NEXT — Click the target node to link Node ${pendingConnectFrom}'s NEXT pointer.`;
    } else {
      currentActionText = `🔗 Connect NEXT — Drag or link NEXT to the next node in the sequence.`;
    }
  } else if (isCreateStep) {
    currentActionText = `➕ Allocate Node in RAM — Click '+ Create Node' to allocate memory for the new node.`;
  }

  // Responsive scale observer to guarantee entire list is 100% visible on all screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 32;
      const totalCount = orderedNodes.length + (orderedNodes.length > 0 ? 1 : 0) + (unlinkedNodes.length > 0 ? 1 : 0);
      if (totalCount === 0) {
        setScaleFactor(1);
        return;
      }

      const nodeWidth = totalCount >= 6 ? 104 : totalCount >= 4 ? 120 : 138;
      const gapWidth = 18;
      const requiredWidth = totalCount * (nodeWidth + gapWidth) + 80;

      if (containerWidth < requiredWidth && containerWidth > 0) {
        const factor = Math.max(0.55, Math.min(1, containerWidth / requiredWidth));
        setScaleFactor(factor);
      } else {
        setScaleFactor(1);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [orderedNodes.length, unlinkedNodes.length]);

  return (
    <div
      id="sll-interactive-workspace"
      ref={containerRef}
      className="w-full bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl p-4 sm:p-5 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[360px] font-sans"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:opacity-15 pointer-events-none" />

      {/* Top Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-purple-500/20 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-purple-950/60 border border-indigo-200 dark:border-purple-500/30 flex items-center justify-center text-indigo-600 dark:text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>RAM HEAP WORKSPACE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-sans font-bold">
                {nodes.length} Node{nodes.length !== 1 ? 's' : ''} in RAM
              </span>
            </h3>
          </div>
        </div>

        {/* Live Pointer Address Tags */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold shadow-2xs transition-colors ${
              pointers.headAddress !== null
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pointers.headAddress !== null ? 'bg-indigo-600 dark:bg-indigo-400 animate-pulse' : 'bg-slate-400'}`} />
            <span>HEAD: {pointers.headAddress !== null ? pointers.headAddress : 'NULL'}</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold shadow-2xs transition-colors ${
              pointers.tailAddress !== null
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pointers.tailAddress !== null ? 'bg-amber-500' : 'bg-slate-400'}`} />
            <span>TAIL: {pointers.tailAddress !== null ? pointers.tailAddress : 'NULL'}</span>
          </div>

          {pointers.currentAddress !== null && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold animate-pulse shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>CURRENT: {pointers.currentAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Warning Banner */}
      {hasCycle && (
        <div className="my-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Circular Loop Detected! A node pointer cycles back in memory.</span>
        </div>
      )}

      {/* Main Visual Linked List Stage Container */}
      <div className="my-4 relative z-10 flex flex-col items-center justify-center min-h-[190px] w-full">
        {nodes.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-300 dark:border-purple-500/30 rounded-2xl w-full max-w-md bg-slate-50/50 dark:bg-purple-950/20">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-200 dark:bg-purple-900/40 flex items-center justify-center text-slate-400 dark:text-purple-300 mb-2">
              <Database className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Linked List is Currently Empty (<code className="font-mono text-indigo-600 dark:text-purple-400">HEAD == NULL</code>)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Click <strong className="text-indigo-600 dark:text-purple-300">+ Create Node</strong> on the left to allocate a new node.
            </p>
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center transition-transform duration-200"
            style={{
              transform: scaleFactor < 1 ? `scale(${scaleFactor})` : undefined,
              transformOrigin: 'center center',
            }}
          >
            {/* Flex row of reachable nodes */}
            <div className="flex items-center justify-center flex-nowrap gap-1 sm:gap-2 py-4 px-1">
              {/* Drop Zone: Before HEAD */}
              {onInsertBetween && orderedNodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onInsertBetween(null, orderedNodes[0]?.address || null)}
                  className="opacity-40 hover:opacity-100 hover:scale-105 px-1.5 py-3 rounded-xl border border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-[9px] font-mono font-bold text-indigo-600 dark:text-purple-300 transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer"
                  title="Insert before HEAD"
                >
                  <span>+</span>
                  <span className="text-[7px]">PREPEND</span>
                </button>
              )}

              <AnimatePresence mode="popLayout">
                {orderedNodes.map((node, index) => {
                  const isHead = pointers.headAddress === node.address;
                  const isTail = pointers.tailAddress === node.address;
                  const isCurrent = pointers.currentAddress === node.address;
                  const isSelected = selectedAddress === node.address;
                  const isSearchMatch = searchResult === 'found' && node.data === searchTarget;

                  return (
                    <motion.div
                      key={node.id || node.address}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 20 }}
                      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                      className="flex items-center shrink-0 relative"
                    >
                      {/* Floating HEAD Banner above first node */}
                      {isHead && (
                        <motion.div
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
                        >
                          <div className="px-2 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-mono font-bold shadow-xs flex items-center gap-0.5">
                            <span>HEAD</span>
                            <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />
                          </div>
                        </motion.div>
                      )}

                      {/* Guide Target Pointer Indicator */}
                      {guideTargetAddress === node.address && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: [ -4, 0, -4 ], opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
                        >
                          <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold shadow-lg shadow-amber-500/40 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-slate-950" />
                            <span>👉 TARGET NODE</span>
                          </div>
                          <ArrowDown className="w-3.5 h-3.5 text-amber-500 font-bold stroke-[3]" />
                        </motion.div>
                      )}

                      {/* Connect Target Mode Banner */}
                      {pendingConnectFrom !== null && pendingConnectFrom !== node.address && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConnectNextDirect && onConnectNextDirect(pendingConnectFrom, node.address);
                          }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1 cursor-pointer animate-pulse"
                        >
                          <LinkIcon className="w-2.5 h-2.5" />
                          <span>CONNECT HERE</span>
                        </button>
                      )}

                      {/* Set HEAD Direct Mode */}
                      {isSettingHeadMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetHeadDirect && onSetHeadDirect(node.address);
                          }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1 cursor-pointer animate-pulse"
                        >
                          <span>MAKE HEAD</span>
                        </button>
                      )}

                      {/* Set TAIL Direct Mode */}
                      {isSettingTailMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetTailDirect && onSetTailDirect(node.address);
                          }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold shadow-md shadow-amber-500/30 flex items-center gap-1 cursor-pointer animate-pulse"
                        >
                          <span>MAKE TAIL</span>
                        </button>
                      )}

                      {/* Floating CURRENT Pointer above node */}
                      {isCurrent && (
                        <motion.div
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
                        >
                          <div className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[9px] font-mono font-bold shadow-md shadow-cyan-500/40 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>CURRENT</span>
                          </div>
                          <ArrowDown className="w-3 h-3 text-cyan-500 animate-pulse stroke-[3]" />
                        </motion.div>
                      )}

                      {/* Clean Node Card: Top = ADDR, Split Bottom = DATA | NEXT */}
                      <div
                        id={`sll-node-${node.address}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggingFromAddr && draggingFromAddr !== node.address) {
                            setDragOverAddr(node.address);
                          }
                        }}
                        onDragLeave={() => setDragOverAddr(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          const from = Number(e.dataTransfer.getData('text/plain') || draggingFromAddr);
                          if (from && from !== node.address) {
                            onConnectNextDirect && onConnectNextDirect(from, node.address);
                          }
                          setDraggingFromAddr(null);
                          setDragOverAddr(null);
                        }}
                        onClick={() => {
                          if (pendingConnectFrom && pendingConnectFrom !== node.address) {
                            onConnectNextDirect && onConnectNextDirect(pendingConnectFrom, node.address);
                          } else if (isSettingHeadMode) {
                            onSetHeadDirect && onSetHeadDirect(node.address);
                          } else if (isSettingTailMode) {
                            onSetTailDirect && onSetTailDirect(node.address);
                          } else {
                            onSelectNode(node.address);
                          }
                        }}
                        className={`relative flex flex-col rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none overflow-hidden group shadow-xs ${
                          dragOverAddr === node.address
                            ? 'border-emerald-500 ring-4 ring-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/40 scale-105'
                            : guideTargetAddress === node.address
                            ? 'border-amber-400 ring-4 ring-amber-400/40 bg-amber-50/50 dark:bg-amber-950/30 scale-105'
                            : isSearchMatch
                            ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-lg bg-emerald-50 dark:bg-emerald-950/40'
                            : isCurrent
                            ? 'border-cyan-500 ring-4 ring-cyan-500/30 shadow-lg bg-cyan-50/50 dark:bg-cyan-950/30 scale-105'
                            : isSelected
                            ? 'border-indigo-600 dark:border-purple-400 ring-4 ring-indigo-500/25 shadow-md bg-indigo-50/40 dark:bg-purple-950/30'
                            : 'border-slate-300 dark:border-purple-500/40 bg-white dark:bg-[#0E1736] hover:border-indigo-400 dark:hover:border-purple-400 hover:shadow-md hover:scale-[1.02]'
                        }`}
                        style={{
                          width: orderedNodes.length >= 6 ? '106px' : orderedNodes.length >= 4 ? '122px' : '136px',
                        }}
                      >
                        {/* Address Header Tag */}
                        <div className="bg-slate-100 dark:bg-[#152148] px-2 py-0.5 border-b border-slate-200 dark:border-purple-500/30 flex items-center justify-between text-[9px] font-mono">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">ADDR</span>
                          <span className="font-bold text-indigo-700 dark:text-purple-300 bg-white dark:bg-[#0B1228] px-1 py-0.2 rounded border border-slate-200 dark:border-purple-500/30">
                            {node.address}
                          </span>
                        </div>

                        {/* Split Container: Left = DATA, Right = NEXT */}
                        <div className="flex items-stretch">
                          {/* DATA Column */}
                          <div className="flex-1 py-1.5 px-1 flex flex-col items-center justify-center border-r border-slate-200 dark:border-purple-500/30 bg-slate-50/70 dark:bg-[#0B1228]/60">
                            <span className="text-[8px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                              DATA
                            </span>
                            <span className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white mt-0.5">
                              {node.data}
                            </span>
                          </div>

                          {/* NEXT Column with Visible Connector Handle */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenChangeNext(node.address);
                            }}
                            title="Drag NEXT → to the next node, or click to connect"
                            className="flex-1 py-1 px-1 flex flex-col items-center justify-center bg-indigo-50/30 dark:bg-purple-950/20 hover:bg-indigo-100/70 dark:hover:bg-purple-900/40 transition-colors group/next relative"
                          >
                            <span className="text-[8px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-0.5">
                              <LinkIcon className="w-2 h-2" />
                              NEXT
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded flex items-center gap-0.5 ${
                                  node.nextAddress === null
                                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                                    : 'bg-indigo-100 dark:bg-purple-950 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/30'
                                }`}
                              >
                                {node.nextAddress !== null ? node.nextAddress : 'NULL'}
                              </span>

                              {/* Visible NEXT Draggable Connector Dot */}
                              <div
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  e.dataTransfer.setData('text/plain', String(node.address));
                                  setDraggingFromAddr(node.address);
                                }}
                                onDragEnd={() => {
                                  setDraggingFromAddr(null);
                                  setDragOverAddr(null);
                                }}
                                title="Drag NEXT → to the next node"
                                className="w-3.5 h-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-125 transition-transform shadow-xs shrink-0"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Floating TAIL Badge or Quick Selection Label */}
                        {isTail ? (
                          <div className="bg-amber-500 text-white text-[8px] font-mono font-bold py-0.5 px-1 text-center uppercase tracking-wider flex items-center justify-center gap-0.5">
                            <ArrowUp className="w-2 h-2" />
                            <span>TAIL</span>
                          </div>
                        ) : isSelected ? (
                          <div className="bg-indigo-600 text-white text-[8px] font-mono font-bold py-0.5 px-1 text-center uppercase tracking-wider">
                            SELECTED ✓
                          </div>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[8px] font-mono py-0.5 text-center transition-opacity">
                            CLICK ME
                          </div>
                        )}
                      </div>

                      {/* Next Connecting Pointer Arrow / NULL Box Drop Target */}
                      <div className="flex items-center px-1 shrink-0">
                        {node.nextAddress !== null ? (
                          <div className="flex items-center text-indigo-500 dark:text-purple-400">
                            <div className="w-2.5 sm:w-4 h-[2px] bg-indigo-500 dark:bg-purple-400" />
                            <ArrowRight className="w-3.5 h-3.5 -ml-1 text-indigo-500 dark:text-purple-400 shrink-0" />
                          </div>
                        ) : (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragOverNull(true);
                            }}
                            onDragLeave={() => setIsDragOverNull(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              const from = Number(e.dataTransfer.getData('text/plain') || draggingFromAddr);
                              if (from) {
                                onConnectNextDirect && onConnectNextDirect(from, null);
                              }
                              setDraggingFromAddr(null);
                              setIsDragOverNull(false);
                            }}
                            className="flex items-center cursor-pointer group/null"
                            title="Drop here to set NEXT to NULL"
                          >
                            <div className="w-2 sm:w-3 h-[2px] bg-rose-400 dark:bg-rose-500" />
                            <div
                              className={`px-1.5 py-0.5 rounded-md border text-[9px] font-mono font-bold transition-all shadow-2xs ${
                                isDragOverNull
                                  ? 'bg-rose-500 text-white ring-4 ring-rose-400/50 scale-110'
                                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 group-hover/null:bg-rose-100'
                              }`}
                            >
                              NULL
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Drop Zone: Between node and next node */}
                      {onInsertBetween && index < orderedNodes.length - 1 && (
                        <button
                          type="button"
                          onClick={() => onInsertBetween(node.address, orderedNodes[index + 1]?.address || null)}
                          className="opacity-30 hover:opacity-100 hover:scale-110 px-1 py-2 rounded-md border border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-[8px] font-mono text-indigo-600 dark:text-purple-300 transition-all shrink-0 cursor-pointer"
                          title={`Insert between ${node.data} and ${orderedNodes[index + 1]?.data}`}
                        >
                          +
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Drop Zone: After TAIL */}
              {onInsertBetween && orderedNodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onInsertBetween(orderedNodes[orderedNodes.length - 1]?.address || null, null)}
                  className="opacity-40 hover:opacity-100 hover:scale-105 px-1.5 py-3 rounded-xl border border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-[9px] font-mono font-bold text-indigo-600 dark:text-purple-300 transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer ml-1"
                  title="Insert after TAIL"
                >
                  <span>+</span>
                  <span className="text-[7px]">APPEND</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Unlinked / Isolated / Detached Nodes in Memory */}
        {unlinkedNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 flex flex-wrap items-center justify-between gap-3 w-full"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                !
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Isolated Nodes (Not Reachable from HEAD)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {unlinkedNodes.length} node{unlinkedNodes.length !== 1 ? 's' : ''} in RAM waiting to be linked or set as HEAD.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {unlinkedNodes.map((node) => {
                const isTarget = guideTargetAddress === node.address;
                return (
                  <div
                    key={node.address}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggingFromAddr && draggingFromAddr !== node.address) {
                        setDragOverAddr(node.address);
                      }
                    }}
                    onDragLeave={() => setDragOverAddr(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = Number(e.dataTransfer.getData('text/plain') || draggingFromAddr);
                      if (from && from !== node.address) {
                        onConnectNextDirect && onConnectNextDirect(from, node.address);
                      }
                      setDraggingFromAddr(null);
                      setDragOverAddr(null);
                    }}
                    onClick={() => {
                      if (pendingConnectFrom && pendingConnectFrom !== node.address) {
                        onConnectNextDirect && onConnectNextDirect(pendingConnectFrom, node.address);
                      } else if (isSettingHeadMode) {
                        onSetHeadDirect && onSetHeadDirect(node.address);
                      } else if (isSettingTailMode) {
                        onSetTailDirect && onSetTailDirect(node.address);
                      } else {
                        onSelectNode(node.address);
                      }
                    }}
                    className={`relative flex flex-col rounded-xl border-2 cursor-pointer bg-white dark:bg-[#0E1736] shadow-sm overflow-hidden min-w-[110px] transition-all hover:scale-105 ${
                      dragOverAddr === node.address
                        ? 'border-emerald-500 ring-4 ring-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/40 scale-105'
                        : isTarget
                        ? 'border-amber-400 ring-4 ring-amber-400/50 bg-amber-50'
                        : selectedAddress === node.address
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                        : 'border-slate-300 dark:border-purple-500/40'
                    }`}
                  >
                    {isTarget && (
                      <div className="bg-amber-500 text-slate-950 font-bold text-[8px] text-center py-0.5 animate-pulse">
                        👉 TARGET
                      </div>
                    )}
                    {isSettingHeadMode && (
                      <div className="bg-indigo-600 text-white font-bold text-[8px] text-center py-0.5 animate-pulse">
                        SET AS HEAD
                      </div>
                    )}
                    <div className="bg-slate-100 dark:bg-[#152148] px-2 py-0.5 border-b border-slate-200 dark:border-purple-500/30 flex items-center justify-between text-[9px] font-mono">
                      <span className="text-slate-500 dark:text-slate-400">ADDR</span>
                      <span className="font-bold text-indigo-700 dark:text-purple-300">{node.address}</span>
                    </div>
                    <div className="flex items-center text-center">
                      <div className="px-2 py-1 font-display font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-purple-500/30 flex-1 text-xs">
                        {node.data}
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChangeNext(node.address);
                        }}
                        title="Drag NEXT → to the next node"
                        className="px-2 py-1 font-mono text-[9px] font-bold text-indigo-600 dark:text-purple-400 hover:bg-indigo-50 flex-1 flex items-center justify-center gap-1"
                      >
                        <span>{node.nextAddress !== null ? node.nextAddress : 'NULL'}</span>
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.setData('text/plain', String(node.address));
                            setDraggingFromAddr(node.address);
                          }}
                          onDragEnd={() => {
                            setDraggingFromAddr(null);
                            setDragOverAddr(null);
                          }}
                          className="w-3 h-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-center"
                        >
                          <span className="w-1 h-1 rounded-full bg-white block" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Traversal Output Buffer Stream */}
      {(levelId === 3 || levelId === 5 || traversalOutput.length > 0) && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-purple-500/20 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>TRAVERSAL OUTPUT STREAM (<code className="text-indigo-600 dark:text-purple-300">CURRENT → DATA</code>)</span>
            </span>
            {isTraversing && (
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Traversing...</span>
              </span>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/30 rounded-xl p-2 flex items-center gap-2 overflow-x-auto min-h-[38px]">
            {traversalOutput.length === 0 ? (
              <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">
                Output buffer empty. Follow CURRENT pointers to stream node data.
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {traversalOutput.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-0.5 rounded-lg bg-indigo-600 dark:bg-purple-600 text-white font-mono font-bold text-xs shadow-xs"
                    >
                      {val}
                    </motion.div>
                    <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
