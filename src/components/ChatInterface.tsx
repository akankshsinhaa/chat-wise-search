import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasWebSearch?: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      hasWebSearch: webSearchEnabled
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('chat-with-claude', {
        body: { 
          message: content,
          webSearchEnabled 
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response');
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date(),
        hasWebSearch: data.hasWebSearch,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Web Search Toggle */}
        <div className="px-4 py-3 border-b border-chat-border">
          <Button
            variant={webSearchEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Web Search
            {webSearchEnabled && <Sparkles className="w-4 h-4" />}
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to ZoomRX Project Starter Kit</h2>
              <p className="text-muted-foreground max-w-md">
                Start a conversation with Claude. Toggle web search to get current information from the internet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-chat-ai border border-chat-border rounded-chat-radius px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Claude is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-chat-border bg-background">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};