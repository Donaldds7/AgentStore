import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex flex-col items-center relative flex-1">
             <div className="flex items-center w-full">
                {/* Line before */}
                <div className={`h-[1px] w-full ${index === 0 ? 'opacity-0' : ''} ${isCompleted ? 'bg-neon-blue' : 'bg-agent-border'}`}></div>
                
                {/* Dot */}
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border
                    ${isActive ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]' : ''}
                    ${isCompleted ? 'bg-neon-blue border-neon-blue text-black' : ''}
                    ${!isActive && !isCompleted ? 'bg-agent-panel border-agent-border text-gray-500' : ''}
                    transition-all duration-300 z-10
                  `}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>

                {/* Line after */}
                <div className={`h-[1px] w-full ${index === totalSteps - 1 ? 'opacity-0' : ''} ${isCompleted ? 'bg-neon-blue' : (isActive ? 'bg-gradient-to-r from-neon-blue to-agent-border' : 'bg-agent-border')}`}></div>
             </div>
             <span className={`absolute top-10 text-xs uppercase tracking-wider font-mono ${isActive ? 'text-neon-blue' : 'text-gray-600'}`}>
                {labels[index]}
             </span>
          </div>
        );
      })}
    </div>
  );
};
