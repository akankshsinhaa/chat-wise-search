import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ZoomRX AI..."
            className={cn(
              "min-h-[3rem] max-h-32 resize-none rounded-chat-radius",
              "bg-chat-input border-chat-border",
              "focus:ring-2 focus:ring-primary focus:border-transparent",
              "transition-all duration-200"
            )}
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          size="lg"
          disabled={!message.trim() || isLoading}
          className={cn(
            "rounded-chat-radius px-4 py-3 h-12",
            "bg-gradient-to-r from-primary to-primary-hover",
            "hover:shadow-lg hover:scale-105",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};