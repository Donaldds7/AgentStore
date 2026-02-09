import React, { useState } from 'react';
import { OfferData } from '../types';
import { Eye, Code, Cpu } from 'lucide-react';

interface AgentCardPreviewProps {
  data: OfferData;
}

export const AgentCardPreview: React.FC<AgentCardPreviewProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'human' | 'agent'>('human');

  // Constructing the "Agent View" JSON structure
  const agentPayload = {
    "@context": "https://schema.org/",
    "@type": data.type,
    "name": data.title,
    "description": data.description,
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": "CREDIT"
    },
    "agentProtocol": {
      "specifications": data.dynamicFields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.value
      }), {}),
      "permissions": data.permissions.filter(p => p.selected).map(p => p.id)
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-agent-panel p-1 rounded-lg border border-agent-border inline-flex">
          <button
            onClick={() => setViewMode('human')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'human' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Eye size={16} /> Human View
          </button>
          <button
            onClick={() => setViewMode('agent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'agent' ? 'bg-neon-blue/20 text-neon-blue shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Code size={16} /> Agent View
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        {viewMode === 'human' ? (
          /* Human Card */
          <div className="w-full max-w-md bg-agent-panel border border-agent-border rounded-2xl overflow-hidden shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"></div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-gray-800 text-xs font-mono text-gray-400 border border-gray-700">
                  {data.type?.toUpperCase()}
                </span>
                <Cpu className="text-gray-600 group-hover:text-neon-blue transition-colors" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{data.title || "Untitled Offer"}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{data.description || "No description provided."}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-agent-border">
                {data.dynamicFields.slice(0, 3).map((field, i) => (
                   <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{field.label}</span>
                      <span className="text-gray-300 font-mono">{String(field.value || '-')}</span>
                   </div>
                ))}
              </div>

              <div className="pt-6 flex justify-between items-center">
                 <div>
                    <span className="text-xs text-gray-500 uppercase">Price</span>
                    <div className="text-neon-green font-mono text-xl font-bold">{data.price || "0.00"} <span className="text-xs text-gray-500">CR</span></div>
                 </div>
                 <button className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    Purchase
                 </button>
              </div>
            </div>
          </div>
        ) : (
          /* Agent View */
          <div className="w-full bg-[#0d1117] rounded-xl border border-gray-800 p-6 overflow-hidden relative">
            <div className="absolute top-4 right-4 text-xs font-mono text-gray-600">JSON-LD+AgentProtocol</div>
            <pre className="font-mono text-sm text-gray-300 overflow-x-auto">
              <code>
{JSON.stringify(agentPayload, null, 2).replace(/"key":/g, '<span class="text-neon-blue">"key":</span>').replace(/: ".*"/g, (match) => `: <span class="text-green-400">${match.substring(2)}</span>`)}
              </code>
            </pre>
            {/* Simple syntax highlighting attempt via logic above isn't robust for full JSON stringify, let's just use color for now */}
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500 font-mono">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Valid Schema</span>
               <span>Size: {JSON.stringify(agentPayload).length} bytes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
