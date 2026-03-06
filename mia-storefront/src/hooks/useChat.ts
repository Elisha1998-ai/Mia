import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/hooks/useData';

export const useChat = () => {
  const { data: session } = useSession();
  const { settings } = useSettings();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call the new Seller Admin AI route
      const response = await fetch('/api/chat/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          shopSlug: settings?.storeDomain
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error (${response.status}): ${text}`);
      }

      const data = await response.json();

      const assistantMsg: any = {
        role: 'assistant',
        content: data.message || data.content || "Done!",
        isComplete: true
      };

      if (data.widget) {
        assistantMsg.widgets = [{
          type: data.widget.type,
          title: data.widget.title,
          description: data.widget.description || data.widget.content, // Map description or content
          imageUrl: data.widget.imageUrl,
          link: data.widget.link,
          url: data.widget.url,
          storeName: data.widget.storeName,
          product: data.widget.product,
          prefilled: data.widget.prefilled,
          fonts: data.widget.fonts
        }];
      } else if (data.widgets) {
        assistantMsg.widgets = data.widgets;
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Network hiccup. I’ll reconnect. If this keeps happening, check the backend." }]);
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
