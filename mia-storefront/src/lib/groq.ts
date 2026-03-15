import Groq from 'groq-sdk';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const FALLBACK_MODELS = [
    'llama-3.3-70b-versatile',
    'llama3-70b-8192',
    'mixtral-8x7b-32768',
    'llama-3.1-8b-instant'
];

/**
 * Call the Groq API with the provided messages and tools
 */
export async function callGroq(
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[] = [],
    toolChoice: 'auto' | 'none' | { type: 'function'; function: { name: string } } = 'auto'
) {
    let lastError: any;

    for (const model of FALLBACK_MODELS) {
        try {
            const response = await groq.chat.completions.create({
                model,
                messages,
                tools: tools.length > 0 ? tools : undefined,
                tool_choice: tools.length > 0 ? toolChoice : undefined,
                temperature: 0.7,
                max_tokens: 1024,
            });

            return response.choices[0].message;
        } catch (error: any) {
            console.warn(`Groq model ${model} failed, trying next. Error:`, error?.message || error);
            lastError = error;
        }
    }

    throw lastError;
}
