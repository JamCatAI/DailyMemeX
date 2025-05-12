import Express from 'express'
import got from 'got'
import { config } from 'dotenv'
config()

const app = Express()
const PORT = 3000

const TWITTER_AUTHORIZE_URL = 'https://twitter.com/i/oauth2/authorize'
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'
const TWEET_ENDPOINT = 'https://api.twitter.com/2/tweets'
const CALLBACK_URL = process.env.REDIRECT_URI
const SCOPES = 'tweet.read tweet.write users.read offline.access'

let code_verifier = 'jamcat_challenge'
let access_token = process.env.ACCESS_TOKEN || ''
let refresh_token = process.env.REFRESH_TOKEN || ''

app.get('/', (req, res) => {
  res.send('✅ JamCatBot ready — go to /auth to begin OAuth')
})

app.get('/auth', (req, res) => {
  const redirectUrl =
    `${TWITTER_AUTHORIZE_URL}?response_type=code&client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${CALLBACK_URL}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&state=jamcat123&code_challenge=${code_verifier}&code_challenge_method=plain`

  res.redirect(redirectUrl)
})

app.get('/callback', async (req, res) => {
  const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

  const response = await got.post(TWITTER_TOKEN_URL, {
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: CALLBACK_URL,
      code_verifier: code_verifier
    },
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).json()

  access_token = response.access_token
  refresh_token = response.refresh_token

  console.log('✅ ACCESS TOKEN:', access_token)
  console.log('🔁 REFRESH TOKEN:', refresh_token)

  res.send('🔐 Tokens received. Now hit /tweet/YourMessage')
})

app.get('/refresh', async (req, res) => {
  const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

  const response = await got.post(TWITTER_TOKEN_URL, {
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).json()

  access_token = response.access_token
  refresh_token = response.refresh_token

  console.log('♻️ New ACCESS TOKEN:', access_token)
  console.log('♻️ New REFRESH TOKEN:', refresh_token)

  res.send('♻️ Token refreshed')
})

app.get('/tweet/:message', async (req, res) => {
  try {
    const tweetRes = await got.post(TWEET_ENDPOINT, {
      json: { text: req.params.message },
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    }).json()

    console.log('✅ Tweet sent:', tweetRes)
    res.send(tweetRes)
  } catch (err) {
    console.error('❌ Failed to tweet:', err.response?.body || err.message)
    res.status(403).send('❌ Forbidden: Check your access token scope or tier')
  }
})

app.listen(PORT, () => {
  console.log(`🚀 JamCatBot running on http://localhost:${PORT}`)
})
