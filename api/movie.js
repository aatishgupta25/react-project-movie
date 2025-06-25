export default async function handler(req, res) {
    const { query } = req.query
  
    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
      : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`
  
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_KEY}`,
        accept: 'application/json',
      },
    })
  
    const data = await response.json()
    res.status(200).json(data)
  }
  