import { useContext } from 'react'
import { NewsContext } from '../NewsContext'

export default function NewDesignLogout() {
  const { dispatch } = useContext(NewsContext)

  const handleLogout = () => {
    dispatch({ type: 'USER_SIGNOUT' })
  }

  return (
    <div>
      <p onClick={handleLogout}>Logout</p>
    </div>
  )
}
