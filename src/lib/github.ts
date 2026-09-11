import { site } from "@/config/site";
import { products, type ProductAccent } from "@/config/products";

export interface Product {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  /** GitHub's auto-generated social preview image — used as the card cover. */
  cover: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  year: number;
  archived: boolean;
  accent: ProductAccent;
  featured: boolean;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  created_at: string;
  updated_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
}

const DEFAULT_ACCENT: ProductAccent = "violet";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional: set GITHUB_TOKEN in the environment to lift rate limits.
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

/** Product data is baked in at build time, so a failed request means a card
 *  quietly missing until the next deploy. Say so loudly in the build log. */
function warnFailure(path: string, status: number) {
  const hint =
    status === 403 || status === 429
      ? " — rate limited; set GITHUB_TOKEN in the build environment"
      : "";
  console.warn(`[products] GitHub API ${status} for ${path}${hint}`);
}

// Requests run once per build (static export); force-cache also keeps the dev
// server from spending the API quota on every reload.
async function fetchRepo(repo: string): Promise<GitHubRepo | null> {
  const fullName = repo.includes("/") ? repo : `${site.githubUsername}/${repo}`;
  const path = `repos/${fullName}`;
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: headers(),
    cache: "force-cache",
  });
  if (!res.ok) {
    warnFailure(path, res.status);
    return null;
  }
  return (await res.json()) as GitHubRepo;
}

async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const path = `users/${site.githubUsername}/repos?per_page=100&sort=updated`;
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: headers(),
    cache: "force-cache",
  });
  if (!res.ok) {
    warnFailure(path, res.status);
    return [];
  }
  return (await res.json()) as GitHubRepo[];
}

function toProduct(
  repo: GitHubRepo,
  overrides?: {
    highlight?: string;
    accent?: ProductAccent;
    featured?: boolean;
    site?: string;
  },
): Product {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: overrides?.highlight ?? repo.description,
    url: repo.html_url,
    homepage: overrides?.site || repo.homepage || null,
    cover: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    year: new Date(repo.created_at).getUTCFullYear(),
    archived: repo.archived,
    accent: overrides?.accent ?? DEFAULT_ACCENT,
    featured: overrides?.featured ?? false,
  };
}

let productsOnce: Promise<Product[]> | undefined;

/** Returns the curated product list (or an auto-list by stars when the curated
 *  config is empty). Never throws — degrades to an empty list on API failure.
 *  Fetched once per process: several pages show products, and without this
 *  every one of them (in every build worker, on every dev render) would spend
 *  its own share of the API quota. Restart the dev server to refetch. */
export function getProducts(): Promise<Product[]> {
  productsOnce ??= loadProducts();
  return productsOnce;
}

async function loadProducts(): Promise<Product[]> {
  try {
    if (products.length > 0) {
      const results = await Promise.all(
        products.map(async (entry) => {
          const repo = await fetchRepo(entry.repo);
          if (!repo) return null;
          return toProduct(repo, {
            highlight: entry.highlight,
            accent: entry.accent,
            featured: entry.featured,
            site: entry.site,
          });
        }),
      );
      return results.filter((p): p is Product => p !== null);
    }

    const all = await fetchAllRepos();
    return all
      .filter((r) => !r.fork && !r.private)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 9)
      .map((r) => toProduct(r, { featured: true }));
  } catch (error) {
    console.warn("[products] GitHub API request failed:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, 3);
}
