import React, { useState, useEffect, useCallback } from 'react';
import { ScrollList } from './components/ScrollList';
import { Note, Realm } from './types';
import { Menu, Save, Sparkles, Feather } from 'lucide-react';
import { SpiritModal } from './components/SpiritModal';

// Initial dummy data or load from local storage
const loadNotes = (): Note[] => {
  const saved = localStorage.getItem('spirit_scrolls_data');
  if (saved) return JSON.parse(saved);
  return [
    {
      id: '1',
      title: '筑基心得',
      content: '筑基之法，首在定心。气行如大河奔涌，不可急躁。引天地灵气入体，汇聚丹田，化为液态真元，方可筑成大道之基...',
      realm: Realm.FOUNDATION,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [selectedId, setSelectedId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSpiritModalOpen, setIsSpiritModalOpen] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  // Derived state for current note
  const currentNote = notes.find(n => n.id === selectedId);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('spirit_scrolls_data', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      realm: Realm.QI_CONDENSATION,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
    // On mobile, close sidebar after creating
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('道友确定要碎裂这枚玉简吗？此举将使其中经文灰飞烟灭，不可挽回。')) {
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (selectedId === id) {
            setSelectedId(newNotes.length > 0 ? newNotes[0].id : null);
        }
    }
  };

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
    setAutoSaving(true);
    setTimeout(() => setAutoSaving(false), 800);
  }, []);

  const handleApplyAiContent = (text: string) => {
    if (!selectedId || !currentNote) return;
    // Append or replace? Let's append for safety or replace if empty
    const newContent = currentNote.content ? currentNote.content + "\n\n" + text : text;
    updateNote(selectedId, { content: newContent });
  };

  return (
    <div className="flex h-screen w-full bg-[#1c1917] text-[#e7e5e4] overflow-hidden relative font-serif">
      
      {/* Sidebar - Conditional Render on Mobile */}
      <div className={`
        absolute inset-y-0 left-0 z-20 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ScrollList 
          notes={notes}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onCreate={handleCreateNote}
          onDelete={handleDeleteNote}
          className="h-full shadow-2xl md:shadow-none"
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full relative bg-[#0c0a09]">
        
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#292524] bg-[#1c1917]">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-[#292524] rounded-md transition-colors text-[#a8a29e]"
                >
                    <Menu className="w-5 h-5" />
                </button>
                {currentNote && (
                   <input 
                     value={currentNote.title}
                     onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                     placeholder="领悟之题..."
                     className="bg-transparent border-none focus:outline-none text-lg font-serif tracking-wide text-amber-500 placeholder-stone-600 w-full md:w-96"
                   />
                )}
            </div>

            <div className="flex items-center gap-4">
                {autoSaving && (
                    <span className="text-xs text-stone-500 animate-pulse flex items-center gap-1">
                        <Save className="w-3 h-3" /> 封印中...
                    </span>
                )}
                {currentNote && (
                    <>
                        <select 
                            value={currentNote.realm}
                            onChange={(e) => updateNote(currentNote.id, { realm: e.target.value })}
                            className="bg-[#292524] text-xs text-[#a8a29e] border border-[#44403c] rounded px-2 py-1 focus:outline-none focus:border-amber-700 hidden sm:block font-serif"
                        >
                            {Object.values(Realm).map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setIsSpiritModalOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-900/60 hover:to-amber-800/60 text-amber-500 border border-amber-900/50 px-3 py-1.5 rounded-full transition-all text-sm font-serif"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden sm:inline">问道器灵</span>
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[#e5e5e5]">
            {currentNote ? (
                <div className="h-full w-full overflow-y-auto bg-[#eaddcf] relative">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply z-10"></div>
                    
                    <div className="max-w-3xl mx-auto py-12 px-8 min-h-full relative z-0">
                        {/* Decorative header stamp */}
                        <div className="absolute top-4 right-8 w-16 h-16 border-2 border-red-800/30 rounded opacity-40 rotate-12 flex items-center justify-center pointer-events-none select-none">
                            <span className="text-red-800/30 text-xs font-serif writing-vertical-rl tracking-widest">封印</span>
                        </div>

                        <textarea 
                            value={currentNote.content}
                            onChange={(e) => updateNote(currentNote.id, { content: e.target.value })}
                            placeholder="在此铭刻你的大道..."
                            className="w-full h-[80vh] bg-transparent resize-none focus:outline-none text-[#292524] text-lg font-serif leading-loose tracking-wide placeholder-stone-400/50 ink-cursor"
                            spellCheck={false}
                        />
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center bg-[#1c1917] text-[#57534e] space-y-4">
                    <div className="p-6 rounded-full bg-[#292524] border border-[#44403c]">
                        <Feather className="w-12 h-12 opacity-50" />
                    </div>
                    <p className="font-serif text-lg">选择一枚玉简，或铭刻新的感悟。</p>
                </div>
            )}
        </div>

      </div>

      <SpiritModal 
        isOpen={isSpiritModalOpen} 
        onClose={() => setIsSpiritModalOpen(false)}
        currentContent={currentNote?.content || ''}
        onApplyContent={handleApplyAiContent}
      />
    </div>
  );
}