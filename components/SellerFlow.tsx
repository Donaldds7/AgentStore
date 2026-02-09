import React, { useState } from 'react';
import { OfferType, OfferData } from '../types';
import { StepIndicator } from './StepIndicator';
import { TypeSelection } from './TypeSelection';
import { BasicDetails } from './BasicDetails';
import { AgentPermissions } from './AgentPermissions';
import { AgentCardPreview } from './AgentCardPreview';
import { ArrowRight, ArrowLeft, Check, Layout, X } from 'lucide-react';

const STEPS = ["Offer Type", "Details", "Permissions", "Review"];

interface SellerFlowProps {
  onBackToDashboard: () => void;
}

export const SellerFlow: React.FC<SellerFlowProps> = ({ onBackToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublished, setIsPublished] = useState(false);
  
  const [formData, setFormData] = useState<OfferData>({
    type: null,
    title: "",
    description: "",
    price: "",
    dynamicFields: [],
    permissions: []
  });

  const updateFormData = (newData: Partial<OfferData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPublished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isPublished) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center h-[80vh] animate-fade-in">
        <div className="bg-agent-panel p-12 rounded-3xl border border-neon-green/30 shadow-[0_0_50px_rgba(10,255,104,0.1)] max-w-lg w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 to-transparent pointer-events-none"></div>
          <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-green">
            <Check size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Offer Published</h1>
          <p className="text-gray-400 mb-8">
            Your agentic offer is now live on the decentralized registry.
            <br />
            <span className="font-mono text-neon-blue text-xs mt-2 block">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </p>
          <div className="flex flex-col gap-3">
             <button 
              onClick={() => {
                setIsPublished(false);
                setCurrentStep(1);
                setFormData({ type: null, title: "", description: "", price: "", dynamicFields: [], permissions: [] });
              }}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Create Another Offer
            </button>
            <button
               onClick={onBackToDashboard}
               className="w-full bg-transparent text-gray-400 font-bold py-3 rounded-xl hover:text-white transition-colors"
            >
               Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Agent Card Builder
        </h1>
        <button onClick={onBackToDashboard} className="text-gray-500 hover:text-white transition-colors">
           <X size={24} />
        </button>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} labels={STEPS} />

      {/* Main Split Layout - Enhanced for Screen 2 requirements */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        
        {/* Left Column: Form / Configuration */}
        <div className={`
          ${currentStep === 4 ? 'hidden lg:hidden' : 'lg:col-span-7'} 
          bg-agent-panel border border-agent-border rounded-2xl p-6 lg:p-8 overflow-y-auto
        `}>
          {currentStep === 1 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold text-white mb-6">Select Asset Class</h2>
               <TypeSelection 
                  selectedType={formData.type} 
                  onSelect={(type) => updateFormData({ type })} 
               />
             </div>
          )}
          {currentStep === 2 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold text-white mb-6">Asset Specifications</h2>
               <BasicDetails data={formData} onUpdate={updateFormData} />
             </div>
          )}
          {currentStep === 3 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold text-white mb-6">Agentic Protocol Configuration</h2>
               <AgentPermissions data={formData} onUpdate={updateFormData} />
             </div>
          )}
        </div>

        {/* Right Column: Real-time Agent Card Preview (Persistent in steps 2 & 3) */}
        {(currentStep === 2 || currentStep === 3) && (
           <div className="lg:col-span-5 flex flex-col h-full sticky top-6">
              <div className="bg-agent-black border border-agent-border rounded-2xl p-6 h-full flex flex-col">
                 <div className="flex items-center gap-2 text-neon-blue mb-4 font-mono text-xs uppercase tracking-wider">
                    <Layout size={14} /> Live Agent Card Preview
                 </div>
                 <div className="flex-1 flex items-center justify-center">
                    <div className="scale-75 origin-top w-full">
                       <AgentCardPreview data={formData} />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Full Width Review Step */}
        {currentStep === 4 && (
           <div className="col-span-1 lg:col-span-12">
               <AgentCardPreview data={formData} />
           </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-agent-black/90 border-t border-agent-border p-6 backdrop-blur-lg z-40">
         <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <ArrowLeft size={20} /> Back
            </button>

            <button 
              onClick={handleNext}
              disabled={currentStep === 1 && !formData.type}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all
                ${currentStep === 1 && !formData.type 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'}
              `}
            >
              {currentStep === STEPS.length ? 'Publish Offer' : 'Continue'} <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};
