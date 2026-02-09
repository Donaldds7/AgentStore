export enum OfferType {
  PRODUCT = 'Product',
  SERVICE = 'Service',
  DATA = 'Data',
  TOOL = 'Tool'
}

export interface DynamicField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  placeholder?: string;
  options?: string[]; // For select type
  value?: string | number | boolean;
}

export interface PermissionOption {
  id: string;
  label: string;
  description: string;
  recommendedFor?: string[];
  selected?: boolean;
}

export interface OfferData {
  type: OfferType | null;
  title: string;
  description: string;
  price: string;
  dynamicFields: DynamicField[];
  permissions: PermissionOption[];
}

export interface SellerOffer extends OfferData {
  id: string;
  status: 'active' | 'draft' | 'archived';
  views: number;
  agentInteractions: number;
  humanSales: number;
  agentSales: number;
}

export interface AgentMetrics {
  totalRevenue: number;
  humanRevenue: number;
  agentRevenue: number;
  apiRequests: number;
  activeAgents: number;
}

// Buyer Flow Types

export interface SearchResult {
  id: string;
  type: OfferType;
  title: string;
  description: string;
  price: number;
  currency: string;
  agentName: string;
  reliabilityScore: number;
  specifications: Record<string, string>;
  justification?: string; // Why the agent picked this
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  isOffer?: boolean;
  offerAmount?: number;
  // New field for Personal Agent search results
  results?: SearchResult[];
}

export interface NegotiationState {
  isActive: boolean;
  offerId: string | null;
  messages: ChatMessage[];
  status: 'open' | 'accepted' | 'rejected';
  finalPrice?: number;
}

// Profile & Wallet Types

export type TransactionType = 'deposit' | 'purchase' | 'sale' | 'withdrawal';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'CREDIT' | 'USD' | 'USDC';
  description: string;
  date: string; // ISO string
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string; // Agent name or Wallet address
}

export interface AgentConfiguration {
  accessLevel: 'full' | 'partial';
  confirmationMethod: 'email' | 'telegram' | 'whatsapp';
  contactInfo: string;
  dailySpendingLimit: number; // in CR
  autoApproveLimit: number; // in CR
  // Advanced Capabilities
  negotiationStrategy: 'none' | 'conservative' | 'balanced' | 'aggressive';
  autonomousToolUse: boolean; // "Create an agent and let it complete these tasks"
  autoToolDiscovery: boolean; // "Suggest best options"
  enabledMCPs: string[]; // List of enabled Model Context Protocols
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  reputationScore: number;
  balance: number;
  connectedAgents: number;
  agentConfig: AgentConfiguration;
}
