import React from 'react';
import { OfferType } from '../types';
import { Package, Server, Database, Wrench } from 'lucide-react';

interface TypeSelectionProps {
  onSelect: (type: OfferType) => void;
  selectedType: OfferType | null;
}

const TypeCard: React.FC<{
  type: OfferType;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ type, icon, description, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-8 rounded-xl border border-agent-border
      transition-all duration-300 group hover:border-neon-blue hover:bg-neon-blue/5
      ${isSelected ? 'border-neon-blue bg-neon-blue/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-agent-panel'}
    `}
  >
    <div className={`mb-4 transition-colors duration-300 ${isSelected ? 'text-neon-blue' : 'text-gray-400 group-hover:text-neon-blue'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold font-mono mb-2 text-white">{type}</h3>
    <p className="text-sm text-gray-400 text-center font-sans">{description}</p>
  </button>
);

export const TypeSelection: React.FC<TypeSelectionProps> = ({ onSelect, selectedType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      <TypeCard
        type={OfferType.PRODUCT}
        icon={<Package size={40} />}
        description="Physical goods or digital assets with fixed inventory."
        isSelected={selectedType === OfferType.PRODUCT}
        onClick={() => onSelect(OfferType.PRODUCT)}
      />
      <TypeCard
        type={OfferType.SERVICE}
        icon={<Server size={40} />}
        description="Ongoing services, APIs, or compute resources."
        isSelected={selectedType === OfferType.SERVICE}
        onClick={() => onSelect(OfferType.SERVICE)}
      />
      <TypeCard
        type={OfferType.DATA}
        icon={<Database size={40} />}
        description="Datasets, streams, or knowledge bases for training/inference."
        isSelected={selectedType === OfferType.DATA}
        onClick={() => onSelect(OfferType.DATA)}
      />
      <TypeCard
        type={OfferType.TOOL}
        icon={<Wrench size={40} />}
        description="Executable functions or plugins for agent tool use."
        isSelected={selectedType === OfferType.TOOL}
        onClick={() => onSelect(OfferType.TOOL)}
      />
    </div>
  );
};
