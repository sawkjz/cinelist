import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, Loader2, Instagram, Github, Mail } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/4iswka/";
const GITHUB_URL = "https://github.com/sawkjz";
const EMAIL_URL = "mailto:isa@cinelist.dev?subject=Contato%20CineList";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (trimmed !== "/point") {
      setError('Use o comando "/point" para continuar ✨');
      return;
    }

    setError(null);
    setInputValue("");
    setShowOptions(false);
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setShowOptions(true);
    }, 1000);
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setShowOptions(false);
        setIsTyping(false);
        setInputValue("");
        setError(null);
      }
      return next;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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
                  conectando portais...
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
                      href={EMAIL_URL}
                      className="flex-1 min-w-[120px] rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-2 hover:border-white/30 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">E‑mail</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 p-3 text-xs text-[#f9da5c]/80">
              Prefere outro canal? Envie uma mensagem pelo formulário de contato e eu retorno rapidinho.
            </div>

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
                className="absolute right-1 top-1 rounded-2xl px-3 py-1 text-xs border border-white/10 hover:border-white/40 transition-colors"
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
