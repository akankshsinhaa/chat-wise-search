import { Message } from './ChatInterface';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot, Search } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover">
          <AvatarFallback className="bg-transparent text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "relative max-w-[80%] px-4 py-3 rounded-chat-radius transition-all duration-200",
        isUser 
          ? "bg-chat-user text-chat-user-foreground ml-auto" 
          : "bg-chat-ai border border-chat-border text-chat-ai-foreground"
      )}>
        {message.hasWebSearch && (
          <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
            <Search className="w-3 h-3" />
            Web search enabled
          </div>
        )}
        
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        <div className={cn(
          "text-xs mt-2 opacity-60",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 bg-secondary">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};