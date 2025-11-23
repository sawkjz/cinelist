import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ArrowLeft, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewSupabaseService, type MovieReview } from "@/services/ReviewSupabaseService";
import ReviewStars from "@/components/ReviewStars";
import { toFiveStarScale } from "@/utils/rating";

interface ProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
}

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

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileResponse, reviewsResponse] = await Promise.all([
          supabase.from("profiles").select("id, full_name, username, avatar_url, bio").eq("id", userId).single(),
          ReviewSupabaseService.listByUser(userId),
        ]);

        if (profileResponse.error || !profileResponse.data) {
          throw new Error("Perfil não encontrado");
        }

        setProfile(profileResponse.data);
        setReviews(reviewsResponse);
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err);
        setError("Não foi possível carregar este perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 bg-gradient-card border-border/50 text-center">
            <p className="text-muted-foreground">Carregando perfil...</p>
          </Card>
        ) : error ? (
          <Card className="p-8 bg-gradient-card border-border/50 text-center text-destructive">
            {error}
          </Card>
        ) : profile ? (
          <>
            <Card className="p-8 bg-gradient-card border-border/50 flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32 border-4 border-accent">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? profile.username ?? "Usuário"} />
                ) : (
                  <AvatarFallback className="bg-accent text-accent-foreground text-3xl">
                    {getInitials(profile.full_name ?? profile.username)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-3">
                <div>
                  <p className="text-sm uppercase text-muted-foreground tracking-wide">Perfil público</p>
                  <h1 className="text-3xl font-cinzel font-bold text-foreground">
                    {profile.full_name || profile.username || "Usuário CineList"}
                  </h1>
                  {profile.username && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                </div>
                {profile.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                )}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Avaliações recentes</h2>
                <Button variant="ghost" className="gap-2" onClick={() => navigate("/all-movies")}>
                  <Film className="h-4 w-4" />
                  Explorar filmes
                </Button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Este usuário ainda não publicou reviews.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-5 bg-gradient-to-br from-background to-muted/30 border-border/40">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-foreground">{review.movieTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatReviewDateTime(review.createdAt)}
                          </p>
                        </div>
                        <ReviewStars value={toFiveStarScale(review.rating)} showValue={false} />
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          <MessageCircle className="inline h-4 w-4 mr-2 text-accent" />
                          {review.comment}
                        </p>
                      )}
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => navigate(`/movie/${review.tmdbId}`)}>
                          Ver filme
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default PublicProfilePage;
