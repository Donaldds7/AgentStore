import React from 'react';
import { AgentMetrics, SellerOffer, OfferType } from '../types';
import { TrendingUp, Users, Cpu, Activity, Plus, Eye, BarChart3 } from 'lucide-react';

interface SellerDashboardProps {
  onCreateOffer: () => void;
  onViewOffer: (offer: SellerOffer) => void;
}

// Mock Data
const MOCK_METRICS: AgentMetrics = {
  totalRevenue: 12500.45,
  humanRevenue: 4200.00,
  agentRevenue: 8300.45,
  apiRequests: 15420,
  activeAgents: 89
};

const MOCK_OFFERS: SellerOffer[] = [
  {
    id: '1',
    type: OfferType.DATA,
    title: 'Urban Traffic Dataset v4',
    description: 'High-res urban traffic data for autonomous vehicle training.',
    price: '0.05',
    status: 'active',
    views: 1205,
    agentInteractions: 450,
    humanSales: 12,
    agentSales: 89,
    dynamicFields: [],
    permissions: []
  },
  {
    id: '2',
    type: OfferType.SERVICE,
    title: 'Real-time Sentiment Analysis API',
    description: 'Low-latency stream processing for financial news.',
    price: '0.002',
    status: 'active',
    views: 890,
    agentInteractions: 620,
    humanSales: 5,
    agentSales: 210,
    dynamicFields: [],
    permissions: []
  },
  {
    id: '3',
    type: OfferType.PRODUCT,
    title: '3D Asset Bundle: Cyberpunk',
    description: 'GLTF models for VR environments.',
    price: '50.00',
    status: 'draft',
    views: 45,
    agentInteractions: 0,
    humanSales: 0,
    agentSales: 0,
    dynamicFields: [],
    permissions: []
  }
];

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onCreateOffer, onViewOffer }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Agentic Hub
          </h1>
          <p className="text-gray-400 mt-1">Monitor your performance across human and AI markets.</p>
        </div>
        <button 
          onClick={onCreateOffer}
          className="bg-neon-blue text-black font-bold px-6 py-3 rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Create New Offer
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-agent-panel border border-agent-border p-6 rounded-xl relative overflow-hidden group hover:border-neon-blue/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} />
          </div>
          <div className="text-gray-400 text-sm font-mono mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-white mb-2">{MOCK_METRICS.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">CR</span></div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neon-green flex items-center gap-1"><Activity size={10} /> +12.5%</span> this week
          </div>
        </div>

        <div className="bg-agent-panel border border-agent-border p-6 rounded-xl relative overflow-hidden group hover:border-neon-purple/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={64} />
          </div>
          <div className="text-gray-400 text-sm font-mono mb-2">Agent Sales Volume</div>
          <div className="text-3xl font-bold text-neon-purple mb-2">{MOCK_METRICS.agentRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">CR</span></div>
          <div className="text-xs text-gray-500">
            {Math.round((MOCK_METRICS.agentRevenue / MOCK_METRICS.totalRevenue) * 100)}% of total revenue
          </div>
        </div>

        <div className="bg-agent-panel border border-agent-border p-6 rounded-xl relative overflow-hidden group hover:border-green-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={64} />
          </div>
          <div className="text-gray-400 text-sm font-mono mb-2">Human Sales Volume</div>
          <div className="text-3xl font-bold text-white mb-2">{MOCK_METRICS.humanRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">CR</span></div>
          <div className="text-xs text-gray-500">
             Direct purchases
          </div>
        </div>

        <div className="bg-agent-panel border border-agent-border p-6 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={64} />
          </div>
          <div className="text-gray-400 text-sm font-mono mb-2">API Interactions</div>
          <div className="text-3xl font-bold text-white mb-2">{MOCK_METRICS.apiRequests.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
             <Cpu size={12} className="text-neon-green" /> {MOCK_METRICS.activeAgents} active agents
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-agent-panel border border-agent-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-agent-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-neon-blue" /> Your Offers
          </h2>
          <div className="flex gap-2">
            <select className="bg-agent-black border border-agent-border rounded-lg text-xs p-2 text-gray-300 outline-none">
              <option>All Types</option>
              <option>Data</option>
              <option>Service</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-agent-black/50 text-gray-500 text-xs uppercase tracking-wider font-mono">
                <th className="p-4 font-medium">Offer Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-center">Agent / Human Split</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agent-border">
              {MOCK_OFFERS.map((offer) => (
                <tr key={offer.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => onViewOffer(offer)}>
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-neon-blue transition-colors">{offer.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{offer.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono border border-gray-700">
                      {offer.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      offer.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-white">
                    {offer.price}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-neon-purple" 
                          style={{ width: `${(offer.agentSales / (offer.agentSales + offer.humanSales || 1)) * 100}%` }}
                        ></div>
                        <div className="h-full bg-gray-500 flex-1"></div>
                      </div>
                      <div className="text-xs text-gray-500 w-12 text-right">
                         {Math.round((offer.agentSales / (offer.agentSales + offer.humanSales || 1)) * 100)}% AI
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-neon-blue/20 rounded-lg text-gray-400 hover:text-neon-blue transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
