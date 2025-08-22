import { Button } from "@/components/ui/button";
import { Sparkles, Github, Settings } from 'lucide-react';

export const ChatHeader = () => {
  return (
    <header className="border-b border-chat-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">ZoomRX Project Starter Kit</h1>
            <p className="text-xs text-muted-foreground">AI Assistant with Web Search</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};