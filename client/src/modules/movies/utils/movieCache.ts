import { ReviewSupabaseService, type MovieReview } from "@/services/ReviewSupabaseService";

export interface MovieDetailsData {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

const movieDetailsCache = new Map<string, MovieDetailsData>();
const movieDetailsPromises = new Map<string, Promise<MovieDetailsData>>();

const movieReviewsCache = new Map<string, MovieReview[]>();
const movieReviewsPromises = new Map<string, Promise<MovieReview[]>>();

const toKey = (id: number | string) => id.toString();

export const getCachedMovieDetails = (movieId: string) => movieDetailsCache.get(movieId);
export const getCachedMovieReviews = (movieId: string) => movieReviewsCache.get(movieId);

export const invalidateMovieDetails = (movieId: string) => {
  movieDetailsCache.delete(movieId);
};

export const invalidateMovieReviews = (movieId: string) => {
  movieReviewsCache.delete(movieId);
};

export const prefetchMovieDetails = async (movieId: number): Promise<MovieDetailsData> => {
  const key = toKey(movieId);
  if (movieDetailsCache.has(key)) {
    return movieDetailsCache.get(key)!;
  }
  if (movieDetailsPromises.has(key)) {
    return movieDetailsPromises.get(key)!;
  }

  const promise = fetch(`${BACKEND_URL}/api/filmes/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha ao carregar detalhes do filme");
      }
      return response.json();
    })
    .then((data: MovieDetailsData) => {
      movieDetailsCache.set(key, data);
      return data;
    })
    .finally(() => {
      movieDetailsPromises.delete(key);
    });

  movieDetailsPromises.set(key, promise);
  return promise;
};

export const prefetchMovieReviews = async (movieId: number): Promise<MovieReview[]> => {
  const key = toKey(movieId);
  if (movieReviewsCache.has(key)) {
    return movieReviewsCache.get(key)!;
  }
  if (movieReviewsPromises.has(key)) {
    return movieReviewsPromises.get(key)!;
  }

  const promise = ReviewSupabaseService.listByMovie(movieId)
    .then((data) => {
      movieReviewsCache.set(key, data);
      return data;
    })
    .finally(() => {
      movieReviewsPromises.delete(key);
    });

  movieReviewsPromises.set(key, promise);
  return promise;
};
