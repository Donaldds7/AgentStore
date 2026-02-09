import React, { useState } from 'react';
import { OfferData, DynamicField } from '../types';
import { Sparkles, Loader2, Plus, X } from 'lucide-react';
import { generateOfferFields } from '../services/geminiService';

interface BasicDetailsProps {
  data: OfferData;
  onUpdate: (data: Partial<OfferData>) => void;
}

export const BasicDetails: React.FC<BasicDetailsProps> = ({ data, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFields = async () => {
    if (!data.title || !data.type) return;
    setIsGenerating(true);
    const newFields = await generateOfferFields(data.title, data.type);
    onUpdate({ dynamicFields: newFields });
    setIsGenerating(false);
  };

  const updateField = (index: number, value: string | number | boolean) => {
    const updatedFields = [...data.dynamicFields];
    updatedFields[index] = { ...updatedFields[index], value };
    onUpdate({ dynamicFields: updatedFields });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Static Fields */}
      <div className="space-y-6 bg-agent-panel p-6 rounded-xl border border-agent-border">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Offer Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g., Real-time Traffic Object Recognition API"
            className="w-full bg-agent-black border border-agent-border rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none transition-colors font-sans"
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the capabilities and scope..."
            rows={4}
            className="w-full bg-agent-black border border-agent-border rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none transition-colors font-sans"
          />
        </div>
        
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Base Price (Credits)</label>
          <input
            type="text"
            value={data.price}
            onChange={(e) => onUpdate({ price: e.target.value })}
            placeholder="e.g., 0.005 / call"
            className="w-full bg-agent-black border border-agent-border rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none transition-colors font-sans"
          />
        </div>
      </div>

      {/* Dynamic AI Fields */}
      <div className="bg-agent-panel p-6 rounded-xl border border-agent-border relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></span>
            Technical Specs
          </h3>
          <button
            onClick={handleGenerateFields}
            disabled={!data.title || isGenerating}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${!data.title 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 border border-neon-purple/50'}
            `}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isGenerating ? 'Gemini Thinking...' : 'Auto-Generate Fields'}
          </button>
        </div>

        {data.dynamicFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-agent-border rounded-lg">
            <p className="font-mono text-sm">No technical specifications defined.</p>
            <p className="text-xs mt-2">Enter a title and click "Auto-Generate" to ask Gemini 3 Pro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.dynamicFields.map((field, index) => (
              <div key={index} className="space-y-1">
                <label className="text-xs font-mono text-neon-blue uppercase tracking-wider">{field.label}</label>
                {field.type === 'select' ? (
                   <select 
                     className="w-full bg-agent-black border border-agent-border rounded p-2 text-white text-sm focus:border-neon-blue outline-none"
                     value={String(field.value || '')}
                     onChange={(e) => updateField(index, e.target.value)}
                   >
                     <option value="">Select...</option>
                     {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={String(field.value || '')}
                    onChange={(e) => updateField(index, e.target.value)}
                    className="w-full bg-agent-black border border-agent-border rounded p-2 text-white text-sm focus:border-neon-blue outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
