# OzLeRobot (OzTheRobot)

Created by Julien Le Gac, an independent Front End developer.
Twitter: Ozzlo_

You can see demo here : https://twitch.tv/OzLeRobot

## OpenAI API

To retrieve the API key for OpenAI, you need to follow these steps:

* Go to the login page on the OpenAI website: https://beta.openai.com/login/
* Log in to your OpenAI account or create one if you don't have one yet.
* Once logged in, go to the API page on the OpenAI website: https://beta.openai.com/docs/api-reference/introduction
* Click on your profile and go to "View API Keys"
* Create new secret key
* Add it to your .env file in the OPENAI_API_KEY variable.

## Twitch API

You need to go https://dev.twitch.tv/api/

* Create account or login in with Twitch
* Then go to the top right of the page to 'Your console'.
* In the right-hand side, click on 'Save your application'.
* Name your application and provide a redirect URL. For this example, we will use https://twitch.tv/OzLeRobot as the URL.
* After that, go to the URL https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://twitch.tv/OzLeRobot&response_type=code&scope=chat:read+chat:edit. This URL is divided into several parts. The first part is the Client ID, which corresponds to the one for your Twitch app. Then, the redirect_uri corresponds to the redirect URL that you defined in your app. The scope allows you to retrieve an OAuth token with the permissions you want, here to read and send messages on the chat. I invite you to read Twitch's documentation if you want to give more access.
* Then, in the redirect URL, you can notice a code inside. Retrieve it as your OAuth token. Add it to the OAUTH_TOKEN_TWITCH variable in your .env file.
* Add your Twitch channel name to the CHANNEL_NAME_TWITCH variable.

## Google Text-to-speech

Here, we are going to use the Google TTS API to have a more pleasant voice than the default one.

* Go to the Google Cloud Console at this URL: https://console.cloud.google.com/
* Create new project
* Install Text-to-speech in your project google cloud.
* Create your API by using only Text-to-speech in the 'API restrictions' when creating the API key.
* Download your credentials file.
* Add the credentiels file in your project when you want and add the path in your .env

## Init the project

Using a console, go to the project directory and execute these two commands:

* npm install
* node index.js

That's it! All you have to do now is to configure your OBS or any other software and have fun!