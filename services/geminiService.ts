import { GoogleGenAI, Type } from "@google/genai";
import { DynamicField, PermissionOption, OfferType, SearchResult, ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

export const generateOfferFields = async (offerTitle: string, offerType: OfferType): Promise<DynamicField[]> => {
  try {
    const prompt = `
      Generate a list of technical form fields required to describe a ${offerType} specifically for: "${offerTitle}".
      Imagine this is for an API marketplace where agents purchase access.
      Include specific fields like versioning, data limits, latency guarantees, or format types if relevant.
      Return a maximum of 5 most critical fields.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              label: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['text', 'number', 'boolean', 'select'] },
              placeholder: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['name', 'label', 'type']
          }
        }
      }
    });

    const json = response.text ? JSON.parse(response.text) : [];
    return json;
  } catch (error) {
    console.error("Error generating fields:", error);
    // Fallback if API fails or key is missing
    return [
      { name: "version", label: "Version", type: "text", placeholder: "e.g., v1.0.0" },
      { name: "license", label: "License Type", type: "text", placeholder: "e.g., MIT, Commercial" }
    ];
  }
};

export const suggestPermissions = async (offerType: OfferType, description: string): Promise<PermissionOption[]> => {
  try {
    const prompt = `
      Suggest 4 distinct access permission configurations for an AI agent purchasing a ${offerType}.
      The context is: "${description}".
      Examples of permissions: 'Unlimited Inference', 'Training Data Only', 'Read-Only Access', 'Commercial Derivative Use'.
      Make them sound technical and precise for an agent contract.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendedFor: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['id', 'label', 'description']
          }
        }
      }
    });

    const json = response.text ? JSON.parse(response.text) : [];
    return json.map((item: any) => ({ ...item, selected: false }));
  } catch (error) {
    console.error("Error generating permissions:", error);
    return [
      { id: "p1", label: "Standard Usage", description: "Standard API limits apply.", selected: false },
      { id: "p2", label: "High Frequency", description: "Allowed for high-frequency trading bots.", selected: false }
    ];
  }
};

export const searchMarketplace = async (query: string): Promise<SearchResult[]> => {
  try {
    const prompt = `
      Generate 3 distinct "Agentic Marketplace Offers" that would be relevant results for this user query: "${query}".
      
      The user is asking their personal agent to find these resources.
      Return a JSON array. 
      For each offer include:
      - id (random string)
      - type (Product, Service, Data, Tool) - infer from query
      - title (futuristic and technical)
      - description (brief, marketing pitch to an agent)
      - price (number, roughly 0.001 to 100)
      - currency (always "CREDIT")
      - agentName (name of the selling agent, e.g., "DeepMind_Sales_Bot_v9")
      - reliabilityScore (number 70-100)
      - specifications (an object with 2-3 key-value pairs of relevant technical specs like latency, format, size)
      - justification (A short sentence explaining why this offer was selected for the user, e.g., "Best price-performance ratio for your request.")
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Product', 'Service', 'Data', 'Tool'] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              agentName: { type: Type.STRING },
              reliabilityScore: { type: Type.NUMBER },
              specifications: { type: Type.OBJECT },
              justification: { type: Type.STRING }
            },
            required: ['id', 'title', 'price', 'agentName']
          }
        }
      }
    });

    const json = response.text ? JSON.parse(response.text) : [];
    return json;
  } catch (error) {
    console.error("Error searching marketplace:", error);
    return [];
  }
};

export const chatWithPersonalAgent = async (
  userMessage: string,
  history: ChatMessage[]
): Promise<{ text: string; searchQuery?: string }> => {
  try {
    // We only take the last few messages to save tokens and keep context relevant
    const recentHistory = history.slice(-5).map(h => `${h.sender}: ${h.text}`).join('\n');

    const prompt = `
      You are "Nexus", an advanced Personal AI Agent for a human user. 
      You operate in a futuristic "Agentic Storefront" where you help the user find, buy, and negotiate for AI Assets (Data, Services, Tools).
      
      Analyze the User's Message.
      If the user is asking to find, search, buy, or look for something (e.g., "I need a dataset", "Find me a python tool"), you MUST return a 'searchQuery' to query the marketplace.
      If the user is just chatting, return null for 'searchQuery'.
      
      Return JSON:
      {
        "response": "Your conversational response to the user. Be concise, professional, and helpful.",
        "searchQuery": "The specific search query string if intent is to find/search. Otherwise null."
      }

      History:
      ${recentHistory}
      User: ${userMessage}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            searchQuery: { type: Type.STRING } // Nullable in schema effectively means optional or string
          },
          required: ['response']
        }
      }
    });

    const json = response.text ? JSON.parse(response.text) : { response: "I'm processing that..." };
    return {
      text: json.response,
      searchQuery: json.searchQuery || undefined
    };

  } catch (error) {
    console.error("Error chatting with agent:", error);
    return { text: "I'm having trouble connecting to the Nexus network right now." };
  }
};

export const negotiatePrice = async (
  offerDetails: SearchResult, 
  userMessage: string, 
  history: ChatMessage[]
): Promise<{ status: 'open' | 'accepted' | 'rejected', message: string, newPrice?: number }> => {
  try {
    const prompt = `
      Act as a sales agent named "${offerDetails.agentName}" selling "${offerDetails.title}" priced at ${offerDetails.price} CREDITS.
      
      The user (represented by their agent) says: "${userMessage}".
      
      Conversation History:
      ${history.map(h => `${h.sender}: ${h.text}`).join('\n')}
      
      Your goal is to get the best price but you can offer up to a 20% discount if the user gives a good reason (e.g., bulk purchase, academic use).
      
      Decide to:
      1. ACCEPT (if the user's offer is reasonable)
      2. REJECT (if the offer is too low)
      3. COUNTER (offer a different price or explain value)
      
      Return JSON:
      {
        "status": "open" | "accepted" | "rejected",
        "message": "Your response text to the buyer agent",
        "newPrice": number (optional, if you are making a counter offer or accepting a price)
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['open', 'accepted', 'rejected'] },
            message: { type: Type.STRING },
            newPrice: { type: Type.NUMBER }
          },
          required: ['status', 'message']
        }
      }
    });

    const json = response.text ? JSON.parse(response.text) : { status: 'open', message: "I didn't catch that." };
    return json;
  } catch (error) {
    console.error("Error negotiating:", error);
    return { status: 'open', message: "Connection unstable. Please repeat your offer." };
  }
};
