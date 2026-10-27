'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from 'next-auth/react';
import { API_BASE_URL } from '@/utils/apiConfig';

export interface WebMcpLogEntry {
  type: 'log' | 'warn' | 'error';
  text: string;
  timestamp: string;
}

export interface WebMcpDiagnostics {
  route: string;
  language: string;
  direction: string;
  authStatus: string;
  userEmail?: string | null;
  userRole?: string | null;
  apiBaseUrl: string;
  viewport: {
    width: number;
    height: number;
  };
  errorsCount: number;
  warningsCount: number;
  logs: WebMcpLogEntry[];
}

export interface WebMcpBridgeApi {
  getState: () => {
    route: string;
    language: string;
    direction: string;
    isRtl: boolean;
    authStatus: string;
    user: unknown;
  };
  navigate: (href: string) => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleChatbot: (open?: boolean) => void;
  getDashboardMetrics: () => Promise<unknown>;
  getDiagnostics: () => WebMcpDiagnostics;
  checkHealth: () => Promise<{ ok: boolean; status: number; data?: unknown; error?: string }>;
}

declare global {
  interface Window {
    __webmcp?: WebMcpBridgeApi;
    __webmcp_logs?: WebMcpLogEntry[];
  }
}

export default function WebMcpBridge() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, direction, isRtl, setLanguage } = useLanguage();
  const { data: session, status: authStatus } = useSession();

  const logsRef = useRef<WebMcpLogEntry[]>([]);

  // Intercept and store window console logs for programmatic diagnostics
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.__webmcp_logs) {
      window.__webmcp_logs = [];
    }
    logsRef.current = window.__webmcp_logs;

    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args: unknown[]) => {
      try {
        const text = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        logsRef.current.push({ type: 'warn', text, timestamp: new Date().toISOString() });
      } catch {}
      originalWarn.apply(console, args as [unknown, ...unknown[]]);
    };

    console.error = (...args: unknown[]) => {
      try {
        const text = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        logsRef.current.push({ type: 'error', text, timestamp: new Date().toISOString() });
      } catch {}
      originalError.apply(console, args as [unknown, ...unknown[]]);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // Expose the global __webmcp testing & automation bridge
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bridge: WebMcpBridgeApi = {
      getState: () => ({
        route: pathname,
        language,
        direction,
        isRtl,
        authStatus,
        user: session?.user || null,
      }),

      navigate: (href: string) => {
        router.push(href);
      },

      setLanguage: (lang: 'ar' | 'en') => {
        setLanguage(lang);
      },

      toggleChatbot: (open?: boolean) => {
        // Trigger custom event or click launcher button
        window.dispatchEvent(
          new CustomEvent('roarosa:toggle-chatbot', {
            detail: { open },
          })
        );
        const button = document.querySelector('button[aria-label="Toggle Customer Chatbot"]') as HTMLButtonElement | null;
        if (button && typeof open === 'undefined') {
          button.click();
        }
      },

      getDashboardMetrics: async () => {
        try {
          const token = (session?.user as { credentialToken?: string })?.credentialToken;
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['token'] = token;
          }
          const res = await fetch(`${API_BASE_URL}/dashboard`, { headers });
          if (!res.ok) {
            return { error: `Failed with status ${res.status}` };
          }
          return await res.json();
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          return { error: errorMsg };
        }
      },

      getDiagnostics: () => {
        const errors = logsRef.current.filter((l) => l.type === 'error');
        const warnings = logsRef.current.filter((l) => l.type === 'warn');
        return {
          route: pathname,
          language,
          direction,
          authStatus,
          userEmail: session?.user?.email,
          userRole: (session?.user as { role?: string })?.role,
          apiBaseUrl: API_BASE_URL,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          errorsCount: errors.length,
          warningsCount: warnings.length,
          logs: logsRef.current.slice(-50),
        };
      },

      checkHealth: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/health`);
          const data = await res.json().catch(() => ({}));
          return { ok: res.ok, status: res.status, data };
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          return { ok: false, status: 0, error: errorMsg };
        }
      },
    };

    window.__webmcp = bridge;
  }, [pathname, router, language, direction, isRtl, setLanguage, session, authStatus]);

  return null;
}
