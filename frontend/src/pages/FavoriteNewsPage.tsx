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
  CircularProgress,
} from '@mui/material'
import { NewsContext } from '../NewsContext'
import { useNavigate } from 'react-router-dom'
import { NewsType } from '../types/NewsType'

import { RxCross1 } from 'react-icons/rx'

export default function FavoriteNewsPage() {
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()
  const [favoriteNews, setFavoriteNews] = React.useState<NewsType[]>([])
  const { state } = useContext(NewsContext)
  const { user } = state

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const fetchFavoriteNews = async () => {
    setLoading(true) // set loading to true before fetching

    try {
      const response = await fetch(
        `https://nyttpluss.azurewebsites.net/user/${user?.userId}/favorites`
      )
      const data = await response.json()
      setFavoriteNews(data)
    } catch (error) {
      console.error('Failed fetching favorite news:', error)
    }

    setLoading(false) // set loading to false once fetching is complete
  }

  React.useEffect(() => {
    fetchFavoriteNews()
  }, [])

  const handleNewsClick = (item: NewsType) => {
    window.open(item.link, '_blank')
  }

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ')
    return (
      words.slice(0, maxWords).join(' ') +
      (words.length > maxWords ? '...' : '')
    )
  }

  const removeFromFavorites = async (e: React.MouseEvent, item: NewsType) => {
    e.stopPropagation() // Stop the event from bubbling up

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

      if (response.ok) {
        // Check if the response is successful
        fetchFavoriteNews() // Refetch the favorite news
      } else {
        console.error('Failed to delete favorite:', await response.text())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h4" component="div">
          Favoritter
        </Typography>
      </Box>

      <Container>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {favoriteNews.map((item: NewsType, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    position: 'relative',
                    marginX: 'auto',
                    marginY: 2,
                    backgroundColor: 'background.paper',
                    padding: 2,
                    height: '100%',
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
                      height: 400,
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
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ mb: 2, fontSize: 30 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ mb: 2, fontSize: 20 }}
                    >
                      {truncateText(item.description, 20)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Published on: {item.pubDate}
                    </Typography>
                  </CardContent>{' '}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: 1,
                    }}
                  >
                    <Tooltip title="Fjern fra Favoritter" arrow>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          padding: 1,
                          position: 'absolute', // Change from flex
                          right: 8, // Adjust as needed
                          bottom: 8, // Adjust as needed
                        }}
                      >
                        <RxCross1
                          style={{
                            fontSize: '28px',
                            zIndex: 2,
                            color: 'grey',
                          }}
                          onClick={(e) => removeFromFavorites(e, item)}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  )
}
