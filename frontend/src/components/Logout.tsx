import { useContext } from 'react'
import GoogleLogout from 'react-google-login'
import { NewsContext } from '../NewsContext'

export default function Logout() {
  const { dispatch } = useContext(NewsContext)

  const clientId =
    '982600170260-kpulup0950u5fi5eonbb4hdi1ag9u71f.apps.googleusercontent.com'

  const onSuccess = () => {
    console.log('Logout Success')
    dispatch({ type: 'USER_SIGNOUT' })
  }

  const onFailure = () => {
    console.log('Logout Failed')
  }

  return (
    <div className="signin-button">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={false}
      />
    </div>
  )
}
