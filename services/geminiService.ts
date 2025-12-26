
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Initialize using a named parameter and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSdvRequirements = async (userInput: string) => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class Automotive Systems Engineer. 
    Transform the following high-level requirement into a detailed SDV (Software Defined Vehicle) Service-Oriented Architecture specification.
    
    User Input: ${userInput}
    
    Format the output in professional Markdown with these sections:
    1. Functional Requirements (ID: FR-001 onwards)
    2. Non-Functional Requirements (ID: NFR-001 onwards) - focus on MISRA C++, ISO 26262 ASIL ratings, and Latency.
    3. Service Interface Definition (IDL): Define the types, methods, and SOME/IP events.
    4. Diagnostics Strategy: Explain how DTCs (Diagnostic Trouble Codes) are handled.`,
    config: {
      temperature: 0.7,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 1000 }
    }
  });
  return response.text;
};

export const generateSdvCode = async (requirements: string) => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are an expert C++ Embedded Engineer specializing in Automotive MISRA C++:2023.
    Based on the following requirements, generate a production-grade C++ header and implementation file.
    
    Requirements: ${requirements}
    
    The code MUST:
    - Follow MISRA C++:2023 guidelines.
    - Be designed for a Service-Oriented Architecture (SOA).
    - Use efficient memory management (no raw pointers).
    - Include a thread-safe diagnostic manager.
    - Include a mock environment for SOME/IP messaging.
    
    Return ONLY the code within a single markdown block.`,
    config: {
      temperature: 0.3,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

export const generateUnitTests = async (sourceCode: string) => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate Google Test (gTest) C++ unit tests for the following source code. 
    Include edge cases for sensor failure and out-of-bounds telemetry.
    
    Source: ${sourceCode}`,
    config: {
      temperature: 0.2
    }
  });
  return response.text;
};

export const startLiveAssistantSession = async (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      // responseModalities must be an array with exactly one Modality.AUDIO element
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are the 'Gemini Automotive Copilot'. You help engineers diagnose vehicle faults in real-time. You have access to sensor data logs. Keep your answers technical but helpful."
    }
  });
};
