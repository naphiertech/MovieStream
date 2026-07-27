import { StreamProvider } from './stream';

export class VidLinkProvider implements StreamProvider {
  id = 'vidlink';
  name = 'VidLink';
  priority = 1;

  async getMovieStream(tmdbId: string): Promise<any> {
    const url = `https://vidlink.pro/api/movie/${tmdbId}`;
    console.log(`[VidLinkProvider] Fetching movie stream URL: ${url}`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://vidlink.pro/',
        'Origin': 'https://vidlink.pro'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
      throw new Error(`VidLink Movie API returned status: ${res.status}`);
    }
    return res.json();
  }

  async getEpisodeStream(tmdbId: string, season: number, episode: number): Promise<any> {
    const url = `https://vidlink.pro/api/tv/${tmdbId}/${season}/${episode}`;
    console.log(`[VidLinkProvider] Fetching episode stream URL: ${url}`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://vidlink.pro/',
        'Origin': 'https://vidlink.pro'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
      throw new Error(`VidLink TV API returned status: ${res.status}`);
    }
    return res.json();
  }
}
