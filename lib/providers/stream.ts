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

export interface PlaybackMetadata {
  videoUrl: string;
  qualities: Record<string, string>;
  captions: StreamCaption[];
  providerId: string;
}

const VIDLINK_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://vidlink.pro/',
  'Origin': 'https://vidlink.pro',
};

async function fetchVidLink(endpoint: string): Promise<any> {
  const res = await fetch(`https://vidlink.pro/api/${endpoint}`, {
    headers: VIDLINK_HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`VidLink API returned status ${res.status}`);
  }
  return res.json();
}

export const StreamProviderManager = {
  async fetchMovieStream(tmdbId: string): Promise<{ providerId: string; rawData: any }> {
    const rawData = await fetchVidLink(`movie/${tmdbId}`);
    return { providerId: 'vidlink', rawData };
  },

  async fetchEpisodeStream(tmdbId: string, season: number, episode: number): Promise<{ providerId: string; rawData: any }> {
    const rawData = await fetchVidLink(`tv/${tmdbId}/${season}/${episode}`);
    return { providerId: 'vidlink', rawData };
  },
};

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

      if (stream.playlist) {
        videoUrl = stream.playlist;
      }

      if (stream.qualities) {
        for (const quality of Object.keys(stream.qualities)) {
          const streamObj = stream.qualities[quality];
          if (streamObj?.url) {
            qualities[`${quality}p`] = streamObj.url;
            if (!videoUrl || quality === '1080' || quality === 'auto') {
              videoUrl = streamObj.url;
            }
          }
        }
      }

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
      providerId,
    };
  }
}
