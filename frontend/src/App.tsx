import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

import NavigationBar from './components/NavigationBar'
import { NewsProvider } from './NewsContext'
import NewDesignLogin from './pages/LoginPage'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Box } from '@mui/material'
import FavoriteNewsPage from './pages/FavoriteNewsPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#EFF2F4', // Blue
    },
    secondary: {
      main: '#dc004e', // Red
    },
    background: {
      default: '#fff',
      paper: '#EFF2F4',
    },
    text: {
      primary: '#000',
      secondary: '#6c757d',
    },
    // ...other colors
  },
  // ...other theme options
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NewsProvider>
        <Router>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              minHeight: '100vh',
            }}
          >
            <NavigationBar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<NewDesignLogin />} />
              <Route path="favorite-news" element={<FavoriteNewsPage />} />
            </Routes>
          </Box>
        </Router>
      </NewsProvider>
    </ThemeProvider>
  )
}

export default App
