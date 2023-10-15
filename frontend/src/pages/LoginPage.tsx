import { useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { ResponseType } from '../types/ResponseType'
import { UserObjectType } from '../types/UserObjectType'
import { NewsContext } from '../NewsContext'
import { useNavigate } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { Button, CardBody, CardText, CardTitle, Input, Label } from 'reactstrap'
declare const google: any
export default function NewDesignLogin() {
  const { dispatch } = useContext(NewsContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  function handleCredentialResponse(response: ResponseType) {
    const userObject: UserObjectType = jwtDecode(response.credential)
    console.log(JSON.stringify(userObject))
    fetch('https://nyttpluss.azurewebsites.net/user/login-or-create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: userObject.sub,
        NormalizedUserName: userObject.name.toUpperCase(),
        NormalizedEmail: userObject.email.toUpperCase(),
        EmailConfirmed: userObject.email_verified,
        PasswordHash: null,
        SecurityStamp: null,
        ConcurrencyStamp: userObject.jti,
        PhoneNumber: null,
        PhoneNumberConfirmed: false,
        TwoFactorEnabled: false,
        LockoutEnd: null,
        LockoutEnabled: false,
        AccessFailedCount: 0,
        Email: userObject.email,
        UserName: userObject.name,
        ProfilePictureUrl: userObject.picture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'USER_SIGNIN', payload: data.user })
        navigate('/')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        '982600170260-kpulup0950u5fi5eonbb4hdi1ag9u71f.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    })

    google.accounts.id.renderButton(document.getElementById('signInDiv')!, {
      theme: 'outline',
      size: ' large',
      text: 'signin_with',
      width: '360',
      height: '60',
      shape: 'pill',
      logo_alignment: 'center',
      useOneTap: true,
    })
  }, [])

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <Card
        className="login-box"
        style={{ borderRadius: '20px', width: '400px' }}
      >
        <CardBody>
          <CardTitle
            className="mb-2 text-left font-weight-bold font-size-lg"
            style={{ fontSize: '2em' }}
          >
            Sign in
          </CardTitle>
          <CardText className="mb-2 text-left text-muted">
            Create an account or signin
          </CardText>
          <p className="mb-5 text-left text-muted small">
            By creating an account or logging in, you understand and acknowledge
            our <a href="#">Cookie</a> and <a href="#">Privacy</a> policies.
          </p>
          <div
            id="signInDiv"
            className="google-signin-button mb-3"
            style={{ borderRadius: '20px', width: '100%', height: '60px' }}
          ></div>
          <div className="or-separator">
            <div className="line"></div>
            <div className="or-text text-muted small">OR</div>
            <div className="line"></div>
          </div>
          <Label className="mt-3 text-left">Email Address *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-3"
            style={{ borderRadius: '20px' }}
          />
          <Button color="primary" block style={{ borderRadius: '20px' }}>
            Continue with Email
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
