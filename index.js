const tmi = require('tmi.js');
const fetch = require('node-fetch');
const fs = require('fs');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const player = require('play-sound')(opts = {});

// Import .env variables
require('dotenv').config();

// Google TTS Key File
const clientTTS = new TextToSpeechClient({
    keyFilename: process.env.GOOGLE_TTS_KEY,
});

//Twitch Data
const channelName = process.env.CHANNEL_NAME_TWITCH;
const oauthToken = process.env.OAUTH_TOKEN_TWITCH;

const tmiClient = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: channelName,
        password: 'oauth:' + oauthToken
    },
    channels: [channelName]
});

tmiClient.connect();

tmiClient.on('chat', async (channel, userstate, message, self) => {
    // Log all messages
    console.log(`${userstate['display-name']} : ${message}`);

    // Check if the message is a the bot name
    if (message.startsWith('@' + channelName) || message.startsWith('@' + channelName.toLowerCase())) {
        inputValue = userstate['display-name'] + ' : ' + message.substring(11);

        gpt(inputValue);
    }else{
        console.log("No message for " + channelName)
    }
});

// Google TTS part

// New variable to check if the audio is already playing
let isPlayingAudio = false;

const generateAudio = async (text) => {
  // If the audio is already playing, ignore the request
  if (isPlayingAudio) {
    console.log('Audio is already playing, ignoring request');
    return;
  }

  const requestTTS = {
    // The text to synthesize
    input: {
      text: text
    },

    // The language code and SSML Voice Gender
    voice: {
      'languageCode': 'fr-FR',
      'name': 'fr-FR-Neural2-D',
      'ssmlGender': 'MALE'
    },

    // The audio encoding type
    audioConfig: {
      audioEncoding: 'MP3'
    },
  };

  // The path to save the audio file
  const outputFileName = 'audio/output.mp3';

  // Synthesize the audio & save it to the output file
  try {
    const [response] = await clientTTS.synthesizeSpeech(requestTTS);

    const audioContent = response.audioContent;

    if (audioContent) {
      fs.writeFileSync(outputFileName, audioContent, 'binary');
      console.log(`Audio content successfully written to file: ${outputFileName}`);
    } else {
      console.log('Failed to get audio content');
    }

    // Define isPlayingAudio to true
    isPlayingAudio = true;

    // Play the audio file
    player.play(outputFileName, (err) => {
      if (err) {
        console.error(`Erreur lors de la lecture de l'audio: ${err}`);
        return;
      }
      console.log(`Audio joué avec succès`);

      // When the audio is finished, set isPlayingAudio to false
      isPlayingAudio = false;
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
};

// GPT-3.5 Part
let previousInput = '';
let isResponding = false;

async function gpt(input) {
    // Verify if the audio is already playing
    if (isPlayingAudio) {
        console.log('Lecture audio en cours, ignoring prompt');
        return;
    }

    // Check if the input is the same as the previous input
    if (input === previousInput) {
        console.log('Input is the same as the previous input, skipping API call.');
        return;
    }

    previousInput = input;

    // Wait for 1 second before making the API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isResponding) {
        console.log('Already responding, skipping API call.');
        return;
    }

    // Set isResponding to true
    isResponding = true;

    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 
                  "Your context here"
                },

                // The input from the chat
                { role: 'user', content: input }
            ]
        })
    });

    // Set isResponding to false
    isResponding = false;

    // Get the response from the API
    const data = await response.json();
    const text = data.choices[0].message.content;

    // Send the response to the chat in text
    tmiClient.say(channelName, text);

    // Use google text to speech (TTS) for listening the chatGPT response
    generateAudio(text);
}