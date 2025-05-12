const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const BEARER = process.env.BEARER_TOKEN
const MEME_FOLDER = './memes'
const CAPTION_FILE = './captions.txt'

async function uploadMedia(filePath) {
  const mediaData = new FormData()
  mediaData.append('media', fs.createReadStream(filePath))
  const res = await axios.post('https://upload.twitter.com/1.1/media/upload.json', mediaData, {
    headers: {
      ...mediaData.getHeaders(),
      Authorization: `Bearer ${BEARER}`
    }
  })
  return res.data.media_id_string
}

async function postTweet(text, media_id) {
  const body = { text, media: { media_ids: [media_id] } }
  await axios.post('https://api.twitter.com/2/tweets', body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER}`
    }
  })
}

function getRandomFile() {
  const files = fs.readdirSync(MEME_FOLDER)
  const memes = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
  return path.join(MEME_FOLDER, memes[Math.floor(Math.random() * memes.length)])
}

function getRandomCaption() {
  const lines = fs.readFileSync(CAPTION_FILE, 'utf-8').split('\n').filter(Boolean)
  return lines[Math.floor(Math.random() * lines.length)]
}

async function runBot() {
  for (let i = 0; i < 10; i++) {
    const memePath = getRandomFile()
    const caption = getRandomCaption()
    const mediaId = await uploadMedia(memePath)
    await postTweet(caption, mediaId)
    await new Promise(res => setTimeout(res, 30000 + Math.random() * 30000))
  }
}

runBot()
