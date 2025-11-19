import { useState, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Film, Star, Calendar, Upload, Edit2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

const Profile = () => {
  const navigate = useNavigate();
  const { backendUser } = useAuthContext();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userBio, setUserBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (!backendUser?.id) {
      setReviewsCount(null);
      return;
    }

    const fetchReviewCount = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reviews/usuario/${backendUser.id}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar avaliações");
        }
        const data = await response.json();
        setReviewsCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Erro ao buscar contagem de avaliações:", error);
      }
    };

    fetchReviewCount();
  }, [backendUser]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        
        // Buscar dados do perfil
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || "");
          setUserBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url || "");
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userName,
          bio: userBio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("É preciso estar autenticado para atualizar o avatar.");
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;
      event.target.value = "";

      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!fileExt || !allowedExtensions.includes(fileExt) || !allowedMimeTypes.includes(file.type)) {
        toast.error("Formato inválido. Use JPG, JPEG, PNG ou WEBP.");
        return;
      }

      if (file.size > maxFileSize) {
        toast.error("O arquivo deve ter no máximo 10MB.");
        return;
      }

      // Upload para o Storage do Supabase
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${user.id}-${uniqueSuffix}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = data.publicUrl;

      // Atualizar no perfil
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      toast.success("Foto atualizada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao fazer upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Logout realizado!");
      navigate("/auth");
    }
  };

  const stats = [
    { icon: Film, label: "Filmes Assistidos", value: "47" },
    {
      icon: Star,
      label: "Avaliações",
      value: reviewsCount !== null ? reviewsCount.toString() : "…",
      onClick: () => navigate("/profile/reviews"),
    },
    { icon: Calendar, label: "Dias Assistindo", value: "156" },
    { icon: Trophy, label: "Conquistas", value: "8" },
  ];

  const handleStatKeyDown = (event: KeyboardEvent<HTMLDivElement>, action?: () => void) => {
    if (!action) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  const getInitials = () => {
    if (userName) {
      return userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return userEmail ? userEmail[0].toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="p-8 bg-gradient-card border-border/50 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-accent">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-accent text-accent-foreground text-3xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <label htmlFor="avatar-upload">
                <Button
                  size="sm"
                  disabled={uploading}
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                  asChild
                >
                  <div className="cursor-pointer">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleUploadAvatar}
                disabled={uploading}
              />
            </div>
            
            <div className="flex-1 w-full">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-cinzel font-bold">{userName || "Sem nome"}</h1>
                      <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="gap-2 hover:bg-foreground hover:text-background"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {userBio || "Adicione uma biografia para contar mais sobre você e seus gostos cinematográficos!"}
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={userBio}
                      onChange={(e) => setUserBio(e.target.value)}
                      placeholder="Conte um pouco sobre você e seus filmes favoritos..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        loadUserProfile();
                      }}
                      variant="outline"
                      className="hover:bg-foreground hover:text-background"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isInteractive = Boolean(stat.onClick);
            return (
              <Card
                key={index}
                className={`p-6 bg-card border-border/50 text-center ${
                  isInteractive
                    ? "cursor-pointer transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    : ""
                }`}
                onClick={stat.onClick}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onKeyDown={(event) => handleStatKeyDown(event, stat.onClick)}
              >
                <Icon className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <Card className="p-8 bg-gradient-card border-border/50">
          <h2 className="text-2xl font-cinzel font-bold mb-6 text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            Desafios
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Maratona de Clássicos</h3>
              <p className="text-sm text-muted-foreground mb-2">Assista 10 filmes clássicos este mês</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">6/10 completo</p>
            </div>
            
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Crítico Cinéfilo</h3>
              <p className="text-sm text-muted-foreground mb-2">Escreva 20 reviews detalhadas</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "35%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">7/20 completo</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
