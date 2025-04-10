import './App.css'
import ApiService from './Api/ApiService'
import MovieTabs from './components/MovieTabs/MovieTabs'

function App() {
  return (
    <div className="App">
      <ApiService>
        <MovieTabs />
      </ApiService>
    </div>
  )
}

export default App
