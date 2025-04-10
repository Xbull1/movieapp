import { Component } from 'react'
import './Cards.css'
import { Card, Tag, Typography, Progress, Rate } from 'antd'
import { format } from 'date-fns'
import defPoster from '../../assets/ufq3R83KzCg.jpg'
import { MovieContext } from '../../Api/ApiService'

const { Text, Paragraph } = Typography

class Cards extends Component {
  static cutDescription(description, length) {
    if (description.length <= length) {
      return description
    }
    const trimmedDescription = description.slice(0, length)
    return `${trimmedDescription.slice(0, Math.min(trimmedDescription.length, trimmedDescription.lastIndexOf(' ')))}...`
  }

  static formatDate(releaseDate) {
    if (!releaseDate) {
      return 'data absent'
    }
    const date = new Date(releaseDate)
    return format(date, 'MMMM dd, yyyy')
  }

  handleRateChange = (value) => {
    const { rateMovies } = this.context
    const { id } = this.props
    if (rateMovies && id) {
      rateMovies({ id }, value)
    }
  }

  render() {
    const { title, description, releaseDate, genres, bannerUrl, rating, userRating } = this.props
    const trimmedDescription = Cards.cutDescription(description, 170)
    const creationDate = Cards.formatDate(releaseDate)
    let ratingColor
    if (rating >= 7) {
      ratingColor = '#66E900'
    } else if (rating >= 5) {
      ratingColor = '#E9D100'
    } else if (rating >= 3) {
      ratingColor = '#E97E00'
    } else {
      ratingColor = '#E90000'
    }

    return (
      <Card className="cards">
        <img
          className="cards__image"
          alt="poster"
          src={bannerUrl || defPoster}
          onError={(e) => {
            e.currentTarget.src = defPoster
          }}
        />
        <div className="cards__content">
          <div className="cards__content-header">
            {title}
            <Progress
              type="circle"
              percent={rating * 10}
              size={40}
              format={() => rating.toFixed(1)}
              className="cards__content-rating"
              strokeColor={ratingColor}
            />
          </div>
          <Text type="secondary" className="cards__content-date">
            {creationDate}
          </Text>
          <div className="cards__content-tag">
            {genres.map((genre) => (
              <Tag key={genre}>{genre}</Tag>
            ))}
          </div>
          <Paragraph className="cards__content-description">{trimmedDescription}</Paragraph>
          <Rate allowHalf count={10} value={userRating} onChange={this.handleRateChange} className="cards__rate" />
        </div>
      </Card>
    )
  }
}

Cards.contextType = MovieContext

export default Cards
