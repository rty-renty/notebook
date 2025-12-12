import React from 'react';
import { Plus, Trash2, ScrollText, Search } from 'lucide-react';
import { Note, Realm } from '../types';

interface ScrollListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  className?: string;
}

export const ScrollList: React.FC<ScrollListProps> = ({ 
  notes, 
  selectedId, 
  onSelect, 
  onCreate, 
  onDelete,
  className 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full bg-[#1c1917] border-r border-[#292524] ${className}`}>
      {/* Header / Search */}
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-serif text-amber-500/90 tracking-widest flex items-center gap-2">
           <ScrollText className="w-6 h-6" />
           <span>藏经阁</span>
        </h1>
        
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#57534e] group-focus-within:text-amber-700 transition-colors" />
          <input 
            type="text" 
            placeholder="搜索玉简..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#292524] border border-[#44403c] rounded text-sm py-2 pl-9 pr-3 text-[#a8a29e] focus:outline-none focus:border-amber-900/50 transition-all placeholder-[#57534e] font-serif"
          />
        </div>

        <button 
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 bg-amber-900/20 hover:bg-amber-900/30 text-amber-600 border border-amber-900/40 hover:border-amber-600/50 py-2 rounded transition-all duration-300 font-serif"
        >
          <Plus className="w-4 h-4" />
          <span>铭刻新道</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 text-[#44403c] text-sm italic font-serif">
            藏经阁空空如也，<br/>道友该开始修炼了。
          </div>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => onSelect(note.id)}
              className={`
                group relative p-3 rounded-md cursor-pointer border transition-all duration-200
                ${selectedId === note.id 
                  ? 'bg-[#292524] border-amber-900/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]' 
                  : 'bg-transparent border-transparent hover:bg-[#292524]/50 hover:border-[#292524]'
                }
              `}
            >
              <h3 className={`font-serif text-base mb-1 truncate ${selectedId === note.id ? 'text-amber-500' : 'text-[#d6d3d1] group-hover:text-amber-500/80'}`}>
                {note.title || "无名经文"}
              </h3>
              <div className="flex justify-between items-center text-xs text-[#57534e]">
                <span>{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
                <span className={`px-1.5 py-0.5 rounded border ${
                    note.realm === Realm.QI_CONDENSATION ? 'border-stone-700 text-stone-500' :
                    note.realm === Realm.GOLDEN_CORE ? 'border-yellow-900/40 text-yellow-700' :
                    'border-stone-700 text-stone-500'
                } text-[10px]`}>
                   {note.realm}
                </span>
              </div>

              <button 
                onClick={(e) => onDelete(e, note.id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 text-[#57534e] transition-opacity bg-[#1c1917] rounded shadow-sm"
                title="碎裂玉简"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-[#292524] text-[10px] text-center text-[#44403c] font-serif">
        灵简 v1.0
      </div>
    </div>
  );
};