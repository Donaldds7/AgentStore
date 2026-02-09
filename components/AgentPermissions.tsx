import React, { useState } from 'react';
import { OfferData, PermissionOption } from '../types';
import { suggestPermissions } from '../services/geminiService';
import { Shield, Loader2, Bot, CheckCircle2, Circle } from 'lucide-react';

interface AgentPermissionsProps {
  data: OfferData;
  onUpdate: (data: Partial<OfferData>) => void;
}

export const AgentPermissions: React.FC<AgentPermissionsProps> = ({ data, onUpdate }) => {
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestPermissions = async () => {
    if (!data.type) return;
    setIsSuggesting(true);
    const suggestions = await suggestPermissions(data.type, data.description || data.title);
    onUpdate({ permissions: suggestions });
    setIsSuggesting(false);
  };

  const togglePermission = (id: string) => {
    const updated = data.permissions.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    );
    onUpdate({ permissions: updated });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-neon-green/10 to-transparent p-6 rounded-xl border border-neon-green/30">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield size={20} className="text-neon-green" />
            Agent Access Control
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Define contractual boundaries for autonomous agents interacting with this offer.
          </p>
        </div>
        <button
          onClick={handleSuggestPermissions}
          disabled={isSuggesting}
          className="flex items-center gap-2 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-all font-mono text-sm font-bold border border-neon-green/50 whitespace-nowrap"
        >
          {isSuggesting ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
          {isSuggesting ? 'Analyzing...' : 'Suggest Permissions'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.permissions.length === 0 ? (
           <div className="text-center py-12 text-gray-500 border border-agent-border rounded-xl bg-agent-panel">
              <p>No permissions configured.</p>
              <p className="text-sm mt-2">Ask Gemini to suggest an access model based on your offer description.</p>
           </div>
        ) : (
          data.permissions.map((perm) => (
            <div 
              key={perm.id}
              onClick={() => togglePermission(perm.id)}
              className={`
                relative p-5 rounded-xl border cursor-pointer transition-all duration-200
                ${perm.selected 
                  ? 'bg-neon-green/5 border-neon-green shadow-[0_0_10px_rgba(10,255,104,0.1)]' 
                  : 'bg-agent-panel border-agent-border hover:border-gray-600'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${perm.selected ? 'text-neon-green' : 'text-gray-600'}`}>
                  {perm.selected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold font-mono text-lg ${perm.selected ? 'text-white' : 'text-gray-300'}`}>
                    {perm.label}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{perm.description}</p>
                  {perm.recommendedFor && perm.recommendedFor.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {perm.recommendedFor.map((rec, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider bg-agent-black border border-agent-border px-2 py-1 rounded text-gray-500">
                          {rec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
