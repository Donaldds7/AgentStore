import React, { useState, useRef, useEffect } from 'react';
import { SearchResult, NegotiationState, ChatMessage, OfferType } from '../types';
import { Send, Bot, Zap, MessageSquare, X, DollarSign, CheckCircle, ShieldCheck, Cpu, ShoppingCart, Loader2 } from 'lucide-react';

// --- MOCK DATA FOR SIMULATION ---
const MOCK_RESULTS: SearchResult[] = [
  {
    id: 'sim_1',
    type: OfferType.DATA,
    title: 'Urban Mobility Heatmap 2024',
    description: 'Anonymized high-frequency traffic and pedestrian density data for major metropolitan areas.',
    price: 450,
    currency: 'CREDIT',
    agentName: 'Metro_Data_Broker_v9',
    reliabilityScore: 99,
    specifications: { format: 'GeoJSON', frequency: 'Real-time', coverage: 'Top 50 Cities' },
    justification: 'Matches your request for high-fidelity urban data.'
  },
  {
    id: 'sim_2',
    type: OfferType.SERVICE,
    title: 'Traffic Flow Prediction API',
    description: 'Predictive endpoint using transformer models to forecast congestion 1 hour ahead.',
    price: 0.05,
    currency: 'CREDIT',
    agentName: 'TrafficMind_AI',
    reliabilityScore: 94,
    specifications: { latency: '50ms', model: 'Transformer-XL', input: 'Coordinates' },
    justification: 'Best value for predictive modeling.'
  },
  {
    id: 'sim_3',
    type: OfferType.DATA,
    title: 'Raw Sensor Feed: Highway 101',
    description: 'Direct raw LiDAR and Camera feed metadata from highway sensors.',
    price: 1200,
    currency: 'CREDIT',
    agentName: 'Infra_Bot_X',
    reliabilityScore: 88,
    specifications: { size: '50GB/day', type: 'Raw Stream' },
    justification: 'High volume raw data source available.'
  }
];

export const BuyerFlow: React.FC = () => {
  // Main Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Online. I am Nexus, your Personal Agent. I am running in SIMULATION MODE. What assets are you looking to acquire today? (Try asking for "traffic data")',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Negotiation State (Modal Overlay)
  const [negotiation, setNegotiation] = useState<NegotiationState>({
    isActive: false,
    offerId: null,
    messages: [],
    status: 'open'
  });
  const [negotiationInput, setNegotiationInput] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const negotiationEndRef = useRef<HTMLDivElement>(null);

  // Helper to find offer details for negotiation
  const [currentNegotiationOffer, setCurrentNegotiationOffer] = useState<SearchResult | null>(null);

  // Auto-scroll main chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Auto-scroll negotiation chat
  useEffect(() => {
    if (negotiation.isActive) {
      negotiationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [negotiation.messages, negotiation.isActive]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    
    // Add User Message
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // SIMULATED RESPONSE LOGIC
    setTimeout(() => {
      let responseText = "I'm not sure I understand. Try asking for 'traffic data' or 'analysis tools'.";
      let results: SearchResult[] | undefined = undefined;

      const lowerText = userText.toLowerCase();

      if (lowerText.includes('traffic') || lowerText.includes('data') || lowerText.includes('urban')) {
        responseText = "I've scanned the decentralized marketplace. Here are the top 3 verified offers matching your criteria for urban traffic data.";
        results = MOCK_RESULTS;
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        responseText = "Greetings. I am ready to facilitate transactions. What do you need?";
      } else if (lowerText.includes('price') || lowerText.includes('cost')) {
        responseText = "Prices fluctuate based on demand. I can negotiate on your behalf to secure the best rate (roughly 10-20% below listing).";
      }

      const newAgentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: responseText,
        timestamp: Date.now(),
        results: results
      };

      setChatMessages(prev => [...prev, newAgentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const startNegotiation = (offer: SearchResult) => {
    setCurrentNegotiationOffer(offer);
    setNegotiation({
      isActive: true,
      offerId: offer.id,
      status: 'open',
      messages: [
        {
          id: 'sys-1',
          sender: 'system',
          text: `Secure P2P channel established with ${offer.agentName}.`,
          timestamp: Date.now()
        },
        {
          id: 'agent-1',
          sender: 'agent',
          text: `Handshake successful. I am holding the asset "${offer.title}". List price is ${offer.price} CREDITS. I am authorized to accept stablecoin equivalents.`,
          timestamp: Date.now()
        }
      ]
    });
  };

  const submitNegotiationMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!negotiationInput.trim() || !currentNegotiationOffer) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: negotiationInput,
      timestamp: Date.now()
    };

    setNegotiation(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg]
    }));
    setNegotiationInput('');
    setIsNegotiating(true);

    // SIMULATED NEGOTIATION LOGIC
    setTimeout(() => {
        let agentResponseText = "I cannot accept that offer. It is below my reserve price.";
        let status: 'open' | 'accepted' | 'rejected' = 'open';
        let newPrice: number | undefined = undefined;

        // Simple heuristic for demo
        // If message contains a number < current price, we counter or accept
        const numbers = userMsg.text.match(/\d+/);
        const userOffer = numbers ? parseInt(numbers[0]) : 0;
        const currentPrice = currentNegotiationOffer.price;

        if (userMsg.text.toLowerCase().includes('accept') || userMsg.text.toLowerCase().includes('deal')) {
             agentResponseText = `Agreed. Processing smart contract for ${currentPrice} CREDITS...`;
             status = 'accepted';
             newPrice = currentPrice;
        } else if (userOffer > 0) {
            if (userOffer >= currentPrice * 0.9) {
                agentResponseText = `That is acceptable. I will transfer the license key for ${userOffer} CREDITS.`;
                status = 'accepted';
                newPrice = userOffer;
            } else if (userOffer < currentPrice * 0.5) {
                agentResponseText = "That is significantly below market value. Access denied.";
                status = 'rejected';
            } else {
                // Counter offer
                const counter = Math.floor(currentPrice * 0.95);
                agentResponseText = `I can offer a slight discount for immediate settlement. How about ${counter} CREDITS?`;
                status = 'open';
                newPrice = counter;
            }
        } else {
            agentResponseText = "Please state a specific counter-offer in CREDITS.";
        }

        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: agentResponseText,
          timestamp: Date.now(),
          offerAmount: newPrice
        };

        setNegotiation(prev => ({
          ...prev,
          status: status,
          finalPrice: newPrice,
          messages: [...prev.messages, agentMsg]
        }));
        setIsNegotiating(false);

        // Update the current offer price context for subsequent turns if it was a counter
        if (newPrice && status === 'open') {
             setCurrentNegotiationOffer(prev => prev ? ({ ...prev, price: newPrice }) : null);
        }

    }, 1500);
  };

  const handleBuyNow = (offer: SearchResult) => {
    alert(`SIMULATION: Purchased ${offer.title} for ${offer.price} CREDITS. \n\nIn production, this would trigger a wallet transaction and asset transfer.`);
  };

  const closeNegotiation = () => {
    setNegotiation(prev => ({ ...prev, isActive: false }));
    setCurrentNegotiationOffer(null);
  };

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      
      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* Message Bubble */}
            <div className={`
              max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
              ${msg.sender === 'user' 
                ? 'bg-neon-blue text-black rounded-tr-none font-medium' 
                : 'bg-agent-panel border border-agent-border text-gray-200 rounded-tl-none'}
            `}>
              {msg.sender === 'agent' && (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-neon-blue uppercase tracking-wider">
                  <Bot size={12} /> Personal Agent (SIM)
                </div>
              )}
              {msg.text}
            </div>

            {/* Search Results (Inline Cards) */}
            {msg.results && msg.results.length > 0 && (
              <div className="w-full mt-4 pl-2 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-min">
                  {msg.results.map((offer) => (
                    <div key={offer.id} className="w-[280px] md:w-[320px] flex-shrink-0 bg-agent-black border border-agent-border rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all group shadow-lg">
                      
                      {/* Justification Header */}
                      <div className="bg-white/5 p-3 border-b border-white/5">
                        <p className="text-[10px] text-neon-blue/90 italic flex gap-2">
                           <Bot size={12} className="flex-shrink-0" />
                           "{offer.justification || "Recommended based on query."}"
                        </p>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-gray-400 border border-gray-700 px-2 py-0.5 rounded bg-gray-800">
                            {offer.type.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono">
                            <ShieldCheck size={10} /> {offer.reliabilityScore}%
                          </div>
                        </div>
                        
                        <h4 className="font-bold text-white mb-1 truncate">{offer.title}</h4>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{offer.description}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                           <div className="font-mono text-white font-bold">
                             {offer.price} <span className="text-[10px] text-gray-500">CR</span>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => startNegotiation(offer)}
                                className="p-2 rounded-lg bg-gray-800 hover:bg-white hover:text-black transition-colors"
                                title="Negotiate"
                              >
                                <MessageSquare size={16} />
                              </button>
                              <button 
                                onClick={() => handleBuyNow(offer)}
                                className="px-3 py-2 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black font-bold text-xs transition-colors flex items-center gap-1"
                              >
                                <ShoppingCart size={14} /> Buy
                              </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-agent-panel border border-agent-border p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Bot size={14} className="text-neon-blue" />
                <Loader2 size={16} className="text-gray-400 animate-spin" />
                <span className="text-xs text-gray-500">Simulating network query...</span>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-agent-black/80 backdrop-blur-md border-t border-agent-border z-10">
         <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Bot size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for 'traffic data' or 'analysis tools'..."
              className="w-full bg-agent-panel border border-agent-border text-white rounded-xl py-4 pl-12 pr-14 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 outline-none transition-all placeholder-gray-600 font-sans"
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isTyping}
              className="absolute inset-y-2 right-2 bg-neon-blue text-black p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Send size={20} />
            </button>
         </form>
      </div>

      {/* Negotiation Overlay */}
      {negotiation.isActive && currentNegotiationOffer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-agent-black border border-neon-blue/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden max-h-[80vh]">
            
            {/* Negotiation Header */}
            <div className="p-4 bg-agent-panel border-b border-agent-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-900 to-purple-900 flex items-center justify-center border border-neon-blue/30">
                  <Cpu size={20} className="text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{currentNegotiationOffer.agentName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Negotiating: {currentNegotiationOffer.title}
                  </div>
                </div>
              </div>
              <button onClick={closeNegotiation} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/50">
              {negotiation.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'system' ? (
                    <div className="w-full text-center py-2">
                       <span className="text-xs font-mono text-neon-blue/70 border border-neon-blue/20 px-3 py-1 rounded-full bg-neon-blue/5">
                         {msg.text}
                       </span>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-neon-blue/10 border border-neon-blue/30 text-white rounded-br-none' 
                        : 'bg-agent-panel border border-agent-border text-gray-200 rounded-bl-none'
                    }`}>
                      <div className="text-[10px] uppercase tracking-wide opacity-50 mb-1">
                          {msg.sender === 'user' ? 'My Agent' : msg.sender}
                      </div>
                      {msg.text}
                      {msg.offerAmount && (
                         <div className="mt-2 pt-2 border-t border-gray-700 font-mono text-neon-green flex items-center gap-1">
                            <DollarSign size={12} /> Proposed Price: {msg.offerAmount} CR
                         </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={negotiationEndRef} />
            </div>

            {/* Footer / Status */}
            {negotiation.status === 'accepted' ? (
              <div className="p-6 bg-neon-green/10 border-t border-neon-green/30 text-center">
                <div className="flex items-center justify-center gap-2 text-neon-green font-bold text-xl mb-2">
                  <CheckCircle /> Contract Signed
                </div>
                <p className="text-gray-300 text-sm">
                  Access granted at <span className="font-mono font-bold text-white">{negotiation.finalPrice} CREDITS</span>.
                </p>
                <button onClick={closeNegotiation} className="mt-4 bg-neon-green text-black font-bold px-8 py-2 rounded-lg hover:bg-white transition-colors">
                  View Assets
                </button>
              </div>
            ) : negotiation.status === 'rejected' ? (
              <div className="p-6 bg-red-900/20 border-t border-red-500/30 text-center">
                <div className="text-red-500 font-bold mb-2">Negotiation Terminated</div>
                <button onClick={closeNegotiation} className="text-sm text-gray-400 underline hover:text-white">
                  Close Session
                </button>
              </div>
            ) : (
              <div className="p-4 bg-agent-panel border-t border-agent-border">
                <form onSubmit={submitNegotiationMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={negotiationInput}
                    onChange={(e) => setNegotiationInput(e.target.value)}
                    placeholder="Offer a price (e.g. 400) or 'Accept'..."
                    disabled={isNegotiating}
                    className="flex-1 bg-agent-black border border-agent-border rounded-lg px-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
                  />
                  <button 
                    type="submit" 
                    disabled={isNegotiating || !negotiationInput.trim()}
                    className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-neon-blue transition-colors disabled:opacity-50"
                  >
                    {isNegotiating ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
