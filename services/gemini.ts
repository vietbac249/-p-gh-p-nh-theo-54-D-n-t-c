
import { GoogleGenAI } from "@google/genai";

export async function generatePhoto(
  base64Images: string[],
  location: string,
  costume: string
): Promise<string> {
  // Always use the named parameter and direct process.env.API_KEY reference without fallback.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We use the first image as the primary reference for editing
  // If multiple are provided, we'll try to include them in the description
  const primaryImage = base64Images[0].split(',')[1];
  
  const prompt = `
    Task: Professional Photo Merging and Style Transfer.
    Subject: The person/people in the provided image.
    Destination: ${location}.
    Attire: Traditional ${costume} ethnic clothing of Vietnam.
    Instructions: 
    1. Realistic composite: Seamlessly place the person from the image into a high-quality, cinematic photo of ${location}.
    2. Ethnic Makeover: Dress them in highly detailed, authentic ${costume} traditional attire. 
    3. Lighting: Ensure the lighting on the subject matches the ambient lighting of ${location}.
    4. Quality: 4k resolution, professional photography style, vibrant colors, sharp focus on the subject.
    5. Authenticity: The background ${location} should be recognizable and beautiful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: primaryImage,
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
    });

    // Iterate through response parts to find the image data as recommended.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data received from API");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
