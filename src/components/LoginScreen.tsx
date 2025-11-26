import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Users, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [memberId, setMemberId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!memberId.trim() || !pin.trim()) {
      setError('Please enter both Member ID and PIN');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(memberId.trim(), pin);
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "Login successful",
        });
      } else {
        setError('Invalid Member ID or PIN');
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center glow-primary">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Eldoret Technicians
            </h1>
            <p className="text-lg text-primary font-medium">
              Self Help Group
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass-card animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Member Login
            </CardTitle>
            <CardDescription>
              Enter your Member ID and PIN to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  type="text"
                  placeholder="Enter your Member ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="h-12 pr-12"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-muted-foreground"
              >
                Forgot PIN?
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-secondary/50 border-border/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Admin:</span> admin001 / 1234
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Chair:</span> chair001 / 5678
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Treasurer:</span> treas001 / 9012
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Member:</span> mem001 / 7890
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
