
  "use client";

  import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from "react";

  type ClerkUser = {
    id: string;
    firstName?: string | null;
    username?: string | null;
    fullName?: string | null;
    publicMetadata?: Record<string, unknown>;
    update?: (params: {
      firstName?: string;
      username?: string;
      unsafeMetadata?: Record<string, unknown>;
    }) => Promise<unknown>;
  };

  type ClerkInstance = {
    isSignedIn?: boolean;
    user?: ClerkUser | null;
    session?: {
      getToken: () => Promise<string | null>;
    } | null;
    
    load: (options?: unknown) => Promise<void>;
    openSignIn: (options?: unknown) => void;
    signOut: () => Promise<void>;
    addListener?: (listener: (state: { user?: ClerkUser | null }) => void) => void;
    mountSignIn?: (node: HTMLDivElement, options?: unknown) => void;
    unmountSignIn?: (node: HTMLDivElement) => void;
  };

  declare global {
    interface Window {
      Clerk?: ClerkInstance;
      __internal_ClerkUICtor?: unknown;
    }
  }

  type AuthContextValue = {
    isLoaded: boolean;
    isSignedIn: boolean;
    isConfigured: boolean;
    user: ClerkUser | null;
    nickname: string;
    openSignIn: () => void;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
    setNickname: (nickname: string) => Promise<void>;
  };

  const AuthContext = createContext<AuthContextValue | null>(null);

  function getPublishableKey() {
    return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  }

  function getClerkDomain(publishableKey: string) {
    try {
      return window.atob(publishableKey.split("_")[2]).slice(0, -1);
    } catch {
      return "";
    }
  }

  function loadScript(src: string, publishableKey?: string) {
    return new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${src}"]`,
      );

      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";

      if (publishableKey) {
        script.dataset.clerkPublishableKey = publishableKey;
      }

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  export function ClerkAuthProvider({ children }: { children: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<ClerkUser | null>(null);
    const publishableKey = getPublishableKey();
    const isConfigured = Boolean(publishableKey);

    const refreshUser = useCallback(() => {
      setUser(window.Clerk?.user || null);
    }, []);

    useEffect(() => {
      let isMounted = true;

      async function loadClerk() {
        if (!publishableKey) {
          setIsLoaded(true);
          return;
        }

        const clerkDomain = getClerkDomain(publishableKey);

        if (!clerkDomain) {
          setIsLoaded(true);
          return;
        }

        try {
          await loadScript(
            `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`,
          );
          await loadScript(
            `https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,
            publishableKey,
          );
          await window.Clerk?.load({
            ui: { ClerkUI: window.__internal_ClerkUICtor },
          });

          if (!isMounted) {
            return;
          }

          setUser(window.Clerk?.user || null);
          window.Clerk?.addListener?.(({ user: nextUser }) => {
            setUser(nextUser || null);
          });
        } finally {
          if (isMounted) {
            setIsLoaded(true);
          }
        }
      }

      loadClerk();

      return () => {
        isMounted = false;
      };
    }, [publishableKey, refreshUser]);

    const nickname =
      (user?.publicMetadata?.nickname as string | undefined) ||
      user?.username ||
      user?.firstName ||
      user?.fullName ||
      "";

    const value = useMemo<AuthContextValue>(
      () => ({
        isLoaded,
        isSignedIn: Boolean(user),
        isConfigured,
        user,
        nickname,
        openSignIn: () => {
          if (window.Clerk?.openSignIn) {
            window.Clerk.openSignIn({ redirectUrl: "/" });
            return;
          }

          window.location.href = "/sign-in";
        },
        signOut: async () => {
          await window.Clerk?.signOut();
          setUser(null);
        },
        getToken: async () => window.Clerk?.session?.getToken() || null,
        setNickname: async (nextNickname: string) => {
          if (!user) {
            return;
          }

          await user?.update?.({
            firstName: nextNickname,
            unsafeMetadata: { nickname: nextNickname },
          });
          setUser({
            ...user,
            firstName: nextNickname,
            publicMetadata: {
              ...user.publicMetadata,
              nickname: nextNickname,
            },
          });
        },
      }),
      [isConfigured, isLoaded, nickname, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
      throw new Error("useAuth must be used inside ClerkAuthProvider");
    }

    return context;
  }
