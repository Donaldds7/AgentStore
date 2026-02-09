import React, { useState } from 'react';
import { UserProfile, Transaction, AgentConfiguration } from '../types';
import { X, Wallet, CreditCard, Bitcoin, RefreshCcw, ArrowUpRight, ArrowDownLeft, History, ShieldCheck, User, Bot, Lock, Mail, MessageCircle, Smartphone, Check } from 'lucide-react';

interface ProfileViewProps {
  onClose: () => void;
}

// Mock Data
const MOCK_USER: UserProfile = {
  id: 'usr_8823',
  name: 'Human_Operator_01',
  email: 'operator@nexus.ai',
  reputationScore: 98,
  balance: 14500.00, // 14,500 CR (~$1,450)
  connectedAgents: 3,
  agentConfig: {
    accessLevel: 'partial',
    confirmationMethod: 'email',
    contactInfo: 'operator@nexus.ai',
    dailySpendingLimit: 5000, // 5000 CR ($500)
    autoApproveLimit: 500 // 500 CR ($50)
  }
};

const MOCK_HISTORY: Transaction[] = [
  { id: 'tx_1', type: 'purchase', amount: -500.00, currency: 'CREDIT', description: 'Bought: Urban Traffic Dataset', date: '2023-10-24T10:30:00Z', status: 'completed', counterparty: 'DeepMind_Sales_Bot' },
  { id: 'tx_2', type: 'sale', amount: 5.00, currency: 'CREDIT', description: 'Sold: Sentiment API Call', date: '2023-10-24T09:15:00Z', status: 'completed', counterparty: 'Trading_Bot_X' },
  { id: 'tx_3', type: 'deposit', amount: 500.00, currency: 'USD', description: 'Wallet Top-up', date: '2023-10-23T14:00:00Z', status: 'completed', counterparty: 'Stripe' },
  { id: 'tx_4', type: 'sale', amount: 250.00, currency: 'CREDIT', description: 'Sold: 3D Asset Bundle', date: '2023-10-22T16:45:00Z', status: 'completed', counterparty: 'GameDev_Agent_09' },
  { id: 'tx_5', type: 'purchase', amount: -1200.00, currency: 'CREDIT', description: 'Bought: Compute Time (GPU)', date: '2023-10-21T08:20:00Z', status: 'completed', counterparty: 'Compute_Grid_v2' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'wallet' | 'agents'>('wallet');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'exchange'>('card');
  const [processing, setProcessing] = useState(false);
  
  // Agent Config State
  const [agentConfig, setAgentConfig] = useState<AgentConfiguration>(MOCK_USER.agentConfig);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      setShowAddFunds(false);
      alert(`Successfully processed payment of $${addAmount}. Added ${Number(addAmount) * 10} CREDITS to wallet.`);
    }, 2000);
  };

  const handleSaveConfig = () => {
    setIsSavingConfig(true);
    setTimeout(() => {
      setIsSavingConfig(false);
      // In a real app, this would patch to backend
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex justify-end animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-2xl bg-agent-black border-l border-agent-border h-full overflow-y-auto flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="p-6 border-b border-agent-border flex justify-between items-center bg-agent-panel sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg">
                <User className="text-white" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">{MOCK_USER.name}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                   <span>ID: {MOCK_USER.id}</span>
                   <span className="text-agent-border">|</span>
                   <span className="text-neon-green flex items-center gap-1"><ShieldCheck size={12}/> {MOCK_USER.reputationScore} Reputation</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-agent-border bg-agent-black sticky top-[88px] z-10">
           <button 
             onClick={() => setActiveTab('wallet')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex justify-center items-center gap-2 ${activeTab === 'wallet' ? 'border-neon-blue text-neon-blue bg-neon-blue/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Wallet size={16} /> Wallet
           </button>
           <button 
             onClick={() => setActiveTab('agents')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex justify-center items-center gap-2 ${activeTab === 'agents' ? 'border-neon-blue text-neon-blue bg-neon-blue/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Bot size={16} /> Agent Controls
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex justify-center items-center gap-2 ${activeTab === 'history' ? 'border-neon-blue text-neon-blue bg-neon-blue/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <History size={16} /> History
           </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 space-y-8 pb-24">
          
          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
             <div className="space-y-6 animate-fade-in">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-agent-border rounded-2xl p-8 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Wallet size={120} />
                   </div>
                   <div className="relative z-10">
                      <div className="text-gray-400 text-sm font-mono mb-2">Available Balance</div>
                      <div className="text-5xl font-bold text-white mb-6 font-mono tracking-tighter">
                         {MOCK_USER.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-lg text-neon-blue font-sans">CR</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-6">
                        ≈ ${(MOCK_USER.balance / 10).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                      </div>
                      <div className="flex gap-4">
                         <button 
                           onClick={() => setShowAddFunds(true)}
                           className="bg-neon-blue text-black font-bold px-6 py-3 rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2"
                         >
                            <ArrowDownLeft size={20} /> Add Funds
                         </button>
                         <button className="bg-agent-panel border border-agent-border text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2">
                            <ArrowUpRight size={20} /> Withdraw
                         </button>
                      </div>
                   </div>
                </div>

                {/* Add Funds Form (Collapsible) */}
                {showAddFunds && (
                   <div className="bg-agent-panel border border-agent-border rounded-xl p-6 animate-fade-in">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-lg font-bold text-white">Top Up Wallet</h3>
                         <button onClick={() => setShowAddFunds(false)} className="text-gray-500 hover:text-white"><X size={18}/></button>
                      </div>
                      
                      <form onSubmit={handleAddFunds} className="space-y-6">
                         <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase mb-3">Select Payment Method</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                               <button 
                                 type="button"
                                 onClick={() => setPaymentMethod('card')}
                                 className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'bg-black border-agent-border text-gray-500 hover:border-gray-600'}`}
                               >
                                  <CreditCard size={24} />
                                  <span className="text-sm font-bold">Card</span>
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => setPaymentMethod('crypto')}
                                 className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'crypto' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'bg-black border-agent-border text-gray-500 hover:border-gray-600'}`}
                               >
                                  <Bitcoin size={24} />
                                  <span className="text-sm font-bold">USDC / ETH</span>
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => setPaymentMethod('exchange')}
                                 className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'exchange' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'bg-black border-agent-border text-gray-500 hover:border-gray-600'}`}
                               >
                                  <RefreshCcw size={24} />
                                  <span className="text-sm font-bold">Credit Swap</span>
                               </button>
                            </div>
                         </div>

                         <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Amount (USD)</label>
                            <div className="relative">
                               <span className="absolute left-4 top-3.5 text-gray-500 font-bold">$</span>
                               <input 
                                 type="number" 
                                 value={addAmount}
                                 onChange={(e) => setAddAmount(e.target.value)}
                                 placeholder="100.00"
                                 className="w-full bg-black border border-agent-border rounded-xl py-3 pl-8 pr-4 text-white font-mono focus:border-neon-blue outline-none transition-colors"
                                 required
                               />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Conversion Rate: 1 USD = 10 CREDITS</p>
                            {addAmount && (
                               <div className="mt-2 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue text-sm font-mono flex items-center gap-2">
                                  <RefreshCcw size={14} /> You receive: <span className="font-bold">{Number(addAmount) * 10} CR</span>
                               </div>
                            )}
                         </div>

                         <button 
                           type="submit" 
                           disabled={processing || !addAmount}
                           className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                         >
                            {processing ? 'Processing Payment...' : `Confirm Purchase ($${addAmount || '0'})`}
                         </button>
                      </form>
                   </div>
                )}
             </div>
          )}

          {/* Agent Configuration Tab */}
          {activeTab === 'agents' && (
            <div className="space-y-8 animate-fade-in">
              {/* Access Level */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock size={18} className="text-neon-blue" /> Authorization Level
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setAgentConfig({ ...agentConfig, accessLevel: 'full' })}
                    className={`
                      p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group
                      ${agentConfig.accessLevel === 'full' 
                        ? 'bg-neon-blue/10 border-neon-blue' 
                        : 'bg-agent-panel border-agent-border hover:border-gray-600'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-black rounded-lg text-white group-hover:text-neon-blue transition-colors">
                        <Bot size={24} />
                      </div>
                      {agentConfig.accessLevel === 'full' && <div className="text-neon-blue"><Check size={20}/></div>}
                    </div>
                    <h4 className="font-bold text-white mb-1">Full Autonomous</h4>
                    <p className="text-xs text-gray-400">Agent executes trades instantly up to global budget limits.</p>
                  </div>

                  <div 
                    onClick={() => setAgentConfig({ ...agentConfig, accessLevel: 'partial' })}
                    className={`
                      p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group
                      ${agentConfig.accessLevel === 'partial' 
                        ? 'bg-neon-green/10 border-neon-green' 
                        : 'bg-agent-panel border-agent-border hover:border-gray-600'}
                    `}
                  >
                     <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-black rounded-lg text-white group-hover:text-neon-green transition-colors">
                        <ShieldCheck size={24} />
                      </div>
                      {agentConfig.accessLevel === 'partial' && <div className="text-neon-green"><Check size={20}/></div>}
                    </div>
                    <h4 className="font-bold text-white mb-1">Partial (Human-in-Loop)</h4>
                    <p className="text-xs text-gray-400">Agent requires external confirmation for transactions.</p>
                  </div>
                </div>
              </div>

              {/* Confirmation Settings (Conditional) */}
              {agentConfig.accessLevel === 'partial' && (
                <div className="bg-agent-panel border border-agent-border rounded-xl p-6 space-y-6 animate-fade-in">
                   <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-3">Confirmation Channel</label>
                      <div className="flex flex-wrap gap-3">
                        {(['email', 'telegram', 'whatsapp'] as const).map(method => (
                          <button
                            key={method}
                            onClick={() => setAgentConfig({ ...agentConfig, confirmationMethod: method })}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold capitalize
                              ${agentConfig.confirmationMethod === method
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-gray-500 border-gray-800 hover:border-gray-600'}
                            `}
                          >
                            {method === 'email' && <Mail size={16} />}
                            {method === 'telegram' && <MessageCircle size={16} />}
                            {method === 'whatsapp' && <Smartphone size={16} />}
                            {method}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Contact Details</label>
                      <input 
                        type="text" 
                        value={agentConfig.contactInfo}
                        onChange={(e) => setAgentConfig({ ...agentConfig, contactInfo: e.target.value })}
                        placeholder={
                          agentConfig.confirmationMethod === 'email' ? "enter@email.com" :
                          agentConfig.confirmationMethod === 'telegram' ? "@username" : "+1 555 000 0000"
                        }
                        className="w-full bg-black border border-agent-border rounded-xl p-3 text-white font-sans focus:border-neon-blue outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                         The agent will send a {agentConfig.confirmationMethod} message with an approval link for every purchase.
                      </p>
                   </div>
                </div>
              )}

              {/* Budget Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <CreditCard size={18} className="text-neon-purple" /> Budget Guardrails
                </h3>
                <div className="bg-agent-panel border border-agent-border rounded-xl p-6 space-y-6">
                   <div>
                      <div className="flex justify-between mb-2">
                         <label className="text-xs font-mono text-gray-400 uppercase">Daily Spending Limit</label>
                         <span className="text-sm font-bold text-white font-mono">{agentConfig.dailySpendingLimit} CR</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="50000" step="100"
                        value={agentConfig.dailySpendingLimit}
                        onChange={(e) => setAgentConfig({ ...agentConfig, dailySpendingLimit: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                      />
                      <p className="text-xs text-gray-500 mt-1">≈ ${agentConfig.dailySpendingLimit / 10} USD</p>
                   </div>

                   <div>
                      <div className="flex justify-between mb-2">
                         <label className="text-xs font-mono text-gray-400 uppercase">Auto-Approve Threshold</label>
                         <span className="text-sm font-bold text-white font-mono">{agentConfig.autoApproveLimit} CR</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="5000" step="50"
                        value={agentConfig.autoApproveLimit}
                        onChange={(e) => setAgentConfig({ ...agentConfig, autoApproveLimit: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                      />
                      <p className="text-xs text-gray-500 mt-1">Transactions below ${agentConfig.autoApproveLimit / 10} USD skip confirmation.</p>
                   </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 sticky bottom-0 bg-agent-black pb-6 border-t border-agent-border">
                <button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  {isSavingConfig ? 'Updating Protocol...' : 'Save Agent Configuration'}
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
             <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-white">Recent Activity</h3>
                   <button className="text-xs text-neon-blue hover:text-white transition-colors">Export CSV</button>
                </div>
                
                {MOCK_HISTORY.map((tx) => (
                   <div key={tx.id} className="bg-agent-panel border border-agent-border p-4 rounded-xl flex items-center justify-between group hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'deposit' || tx.type === 'sale' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                         }`}>
                            {tx.type === 'deposit' && <ArrowDownLeft size={20} />}
                            {tx.type === 'sale' && <ArrowDownLeft size={20} />}
                            {tx.type === 'purchase' && <ArrowUpRight size={20} />}
                            {tx.type === 'withdrawal' && <ArrowUpRight size={20} />}
                         </div>
                         <div>
                            <div className="font-bold text-white text-sm">{tx.description}</div>
                            <div className="text-xs text-gray-500 font-mono">
                               {new Date(tx.date).toLocaleDateString()} • {tx.counterparty}
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className={`font-mono font-bold ${
                             tx.type === 'deposit' || tx.type === 'sale' ? 'text-green-500' : 'text-white'
                         }`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency === 'CREDIT' ? 'CR' : tx.currency}
                         </div>
                         <div className="text-[10px] uppercase tracking-wider text-gray-500 bg-black px-2 py-0.5 rounded inline-block mt-1">
                            {tx.status}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
