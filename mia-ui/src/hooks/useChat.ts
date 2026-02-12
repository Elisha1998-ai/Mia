import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const useChat = () => {
  const { data: session } = useSession();
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
        body: JSON.stringify({ 
          message: content,
          user_id: session?.user?.id 
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error (${response.status}): ${text}`);
      }

      const data = await response.json();
      
      const assistantMsg: any = { 
         role: 'assistant', 
         content: data.content,
         steps: data.steps,
         assets: data.assets,
         intent: data.intent,
         template_data: data.template_data,
         products: data.products,
         isComplete: !data.steps || data.steps.length === 0
       };

       if (data.widget) {
         assistantMsg.widgets = [{
           type: data.widget.type,
           title: data.widget.title,
           description: data.widget.content, // We map 'content' to 'description' for the markdown preview
           imageUrl: data.widget.imageUrl,
           link: data.widget.link,
           url: data.widget.url,
           storeName: data.widget.storeName
         }];
       } else if (data.widgets) {
         assistantMsg.widgets = data.widgets;
       }

       setMessages(prev => [...prev, assistantMsg]);
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

  const triggerDemoMode = () => {
    setIsLoading(true);
    
    // Simulate thinking state first
    setTimeout(() => {
      setIsLoading(false);
      
      const demoMessages = [
        {
          role: 'assistant',
          content: "I've started working on your request. Here's a checklist of what I'm doing:",
          steps: [
            "Analyzing your requirements",
            "Searching for design inspiration",
            "Generating layout options",
            "Finalizing the storefront wireframe"
          ],
          isComplete: false
        },
        {
          role: 'assistant',
          content: "I've also prepared some resources for you:",
          widgets: [
            {
              type: 'document',
              title: 'Project Brief',
              description: 'The initial requirements for your storefront design.'
            },
            {
              type: 'link',
              title: 'Design Inspiration',
              description: 'A curated list of modern ecommerce designs.',
              link: 'https://example.com'
            }
          ],
          isComplete: true
        }
      ];
      
      setMessages(demoMessages);
    }, 2000);
  };

  return { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode };
};
