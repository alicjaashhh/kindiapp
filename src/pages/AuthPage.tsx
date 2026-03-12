import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (email) {
      localStorage.setItem('kindi_last_login', Date.now().toString());
      navigate('/baby-info');
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col max-w-md mx-auto">
      {/* iPhone status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2">
        <span className="text-sm font-semibold text-foreground">9:41</span>
        <div className="flex items-center gap-1">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13" y="0" width="3" height="12" rx="1"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5C5.8 2.5 3.8 3.3 2.3 4.8L0.5 3C2.4 1.1 5 0 8 0s5.6 1.1 7.5 3L13.7 4.8C12.2 3.3 10.2 2.5 8 2.5z"/><path d="M8 6.5c-1.4 0-2.6.5-3.5 1.5L2.7 6.2C4 4.8 5.9 4 8 4s4 .8 5.3 2.2L11.5 8C10.6 7 9.4 6.5 8 6.5z"/><circle cx="8" cy="11" r="1.5"/></svg>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="currentColor"><rect x="0" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="2" y="3" width="14" height="6" rx="1"/><rect x="19" y="4" width="2" height="4" rx="0.5"/></svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8">
        <h1 className="text-2xl font-bold text-center text-foreground mb-2">Create an account</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Enter your email to sign up for this app
        </p>

        <Input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 h-12 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground"
        />

        <Button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90"
        >
          Continue
        </Button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl mb-3 bg-card border-border text-foreground font-medium"
          onClick={() => {}}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl bg-card border-border text-foreground font-medium"
          onClick={() => {}}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-8">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline text-foreground">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline text-foreground">Privacy Policy</a>
        </p>
      </div>

      {/* iPhone home indicator */}
      <div className="flex justify-center pb-2 pt-4">
        <div className="w-32 h-1 rounded-full bg-foreground/20" />
      </div>
    </div>
  );
};

export default AuthPage;
