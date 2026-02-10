import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/chat-api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error (${response.status}): ${text}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
         role: 'assistant', 
         content: data.content,
         steps: data.steps,
         assets: data.assets,
         intent: data.intent,
         template_data: data.template_data,
         products: data.products,
         isComplete: !data.steps || data.steps.length === 0
       }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please make sure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageComplete = (idx: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === idx ? { ...msg, isComplete: true } : msg
    ));
  };

  return { messages, sendMessage, isLoading, markMessageComplete };
};
