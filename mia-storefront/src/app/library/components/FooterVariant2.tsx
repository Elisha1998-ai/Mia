import React from 'react';
import { EditableText } from '@/components/EditableText';

export interface FooterProps {
  storeName?: string;
  settings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    footerDescription?: string;
    footerBigText?: string;
  };
  onUpdateSettings?: (key: string, value: string) => void;
}

export default function FooterVariant2({ storeName = "LINOGE", settings, onUpdateSettings }: FooterProps) {
  const primaryColor = settings?.primaryColor || "#000000";
  const headingFont = settings?.headingFont || "inherit";
  const bodyFont = settings?.bodyFont || "inherit";

  return (
    <footer className="bg-black text-white py-16 px-8" style={{ fontFamily: bodyFont }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Left Column */}
        <div className="max-w-md">
          <h3 className="text-2xl font-bold uppercase mb-4 tracking-wide" style={{ fontFamily: headingFont, color: primaryColor !== '#000000' ? primaryColor : 'white' }}>Get in touch with {storeName}</h3>
          
          {onUpdateSettings ? (
            <EditableText
              initialValue={settings?.footerDescription || 'Contact us and our managers will be happy to answer all your questions.'}
              onSave={(val) => onUpdateSettings('footerDescription', val)}
              tagName="p"
              className="text-gray-400 text-sm mb-8 leading-relaxed"
              multiline
            />
          ) : (
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {settings?.footerDescription || 'Contact us and our managers will be happy to answer all your questions.'}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-300">
            <p className="uppercase tracking-wider font-bold text-white mb-2" style={{ fontFamily: headingFont }}>Socials</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>

        {/* Right Column - Big Typography */}
        <div className="flex-1 text-left md:text-right">
          {onUpdateSettings ? (
            <EditableText
              initialValue={settings?.footerBigText || 'Create Your\nOwn Unique\nLook'}
              onSave={(val) => onUpdateSettings('footerBigText', val)}
              tagName="h2"
              className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter whitespace-pre-line"
              style={{ fontFamily: headingFont }}
              multiline
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter whitespace-pre-line" style={{ fontFamily: headingFont }}>
              {settings?.footerBigText || 'Create Your\nOwn Unique\nLook'}
            </h2>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
