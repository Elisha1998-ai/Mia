import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface StoreBuilderMessage {
  role: 'user' | 'ai';
  text: string;
  widget?: StoreBuilderWidget | null;
  intent?: string;
  isTyping?: boolean;
}

export interface FontOption {
  id: string;
  name: string;
  heading: string;
  body: string;
  description: string;
}

export interface StoreBuilderWidget {
  type: 'font_picker' | 'store_preview' | 'progress';
  title?: string;
  description?: string;
  fonts?: FontOption[];
  url?: string;
  storeName?: string;
}

export const useStoreBuilder = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<StoreBuilderMessage[]>([
    {
      role: 'ai',
      text: "Hi! I'm Pony. Tell me what kind of store you want and I'll build it for you. You can be as brief or specific as you like.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [builtStoreUrl, setBuiltStoreUrl] = useState<string | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);

  // Stores the conversation history to send to the AI each turn
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  const PROGRESS_STEPS = [
    'Applying your branding tokens...',
    'Generating hero copy...',
    'Configuring storefront pages...',
    'Optimising for mobile and SEO...',
    'Activating your live store URL...',
  ];

  const sendMessage = useCallback(
    async (content: string, fontSelection?: string) => {
      const userText = fontSelection || content;
      if (!userText.trim()) return;

      // Add user message to UI
      const userMsg: StoreBuilderMessage = { role: 'user', text: userText };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Add a typing indicator
      setMessages((prev) => [...prev, { role: 'ai', text: '', isTyping: true }]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            user_id: session?.user?.id,
            history: history.slice(-10), // send last 10 turns for context
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Update conversation history
        setHistory((prev) => [
          ...prev,
          { role: 'user', content: userText },
          { role: 'assistant', content: data.content || '' },
        ]);

        // Remove typing indicator
        setMessages((prev) => prev.filter((m) => !m.isTyping));

        const aiMessage: StoreBuilderMessage = {
          role: 'ai',
          text: data.content || '',
          widget: data.widget || null,
          intent: data.intent,
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Handle [CONFIGURE_STORE] — start the progress animation
        if (data.intent === 'store_setup' && data.widget?.type === 'store_preview') {
          setIsBuilding(true);
          setBuildProgress(0);

          let step = 0;
          const interval = setInterval(() => {
            step++;
            setBuildProgress(step);
            if (step >= PROGRESS_STEPS.length) {
              clearInterval(interval);
              setIsBuilding(false);
              setBuiltStoreUrl(data.widget?.url || '/store');
            }
          }, 1800);
        }
      } catch (error) {
        console.error('StoreBuilder sendMessage error:', error);
        // Remove typing indicator and show error
        setMessages((prev) => prev.filter((m) => !m.isTyping));
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: "I hit a snag on my end. Could you try again?",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [session, history]
  );

  const handleFontSelection = useCallback(
    (font: FontOption) => {
      // When user picks a font from the widget, send it as a message.
      // Be very explicit so the AI recognises this as the final confirmed
      // FONT_PAIR requirement and immediately emits [CONFIGURE_STORE].
      sendMessage(
        `I've selected the ${font.name} font pair: heading font is ${font.heading}, body font is ${font.body}. ` +
        `That's my final choice — please go ahead and build the store now.`,
        undefined
      );
    },
    [sendMessage]
  );

  const reset = useCallback(() => {
    setMessages([
      {
        role: 'ai',
        text: "Hi! I'm Pony. Tell me what kind of store you want and I'll build it for you.",
      },
    ]);
    setHistory([]);
    setIsLoading(false);
    setIsBuilding(false);
    setBuiltStoreUrl(null);
    setBuildProgress(0);
  }, []);

  return {
    messages,
    isLoading,
    isBuilding,
    buildProgress,
    builtStoreUrl,
    PROGRESS_STEPS,
    sendMessage,
    handleFontSelection,
    reset,
  };
};
