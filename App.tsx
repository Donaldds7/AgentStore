import React, { useState } from 'react';
import { SellerFlow } from './components/SellerFlow';
import { SellerDashboard } from './components/SellerDashboard';
import { BuyerFlow } from './components/BuyerFlow';
import { ProfileView } from './components/ProfileView';
import { Sparkles, Briefcase, ShoppingCart } from 'lucide-react';
import { SellerOffer } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'seller' | 'buyer'>('seller');
  // Seller State: 'dashboard', 'create-offer', 'view-offer' (simplified to dashboard vs create for now)
  const [sellerView, setSellerView] = useState<'dashboard' | 'create'>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-agent-black text-white selection:bg-neon-blue selection:text-black font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-agent-border bg-agent-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSellerView('dashboard'); setActiveMode('seller'); }}>
            <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(188,19,254,0.3)]">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight font-sans">AgentStore</span>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex bg-agent-panel rounded-lg p-1 border border-agent-border">
            <button
              onClick={() => { setActiveMode('seller'); setSellerView('dashboard'); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                activeMode === 'seller' 
                  ? 'bg-gray-700 text-white shadow' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Briefcase size={14} /> Seller
            </button>
            <button
              onClick={() => setActiveMode('buyer')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                activeMode === 'buyer' 
                  ? 'bg-neon-blue/20 text-neon-blue shadow' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <ShoppingCart size={14} /> Buyer
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs font-mono text-gray-500">
              Connected: <span className="text-neon-green">Human_{activeMode === 'seller' ? 'Seller' : 'Buyer'}_01</span>
            </div>
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 border border-gray-600 hover:border-neon-blue hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all cursor-pointer overflow-hidden"
              title="Open Profile"
            >
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">HO</div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative">
         {activeMode === 'seller' ? (
           sellerView === 'dashboard' ? (
             <SellerDashboard 
               onCreateOffer={() => setSellerView('create')} 
               onViewOffer={(offer) => console.log("View offer details", offer)} 
             />
           ) : (
             <SellerFlow onBackToDashboard={() => setSellerView('dashboard')} />
           )
         ) : (
           <BuyerFlow />
         )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-agent-border py-8 mt-auto bg-agent-black">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-gray-600 font-mono">
          <div>AGENTIC STOREFRONT PROTOCOL V1.0</div>
          <div>POWERED BY GEMINI 3 PRO</div>
        </div>
      </footer>

      {/* Overlays */}
      {isProfileOpen && (
        <ProfileView onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default App;
