import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='207282515134-j40eee1sp4146njfdqfkpdamal132kn1.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
)
