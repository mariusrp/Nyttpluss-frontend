import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia as MuiCardMedia,
} from '@mui/material'
import { styled } from '@mui/system'
import { NewsType } from '../types/NewsType'

// Define your styled CardMedia component
const CardMedia = styled(MuiCardMedia)({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
})

export default function NewsFeed({ news }: { news: NewsType[] }) {
  return (
    <Container style={{ marginTop: 20 }}>
      <Grid container spacing={4}>
        {news.map((item: NewsType, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia image={item.imageUrl} title={item.title} />
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary' }}>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Published on: {item.pubDate}
                </Typography>
              </CardContent>
              <Button
                size="small"
                color="primary"
                href={item.link}
                target="_blank"
              >
                Read More
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
