export interface StreamQuality {
  type: 'hls' | 'mp4' | 'dash';
  url: string;
  headers?: Record<string, string>;
  requiresProxy?: boolean;
}

export interface StreamCaption {
  label: string;
  language: string;
  url: string;
}

// Playback-ready model returned by the StreamResolver to the client player
export interface PlaybackMetadata {
  videoUrl: string;
  qualities: Record<string, string>; // Maps quality label (e.g. '1080p') to local proxy-resolved play URL
  captions: StreamCaption[];
  providerId: string;
}

export interface StreamProvider {
  id: string;
  name: string;
  priority: number;
  getMovieStream(tmdbId: string): Promise<any>;
  getEpisodeStream(tmdbId: string, season: number, episode: number): Promise<any>;
}

import { VidLinkProvider } from './vidlink';

class StreamProviderManagerClass {
  private providers: StreamProvider[] = [];

  registerProvider(provider: StreamProvider) {
    this.providers.push(provider);
    // Sort ascending by priority number
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  getProviders(): StreamProvider[] {
    return this.providers;
  }

  async fetchMovieStream(tmdbId: string): Promise<{ providerId: string; rawData: any }> {
    for (const provider of this.providers) {
      try {
        console.log(`[StreamProviderManager] Attempting to fetch movie stream from provider: ${provider.name} (${provider.id})`);
        const rawData = await provider.getMovieStream(tmdbId);
        if (rawData) {
          console.log(`[StreamProviderManager] Successfully fetched stream from: ${provider.name}`);
          return { providerId: provider.id, rawData };
        }
      } catch (error) {
        console.error(`[StreamProviderManager] Provider ${provider.name} failed:`, error);
      }
    }
    throw new Error('All registered stream providers failed to resolve.');
  }

  async fetchEpisodeStream(tmdbId: string, season: number, episode: number): Promise<{ providerId: string; rawData: any }> {
    for (const provider of this.providers) {
      try {
        console.log(`[StreamProviderManager] Attempting to fetch episode stream from provider: ${provider.name} (${provider.id})`);
        const rawData = await provider.getEpisodeStream(tmdbId, season, episode);
        if (rawData) {
          console.log(`[StreamProviderManager] Successfully fetched stream from: ${provider.name}`);
          return { providerId: provider.id, rawData };
        }
      } catch (error) {
        console.error(`[StreamProviderManager] Provider ${provider.name} failed:`, error);
      }
    }
    throw new Error('All registered stream providers failed to resolve.');
  }
}

export const StreamProviderManager = new StreamProviderManagerClass();
StreamProviderManager.registerProvider(new VidLinkProvider());

// StreamResolver: Normalizes raw responses into a single playback-ready object directly from external provider CDNs
export class StreamResolver {
  static normalize(providerId: string, rawData: any): PlaybackMetadata {
    if (!rawData) {
      throw new Error('No raw data provided for resolution');
    }

    let videoUrl = '';
    const qualities: Record<string, string> = {};
    let captions: StreamCaption[] = [];

    if (providerId === 'vidlink') {
      const stream = rawData.stream || {};
      captions = stream.captions || [];

      // 1. Check if there is a main playlist (.m3u8) file directly
      if (stream.playlist) {
        videoUrl = stream.playlist;
      }

      // 2. Parse qualities (MP4 / HLS streams) directly from external source (no Vercel proxy)
      if (stream.qualities) {
        const qualityKeys = Object.keys(stream.qualities);
        
        qualityKeys.forEach((quality) => {
          const streamObj = stream.qualities[quality];
          if (streamObj && streamObj.url) {
            // Keep direct external CDN URL to avoid proxying media bytes through Vercel
            const finalUrl = streamObj.url;
            qualities[`${quality}p`] = finalUrl;

            // Set main videoUrl if we don't have one yet (defaulting to the first available or 1080p if present)
            if (!videoUrl || quality === '1080' || quality === 'auto') {
              videoUrl = finalUrl;
            }
          }
        });
      }

      // If playlist is present but qualities is empty, populate the default quality option
      if (videoUrl && Object.keys(qualities).length === 0) {
        qualities['Auto'] = videoUrl;
      }
    }

    if (!videoUrl) {
      throw new Error('Unable to extract playable video URL from stream metadata.');
    }

    return {
      videoUrl,
      qualities,
      captions,
      providerId
    };
  }
}
