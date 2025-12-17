import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, KnowledgeDoc, MessageRole, UserProfile } from "../types";

// Initialize the client. 
// Note: In a real app, never expose API keys on the client. 
// This is for demonstration using the provided environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_TEMPLATE = (profile: UserProfile, contextDocs: string) => `
You are VitalSync, an advanced, personalized health and wellness assistant.
Your goal is to provide accurate, empathetic, and actionable health advice based on the user's personal context.

USER PROFILE:
Name: ${profile.name}
Age: ${profile.age}
Weight: ${profile.weight}kg
Height: ${profile.height}cm
Goal: ${profile.goal}

PERSONAL KNOWLEDGE BASE (CONTEXT):
${contextDocs ? contextDocs : "No specific personal documents provided yet."}

INSTRUCTIONS:
1. Use the "PERSONAL KNOWLEDGE BASE" to answer user queries specifically. This is a RAG (Retrieval Augmented Generation) system.
2. If the user asks about their blood reports, diet plans, or history, prioritize information from the context above.
3. If the answer is not in the context, use your general medical and wellness knowledge, but clearly state that you are giving general advice.
4. Always maintain a professional, supportive, and encouraging tone.
5. Provide concise answers. Use markdown for formatting (lists, bold text).
6. IMPORTANT: You are an AI, not a doctor. If a symptom sounds serious, advise the user to see a professional immediately.

Formatting:
- Use bullet points for lists.
- Bold key terms.
- Keep paragraphs short.
`;

export const streamChatResponse = async (
  history: ChatMessage[],
  docs: KnowledgeDoc[],
  profile: UserProfile,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    // 1. Prepare RAG Context
    // In a full production app, we would use embeddings to find the most relevant docs.
    // For this client-side demo, we will inject all active docs into the context window 
    // (Gemini's large context window handles this well for personal use cases).
    const contextString = docs.map(d => `[${d.category.toUpperCase()}] ${d.title}: ${d.content}`).join('\n\n');

    // 2. Prepare System Instruction
    const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE(profile, contextString);

    // 3. Format History for Gemini
    // We only take the last 10 messages to keep it focused, though Gemini handles more.
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // 4. Create Chat Session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balanced creativity and accuracy
      },
      history: recentHistory.slice(0, -1) // All but the last one, which is the new message
    });

    const lastMessage = recentHistory[recentHistory.length - 1].parts[0].text;

    // 5. Send Stream
    const resultStream = await chat.sendMessageStream({ message: lastMessage });
    
    let fullText = '';
    for await (const chunk of resultStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = "I'm having trouble connecting to the service right now. Please try again later.";
    onChunk(errorMessage);
    return errorMessage;
  }
};

export const generateHealthTip = async (profile: UserProfile, docs: KnowledgeDoc[]): Promise<string> => {
    try {
        const contextString = docs.map(d => `[${d.category}] ${d.title}: ${d.content}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a single, short, personalized health tip (max 1 sentence) for ${profile.name} based on their goal: "${profile.goal}" and this context: ${contextString.slice(0, 500)}...`,
        });
        return response.text || "Drink more water today!";
    } catch (e) {
        return "Stay active and hydrated today!";
    }
}
