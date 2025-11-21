import { useEffect, useState, CSSProperties, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { toFiveStarScale } from "@/utils/rating";
import ReviewStars from "@/components/ReviewStars";
import { ReviewSupabaseService, MovieReview } from "@/services/ReviewSupabaseService";
import {
  getCachedMovieDetails,
  getCachedMovieReviews,
  prefetchMovieDetails,
  prefetchMovieReviews,
  invalidateMovieReviews,
  type MovieDetailsData,
} from "@/modules/movies/utils/movieCache";

interface StarBurstParticle {
  id: string;
  x: number;
  y: number;
  fall: number;
  delay: number;
  size: number;
  scaleMid: number;
  scaleEnd: number;
  duration: number;
  opacity: number;
}

interface StarBurst {
  id: number;
  particles: StarBurstParticle[];
}

type StarParticleStyle = CSSProperties & {
  "--x"?: string;
  "--y"?: string;
  "--delay"?: string;
  "--fall"?: string;
  "--scale-mid"?: string;
  "--scale-end"?: string;
};

// Cache global para detalhes de filmes
const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cacheKey = id || "";
  const [movie, setMovie] = useState<MovieDetailsData | null>(() =>
    cacheKey ? getCachedMovieDetails(cacheKey) || null : null
  );
  const [reviews, setReviews] = useState<MovieReview[]>(() =>
    cacheKey ? getCachedMovieReviews(cacheKey) || [] : []
  );
  const [loading, setLoading] = useState(() => !(cacheKey && getCachedMovieDetails(cacheKey)));
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { user, backendUser } = useAuthContext();
  const [starBursts, setStarBursts] = useState<StarBurst[]>([]);
  const normalizedMovieRating = movie ? toFiveStarScale(movie.vote_average) : 0;

  const fetchMovieDetails = useCallback(async () => {
    if (!id) return;
    try {
      const data = await prefetchMovieDetails(Number(id));
      setMovie(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      toast.error("Erro ao carregar detalhes do filme");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const data = await prefetchMovieReviews(Number(id));
      setReviews(data);
    } catch (error) {
      console.error("Erro ao buscar reviews no Supabase:", error);
      toast.error("Erro ao carregar reviews");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    const cachedMovie = getCachedMovieDetails(id);
    if (cachedMovie) {
      setMovie(cachedMovie);
      setLoading(false);
    } else {
      fetchMovieDetails();
    }

    const cachedReviews = getCachedMovieReviews(id);
    if (cachedReviews) {
      setReviews(cachedReviews);
    } else {
      fetchReviews();
    }
  }, [id, fetchMovieDetails, fetchReviews]);

  const handleAddToList = () => {
    toast.success("Filme adicionado à sua lista!");
    // TODO: Implementar adição real à lista do usuário
  };

  const triggerPerfectScoreBurst = () => {
    const burstId = Date.now();
    const particles: StarBurstParticle[] = Array.from({ length: 12 }).map((_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 80;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      return {
        id: `${burstId}-${index}`,
        x,
        y,
        fall: 40 + Math.random() * 60,
        delay: Math.random() * 120,
        size: 8 + Math.random() * 6,
        scaleMid: 0.95 + Math.random() * 0.25,
        scaleEnd: 0.35 + Math.random() * 0.2,
        duration: 850 + Math.random() * 300,
        opacity: 0.8 + Math.random() * 0.2,
      };
    });

    setStarBursts((prev) => [...prev, { id: burstId, particles }]);

    window.setTimeout(() => {
      setStarBursts((prev) => prev.filter((burst) => burst.id !== burstId));
    }, 1400);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast.error("Por favor, dê uma nota ao filme");
      return;
    }

    if (!user?.id) {
      toast.error("Você precisa estar logado para avaliar");
      return;
    }

    const numericId = Number(id);
    if (!numericId || Number.isNaN(numericId)) {
      toast.error("Não foi possível identificar o filme para salvar sua review.");
      return;
    }

    setSubmitting(true);
    try {
      await ReviewSupabaseService.upsertReview({
        userId: user.id,
        userName:
          backendUser?.nome ||
          user.user_metadata?.full_name ||
          user.email ||
          "Usuário CineList",
        userAvatarUrl: backendUser?.avatarUrl ?? user.user_metadata?.avatar_url ?? undefined,
        tmdbId: numericId,
        movieTitle: movie?.title || movie?.original_title || "",
        rating: userRating,
        comment: userComment,
      });

      toast.success("Review adicionada com sucesso!");
      setUserRating(0);
      setUserComment("");
      if (cacheKey) {
        invalidateMovieReviews(cacheKey);
      }
      fetchReviews();
    } catch (error) {
      console.error("Erro ao submeter review no Supabase:", error);
      toast.error("Erro ao adicionar review");
    } finally {
      setSubmitting(false);
    }
  };

  const imageBaseUrl = "https://image.tmdb.org/t/p";

const getInitials = (value?: string | null) => {
  if (!value) return "U";
  const parts = value.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
  return initials || "U";
};

const formatReviewDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Skeleton Backdrop */}
        <div className="relative h-[400px] w-full overflow-hidden bg-muted animate-pulse" />
        
        <div className="container mx-auto px-4 -mt-32 relative z-20">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            {/* Skeleton Poster */}
            <div>
              <div className="w-full aspect-[2/3] bg-muted animate-pulse rounded-lg" />
              <div className="w-full h-10 bg-muted animate-pulse rounded mt-4" />
            </div>

            {/* Skeleton Info */}
            <div className="space-y-6">
              <div className="h-10 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded-full" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Filme não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-[400px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <img
            src={`${imageBaseUrl}/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 relative z-20">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Poster */}
          <div>
            <img
              src={`${imageBaseUrl}/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
            <Button
              onClick={handleAddToList}
              className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar à Minha Lista
            </Button>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-cinzel font-bold mb-2">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="text-muted-foreground italic">{movie.original_title}</p>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">
                  {normalizedMovieRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
              <span className="text-muted-foreground">{movie.release_date?.split("-")[0]}</span>
              {movie.runtime && (
                <span className="text-muted-foreground">{movie.runtime} min</span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Sinopse</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* Seção de Reviews */}
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-cinzel font-bold">Reviews</h2>

          {/* Adicionar Review */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-semibold mb-4">Deixe sua review</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sua nota</label>
                <div className="flex items-center">
                  <div className="relative inline-flex">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const button = (
                          <button
                            onClick={() => {
                              setUserRating(star);
                              if (star === 5) {
                                triggerPerfectScoreBurst();
                              }
                            }}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoveredStar || userRating)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        );

                        if (star === 5) {
                          return (
                            <div key={star} className="relative flex">
                              {button}
                              {starBursts.map((burst) => (
                                <div
                                  key={burst.id}
                                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                >
                                  {burst.particles.map((particle) => {
                                    const style: StarParticleStyle = {
                                      "--x": `${particle.x}px`,
                                      "--y": `${particle.y}px`,
                                      "--fall": `${particle.fall}px`,
                                      "--delay": `${particle.delay}ms`,
                                      "--scale-mid": `${particle.scaleMid}`,
                                      "--scale-end": `${particle.scaleEnd}`,
                                      width: `${particle.size}px`,
                                      height: `${particle.size}px`,
                                      opacity: particle.opacity,
                                      animationDuration: `${particle.duration}ms`,
                                    };

                                    return (
                                      <Star
                                        key={particle.id}
                                        className="star-burst-particle"
                                        style={style}
                                      />
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          );
                        }

                        return (
                          <div key={star} className="flex">
                            {button}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {userRating > 0 && (
                    <span className="ml-3 font-semibold text-accent">{userRating}/5</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comentário (opcional)</label>
                <Textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Compartilhe sua opinião sobre o filme..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={submitting || userRating === 0 || !user}
                className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {submitting ? "Publicando..." : "Publicar Review"}
              </Button>
            </div>
          </Card>

          {/* Lista de Reviews */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Ainda não há reviews para este filme. Seja o primeiro!
              </p>
              ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-6 bg-gradient-card border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={review.userAvatarUrl || undefined}
                          alt={review.userName}
                        />
                        <AvatarFallback className="bg-accent/20 text-accent">
                          {getInitials(review.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatReviewDateTime(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <ReviewStars
                        value={toFiveStarScale(review.rating)}
                        size="lg"
                        showValue={false}
                        className="flex-wrap"
                      />
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
