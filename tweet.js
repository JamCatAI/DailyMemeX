import Express from "express"
import got from "got"
import { config } from "dotenv"
config();

const TWITTER_AUTHORIZE_URL = "https://twitter.com/i/oauth2/authorize"
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token"
const CALLBACK_URL = "http://localhost:3000/callback"
const TWIITER_TWEET_URL = "https://api.twitter.com/2/tweets"

const PORT = 3000;
const app = Express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT);

app.get('/auth', (req, res) => {

    let redirectUrl = `${TWITTER_AUTHORIZE_URL}?response_type=code
                        &client_id=${process.env.CLIENT_ID}
                        &redirect_uri=${CALLBACK_URL}
                        &scope=tweet.read%20tweet.write%20users.read%20follows.read%20offline.access
                        &state=1234
                        &code_challenge=challenge
                        &code_challenge_method=plain`

    res.redirect(redirectUrl);
})

app.get('/callback', async (req, res) => {

    let password = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    
    const body = {
        form: {
            code: req.query.code,
            redirect_uri: CALLBACK_URL,
            grant_type: "authorization_code",
            code_verifier: "challenge"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${Buffer.from(password).toString("base64")}`
        }
    }

    const response = await got.post(TWITTER_TOKEN_URL, body).json();

    console.log(response.access_token);
    console.log(response.refresh_token);

    res.send("Success");
})

app.get('/refresh', async (req, res) => {

    let password = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    
    const body = {
        form: {
            refresh_token: process.env.REFRESH_TOKEN,
            grant_type: "refresh_token"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${Buffer.from(password).toString("base64")}`
        }
    }

    const response = await got.post(TWITTER_TOKEN_URL, body).json();

    console.log(response.access_token);
    console.log(response.refresh_token);

    res.send("Success");
})

app.get('/tweet/:message', async (req, res) => {

    const body = {
        json: {
            "text": req.params.message
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
        }
    }

    const response = await got.post(TWIITER_TWEET_URL, body).json();

    res.send(response);
})