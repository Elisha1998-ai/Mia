"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description 
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[150]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-background border border-border-custom rounded-2xl z-[151] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <Dialog.Title className="text-lg font-bold text-foreground mb-2">
              {title}
            </Dialog.Title>
            
            <Dialog.Description className="text-sm text-foreground/60 leading-relaxed">
              {description}
            </Dialog.Description>
          </div>

          <div className="p-4 border-t border-border-custom bg-foreground/[0.02] flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
