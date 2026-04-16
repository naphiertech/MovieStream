const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testTV() {
  const fetchTMDB = async (endpoint) => {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  console.log("--- Trending TV ---");
  const trending = await fetchTMDB('/trending/tv/week');
  console.log(JSON.stringify(trending.results[0], null, 2));

  if (trending.results[0]) {
    const id = trending.results[0].id;
    console.log(`\n--- TV Details for ${id} ---`);
    const details = await fetchTMDB(`/tv/${id}`);
    console.log(JSON.stringify(details, null, 2));
    
    console.log(`\n--- TV Images for ${id} ---`);
    const images = await fetchTMDB(`/tv/${id}/images`);
    console.log(JSON.stringify(images.logos?.[0], null, 2));

    if (details.seasons?.[0]) {
      const sNum = details.seasons[0].season_number;
      console.log(`\n--- Season ${sNum} Details ---`);
      const season = await fetchTMDB(`/tv/${id}/season/${sNum}`);
      console.log(JSON.stringify(season.episodes?.[0], null, 2));
    }
  }
}

testTV();
