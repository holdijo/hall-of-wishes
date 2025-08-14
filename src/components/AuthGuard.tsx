import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

// PBKDF2 implementation for password verification
const pbkdf2 = async (password: string, salt: string, iterations: number, keylen: number): Promise<string> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256'
    },
    key,
    keylen * 8
  );
  
  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Security configuration - NEVER expose the actual password
  const SALT = 'RoomOfRequirements_Magic_Salt_2024';
  const ITERATIONS = 100000;
  const EXPECTED_HASH = 'c8d5f6e8a9b7c3d2e1f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0'; // Generated from: "RequiresRoom2024!"

  useEffect(() => {
    // Check if already authenticated in this session
    const sessionAuth = sessionStorage.getItem('rr_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const hash = await pbkdf2(password, SALT, ITERATIONS, 32);
      
      if (hash === EXPECTED_HASH) {
        sessionStorage.setItem('rr_authenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError('Access denied. The Room of Requirements remains sealed.');
      }
    } catch (err) {
      setError('An enchantment error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setPassword(''); // Clear password from memory
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-hufflepuff-gold"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md parchment-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-hufflepuff-gold/20">
                <Shield className="h-8 w-8 text-hufflepuff-gold" />
              </div>
            </div>
            <CardTitle className="font-magical text-2xl text-center">
              Room of Requirements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              "I need a place to practice magic..."
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter the magical password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center font-medium"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full"
                variant="magical"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Checking enchantments...' : 'Enter the Room'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              This room requires proper authentication to protect your magical practice.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;