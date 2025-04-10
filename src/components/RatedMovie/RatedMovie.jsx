import { Alert, Flex, Spin } from 'antd'
import { MovieContext } from '../../Api/ApiService'
import Cards from '../Cards/Cards'
import './RatedMovie.css'

export default function RatedMovie() {
  const renderContent = ({ ratedMovies, genres, isLoading, ratedError }) => {
    if (ratedError) {
      return <Alert message={ratedError} type="error" showIcon />
    }

    if (isLoading) {
      return (
        <Flex gap="middle">
          <Spin size="large" />
        </Flex>
      )
    }

    if (ratedMovies.length > 0) {
      return (
        <div className="rated-movies-grid">
          {ratedMovies.map((movie) => (
            <Cards
              key={movie.id}
              id={movie.id}
              title={movie.title}
              description={movie.overview}
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              userRating={movie.rating}
              genres={movie.genre_ids
                .map((id) => {
                  const genre = genres.find((g) => g.id === id)
                  return genre ? genre.name : null
                })
                .filter(Boolean)}
              bannerUrl={movie.poster_path && `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
          ))}
        </div>
      )
    }

    return <Alert message="Вы пока не оценили ни одного фильма" type="info" showIcon />
  }

  return <MovieContext.Consumer>{renderContent}</MovieContext.Consumer>
}
