
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with the apiKey from process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLoveLetter = async (tone: string, recipient: string, memories: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a beautiful, deeply romantic Valentine's Day love letter. 
  Tone: ${tone}
  Recipient: ${recipient}
  Shared Memories/Details: ${memories}
  
  The letter should be poetic and heartfelt. Do not include placeholders like [Your Name]. Just provide the text of the letter.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.9,
    }
  });

  return response.text || "My dearest, my heart overflows with love for you...";
};

export const planDate = async (latitude: number | null, longitude: number | null, mood: string): Promise<{ text: string, sources: any[] }> => {
  const ai = getAI();
  const locationContext = latitude && longitude ? `Current Location: ${latitude}, ${longitude}` : "Location unknown, suggest general ideas";
  
  const prompt = `Plan a perfect Valentine's Day date for a ${mood} mood. 
  ${locationContext}
  Use Google Search to find real, specific restaurants, parks, or events that are currently trending or highly rated. 
  Provide a detailed itinerary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  return {
    text: response.text || "Enjoy a candlelit dinner and a moonlit walk.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const visualizeGift = async (description: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A professional, high-quality photograph of a unique Valentine's Day gift: ${description}. The lighting is warm and cinematic, presented on a soft velvet surface with rose petals around it.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      imageUrl = `data:image/png;base64,${base64EncodeString}`;
      break;
    }
  }
  return imageUrl;
};

export const analyzePhoto = async (base64Image: string, partnerName: string): Promise<string> => {
  const ai = getAI();
  // Remove the data:image/jpeg;base64, prefix if present
  const base64Data = base64Image.split(',')[1] || base64Image;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        },
        {
          text: `This is a photo of me and my partner ${partnerName}. Please write a short, 1-2 sentence poetic and deeply romantic caption for this photo. Focus on the feeling of the moment shown.`
        }
      ]
    },
    config: {
      temperature: 1,
    }
  });

  return response.text || "A moment captured, a lifetime of love to go.";
};
