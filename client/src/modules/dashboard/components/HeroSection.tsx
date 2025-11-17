import heroImage from "@/assets/hero-cinema.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="mb-12">
      <div className="relative rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 text-foreground">
            Bem-vindo ao CineList
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Descubra, organize e compartilhe sua paixão por filmes. Acompanhe o que assistiu, 
            crie listas personalizadas e conecte-se com outros cinéfilos.
          </p>
          <Button variant="hero" size="lg">
            Explorar Filmes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
