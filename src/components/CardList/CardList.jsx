import { Component } from 'react'
import { Alert, Flex, Spin } from 'antd'
import Cards from '../Cards/Cards'
import { MovieContext } from '../../Api/ApiService'
import './CardList.css'
import Pagination from '../Pagination/Pagination'

export default class CardList extends Component {
  render() {
    return (
      <MovieContext.Consumer>
        {({ movies, genres, searched, searchQuery, isLoading, errorMessage, currentPage, totalPages, PageChange }) => {
          let content

          if (errorMessage) {
            content = <Alert className="alert" message={errorMessage} type="error" showIcon />
          } else if (isLoading) {
            content = (
              <Flex className="spin" gap="middle">
                <Spin size="large" />
              </Flex>
            )
          } else if (movies.length > 0) {
            content = (
              <>
                {movies.map((movie) => (
                  <Cards
                    key={movie.id}
                    title={movie.title}
                    description={movie.overview}
                    releaseDate={movie.release_date}
                    rating={movie.vote_average}
                    genres={movie.genre_ids
                      .map((id) => {
                        const genre = genres.find((g) => g.id === id)
                        return genre ? genre.name : null
                      })
                      .filter((name) => name)}
                    bannerUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  />
                ))}
                <Pagination currentPage={currentPage} totalPages={totalPages} PageChange={PageChange} />
              </>
            )
          } else if (searched && searchQuery) {
            content = <Alert className="alert" type="warning" message="No movies found" />
          }

          return <div className="cardList">{content}</div>
        }}
      </MovieContext.Consumer>
    )
  }
}
