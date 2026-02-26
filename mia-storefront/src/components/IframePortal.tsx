import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface IframePortalProps {
  width?: number;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
}

export default function IframePortal({ width = 430, height = 800, className, children }: IframePortalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      // Reset body styles
      doc.body.style.margin = '0';
      doc.body.style.background = 'transparent';

      // Clone styles from parent document (Tailwind/global)
      const parentHead = document.head;
      const iframeHead = doc.head;

      // Copy <link rel="stylesheet"> and <style> tags
      parentHead.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        iframeHead.appendChild(clone);
      });

      setPortalTarget(doc.body);
      setMounted(true);
    };

    // If already loaded, call immediately; else wait for load
    if (iframe.contentDocument?.readyState === 'complete') {
      onLoad();
    } else {
      iframe.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', onLoad);
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{ width, height, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 0, background: 'transparent' }}
      className={className}
      title="Mobile Preview"
    >
      {mounted && portalTarget ? ReactDOM.createPortal(children, portalTarget) : null}
    </iframe>
  );
}
