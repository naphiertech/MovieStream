import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WATCH_PROVIDERS, discoverMedia, Movie } from '@/lib/tmdb';
import { ProviderCatalogClient } from '@/components/ProviderCatalogClient';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const provider = WATCH_PROVIDERS.find((p) => p.id === id);
  if (!provider) {
    return { title: 'Provider Not Found' };
  }
  return {
    title: `${provider.name} Movies & Series`,
    description: `Browse and stream movies and TV series from ${provider.name}.`,
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = WATCH_PROVIDERS.find((p) => p.id === id);

  if (!provider) {
    notFound();
  }

  let initialMovies: Movie[] = [];
  let initialTV: Movie[] = [];

  try {
    [initialMovies, initialTV] = await Promise.all([
      discoverMedia('movie', { providerId: provider.id }),
      discoverMedia('tv', { providerId: provider.id }),
    ]);
  } catch (error) {
    console.error(`Failed to fetch catalog for provider ${provider.name}:`, error);
  }

  return (
    <ProviderCatalogClient
      provider={provider}
      initialMovies={initialMovies}
      initialTV={initialTV}
    />
  );
}
