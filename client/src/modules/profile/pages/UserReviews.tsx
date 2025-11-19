import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, MessageCircle, Film } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toFiveStarScale } from "@/utils/rating";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

interface Review {
  id: number;
  usuarioId: number;
  tmdbId: number;
  tituloFilme: string;
  nota: number;
  comentario: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

type CategorizedReview = Review & { normalizedScore: number };
type ReviewCategoryWithItems = ReviewCategory & { items: CategorizedReview[] };

interface ReviewCategory {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  match: (score: number) => boolean;
}

const REVIEW_CATEGORIES: ReviewCategory[] = [
  {
    id: "top",
    title: "Favoritos absolutos",
    description: "Notas de 4.5 a 5 – filmes que você mais amou.",
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    match: (score) => score >= 4.5,
  },
  {
    id: "great",
    title: "Ótimas descobertas",
    description: "Notas entre 3.5 e 4.4 – experiências muito positivas.",
    icon: <Star className="h-5 w-5 text-emerald-400" />,
    match: (score) => score >= 3.5 && score < 4.5,
  },
  {
    id: "ok",
    title: "Médio pra bom",
    description: "Notas entre 2.5 e 3.4 – filmes que agradaram, mas não brilharam.",
    icon: <Star className="h-5 w-5 text-cyan-400" />,
    match: (score) => score >= 2.5 && score < 3.5,
  },
];

const FALLBACK_CATEGORY: ReviewCategory = {
  id: "meh",
  title: "Pouco memoráveis",
  description: "Notas abaixo de 2.5 – provavelmente você não veria de novo.",
  icon: <Star className="h-5 w-5 text-rose-400" />,
  match: () => true,
};

const formatReviewDateTime = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} às ${formattedTime}`;
};

const UserReviewsPage = () => {
  const navigate = useNavigate();
  const { backendUser } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!backendUser?.id) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/reviews/usuario/${backendUser.id}`);
        if (!response.ok) {
          throw new Error("Não foi possível carregar suas avaliações.");
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
        setError("Não conseguimos carregar suas avaliações agora. Tente novamente em instantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [backendUser]);

  const groupedReviews = useMemo<ReviewCategoryWithItems[]>(() => {
    const groups: ReviewCategoryWithItems[] = [...REVIEW_CATEGORIES, FALLBACK_CATEGORY].map(
      (category) => ({
        ...category,
        items: [] as CategorizedReview[],
      })
    );

    reviews.forEach((review) => {
      const normalizedScore = toFiveStarScale(review.nota);
      const category =
        REVIEW_CATEGORIES.find((cat) => cat.match(normalizedScore)) ?? FALLBACK_CATEGORY;
      const targetGroup = groups.find((group) => group.id === category.id);
      if (targetGroup) {
        targetGroup.items.push({ ...review, normalizedScore });
      }
    });

    return groups;
  }, [reviews]);

  const totalReviews = reviews.length;

  if (!backendUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 bg-gradient-card border-border/50 text-center">
            <p className="text-lg text-muted-foreground">
              Entre em sua conta para visualizar suas avaliações.
            </p>
            <Button className="mt-4" onClick={() => navigate("/auth")}>
              Ir para login
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Perfil</p>
            <h1 className="text-3xl font-cinzel font-bold text-foreground mt-1">
              Minhas avaliações
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Navegue por tudo o que você já comentou. Agrupamos suas reviews por categoria de nota,
              e você pode abrir qualquer filme para rever os detalhes e seu comentário original.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao perfil
            </Button>
            <Button onClick={() => navigate("/all-movies")}>
              <Film className="h-4 w-4 mr-2" />
              Buscar novos filmes
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-gradient-card border-border/50 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
              <Star className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de avaliações</p>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "..." : totalReviews}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {loading
              ? "Carregando suas avaliações..."
              : totalReviews === 0
              ? null
              : "Todas as avaliações realizadas com sua conta são listadas abaixo, prontas para consulta."}
          </div>
        </Card>

        {error && (
          <Card className="p-4 border-destructive/50 bg-destructive/10 text-destructive">
            {error}
          </Card>
        )}

        <div className="space-y-6">
          {groupedReviews.map((category) => (
            <Card key={category.id} className="p-6 bg-card border-border/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {category.items.length} {category.items.length === 1 ? "review" : "reviews"}
                </Badge>
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : category.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum filme avaliado nesta categoria ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {category.items
                    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
                    .map((review) => (
                      <Card key={review.id} className="p-4 bg-gradient-to-br from-background to-muted/40 border-border/50">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-foreground">{review.tituloFilme}</p>
                            <p className="text-sm text-muted-foreground">
                              Publicado em {formatReviewDateTime(review.dataCriacao)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-base font-semibold">
                              {review.normalizedScore.toFixed(1)}/5
                            </span>
                          </div>
                        </div>
                        {review.comentario && (
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            <MessageCircle className="h-4 w-4 inline mr-1 text-accent" />
                            {review.comentario}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/movie/${review.tmdbId}`)}
                          >
                            Ver informações do filme
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            ID TMDB #{review.tmdbId}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserReviewsPage;
