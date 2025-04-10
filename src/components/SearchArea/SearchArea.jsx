import { Input } from 'antd'
import { MovieContext } from '../../Api/ApiService'
import './SearchArea.css'

export default function SearchArea() {
  return (
    <MovieContext.Consumer>
      {({ handleSearchChange }) => (
        <Input className="input" placeholder="Type to search..." onChange={handleSearchChange} />
      )}
    </MovieContext.Consumer>
  )
}
