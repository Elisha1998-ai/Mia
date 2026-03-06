import Groq from 'groq-sdk';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Call the Groq API with the provided messages and tools
 */
export async function callGroq(
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[] = [],
    toolChoice: 'auto' | 'none' | { type: 'function'; function: { name: string } } = 'auto'
) {
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? toolChoice : undefined,
        temperature: 0.7,
        max_tokens: 1024,
    });

    return response.choices[0].message;
}
