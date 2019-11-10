# Installation

1. `npm install` the dependecies.
2. `npm start` the server.
3. Deploy the server on some cloud service.

Provide the following environment variables for proper functioning :

```
API_KEY='xxxxxx'
SLACK_TOKEN='xoxbxxxxxx'
```


# Making a Slack Bot

1. Create an App in your slack developer console [`https://api.slack.com/apps`] and Add it to your workspace. 
2. Go to `Bot Users` in your App settings and change Display Name and @handle of your bot and Save Changes.
3. Go to `Event Subscriptions` in your App settings and enable Events and Save Changes.
4. Put a 'Request URL' of your Server (any POST endpoint which returns the server challenege).

Request body of POST request coming from server will be :


```js
{
    "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    "type": "url_verification"
}

```

Response body should be JSON of format 

```js
{
     "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P"
}
```

This will make your `Request URL` verified. Now you can use this URL to receive all Events.

5. Below Request URL settings, you will find a section `Subscribe to Bot Events`. Here you can `Add bot event` which you want to subscribe on your request URL. There are many kind of events which you can checkout on Slack Docs.

6. Now you can go and install bot in your workspace. Go to Setting > Install App. Once you install the App you will also find `Bot User OAuth Access Token`. This token will be required when your server will make a Request to Slack server.

7. Now you can check your bot will appear on your slack workspace. You can try to find it by name and send some direct message.
8. To create some functionality to bot you have to receive the Events data on your request URL first, it will show like this :

```js

{
   "token": "8XcnrlP6KUm4eJsVsPjesESO",
   "team_id": "T0MGWJM1A",
   "api_app_id": "AKZKU7Q21",
   "event": {
      "client_msg_id": "ddcc9994-c5a9-47f6-a8bf-edea0369b529",
      "type": "message",
      "text": "hi man",
      "user": "U0MH2F7AN",
      "ts": "1561743178.000900",
      "team": "T0MGWJM1A",
      "channel": "DKZNBQKUM",
      "event_ts": "1561743178.000900",
      "channel_type": "im"
   },
   "type": "event_callback",
   "event_id": "EvKNASE71R",
   "event_time": 1561743178,
   "authed_users": [
      "UKZ851QLU"
   ]
}

```

Immediately send a response with status 200, this response will not show up in your slack workspace. It is just a confirmation to slack server.
For real response we have to performa a new request :

In above example you can see that event type is `message`. You can extract this event info and accordingly prepare a text response. This response you have to send via a POST api call to slack. 

```json

POST https://slack.com/api/chat.postMessage
Content-type: application/json
Authorization: Bearer YOUR_BOTS_TOKEN
{
    "text": "Hello! Knock, knock.",
    "channel": "CBR2V3XEX"
}

```

Above `YOUR_BOTS_TOKEN` is the bot token you can find in Install App or OAuth Sections. This will send back a response to mentioned channel in slack. You can extract channel info of sender from JSON body shown in step 8.