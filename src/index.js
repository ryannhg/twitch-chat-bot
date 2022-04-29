const tmi = require('tmi.js')
const streamer = 'ryan_the_rhg'

const main = async () => {
  // 1️⃣ Check for environment variable before running
  if (!process.env.TWITCH_BOT_OAUTH_TOKEN) {
    return console.error(`Missing TWITCH_BOT_OAUTH_TOKEN variable`)
  }

  // 2️⃣ Connect to Twitch Chat
  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: 'roborhg',
      password: process.env.TWITCH_BOT_OAUTH_TOKEN
    },
    channels: [streamer]
  })

  client.connect().catch(console.error)


  // 3️⃣ Map a chat command to a JS function!
  let commands = {}

  commands['!elm'] = ({ tags }) =>
    `@${tags.username}: Elm is a friendly language that compiles to HTML/CSS/JS, learn more here: https://elm-lang.org`

  commands['!socials'] = ({ tags }) =>
    `@${tags.username}: 🐙 https://github.com/ryannhg 🐤 https://twitter.com/rhg_dev`

  commands['!uno'] = ({ tags }) =>
    `@${tags.username}: Play our Uno game here: https://uno.rhg.dev`

  commands['!storybook'] = ({ tags }) =>
    `@${tags.username}: View our Storybook here: https://elm-storybook.rhg.dev`

  commands['!source'] = ({ tags }) =>
    `@${tags.username}: Here's the source code: https://github.com/ryannhg/elm-storybook/tree/evergreen`

  commands['!demo'] = ({ tags }) =>
    `@${tags.username}: View our Storybook here: https://elm-storybook.rhg.dev`

  commands['!claw'] = ({ tags }) =>
    `@${tags.username}: Check out THE CLAW!! https://www.twitch.tv/team/theclaw`

  commands['!so'] = ({ tags, message }) => {
    if (tags.username === streamer) {
      let [_, rawUsername] = message.split(' ')
      if (rawUsername) {
        let username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername

        return `Go check out @${username} at https://twitch.tv/${username}`
      } else {
        console.warn(`The !so command requires a twitch username.`)
      }
    } else {
      console.warn(`The !so command cannot be sent by ${tags.username}.`)
    }
  }

  commands['!help'] = ({ tags }) =>
    `@${tags.username}: here are all the chat commands: ${Object.keys(commands).join(', ')}`


  // 4️⃣ Listen for all Twitch messages
  client.on('message', (channel, tags, message, self) => {
    if (self) return // Ignore all messages from self

    const matchingCommand = commands[message.toLowerCase().split(' ')[0]]

    if (matchingCommand) {
      let response = matchingCommand({ tags, message })
      if (response) {
        client.say(channel, response)
      }
    }
  })
}

main()