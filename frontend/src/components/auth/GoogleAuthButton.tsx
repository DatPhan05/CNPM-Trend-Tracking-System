import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/error';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

type GoogleAuthButtonProps = {
  mode: 'login' | 'register';
};

function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const label = mode === 'register' ? 'Đăng ký với Google' : 'Đăng nhập với Google';

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const handleGoogleCredential = async (response: { credential?: string }) => {
      if (!response.credential) {
        toast.error('Không lấy được thông tin Google.');
        return;
      }

      setIsLoading(true);
      try {
        const googleResponse = await api.post('/auth/google', { credential: response.credential });
        const { access_token, refresh_token, user } = googleResponse.data;
        login(access_token, refresh_token, user);
        toast.success(googleResponse.data.message || `${label} thành công!`);
        navigate('/');
      } catch (error) {
        console.error(error);
        toast.error(getErrorMessage(error, `${label} thất bại`));
      } finally {
        setIsLoading(false);
      }
    };

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return false;
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: 384,
        text: mode === 'register' ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
      });
      return true;
    };

    if (renderGoogleButton()) return;

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton, { once: true });
      return () => existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [googleClientId, label, login, mode, navigate]);

  if (googleClientId) {
    return (
      <div>
        <div ref={googleButtonRef} className="min-h-11 flex items-center justify-center" />
        {isLoading && <p className="mt-2 text-sm text-muted-foreground text-center">Đang xác thực Google...</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toast.error('Chưa cấu hình Google Client ID. Thêm VITE_GOOGLE_CLIENT_ID trong frontend/.env để bật Google.')}
      className="w-full flex items-center justify-center gap-3 border border-border bg-card p-3 rounded-xl font-medium hover:bg-muted transition-colors shadow-sm"
    >
      <GoogleLogo />
      {label}
    </button>
  );
}
