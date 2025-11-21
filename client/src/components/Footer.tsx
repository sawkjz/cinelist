import { Link } from "react-router-dom";
import { Sparkles, Github } from "lucide-react";

const pastelActions = [
  { label: "Catálogo", to: "/all-movies" },
  { label: "Favoritos", to: "/my-list" },
  { label: "Comunidade", to: "/profile/reviews" },
  { label: "Suporte", to: "/profile" },
];

const Footer = () => {
  return (
    <footer
      className="px-6 py-6 border-t"
      style={{ background: "#24071c", borderColor: "rgba(249,218,92,0.25)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-3 text-center text-[#f9da5c]">
        <p className="uppercase text-[0.65rem] tracking-[0.55em]">cine list</p>
        <h2 className="text-2xl font-cinzel">obrigada por maratonar com a gente</h2>
        <p className="text-sm max-w-2xl mx-auto leading-relaxed opacity-90">
          Salve memórias, compartilhe reviews e mantenha o brilho do cinema vivo.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-[0.7rem] font-medium">
          {pastelActions.map(({ label, to }) => (
            <Link key={label} to={to} className="uppercase tracking-[0.25em] hover:opacity-80 transition-opacity">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-[0.75rem] items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            amor & pipoca
          </div>
          <span className="hidden sm:inline opacity-70">•</span>
          <a
            href="https://github.com/sawkjz"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <Github className="h-4 w-4" />
            isa .
          </a>
        </div>

        <p className="text-[0.6rem] opacity-80">
          © {new Date().getFullYear()} CineList — feito com carinho.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
