import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface OwlPostItem {
  id: string;
  type: 'change' | 'deadline';
  title: string;
  description: string;
  timestamp: Date;
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';
}

interface OwlPostProps {
  isOpen: boolean;
  onClose: () => void;
  changes: OwlPostItem[];
}

const OwlPost: React.FC<OwlPostProps> = ({ isOpen, onClose, changes }) => {
  const [filteredChanges, setFilteredChanges] = useState<OwlPostItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      // Get last 200 changes and deadlines within 14 days
      const recentChanges = changes
        .filter(item => 
          item.type === 'change' || 
          (item.type === 'deadline' && item.dueDate && item.dueDate <= twoWeeksFromNow)
        )
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 200);
      
      setFilteredChanges(recentChanges);
    }
  }, [isOpen, changes]);

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Overdue';
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays <= 7) return `Due in ${diffInDays} days`;
    
    return `Due ${date.toLocaleDateString()}`;
  };

  const getPriorityIcon = (priority?: string, type?: string) => {
    if (type === 'deadline') {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-hufflepuff-gold" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] parchment-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🦉</span>
              <span className="font-magical text-xl">Owl Post</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-hufflepuff-gold/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent changes and upcoming deadlines
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-3">
              {filteredChanges.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🦉</span>
                  <h3 className="font-semibold text-lg mb-2">No Messages</h3>
                  <p className="text-muted-foreground">
                    Your owl hasn't delivered any messages yet. Start working on your goals to see updates here!
                  </p>
                </div>
              ) : (
                filteredChanges.map((item) => (
                  <Card key={item.id} className="bg-background/50 border border-border/50 hover:bg-background/70 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {getPriorityIcon(item.priority, item.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {item.title}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatRelativeTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          {item.type === 'deadline' && item.dueDate && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300">
                                {formatDueDate(item.dueDate)}
                              </span>
                            </div>
                          )}
                          {item.type === 'change' && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                                Change
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwlPost;