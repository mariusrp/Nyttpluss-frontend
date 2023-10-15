import React, { useContext } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
  Box,
  Tooltip,
} from '@mui/material'
import { NewsType } from '../types/NewsType'
import { NewsContext } from '../NewsContext'
import Subheader from '../components/SubHeader'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [news, setNews] = React.useState([])
  const [likedNews, setLikedNews] = React.useState<Set<number>>(new Set())

  const { state } = useContext(NewsContext)
  const { category, district, user } = state
  const navigate = useNavigate()

  const fetchNews = async () => {
    let url = `https://nyttpluss.azurewebsites.net/api/rss/fetch-rss/${category}/toppsaker`
    if (district === 'norge') {
      url = `https://nyttpluss.azurewebsites.net/api/rss/fetch-rss/${category}/toppsaker`
    }
    if (category === 'alle') {
      url = `https://nyttpluss.azurewebsites.net/api/rss/fetch-rss/${district}/toppsaker`
    }
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    setNews(data)
  }

  const handleIconClick = (
    event: React.MouseEvent<HTMLElement>,
    item: NewsType,
    index: number
  ) => {
    event.stopPropagation()
    if (user) {
      if (likedNews.has(index)) {
        const newSet = new Set(likedNews)
        newSet.delete(index)
        setLikedNews(newSet)
        removeFromFavorites(item)
      } else {
        setLikedNews(new Set([...likedNews, index]))
        saveNewsToFavorites(item)
      }
    } else {
      navigate('/login')
    }
  }

  const removeFromFavorites = async (item: NewsType) => {
    try {
      const response = await fetch(
        `https://nyttpluss.azurewebsites.net/user/${user?.userId}/favorites/${item.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        }
      )
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const saveNewsToFavorites = async (item: NewsType) => {
    try {
      const response = await fetch(
        `https://nyttpluss.azurewebsites.net/user/${user?.userId}/favorites`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        }
      )

      if (response.status === 200) {
        // Successful response, you can update the UI or show a notification
        console.log('News added to favorites')
      } else {
        // Handle the error, e.g., display an error message
        console.error('Failed to add news to favorites')
      }
    } catch (error) {
      console.error('Error while adding news to favorites', error)
    }
  }

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ')
    return (
      words.slice(0, maxWords).join(' ') +
      (words.length > maxWords ? '...' : '')
    )
  }

  const getMaxWords = (xs: number) => {
    switch (xs) {
      case 12:
        return 30 // Set the maximum word limit for full-width items
      case 6:
        return 20 // Set the maximum word limit for half-width items
      case 4:
        return 10 // Set the maximum word limit for one-third-width items
      default:
        return 10
    }
  }

  const getFontSize = (textLength: number) => {
    if (textLength <= 7) {
      return 40
    } else {
      return 30
    }
  }

  const handleNewsClick = (item: NewsType) => {
    window.open(item.link, '_blank')
  }

  React.useEffect(() => {
    fetchNews()
  }, [category, district])

  const layouts = [
    [12], // one full-width item
    [6, 6], // two half-width items
    [4, 4, 4], // three one-third-width items
  ]

  let layoutIndex = 0
  let layout = layouts[layoutIndex]
  let currentLayoutItem = 0

  let rowNumber = 0

  return (
    <div>
      <Subheader />
      <Container>
        <Grid container spacing={2}>
          {news.map((item: NewsType, index: number) => {
            const xs = layout[currentLayoutItem]
            const maxWords = getMaxWords(xs)
            const fontSize = getFontSize(item.title.split(' ').length)
            const imageHeight = xs === 12 ? 500 : 400

            const isSingleItemRow = rowNumber % 4 === 0 || rowNumber % 4 === 3
            const sm = isSingleItemRow ? 12 : 6

            if (isSingleItemRow || index % 2 !== 0) {
              rowNumber += 1
            }
            currentLayoutItem += 1
            if (currentLayoutItem >= layout.length) {
              currentLayoutItem = 0
              layoutIndex = (layoutIndex + 1) % layouts.length
              layout = layouts[layoutIndex]
            }

            return (
              <Grid item xs={12} sm={sm} md={xs} key={index}>
                <Card
                  sx={{
                    display: 'flex', // Make this a flex container
                    flexDirection: 'column', // Arrange children vertically
                    marginX: 'auto',
                    marginY: 2,
                    backgroundColor: 'background.paper',
                    padding: 2,
                    height: '100%', // Occupy the full height
                    border: 'none',
                    boxShadow: 0,
                    borderRadius: 8,
                    ':hover': {
                      boxShadow: 4,
                      cursor: 'pointer',
                      '& img': {
                        filter: 'brightness(1.1)',
                        transition: 'filter 0.3s ease-in-out',
                      },
                    },
                  }}
                  onClick={() => handleNewsClick(item)}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: imageHeight,
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                    image={
                      item.videoUrl
                        ? item.videoUrl.replace('/video/', '/thumbnail/')
                        : item.imageUrl
                    }
                    title={item.title}
                  />
                  <CardContent
                    sx={{
                      flex: 1, // This makes the CardContent grow to occupy all available space
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ mb: 2, fontSize: fontSize }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ mb: 2, fontSize: 20 }}
                    >
                      {truncateText(item.description, maxWords)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published on: {item.pubDate}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: 1,
                    }}
                  >
                    <Tooltip title="Legg til Favoritter" arrow>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          padding: 1,
                        }}
                      >
                        {likedNews.has(index) ? (
                          <AiFillHeart
                            style={{
                              fontSize: '28px',
                              zIndex: 2,
                              color: 'red',
                            }}
                            onClick={(e: React.MouseEvent<HTMLElement>) =>
                              handleIconClick(e, item, index)
                            }
                          />
                        ) : (
                          <AiOutlineHeart
                            style={{
                              fontSize: '28px',
                              zIndex: 2,
                              color: likedNews.has(index) ? 'red' : 'grey',
                              '&:hover': { color: 'red' },
                            }}
                            onClick={(e: React.MouseEvent<HTMLElement>) =>
                              handleIconClick(e, item, index)
                            }
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </div>
  )
}
