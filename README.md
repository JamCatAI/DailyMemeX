```markdown
# Twitter/X Bot - OAuth2 Tweet Automation

A Node.js-based Twitter (X) bot using OAuth2.0 that enables authentication, token refresh, and automated tweet posting using Twitter API v2.

---

## Features

- OAuth2.0 Authorization Code Flow (3-legged)
- Access and Refresh Token Management
- Tweet Posting via API
- Built using Express.js, dotenv, and got
- Easily extendable to build advanced Twitter bots

---

## Tech Stack

| Tech        | Version   | Description                 |
|-------------|-----------|-----------------------------|
| Node.js     | ≥ 18.x    | JavaScript runtime          |
| Express     | ^4.19.2   | Minimal web framework       |
| dotenv      | ^16.4.5   | Environment variable loader |
| got         | ^14.2.1   | Simplified HTTP requests    |

---

## Installation

```bash
git clone https://github.com/your-username/twitter-oauth-bot.git
cd twitter-oauth-bot
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-client-secret>
ACCESS_TOKEN=
REFRESH_TOKEN=
```

Leave `ACCESS_TOKEN` and `REFRESH_TOKEN` blank initially. They will be generated after completing the OAuth flow.

---

## Running the App

```bash
node index.js
```

---

## OAuth Setup

1. Navigate to `http://localhost:3000/auth` to initiate OAuth authorization.
2. Log in and authorize the app on Twitter.
3. After redirection to the callback, your `access_token` and `refresh_token` will be printed in the console.

---

## Refresh Token

To get new access and refresh tokens:

```
http://localhost:3000/refresh
```

This should be scheduled using a cron job in production to avoid token expiration issues.

---

## Posting a Tweet

Use the following endpoint to post a tweet:

```
http://localhost:3000/tweet/Your%20message%20here
```

This will post "Your message here" to the authenticated user's Twitter timeline.

---

## Project Structure

```
twitter-oauth-bot/
├── .env
├── package.json
└── index.js
```

---

## OAuth2.0 Workflow Summary

1. Redirect to Twitter's authorization endpoint with required scopes.
2. User logs in and authorizes the application.
3. Twitter redirects to your callback URL with a code.
4. Exchange the code for `access_token` and `refresh_token`.
5. Use `access_token` to authenticate API requests.

---

## Notes on Twitter API

- Posting tweets is currently **free** as of 2025.
- All other features (followers, user info, DMs, etc.) require a **paid subscription**.
- Twitter was rebranded as **X** under Elon Musk, aiming to become a multifunctional platform inspired by X.com, which later became PayPal.

---

## Advanced Ideas

- Persist tokens securely in a database
- Automatically refresh token in background with scheduled jobs
- Extend functionality to include likes, retweets, follows, replies
- Integrate webhook listeners for mentions and DMs

---

## Author

**Jam Cat**  
Developer | System Integrator | API Specialist  
Focused on scalable architecture and API automation

---

## License

MIT License
```
