
import { GoogleGenAI, GenerateContentResponse, Modality, Type, VideosOperation } from "@google/genai";
import { AspectRatio, GeneratedMedia } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Image Generation
export const generateNewImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio,
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  }
  throw new Error("Image generation failed to produce an image.");
};


// Image Editing
export const editImage = async (
  prompt: string,
  baseImage: string,
  baseImageMimeType: string,
  blendImage: string | null,
  blendImageMimeType: string | null
): Promise<GeneratedMedia> => {

  const parts: any[] = [
    { inlineData: { data: baseImage, mimeType: baseImageMimeType } },
    { text: prompt },
  ];

  if (blendImage && blendImageMimeType) {
    parts.push({ inlineData: { data: blendImage, mimeType: blendImageMimeType } });
  }
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts: parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  let generatedText: string | null = null;
  let generatedImage: string | null = null;
  let mimeType: string = 'image/png';

  for (const part of response.candidates[0].content.parts) {
      if (part.text) {
          generatedText = part.text;
      } else if (part.inlineData) {
          generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          mimeType = part.inlineData.mimeType;
      }
  }

  if (generatedImage) {
    return {
      id: `edit-${Date.now()}`,
      src: generatedImage,
      type: 'image',
      text: generatedText,
      mimeType: mimeType,
    };
  }

  throw new Error("Image editing failed to produce an image.");
};

// Video Generation
export const generateVideo = async (
  prompt: string,
  baseImage: string | null,
  baseImageMimeType: string | null
): Promise<VideosOperation> => {
  const requestPayload: any = {
    model: 'veo-2.0-generate-001',
    prompt,
    config: { numberOfVideos: 1 }
  };

  if (baseImage && baseImageMimeType) {
    requestPayload.image = {
      imageBytes: baseImage,
      mimeType: baseImageMimeType
    };
  }

  return await ai.models.generateVideos(requestPayload);
};

export const checkVideoStatus = async (operation: VideosOperation): Promise<VideosOperation> => {
    return await ai.operations.getVideosOperation({ operation: operation });
}

// Text Tasks
export const translateText = async (text: string, targetLang: 'en' | 'pt-br'): Promise<string> => {
    const prompt = `Translate the following text to ${targetLang === 'en' ? 'English' : 'Brazilian Portuguese'}. Return only the translated text, with no additional commentary or formatting.\n\nText: "${text}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text.trim();
};

export const buildCreativePrompt = async (keywords: string): Promise<string> => {
    const prompt = `You are a creative assistant for an AI image generator. Your task is to expand a list of simple keywords into a rich, detailed, and artistic prompt. The prompt should be a single, cohesive paragraph.

    Keywords provided:
    ${keywords}
    
    Now, generate a creative and detailed prompt based on these keywords.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text.trim();
}
