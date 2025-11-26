import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Send, AlertTriangle, Info, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NotificationCenter: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>('info');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Notification Sent",
      description: `Your ${type} notification has been sent to all members`,
    });

    // Reset form
    setTitle('');
    setMessage('');
    setType('info');
    setIsSending(false);
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'urgent':
        return <Zap className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'border-accent/30 bg-accent/10';
      case 'urgent':
        return 'border-destructive/30 bg-destructive/10';
      default:
        return 'border-primary/30 bg-primary/10';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Send Notification
        </CardTitle>
        <CardDescription>
          Send announcements and messages to all group members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend} className="space-y-6">
          {/* Notification Type */}
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <Select value={type} onValueChange={(v: 'info' | 'warning' | 'urgent') => setType(v)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Information
                  </div>
                </SelectItem>
                <SelectItem value="warning">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent" />
                    Warning
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-destructive" />
                    Urgent
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
                <div className="flex items-start gap-3">
                  {getTypeIcon()}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {title || 'Notification Title'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {message || 'Your message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <Button 
            type="submit" 
            size="xl" 
            className="w-full"
            disabled={isSending}
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send to All Members
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
