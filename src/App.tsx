/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { 
  MessageSquare, 
  Code, 
  Settings, 
  Files, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoveDown,
  MoveUp,
  ArrowLeftToLine,
  ArrowRightToLine,
  Menu,
  Send, 
  User, 
  Terminal,
  Search,
  Smartphone,
  Laptop,
  Monitor,
  MonitorSmartphone,
  Plus,
  Blocks,
  Zap,
  Sun,
  UploadCloud,
  Languages,
  BookOpen,
  Copy,
  Check,
  Trash2,
  Github,
  Share2,
  Edit3,
  Undo2,
  Redo2,
  ClipboardPaste,
  Save,
  RefreshCw,
  Maximize2,
  FolderOpen,
  FilePlus,
  FolderPlus,
  ArrowUp,
  Wand2,
  Sparkles,
  Hash,
  Bug,
  FileText,
  Loader2,
  Users,
  Paperclip,
  HelpCircle,
  Image as ImageIcon,
  FileCode,
  FileJson,
  File,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Cog,
  MessageCircle,
  Folder,
  PlayCircle,
  SearchCode,
  Users2,
  User2,
  SquareTerminal,
  PlusSquare,
  Trash,
  Edit,
  CheckCircle,
  SaveAll,
  RefreshCcw,
  Maximize,
  ArrowUpCircle,
  Wand,
  Sparkle,
  BugPlay,
  FileCode2,
  FileJson2,
  MoreHorizontal,
  Code2,
  CheckCircle2,
  X,
  GitBranch,
  Bell,
  Download,
  SearchCode as SearchCodeIcon,
  Terminal as TerminalIcon,
  Plus as PlusIcon,
  Play as PlayIcon,
  Code as CodeIcon,
  Trash as TrashIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  RefreshCcw as RefreshCcwIcon,
  Maximize as MaximizeIcon,
  FolderClosed as FolderClosedIcon,
  ArrowUpCircle as ArrowUpCircleIcon,
  Wand as WandIcon,
  Sparkle as SparkleIcon,
  BugPlay as BugPlayIcon,
  FileCode2 as FileCode2Icon,
  FileJson2 as FileJson2Icon,
  MoreHorizontal as MoreHorizontalIcon,
  Key
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { IconContext, useIcons, ICON_THEMES, Codicon } from './lib/icons';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';

const getCodeMirrorExtensions = (language: string) => {
  const extensions = [EditorView.lineWrapping];
  switch (language) {
    case 'javascript':
    case 'typescript':
    case 'jsx':
    case 'tsx':
      extensions.push(javascript({ jsx: true, typescript: language.includes('typescript') || language.includes('tsx') }));
      break;
    case 'html':
      extensions.push(html());
      break;
    case 'css':
      extensions.push(css());
      break;
    case 'json':
      extensions.push(json());
      break;
    case 'python':
      extensions.push(python());
      break;
    case 'java':
      extensions.push(java());
      break;
    case 'c_cpp':
    case 'cpp':
    case 'c':
      extensions.push(cpp());
      break;
    case 'markdown':
    case 'md':
      extensions.push(markdown());
      break;
    case 'rust':
      extensions.push(rust());
      break;
    case 'go':
      extensions.push(go());
      break;
    case 'php':
      extensions.push(php());
      break;
    case 'sql':
      extensions.push(sql());
      break;
    default:
      break;
  }
  return extensions;
};
import { GoogleGenerativeAI } from "@google/generative-ai";

const FONT_OPTIONS: Record<string, string> = {
  'Inter': 'Inter, sans-serif',
  'Roboto': 'Roboto, sans-serif',
  'Montserrat': 'Montserrat, sans-serif',
  'Sora': 'Sora, sans-serif',
  'Manrope': 'Manrope, sans-serif'
};

import 'katex/dist/katex.min.css';
import { transform } from 'sucrase';

// Lazy loaded components for better performance
const MarkdownRenderer = React.lazy(() => import('./components/MarkdownRenderer'));
const SyntaxHighlighter = React.lazy(() => import('./components/AsyncSyntaxHighlighter'));

// Components
import { Group, Panel, Separator } from 'react-resizable-panels';
import { Skeleton } from './components/Skeleton';
import { 
  vscDarkPlus,
  atomDark,
  cb,
  darcula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  ghcolors,
  hopscotch,
  materialDark,
  materialLight,
  materialOceanic,
  nord,
  oneDark,
  oneLight,
  pojoaque,
  prism,
  shadesOfPurple,
  solarizedlight,
  tomorrow,
  twilight,
  xonokai,
  coldarkCold,
  coldarkDark,
  dracula,
  gruvboxDark,
  gruvboxLight,
  lucario,
  nightOwl,
  synthwave84
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chatWithAI, chatWithAIStream, simpleChat } from './services/ai';
import { checkErrors, EditorMarker } from './services/errorChecker';
import * as db from './services/db';

interface Attachment {
  name: string;
  type: string;
  content: string;
}

interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
  reasoning?: string;
  attachments?: Attachment[];
}

interface Project {
  id: string;
  name: string;
  messages: Message[];
  files: Record<string, { code: string, language: string }>;
  openFiles?: string[];
  activeFile: string;
  createdAt: number;
}

interface Snippet {
  id: string;
  name: string;
  code: string;
  language: string;
  description?: string;
  createdAt: number;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getLanguageFromPath = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase() || 'text';
  const extMap: Record<string, string> = {
    'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
    'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown', 'py': 'python',
    'cpp': 'c_cpp', 'c': 'c', 'java': 'java', 'php': 'php', 'sql': 'sql', 'sh': 'bash',
    'rs': 'rust', 'go': 'go'
  };
  return extMap[extension] || 'text';
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getInitialCode = (name: string) => {
  const greeting = getGreeting();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${greeting}, ${name}</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            color: #fff;
            font-family: -apple-system, system-ui, sans-serif;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.02em;
        }

        span {
            font-weight: 500;
        }
    </style>
</head>
<body>

    <h1>${greeting}, <span>${name}</span>.</h1>

</body>
</html>`;
};

const APP_THEMES: Record<string, any> = {
  'VS Code Dark': {
    background: '#1e1e1e',
    foreground: '#e0e0e0',
    muted: 'rgba(224, 224, 224, 0.6)',
    subtle: 'rgba(224, 224, 224, 0.4)',
    accent: '#ffffff',
    accentForeground: '#000000',
    sidebar: '#252526',
    border: '#333333'
  },
  'Acode Dark': {
    background: '#0d0d0d',
    foreground: '#e0e0e0',
    muted: 'rgba(224, 224, 224, 0.6)',
    subtle: 'rgba(224, 224, 224, 0.4)',
    accent: '#00ff41',
    accentForeground: '#000000',
    sidebar: '#1a1a1a',
    border: '#333333'
  },
  'Default Dark': {
    background: '#0d0d0d',
    foreground: '#e0e0e0',
    muted: 'rgba(224, 224, 224, 0.6)',
    subtle: 'rgba(224, 224, 224, 0.4)',
    accent: '#00ff41',
    accentForeground: '#000000',
    sidebar: '#1a1a1a',
    border: '#333333'
  },
  'Midnight Blue': {
    background: '#0a0e14',
    foreground: '#b3b1ad',
    muted: 'rgba(179, 177, 173, 0.6)',
    subtle: 'rgba(179, 177, 173, 0.4)',
    accent: '#59c2ff',
    accentForeground: '#000000',
    sidebar: '#0d1017',
    border: '#151b23'
  },
  'Cyberpunk': {
    background: '#000000',
    foreground: '#00ff9f',
    muted: 'rgba(0, 255, 159, 0.6)',
    subtle: 'rgba(0, 255, 159, 0.4)',
    accent: '#ff0055',
    accentForeground: '#ffffff',
    sidebar: '#111111',
    border: '#333333'
  },
  'Nordic': {
    background: '#2e3440',
    foreground: '#d8dee9',
    muted: 'rgba(216, 222, 233, 0.6)',
    subtle: 'rgba(216, 222, 233, 0.4)',
    accent: '#88c0d0',
    accentForeground: '#000000',
    sidebar: '#242933',
    border: '#3b4252'
  },
  'Dracula': {
    background: '#282a36',
    foreground: '#f8f8f2',
    muted: 'rgba(248, 248, 242, 0.6)',
    subtle: 'rgba(248, 248, 242, 0.4)',
    accent: '#bd93f9',
    accentForeground: '#ffffff',
    sidebar: '#21222c',
    border: '#44475a'
  },
  'Forest': {
    background: '#0b120b',
    foreground: '#d1d1d1',
    muted: 'rgba(209, 209, 209, 0.6)',
    subtle: 'rgba(209, 209, 209, 0.4)',
    accent: '#4ade80',
    accentForeground: '#000000',
    sidebar: '#121a12',
    border: '#1e291e'
  },
  'White Mode': {
    background: '#f5f5f5',
    foreground: '#000000',
    muted: 'rgba(0, 0, 0, 0.6)',
    subtle: 'rgba(0, 0, 0, 0.4)',
    accent: '#000000',
    accentForeground: '#ffffff',
    sidebar: '#ececec',
    border: '#d1d1d1'
  }
};

const CollapsibleCodeBlock = React.memo(({ 
  language, 
  children, 
  theme, 
  themeName, 
  themeBg
}: { 
  language: string, 
  children: string, 
  theme: any, 
  themeName: string, 
  themeBg: string
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { Code, ChevronDown } = useIcons();

  return (
    <div className="my-4 border border-border rounded-none overflow-hidden bg-foreground/[0.01]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-foreground/[0.03] transition-all text-[12px] tracking-widest text-foreground/20 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-none bg-foreground/5 text-foreground/75 group-hover:text-accent transition-colors">
            <Code size={12} />
          </div>
          <span className="tracking-tighter capitalize">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={14} />
          </div>
        </div>
      </button>
      
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5"
          >
            <React.Suspense fallback={<div className="p-4"><Skeleton className="h-24 w-full" /></div>}>
              <SyntaxHighlighter
                key={themeName}
                style={theme}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1.5em',
                  fontSize: '13px',
                  fontFamily: '"JetBrains Mono", monospace',
                  background: themeBg,
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}
              >
                {children}
              </SyntaxHighlighter>
            </React.Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const QuickOpenModal = ({ files, onClose, onSelect }: { files: string[], onClose: () => void, onSelect: (name: string) => void }) => {
  const [search, setSearch] = useState('');
  const filtered = files.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  const { Files, Search } = useIcons();

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-xl bg-[#252526] border border-[#454545] shadow-2xl rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-3 py-2 border-b border-[#454545] bg-[#3c3c3c]">
          <Search size={16} className="text-zinc-400 mr-2" />
          <input 
            autoFocus
            placeholder="Search files by name..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length > 0) {
                onSelect(filtered[0]);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto py-1">
          {filtered.length > 0 ? filtered.map(f => (
            <div 
              key={f}
              onClick={() => onSelect(f)}
              className="px-4 py-1.5 flex items-center gap-3 hover:bg-[#094771] cursor-pointer group"
            >
              <Files size={14} className="text-zinc-400 group-hover:text-white" />
              <div className="flex flex-col">
                <span className="text-[12px] text-white/90">{f.split('/').pop()}</span>
                <span className="text-[10px] text-zinc-500 group-hover:text-white/60">{f}</span>
              </div>
            </div>
          )) : (
            <div className="px-4 py-4 text-center text-zinc-500 text-[12px]">No files matching "{search}"</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CommandPaletteModal = ({ onClose, actions }: { onClose: () => void, actions: { label: string, shortcut?: string, action: () => void }[] }) => {
  const [search, setSearch] = useState('');
  const filtered = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));
  const { Settings } = useIcons();

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-xl bg-[#252526] border border-[#454545] shadow-2xl rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-3 py-2 border-b border-[#454545] bg-[#3c3c3c]">
          <span className="text-zinc-400 mr-2 text-[13px] font-bold px-1 border border-zinc-500 rounded text-[9px] uppercase tracking-tighter">CMD</span>
          <input 
            autoFocus
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length > 0) {
                filtered[0].action();
                onClose();
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto py-1">
          {filtered.length > 0 ? filtered.map(a => (
            <div 
              key={a.label}
              onClick={() => { a.action(); onClose(); }}
              className="px-4 py-2 flex items-center justify-between hover:bg-[#094771] cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Settings size={14} className="text-zinc-400 group-hover:text-white" />
                <span className="text-[12px] text-white/90">{a.label}</span>
              </div>
              {a.shortcut && <span className="text-[10px] text-zinc-500 font-mono group-hover:text-white/60">{a.shortcut}</span>}
            </div>
          )) : (
            <div className="px-4 py-4 text-center text-zinc-500 text-[12px]">No commands matching "{search}"</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ShortcutsModal = ({ onClose }: { onClose: () => void }) => {
  const sections = [
    {
      title: "General",
      shortcuts: [
        { key: "Ctrl + P", desc: "Quick Open (File search)" },
        { key: "Ctrl + Shift + P", desc: "Command Palette" },
        { key: "Ctrl + ,", desc: "Settings" },
        { key: "Ctrl + Shift + K", desc: "Keyboard Shortcuts List" }
      ]
    },
    {
      title: "File & Tab Control",
      shortcuts: [
        { key: "Ctrl + N", desc: "New File" },
        { key: "Ctrl + S", desc: "Save" },
        { key: "Ctrl + W", desc: "Close Tab" }
      ]
    },
    {
      title: "Editing",
      shortcuts: [
        { key: "Ctrl + Enter", desc: "New line below" },
        { key: "Ctrl + Shift + Enter", desc: "New line above" },
        { key: "Alt + ↑ / ↓", desc: "Move line up/down" },
        { key: "Shift + Alt + ↓", desc: "Duplicate line" },
        { key: "Ctrl + D", desc: "Add selection to next find match" },
        { key: "Ctrl + Shift + L", desc: "Select all occurrences" }
      ]
    },
    {
      title: "Navigation & Search",
      shortcuts: [
        { key: "Ctrl + F", desc: "Find" },
        { key: "Ctrl + H", desc: "Replace" },
        { key: "Ctrl + G", desc: "Go to Line" },
        { key: "Ctrl + Shift + F", desc: "Global Search" }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#1e1e1e] border border-[#333333] shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#252526]">
          <h2 className="text-[15px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-6 bg-accent rounded-full" />
            Keyboard Shortcuts
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <PlusIcon size={24} className="rotate-45" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {sections.map(sec => (
            <div key={sec.title}>
              <h3 className="text-[11px] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">{sec.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {sec.shortcuts.map(s => (
                  <div key={s.key} className="flex items-center justify-between gap-4 py-1.5 border-b border-white/[0.03]">
                    <span className="text-[12px] text-zinc-400">{s.desc}</span>
                    <span className="text-[10px] font-mono text-white bg-[#333333] px-1.5 py-0.5 rounded shadow-[0_2px_0_#111]">{s.key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-accent/5 rounded-lg border border-accent/20">
             <h3 className="text-[12px] font-bold text-white mb-2">Mobile Usage Tip</h3>
             <p className="text-[11px] text-zinc-400 leading-relaxed">
               To use these shortcuts on mobile, connect a physical keyboard via Bluetooth or OTG. Alternatively, some keyboards like "Hacker's Keyboard" or specific IDE-oriented keyboard apps allow using Ctrl/Alt/Shift keys on Android.
             </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AttachmentEditorModal = React.forwardRef<HTMLDivElement, { 
  editingData: { attachment: Attachment, index?: number, isPending: boolean }, 
  onClose: () => void,
  onSave: (updated: Attachment) => void,
  onSend: (updated: Attachment) => void
}>(({ editingData, onClose, onSave, onSend }, ref) => {
  const [content, setContent] = useState(editingData.attachment.content);
  const isImage = editingData.attachment.type.startsWith('image/');
  const { Files, Plus } = useIcons();

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0d0d0d] border border-white/10 w-full max-w-5xl h-full max-h-[90vh] flex flex-col rounded-lg overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Files size={18} className="text-blue-400" />
            <span className="text-sm font-medium text-white/90">{editingData.attachment.name}</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-black/20">
          {isImage ? (
            <div className="w-full h-full flex items-center justify-center p-6">
              <img 
                src={content} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <React.Suspense fallback={<div className="h-full w-full p-4"><Skeleton className="h-full w-full" /></div>}>
              <CodeMirror
                value={content}
                height="100%"
                className="w-full h-full"
                theme={vscodeDark}
                extensions={getCodeMirrorExtensions(getLanguageFromPath(editingData.attachment.name))}
                onChange={(val) => setContent(val || '')}
                style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace' }}
              />
            </React.Suspense>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
          >
            Cancel
          </button>
          {!isImage && (
            <button 
              onClick={() => onSave({ ...editingData.attachment, content })}
              className="px-4 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm transition-all rounded-[2px]"
            >
              Save Changes
            </button>
          )}
          <button 
            onClick={() => onSend({ ...editingData.attachment, content })}
            className="px-6 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm font-medium transition-all rounded-[2px] shadow-lg shadow-blue-900/20"
          >
            Send to AI
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

const FileAttachment = ({ attachment, isUser, onEdit }: { attachment: Attachment, isUser: boolean, onEdit?: () => void }) => {
  const [show, setShow] = useState(false);
  const isImage = attachment.type.startsWith('image/');
  const { Files, Edit3, Plus } = useIcons();

  return (
    <div className={`mt-2 flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
      <div 
        onClick={() => onEdit ? onEdit() : setShow(!show)}
        className="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-3 py-2 rounded border border-white/10 cursor-pointer select-none group"
      >
        <Files size={14} />
        <span className="truncate max-w-[200px] font-medium">{attachment.name}</span>
        <Edit3 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      </div>
      {show && !onEdit && (
        <div className="mt-2 w-full">
          {isImage ? (
            <div className="relative rounded overflow-hidden border border-white/10 bg-black/20">
              <img 
                src={attachment.content} 
                alt={attachment.name} 
                className="w-full h-auto block"
                referrerPolicy="no-referrer"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); setShow(false); }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/70 hover:text-white"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="relative rounded overflow-hidden border border-white/10 bg-black/40 p-3">
              <pre className="text-[10px] font-mono text-white/70 whitespace-pre-wrap break-all max-h-[400px] overflow-y-auto custom-scrollbar" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {attachment.content}
              </pre>
              <button 
                onClick={(e) => { e.stopPropagation(); setShow(false); }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/70 hover:text-white"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChatMessage = React.memo(React.forwardRef<HTMLDivElement, { 
  msg: Message, 
  theme: any, 
  themeName: string, 
  onEditAttachment?: (att: Attachment) => void, 
  isGenerating?: boolean,
  getPlatformConfig?: () => any
}>(({ msg, theme, themeName, onEditAttachment, isGenerating, getPlatformConfig }, ref) => {
  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full mb-6 relative group/msg`}
    >
      <div className={`
        relative px-4 py-3 rounded-lg text-[14px] leading-relaxed max-w-[95%] break-words
        ${msg.role === 'user' 
          ? 'bg-foreground/5 text-foreground border border-foreground/10' 
          : 'bg-foreground/[0.02] text-foreground/90 border border-border'
        }
        hover:border-foreground/20 transition-colors duration-200 shadow-sm
        ${isGenerating ? 'ring-1 ring-accent/30 shadow-[0_0_15px_rgba(0,122,204,0.1)]' : ''}
      `}>
        {isGenerating && (
          <motion.div
            animate={{ 
              background: [
                'linear-gradient(90deg, transparent 0%, rgba(0,122,204,0.05) 50%, transparent 100%)',
                'linear-gradient(90deg, transparent 100%, rgba(0,122,204,0.05) 150%, transparent 200%)'
              ],
              left: ['-100%', '100%']
            }}
            transition={{ duration: 0 }}
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          />
        )}

        <div className="markdown-content" style={{ fontFamily: '"Fira Code", monospace' }}>
          <React.Suspense fallback={<div className="animate-pulse h-8 bg-foreground/5 rounded w-1/2"></div>}>
            <MarkdownRenderer
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const themeBg = theme['pre[class*="language-"]']?.background || theme['pre[class*="language-"]']?.backgroundColor || 'rgba(255,255,255,0.05)';
                  
                  return !inline && match ? (
                    <CollapsibleCodeBlock
                      language={match[1]}
                      theme={theme}
                      themeName={themeName}
                      themeBg={themeBg}
                    >
                      {String(children).replace(/\n$/, '')}
                    </CollapsibleCodeBlock>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg.content}
            </MarkdownRenderer>
          </React.Suspense>
        </div>
        {msg.attachments && msg.attachments.length > 0 && (
          <div className={`flex flex-col gap-1 mt-3 pt-3 border-t border-white/5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.attachments.map((att, idx) => (
              <FileAttachment 
                key={idx} 
                attachment={att} 
                isUser={msg.role === 'user'} 
                onEdit={onEditAttachment ? () => onEditAttachment(att) : undefined} 
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}));

let isTreeSitterInitializing = false;
let isTreeSitterInitialized = false;

const MemoizedCodeEditor = React.memo(({ 
  code, 
  language, 
  filename,
  onChange,
  onSaveVersion,
  onSaveToLocal,
  onPlay,
  onShowPreview,
  onOpenFull,
  onShowSettings,
  onShowTerminal,
  onBackToChat,
  onMenuClick,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  appThemeName,
  allFiles = {},
  activeFiles = [],
  onFileSelect,
  onCloseFile,
  fontSize = 13,
  splitScreen = false,
  isSplitPane = false,
  onToggleSplit,
  onClosePane,
  onSetEditorTheme,
  editorThemeName,
  onShowHelp,
  onShowQuickOpen,
  onShowCommandPalette,
  onShowShortcuts,
  onSetActiveTab,
  onSetMobileView,
  fontFamily = '"JetBrains Mono", monospace',
  activeFile,
  setShowSnippetEditor,
  onSetActiveEditor,
  onSaveSelectedAsSnippet,
  onCreateFilesDirectly,
  getPlatformConfig,
  onCreateNewProject
}: { 
  code: string, 
  language: string, 
  filename?: string,
  onChange?: (value: string | undefined) => void,
  onSaveVersion?: (description: string) => void,
  onSaveToLocal?: () => void,
  onPlay?: () => void,
  onShowPreview?: (show: boolean) => void,
  onOpenFull?: () => void,
  onShowSettings?: () => void,
  onShowTerminal?: () => void,
  onBackToChat?: () => void,
  onMenuClick?: () => void,
  onCreateFile?: () => void,
  onRenameFile?: (name: string) => void,
  onDeleteFile?: (name: string) => void,
  appThemeName: string,
  allFiles?: Record<string, any>,
  activeFiles?: string[],
  onFileSelect?: (name: string) => void,
  onCloseFile?: (name: string) => void,
  fontSize?: number,
  splitScreen?: boolean,
  isSplitPane?: boolean,
  onToggleSplit?: () => void,
  onClosePane?: () => void,
  onSetEditorTheme?: (name: string) => void,
  editorThemeName: string,
  onShowHelp?: () => void,
  onShowQuickOpen?: () => void,
  onShowCommandPalette?: () => void,
  onShowShortcuts?: () => void,
  onSetActiveTab?: (tab: string) => void,
  onSetMobileView?: (view: string) => void,
  fontFamily?: string,
  activeFile?: string,
  setShowSnippetEditor?: (val: any) => void,
  onSetActiveEditor?: (editor: any) => void,
  onSaveSelectedAsSnippet?: () => void,
  onCreateFilesDirectly?: (files: string[]) => void,
  getPlatformConfig?: () => any,
  onCreateNewProject?: () => void
}) => {
  const [localValue, setLocalValue] = useState(code);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [cursorPos, setCursorPos] = useState({ row: 1, column: 1 });
  const [isAILoading, setIsAILoading] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFileOpsMenu, setShowFileOpsMenu] = useState(false);
  const [showInlineAI, setShowInlineAI] = useState(false);
  const [inlineAIPrompt, setInlineAIPrompt] = useState('');
  const [inlineAILoading, setInlineAILoading] = useState(false);
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const viewRef = useRef<any>(null);

  const { 
    Undo2, Redo2, Search, Hash, Wand2, Save, Sparkles, FileText, Bug, 
    Copy, ClipboardPaste, Trash2, Menu, Edit, Play, MoreVertical, Plus,
    ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoveDown, MoveUp,
    ArrowLeftToLine, ArrowRightToLine, Palette, X, HelpCircle
  } = useIcons();

  const handleEditorUpdate = (update: any) => {
    if (update.selectionSet || update.docChanged) {
      const state = update.state;
      const head = state.selection.main.head;
      const line = state.doc.lineAt(head);
      setCursorPos({ row: line.number, column: head - line.from + 1 });
    }
  };

  const insertText = (text: string) => {
    if (viewRef.current) {
      const view = viewRef.current;
      const { state } = view;
      const { selection } = state;
      view.dispatch({
        changes: selection.ranges.map(range => ({
          from: range.from,
          to: range.to,
          insert: text,
        })),
        selection: { anchor: selection.main.from + text.length },
      });
      view.focus();
    }
  };

  const handleKeyboardAction = (action: string) => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    
    switch (action) {
      case 'tab': 
        insertText('  '); 
        break;
      case 'save': 
        if (onSaveToLocal) onSaveToLocal(); 
        break;
      case 'undo': 
        import('@codemirror/commands').then(({ undo }) => undo(view));
        break;
      case 'redo': 
        import('@codemirror/commands').then(({ redo }) => redo(view));
        break;
      case 'search': 
        import('@codemirror/search').then(({ openSearchPanel }) => openSearchPanel(view));
        break;
      case 'left': 
        view.dispatch({ selection: { anchor: Math.max(0, view.state.selection.main.head - 1) } });
        break;
      case 'right': 
        view.dispatch({ selection: { anchor: Math.min(view.state.doc.length, view.state.selection.main.head + 1) } });
        break;
      case 'up': 
        // Simple up movement (approximation)
        const lineU = view.state.doc.lineAt(view.state.selection.main.head);
        if (lineU.number > 1) {
          const prevLine = view.state.doc.line(lineU.number - 1);
          view.dispatch({ selection: { anchor: prevLine.from + Math.min(prevLine.length, view.state.selection.main.head - lineU.from) } });
        }
        break;
      case 'down': 
        // Simple down movement (approximation)
        const lineD = view.state.doc.lineAt(view.state.selection.main.head);
        if (lineD.number < view.state.doc.lines) {
          const nextLine = view.state.doc.line(lineD.number + 1);
          view.dispatch({ selection: { anchor: nextLine.from + Math.min(nextLine.length, view.state.selection.main.head - lineD.from) } });
        }
        break;
      default: break;
    }
    view.focus();
  };

  const handleLocalChange = useCallback((value: string) => {
    if (value === localValue) return;
    setLocalValue(value);
    if (onChange) {
      onChange(value);
    }
  }, [localValue, onChange]);

  const handleAIAction = async (action: 'refactor' | 'document' | 'debug') => {
    if (!localValue || isAILoading) return;
    
    setIsAILoading(true);
    try {
      let newCode = '';
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra: currentExtra } = getPlatformConfig?.() as any || {};

      let prompt = "";
      if (action === 'refactor') {
        prompt = `Refactor the following ${language} code to improve readability, performance, and follow best practices. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      } else if (action === 'document') {
        prompt = `Add professional JSDoc/comments to the following ${language} code. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      } else if (action === 'debug') {
        prompt = `Analyze the following ${language} code for bugs or potential issues. Fix any bugs found and improve error handling. Return ONLY the code. Do not include markdown code blocks, explanations, or comments before/after the code:\n\n${localValue}`;
      }

      newCode = await simpleChat(prompt, currentApiKey, currentModel, currentPlatform, currentExtra);
      
      // Clean up markdown code blocks if AI included them despite instructions
      newCode = newCode.replace(/```[a-z]*\n/g, '').replace(/\n```/g, '').trim();
      
      if (newCode) {
        handleLocalChange(newCode);
        if (onSaveVersion) onSaveVersion(`AI ${action}`);
      }
    } catch (err) {
      console.error(`AI ${action} failed:`, err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Update local value when external code changes (e.g. from AI)
  useEffect(() => {
    if (code !== localValue) {
      setLocalValue(code);
    }
  }, [code]);

  const triggerAction = (actionId: string) => {
    if (viewRef.current) {
      if (actionId === 'undo') {
        viewRef.current.trigger('keyboard', 'undo', null);
      }
    }
  };

  const handleInlineAI = async () => {
    if (!inlineAIPrompt || inlineAILoading) return;
    
    setInlineAILoading(true);
    try {
      const selection = viewRef.current?.state.selection.main;
      const selectedText = selection ? viewRef.current?.state.doc.sliceString(selection.from, selection.to) : '';
      
      const config = getPlatformConfig();
      const currentApiKey = config.apiKey === 'env-key' ? '' : config.apiKey;
      const currentModel = config.model;
      const currentPlatform = config.platform || 'gemini';
      const currentExtra = config.extra;

      const prompt = `Task: ${inlineAIPrompt}
Code Context:
${selectedText ? `Selected Code:\n${selectedText}` : `Entire File:\n${localValue}`}

Language: ${language}

Instructions: Modify the code according to the task. Return ONLY the modified code. No explanations, no markdown blocks.`;

      const result = await simpleChat(prompt, currentApiKey, currentModel, currentPlatform, currentExtra);
      let newCode = result.replace(/```[a-z]*\n/g, '').replace(/\n```/g, '').trim();
      
      if (newCode) {
        if (selectedText && selection) {
          viewRef.current?.dispatch({
            changes: { from: selection.from, to: selection.to, insert: newCode }
          });
        } else {
          handleLocalChange(newCode);
        }
        setShowInlineAI(false);
        setInlineAIPrompt('');
      }
    } catch (err) {
      console.error("Inline AI failed:", err);
    } finally {
      setInlineAILoading(false);
    }
  };

  const handleManualPaste = () => {
    if (pasteValue) {
      insertText(pasteValue);
    }
    setShowPasteModal(false);
    setPasteValue('');
  };

  const handleFormat = async () => {
    if (!localValue) return;
    try {
      if (language === 'cpp') {
        const beautify = await import("js-beautify");
        // Using js() for C++ as it's the closest thing in js-beautify
        const formatted = beautify.default.js(localValue, { 
          indent_size: 2,
          brace_style: "collapse",
          preserve_newlines: true,
          space_before_conditional: true
        });
        if (formatted) handleLocalChange(formatted);
        return;
      }

      const [prettier, prettierPluginBabel, prettierPluginEstree, prettierPluginHtml, prettierPluginCss] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
        import("prettier/plugins/html"),
        import("prettier/plugins/postcss")
      ]);

      let parser = "babel";
      let plugins: any[] = [prettierPluginBabel, prettierPluginEstree];

      if (language === 'html') {
        parser = "html";
        plugins = [prettierPluginHtml];
      } else if (language === 'css') {
        parser = "css";
        plugins = [prettierPluginCss];
      } else if (language === 'java') {
        const javaPlugin = await import("prettier-plugin-java");
        parser = "java";
        plugins = [javaPlugin.default || javaPlugin];
      } else if (language === 'python') {
        const pythonPlugin = await import("@prettier/plugin-python");
        parser = "python";
        plugins = [pythonPlugin.default || pythonPlugin];
      }

      const formatted = await prettier.default.format(localValue, {
        parser,
        plugins,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
      });

      if (formatted) {
        handleLocalChange(formatted);
      }
    } catch (err) {
      console.error("Formatting error:", err);
    }
  };

  const editorExtensions = useMemo(() => {
    const base = getCodeMirrorExtensions(language);
    const shortcuts = keymap.of([
      { key: 'Mod-p', run: () => { onShowQuickOpen?.(); return true; } },
      { key: 'Mod-Shift-p', run: () => { onShowCommandPalette?.(); return true; } },
      { key: 'Mod-k', run: () => { setShowInlineAI(true); return true; } },
      { key: 'Mod-s', run: (view) => { onSaveToLocal?.(); return true; } },
      { key: 'Mod-Shift-s', run: () => { onSaveSelectedAsSnippet?.(); return true; } },
      { key: 'Mod-Alt-s', run: () => { onSetActiveTab?.('snippets'); onSetMobileView?.('chat'); return true; } },
    ]);
    return [...base, shortcuts];
  }, [language, onShowQuickOpen, onShowCommandPalette, onSaveToLocal, onSaveSelectedAsSnippet, onSetActiveTab, onSetMobileView]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1f1f1f]">
      {/* VS Code Style Dynamic Tabs */}
      <div className="h-9 flex items-center justify-between select-none border-b border-[#2b2b2b] bg-[#181818] shrink-0">
        <div className="flex items-center overflow-x-auto no-scrollbar h-full scroll-smooth flex-1 touch-pan-x">
          <button 
            onClick={onMenuClick}
            className="h-full px-3 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border-r border-[#2b2b2b]"
            title="Toggle Sidebar"
          >
            <Menu size={16} />
          </button>
          {activeFiles.map((fname) => {
            const isSelected = filename === fname;
            const extension = fname.split('.').pop()?.toLowerCase() || '';
            const officialIconUrl = getOfficialIcon(extension);
            
            let FileIcon = File;
            let iconColor = 'text-zinc-500';
            
            if (!officialIconUrl) {
              if (extension === 'html') { FileIcon = FileCode; iconColor = 'text-orange-500'; }
              if (extension === 'css') { FileIcon = FileCode; iconColor = 'text-blue-500'; }
              if (extension === 'js' || extension === 'ts' || extension === 'tsx') { FileIcon = FileJson; iconColor = 'text-yellow-500'; }
            }

            return (
              <div 
                key={fname}
                onClick={() => onFileSelect?.(fname)}
                className={`h-full px-3 flex items-center gap-2 text-[12px] font-sans cursor-pointer min-w-fit max-w-[160px] relative group border-r border-[#2b2b2b] transition-none select-none ${isSelected ? 'bg-[#1f1f1f]' : 'bg-[#181818] hover:bg-[#2a2d2e]/50 text-[#858585]'}`}
              >
                {isSelected && <div className="absolute top-0 left-0 right-0 h-[1px] bg-accent" />}
                <div className="flex items-center gap-2">
                  {officialIconUrl ? (
                    <img 
                      src={officialIconUrl} 
                      alt={extension} 
                      className="w-3.5 h-3.5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <FileIcon size={14} className={`${iconColor}`} />
                  )}
                  <span className={`${isSelected ? 'text-[#ffffff] font-medium' : 'text-[#858585]'} truncate tracking-tight`}>
                    {fname.split('/').pop()}
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCloseFile?.(fname); }}
                  className={`ml-1.5 p-0.5 rounded-[2px] transition-opacity flex items-center justify-center ${isSelected ? 'opacity-100 hover:bg-white/10' : 'opacity-0 group-hover:opacity-100 hover:bg-white/10'}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-0.5 px-2 h-full bg-[#181818]">
          <button 
            onClick={onCreateNewProject}
            className="p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="New Project"
          >
            <Plus size={16} />
          </button>
          <button 
            onClick={onPlay}
            className="p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Run Code"
          >
            <Play size={16} fill="currentColor" />
          </button>
          <button 
            onClick={() => setShowInlineAI(true)}
            className="p-1.5 hover:bg-white/5 text-orange-400 hover:text-white transition-colors"
            title="AI Inline Edit (Ctrl+K)"
          >
            <Sparkles size={16} />
          </button>
          <button 
            onClick={onToggleSplit}
            className="hidden md:flex p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Split Editor"
          >
            <Maximize size={16} />
          </button>
          {isSplitPane && (
            <button 
              onClick={onClosePane}
              className="flex p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              title="Close Pane"
            >
              <X size={16} />
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              title="More Actions"
            >
              <MoreVertical size={16} />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <div key="more-menu">
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-1 w-52 bg-[#181818] border border-[#2b2b2b] shadow-2xl z-50 py-1 overflow-hidden"
                  >
                    <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-[#2b2b2b] mb-1">
                        AI Assistants
                      </div>
                      <button
                        onClick={() => { handleAIAction('refactor'); setShowMoreMenu(false); }}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2"
                      >
                        <Sparkles size={14} className="text-orange-400" />
                        AI Refactor
                      </button>
                      <button
                        onClick={() => { handleAIAction('document'); setShowMoreMenu(false); }}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2"
                      >
                        <FileText size={14} className="text-blue-400" />
                        AI Document
                      </button>
                      <div className="my-1 border-t border-[#2b2b2b]" />
                      <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        Editor Tools
                      </div>
                      <button
                        onClick={() => { handleFormat(); setShowMoreMenu(false); }}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2 mb-1"
                      >
                        <Edit size={14} />
                        Format Code
                      </button>
                      <button
                        onClick={() => onSaveSelectedAsSnippet?.()}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2 mb-1"
                      >
                        <PlusSquare size={14} className="text-accent" />
                        Save Selection as Snippet
                      </button>
                      <button
                        onClick={() => { onSetActiveTab?.('snippets'); setShowMoreMenu(false); }}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2 mb-1"
                      >
                        <Blocks size={14} className="text-accent" />
                        Manage Snippets
                      </button>
                      <button
                        onClick={() => { onShowHelp?.(); setShowMoreMenu(false); }}
                        className="w-full px-3 py-2 text-left text-[12px] text-zinc-400 hover:text-white hover:bg-[#094771] flex items-center gap-2 mb-1"
                      >
                        <HelpCircle size={14} />
                        Help & Documentation
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      
      {/* VS Code Breadcrumb Bar */}
      <div className="h-[22px] flex items-center px-4 gap-0.5 text-[12px] font-sans select-none border-b border-[#2b2b2b] overflow-x-auto no-scrollbar whitespace-nowrap" style={{ backgroundColor: '#1f1f1f', color: '#858585' }}>
         <span className="hover:text-white cursor-pointer px-0.5 transition-colors">reversx-workspace</span>
         <ChevronRight size={14} className="opacity-40" />
         <span className="hover:text-white cursor-pointer px-0.5 transition-colors">src</span>
         <ChevronRight size={14} className="opacity-40" />
         <div className="flex items-center gap-1 text-[#cccccc] hover:text-white cursor-pointer px-0.5 transition-colors font-medium">
           {filename.endsWith('html') && <FileCode size={12} className="text-orange-400" />}
           {filename.endsWith('css') && <FileCode size={12} className="text-blue-400" />}
           {(filename.endsWith('js') || filename.endsWith('ts') || filename.endsWith('tsx')) && <FileCode size={12} className="text-blue-400" />}
           <span>{filename}</span>
         </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden bg-background flex flex-col">
            {showInlineAI && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#252526] border border-[#3e3e42] rounded-lg shadow-2xl z-[100] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">AI Inline Edit</span>
                  </div>
                  <button onClick={() => setShowInlineAI(false)} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    autoFocus
                    value={inlineAIPrompt}
                    onChange={(e) => setInlineAIPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleInlineAI();
                      }
                      if (e.key === 'Escape') {
                        setShowInlineAI(false);
                      }
                    }}
                    placeholder="Describe how to change the code... (Enter to apply)"
                    className="w-full bg-[#1e1e1e] border border-[#3e3e42] rounded p-2 text-[13px] text-white focus:outline-none focus:border-accent min-h-[80px] resize-none"
                  />
                  {inlineAILoading && (
                    <div className="absolute inset-0 bg-[#252526]/50 flex items-center justify-center rounded">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>ESC to cancel</span>
                  <span>ENTER to generate</span>
                </div>
              </div>
            )}
            {language === 'image' || filename.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i) ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto relative" style={{ backgroundColor: '#1e1e1e' }}>
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <img src={localValue} alt={filename} className="max-w-full max-h-full object-contain rounded shadow-lg ring-1 ring-white/10 z-10" />
                 <div className="mt-6 text-white/50 text-[11px] font-mono select-all z-10 bg-black/40 px-3 py-1.5 rounded border border-white/5 flex items-center justify-center">
                    {filename} • {Math.round(localValue.length / 1024)} KB
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden relative">
              <React.Suspense fallback={<div className="h-full w-full"><Skeleton className="h-full w-full" /></div>}>
                <CodeMirror
                  value={localValue}
                  height="100%"
                  className="w-full h-full"
                  theme={vscodeDark}
                  extensions={editorExtensions}
                  onChange={(val) => handleLocalChange(val || '')}
                  onUpdate={handleEditorUpdate}
                  onCreateEditor={(view) => {
                    viewRef.current = view;
                    onSetActiveEditor?.(view);
                  }}
                  style={{ 
                    fontSize: `${fontSize || 13}px`, 
                    fontFamily: fontFamily || '"JetBrains Mono", monospace' 
                  }}
                />
              </React.Suspense>
            </div>
            )}
      </div>

      {/* VS Code Style Editor Status Bar */}
      <div className="hidden md:flex h-[22px] items-center justify-between px-2 text-[11px] font-sans select-none shrink-0" style={{ backgroundColor: '#181818', color: '#cccccc', borderTop: '1px solid #2b2b2b' }}>
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            <GitBranch size={12} />
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            <span className="flex items-center gap-1"><span className="text-[10px]">❌</span> 0</span>
            <span className="flex items-center gap-1"><span className="text-[10px]">⚠️</span> 0</span>
          </div>
        </div>
        <div className="flex items-center gap-3 h-full">
          <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            Ln {cursorPos.row}, Col {cursorPos.column}
          </div>
          <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            Spaces: 2
          </div>
          <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            UTF-8
          </div>
          <div className="flex items-center hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
            <Settings size={12} />
          </div>
        </div>
      </div>

      {/* Professional Compact Mobile Keyboard Toolbar - Improved Multi-Row Layout */}
      <div className="md:hidden bg-[#2d2d2d] border-t border-black flex flex-col shrink-0 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
        {/* Row 1: Navigation & Undo/Redo */}
        <div className="px-1 py-1 flex items-center overflow-x-auto no-scrollbar gap-1.5 custom-scrollbar-hide h-[38px] bg-[#2d2d2d]">
          <button onClick={() => handleKeyboardAction('left')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><ChevronLeft size={16} /></button>
          <button onClick={() => handleKeyboardAction('up')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><ChevronUp size={16} /></button>
          <button onClick={() => handleKeyboardAction('down')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><ChevronDown size={16} /></button>
          <button onClick={() => handleKeyboardAction('right')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><ChevronRight size={16} /></button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5 shrink-0" />
          <button onClick={() => handleKeyboardAction('undo')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><Undo2 size={16} /></button>
          <button onClick={() => handleKeyboardAction('redo')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"><Redo2 size={16} /></button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5 shrink-0" />
          <button onClick={() => handleKeyboardAction('search')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#2b2b2b] rounded-[0px] text-white active:bg-[#202020] transition-all shrink-0" title="Find & Replace (Ctrl+F)"><Search size={14} /></button>
          <button onClick={() => onShowQuickOpen?.()} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#2b2b2b] rounded-[0px] text-white active:bg-[#202020] transition-all shrink-0" title="Quick Open (Ctrl+P)"><SearchCode size={14} /></button>
          <button onClick={() => onShowCommandPalette?.()} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#2b2b2b] rounded-[0px] text-white active:bg-[#202020] transition-all shrink-0" title="Command Palette (Ctrl+Shift+P)"><Codicon name="terminal" size={14} /></button>
          <button onClick={() => handleKeyboardAction('tab')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#2b2b2b] rounded-[0px] text-white active:bg-[#202020] transition-all shrink-0"><ArrowRightToLine size={14} /></button>
          <button onClick={() => handleKeyboardAction('save')} className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#2b2b2b] rounded-[0px] text-accent active:bg-[#202020] transition-all shrink-0" title="Save"><Save size={14} /></button>
        </div>

        {/* Row 2: Character Symbols (Middle) */}
        <div className="px-1 py-1 border-t border-black/20 flex items-center overflow-x-auto no-scrollbar gap-1 custom-scrollbar-hide h-[34px] bg-[#222222]">
          {['<', '>', '/', '{', '}', '[', ']', ';', '(', ')', '"', "'", ':', '=', '!', '&', '|', '+', '-', '*', '%', '?', '#', '$', '@', '^', '~', '`'].map(char => (
            <button
              key={char}
              onClick={() => insertText(char)}
              className="w-7 h-6 flex items-center justify-center bg-[#333333] border border-[#555555] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[10px] font-medium text-[#e0e0e0] active:bg-[#111111] transition-all shrink-0"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Row 3: Primary Controls (Absolute Bottom Row) */}
        <div className="px-1 py-1 border-t border-black/30 flex items-center overflow-x-auto no-scrollbar gap-1.5 custom-scrollbar-hide h-[40px] bg-[#1a1a1a]">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCtrlActive(!isCtrlActive); viewRef.current?.focus(); }} 
            className={`h-7 px-2 border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[10px] font-bold transition-all shadow-md shrink-0 ${isCtrlActive ? 'bg-[#007acc] text-white border-white/40 ring-1 ring-accent/50' : 'bg-[#404040] text-white shadow-black/50'}`}
          >
            Ctrl
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShiftActive(!isShiftActive); viewRef.current?.focus(); }} 
            className={`h-7 px-2 border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[10px] font-bold transition-all shadow-md shrink-0 ${isShiftActive ? 'bg-[#007acc] text-white border-white/40 ring-1 ring-accent/50' : 'bg-[#404040] text-white shadow-black/50'}`}
          >
            Shift
          </button>
          <div className="w-[1px] h-5 bg-white/10 mx-0.5 shrink-0" />
          <button 
            onClick={() => onShowPreview?.(false)} 
            className="h-7 px-3 bg-[#333333] border border-[#555555] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[9px] font-bold text-white active:bg-[#111111] transition-all shrink-0 tracking-tighter"
          >
            Code
          </button>
          <button 
            onClick={() => onShowPreview?.(true)} 
            className="h-7 px-3 bg-[#333333] border border-[#555555] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[9px] font-bold text-white active:bg-[#111111] transition-all shrink-0 tracking-tighter"
          >
            Preview
          </button>
          <button 
            onClick={onOpenFull} 
            className="h-7 px-3 bg-[#333333] border border-[#555555] border-b-[#111111] border-r-[#111111] rounded-[2px] text-[9px] font-bold text-white active:bg-[#111111] transition-all shrink-0 tracking-tighter"
          >
            Full
          </button>
          <div className="w-[1px] h-5 bg-white/10 mx-0.5 shrink-0" />
          <button 
            onClick={onShowSettings} 
            className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button 
            onClick={() => onSetActiveTab?.('terminal')} 
            className="w-8 h-7 flex items-center justify-center bg-[#404040] border border-[#777777] border-b-[#111111] border-r-[#111111] rounded-[2px] text-white active:bg-[#202020] transition-all shrink-0"
            title="Terminal"
          >
            <TerminalIcon size={14} />
          </button>
        </div>
      </div>

      {/* Paste Fallback Modal */}
      <AnimatePresence mode="wait">
        {showPasteModal && (
          <div key="paste-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <h3 className="text-lg font-normal text-foreground mb-2">Paste Content</h3>
              <p className="text-sm text-foreground/50 mb-4">
                Direct clipboard access is blocked by your browser's security policy. 
                Please paste your code below and click "Insert".
              </p>
              <textarea
                autoFocus
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                className="w-full h-40 bg-background border border-border rounded p-3 text-sm font-roboto text-foreground focus:outline-none focus:border-accent resize-none mb-4"
                placeholder="Paste your code here..."
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowPasteModal(false);
                    setPasteValue('');
                  }}
                  className="px-4 py-2 text-sm font-normal text-foreground/50 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleManualPaste}
                  className="px-6 py-2 bg-accent text-accent-foreground text-sm font-normal rounded hover:bg-accent/90 transition-colors"
                >
                  Insert Code
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

const ChatList = React.memo(({ 
  messages, 
  isLoading, 
  chatContainerRef, 
  handleScroll, 
  chatEndRef, 
  theme, 
  themeName,
  userName,
  onEditAttachment,
  getPlatformConfig
}: { 
  messages: Message[], 
  isLoading: boolean, 
  chatContainerRef: React.RefObject<HTMLDivElement | null>, 
  handleScroll: () => void, 
  chatEndRef: React.RefObject<HTMLDivElement | null>,
  theme: any,
  themeName: string,
  userName: string | null,
  onEditAttachment?: (att: Attachment) => void,
  getPlatformConfig?: () => any
}) => {
  return (
    <div 
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col min-h-0"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {messages.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center py-20 w-full"
          >
            <div className="flex flex-col items-center justify-center">
              <svg className="w-40 h-40 mb-8" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M 200 40 L 340 360 L 200 250 L 60 360 Z" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeLinejoin="round"
                  className="opacity-80 text-foreground"
                />
              </svg>
              <h1 className="text-[48px] font-semibold text-foreground tracking-tighter m-0" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                Revers<span className="font-light opacity-70">X</span>
              </h1>
            </div>
          </motion.div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage 
              key={msg.id || i} 
              msg={msg} 
              theme={theme} 
              themeName={themeName} 
              onEditAttachment={onEditAttachment} 
              isGenerating={isLoading && i === messages.length - 1 && msg.role === 'model'}
              getPlatformConfig={getPlatformConfig}
            />
          ))
        )}
      </AnimatePresence>
      {isLoading && (!messages[messages.length - 1] || messages[messages.length - 1].role !== 'model' || !messages[messages.length - 1].reasoning) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-[420px] font-mono select-none my-6 ml-2"
        >
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-2 font-sans px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse" />
            <span className="tracking-wide">Terminal — thought-engine</span>
          </div>
          <div className="bg-[#1e1e1e] border border-white/[0.08] rounded-md overflow-hidden shadow-2xl">
            <div className="p-4 flex items-start gap-3">
              <div className="text-blue-400 mt-1">
                <Terminal size={14} />
              </div>
              <div className="flex-1 space-y-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#cccccc] text-[13px]">Resolving context...</span>
                  <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0 }}
                    className="w-[0.6ch] h-[1.1em] bg-blue-400/50 inline-block align-middle"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1 border-t border-white/[0.03]">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                    <span>Checking workspace status</span>
                    <span>1.0.4</span>
                  </div>
                  <div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500/40"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 0 }}
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
});


import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

type TreeNodeType = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: Record<string, TreeNodeType>;
};

const getOfficialIcon = (ext: string) => {
  const icons: Record<string, string> = {
    html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    js: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    jsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    ts: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    tsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    py: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    md: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg',
    json: 'https://raw.githubusercontent.com/otaviopace/devicon/master/icons/json/json-original.svg'
  };
  return icons[ext] || null;
};

const FileTreeItem = React.memo(({ node, activeFile, activeFileMenu, handleFileOpen, setActiveFileMenu, handleRenameFile, handleDeleteFile, handleDownloadFile, depth = 0 }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
     FolderOpen, ChevronDownIcon, ChevronRightIcon, File, FileJson, ImageIcon, Edit3, Trash2, MoreVertical, Download
  } = useIcons();

  if (node.type === 'folder') {
    return (
      <div className="w-full flex flex-col">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-1.5 py-1 text-[13px] transition-all duration-200 group cursor-pointer text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white relative`}
          style={{ paddingLeft: `${Math.max(12, depth * 12 + 12)}px`, paddingRight: '16px' }}
        >
          {/* Indent Guide Line for Folders */}
          {depth > 0 && Array.from({ length: depth }).map((_, i) => (
            <div 
              key={i}
              className="absolute border-l border-white/5 h-full"
              style={{ left: `${i * 12 + 12}px` }}
            />
          ))}

          <div className="w-3.5 flex items-center justify-center opacity-80 group-hover:opacity-100">
            {isOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
          </div>
          <div className="text-accent/80 group-hover:text-accent transition-colors">
            {isOpen ? <FolderOpen size={14} /> : <FolderClosedIcon size={14} />}
          </div>
          <span className="truncate flex-1 font-medium tracking-tight">{node.name}</span>
        </div>
        {isOpen && Object.values(node.children).sort((a: any, b: any) => {
           if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
           return a.name.localeCompare(b.name);
        }).map((child: any) => (
          <FileTreeItem 
            key={child.path}
            node={child}
            activeFile={activeFile}
            activeFileMenu={activeFileMenu}
            handleFileOpen={handleFileOpen}
            setActiveFileMenu={setActiveFileMenu}
            handleRenameFile={handleRenameFile}
            handleDeleteFile={handleDeleteFile}
            handleDownloadFile={handleDownloadFile}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  // File rendering
  const name = node.path;
  const isSelected = activeFile === name;
  const extension = name.split('.').pop()?.toLowerCase() || '';
  
  const officialIconUrl = getOfficialIcon(extension);
  let Icon = File;
  let iconColor = isSelected ? 'text-white' : 'text-[#cccccc]';

  if (!officialIconUrl) {
    if (extension === 'json') {
      Icon = FileJson;
      iconColor = isSelected ? 'text-white' : 'text-orange-400';
    } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
      Icon = ImageIcon;
      iconColor = isSelected ? 'text-white' : 'text-emerald-400';
    }
  }

  return (
    <div
      onClick={() => handleFileOpen(name)}
      className={`w-full flex items-center gap-2 py-1 text-[13px] transition-all duration-100 group cursor-pointer relative ${isSelected ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'}`}
      style={{ paddingLeft: `${Math.max(12, depth * 12 + 16)}px`, paddingRight: '16px' }}
    >
      {/* Indent Guide Line */}
      {depth > 0 && Array.from({ length: depth }).map((_, i) => (
        <div 
          key={i}
          className="absolute border-l border-white/5 h-full"
          style={{ left: `${i * 12 + 12}px` }}
        />
      ))}

      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
      
      {officialIconUrl ? (
        <img 
          src={officialIconUrl} 
          alt={extension} 
          className="w-3.5 h-3.5 object-contain transition-transform duration-300 group-hover:scale-110" 
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <Icon size={14} className={`${iconColor} transition-transform duration-300 group-hover:scale-110`} />
      )}
      
      <span className={`truncate flex-1 tracking-tight ${isSelected ? 'font-medium' : 'font-normal'}`}>{node.name}</span>
      
      <div className="relative flex items-center shrink-0">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setActiveFileMenu(name === activeFileMenu ? null : name); 
          }}
          className="p-1 hover:bg-white/10 rounded text-foreground-subtle hover:text-foreground-muted transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={14} />
        </button>

        <AnimatePresence>
          {activeFileMenu === name && (
            <>
              <div 
                className="fixed inset-0 z-[60]" 
                onClick={(e) => { e.stopPropagation(); setActiveFileMenu(null); }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-1 w-32 bg-[#252526] border border-white/10 rounded-md shadow-xl z-[70] py-1 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-2 text-left text-[12px] text-foreground-muted hover:text-foreground hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <Edit3 size={12} />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-2 text-left text-[12px] text-red-400/60 hover:text-red-400 hover:bg-red-500/5 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFile(name);
                    setActiveFileMenu(null);
                  }}
                  className="w-full px-3 py-2 text-left text-[12px] text-foreground-muted hover:text-foreground hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <Download size={12} />
                  Download
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

const SnippetEditorModal = ({ snippet, onSave, onClose }: any) => {
  const [name, setName] = useState(snippet?.name || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#252526]">
          <h3 className="text-sm font-medium text-white">{snippet?.id ? 'Edit Snippet' : 'New Snippet'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Snippet Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Fetch Helper"
                className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-[13px] text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-[13px] text-white focus:outline-none focus:border-accent appearance-none capitalize"
              >
                {['javascript', 'typescript', 'html', 'css', 'python', 'json', 'markdown', 'java', 'cpp'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Description (Optional)</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of what this snippet does"
              className="w-full bg-black/40 border border-white/10 rounded-md p-2.5 text-[13px] text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[300px]">
            <label className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Code Content</label>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              className="w-full flex-1 bg-black/60 border border-white/10 rounded-md p-4 text-[12px] text-zinc-300 font-mono focus:outline-none focus:border-accent resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 bg-[#252526] border-t border-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[12px] text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave({ id: snippet?.id, name, description, code, language })}
            disabled={!name.trim() || !code.trim()}
            className="px-6 py-2 bg-accent hover:bg-blue-600 text-white text-[12px] font-medium rounded-md transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            {snippet?.id ? 'Update Snippet' : 'Save Snippet'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const buildFileTree = (filesList: string[]) => {
  const root: TreeNodeType = { name: 'root', type: 'folder', children: {}, path: '' };
  filesList.forEach(path => {
    const parts = path.split('/');
    let current = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current.children[part] = { name: part, type: 'file', path: path, children: {} };
      } else {
        if (!current.children[part]) {
          current.children[part] = { name: part, type: 'folder', children: {}, path: parts.slice(0, i + 1).join('/') };
        }
        current = current.children[part];
      }
    });
  });
  return root;
};

export default function App() {
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [previewPendingIdx, setPreviewPendingIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const stopRef = useRef(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'settings' | 'search'>('projects');
  const [docLanguage, setDocLanguage] = useState<'en' | 'bn'>('en');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalReplaceQuery, setGlobalReplaceQuery] = useState('');
  const [globalSearchOptions, setGlobalSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false
  });
  const [globalSearchResults, setGlobalSearchResults] = useState<{ filename: string, matches: { line: number, text: string, index: number }[] }[]>([]);

  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'cmd' | 'output' | 'error', text: string }[]>([
    { type: 'output', text: 'ReversX v1 Terminal - Type "help" for a list of commands.' }
  ]);
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isGithubImportOpen, setIsGithubImportOpen] = useState(false);
  const [isGithubExportOpen, setIsGithubExportOpen] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [githubExportRepo, setGithubExportRepo] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubCommitMessage, setGithubCommitMessage] = useState('Update from ReversX Editor');
  const [isGitHubImporting, setIsGitHubImporting] = useState(false);
  const [isGitHubExporting, setIsGitHubExporting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const exchangeToken = async () => {
        setIsGitHubExporting(true);
        try {
          const res = await fetch('/api/github/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.access_token) {
            setGithubToken(data.access_token);
            if (isDbLoaded) idbSet('reversx_github_token', data.access_token);
            setIsGithubExportOpen(true);
          } else {
            throw new Error(data.error_description || data.error || 'Failed to authenticate');
          }
        } catch (err: any) {
          console.error('GitHub Auth Error:', err);
        } finally {
          setIsGitHubExporting(false);
        }
      };
      exchangeToken();
    }
  }, [isDbLoaded]);

  const handleGithubLogin = useCallback(() => {
    const clientId = (import.meta as any).env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = (import.meta as any).env.VITE_GITHUB_REDIRECT_URI || window.location.origin;
    if (!clientId) {
      alert('GitHub Client ID is not configured. Please add VITE_GITHUB_CLIENT_ID in the dashboard settings.');
      return;
    }
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
    window.location.href = githubUrl;
  }, []);

  const getPlatformConfig = useCallback((): { platform: string, apiKey: string, model: string, extra?: { baseURL?: string } } => {
    return { platform: 'gemini', apiKey: geminiApiKey || 'env-key', model: geminiModel };
  }, [geminiApiKey, geminiModel]);

  const [mainView, setMainView] = useState<'editor' | 'preview' | 'projects' | 'settings'>('editor');
  const [mobileView, setMobileView] = useState<'editor' | 'chat' | 'preview' | 'tab'>('editor');
  const [showSnippetEditor, setShowSnippetEditor] = useState<Snippet | null>(null);
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);
  const [showProjectNaming, setShowProjectNaming] = useState(false);
  const appliedBlocks = useRef<Set<number>>(new Set());
  const [pendingProjectName, setPendingProjectName] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState('');
  const [pendingUserAttachments, setPendingUserAttachments] = useState<Attachment[]>([]);
  const [editingAttachment, setEditingAttachment] = useState<{ attachment: Attachment, index?: number, isPending: boolean } | null>(null);
  const [pendingUserAttachmentsForAI, setPendingUserAttachmentsForAI] = useState<Attachment[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [editorFontSize, setEditorFontSize] = useState(13);
  const [editorFontFamily, setEditorFontFamily] = useState('"JetBrains Mono", monospace');
  const editorThemeName = 'VS Code Dark';
  const currentEditorTheme = vscDarkPlus;
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [appThemeName, setAppThemeName] = useState('VS Code Dark');
  const [iconThemeName, setIconThemeName] = useState('VS code');
  const [appFontName, setAppFontName] = useState('Inter');

  const [markers, setMarkers] = useState<EditorMarker[]>([]);
  const [auditResults, setAuditResults] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'laptop' | 'desktop'>('desktop');
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const [files, setFiles] = useState<Record<string, { code: string, language: string }>>({});
  const [previewFiles, setPreviewFiles] = useState<Record<string, { code: string, language: string }>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [activeFileSecondary, setActiveFileSecondary] = useState<string | null>(null);
  const [editorPanes, setEditorPanes] = useState<string[]>([]);
  const [paneWidths, setPaneWidths] = useState<number[]>([100]);
  const [isResizingPane, setIsResizingPane] = useState<number | null>(null);

  useEffect(() => {
    // Sync pane widths when panes are added/removed
    if (editorPanes.length !== paneWidths.length) {
      const equalWidth = 100 / editorPanes.length;
      setPaneWidths(new Array(editorPanes.length).fill(equalWidth));
    }
  }, [editorPanes.length]);

  const startResizingPane = (index: number) => {
    setIsResizingPane(index);
  };

  const stopResizingPane = () => {
    setIsResizingPane(null);
  };

  const handlePaneResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizingPane === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const container = document.getElementById('main-editor-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const totalWidth = rect.width;
    const percentage = (x / totalWidth) * 100;

    setPaneWidths(prev => {
      const next = [...prev];
      const i = isResizingPane;
      
      // Calculate current cumulative percentage up to the pane before the handle
      let leftCumulative = 0;
      for (let j = 0; j < i; j++) leftCumulative += next[j];
      
      const minWidth = 10; // 10% minimum width
      const delta = percentage - (leftCumulative + next[i]);
      
      if (next[i] + delta > minWidth && next[i+1] - delta > minWidth) {
        next[i] += delta;
        next[i+1] -= delta;
      }
      
      return next;
    });
  }, [isResizingPane]);

  useEffect(() => {
    if (isResizingPane !== null) {
      window.addEventListener('mousemove', handlePaneResize);
      window.addEventListener('mouseup', stopResizingPane);
      window.addEventListener('touchmove', handlePaneResize);
      window.addEventListener('touchend', stopResizingPane);
      return () => {
        window.removeEventListener('mousemove', handlePaneResize);
        window.removeEventListener('mouseup', stopResizingPane);
        window.removeEventListener('touchmove', handlePaneResize);
        window.removeEventListener('touchend', stopResizingPane);
      };
    }
  }, [isResizingPane, handlePaneResize]);

  const [focusedPaneIndex, setFocusedPaneIndex] = useState(0);
  const [focusedPane, setFocusedPane] = useState<'left' | 'right'>('left');
  const [editorSplit, setEditorSplit] = useState(false);
  const [editorSplitRatio, setEditorSplitRatio] = useState(50);
  const [isResizingEditorSplit, setIsResizingEditorSplit] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isExplorerCreateMenuOpen, setIsExplorerCreateMenuOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameOldName, setRenameOldName] = useState('');
  const [renameNewName, setRenameNewName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showQuickOpen, setShowQuickOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [activeFileMenu, setActiveFileMenu] = useState<string | null>(null);
  const fileHandles = useRef<Record<string, any>>({});
  const [copied, setCopied] = useState(false);

  // Persistence Effects
  useEffect(() => {
    if (isDbLoaded && userName) idbSet('reversx_userName', userName);
  }, [userName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_messages', messages);
  }, [messages, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_gemini_model', geminiModel);
  }, [geminiModel, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_gemini_key', geminiApiKey);
  }, [geminiApiKey, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_active_tab', activeTab);
  }, [activeTab, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_github_token', githubToken);
  }, [githubToken, isDbLoaded]);

  useEffect(() => {
    if (activeFile && files[activeFile]) {
      const newMarkers = checkErrors(files[activeFile].code, files[activeFile].language);
      setMarkers(newMarkers);
    }
  }, [files, activeFile]);

  const handleAudit = useCallback(async (type: 'bugs' | 'security' | 'performance') => {
    if (!activeFile || !files[activeFile] || isLoading) return;
    
    setIsLoading(true);
    setAuditResults(null);

    const code = files[activeFile].code;
    const lang = files[activeFile].language;
    
    let sysPrompt = "";
    if (type === 'bugs') {
      sysPrompt = "You are a World-Class Bug Hunter. Analyze the following code specifically for logical errors, edge cases, and runtime bugs. List the issues found and provide fixes. Speak in Bengali if possible for the descriptions.";
    } else if (type === 'security') {
      sysPrompt = "You are a Cyber-Security Expert. Perform a deep security audit on this code. Look for XSS, SQL injection, insecure storage, and sensitive data leaks. Provide clear warnings and solutions. Use Bengali for explanations.";
    } else {
      sysPrompt = "You are a Performance Engineer. Analyze this code for performance bottlenecks, memory leaks, and inefficient algorithms. Provide optimization tips. Use Bengali for explanations.";
    }

    const prompt = `${sysPrompt}\n\nCode Preview:\n\`\`\`${lang}\n${code}\n\`\`\``;
    
    try {
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
      const res = await chatWithAI(prompt, [], currentApiKey, currentModel, currentPlatform, [], extra);
      setAuditResults(res);
      
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFile, files, isLoading]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_theme', editorThemeName);
  }, [editorThemeName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_font_size', editorFontSize.toString());
  }, [editorFontSize, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_editor_font_family', editorFontFamily);
  }, [editorFontFamily, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_split_screen', isSplitScreen.toString());
  }, [isSplitScreen, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_open_files', openFiles);
  }, [openFiles, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_app_theme', appThemeName);
  }, [appThemeName, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_icon_theme', iconThemeName);
  }, [iconThemeName, isDbLoaded]);
  
  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_app_font', appFontName);
  }, [appFontName, isDbLoaded]);
  
  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_projects', projects);
  }, [projects, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) {
      if (activeProjectId) {
        idbSet('reversx_active_project_id', activeProjectId);
      } else {
        idbDel('reversx_active_project_id');
      }
    }
  }, [activeProjectId, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_files', files);
  }, [files, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded) idbSet('reversx_active_file', activeFile);
  }, [activeFile, isDbLoaded]);

  // Initial Data Load
  useEffect(() => {
    const loadState = async () => {
      try {
        const checkAndMigrate = async (key: string, parse = false, defaultVal: any = null) => {
          let val = await idbGet(key);
          if (val === undefined) {
            const lsVal = localStorage.getItem(key);
            if (lsVal !== null) {
              val = parse ? JSON.parse(lsVal) : lsVal;
              await idbSet(key, val); 
            } else {
              val = defaultVal;
            }
          } else if (parse && typeof val === 'string') {
            try {
              // Automatically recover stringified data mistakenly saved as strings back into objects
              val = JSON.parse(val);
              await idbSet(key, val); // update it back correctly
            } catch (e) {
              console.warn(`Could not parse ${key} from string fallback: `, val);
            }
          }
          return val;
        };

        const dbUserName = await checkAndMigrate('reversx_userName', false, null);
        setUserName(dbUserName);
        setShowNamePrompt(!dbUserName);

        const loadedMessages = await checkAndMigrate('reversx_messages', true, []);
        if (loadedMessages.length > 0) setMessages(loadedMessages);

        const loadedProjects = await checkAndMigrate('reversx_projects', true, []);
        if (loadedProjects.length > 0) setProjects(loadedProjects);

        setActiveProjectId(await checkAndMigrate('reversx_active_project_id', false, null));
        setActiveTab(await checkAndMigrate('reversx_active_tab', false, 'projects'));
        setGeminiApiKey(await checkAndMigrate('reversx_gemini_key', false, ''));
        
        let initialGeminiModel = await checkAndMigrate('reversx_gemini_model', false, 'gemini-2.0-flash');
        if (initialGeminiModel === 'gemini-2.0-flash-exp' || initialGeminiModel === 'gemini-1.5-flash-exp') {
          initialGeminiModel = 'gemini-2.0-flash';
          idbSet('reversx_gemini_model', initialGeminiModel);
        }
        setGeminiModel(initialGeminiModel);

        setGithubToken(await checkAndMigrate('reversx_github_token', false, ''));
        
        setEditorFontSize(Number(await checkAndMigrate('reversx_editor_font_size', false, 13)));
        setEditorFontFamily(await checkAndMigrate('reversx_editor_font_family', false, '"JetBrains Mono", monospace'));
        
        const splitVal = await checkAndMigrate('reversx_split_screen', false, 'false');
        setIsSplitScreen(splitVal === 'true' || splitVal === true);
        
        const defaultFiles = {};
        const loadedFiles = await checkAndMigrate('reversx_files', true, defaultFiles);
        setFiles(loadedFiles);
        setPreviewFiles(loadedFiles);
        setActiveFile(await checkAndMigrate('reversx_active_file', false, ''));
        setOpenFiles(await checkAndMigrate('reversx_open_files', true, []));
        setAppThemeName(await checkAndMigrate('reversx_app_theme', false, 'VS Code Dark'));
        setIconThemeName(await checkAndMigrate('reversx_icon_theme', false, 'VS code'));
        setAppFontName(await checkAndMigrate('reversx_app_font', false, 'Inter'));

        setIsDbLoaded(true);
      } catch (err) {
        console.error("Failed to load from IndexedDB", err);
        setIsDbLoaded(true);
      }
    };
    setTimeout(loadState, 4000);
  }, []);

  const activeEditorRef = useRef<any>(null);

  const insertText = (text: string) => {
    if (activeEditorRef.current) {
      const selection = activeEditorRef.current.getSelection();
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      };
      activeEditorRef.current.executeEdits('', [{ range: range, text: text }]);
      activeEditorRef.current.focus();
    }
  };

  const handleSaveSelectedAsSnippet = useCallback(() => {
    if (activeEditorRef.current) {
      const selection = activeEditorRef.current.getSelection();
      const model = activeEditorRef.current.getModel();
      const selectedText = model.getValueInRange(selection);
      
      if (selectedText) {
        setShowSnippetEditor({
          id: '',
          name: '',
          code: selectedText,
          language: files[activeFile]?.language || 'javascript',
          createdAt: Date.now()
        });
      }
    }
  }, [files, activeFile]);

  
  const currentAppTheme = React.useMemo(() => APP_THEMES[appThemeName] || APP_THEMES['VS Code Dark'], [appThemeName]);
  const currentIconTheme = React.useMemo(() => {
    const theme = ICON_THEMES[iconThemeName] || ICON_THEMES['VS code'];
    return { ...ICON_THEMES['VS code'], ...theme };
  }, [iconThemeName]);

  const { 
    MessageSquare, Code, Settings, Files, Play, ChevronRight, ChevronLeft, ChevronDown, 
    Send, User, Terminal, Plus, Copy, Check, Trash2, Edit3, Undo2, Redo2, 
    ClipboardPaste, Save, RefreshCw, Maximize2, FolderOpen, ArrowUp, Wand2, 
    Sparkles, Hash, Bug, FileText, Loader2, Users, Paperclip, HelpCircle, ImageIcon, FileCode, 
    FileJson, File, ChevronDownIcon, ChevronRightIcon, MoreVertical, SearchCode, CheckCircle2,
    Bell, GitBranch, Key, Edit, Palette, Search
  } = currentIconTheme;
  
  const combinedHtml = React.useMemo(() => {
    const htmlFile = previewFiles['index.html'] || Object.values(previewFiles).find(f => f.language === 'html');
    if (!htmlFile) {
      const activeF = previewFiles[activeFile];
      if (!activeF) return '';
      let code = activeF.code;
      if (activeFile.endsWith('.ts') || activeFile.endsWith('.tsx')) {
        try {
          // Automatic Bare Import Resolution to CDN (esm.sh)
          const rewrittenCode = activeF.code.replace(
            /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
            `$1https://esm.sh/$2$3`
          );
          const transpiled = transform(rewrittenCode, { transforms: ['typescript', 'jsx'] }).code;
          code = `<!DOCTYPE html><html><head>
          <style>body { background: #0d0d0d; color: #e0e0e0; font-family: sans-serif; }</style>
          </head><body><script type="module">
          try {
            ${transpiled}
          } catch(e) {
            console.error('Runtime Error:', e);
            const errDiv = document.createElement('div');
            errDiv.style.color = '#f48771';
            errDiv.style.padding = '20px';
            errDiv.style.background = '#1e1e1e';
            errDiv.style.border = '1px solid #f48771';
            errDiv.style.borderRadius = '8px';
            errDiv.style.margin = '20px';
            errDiv.innerHTML = '<strong>Runtime Error:</strong><br>' + e.message;
            document.body.appendChild(errDiv);
          }
          </script></body></html>`;
        } catch (e: any) {
          return `<!DOCTYPE html><html><body><pre style="color:red;padding:20px;">Compilation Error: ${e.message}</pre></body></html>`;
        }
      }
      return code;
    }

    let combined = htmlFile.code;
    
    // Error Overlay Script
    const errorOverlayScript = `
    <script id="reversx-error-overlay">
      window.onerror = function(message, source, lineno, colno, error) {
        showError(message, source, lineno, colno, error);
        return false;
      };
      window.addEventListener('unhandledrejection', function(event) {
        showError(event.reason, 'Promise', '', '', event.reason);
      });
      function showError(msg, source, line, col, error) {
        const existing = document.getElementById('reversx-error-container');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = 'reversx-error-container';
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.left = '20px';
        div.style.right = '20px';
        div.style.background = '#1e1e1e';
        div.style.color = '#f48771';
        div.style.padding = '20px';
        div.style.borderRadius = '8px';
        div.style.fontSize = '13px';
        div.style.fontFamily = "'Fira Code', 'JetBrains Mono', monospace";
        div.style.zIndex = '999999';
        div.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        div.style.border = '1px solid #f48771';
        div.style.maxHeight = '80vh';
        div.style.overflowY = 'auto';
        
        let stack = error && error.stack ? error.stack : '';
        let cleanSource = source ? source.split('/').pop() : 'unknown';

        div.innerHTML = \`
          <div style="display:flex; justify-content:between; align-items:start; margin-bottom:10px;">
            <div style="flex:1">
              <strong style="font-size:15px; color:#f44336;">Runtime Error Found</strong>
              <div style="margin-top:8px; color:#fff; font-weight:bold;">\${msg}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding:0 5px;">&times;</button>
          </div>
          <div style="background:#252526; padding:12px; border-radius:4px; margin-top:10px; border-left:3px solid #f48771;">
            <div style="color:#858585; margin-bottom:5px;">Location:</div>
            <div style="color:#61afef;">\${cleanSource}\${line ? ':' + line : ''}\${col ? ':' + col : ''}</div>
            \${stack ? \`<div style="color:#858585; margin-top:10px; margin-bottom:5px;">Stack Trace:</div><pre style="margin:0; white-space:pre-wrap; font-size:11px; color:#abb2bf; opacity:0.8;">\${stack}</pre>\` : ''}
          </div>
          <div style="margin-top:15px; font-size:11px; color:#858585;">
            Tip: Check the line number in your code editor to fix this issue.
          </div>
        \`;
        document.body.appendChild(div);
      }
    </script>`;

    // Get image files
    const imageFiles = Object.entries(previewFiles).filter(([name, f]) => 
      f.language === 'image' || name.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)
    );

    // Replace images in HTML
    imageFiles.forEach(([imgName, imgF]) => {
      combined = combined.split(`"${imgName}"`).join(`"${imgF.code}"`)
                         .split(`'${imgName}'`).join(`'${imgF.code}'`)
                         .split(`"./${imgName}"`).join(`"${imgF.code}"`)
                         .split(`'./${imgName}'`).join(`'${imgF.code}'`);
    });

    // Inject all CSS files
    const cssFiles = Object.entries(previewFiles).filter(([name, f]) => name.endsWith('.css'));
    let cssContent = '';
    cssFiles.forEach(([name, f]) => {
      let code = f.code;
      // Replace images in CSS
      imageFiles.forEach(([imgName, imgF]) => {
        code = code.split(`"${imgName}"`).join(`"${imgF.code}"`)
                   .split(`'${imgName}'`).join(`'${imgF.code}'`)
                   .split(` url(${imgName})`).join(` url(${imgF.code})`)
                   .split(` url("${imgName}")`).join(` url("${imgF.code}")`)
                   .split(` url('${imgName}')`).join(` url('${imgF.code}')`);
      });
      cssContent += `\n/* --- ${name} --- */\n${code}\n`;
    });

    if (cssContent) {
      const styleTag = `<style id="reversx-injected-styles">${cssContent}</style>`;
      if (combined.includes('</head>')) {
        combined = combined.replace('</head>', `${styleTag}</head>`);
      } else if (combined.includes('<head>')) {
        combined = combined.replace('<head>', `<head>${styleTag}`);
      } else {
        combined = `<head>${styleTag}</head>` + combined;
      }
    }

    // Inject Error Overlay
    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${errorOverlayScript}</head>`);
    } else {
      combined = errorOverlayScript + combined;
    }

    // Inject all JS files
    const jsFiles = Object.entries(previewFiles).filter(([name, f]) => name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx'));
    
    // Generate Import Map for ES Modules
    const importMap: Record<string, string> = {};
    jsFiles.forEach(([name, f]) => {
      let code = f.code;
      if (name.endsWith('.ts') || name.endsWith('.tsx')) {
        try {
          // Bare import resolution for CDN
          const rewrittenCode = f.code.replace(
            /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
            `$1https://esm.sh/$2$3`
          );
          code = transform(rewrittenCode, { transforms: ['typescript', 'jsx'] }).code;
        } catch (e: any) {
          code = `console.error('Compilation Error in ${name}:', ${JSON.stringify(e.message)});`;
        }
      } else {
        // Even for JS, resolve bare imports
        code = f.code.replace(
          /(from\s+['"]|import\s+['"])(?!\.|\/|https?:\/\/)([^'"]+)(['"])/g,
          `$1https://esm.sh/$2$3`
        );
      }
      
      const blob = new Blob([code], { type: 'text/javascript' });
      importMap[`./${name}`] = URL.createObjectURL(blob);
      importMap[name] = importMap[`./${name}`];
    });

    const importMapScript = `<script type="importmap">${JSON.stringify({ imports: importMap })}</script>`;
    
    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${importMapScript}</head>`);
    } else {
      combined = importMapScript + combined;
    }

    // Find entry point or inject scripts
    let jsContent = '';
    jsFiles.forEach(([name, f]) => {
      // We only auto-inject scripts if they are NOT modules intended to be imported
      // or if they are traditionally used entry points
      if (name === 'index.js' || name === 'main.js' || name === 'script.js' || name === 'App.tsx' || name === 'main.tsx') {
        jsContent += `\nimport './${name}';\n`;
      }
    });

    if (jsContent) {
      const scriptTag = `<script type="module" id="reversx-injected-scripts">${jsContent}</script>`;
      if (combined.includes('</body>')) {
        combined = combined.replace('</body>', `${scriptTag}</body>`);
      } else if (combined.includes('</html>')) {
        combined = combined.replace('</html>', `${scriptTag}</html>`);
      } else {
        combined = combined + scriptTag;
      }
    }

    return combined;
  }, [previewFiles, activeFile]);

  const activeProject = React.useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);

  // Static placeholder
  const placeholderText = "Ask ReversX";

  // Optimized Sidebar Resizing with CSS Variables
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(260);
  const [isResizingExplorer, setIsResizingExplorer] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // ReversX v1 Agent States
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [showAgentQuestions, setShowAgentQuestions] = useState(false);
  const [agentQuestions, setAgentQuestions] = useState<{question: string, options: string[]}[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentAgentPrompt, setCurrentAgentPrompt] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // If within 100px of the bottom, consider it scrolled to bottom
      shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (chatEndRef.current && (force || shouldAutoScroll.current)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const isSyncingRef = useRef(true);

  useEffect(() => {
    if (activeProjectId && !isSyncingRef.current && !isLoading) {
      setProjects(prev => {
        const projectIndex = prev.findIndex(p => p.id === activeProjectId);
        if (projectIndex === -1) return prev;
        
        const project = prev[projectIndex];
        // Only update if something actually changed to avoid infinite loops
        if (
          project.messages === messages && 
          project.files === files && 
          project.openFiles === openFiles && 
          project.activeFile === activeFile
        ) {
          return prev;
        }

        const updatedProjects = [...prev];
        updatedProjects[projectIndex] = {
          ...project,
          messages,
          files,
          openFiles,
          activeFile
        };
        return updatedProjects;
      });
    }
  }, [messages, files, openFiles, activeFile, activeProjectId, isLoading]);

  useEffect(() => {
    // Reset syncing flag after states have likely updated
    if (isSyncingRef.current) {
      isSyncingRef.current = false;
    }
  }, [messages, files, activeFile, activeProjectId]);

  useEffect(() => {
    db.setItem('reversx_editor_font_size', editorFontSize);
  }, [editorFontSize]);

  useEffect(() => {
    db.setItem('reversx_editor_font_family', editorFontFamily);
  }, [editorFontFamily]);

  useEffect(() => {
    db.setItem('reversx_open_files', openFiles);
  }, [openFiles]);

  useEffect(() => {
    db.setItem('reversx_split_screen', isSplitScreen);
  }, [isSplitScreen]);

  const handleSplit = useCallback(() => {
    if (editorPanes.length < 4) {
      const currentFile = editorPanes[focusedPaneIndex] || 'index.html';
      setEditorPanes(prev => [...prev, currentFile]);
      setFocusedPaneIndex(editorPanes.length);
    }
  }, [editorPanes, focusedPaneIndex]);

  const handleClosePane = useCallback((index: number) => {
    if (editorPanes.length > 1) {
      setEditorPanes(prev => {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      });
      setFocusedPaneIndex(prev => Math.max(0, prev >= index ? prev - 1 : prev));
    }
  }, [editorPanes]);

  const setPaneFile = useCallback((index: number, fileName: string) => {
    setEditorPanes(prev => {
      const next = [...prev];
      next[index] = fileName;
      return next;
    });
    setFocusedPaneIndex(index);
    setActiveFile(fileName);
  }, []);

  const handleFileOpen = useCallback((name: string) => {
    setOpenFiles(prev => {
      if (prev.includes(name)) return prev;
      const newTabs = [...prev, name];
      if (newTabs.length > 10) { // Increased tab limit slightly if needed
        return newTabs.slice(-10);
      }
      return newTabs;
    });
    setPaneFile(focusedPaneIndex, name);
  }, [focusedPaneIndex, setPaneFile]);

  const handleFileClose = useCallback((name: string) => {
    setOpenFiles(prev => {
      if (prev.length <= 1 && prev[0] === name) return prev;
      const next = prev.filter(f => f !== name);
      
      // Update panes if closing a file that is active in some pane
      setEditorPanes(pPanes => pPanes.map(p => p === name ? (next[next.length - 1] || 'index.html') : p));
      
      if (activeFile === name) {
        setActiveFile(next[next.length - 1] || 'index.html');
      }
      return next;
    });
  }, [activeFile]);
  useEffect(() => {
    if (projects.length > 0) {
      const timeoutId = setTimeout(() => {
        db.setItem('reversx_projects', projects);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [projects]);

  useEffect(() => {
    const loadData = async () => {
      // ... existing loads ...
      const savedFontSize = await db.getItem('reversx_editor_font_size');
      if (savedFontSize) setEditorFontSize(Number(savedFontSize));

      const savedFontFamily = await db.getItem('reversx_editor_font_family');
      if (savedFontFamily) setEditorFontFamily(savedFontFamily);

      const savedOpenFiles = await db.getItem('reversx_open_files');
      if (savedOpenFiles) setOpenFiles(savedOpenFiles);

      const savedSplit = await db.getItem('reversx_split_screen');
      if (savedSplit !== null) setIsSplitScreen(!!savedSplit);
      const savedName = await db.getItem('reversx_user');
      if (savedName) {
        setUserName(savedName);
        setShowNamePrompt(false);
        // Update initial files with the correct name if no projects exist yet
        // Left empty intentionally to show Welcome Screen
        // setFiles(...)
        // setPreviewFiles(...)
      }

      const savedEditorTheme = await db.getItem('reversx_editor_theme');
      // theme is fixed to VS Code Dark
      const savedAppTheme = await db.getItem('reversx_app_theme');
      if (savedAppTheme) setAppThemeName(savedAppTheme);

      const savedIconTheme = await db.getItem('reversx_icon_theme');
      if (savedIconTheme) setIconThemeName(savedIconTheme);

      const savedTab = await db.getItem('reversx_active_tab');
      if (savedTab) {
        setActiveTab(savedTab as any);
      }

      const savedMobileView = await db.getItem('reversx_mobile_view');
      if (savedMobileView) {
        setMobileView(savedMobileView as any);
      }

      const savedProjects = await db.getItem('reversx_projects');
      if (savedProjects && savedProjects.length > 0) {
        isSyncingRef.current = true;
        setProjects(savedProjects);
        const last = savedProjects[0];
        setActiveProjectId(last.id);
        
        // Force update greeting if it's an unmodified New Project
        let projectFiles = last.files;
        let lastActiveFile = last.activeFile;
        let lastOpenFiles = last.openFiles || [];
        
        if (last.name === 'New Project' || last.name === 'My First Project') {
          const indexHtml = projectFiles['index.html']?.code || '';
          if (indexHtml.includes('ReversX AI') || indexHtml.includes('glitch') || indexHtml.includes('New Project Started')) {
            projectFiles = {}; // Clear it so the import screen shows up!
            lastActiveFile = '';
            lastOpenFiles = [];
          }
        }

        // Filter out old welcome messages to show new branding
        const filteredMessages = last.messages.filter((m: any) => m.content !== "What do you want to build?");
        setMessages(filteredMessages);
        setFiles(projectFiles);
        setPreviewFiles(projectFiles);
        if (lastOpenFiles && lastOpenFiles.length > 0 && Object.keys(projectFiles).length > 0) {
          setOpenFiles(lastOpenFiles.filter((f: string) => projectFiles[f]).slice(0, 4));
        } else {
          setOpenFiles(Object.keys(projectFiles).slice(0, 4));
        }
        
        if (lastActiveFile && projectFiles[lastActiveFile]) {
          setActiveFile(lastActiveFile);
          setEditorPanes([lastActiveFile]);
        } else if (Object.keys(projectFiles).length > 0) {
          const newActive = Object.keys(projectFiles)[0];
          setActiveFile(newActive);
          setEditorPanes([newActive]);
        } else {
          setActiveFile('');
          setEditorPanes([]);
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    db.setItem('reversx_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    db.setItem('reversx_mobile_view', mobileView);
  }, [mobileView]);

  useEffect(() => {
    if (userName) {
      db.setItem('reversx_user', userName);
    }
  }, [userName]);

  useEffect(() => {
    db.setItem('reversx_editor_theme', editorThemeName);
  }, [editorThemeName]);

  useEffect(() => {
    db.setItem('reversx_app_theme', appThemeName);
    
    // Apply app theme variables
    const theme = APP_THEMES[appThemeName] || APP_THEMES['Default Dark'];
    const root = document.documentElement;
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-foreground', theme.foreground);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-foreground', theme.accentForeground || '#ffffff');
    root.style.setProperty('--color-sidebar', theme.sidebar);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-foreground-muted', theme.muted);
    root.style.setProperty('--color-foreground-subtle', theme.subtle);
  }, [appThemeName]);

  useEffect(() => {
    db.setItem('reversx_icon_theme', iconThemeName);
  }, [iconThemeName]);


  const resize = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizing) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newWidth = clientX - 56;
      const minWidth = 200;
      const maxWidth = window.innerWidth * 0.8;
      
      if (newWidth > minWidth && newWidth < maxWidth) {
        setSidebarWidth(newWidth);
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
      }
    }
  }, [isResizing]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Check if it's a touch event and prevent default only if needed
    if (e.type === 'touchstart') {
      // Don't prevent default to allow scrolling if user is not on handle
    } else {
      e.preventDefault();
    }
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const resizeExplorer = useCallback((e: MouseEvent | TouchEvent) => {
    if (isResizingExplorer) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      // clientX - total offset from left (activity bar + sidebar)
      const offset = 56 + (isSidebarMinimized ? 0 : sidebarWidth);
      const newWidth = clientX - offset;
      const minWidth = 150;
      const maxWidth = 500;
      
      if (newWidth > minWidth && newWidth < maxWidth) {
        setExplorerWidth(newWidth);
      }
    }
  }, [isResizingExplorer, isSidebarMinimized, sidebarWidth]);

  const resizeEditorSplit = useCallback((e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const container = document.getElementById('main-editor-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = (relativeX / rect.width) * 100;
      setEditorSplitRatio(Math.max(10, Math.min(90, ratio)));
    }
  }, []);

  const stopResizingEditorSplit = useCallback(() => {
    setIsResizingEditorSplit(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizingEditorSplit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    setIsResizingEditorSplit(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const stopResizingExplorer = useCallback(() => {
    setIsResizingExplorer(false);
    document.body.style.cursor = 'default';
  }, []);

  const startResizingExplorer = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    setIsResizingExplorer(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isResizing) resize(e);
      if (isResizingExplorer) resizeExplorer(e);
      if (isResizingEditorSplit) resizeEditorSplit(e);
    };

    const handleWindowEnd = () => {
      if (isResizing) stopResizing();
      if (isResizingExplorer) stopResizingExplorer();
      if (isResizingEditorSplit) stopResizingEditorSplit();
    };

    if (isResizing || isResizingExplorer || isResizingEditorSplit) {
      window.addEventListener('mousemove', handleWindowMove);
      window.addEventListener('mouseup', handleWindowEnd);
      window.addEventListener('touchmove', handleWindowMove, { passive: false });
      window.addEventListener('touchend', handleWindowEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowEnd);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('touchend', handleWindowEnd);
    };
  }, [isResizing, isResizingExplorer, isResizingEditorSplit, resize, resizeExplorer, resizeEditorSplit, stopResizing, stopResizingExplorer, stopResizingEditorSplit]);

  const handleNameSubmit = useCallback(() => {
    if (!tempName.trim()) return;
    const name = tempName.trim();
    setUserName(name);
    setShowNamePrompt(false);
    
    if (projects.length === 0) {
      isSyncingRef.current = true;
      const initialCode = getInitialCode(name);
      const newProject: Project = {
        id: generateId(),
        name: 'My First Project',
        messages: [],
        files: {},
        activeFile: '',
        openFiles: [],
        createdAt: Date.now()
      };
      
      setProjects([newProject]);
      setActiveProjectId(newProject.id);
      setMessages([]);
      setFiles({});
      setPreviewFiles({});
      setOpenFiles([]);
      setActiveFile('');
      setEditorPanes([]);
    }
  }, [tempName, projects.length]);

  const createNewProject = useCallback(() => {
    isSyncingRef.current = true;
    const initialCode = getInitialCode(userName || 'User');
    const newProject: Project = {
      id: generateId(),
      name: `Project ${projects.length + 1}`,
      messages: [],
      files: {},
      activeFile: '',
      openFiles: [],
      createdAt: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setMessages([]);
    setFiles({});
    setPreviewFiles({});
    setOpenFiles([]);
    setActiveFile('');
    setEditorPanes([]);
    setActiveTab('projects');
  }, [userName, projects.length]);

  const switchProject = useCallback((id: string) => {
    if (id === activeProjectId) {
      // Don't reset tab if already active
      return;
    }

    const targetProject = projects.find(p => p.id === id);
    if (targetProject) {
      isSyncingRef.current = true;
      setActiveProjectId(id);
      // Filter out old welcome messages to show new branding
      const filteredMessages = targetProject.messages.filter(m => m.content !== "What do you want to build?");
      setMessages(filteredMessages);
      setFiles(targetProject.files);
      setPreviewFiles(targetProject.files);
      if (targetProject.openFiles && targetProject.openFiles.length > 0) {
        setOpenFiles(targetProject.openFiles);
      } else {
        setOpenFiles(Object.keys(targetProject.files));
      }
      setActiveFile(targetProject.activeFile);
      if (targetProject.activeFile) {
        setEditorPanes([targetProject.activeFile]);
      } else if (Object.keys(targetProject.files).length > 0) {
        setEditorPanes([Object.keys(targetProject.files)[0]]);
      }
      setActiveTab('projects');
      setMobileView('chat');
    }
  }, [activeProjectId, projects]);

  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const deleteProject = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (projects.length <= 1) return;
    
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    
    if (activeProjectId === id) {
      isSyncingRef.current = true;
      const next = newProjects[0];
      setActiveProjectId(next.id);
      setMessages(next.messages);
      setFiles(next.files);
      setPreviewFiles(next.files);
      setOpenFiles([next.activeFile]);
      setActiveFile(next.activeFile);
      setEditorPanes([next.activeFile]);
      setActiveTab('projects');
      setMobileView('chat');
    }
    setProjectToDeleteId(null);
    setDeleteConfirmName('');
  }, [projects, activeProjectId]);

  const startRenaming = useCallback((e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditNameValue(project.name);
  }, []);

  const saveRename = useCallback((e: React.FormEvent | React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editNameValue.trim()) return;
    
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: editNameValue.trim() } : p));
    setEditingProjectId(null);
  }, [editNameValue]);

  const handleHoldStart = useCallback((id: string) => {
    holdTimer.current = setTimeout(() => {
      setActiveActionsId(id);
    }, 600); // 600ms hold time
  }, []);

  const handleHoldEnd = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    stopRef.current = true;
    setIsLoading(false);
  }, []);

  const processMessage = async (userMessage: string, attachments: Attachment[] = []) => {
    setIsLoading(true);
    stopRef.current = false;
    shouldAutoScroll.current = true;
    appliedBlocks.current.clear();
    setTimeout(() => scrollToBottom(true), 100);

    try {
      const maxFileContextChars = 15000;
      let totalChars = 0;
      const currentFilesContext = Object.entries(files)
        .map(([name, file]) => {
          if (totalChars > maxFileContextChars) return null;
          const content = file.code.length > 3000 ? file.code.substring(0, 3000) + "\n... [file truncated]" : file.code;
          const chunk = `File: ${name}\n\`\`\`${file.language}\n${content}\n\`\`\``;
          totalChars += chunk.length;
          return chunk;
        })
        .filter(Boolean)
        .join('\n\n');

      const attachmentContext = attachments
        .map(att => {
          const isImage = att.type.startsWith('image/');
          if (isImage) {
            return `[Attached Image: ${att.name}]`;
          } else {
            const contentPreview = att.content.length < 5000 ? att.content : att.content.substring(0, 5000) + '... [truncated]';
            return `[Attached File: ${att.name}]\nContent:\n${contentPreview}`;
          }
        })
        .join('\n\n');

      const agentSystemPrompt = isAgentActive 
        ? `You are the ReversX v1 Agent, an advanced AI integrated into the ReversX v1 IDE. You are extremely serious, professional, and precise. 
           Your goal is to build high-quality, production-ready web applications and assist the user in navigating this IDE.

           ### COMPREHENSIVE IDE GUIDE:
           1. **Activity Bar (Leftmost)**:
              - *Projects*: Create, rename, delete, and switch between different coding projects.
              - *Chat*: Your primary communication channel with me.
              - *Friends*: Connect with other developers.
              - *Settings*: Customize the App Theme (Dark/Light/etc.), Icon Themes, and Syntax Highlighting.
           2. **Sidebar (Left)**: Shows the content of the tab selected in the Activity Bar. It can be minimized using the chevron button or resized by dragging the vertical handle.
           3. **Code Editor (Center)**:
              - *Tabbed Interface*: Open multiple files simultaneously.
              - *File Explorer Button*: Click the "FILE EXPLORER" text button at the top left of the editor to toggle the file tree.
              - *File Tree*: Right-click or use the '...' menu on files to Rename or Delete. Use the '+' icon at the top of the explorer to create new files.
           4. **Preview Area (Right/Toggle)**: Displays the live output of your code.
           5. **Top Navigation Bar**:
              - *Code/Preview*: Toggle between the editor and the live preview.
              - *Full*: Opens the current project in a new browser tab for a full-screen experience.
              - *Refresh*: Forces the preview to reload.
              - *Settings/Terminal*: Quick shortcuts to the settings panel or a terminal-style view.
           6. **File Attachments**:
              - Users can upload files or images using the '+' button in the chat input.
              - Clicking an attached file opens a modal where the user can edit the content, save changes, or specifically "Send to AI" for focused analysis.
           7. **Responsive Design**: On mobile, the IDE uses a single-view layout. Users can switch between Chat, Editor, and Preview using the navigation.

           Focus on clean code, modern design, and robust functionality. No duplicates. If user speaks in Bengali, respond in natural, elegant Bengali.`
        : '';

      const currentFilesSummary = Object.keys(files).join(', ');
      const prompt = `${agentSystemPrompt}
      
      ### PROJECT STATUS
      Existing Files: [ ${currentFilesSummary} ]
      
      ### MANDATORY PROTOCOL
      - For existing files: \`PATCH: filename.ext\` with SEARCH/REPLACE blocks.
      - For new files: \`### path/to/file.ext\`.
      - To delete: \`[DELETE: file.ext]\`.
      - To rename: \`[RENAME: old.ext -> new.ext]\`.
      
      Current project files context:
      ${currentFilesContext}
      
      ${attachmentContext ? `Attachments:\n${attachmentContext}\n\n` : ''}User request: ${userMessage}`;

      const history = messages
        .filter(m => !m.content.startsWith('Welcome_msg:'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
      
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: '' }]);
      
      const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
      const stream = await chatWithAIStream(prompt, history, currentApiKey, currentModel, currentPlatform, attachments, extra);
      let fullResponse = '';
      
      const langMap: Record<string, string> = {
        'js': 'javascript', 'javascript': 'javascript', 'ts': 'typescript', 'typescript': 'typescript',
        'py': 'python', 'python': 'python', 'py3': 'python', 'html': 'html', 'css': 'css',
        'cpp': 'cpp', 'c++': 'cpp', 'c': 'c', 'java': 'java', 'php': 'php', 'sql': 'sql',
        'sh': 'bash', 'bash': 'bash', 'json': 'json', 'md': 'markdown', 'markdown': 'markdown',
        'rust': 'rust', 'rs': 'rust', 'go': 'go', 'golang': 'go'
      };

      const fileMap: Record<string, string> = {
        'html': 'index.html', 'javascript': 'script.js', 'typescript': 'index.ts',
        'python': 'main.py', 'css': 'style.css', 'cpp': 'main.cpp', 'c': 'main.c',
        'java': 'Main.java', 'php': 'index.php', 'sql': 'query.sql', 'bash': 'script.sh',
        'json': 'data.json', 'markdown': 'README.md', 'rust': 'main.rs', 'go': 'main.go'
      };

      let lastUpdateTime = Date.now();
      const updateInterval = 80; // Ultra-fast streaming for that "gRPC" feel

      const applyPatch = (originalCode: string, patchInstructions: string) => {
        const normalizeLineEndings = (s: string) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        let patchedCode = normalizeLineEndings(originalCode);
        const patchInstructionsNorm = normalizeLineEndings(patchInstructions);
        
        const patchRegex = /<<<<(?:[ \t]*SEARCH)?[ \t]*\n([\s\S]*?)\n[=]{4,}[ \t]*\n([\s\S]*?)>>>>/g;
        let match;
        let appliedAny = false;

        while ((match = patchRegex.exec(patchInstructionsNorm)) !== null) {
          const searchStr = match[1];
          const replaceStr = match[2];
          
          const findMatch = (content: string, search: string) => {
            const index = content.indexOf(search);
            if (index !== -1) return { index, length: search.length };
            
            const norm = (s: string) => s.trim().replace(/[ \t]+/g, ' ');
            const contentLines = content.split('\n');
            const searchLines = search.split('\n');
            
            if (searchLines.length === 0) return null;

            for (let i = 0; i <= contentLines.length - searchLines.length; i++) {
              let allLinesMatch = true;
              for (let j = 0; j < searchLines.length; j++) {
                if (norm(contentLines[i + j]) !== norm(searchLines[j])) {
                  allLinesMatch = false;
                  break;
                }
              }
              if (allLinesMatch) {
                const startIdx = contentLines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
                const endIdx = contentLines.slice(0, i + searchLines.length).join('\n').length;
                return { index: startIdx, length: endIdx - startIdx };
              }
            }
            return null;
          };

          const matchInfo = findMatch(patchedCode, searchStr);
          if (matchInfo) {
            patchedCode = patchedCode.substring(0, matchInfo.index) + replaceStr + patchedCode.substring(matchInfo.index + matchInfo.length);
            appliedAny = true;
          }
        }
        return appliedAny ? patchedCode : originalCode;
      };

      const extractAndApplyFiles = (text: string, isFinal: boolean = false) => {
        const updates: { name: string, code: string, language: string, isPatch: boolean, index: number }[] = [];
        const segments = text.split(/```/);
        
        for (let i = 1; i < segments.length; i += 2) {
          const block = segments[i];
          const prevText = segments[i-1] || '';
          const isClosed = segments[i+1] !== undefined;
          
          if (appliedBlocks.current.has(i)) continue;

          const firstLine = block.split('\n')[0] || '';
          const langMatch = firstLine.match(/^([\w+]+)(?::([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+))?/);
          const detectedLang = langMatch ? langMatch[1].toLowerCase() : 'text';
          const inlineName = langMatch ? langMatch[2] : null;
          const code = block.replace(/^.*?\n/, '');
          const finalLang = langMap[detectedLang] || detectedLang;
          
          const nameRegex = /(?:^|\n|\r|[:.!?])\s*(?:###|PATCH:|FILE:?|FILENAME:?|PATH:?|TARGET:?|UPDATE(?: FOR)?|MODIFIED?:?|CODE FOR|CURRENT FILE:?|CREATE:?|NEW FILE:?|WRITE:?|ADD:?|UPDATING:?)\s*(?:\[|'|")?([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+)(?:\]|'|")?/i;
          const nameMatch = prevText.match(nameRegex);
          const isPatch = prevText.toLowerCase().includes('patch:') || code.includes('<<<< SEARCH');
          
          let name = inlineName || (nameMatch ? nameMatch[1].trim() : null);
          if (!name) {
            const fallbackMatch = prevText.slice(-150).match(/(?:^|\s)([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9]+)(?:\s|$|[:.!?])/);
            if (fallbackMatch) name = fallbackMatch[1].trim();
          }

          if (name) {
            name = name.replace(/^\.?\/+/, ''); 
            if (isPatch) {
              if (isClosed || isFinal) {
                updates.push({ name, code, language: finalLang, isPatch: true, index: i });
                appliedBlocks.current.add(i);
              }
            } else {
              // Smooth streaming for new files or full rewrites
              if (isFinal || block.endsWith('\n') || code.length > 200) {
                 updates.push({ name, code, language: finalLang, isPatch: false, index: i });
                 if (isClosed) appliedBlocks.current.add(i);
              }
            }
          }
        }

        if (updates.length > 0) {
          setFiles(prev => {
            const next = { ...prev };
            let hasChanged = false;
            let targetFile = "";

            for (const update of updates) {
              const { name, code, language, isPatch } = update;
              targetFile = name;
              if (isPatch) {
                if (next[name]) {
                  const newCode = applyPatch(next[name].code, code);
                  if (newCode !== next[name].code) {
                    next[name] = { ...next[name], code: newCode };
                    hasChanged = true;
                  }
                }
              } else {
                if (!next[name] || next[name].code !== code) {
                  next[name] = { code, language };
                  hasChanged = true;
                }
              }
            }

            if (hasChanged) {
              setPreviewFiles({ ...next });
              if (targetFile) setActiveFile(targetFile);
            }
            return next;
          });

          // Ensure files are in the open tabs
          setOpenFiles(prev => {
             const names = updates.map(u => u.name);
             const newNames = names.filter(n => !prev.includes(n));
             return newNames.length > 0 ? [...prev, ...newNames] : prev;
          });
        }
      };

      for await (const chunk of stream) {
        if (stopRef.current) break;
        const content = typeof chunk === 'string' ? chunk : (chunk as any).content || '';
        fullResponse += content;

        // Enhanced Masking Logic: Cursor/Windsurf Style (Clean Chat, Direct Code Editor)
        let cleanContent = fullResponse;
        
        // 1. Force remove all code blocks (even incomplete ones) from chat text
        cleanContent = cleanContent.replace(/```[\s\S]*?(?:```|$)/g, (match) => {
           if (match.endsWith('```')) return '\n\n*(Code and logic applied to the editor)*\n\n';
           return '\n\n*(AI is actively coding in the editor...)*\n\n';
        });
        
        // 2. Aggressively strip file-path markers and structural instructions
        const masks = [
          /\[DELETE:.*?\]/gi,
          /\[RENAME:.*?\]/gi,
          /(?:^|\n)(?:###|PATCH:|FILE:|FILENAME:|PATH:|TARGET:|CREATE:|UPDATE:)\s*[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+[^\n]*/gi,
          /PATCH:\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi,
          /###\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi
        ];

        masks.forEach(m => {
          cleanContent = cleanContent.replace(m, '');
        });

        // 3. Final cleanup to prevent flickering or empty messages
        const finalOutput = cleanContent.trim();

        setMessages(prev => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.content = finalOutput || "I'm updating your project structure and code directly in the editor...";
          }
          return next;
        });

        const now = Date.now();
        if (now - lastUpdateTime > updateInterval) {
          extractAndApplyFiles(fullResponse, false);
          lastUpdateTime = now;
          scrollToBottom(true);
        }
      }

      // Final processing
      extractAndApplyFiles(fullResponse, true);
      
      const deletionMatches = Array.from(fullResponse.matchAll(/\[DELETE:\s*([a-zA-Z0-9_.\-/]+)\]/gi));
      if (deletionMatches.length > 0) {
        setFiles(prev => {
          const next = { ...prev };
          deletionMatches.forEach(m => delete next[m[1].trim().replace(/^\.?\/+/, '')]);
          setPreviewFiles(next);
          return next;
        });
      }

      const renameMatches = Array.from(fullResponse.matchAll(/\[RENAME:\s*([a-zA-Z0-9_.\-/]+)\s*->\s*([a-zA-Z0-9_.\-/]+)\]/gi));
      if (renameMatches.length > 0) {
        setFiles(prev => {
          const next = { ...prev };
          renameMatches.forEach(m => {
            const oldN = m[1].trim().replace(/^\.?\/+/, '');
            const newN = m[2].trim().replace(/^\.?\/+/, '');
            if (next[oldN]) {
              next[newN] = next[oldN];
              delete next[oldN];
            }
          });
          setPreviewFiles(next);
          return next;
        });
      }

      let chatFinal = fullResponse;
      // Aggressively remove all code blocks
      chatFinal = chatFinal.replace(/```[\s\S]*?(?:```|$)/g, '');
      
      const cleaningMasks = [
        /\[DELETE:.*?\]/gi,
        /\[RENAME:.*?\]/gi,
        /(?:^|\n)(?:###|PATCH:|FILE:|FILENAME:|PATH:|TARGET:|CREATE:|UPDATE:)\s*[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+[^\n]*/gi,
        /PATCH:\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi,
        /###\s+[a-zA-Z0-9_.\-/]+\.[a-zA-Z0-9]+/gi
      ];

      cleaningMasks.forEach(m => {
        chatFinal = chatFinal.replace(m, '');
      });

      const finalText = chatFinal.trim();
      
      setMessages(prev => {
        const next = [...prev];
        const lastMsg = next[next.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
          lastMsg.content = finalText || "Architecture updated. The code changes have been applied to the editor.";
        }
        return next;
      });

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        const errorMessage = error.message || "Something went wrong.";
        if (last && last.role === 'model' && last.content === '') {
          return [...prev.slice(0, -1), { id: crypto.randomUUID(), role: 'model', content: `Error: ${errorMessage}` }];
        }
        return [...prev, { id: crypto.randomUUID(), role: 'model', content: `Error: ${errorMessage}` }];
      });
    } finally {
      setIsLoading(false);
      // Play a subtle sound when done
      if (!stopRef.current) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3').play().catch(() => {});
      }
    }
  };

  const handleOpenInNewTab = useCallback(() => {
    const blob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }, [combinedHtml]);

  const handleTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setTerminalHistory(prev => [...prev, { type: 'cmd', text: trimmed }]);
    setTerminalInput('');

    const args = trimmed.split(' ');
    const baseCmd = args[0].toLowerCase();

    if (baseCmd === 'help') {
      setTerminalHistory(prev => [...prev, { type: 'output', text: 'Available commands: help, clear, ls, npm install <pkg>, npm uninstall <pkg>' }]);
    } else if (baseCmd === 'clear') {
      setTerminalHistory([]);
    } else if (baseCmd === 'ls') {
      const fileList = Object.keys(files).join('  ');
      setTerminalHistory(prev => [...prev, { type: 'output', text: fileList || 'No files found.' }]);
    } else if (baseCmd === 'npm' && args[1] === 'install') {
      const pkg = args[2];
      if (!pkg) {
        setTerminalHistory(prev => [...prev, { type: 'error', text: 'Error: Please specify a package name. Example: npm install lodash' }]);
        return;
      }

      setTerminalHistory(prev => [...prev, { type: 'output', text: `Installing ${pkg}...` }]);
      
      setTimeout(() => {
        let pkgJson = files['package.json'] ? JSON.parse(files['package.json'].code) : { dependencies: {} };
        if (!pkgJson.dependencies) pkgJson.dependencies = {};
        pkgJson.dependencies[pkg] = "latest";

        setFiles(prev => ({
          ...prev,
          'package.json': {
            code: JSON.stringify(pkgJson, null, 2),
            language: 'json'
          }
        }));

        setTerminalHistory(prev => [...prev, { type: 'output', text: `+ ${pkg}@latest installed successfully.` }]);
      }, 800);
    } else if (baseCmd === 'npm' && args[1] === 'uninstall') {
        const pkg = args[2];
        if (!pkg) {
          setTerminalHistory(prev => [...prev, { type: 'error', text: 'Error: Please specify a package name.' }]);
          return;
        }
        let pkgJson = files['package.json'] ? JSON.parse(files['package.json'].code) : null;
        if (pkgJson && pkgJson.dependencies && pkgJson.dependencies[pkg]) {
          delete pkgJson.dependencies[pkg];
          setFiles(prev => ({
            ...prev,
            'package.json': {
              code: JSON.stringify(pkgJson, null, 2),
              language: 'json'
            }
          }));
          setTerminalHistory(prev => [...prev, { type: 'output', text: `uninstalled ${pkg}.` }]);
        } else {
          setTerminalHistory(prev => [...prev, { type: 'error', text: `Package ${pkg} not found in dependencies.` }]);
        }
    } else {
      setTerminalHistory(prev => [...prev, { type: 'error', text: `Command not found: ${baseCmd}` }]);
    }
  }, [files]);

  const handleOpenBrandingPage = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReversX v1</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0d0d0d;
            --side: #181818;
            --text: #cccccc;
            --blue: #4fc1ff;
            --orange: #ce9178;
            --green: #6a9955;
            --border: #2b2b2b;
            --highlight: #1e1e1e;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Roboto', sans-serif;
            display: flex;
            height: 100vh;
            font-size: 14px;
        }

        /* --- SIDEBAR ICONS --- */
        .sidebar {
            width: 50px;
            background: var(--side);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
            gap: 25px;
        }

        .icon { width: 22px; height: 22px; position: relative; opacity: 0.6; }
        .icon-files { border: 2px solid #858585; border-radius: 2px; }
        .icon-files::after { content: ''; position: absolute; top: 4px; left: 4px; width: 10px; height: 2px; background: #858585; box-shadow: 0 4px 0 #858585, 0 8px 0 #858585; }

        /* --- MAIN AREA --- */
        .main {
            flex: 1;
            padding: 35px;
            overflow-y: auto;
        }

        .comment { color: var(--green); margin-bottom: 8px; }
        h1 { color: #fff; font-size: 26px; font-weight: 500; margin-bottom: 25px; }

        /* --- HIGH VISIBILITY TABLE --- */
        .data-table {
            width: 100%;
            max-width: 450px;
            margin: 25px 0;
            border-collapse: collapse;
            background: var(--highlight);
            border: 1px solid var(--border);
            border-left: 4px solid var(--blue); /* Highlight side */
            border-radius: 4px;
        }

        .data-table tr {
            border-bottom: 1px solid var(--border);
        }

        .data-table tr:last-child {
            border-bottom: none;
        }

        .data-table td {
            padding: 14px 20px;
            font-size: 13px;
        }

        .key { 
            color: var(--blue); 
            font-weight: 500;
            width: 40%;
            border-right: 1px solid var(--border);
        }

        .val { 
            color: var(--orange); 
        }

        .text { margin-bottom: 10px; }

        /* --- FOOTER --- */
        .status-bar {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: #007acc;
            color: white;
            font-size: 11px;
            padding: 4px 15px;
            display: flex;
            justify-content: space-between;
        }

        @media (max-width: 500px) {
            .main { padding: 25px; }
            .sidebar { display: none; }
        }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="icon icon-files"></div>
    </div>

    <div class="main">
        <div class="comment">// About ReversX v1</div>
        <h1>ReversX v1</h1>
        
        <p class="text">A free helper to build websites easily.</p>
        <p class="text">Made for people who code on their phone.</p>

        <table class="data-table">
            <tr>
                <td class="key">Works on</td>
                <td class="val">Android Phones</td>
            </tr>
            <tr>
                <td class="key">Price</td>
                <td class="val">Free</td>
            </tr>
            <tr>
                <td class="key">Users</td>
                <td class="val">20,000</td>
            </tr>
            <tr>
                <td class="key">Saved work</td>
                <td class="val">Lifetime</td>
            </tr>
        </table>

        <div class="comment">/* How to use */</div>
        <p class="text">1. Add your key.</p>
        <p class="text">2. Tell the AI your idea.</p>
        <p class="text">3. Get your code back.</p>
    </div>

    <div class="status-bar">
        <div>main*</div>
        <div>ReversX System Active</div>
    </div>

</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }, []);

  const generateAgentQuestions = async (userPrompt: string) => {
    setIsLoading(true);
    setCurrentAgentPrompt(userPrompt);
    
    const prompt = `The user wants to build: "${userPrompt}". 
    As a professional ReversX v1 Agent, generate exactly 3 specific multiple-choice questions to better understand the technical requirements, design preferences, and functionality of this project. 
    Keep the questions concise and professional.
    Format your response as a JSON array of objects, each with "question" and "options" (array of strings).
    Example: [{"question": "What is the primary color theme?", "options": ["Dark", "Light", "Vibrant"]}]`;

     try {
       const { platform: currentPlatform, apiKey: currentApiKey, model: currentModel, extra } = getPlatformConfig();
       const response = await chatWithAI(prompt, [], currentApiKey, currentModel, currentPlatform, [], extra);
       const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        setAgentQuestions(questions);
        setSelectedAnswers({});
        setShowAgentQuestions(true);
      } else {
        processMessage(userPrompt);
      }
    } catch (error) {
      console.error("Agent Question Generation Error:", error);
      processMessage(userPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSubmit = () => {
    if (Object.keys(selectedAnswers).length < agentQuestions.length) return;
    
    const answersText = agentQuestions.map((q, i) => `Q: ${q.question}\nA: ${selectedAnswers[i]}`).join('\n');
    const finalPrompt = `User Project Request: ${currentAgentPrompt}\n\nTechnical Requirements & Preferences:\n${answersText}`;
    
    setShowAgentQuestions(false);
    processMessage(finalPrompt);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const content = await new Promise<string>((resolve) => {
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });

      newAttachments.push({
        name: file.name,
        type: file.type,
        content: content
      });
    }

    setPendingAttachments(prev => [...prev, ...newAttachments]);
    if (e.target) e.target.value = '';
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
    if (previewPendingIdx === index) setPreviewPendingIdx(null);
    else if (previewPendingIdx !== null && previewPendingIdx > index) setPreviewPendingIdx(previewPendingIdx - 1);
  }, [previewPendingIdx]);

  const handleSaveAttachment = useCallback((updated: Attachment) => {
    if (editingAttachment?.isPending && editingAttachment.index !== undefined) {
      const newAttachments = [...pendingAttachments];
      newAttachments[editingAttachment.index] = updated;
      setPendingAttachments(newAttachments);
    }
    setEditingAttachment(null);
  }, [editingAttachment, pendingAttachments]);

  const handleSendEditedAttachment = useCallback(async (updated: Attachment) => {
    setEditingAttachment(null);
    const userMessage = `I've edited the file "${updated.name}". Here is the updated content:`;
    processMessage(userMessage, [updated]);
  }, [processMessage]);

  const handleSend = useCallback(async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isLoading) return;

    const userMessage = input;
    const attachments = [...pendingAttachments];
    setInput('');
    setPendingAttachments([]);
    setPreviewPendingIdx(null);
    
    // Reset textarea height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
    }
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      attachments: attachments.length > 0 ? attachments : undefined
    }]);
    
    if (isAgentActive) {
      generateAgentQuestions(userMessage);
      return;
    }

    // Handle project naming if it's the first real message
    const isFirstMessage = messages.filter(m => !m.content.startsWith('Welcome_msg:')).length === 0;

    if (isFirstMessage && activeProjectId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project && (
        project.name === 'New Project' || 
        project.name === 'My First Project' || 
        project.name.startsWith('Project ')
      )) {
        setPendingUserMessage(userMessage);
        setPendingUserAttachments(attachments);
        setShowProjectNaming(true);
        return;
      }
    }

    await processMessage(userMessage, attachments);
  }, [input, pendingAttachments, isLoading, isAgentActive, messages, activeProjectId, projects, processMessage]);

  const handleProjectNamingSubmit = useCallback(() => {
    if (!pendingProjectName.trim()) return;
    
    const cleanName = pendingProjectName.trim();
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, name: cleanName } : p));
    setShowProjectNaming(false);
    setPendingProjectName('');
    
    if (pendingUserMessage || pendingUserAttachments.length > 0) {
      processMessage(pendingUserMessage, pendingUserAttachments);
      setPendingUserMessage('');
      setPendingUserAttachments([]);
    }
  }, [pendingUserAttachments, processMessage]);
  
  
  
  const handleImportFiles = useCallback(async (fileList: FileList | File[]) => {
    if (fileList.length === 0) return;
    setIsLoading(true);
    
    try {
      const newFiles: Record<string, { code: string, language: string }> = {};
      let firstFile: string | null = null;
      let folderName: string | null = null;
      
      const fileArray = Array.from(fileList);
      
      // Process in small batches so UI doesn't completely freeze
      const BATCH_SIZE = 50;
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (file) => {
          let path = file.webkitRelativePath || file.name;
          if (!folderName && file.webkitRelativePath) {
            folderName = file.webkitRelativePath.split('/')[0];
          }
          if (path.startsWith('/')) path = path.slice(1);
          
          // Skip node_modules, .git to prevent freezing
          if (path.includes('node_modules/') || path.includes('.git/') || path.includes('dist/') || path.includes('.next/')) {
            return;
          }

          try {
            if (file.type.startsWith('image/') || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file.name)) {
              if (file.size > 5 * 1024 * 1024) return; // Skip incredibly large images (>5MB)
              const reader = new FileReader();
              const p = new Promise<string>((resolve, reject) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
              const base64 = await p;
              newFiles[path] = { code: base64, language: 'image' };
            } else {
              if (file.size > 5 * 1024 * 1024) return; // Skip huge sources (>5MB)
              const text = await file.text();
              newFiles[path] = { code: text, language: getLanguageFromPath(path) };
            }
            if (!firstFile) firstFile = path; // It's fine if it's slightly random due to parallel
          } catch (e) {
            console.error("Failed to read file", file.name, e);
          }
        }));
      }

      // If parallel reads finished, let's grab the first file again deterministically if possible
      const keys = Object.keys(newFiles);
      if (keys.length > 0) {
          if (!firstFile || !newFiles[firstFile]) {
             firstFile = keys.find(k => k.includes('index.html')) || keys.find(k => k.includes('main.')) || keys[0];
          }

          setFiles(prev => {
            const nextFiles = { ...prev, ...newFiles };
            if (!activeProjectId) {
               const newProject: Project = {
                 id: generateId(),
                 name: folderName || `Imported Project`,
                 messages: [],
                 files: nextFiles,
                 activeFile: firstFile || 'index.html',
                 openFiles: [firstFile || 'index.html'],
                 createdAt: Date.now()
               };
               requestAnimationFrame(() => {
                  setProjects(p => [newProject, ...p]);
                  setActiveProjectId(newProject.id);
               });
            }
            return nextFiles;
          });
          setPreviewFiles(prev => ({ ...prev, ...newFiles }));
          
          setOpenFiles(prev => {
              const toAdd = keys.filter(f => !prev.includes(f));
              return Array.from(new Set([...prev, ...toAdd])).slice(0, 50); // limit open tabs
          });
          
          if (firstFile) {
              setActiveFile(firstFile);
              setEditorPanes([firstFile]);
          }
      } else {
         console.warn("No valid files were imported.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setFiles, setPreviewFiles, setOpenFiles, setEditorPanes, setActiveFile, activeProjectId]);

  const handleCreateFilesDirectly = useCallback((newFiles: string[]) => {
    setFiles(prev => {
      const updated = { ...prev };
      let lastCreated: string | null = null;
      newFiles.forEach(name => {
        if (!updated[name]) {
          updated[name] = { 
            code: name.endsWith('.html') ? '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>New File</title>\n</head>\n<body>\n    \n</body>\n</html>' : (name.endsWith('.css') ? '/* New Stylesheet */\n' : '// New file\n'), 
            language: getLanguageFromPath(name)
          };
          lastCreated = name;
        }
      });
      if (lastCreated) {
        setOpenFiles(prevOpen => {
          if (!prevOpen.includes(lastCreated!)) return [...prevOpen, lastCreated!];
          return prevOpen;
        });
        setActiveFile(lastCreated);
      }
      return updated;
    });
  }, [setOpenFiles, setActiveFile]);

  const handleCreateFile = useCallback(() => {
    setNewFileName('');
    setShowNewFileModal(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleCreateFolder = useCallback(() => {
    setNewFolderName('');
    setShowNewFolderModal(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleGithubImport = useCallback(() => {
    setIsGithubImportOpen(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleGithubExport = useCallback(() => {
    setIsGithubExportOpen(true);
    setIsExplorerCreateMenuOpen(false);
  }, []);

  const handleDownloadProject = useCallback(async () => {
    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');
    const zip = new JSZip();

    Object.entries(files).forEach(([path, file]) => {
      zip.file(path, file.code);
    });

    if (Capacitor.isNativePlatform()) {
      try {
        const base64Content = await zip.generateAsync({ type: 'base64' });
        const result = await Filesystem.writeFile({
          path: 'project.zip',
          data: base64Content,
          directory: Directory.Cache
        });
        
        await Share.share({
          title: 'Share Project',
          text: 'Save or share your project zip file',
          url: result.uri,
          dialogTitle: 'Save Project'
        });
      } catch (err) {
        console.error('Error saving project with Capacitor:', err);
        alert(`Could not save project zip: ${err}`);
      }
      return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'project.zip');
  }, [files]);

  const confirmGithubExport = async () => {
    if (!githubExportRepo || !githubToken) {
      alert('Repository path and Personal Access Token are required.');
      return;
    }
    
    setIsGitHubExporting(true);
    try {
      const repoPath = githubExportRepo.trim().replace('https://github.com/', '').replace('http://github.com/', '');
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error('Invalid Repository path. Use owner/repo');

      const headers = {
        'Authorization': `token ${githubToken.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      };

      // 1. Get the latest commit SHA of the branch
      const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${githubBranch}`, { headers });
      
      let baseTreeSha: string | undefined;
      let parentCommitSha: string | undefined;

      if (refRes.ok) {
        const refData = await refRes.json();
        parentCommitSha = refData.object.sha;
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${parentCommitSha}`, { headers });
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree.sha;
      } else if (refRes.status === 404) {
        // Branch might not exist, or repo is empty. For a real app, we'd handle initial commit differently.
        throw new Error('Branch not found. Please ensure the repository exists and has at least one commit.');
      } else {
        throw new Error('Failed to connect to GitHub. Check your token and repository permissions.');
      }

      // 2. Create Blobs and Tree
      const treeItems = Object.entries(files).map(([path, file]) => ({
        path,
        mode: '100644',
        type: 'blob',
        content: file.code
      }));

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems
        })
      });
      const treeData = await treeRes.json();
      if (!treeRes.ok) throw new Error(treeData.message || 'Failed to create tree');

      // 3. Create Commit
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: githubCommitMessage || 'Update from Editor',
          tree: treeData.sha,
          parents: [parentCommitSha]
        })
      });
      const commitData = await commitRes.json();
      if (!commitRes.ok) throw new Error(commitData.message || 'Failed to create commit');

      // 4. Update Reference
      const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${githubBranch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sha: commitData.sha,
          force: false
        })
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.message || 'Failed to update branch reference');
      }

      alert('Successfully pushed to GitHub!');
      setIsGithubExportOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(`Push error: ${err.message}`);
    } finally {
      setIsGitHubExporting(false);
    }
  };

  const confirmGithubImport = async () => {
    if (!githubRepoUrl) return;
    setIsGitHubImporting(true);
    try {
      let repoPath = githubRepoUrl.trim().replace('https://github.com/', '').replace('http://github.com/', '');
      if (repoPath.endsWith('.git')) repoPath = repoPath.slice(0, -4);
      
      const parts = repoPath.split('/');
      if (parts.length < 2) throw new Error('Invalid GitHub URL structure. Use owner/repo');
      const owner = parts[0];
      const repo = parts[1];

      const fetchRepo = async (path: string = ''): Promise<Record<string, { code: string, language: string }>> => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${githubBranch}`);
        if (!response.ok) {
           if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
           throw new Error(`Failed to fetch ${path || 'repository'}`);
        }
        const data = await response.json();
        
        let newFiles: Record<string, { code: string, language: string }> = {};
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          if (item.type === 'file') {
            const fileRes = await fetch(item.download_url);
            const content = await fileRes.text();
            const ext = item.name.split('.').pop() || 'plaintext';
            const langMap: Record<string, string> = {
              'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
              'html': 'html', 'css': 'css', 'py': 'python', 'json': 'json', 'md': 'markdown'
            };
            newFiles[item.path] = { code: content, language: langMap[ext] || 'plaintext' };
          } else if (item.type === 'dir') {
            const dirFiles = await fetchRepo(item.path);
            newFiles = { ...newFiles, ...dirFiles };
          }
        }
        return newFiles;
      };

      const importedFiles = await fetchRepo();
      if (Object.keys(importedFiles).length > 0) {
        setFiles(prev => ({ ...prev, ...importedFiles }));
        setPreviewFiles(importedFiles);
        const firstFile = Object.keys(importedFiles)[0];
        setActiveFile(firstFile);
        setOpenFiles(prev => Array.from(new Set([...prev, firstFile])));
        setEditorPanes([firstFile]);
      }
      setIsGithubImportOpen(false);
      setGithubRepoUrl('');
    } catch (err: any) {
      console.error(err);
      alert(`Import error: ${err.message}`);
    } finally {
      setIsGitHubImporting(false);
    }
  };

  const confirmCreateFolder = useCallback(() => {
    const name = newFolderName.trim();
    if (!name) return;
    
    // We create a hidden file to represent the folder in the flat file system
    const folderPath = name.endsWith('/') ? name.substring(0, name.length - 1) : name;
    const dummyFile = `${folderPath}/.keep`;
    
    if (files[dummyFile]) {
      alert('Folder already exists!');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [dummyFile]: { code: '', language: 'plaintext' }
    }));
    setShowNewFolderModal(false);
  }, [newFolderName, files]);

  const confirmCreateFile = useCallback(() => {
    const name = newFileName.trim();
    if (!name) return;
    if (files[name]) {
      alert('File already exists!');
      return;
    }
    
    const language = getLanguageFromPath(name);

    setFiles(prev => ({
      ...prev,
      [name]: { code: '', language }
    }));
    setOpenFiles(prev => {
      const newTabs = prev.includes(name) ? prev : [...prev, name];
      if (newTabs.length > 4) return newTabs.slice(-4);
      return newTabs;
    });
    setActiveFile(name);
    setShowNewFileModal(false);
    setNewFileName('');
  }, [newFileName, files]);

  const handleRenameFile = useCallback((oldName: string) => {
    setRenameOldName(oldName);
    setRenameNewName(oldName);
    setShowRenameModal(true);
  }, []);

  const confirmRenameFile = useCallback(() => {
    const oldName = renameOldName;
    const newName = renameNewName.trim();
    if (!newName || newName === oldName) {
      setShowRenameModal(false);
      return;
    }
    if (files[newName]) {
      alert('File already exists!');
      return;
    }

    setFiles(prev => {
      const newFiles = { ...prev };
      const oldData = newFiles[oldName];
      const newLanguage = getLanguageFromPath(newName);
      newFiles[newName] = { ...oldData, language: newLanguage };
      delete newFiles[oldName];
      return newFiles;
    });
    if (activeFile === oldName) setActiveFile(newName);
    setShowRenameModal(false);
  }, [renameOldName, renameNewName, files, activeFile]);

  const handleDeleteFile = useCallback((name: string) => {
    if (Object.keys(files).length <= 1) {
      alert('Cannot delete the last file.');
      return;
    }
    setFileToDelete(name);
    setShowDeleteModal(true);
  }, [files]);

  const confirmDeleteFile = useCallback(() => {
    const name = fileToDelete;
    if (!name) {
      setShowDeleteModal(false);
      return;
    }

    setFiles(prev => {
      const updated = { ...prev };
      delete updated[name];
      setPreviewFiles(updated);
      return updated;
    });

    setOpenFiles(prev => prev.filter(f => f !== name));

    if (activeFile === name) {
      const remaining = Object.keys(files).filter(f => f !== name);
      setActiveFile(remaining[0] || '');
    }
    setShowDeleteModal(false);
    setFileToDelete('');
  }, [fileToDelete, files, activeFile]);

  const handleDownloadFile = useCallback((filename: string) => {
    const content = files[filename]?.code || '';
    handleDownloadFallback(filename, content);
  }, [files]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setFiles(prev => {
          const next = {
            ...prev,
            [activeFile]: {
              ...prev[activeFile],
              code: value
            }
          };
          setPreviewFiles(next);
          return next;
        });
      }, 500); // 500ms debounce
    }
  }, [activeFile]);

  const handleOpenLocalFile = async () => {
    // Check if we are in an iframe
    const isIframe = window.self !== window.top;

    if (!('showOpenFilePicker' in window) || isIframe) {
      handleOpenFileSystem();
      return;
    }

    try {
      const [handle] = await (window as any).showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'Code Files',
            accept: {
              'text/*': ['.js', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.txt', '.py', '.c', '.cpp', '.java', '.php', '.sql', '.sh', '.rs', '.go'],
            },
          },
        ],
      });

      const file = await handle.getFile();
      const contents = await file.text();
      const name = file.name;
      
      fileHandles.current[name] = handle;
      const language = getLanguageFromPath(name);

      setFiles(prev => ({
        ...prev,
        [name]: { code: contents, language }
      }));
      setActiveFile(name);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      
      console.warn('File System Access API blocked or failed, falling back to standard input:', err);
      handleOpenFileSystem();
    }
  };

  const handleDownloadFallback = async (filename: string, content: string) => {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.writeFile({
          path: filename,
          data: content,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });
        
        await Share.share({
          title: `Share ${filename}`,
          text: `Save or share your file: ${filename}`,
          url: result.uri,
          dialogTitle: 'Save File'
        });
      } catch (err) {
        console.error('Error saving with Capacitor:', err);
        alert(`Could not save file: ${err}`);
      }
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    alert(`Downloaded ${filename} to your device.`);
  };

  const handleSaveToLocal = useCallback(async () => {
    const handle = fileHandles.current[activeFile];
    const content = files[activeFile]?.code || '';
    const isIframe = window.self !== window.top;

    if (handle && !isIframe) {
      try {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        alert(`Saved ${activeFile} to device!`);
      } catch (err) {
        console.error('Error saving to local file:', err);
        handleDownloadFallback(activeFile, content);
      }
    } else {
      if (!('showSaveFilePicker' in window) || isIframe) {
        handleDownloadFallback(activeFile, content);
        return;
      }

      try {
        const newHandle = await (window as any).showSaveFilePicker({
          suggestedName: activeFile,
        });
        const writable = await newHandle.createWritable();
        await writable.write(content);
        await writable.close();
        fileHandles.current[activeFile] = newHandle;
        alert(`Saved ${activeFile} to device!`);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error saving new local file:', err);
          handleDownloadFallback(activeFile, content);
        }
      }
    }
  }, [activeFile, files]);

  const handleOpenFileSystem = useCallback(async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async (e: any) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;
        
        const newFiles = { ...files };
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const contents = await file.text();
          const name = file.name;
          const language = getLanguageFromPath(name);

          newFiles[name] = { code: contents, language };
        }
        setFiles(newFiles);
        setPreviewFiles(newFiles);
      };
      input.click();
    } catch (err) {
      console.error('Error opening files:', err);
    }
  }, [files]);

  const handleGlobalSearch = useCallback((query: string) => {
    if (!query) {
      setGlobalSearchResults([]);
      return;
    }

    const results: { filename: string, matches: { line: number, text: string, index: number }[] }[] = [];
    
    Object.entries(files).forEach(([filename, fileData]) => {
      const code = fileData.code;
      if (typeof code !== 'string') return;
      
      const fileMatches: { line: number, text: string, index: number }[] = [];
      const lines = code.split('\n');
      
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = query;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      
      lines.forEach((lineText, lineIdx) => {
        let match;
        const lineRegex = new RegExp(pattern, flags);
        while ((match = lineRegex.exec(lineText)) !== null) {
          fileMatches.push({
            line: lineIdx + 1,
            text: lineText.trim(),
            index: match.index
          });
          if (!flags.includes('g')) break;
        }
      });
      
      if (fileMatches.length > 0) {
        results.push({ filename, matches: fileMatches });
      }
    });
    
    setGlobalSearchResults(results);
  }, [files, globalSearchOptions]);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const newFiles = { ...files };
    
    const readFileEntry = (entry: any): Promise<File> => {
      return new Promise((resolve) => entry.file(resolve));
    };

    const readDirectoryEntry = (entry: any): Promise<any[]> => {
      const dirReader = entry.createReader();
      return new Promise((resolve, reject) => {
        const results: any[] = [];
        const readEntries = () => {
          dirReader.readEntries((entries: any[]) => {
            if (entries.length === 0) {
              resolve(results);
            } else {
              results.push(...entries);
              readEntries();
            }
          }, (err: any) => reject(err));
        };
        readEntries();
      });
    };

    const processEntry = async (entry: any, path: string = '') => {
      if (entry.isFile) {
        const file = await readFileEntry(entry);
        const relativePath = path + entry.name;
        
        // Skip common large or unnecessary files/folders
        if (relativePath.includes('node_modules') || relativePath.includes('.git')) return;

        let content: string;
        let language: string;
        
        if (file.type.startsWith('image/')) {
          content = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result as string);
            reader.readAsDataURL(file);
          });
          language = 'image';
        } else {
          content = await file.text();
          language = getLanguageFromPath(entry.name);
        }
        
        newFiles[relativePath] = { code: content, language };
      } else if (entry.isDirectory) {
        const entries = await readDirectoryEntry(entry);
        for (const childEntry of entries) {
          await processEntry(childEntry, path + entry.name + '/');
        }
      }
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        promises.push(processEntry(entry));
      }
    }
    
    await Promise.all(promises);
    setFiles(newFiles);
    setPreviewFiles(newFiles);
  }, [files]);

  const handleGlobalReplace = useCallback((filename: string, oldText: string, newText: string) => {
    setFiles(prev => {
      const fileData = prev[filename];
      if (!fileData) return prev;
      
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = oldText;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      const newCode = fileData.code.replace(regex, newText);
      
      return {
        ...prev,
        [filename]: { ...fileData, code: newCode }
      };
    });
    // Refresh search
    setTimeout(() => handleGlobalSearch(globalSearchQuery), 0);
  }, [globalSearchOptions, handleGlobalSearch, globalSearchQuery]);

  const handleGlobalReplaceAll = useCallback(() => {
    if (!globalSearchQuery) return;
    
    setFiles(prev => {
      const newFiles = { ...prev };
      let flags = 'g';
      if (!globalSearchOptions.caseSensitive) flags += 'i';
      
      let pattern = globalSearchQuery;
      if (!globalSearchOptions.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (globalSearchOptions.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(pattern, flags);
      
      Object.keys(newFiles).forEach(filename => {
        const fileData = newFiles[filename];
        if (typeof fileData.code === 'string') {
          newFiles[filename] = {
            ...fileData,
            code: fileData.code.replace(regex, globalReplaceQuery)
          };
        }
      });
      
      return newFiles;
    });
    setGlobalSearchResults([]);
  }, [globalSearchQuery, globalReplaceQuery, globalSearchOptions]);

  const handleUploadImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: any) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;
      
      const newFiles = { ...files };
      Array.from(selectedFiles).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFiles(prev => ({ ...prev, [file.name]: { code: base64, language: 'image' } }));
          setPreviewFiles(prev => ({ ...prev, [file.name]: { code: base64, language: 'image' } }));
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  }, [files]);

  const byokConfig = React.useMemo(() => {
    return getPlatformConfig();
  }, [getPlatformConfig]);

  const onEditAttachment = useCallback((att: Attachment) => {
    setEditingAttachment({ attachment: att, isPending: false });
  }, []);

  const onCodeChange = useCallback((newCode: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], code: newCode }
    }));
  }, [activeFile]);

  if (!isDbLoaded) {
    return (
    <div className="flex w-screen h-screen bg-background p-4 gap-4">
      <Skeleton className="w-[50px] h-full" />
      <Skeleton className="w-[260px] h-full" />
      <div className="flex-1 flex flex-col gap-4">
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-[22px]" />
      </div>
    </div>
    );
  }

  return (
    <IconContext.Provider value={iconThemeName}>
      <div style={{ fontFamily: FONT_OPTIONS[appFontName] }} className={`flex flex-col md:flex-row h-full w-full bg-background text-foreground overflow-hidden relative`}>
      
      <AnimatePresence mode="wait">
        {showAgentQuestions && (
          <motion.div 
            key="agent-questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-sidebar border border-accent/30 p-6 rounded-xl shadow-[0_0_30px_rgba(0,255,65,0.1)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Terminal size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-normal text-foreground tracking-tight">ReversX v1 Agent</h2>
                  <p className="text-foreground/70 text-xs">Clarifying technical requirements</p>
                </div>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {agentQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="text-sm font-normal text-foreground/80">{q.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                            selectedAnswers[qIdx] === opt
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'bg-black/20 border-white/5 text-white/70 hover:border-white/10 hover:text-white/85'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setShowAgentQuestions(false);
                    processMessage(currentAgentPrompt);
                  }}
                  className="flex-1 py-3 bg-foreground/5 text-foreground-subtle font-normal rounded-lg hover:bg-foreground/10 transition-all text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleAgentSubmit}
                  disabled={Object.keys(selectedAnswers).length < agentQuestions.length}
                  className="flex-[2] py-3 bg-accent text-accent-foreground font-normal rounded-lg hover:bg-accent/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  Submit & Build
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showNamePrompt && (
          <motion.div 
            key="name-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-sidebar border border-border p-8 rounded-xl shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Terminal size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-normal tracking-tight text-foreground">Welcome to ReversX</h1>
                  <p className="text-foreground/50 text-sm">Please enter your name to continue</p>
                </div>
                <div className="w-full space-y-4">
                  <input 
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="Your Name"
                    autoFocus
                    className="w-full bg-foreground/5 border border-border rounded-lg p-4 text-center text-lg focus:outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                  />
                  <button 
                    onClick={handleNameSubmit}
                    disabled={!tempName.trim()}
                    className="w-full py-4 bg-[#007ACC] hover:bg-[#006BB3] text-white font-medium rounded-[2px] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Start Building
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showProjectNaming && (
          <motion.div 
            key="project-naming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-sidebar border border-border p-8 rounded-xl shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Files size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-normal tracking-tight text-foreground">Name Your Project</h1>
                  <p className="text-foreground/50 text-sm">Give your project a name to save it</p>
                </div>
                <div className="w-full space-y-4">
                  <input 
                    type="text"
                    value={pendingProjectName}
                    onChange={(e) => setPendingProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleProjectNamingSubmit()}
                    placeholder="Project Name"
                    autoFocus
                    className="w-full bg-foreground/5 border border-border rounded-lg p-4 text-center text-lg focus:outline-none focus:border-accent transition-all text-foreground placeholder:text-foreground/10"
                  />
                  <button 
                    onClick={handleProjectNamingSubmit}
                    disabled={!pendingProjectName.trim()}
                    className="w-full py-4 bg-[#007ACC] hover:bg-[#006BB3] text-white font-medium rounded-[2px] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {editingAttachment && (
          <AttachmentEditorModal 
            key="attachment-editor"
            editingData={editingAttachment}
            onClose={() => setEditingAttachment(null)}
            onSave={handleSaveAttachment}
            onSend={handleSendEditedAttachment}
          />
        )}
      </AnimatePresence>

      {/* Activity Bar (Desktop only) */}
      <div className="hidden md:flex w-12 flex-col items-center py-2 border-r border-[#1e1e1e] bg-[#333333] shrink-0">
        <div className="flex flex-col w-full">
          <button 
            onClick={() => {
              if (activeTab === 'projects') {
                setIsExplorerOpen(!isExplorerOpen);
              } else {
                setActiveTab('projects');
                setIsExplorerOpen(true);
              }
            }}
            className={`w-full h-12 flex items-center justify-center transition-all relative ${activeTab === 'projects' && isExplorerOpen ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            title="Explorer"
          >
            {activeTab === 'projects' && isExplorerOpen && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_white]" />}
            <Files size={24} strokeWidth={1.5} />
          </button>

        </div>
        <div className="mt-auto flex flex-col w-full pb-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full h-12 flex items-center justify-center transition-all relative ${activeTab === 'settings' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            title="Settings"
          >
            {activeTab === 'settings' && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_white]" />}
            <Settings size={24} strokeWidth={1.5} />
          </button>

        </div>
      </div>


      {/* Sidebar Content */}
      <div 
        style={{ width: isSidebarMinimized ? '0px' : (window.innerWidth >= 768 ? `${sidebarWidth}px` : '100%') }}
        className={`
          ${mobileView === 'chat' ? 'flex flex-1' : 'hidden'} 
          md:flex border-r border-[#1e1e1e] bg-[#252526] flex-col overflow-hidden transition-[width] ${isResizing ? 'duration-0' : 'duration-300'} ease-in-out relative
        `}
      >
        <div className="h-9 px-4 flex items-center justify-between shrink-0 select-none">
          <span className="text-[11px] font-medium text-foreground-subtle tracking-tight capitalize">{activeTab}</span>
          <div className="flex items-center gap-1">
            {false && (
              <>
                <button 
                  onClick={() => setIsSidebarMinimized(true)}
                  className="hidden md:flex w-5 h-5 items-center justify-center text-foreground-subtle hover:text-white hover:bg-white/5 rounded-[2px] transition-all"
                  title="Minimize"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  onClick={createNewProject}
                  className="w-5 h-5 flex items-center justify-center text-foreground-subtle hover:text-white hover:bg-white/5 rounded-[2px] transition-all"
                  title="New Project"
                >
                  <Plus size={14} />
                </button>
              </>
            )}
          </div>
        </div>


        {false ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
            <ChatList 
              messages={messages}
              isLoading={isLoading}
              chatContainerRef={chatContainerRef}
              handleScroll={handleScroll}
              chatEndRef={chatEndRef}
              theme={currentEditorTheme}
              themeName={editorThemeName}
              userName={userName}
              onEditAttachment={onEditAttachment}
              getPlatformConfig={getPlatformConfig}
            />

            <div className="px-6 pt-4 pb-2 border-t border-white/5 bg-sidebar">
              <div className="relative group max-w-4xl mx-auto">
                {pendingAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingAttachments.map((att, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-[10px] text-blue-400">
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-300"
                            onClick={() => setEditingAttachment({ attachment: att, index: idx, isPending: true })}
                          >
                            <Files size={10} />
                            <span className="truncate max-w-[100px]">{att.name}</span>
                          </div>
                          <button onClick={() => removeAttachment(idx)} className="hover:text-red-400 ml-1">
                            <Trash2 size={10} />
                          </button>
                        </div>
                        {previewPendingIdx === idx && (
                          <div className="mt-1 p-1 bg-black/40 border border-white/10 rounded overflow-hidden max-w-[200px] relative">
                            {att.type.startsWith('image/') ? (
                              <img 
                                src={att.content} 
                                alt={att.name} 
                                className="w-full h-auto rounded block"
                                referrerPolicy="no-referrer"
                                style={{ maxHeight: '150px', objectFit: 'contain' }}
                              />
                            ) : (
                              <pre className="text-[8px] font-mono text-white/50 whitespace-pre-wrap break-all max-h-[100px] overflow-y-auto custom-scrollbar p-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                {att.content}
                              </pre>
                            )}
                            <button 
                              onClick={() => setPreviewPendingIdx(null)}
                              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white/70 hover:text-white"
                            >
                              <Plus size={10} className="rotate-45" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 flex items-center justify-center bg-[#3e3e42] hover:bg-[#4d4d52] text-white transition-all active:scale-90 shrink-0 rounded-[2px]"
                    title="Upload File"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    multiple
                  />
                  <div className="relative flex-1">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        // Enter to send disabled per user request
                      }}
                      placeholder={placeholderText}
                      className="w-full bg-foreground/[0.02] border-2 border-[#3b82f6] rounded-none py-4 px-6 pr-14 text-sm font-roboto focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all resize-none min-h-[60px] max-h-[500px] overflow-y-auto text-foreground/90 placeholder:text-foreground/20 placeholder:text-[12px] hide-scrollbar"
                      rows={1}
                    />
                    {isLoading ? (
                      <button 
                        onClick={handleStop}
                        className="absolute bottom-3 right-3 h-8 w-8 flex items-center justify-center bg-[#3e3e42] hover:bg-[#4d4d52] text-white rounded-[2px] cursor-pointer transition-all active:scale-90"
                        title="Stop"
                      >
                        <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSend}
                        disabled={isLoading || (!input.trim() && pendingAttachments.length === 0)}
                        className={`absolute bottom-3 right-3 h-8 w-8 flex items-center justify-center bg-[#007ACC] text-white rounded-[2px] cursor-pointer transition-all active:scale-90 ${
                          isLoading || (!input.trim() && pendingAttachments.length === 0) ? 'opacity-10 grayscale pointer-events-none' : 'hover:bg-[#006BB3]'
                        }`}
                      >
                        <ArrowUp size={18} strokeWidth={3} />
                      </button>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : activeTab === 'projects' ? (
          <div className="flex-1 flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.25em]">Project Manager</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-foreground/80">Workspace Apps</span>
                  <span className="bg-accent/15 text-accent text-[9px] px-2 py-0.5 rounded-full font-bold tabular-nums border border-accent/20">{projects.length}</span>
                </div>
              </div>
              <button 
                onClick={createNewProject}
                className="w-8 h-8 flex items-center justify-center hover:bg-accent hover:text-white text-foreground/40 hover:text-foreground rounded-[4px] transition-all bg-white/5 border border-white/5 shadow-sm"
                title="New Application"
              >
                <Codicon name="add" size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-3 grayscale">
                  <Codicon name="folder" size={48} />
                  <span className="text-[13px] font-medium tracking-tight">No applications found</span>
                </div>
              ) : projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => switchProject(project.id)}
                  className={`w-full bg-[#181818] border rounded-lg p-4 flex gap-4 transition-all group cursor-pointer relative ${
                    activeProjectId === project.id 
                      ? 'border-accent/40 shadow-[0_4px_16px_rgba(0,122,204,0.15)] ring-1 ring-accent/20' 
                      : 'border-[#2d2d2d] hover:bg-[#2a2d2e] hover:border-[#444]'
                  }`}
                >
                  <div className={`w-[50px] h-[50px] rounded-md flex items-center justify-center shrink-0 bg-[#252525] border border-[#2d2d2d] transition-transform duration-300 ${activeProjectId === project.id ? 'scale-105 border-accent/30' : 'group-hover:scale-105'}`}>
                    <svg width="34" height="34" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke={activeProjectId === project.id ? "var(--color-accent)" : "#555"} strokeWidth="4" />
                      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill={activeProjectId === project.id ? "var(--color-accent)" : "#ffffff"}>RX</text>
                    </svg>
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex flex-col gap-1">
                      {editingProjectId === project.id ? (
                        <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={e => setEditNameValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveRename(e as any, project.id)}
                            autoFocus
                            className="bg-[#252526] border border-accent/40 rounded px-2.5 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent/50 text-white"
                          />
                          <button onClick={e => saveRename(e, project.id)} className="bg-accent text-white p-1.5 rounded hover:brightness-110 shrink-0">
                            <Codicon name="check" size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className={`text-[15px] font-medium tracking-wide truncate ${activeProjectId === project.id ? 'text-white' : 'text-[#cccccc]'}`}>
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-3 font-mono text-[11px] text-[#858585] tracking-tight">
                            <span className="flex items-center gap-1.5 shrink-0">
                              {new Date(project.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="shrink-0">{new Date(project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                          </div>
                          {project.messages && project.messages.length > 0 && (
                            <div className="mt-2 text-[11px] text-[#858585] italic truncate max-w-full flex items-center gap-1.5 opacity-60">
                              <Codicon name="comment" size={10} />
                              {project.messages[0].content}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3 overflow-hidden">
                            <button 
                              onClick={(e) => { e.stopPropagation(); startRenaming(e, project); }}
                              className="px-3 py-1.5 bg-[#2d2d2d] border border-[#2d2d2d] text-[#cccccc] text-[11px] rounded hover:bg-[#444] hover:text-white transition-all flex items-center gap-1.5"
                            >
                              <Codicon name="edit" size={12} />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setProjectToDeleteId(project.id); setDeleteConfirmName(''); }}
                              className="px-3 py-1.5 bg-[#2d2d2d] border border-[#2d2d2d] text-[#cccccc] text-[11px] rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-1.5"
                            >
                              <Codicon name="trash" size={12} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {activeProjectId === project.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-accent rounded-l shadow-[0_0_12px_rgba(0,122,204,0.5)]" />
                  )}
                </div>
              ))}
            </div>

            {/* Custom Delete Modal */}
            {projectToDeleteId && (
              <div 
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[2px]"
                onClick={() => setProjectToDeleteId(null)}
              >
                <div 
                  className="bg-[#1e1e1e] border border-[#2d2d2d] w-[90%] max-w-[350px] p-6 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-200"
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-[16px] font-semibold text-white mb-3 tracking-wide">Delete Project</h2>
                  <p className="text-[13px] text-[#858585] mb-4 leading-relaxed">
                    To confirm, type <span className="font-bold text-white bg-[#333] px-2 py-0.5 rounded text-[12px]">{projects.find(p => p.id === projectToDeleteId)?.name}</span> in the box below.
                  </p>
                  
                  <input
                    type="text"
                    placeholder="Type name here..."
                    value={deleteConfirmName}
                    onChange={e => setDeleteConfirmName(e.target.value)}
                    className="w-full bg-[#252526] border border-[#2d2d2d] text-white px-3 py-2.5 rounded outline-none focus:border-accent transition-colors text-[13px] mb-6"
                    autoFocus
                  />
                  
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setProjectToDeleteId(null)}
                      className="px-4 py-2 text-[#858585] hover:text-white text-[12px] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={deleteConfirmName !== projects.find(p => p.id === projectToDeleteId)?.name}
                      onClick={(e) => deleteProject(e, projectToDeleteId)}
                      className={`px-5 py-2 rounded text-[12px] font-semibold transition-all ${
                        deleteConfirmName === projects.find(p => p.id === projectToDeleteId)?.name
                          ? 'bg-[#f85149] text-white hover:brightness-110 active:scale-95'
                          : 'bg-transparent border border-[#f85149]/30 text-[#f85149]/40 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex justify-center items-center">
              <span className="text-[11px] text-foreground/20 font-medium tracking-tight">Your created project will appear here.</span>
            </div>
          </div>
) : activeTab === 'settings' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-normal text-foreground-subtle">Settings</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
              <section>
                <h3 className="text-[11px] font-bold text-[#f0f0f0] tracking-normal mb-3 leading-[17px]">App theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(APP_THEMES).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => setAppThemeName(themeName)}
                      className={`flex flex-col gap-2 p-3 rounded-[2px] border transition-all ${appThemeName === themeName ? 'bg-accent border-accent text-accent-foreground' : 'bg-foreground/5 border-transparent text-foreground-muted hover:bg-foreground/10'}`}
                    >
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: APP_THEMES[themeName].background }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: APP_THEMES[themeName].accent }} />
                      </div>
                      <span className="text-[8px] font-normal truncate w-full text-right border-[#3a00c9] font-['Georgia'] underline italic">{themeName}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[12px] font-bold text-accent tracking-normal mb-3">Icon theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(ICON_THEMES).map((themeName) => {
                    const PreviewIcon = ICON_THEMES[themeName].Files;
                    return (
                      <button
                        key={themeName}
                        onClick={() => setIconThemeName(themeName)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-[2px] border transition-all ${iconThemeName === themeName ? 'bg-accent border-accent text-accent-foreground' : 'bg-foreground/5 border-transparent text-foreground-muted hover:bg-foreground/10'}`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/5">
                          <PreviewIcon size={16} />
                        </div>
                        <span className="text-[10px] font-normal truncate w-full text-center">{themeName}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-[12px] font-bold text-accent tracking-normal mb-3">Font theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(FONT_OPTIONS).map((fontName) => (
                    <button
                      key={fontName}
                      onClick={() => setAppFontName(fontName)}
                      className={`p-3 rounded-[2px] border transition-all ${appFontName === fontName ? 'bg-accent border-accent text-accent-foreground' : 'bg-foreground/5 border-transparent text-foreground-muted hover:bg-foreground/10'}`}
                    >
                      <span style={{ fontFamily: FONT_OPTIONS[fontName] }}>{fontName}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[12px] font-bold text-accent tracking-normal mb-3">Editor settings</h3>
                <div className="space-y-4 px-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs text-foreground-muted">
                      <label>Font Size</label>
                      <span>{editorFontSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="30" 
                      value={editorFontSize} 
                      onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                      className="w-full accent-accent bg-foreground/5 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-foreground-muted tracking-tight">Code font</label>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
                        { name: 'Fira Code', value: '"Fira Code", monospace' },
                        { name: 'Inter', value: '"Inter", sans-serif' },
                        { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
                        { name: 'Cascadia Code', value: '"Cascadia Code", monospace' },
                        { name: 'Courier New', value: '"Courier New", Courier, monospace' }
                      ].map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setEditorFontFamily(f.value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all text-[11px] ${editorFontFamily === f.value ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-foreground/5 text-foreground-subtle border border-transparent hover:bg-foreground/10'}`}
                        >
                          <span style={{ fontFamily: f.value }}>{f.name}</span>
                          {editorFontFamily === f.value && <Check size={10} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-foreground-muted tracking-tight">Split screen (Desktop)</label>
                    <button 
                      onClick={() => setIsSplitScreen(!isSplitScreen)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isSplitScreen ? 'bg-accent' : 'bg-foreground/10'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-accent-foreground transition-all ${isSplitScreen ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </section>


            </div>
          </div>
        ) : (
          <div className="p-8 text-[12px] md:text-sm text-accent/30 font-sans tracking-tight text-center mt-20 opacity-50">
            {String(activeTab).charAt(0).toUpperCase() + String(activeTab).slice(1)} is currently offline
          </div>
        )
      }</div>

      {/* Resizer Handle */}
      {!isSidebarMinimized && (
        <div 
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className={`hidden md:block w-6 -mx-3 bg-transparent cursor-col-resize transition-all z-[100] relative group ${isResizing ? 'bg-accent/5' : ''} touch-none`}
          title="Drag to resize sidebar"
        >
          {/* Vertical divider line */}
          <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#2b2b2b] group-hover:bg-accent/50 transition-colors ${isResizing ? 'bg-accent' : ''}`} />
          
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[10px] bg-accent/0 group-hover:bg-accent/5 transition-all blur-md" />
        </div>
      )}

      {/* Resize Overlays */}
      {(isResizing || isResizingExplorer) && (
        <div 
          className="fixed inset-0 z-[9999] cursor-col-resize bg-transparent"
        />
      )}

      {/* Main Content Area */}
      <div className={`
        ${mobileView !== 'chat' ? 'flex flex-1' : 'hidden'} 
        md:flex md:flex-1 flex-col bg-background overflow-hidden relative
      `}>
        {isSidebarMinimized && (
          <button
            onClick={() => setIsSidebarMinimized(false)}
            className="hidden md:flex absolute top-1/2 left-0 transform -translate-y-1/2 z-[60] w-6 h-12 bg-sidebar hover:bg-foreground/10 border border-border border-l-0 rounded-r-[2px] items-center justify-center text-foreground-muted transition-all shadow-xl"
            title="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
        {/* Main Editor/Preview Container */}
        <div className={`flex-1 relative overflow-hidden bg-background flex flex-col md:pt-0 pt-2`}>
          {(!showPreview && mobileView !== 'preview') ? (
            <div className="flex-1 flex font-sans overflow-hidden">
              {/* Activity Bar (Slim Left Bar) */}
              <div className="hidden md:flex w-12 flex-col items-center py-4 bg-[#181818] border-r border-[#2b2b2b] shrink-0 gap-4">
                <button 
                  onClick={() => setIsExplorerOpen(!isExplorerOpen)}
                  className={`p-2 transition-colors relative ${isExplorerOpen ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Files size={24} strokeWidth={1.5} />
                  {isExplorerOpen && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent" />}
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Search size={22} strokeWidth={1.5} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Blocks size={22} strokeWidth={1.5} />
                </button>
                <div className="mt-auto flex flex-col gap-4">
                   <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                      <Settings size={22} strokeWidth={1.5} />
                   </button>
                </div>
              </div>

              {/* VS Code Style File Explorer */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col bg-[#181818] border-r border-[#2b2b2b] transition-all duration-300 ease-in-out overflow-hidden
                  ${isExplorerOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}
                  ${isDragging ? 'ring-2 ring-accent ring-inset bg-accent/5' : ''}
                  fixed md:relative inset-y-0 left-0 z-[60] md:z-auto md:opacity-100 md:pointer-events-auto
                `}
              >
                {isDragging && (
                  <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-accent/10 backdrop-blur-[2px] pointer-events-none border-2 border-dashed border-accent/40 m-2 rounded-lg">
                    <PlusIcon className="text-accent mb-2" size={24} />
                    <span className="text-[10px] font-extrabold text-accent tracking-[0.2em] uppercase">Drop to Import</span>
                  </div>
                )}
                <div className="h-9 flex items-center justify-between px-4 bg-[#181818] shrink-0 select-none">
                  <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">Explorer</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handleOpenLocalFile}
                      className="p-1 hover:bg-white/5 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
                      title="Open Local File"
                    >
                      <FolderOpen size={14} />
                    </button>
                    <button 
                      onClick={handleUploadImage}
                      className="p-1 hover:bg-white/5 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
                      title="Upload Image"
                    >
                      <ImageIcon size={14} />
                    </button>
                    <button 
                      onClick={handleGithubImport}
                      className="p-1 hover:bg-white/5 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
                      title="Import from GitHub"
                    >
                      <Github size={14} />
                    </button>
                    <button 
                      onClick={handleGithubExport}
                      className="p-1 hover:bg-white/5 rounded-[2px] text-zinc-400 hover:text-white transition-colors"
                      title="Push to GitHub"
                    >
                      <Share2 size={14} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setIsExplorerCreateMenuOpen(!isExplorerCreateMenuOpen)}
                        className={`p-1 hover:bg-white/5 rounded-[2px] transition-colors ${isExplorerCreateMenuOpen ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                        title="New File/Folder"
                      >
                        <Plus size={14} />
                      </button>
                      
                      <AnimatePresence>
                        {isExplorerCreateMenuOpen && (
                          <div key="explorer-menu">
                            <div className="fixed inset-0 z-[70]" onClick={() => setIsExplorerCreateMenuOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-full mt-1 w-32 bg-[#252526] border border-[#454545] rounded-[4px] shadow-xl z-[80] overflow-hidden py-1"
                            >
                              <button 
                                onClick={handleCreateFile}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11px] text-[#cccccc] hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <FilePlus size={12} strokeWidth={2.5} />
                                <span>New File</span>
                              </button>
                              <button 
                                onClick={handleCreateFolder}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11px] text-[#cccccc] hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <FolderPlus size={12} strokeWidth={2.5} />
                                <span>New Folder</span>
                              </button>
                              <button 
                                onClick={() => { 
                                  setIsExplorerCreateMenuOpen(false); 
                                  handleDownloadProject(); 
                                }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[11px] text-[#cccccc] hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <Download size={12} strokeWidth={2.5} />
                                <span>Download Project</span>
                              </button>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar bg-[#181818]">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer group mb-1 transition-colors">
                    <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                      <ChevronDownIcon size={14} className="text-[#cccccc]" />
                      <span>WORKSPACE</span>
                    </div>
                  </div>

                  <div className="space-y-[1px]">
                    {(() => {
                      const root = buildFileTree(Object.keys(files));
                      return Object.values(root.children).sort((a: any, b: any) => {
                        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                        return a.name.localeCompare(b.name);
                      }).map((child: any) => (
                        <FileTreeItem 
                          key={child.path}
                          node={child}
                          activeFile={activeFile}
                          activeFileMenu={activeFileMenu}
                          handleFileOpen={(name) => {
                            handleFileOpen(name);
                            if (window.innerWidth < 768) setIsExplorerOpen(false);
                          }}
                          setActiveFileMenu={setActiveFileMenu}
                          handleRenameFile={handleRenameFile}
                          handleDeleteFile={handleDeleteFile}
                          handleDownloadFile={handleDownloadFile}
                          depth={0}
                        />
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Explorer Overlay Backdrop for Mobile */}
              {isExplorerOpen && (
                <div 
                  onClick={() => setIsExplorerOpen(false)}
                  className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in duration-300"
                />
              )}

              {/* Explorer Resizer Handle */}
              {isExplorerOpen && (
                <div 
                  onMouseDown={startResizingExplorer}
                  onTouchStart={startResizingExplorer}
                  className={`hidden md:block w-4 -mx-2 bg-transparent cursor-col-resize transition-all z-20 relative group ${isResizingExplorer ? 'bg-accent/5' : ''} touch-none`}
                  title="Drag to resize explorer"
                >
                  <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 group-hover:bg-accent/40 transition-colors ${isResizingExplorer ? 'bg-accent/60' : ''}`} />
                </div>
              )}

              {/* Main Editor Area */}
              <div id="main-editor-container" className="flex-1 flex overflow-hidden bg-[#1f1f1f] relative">
                {editorPanes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] p-8 absolute inset-0 z-20">
                    <div className="flex flex-col items-center gap-4 mb-12 select-none">
                      <div className="w-20 h-20 rounded-[20%] bg-gradient-to-br from-[#007acc] to-[#005a9e] shadow-[0_0_40px_rgba(0,122,204,0.3)] flex items-center justify-center border border-white/10">
                        <CodeIcon size={40} className="text-white drop-shadow-md" />
                      </div>
                      <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-extrabold text-[#cccccc] tracking-tight">ReversX</h1>
                        <p className="text-[#858585] text-lg font-medium tracking-wide">Editing evolved.</p>
                      </div>
                    </div>
                    <div className="w-full max-w-sm flex flex-col gap-3">
                      <input 
                        type="file" 
                        ref={folderInputRef} 
                        style={{ display: 'none' }} 
                        multiple 
                        {...({ webkitdirectory: "true", directory: "true" } as any)} 
                        onChange={(e) => {
                          const uploadedFiles = Array.from(e.target.files || []);
                          if (uploadedFiles.length > 0) {
                            handleImportFiles(uploadedFiles);
                          }
                          // Reset the input value so the same folder can be opened again if needed
                          e.target.value = '';
                        }} 
                      />
                      <button 
                        onClick={() => folderInputRef.current?.click()}
                        className="w-full px-6 py-4 bg-[#007acc] hover:bg-[#005a9e] shadow-[0_4px_14px_0_rgba(0,122,204,0.39)] text-white/90 hover:text-white rounded flex items-center gap-4 transition-all group border border-white/10"
                      >
                        <FolderOpen size={20} className="group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col items-start gap-0.5 text-left">
                          <span className="font-semibold text-sm">Import from Computer</span>
                          <span className="text-[11px] text-white/70">Upload a folder to start editing</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => handleGithubImport()}
                        className="w-full px-6 py-4 bg-[#2d2d2d] hover:bg-[#3d3d3d] shadow-lg text-[#cccccc] hover:text-white rounded flex items-center gap-4 transition-all group border border-[#444]"
                      >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col items-start gap-0.5 text-left">
                          <span className="font-semibold text-sm">Import from Github</span>
                          <span className="text-[11px] text-[#858585]">Import a public repository</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                <div className="flex-1 flex flex-row overflow-hidden border-r border-[#2b2b2b]">
                  {editorPanes.map((paneFile, idx) => (
                    <React.Fragment key={idx}>
                      <div 
                        className={`flex flex-col overflow-hidden relative z-10 transition-shadow ${focusedPaneIndex === idx ? 'ring-1 ring-accent/30 shadow-[0_0_20px_rgba(0,255,65,0.05)]' : ''}`}
                        style={{ width: `${paneWidths[idx]}%` }}
                        onClickCapture={() => setFocusedPaneIndex(idx)}
                      >
                        <MemoizedCodeEditor 
                          code={files[paneFile]?.code || ''} 
                          language={files[paneFile]?.language || 'text'} 
                          filename={paneFile}
                          allFiles={files}
                          activeFiles={openFiles}
                          onFileSelect={(name) => setPaneFile(idx, name)}
                          onCreateFilesDirectly={handleCreateFilesDirectly}
                          onCloseFile={(name) => {
                            if (editorPanes.length > 1) {
                              handleClosePane(idx);
                            } else {
                              handleFileClose(name);
                            }
                          }}
                          fontSize={editorFontSize}
                          fontFamily={editorFontFamily}
                          splitScreen={isSplitScreen && editorPanes.length === 1}
                          isSplitPane={editorPanes.length > 1}
                          onToggleSplit={handleSplit}
                          onClosePane={() => handleClosePane(idx)}
                          editorThemeName={editorThemeName}
                          onChange={handleCodeChange}
                          onSaveToLocal={handleSaveToLocal}
                          onPlay={() => { setPreviewFiles(files); setShowPreview(true); setMobileView('preview'); }}
                          onShowPreview={(show) => { setShowPreview(show); setMobileView(show ? 'preview' : 'editor'); }}
                          onShowSettings={() => { setMobileView('chat'); setActiveTab('settings'); }}
                          onBackToChat={() => setMobileView('chat')}
                          onMenuClick={() => setIsExplorerOpen(prev => !prev)}
                          onCreateFile={handleCreateFile}
                          onRenameFile={handleRenameFile}
                          onDeleteFile={handleDeleteFile}
                          getPlatformConfig={getPlatformConfig}
                          appThemeName={appThemeName}
                          onShowHelp={() => setShowHelpModal(true)}
                          onShowQuickOpen={() => setShowQuickOpen(true)}
                          onShowCommandPalette={() => setShowCommandPalette(true)}
                          onShowShortcuts={() => setShowShortcutsModal(true)}
                          onSetActiveTab={(tab: any) => setActiveTab(tab)}
                          onSetMobileView={(view: any) => setMobileView(view)}
                          activeFile={activeFile}
                          setShowSnippetEditor={setShowSnippetEditor}
                          onSetActiveEditor={(editor: any) => activeEditorRef.current = editor}
                          onSaveSelectedAsSnippet={handleSaveSelectedAsSnippet}
                          onCreateNewProject={createNewProject}
                        />
                      </div>
                      
                      {idx < editorPanes.length - 1 && (
                        <div 
                          onMouseDown={() => startResizingPane(idx)}
                          onTouchStart={() => startResizingPane(idx)}
                          className={`flex w-4 bg-transparent cursor-col-resize transition-all z-20 items-center justify-center group -mx-2 touch-none ${isResizingPane === idx ? 'bg-accent/5' : ''}`}
                          title="Drag to resize panes"
                        >
                          <div className={`h-full transition-all duration-150 ${isResizingPane === idx ? 'w-[2px] bg-[#007acc] shadow-[0_0_12px_rgba(0,122,204,0.6)]' : 'w-[1px] bg-[#1e1e1e] group-hover:bg-[#007acc]/40'}`} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                )}

                {isSplitScreen && editorPanes.length === 1 && (
                  <div className="hidden md:flex flex-[0.8] flex-col bg-background border-l border-border relative text-foreground">
                    <div className="h-11 bg-background border-b border-border flex items-center px-4 justify-between shrink-0">
                      <span className="text-[10px] tracking-widest text-foreground-subtle font-bold">Split Preview</span>
                      <button 
                        onClick={() => setIsSplitScreen(false)}
                        className="text-foreground-subtle hover:text-foreground transition-colors"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                    <iframe
                      title="Split Preview"
                      srcDoc={combinedHtml}
                      className="flex-1 w-full border-none bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`h-full w-full relative md:pt-0 pt-10 flex flex-col items-center transition-all duration-500 ${previewDevice !== 'desktop' ? 'bg-[#121212] p-8 overflow-auto' : 'bg-white'} custom-scrollbar`}>
              <div className={`relative transition-all duration-500 shadow-2xl overflow-hidden shrink-0 flex flex-col items-center ${previewDevice === 'desktop' ? '' : 'my-auto'}`} style={{
                width: previewDevice === 'mobile' ? '375px' : previewDevice === 'laptop' ? '1024px' : '100%',
                height: previewDevice === 'mobile' ? '667px' : previewDevice === 'laptop' ? '640px' : '100%',
                maxWidth: previewDevice === 'desktop' ? '100%' : '95%',
                maxHeight: previewDevice === 'desktop' ? '100%' : 'calc(100% - 20px)',
                borderRadius: previewDevice === 'mobile' ? '40px' : previewDevice === 'laptop' ? '12px' : '0px',
                border: previewDevice === 'mobile' ? '12px solid #222' : previewDevice === 'laptop' ? '8px solid #333' : 'none',
                backgroundColor: 'white'
              }}>
                {previewDevice === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-10 flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/10 rounded-full" />
                  </div>
                )}
                <iframe
                  title="ReversX Preview"
                  srcDoc={combinedHtml}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                />
              </div>

              {previewDevice === 'laptop' && (
                <div className="w-full max-w-[1040px] h-3 bg-[#444] rounded-b-2xl border-t border-white/10 shadow-xl shrink-0 -mt-2 z-10 hidden lg:block" />
              )}
              
              {/* Floating Action Controls in Preview */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-[60]">
                <div className="relative">
                  <button 
                    onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                    className="h-10 px-4 bg-black/60 hover:bg-black/80 text-white/90 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 transition-all shadow-lg group"
                  >
                    <MonitorSmartphone size={16} className="text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold tracking-widest hidden md:block">Device's</span>
                  </button>
                  
                  <AnimatePresence>
                    {showDeviceMenu && (
                      <div key="device-menu">
                        <div 
                          className="fixed inset-0 z-[65]" 
                          onClick={() => setShowDeviceMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full mt-2 right-0 bg-[#1a1a1b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-[70] min-w-[140px] backdrop-blur-xl"
                        >
                          {[
                            { id: 'mobile', label: 'Mobile', icon: Smartphone },
                            { id: 'laptop', label: 'Laptop', icon: Laptop },
                            { id: 'desktop', label: 'Desktop', icon: Monitor }
                          ].map((device) => (
                            <button
                              key={device.id}
                              onClick={() => {
                                setPreviewDevice(device.id as any);
                                setShowDeviceMenu(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all ${
                                previewDevice === device.id 
                                  ? 'text-accent bg-accent/10 font-bold' 
                                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <device.icon size={14} />
                              <span className="text-[11px] tracking-wide">{device.label}</span>
                              {previewDevice === device.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_accent]" />}
                            </button>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => { setShowPreview(false); setMobileView('editor'); }}
                  className="h-10 px-4 bg-black/60 hover:bg-black/80 text-white/90 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 transition-all shadow-lg"
                >
                  <ArrowLeftToLine size={16} />
                  <span className="text-[10px] font-bold tracking-widest hidden md:block">Back to Code</span>
                </button>
                <button 
                  onClick={() => setPreviewFiles({...files})}
                  className="w-10 h-10 bg-black/60 hover:bg-black/80 text-white/90 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center transition-all shadow-lg"
                  title="Refresh"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                  <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
                  <div className="text-accent font-normal tracking-[0.2em] text-xs animate-pulse">
                    Loading assets...
                  </div>
                  <div className="text-white/40 text-[12px] mt-2 font-roboto">
                    Waiting for HTML, CSS, and JS to complete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* StatusBar */}
      <div className="h-6 border-t border-[#2b2b2b] bg-[#181818] flex items-center px-3 justify-between text-[11px] font-medium text-[#cccccc] select-none shrink-0">
        <div className="flex items-center gap-4 h-full">
           <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#28a745]" />
              <span>Ready</span>
           </div>
           <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
              <GitBranch size={12} />
              <span>main*</span>
           </div>
        </div>
        <div className="flex items-center gap-3 h-full">
           <div className="flex items-center hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
             Spaces: 2
           </div>
           <div className="flex items-center hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
             UTF-8
           </div>
           <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer transition-colors">
             <Bell size={12} />
           </div>
        </div>
      </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden h-14 border-t border-border bg-sidebar flex items-center px-4 overflow-x-auto hide-scrollbar gap-5 z-50 ${mobileView === 'chat' ? 'border-t-0' : ''}`}>
        <button 
          onClick={() => setMobileView('editor')}
          className={`flex flex-col items-center justify-center w-10 h-10 shrink-0 bg-blue-500/5 border border-blue-500/10 rounded-full transition-all ${mobileView === 'editor' ? 'text-accent border-accent/40' : 'text-foreground/75'}`}
        >
          <Code size={14} strokeWidth={1.5} />
          <span className="text-[7px] font-bold tracking-tighter">Code</span>
        </button>
        <button 
          onClick={() => setMobileView('preview')}
          className={`flex flex-col items-center justify-center w-10 h-10 shrink-0 bg-blue-500/5 border border-blue-500/10 rounded-full transition-all ${mobileView === 'preview' ? 'text-accent border-accent/40' : 'text-foreground/75'}`}
        >
          <Play size={14} strokeWidth={1.5} />
          <span className="text-[7px] font-bold tracking-tighter">Prev</span>
        </button>
        <button 
          onClick={() => { setMobileView('chat'); setActiveTab('settings'); }}
          className={`flex flex-col items-center justify-center w-10 h-10 shrink-0 bg-blue-500/5 border border-blue-500/10 rounded-full transition-all ${mobileView === 'chat' && activeTab === 'settings' ? 'text-accent border-accent/40' : 'text-foreground/75'}`}
        >
          <Settings size={14} strokeWidth={1.5} />
          <span className="text-[7px] font-bold tracking-tighter">Set</span>
        </button>

      </div>

      {/* New File Modal */}
      <AnimatePresence>
        {showNewFileModal && (
          <div key="new-file-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <h3 className="text-lg font-normal text-white mb-4">New File</h3>
              <input
                autoFocus
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmCreateFile();
                  if (e.key === 'Escape') setShowNewFileModal(false);
                }}
                placeholder="filename.js"
                className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent mb-6"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewFileModal(false)}
                  className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmCreateFile}
                  className="px-6 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm font-medium rounded-[2px] transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GitHub Export Modal */}
      <AnimatePresence>
        {isGithubExportOpen && (
          <div key="github-export-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Github size={20} className="text-white" />
                <h3 className="text-lg font-normal text-white">Push to GitHub</h3>
              </div>
              
              {!githubToken ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Github size={32} className="text-zinc-400" />
                  </div>
                  <h4 className="text-white font-medium mb-2">Connect Your Account</h4>
                  <p className="text-[11px] text-zinc-400 mb-6 max-w-xs">Securely sign in to GitHub to push your projects directly to your repositories.</p>
                  <button 
                    onClick={handleGithubLogin}
                    className="w-full py-3 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-[4px] transition-all flex items-center justify-center gap-2"
                  >
                    <Github size={18} />
                    Continue with GitHub
                  </button>
                  <button 
                    onClick={() => setIsGithubExportOpen(false)}
                    className="mt-4 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[11px] text-zinc-400 mb-4">You are connected. Configure your push settings below.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Repository (owner/repo)</label>
                      <input
                        type="text"
                        value={githubExportRepo}
                        onChange={(e) => setGithubExportRepo(e.target.value)}
                        placeholder="e.g. username/project-repo"
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Branch</label>
                        <input
                          type="text"
                          value={githubBranch}
                          onChange={(e) => setGithubBranch(e.target.value)}
                          placeholder="main"
                          className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Commit Message</label>
                        <input
                          type="text"
                          value={githubCommitMessage}
                          onChange={(e) => setGithubCommitMessage(e.target.value)}
                          placeholder="Commit message"
                          className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => {
                        setGithubToken('');
                        idbSet('reversx_github_token', '');
                      }}
                      className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase font-bold tracking-widest"
                    >
                      Sign Out
                    </button>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsGithubExportOpen(false)}
                        className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={isGitHubExporting}
                        onClick={confirmGithubExport}
                        className={`px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-[2px] transition-colors flex items-center gap-2 ${isGitHubExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isGitHubExporting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Pushing...</span>
                          </>
                        ) : (
                          <span>Push Now</span>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GitHub Import Modal */}
      <AnimatePresence>
        {isGithubImportOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Github size={20} className="text-white" />
                <h3 className="text-lg font-normal text-white">Import from GitHub</h3>
              </div>
              <p className="text-[11px] text-zinc-400 mb-4">Import public repository files into your project. Use owner/repo format.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Repository URL or Path</label>
                  <input
                    autoFocus
                    type="text"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmGithubImport();
                      if (e.key === 'Escape') setIsGithubImportOpen(false);
                    }}
                    placeholder="e.g. facebook/react or full URL"
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1.5 ml-1">Branch / Ref</label>
                  <input
                    type="text"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsGithubImportOpen(false)}
                  className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                >
                  Cancel
                </button>
                <button 
                  disabled={isGitHubImporting}
                  onClick={confirmGithubImport}
                  className={`px-6 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm font-medium rounded-[2px] transition-colors flex items-center gap-2 ${isGitHubImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGitHubImporting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <span>Import</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <AnimatePresence>
        {showNewFolderModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <h3 className="text-lg font-normal text-white mb-4">New Folder</h3>
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmCreateFolder();
                  if (e.key === 'Escape') setShowNewFolderModal(false);
                }}
                placeholder="folder_name"
                className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent mb-6"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmCreateFolder}
                  className="px-6 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm font-medium rounded-[2px] transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete File Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 text-center">Delete File?</h3>
              <p className="text-sm text-foreground/50 mb-6 text-center">
                Are you sure you want to permanently delete <span className="text-white font-bold">"{fileToDelete}"</span>? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={confirmDeleteFile}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Delete Permanently
                </button>
                <button 
                  onClick={() => { setShowDeleteModal(false); setFileToDelete(''); }}
                  className="w-full py-2.5 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Help & Documentation Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div key="help-modal" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1e1e1e] border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1e1e1e] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-semibold text-white tracking-tight">About This AI IDE</h2>
                    <p className="text-[11px] text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Comprehensive User Guide</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-foreground/30 hover:text-white transition-all"
                >
                  <Codicon name="close" size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-xl mx-auto space-y-10">
                  
                  <section>
                    <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Introduction</h3>
                    <p className="text-[14px] text-foreground/70 leading-relaxed">
                      Welcome to your modern AI-powered development environment. This IDE is designed to turn your ideas into functional web applications through natural conversation and powerful coding tools.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-widest">Main Interface Tabs</h3>
                    
                    <div className="grid gap-6">
                      <div className="flex gap-4">
                        <div className="mt-1"><Codicon name="apps" size={18} className="text-foreground/40" /></div>
                        <div>
                          <h4 className="text-[15px] font-semibold text-white mb-1">Apps Tab</h4>
                          <p className="text-[13px] text-foreground/60 leading-normal">
                            This is your project dashboard. Here you can create new apps, rename existing ones, or switch between projects. 
                            <span className="block mt-2 text-red-400 font-medium">Security Tip: To delete a project, you must type its exact name to prevent accidental loss.</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="mt-1"><Codicon name="comment-discussion" size={18} className="text-foreground/40" /></div>
                        <div>
                          <h4 className="text-[15px] font-semibold text-white mb-1">Chat Console</h4>
                          <p className="text-[13px] text-foreground/60 leading-normal">
                            Communicate directly with the AI. You can ask it to "Create a login page", "Add a dark mode toggle", or "Fix the submit button logic". The AI will write the code and update your files in real-time.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="mt-1"><Codicon name="code" size={18} className="text-foreground/40" /></div>
                        <div>
                          <h4 className="text-[15px] font-semibold text-white mb-1">Code Editor</h4>
                          <p className="text-[13px] text-foreground/60 leading-normal">
                            A fully featured editor where you can manually tweak your files. It features syntax highlighting, auto-formatting, and intelligent AI tools.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-widest">Editor Tools & Buttons</h3>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
                      <div className="flex items-start gap-4">
                        <Sparkles size={16} className="text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[13px] font-bold text-white block">AI Assistants</span>
                          <span className="text-[12px] text-foreground/50">Found in the "More Actions" menu. Use Refactor to clean code or Document to add comments.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Edit size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[13px] font-bold text-white block">Format Code</span>
                          <span className="text-[12px] text-foreground/50">Instantly prettifies your code to keep it standardized and professional.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Palette size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[13px] font-bold text-white block">Themes</span>
                          <span className="text-[12px] text-foreground/50">Choose between 10+ professional syntax highlighting themes to match your visual preference.</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Final Tips</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3 text-[13px] text-foreground/60">
                        <span className="text-accent">•</span>
                        <span>The **Preview Window** updates automatically every time you or the AI saves a file.</span>
                      </li>
                      <li className="flex gap-3 text-[13px] text-foreground/60">
                        <span className="text-accent">•</span>
                        <span>Use the **Global Search** (Magnifying glass) to find variables or functions across your entire project.</span>
                      </li>
                    </ul>
                  </section>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-white/5 flex justify-center bg-white/[0.01]">
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="px-10 py-2.5 bg-accent hover:bg-accent/90 text-white text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-accent/20 active:scale-95"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename File Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <div key="rename-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-6 shadow-2xl"
            >
              <h3 className="text-lg font-normal text-white mb-4">Rename File</h3>
              <input
                autoFocus
                type="text"
                value={renameNewName}
                onChange={(e) => setRenameNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRenameFile();
                  if (e.key === 'Escape') setShowRenameModal(false);
                }}
                className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-accent mb-6"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 bg-[#3e3e42] hover:bg-[#4d4d52] text-white text-sm transition-colors rounded-[2px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRenameFile}
                  className="px-6 py-2 bg-[#007ACC] hover:bg-[#006BB3] text-white text-sm font-medium rounded-[2px] transition-colors"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showQuickOpen && (
          <QuickOpenModal 
            key="quick-open"
            files={Object.keys(files)} 
            onClose={() => setShowQuickOpen(false)} 
            onSelect={(name) => { setActiveFile(name); setShowQuickOpen(false); }} 
          />
        )}
        {showCommandPalette && (
          <CommandPaletteModal 
            key="command-palette"
            onClose={() => setShowCommandPalette(false)} 
            actions={[
              { label: 'Save File', shortcut: 'Ctrl+S', action: handleSaveToLocal },
              { label: 'New File', shortcut: 'Ctrl+N', action: handleCreateFile },
              { label: 'New Folder', shortcut: '', action: handleCreateFolder },
              { label: 'Settings', shortcut: 'Ctrl+,', action: () => { setMobileView('chat'); setActiveTab('settings'); } },
              { label: 'Search in all files', shortcut: 'Ctrl+Shift+F', action: () => { setActiveTab('search'); setIsExplorerOpen(true); } },
              { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+Shift+K', action: () => setShowShortcutsModal(true) },
              { label: 'Toggle Sidebar', action: () => setIsSidebarMinimized(prev => !prev) },
              { label: 'Toggle Explorer', action: () => setIsExplorerOpen(prev => !prev) },
              { label: 'Open Preview', action: () => { setPreviewFiles(files); setShowPreview(true); setMobileView('preview'); } },
              { label: 'Save Selection as Snippet', shortcut: 'Ctrl+Shift+S', action: handleSaveSelectedAsSnippet },
              { label: 'Close All Tabs', action: () => { setOpenFiles([]); setActiveFile(''); } },
            ]}
          />
        )}
        {showShortcutsModal && (
          <ShortcutsModal key="shortcuts" onClose={() => setShowShortcutsModal(false)} />
        )}
      </AnimatePresence>
      </div>
    </IconContext.Provider>
  );
}
