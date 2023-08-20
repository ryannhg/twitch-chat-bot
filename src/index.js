const tmi = require('tmi.js')

const main = async () => {
  // 1️⃣ Check for environment variable before running
  if (!process.env.TWITCH_BOT_OAUTH_TOKEN) {
    return console.error(`Missing TWITCH_BOT_OAUTH_TOKEN variable`)
  }

  // 2️⃣ Connect to Twitch Chat
  const streamerUsername = 'ryan_the_rhg'
  const robotUsername = 'roborhg'

  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: robotUsername,
      password: process.env.TWITCH_BOT_OAUTH_TOKEN
    },
    channels: [streamerUsername]
  })

  client.connect().catch(console.error)

  // 3️⃣ Map a chat command to a JS function!
  let commands = {}

  commands['!source'] = ({ tags }) =>
    `@${tags.username} 🧑‍💻 https://github.com/elm-land/movies`

  commands['!movies'] = ({ tags }) =>
    `@${tags.username} 🍿 https://movies.elm.land`

  commands['!elm'] = ({ tags }) =>
    `@${tags.username} 🌳 https://elm-lang.org`

  commands['!elmland'] = ({ tags }) =>
    `@${tags.username} 🌈 https://elm.land`

  commands['!css-in-elm'] = ({ tags }) =>
    `@${tags.username} 🎨 https://www.npmjs.com/package/@ryannhg/css-in-elm`

  commands['!vitepress'] = ({ tags }) =>
    `@${tags.username} ⚡ https://vitepress.dev`

  commands['!sponsor'] = ({ tags }) =>
    `@${tags.username} 💖 You can support Ryan's work on GitHub: https://github.com/sponsors/ryannhg`

  commands['!rhg'] = ({ tags }) =>
    `@${tags.username} 🦊 https://rhg.dev`

  commands['!yt'] = ({ tags }) =>
    `@${tags.username} 📺 https://youtube.com/@rhg_dev`

  commands['!twitter'] = ({ tags }) =>
    `@${tags.username} 🐤 https://twitter.com/rhg_dev`

  commands['!github'] = ({ tags }) =>
    `@${tags.username} 🐙 https://github.com/ryannhg`

  commands['!blog'] = ({ tags }) =>
    `@${tags.username} ✍️ https://rhg.dev/blog`

  commands['!arcade'] = ({ tags }) =>
    `@${tags.username} 🎮 https://rhg.dev/arcade`

  commands['!jangle'] = ({ tags }) =>
    `@${tags.username} 🐶 https://jangle.io`

  commands['!socials'] = ({ tags }) =>
    `@${tags.username} 🐙 https://github.com/ryannhg 🐤 https://twitter.com/rhg_dev 📺 https://youtube.com/@rhg_dev`

  commands['!theclaw'] = ({ tags }) =>
    `@${tags.username} 🦞 https://www.twitch.tv/team/theclaw`

  commands['!so'] = ({ tags, message }) => {
    if (tags.username === streamerUsername) {
      let [_, rawUsername] = message.split(' ')
      if (rawUsername) {
        let username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername

        return `Go check out @${username} at https://twitch.tv/${username}`
      } else {
        console.warn(`The "!so" command requires a twitch username.`)
      }
    } else {
      console.warn(`The "!so" command cannot be sent by ${tags.username}.`)
    }
  }

  // Include a special `!help` command
  let dontShowThese = ['!so', '!help', '!commands']
  let notIncludedIn = (commandsToFind) => (command) =>
    !(commandsToFind.includes(command))

  commands['!help'] = ({ tags }) =>
    `@${tags.username}: here are all the chat commands: ${Object.keys(commands).filter(notIncludedIn(dontShowThese)).join(', ')}`

  commands['!commands'] = commands['!help']

  // 4️⃣ Listen for all Twitch messages
  client.on('message', (channel, tags, message, self) => {
    if (self) return // Ignore all messages from self

    const lowercasedFirstWord = message.toLowerCase().split(' ')[0]
    const matchingCommand = commands[lowercasedFirstWord]

    if (matchingCommand) {
      let response = matchingCommand({ tags, message })
      if (response) {
        client.say(channel, response)
      }
    }
  })
}

main()