import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage, seterrorMessage] = useState('')
  const [movieList, setmovieList] = useState([])
  const [isLoading, setisLoading] = useState(false)

  // Performance Optimization, reduces number of API calls
  const [debounchedSearchTerm, setdebounchedSearchTerm] = useState('')

  useDebounce(()=>setdebounchedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setisLoading(true)
    seterrorMessage('')
    try {
      const endpoint = query ? 
        `${API_BASE_URL}/search/movie?query=${encodeURI(query)}` : 
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION)

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      } 
      const data = await response.json();

      if (data.Response === 'False'){
        seterrorMessage(data.Error || 'Failed To fetch movies')
        setmovieList([])
        return;
      }

      setmovieList(data.results || [])

    } catch (error) {

      console.log(`Error fetching movies ${error}`)
      seterrorMessage('Error fetching movies, try again later.')
    } finally {
      setisLoading(false)
    }
  }
  useEffect(() => {
    fetchMovies(debounchedSearchTerm)
  }, [debounchedSearchTerm])
  
  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>

        <header>

          <img src="./hero.png" alt="Hero Banner" />
          <h1> Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>

          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
        </header>
        
        <section className='all-movies'>
          <h2 className='mt-[20px]'>Popular</h2>

          {isLoading ? (<p className='text-white'> <Spinner /> </p>)
          : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>)
          : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard movie={movie} />
              ))}
            </ul>
          )}
        </section>
        
      </div>
    </main>
  )
}

export default App