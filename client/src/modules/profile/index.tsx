import { useState, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Film, Star, Calendar, Upload, Edit2, Save, Medal, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { ReviewSupabaseService } from "@/services/ReviewSupabaseService";
import { ListaSupabaseService } from "@/services/ListaSupabaseService";

type Badge = {
  id: string;
  label: string;
  description: string;
  icon: "heart" | "one";
};

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const CHAT_BADGE_STORAGE_KEY = "chatwidget_badge_0.1";
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userBio, setUserBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);
  const [listCount, setListCount] = useState<number | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [pendingBadge, setPendingBadge] = useState<Badge | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [claimText, setClaimText] = useState("");
  const [userIp, setUserIp] = useState<string | null>(null);
  const [hasChatBadge, setHasChatBadge] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setReviewsCount(null);
      return;
    }

    const fetchReviewCount = async () => {
      try {
        const total = await ReviewSupabaseService.countByUser(user.id);
        setReviewsCount(total);
      } catch (error) {
        console.error("Erro ao buscar contagem de avaliações:", error);
      }
    };

    fetchReviewCount();
  }, [user]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user?.id) {
        setListCount(null);
        return;
      }
      try {
        const listas = await ListaSupabaseService.buscarListas(user.id);
        setListCount(listas.length);
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
      }
    };
    loadLists();
  }, [user]);

  useEffect(() => {
    let storedBadges: Badge[] = [];
    const stored = localStorage.getItem("cinelist_badges");
    if (stored) {
      try {
        storedBadges = JSON.parse(stored);
        setBadges(storedBadges);
      } catch {
        setBadges([]);
      }
    }

    const fetchIpAndCheckLogin = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ip = data?.ip as string | undefined;
        if (ip) {
          setUserIp(ip);
          const loginKey = `cinelist_login_count_${ip}`;
          const currentCount = Number(localStorage.getItem(loginKey) || "0") + 1;
          localStorage.setItem(loginKey, String(currentCount));
          if (currentCount <= 10) {
            const loginBadge: Badge = {
              id: "first-ten-logins",
              label: "Usuário #1",
              description: "Um dos 10 primeiros logins (por IP) garantiu esta badge exclusiva.",
              icon: "one",
            };
            const alreadyHas = storedBadges.some((b) => b.id === loginBadge.id);
            if (!alreadyHas) {
              setPendingBadge(loginBadge);
              setIsBadgeModalOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Não foi possível obter o IP para controle de logins demo:", error);
      }
    };

    fetchIpAndCheckLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (badges.length) {
      localStorage.setItem("cinelist_badges", JSON.stringify(badges));
    }
  }, [badges]);

  useEffect(() => {
    const progressReady = reviewsCount !== null && listCount !== null;
    if (!progressReady) return;
    const challenges = [
      {
        id: "reviews-challenge",
        completed: (reviewsCount ?? 0) >= 5,
        badge: {
          id: "heart-critic",
          label: "Crítico do Coração",
          description: "Publicou 5 reviews e ganhou uma medalha especial.",
          icon: "heart" as const,
        },
      },
      {
        id: "lists-challenge",
        completed: (listCount ?? 0) >= 3,
        badge: {
          id: "curador-listas",
          label: "Curador de Listas",
          description: "Criou 3 listas personalizadas.",
          icon: "heart" as const,
        },
      },
    ];
    const unclaimed = challenges.find(
      (c) => c.completed && !badges.some((b) => b.id === c.badge.id),
    );
    if (unclaimed) {
      setPendingBadge(unclaimed.badge);
      setIsBadgeModalOpen(true);
    }
  }, [reviewsCount, listCount, badges]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
          const chatBadge = localStorage.getItem(`${CHAT_BADGE_STORAGE_KEY}:${user.id}`) === "earned";
          setHasChatBadge(chatBadge);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(`Erro ao atualizar perfil: ${message}`);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setSelectedFile(null);
  };

  const handleSelectAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleConfirmAvatarUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma imagem para continuar.");
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("É preciso estar autenticado para atualizar o avatar.");
        return;
      }

      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
      if (!fileExt || !allowedExtensions.includes(fileExt) || !allowedMimeTypes.includes(selectedFile.type)) {
        toast.error("Formato inválido. Use JPG, JPEG, PNG ou WEBP.");
        return;
      }

      if (selectedFile.size > maxFileSize) {
        toast.error("O arquivo deve ter no máximo 10MB.");
        return;
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${user.id}-${uniqueSuffix}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          contentType: selectedFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      toast.success("Foto atualizada com sucesso!");
      handleClosePreview();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao fazer upload";
      toast.error(`Erro ao fazer upload: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleClaimBadge = () => {
    if (!pendingBadge) return;
    if (!badges.some((b) => b.id === pendingBadge.id)) {
      setBadges((prev) => [...prev, pendingBadge]);
    }
    setPendingBadge(null);
    setIsBadgeModalOpen(false);
    setClaimText("");
  };

  const badgeIcon = (type: Badge["icon"]) => {
    if (type === "one") {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
          1
        </span>
      );
    }
    return (
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
        <Medal className="h-5 w-5" />
        <Heart className="absolute h-3 w-3 text-rose-500" />
      </span>
    );
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

  const badgeRewards: Record<string, Badge> = {
    "heart-critic": {
      id: "heart-critic",
      label: "Crítico do Coração",
      description: "Publicou 5 reviews e ganhou uma medalha especial.",
      icon: "heart",
    },
    "curador-listas": {
      id: "curador-listas",
      label: "Curador de Listas",
      description: "Criou 3 listas personalizadas.",
      icon: "heart",
    },
  };

  const challenges = [
    {
      id: "reviews-challenge",
      title: "Crítico iniciante",
      description: "Publique 5 reviews para provar seu amor pelo cinema.",
      current: reviewsCount ?? 0,
      target: 5,
      badgeId: "heart-critic",
    },
    {
      id: "lists-challenge",
      title: "Curador de listas",
      description: "Crie 3 listas personalizadas e organize seus favoritos.",
      current: listCount ?? 0,
      target: 3,
      badgeId: "curador-listas",
    },
  ];
  useEffect(() => {
    if (selectedFile && previewUrl) {
      setIsPreviewOpen(true);
    }
  }, [selectedFile, previewUrl]);

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
      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (uploading) return;
            handleClosePreview();
            return;
          }
          setIsPreviewOpen(true);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Pré-visualizar avatar</DialogTitle>
            <DialogDescription>
              Veja como sua foto aparece em alguns tamanhos antes de publicar.
            </DialogDescription>
          </DialogHeader>

          {previewUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {[
                { label: "Maior (original)", size: "h-28 w-28" },
                { label: "Médio", size: "h-20 w-20" },
                { label: "Pequeno", size: "h-14 w-14" },
              ].map((preview) => (
                <div
                  key={preview.label}
                  className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-4"
                >
                  <Avatar className={`${preview.size} border border-border/50 shadow-sm`}>
                    <AvatarImage src={previewUrl} alt="Pré-visualização do avatar" />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground text-center">{preview.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            A imagem pode ter até 10MB. Formatos aceitos: JPG, JPEG, PNG ou WEBP.
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClosePreview} disabled={uploading}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAvatarUpload}
              className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Confirmar upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="max-w-md overflow-hidden">
          <style>
            {`
              @keyframes medal-drop {
                0% { transform: translateY(-120%) scale(0.3) rotate(-8deg); opacity: 0; }
                60% { transform: translateY(10%) scale(1.05) rotate(3deg); opacity: 1; }
                80% { transform: translateY(-4%) scale(0.98) rotate(-2deg); }
                100% { transform: translateY(0) scale(1); opacity: 1; }
              }
              @keyframes confetti {
                0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
              }
            `}
          </style>
          <DialogHeader>
            <DialogTitle>Badge conquistada!</DialogTitle>
            <DialogDescription>
              Você concluiu um desafio. Resgate sua recompensa para exibir no perfil.
            </DialogDescription>
          </DialogHeader>
          {pendingBadge && (
            <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/40 p-4">
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, idx) => (
                  <span
                    key={idx}
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animation: "confetti 900ms ease-out forwards",
                      animationDelay: `${idx * 60}ms`,
                      backgroundColor: ["#f97316", "#10b981", "#6366f1", "#ec4899"][idx % 4],
                    }}
                  />
                ))}
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent shadow-md"
                  style={{ animation: "medal-drop 600ms ease-out" }}
                >
                  <Medal className="h-7 w-7" />
                  {pendingBadge.icon === "one" ? (
                    <span className="absolute text-lg font-bold text-accent-foreground">1</span>
                  ) : (
                    <Heart className="absolute h-4 w-4 text-rose-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{pendingBadge.label}</p>
                  <p className="text-sm text-muted-foreground">{pendingBadge.description}</p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="claim-input">Digite para resgatar</Label>
            <Input
              id="claim-input"
              placeholder="Ex: Quero minha badge"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBadgeModalOpen(false)}>
              Depois
            </Button>
            <Button
              onClick={handleClaimBadge}
              className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              disabled={!claimText.trim()}
            >
              Aceitar badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                onChange={handleSelectAvatar}
                disabled={uploading}
              />
            </div>
            
            <div className="flex-1 w-full">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-cinzel font-bold">{userName || "Sem nome"}</h1>
                      {hasChatBadge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold">
                          <Film className="h-3 w-3" />
                          0.1
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{userEmail}</p>
                    {badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {badges.map((badge) => (
                          <div key={badge.id} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                            {badgeIcon(badge.icon)}
                            <span>{badge.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-cinzel font-bold text-foreground">Desafios</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">Desafio</th>
                  <th className="pb-3 font-semibold">Progresso</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {challenges.map((challenge) => {
                  const reward = badgeRewards[challenge.badgeId];
                  const completed = challenge.current >= challenge.target;
                  const alreadyClaimed = badges.some((b) => b.id === reward.id);
                  const progressPercent = Math.min(
                    100,
                    Math.round((challenge.current / challenge.target) * 100),
                  );
                  return (
                    <tr key={challenge.id} className="align-middle">
                      <td className="py-4">
                        <p className="font-semibold text-foreground">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-accent"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {challenge.current}/{challenge.target}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        {alreadyClaimed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                            {badgeIcon(reward.icon)}
                            Concluído
                          </span>
                        ) : completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                            Pronto para resgatar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                            Em progresso
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          size="sm"
                          variant={completed ? "default" : "outline"}
                          className={completed ? "bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent" : ""}
                          disabled={!completed || alreadyClaimed}
                          onClick={() => {
                            setPendingBadge(reward);
                            setIsBadgeModalOpen(true);
                          }}
                        >
                          {alreadyClaimed ? "Badge obtida" : completed ? "Resgatar badge" : "Continuar"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
