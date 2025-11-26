import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ReviewRow = Database["public"]["Tables"]["movie_reviews"]["Row"];
type ProfileRow = {
  avatar_url: string | null;
  full_name: string | null;
};

type ReviewRowWithProfile = ReviewRow & {
  profiles?: ProfileRow | null;
};

const REVIEW_SELECT = "*, profiles!movie_reviews_user_id_fkey(avatar_url, full_name)";

export interface MovieReview {
  id: number;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  tmdbId: number;
  movieTitle: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

const mapReview = (row: ReviewRowWithProfile): MovieReview => {
  const profile = row.profiles;
  const fallbackName = profile?.full_name || row.user_name || "Usuário";
  const fallbackAvatar = row.user_avatar_url ?? profile?.avatar_url ?? null;

  return {
    id: row.id,
    userId: row.user_id,
    userName: fallbackName,
    userAvatarUrl: fallbackAvatar,
    tmdbId: row.tmdb_id,
    movieTitle: row.movie_title,
    rating: Number(row.rating ?? 0),
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const resolveAvatarForUser = async (
  providedAvatar: string | null | undefined,
  userId: string
): Promise<string | null> => {
  if (providedAvatar) {
    return providedAvatar;
  }

  const { data } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  return data?.avatar_url ?? null;
};

export class ReviewSupabaseService {
  static async listByMovie(tmdbId: number): Promise<MovieReview[]> {
    const { data, error } = await supabase
      .from("movie_reviews")
      .select(REVIEW_SELECT)
      .eq("tmdb_id", tmdbId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ReviewRowWithProfile[] | null)?.map(mapReview) ?? [];
  }

  static async listByUser(userId: string): Promise<MovieReview[]> {
    const { data, error } = await supabase
      .from("movie_reviews")
      .select(REVIEW_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as ReviewRowWithProfile[] | null)?.map(mapReview) ?? [];
  }

  static async upsertReview(params: {
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    tmdbId: number;
    movieTitle: string;
    rating: number;
    comment?: string;
  }): Promise<MovieReview> {
    const timestamp = new Date().toISOString();
    const avatarUrl = await resolveAvatarForUser(params.userAvatarUrl, params.userId);

    const { data: existing } = await supabase
      .from("movie_reviews")
      .select("*")
      .eq("user_id", params.userId)
      .eq("tmdb_id", params.tmdbId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("movie_reviews")
        .update({
          user_name: params.userName,
          user_avatar_url: avatarUrl,
          movie_title: params.movieTitle,
          rating: params.rating,
          comment: params.comment?.trim() || null,
          updated_at: timestamp,
        })
        .eq("id", existing.id)
        .select(REVIEW_SELECT)
        .single();

      if (error) throw error;
      return mapReview(data as ReviewRowWithProfile);
    }

    const { data, error } = await supabase
      .from("movie_reviews")
      .insert({
        user_id: params.userId,
        user_name: params.userName,
        user_avatar_url: avatarUrl,
        tmdb_id: params.tmdbId,
        movie_title: params.movieTitle,
        rating: params.rating,
        comment: params.comment?.trim() || null,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select(REVIEW_SELECT)
      .single();

    if (error) throw error;
    return mapReview(data as ReviewRowWithProfile);
  }

  static async countByUser(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("movie_reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;
    return count ?? 0;
  }

  static async updateComment(reviewId: number, comment: string): Promise<MovieReview> {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from("movie_reviews")
      .update({
        comment: comment.trim() || null,
        updated_at: timestamp,
      })
      .eq("id", reviewId)
      .select(REVIEW_SELECT)
      .single();

    if (error) throw error;
    return mapReview(data as ReviewRowWithProfile);
  }

  static async deleteReview(reviewId: number): Promise<void> {
    const { error } = await supabase.from("movie_reviews").delete().eq("id", reviewId);
    if (error) throw error;
  }
}
