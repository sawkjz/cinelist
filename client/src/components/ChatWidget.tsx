import { FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, Loader2, Instagram, Github, Linkedin } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const INSTAGRAM_URL = "https://www.instagram.com/isa_marcnds/";
const GITHUB_URL = "https://github.com/sawkjz";
const LINKEDIN_URL = "https://www.linkedin.com/in/isadora-marcondes-787102348/";
const BADGE_STORAGE_KEY = "chatwidget_badge_0.1";
const getBadgeKey = (userId: string) => `${BADGE_STORAGE_KEY}:${userId}`;

const ChatWidget = () => {
  const { user } = useAuthContext();
  const isAuthenticated = Boolean(user?.id);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repeatWarning, setRepeatWarning] = useState<string | null>(null);
  const [pointCount, setPointCount] = useState(0);
  const [badgePending, setBadgePending] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [hasVerifiedOnce, setHasVerifiedOnce] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  const loadBadge = () => {
    if (!isAuthenticated || !user?.id) return false;
    return localStorage.getItem(getBadgeKey(user.id)) === "earned";
  };

  const persistBadge = () => {
    if (isAuthenticated && user?.id) {
      localStorage.setItem(getBadgeKey(user.id), "earned");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (trimmed !== "/point") {
      setError('Use o comando "/point" para continuar.');
      return;
    }

    const nextCount = pointCount + 1;
    setPointCount(nextCount);
    setError(null);
    setRepeatWarning(null);
    setInputValue("");
    setBadgePending(false);

    if (!isAuthenticated) {
      // Visitantes podem usar quantas vezes quiserem, sem recompensa.
      setBadgeEarned(false);
      setBadgePending(false);

      if (!hasVerifiedOnce) {
        setShowOptions(false);
        setIsTyping(true);
        window.setTimeout(() => {
          setIsTyping(false);
          setShowOptions(true);
          setHasVerifiedOnce(true);
        }, 1000);
      } else {
        setShowOptions(true);
        setIsTyping(false);
      }
      return;
    }

    if (!hasVerifiedOnce) {
      setShowOptions(false);
      setIsTyping(true);
      window.setTimeout(() => {
        setIsTyping(false);
        setShowOptions(true);
        setHasVerifiedOnce(true);
      }, 1000);
    } else {
      setShowOptions(true);
      setIsTyping(false);
    }

    // Gate principal: se já resgatou, nunca mais mostra recompensa.
    if (badgeEarned) {
      setShowOptions(true);
      setIsTyping(false);
      setBadgePending(false);
      setRepeatWarning(null);
      return;
    }

    if (nextCount === 2) {
      setRepeatWarning("Você só pode usar /point uma vez. 😅");
    }

    if (nextCount >= 3) {
      if (badgeEarned) {
        setShowOptions(true);
        setIsTyping(false);
        setRepeatWarning("Badge 0.1 já resgatada. Obrigado!");
        setBadgePending(false);
        return;
      }

      if (!isAuthenticated) {
        setError("Faça login para resgatar a badge 0.1.");
        return;
      }

      setBadgePending(true);
    }
  };

  const resetState = () => {
    setShowOptions(false);
    setIsTyping(false);
    setInputValue("");
    setError(null);
    setRepeatWarning(null);
    setPointCount(0);
    setBadgePending(false);
    setHasVerifiedOnce(false);
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        resetState();
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        resetState();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    // Se o usuário deslogar, limpa qualquer progresso de badge/point da sessão
    if (!isAuthenticated) {
      setBadgeEarned(false);
      resetState();
      return;
    }

    // Ao logar, lê do storage se a badge já foi resgatada e trava o fluxo
    if (loadBadge()) {
      setBadgeEarned(true);
      setBadgePending(false);
    } else {
      setBadgeEarned(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    // Segurança extra: se por algum estado residual badgePending ficar true sem usuário, zera.
    if (!isAuthenticated && badgePending) {
      setBadgePending(false);
      setBadgeEarned(false);
    }
  }, [isAuthenticated, badgePending]);

  const handleAcceptBadge = () => {
    if (isCollecting) return;
    setIsCollecting(true);

    // animação + carregamento antes de fechar e recarregar
    setTimeout(() => {
      setBadgeEarned(true);
      setBadgePending(false);
      persistBadge();
      setIsCollecting(false);
      setIsOpen(false);
      resetState();
      window.location.reload();
    }, 4000);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {isOpen && (
        <div className="w-80 rounded-3xl border border-white/10 bg-[#24071c]/95 text-[#f9da5c] shadow-[0_12px_40px_rgba(36,7,28,0.45)] backdrop-blur">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs uppercase tracking-[0.4em]">૮ • ﻌ - ა</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="min-h-[40px] rounded-2xl border border-white/10 p-3 text-sm">
              {!showOptions && !isTyping && (
                <p className="opacity-70">
                  olá! digite{" "}
                  <code className="bg-white/10 px-1 py-0.5 rounded">/point</code> para ver as opções de contato
                </p>
              )}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </div>
              )}

              {showOptions && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] opacity-70">onde falar comigo</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[120px] rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-2 hover:border-white/30 transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[120px] rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-2 hover:border-white/30 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                    <a
                      href={LINKEDIN_URL}
                      className="flex-1 min-w-[120px] rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-2 hover:border-white/30 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {repeatWarning && (
              <p className="text-xs text-amber-200/90 border border-amber-200/30 rounded-2xl px-3 py-2 bg-amber-200/10">
                {repeatWarning}
              </p>
            )}

            {badgePending && isAuthenticated && (
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
                <style>
                  {`@keyframes confetti-pop {0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(160px) rotate(360deg);opacity:0;}}`}
                </style>
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(14)].map((_, idx) => (
                    <span
                      key={idx}
                      className="absolute h-2 w-2 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animation: "confetti-pop 900ms ease-out forwards",
                        animationDelay: `${idx * 50}ms`,
                        backgroundColor: ["#f97316", "#10b981", "#6366f1", "#ec4899"][idx % 4],
                      }}
                    />
                  ))}
                </div>
                <div className="relative space-y-1">
                  <p className="text-sm font-semibold text-[#f9da5c]">Recompensa desbloqueada!</p>
                  <p className="text-xs text-[#f9da5c]/80">
                    Você ganhou a badge <strong>0.1</strong>. Clique para resgatar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAcceptBadge}
                  disabled={isCollecting}
                  className="relative w-full rounded-xl bg-[#f9da5c] text-[#24071c] text-sm font-semibold py-2 hover:brightness-95 transition-all disabled:opacity-70"
                >
                  {isCollecting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resgatando...
                    </span>
                  ) : (
                    "Aceitar e fechar"
                  )}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="/point"
                className={cn(
                  "w-full rounded-2xl border bg-transparent px-4 py-2 text-sm text-[#f9da5c] placeholder:text-[#f9da5c]/40 focus:outline-none focus:ring-2 focus:ring-[#f9da5c]/40",
                  error ? "border-red-400/60" : "border-white/10"
                )}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-2xl px-3 py-1 text-xs border border-white/10 hover:border-white/40 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            {error && <p className="text-xs text-red-200">{error}</p>}
          </div>
        </div>
      )}

      <button
        onClick={handleToggleOpen}
        className="h-14 w-14 rounded-full bg-[#24071c] text-[#f9da5c] border border-white/20 shadow-[0_10px_25px_rgba(36,7,28,0.45)] flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Abrir chat de contato"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatWidget;
