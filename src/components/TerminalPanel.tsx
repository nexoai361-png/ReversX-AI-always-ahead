import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface TerminalPanelProps {
  onCreateFiles: (files: string[]) => void;
  isMinimized?: boolean;
}

export function TerminalPanel({ onCreateFiles, isMinimized }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#050505',
        foreground: '#e0e0e0',
        cursor: '#FFD700'
      },
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: window.innerWidth < 768 ? 18 : 14,
      fontWeight: window.innerWidth < 768 ? '600' : 'normal',
      lineHeight: 1.4,
      convertEol: true,
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // Slight delay to ensure DOM is ready for fit
    setTimeout(() => {
      if (terminalRef.current && terminalRef.current.clientWidth > 0) {
        try { fitAddon.fit() } catch(e) {}
      }
    }, 100);

    const handleResize = () => {
      if (terminalRef.current && terminalRef.current.clientWidth > 0) {
        term.options.fontSize = window.innerWidth < 768 ? 18 : 14;
        term.options.fontWeight = window.innerWidth < 768 ? '600' : 'normal';
        try { fitAddon.fit() } catch(e) {}
      }
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(terminalRef.current);

    term.writeln('Help');
    term.write('\r\n\x1b[1;33m$\x1b[0m ');

    term.onData(data => {
      const charCode = data.charCodeAt(0);
      if (charCode === 13) { // Enter
        term.write('\r\n');
        handleInput(inputRef.current.trim().toLowerCase(), term);
        inputRef.current = '';
        term.write('\x1b[1;33m$\x1b[0m ');
      } else if (charCode === 127 || data === '\b') { // Backspace
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputRef.current += data;
        term.write(data);
      }
    });

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  // Re-fit on maximize
  useEffect(() => {
    if (!isMinimized && fitAddonRef.current) {
      setTimeout(() => {
        if (terminalRef.current && terminalRef.current.clientWidth > 0) {
          try { fitAddonRef.current?.fit() } catch(e) {}
        }
      }, 50);
    }
  }, [isMinimized]);

  const handleInput = (cmd: string, term: Terminal) => {
    if (!cmd) return;
    
    if (cmd === 'clear') {
      term.clear();
      return;
    }
    
    const parts = cmd.split(/\s+/);
    if (parts[0] === 'rx' && parts[1] === 'create') {
      const filesToCreate = parts.slice(2);
      if (filesToCreate.length > 0) {
        onCreateFiles(filesToCreate);
        term.writeln(`Created ${filesToCreate.length} file(s): ${filesToCreate.join(', ')}`);
      } else {
        term.writeln('-bash: rx create: missing filename(s)');
      }
    } else {
      term.writeln(`-bash: ${cmd}: command not found`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050505]">
      <div 
        className="flex-grow w-full relative" 
        style={{ display: isMinimized ? 'none' : 'block' }}
      >
        <div ref={terminalRef} className="absolute inset-0 p-3" />
      </div>
      
      {/* Global overrides for Xterm cursor to be exactly like requested */}
      <style>{`
        .xterm-cursor.xterm-cursor-block {
          background-color: #FFD700 !important;
        }
        .xterm .xterm-viewport {
          background-color: #050505 !important;
        }
      `}</style>
    </div>
  );
}
