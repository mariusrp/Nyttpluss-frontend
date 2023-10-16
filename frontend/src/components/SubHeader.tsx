import React, { useContext } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Menu,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { NewsContext } from '../NewsContext'
import { SelectChangeEvent } from '@mui/material'
import { DistrictType } from '../types/DistrictType'
import { Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(NewsContext)
  const { user } = state

  const districts: DistrictType[] = [
    'norge',
    'innlandet',
    'mr',
    'nordland',
    'rogaland',
    'sorlandet',
    'tromsogfinnmark',
    'trondelag',
    'vestfoldogtelemark',
    'vestland',
  ]

  const getDistrictDisplayName = (district: DistrictType): string => {
    switch (district) {
      case 'norge':
        return 'Norge'
      case 'innlandet':
        return 'Innlandet'
      case 'mr':
        return 'Møre og Romsdal'
      case 'nordland':
        return 'Nordland'
      case 'rogaland':
        return 'Rogaland'
      case 'sorlandet':
        return 'Sørlandet'
      case 'tromsogfinnmark':
        return 'Troms og Finnmark'
      case 'trondelag':
        return 'Trøndelag'
      case 'vestfoldogtelemark':
        return 'Vestfold og Telemark'
      case 'vestland':
        return 'Vestland'
      default:
        return district
    }
  }

  const handleDistrictChange = (event: SelectChangeEvent<string>) => {
    dispatch({
      type: 'DISTRICT_CHANGE',
      payload: event.target.value as DistrictType,
    })
  }

  const handleLogout = () => {
    dispatch({ type: 'USER_SIGNOUT' })
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const goToMyFavorites = () => {
    navigate('/favorite-news')
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Nav.Link href="/">NyttPluss</Nav.Link>
        </Typography>
        <Select
          value={state.district}
          onChange={handleDistrictChange}
          style={{ marginRight: 20 }}
        >
          {districts.map((district) => (
            <MenuItem value={district} key={district}>
              {getDistrictDisplayName(district)}
            </MenuItem>
          ))}
        </Select>
        {user ? (
          <div>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <Badge color="primary">
                <AccountCircle />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem onClick={goToMyFavorites}>Mine Favoritter</MenuItem>
              <MenuItem onClick={handleLogout}>Logg ut</MenuItem>
            </Menu>
          </div>
        ) : (
          <Typography
            sx={{
              ':hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  )
}
