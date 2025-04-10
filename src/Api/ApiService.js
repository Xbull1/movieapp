import { Component, createContext } from 'react'
import axios from 'axios'
import debounce from 'lodash/debounce'

export const MovieContext = createContext()

export default class ApiService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      errorMessage: null,
      isLoading: false,
      searchQuery: '',
      genres: [],
      searched: false,
      currentPage: 1,
      totalPages: 0,
      guestSessionID: null,
      sessionTime: null,
      ratedMovies: [],
      ratedError: null,
    }
    this.apikey = 'be843e8a9812d7d3a88091bf2e92de19'
    this.debouncedSearchMovies = debounce(this.searchMovies, 300)
  }

  componentDidMount() {
    this.fetchGenres()
    this.guestSession()
    this.checkSessionExpiry()
  }

  checkSessionExpiry = () => {
    const { sessionTime } = this.state
    if (sessionTime && new Date(sessionTime) < new Date()) {
      localStorage.removeItem('savedSession')
      this.setState({ guestSessionID: null, sessionTime: null })
    }
  }

  guestSession = async () => {
    const savedSession = localStorage.getItem('savedSession')
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        if (sessionData.guest_session_id && new Date(sessionData.expires_at) > new Date()) {
          this.setState(
            {
              guestSessionID: sessionData.guest_session_id,
              sessionTime: sessionData.expires_at,
            },
            this.getRatedMovies
          )
          return
        }
        localStorage.removeItem('savedSession')
      } catch (e) {
        console.error('Ошибка при разборе сохранённой сессии:', e)
        localStorage.removeItem('savedSession')
      }
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apikey}`
      )

      const newSession = {
        guest_session_id: response.data.guest_session_id,
        expires_at: response.data.expires_at,
      }

      localStorage.setItem('savedSession', JSON.stringify(newSession))

      this.setState(
        {
          guestSessionID: response.data.guest_session_id,
          sessionTime: response.data.expires_at,
        },
        this.getRatedMovies
      )
    } catch (error) {
      console.error('Ошибка создания сессии:', error)
      this.setState({
        ratedError: 'Не удалось создать гостевую сессию',
        guestSessionID: null,
        sessionTime: null,
      })
    }
  }

  getRatedMovies = async () => {
    const { guestSessionID } = this.state
    if (!guestSessionID) {
      this.setState({
        ratedError: 'Ошибка получения оцененных фильмов',
      })
      return
    }

    this.setState({ errorMessage: null })

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/guest_session/${guestSessionID}/rated/movies?api_key=${this.apikey}`
      )
      this.setState({
        ratedMovies: response.data.results,
      })
    } catch (error) {
      console.error(error)
      this.setState({
        ratedError: 'Ошибка получения оцененных фильмов',
      })
    }
  }

  rateMovies = async (movie, rate) => {
    const { guestSessionID } = this.state
    if (!guestSessionID) {
      this.setState({ ratedError: 'Ошибка гостевой сессии' })
      return
    }
    try {
      await axios.post(
        `https://api.themoviedb.org/3/movie/${movie.id}/rating?api_key=${this.apikey}&guest_session_id=${guestSessionID}`,
        { value: rate }
      )
      this.getRatedMovies()
    } catch (error) {
      console.log(error)
      this.setState({
        ratedError: 'ошибка оценки фильма',
      })
    }
  }

  fetchGenres = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apikey}`)
      this.setState({ genres: response.data.genres })
    } catch (error) {
      console.error(error)
      this.setState({ errorMessage: 'Не удалось загрузить жанры.' })
    }
  }

  searchMovies = async () => {
    const { searchQuery, currentPage } = this.state
    if (!searchQuery) {
      this.setState({ movies: [], searched: false })
      return
    }

    this.setState({ isLoading: true, searched: true })

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${this.apikey}&query=${searchQuery}&page=${currentPage}`
      )
      this.setState({
        movies: response.data.results,
        totalPages: response.data.total_pages,
        isLoading: false,
        errorMessage: null,
        currentPage: 1,
      })
    } catch (error) {
      console.error(error)
      this.setState({
        isLoading: false,
        errorMessage: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
      })
    }
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value }, this.debouncedSearchMovies)
  }

  PageChange = (page) => {
    this.setState({ currentPage: page }, this.searchMovies)
  }

  getContextValue = () => {
    const {
      movies,
      genres,
      searched,
      searchQuery,
      isLoading,
      errorMessage,
      currentPage,
      totalPages,
      guestSessionID,
      ratedMovies,
      ratedError,
      sessionTime,
    } = this.state

    return {
      movies,
      genres,
      searched,
      searchQuery,
      isLoading,
      errorMessage,
      currentPage,
      totalPages,
      guestSessionID,
      ratedMovies,
      ratedError,
      sessionTime,
      handleSearchChange: this.handleSearchChange,
      PageChange: this.PageChange,
      rateMovies: this.rateMovies,
    }
  }

  render() {
    const { children } = this.props
    return (
      <MovieContext.Provider value={this.getContextValue()}>
        <div>{children}</div>
      </MovieContext.Provider>
    )
  }
}
