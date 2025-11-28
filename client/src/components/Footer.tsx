import { Link } from "react-router-dom";
import { Github, Mail, Film, Star, Heart } from "lucide-react";

const quickLinks = [
  { label: "Catálogo", to: "/all-movies" },
  { label: "Favoritos", to: "/my-list" },
  { label: "Comunidade", to: "/profile/reviews" },
  { label: "Perfil", to: "/profile" },
];

const connectLinks = [
  { label: "GitHub", href: "https://github.com/sawkjz" },
  { label: "Contato", href: "mailto:isa@example.com" },
];

const featureLinks = [
  { label: "Descobrir filmes", icon: Film },
  { label: "Reviews da galera", icon: Star },
  { label: "Listas que importam", icon: Heart },
];

const Footer = () => {
  return (
    <footer className="border-t bg-[#24071c] px-6 py-8 text-muted-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4 items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold">
                CL
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent">CineList</p>
                <p className="text-sm">Sua maratona, seu jeito.</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed">
              Salve memórias, compartilhe reviews e mantenha o brilho do cinema vivo.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Navegue</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Destaques</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {featureLinks.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4 text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Fale com a gente</h4>
            <div className="flex flex-col gap-2 text-sm">
              {connectLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label === "GitHub" ? <Github className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/80">
          <span>© {new Date().getFullYear()} CineList</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
