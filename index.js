const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 20 * 1000, // 15 minutes
    max: 2
  });

const server = express();


server.use(bodyParser.json());
server.use(cors());

let matches = []
server.set('trust proxy', 1);
server.use(apiLimiter);

//For Challenge
server.post("/talk",(req,res)=>{
res.json({"challenge":req.body.challenge});
});


server.post("/talkx",(req,res)=>{
    console.log(req.body.event);
    if(req.body.event.text.indexOf('score')>=0){
        axios.get('https://cricapi.com/api/matches?apikey='+process.env.API_KEY).then(response=>{
            console.log(response.data.matches)
            matches = response.data.matches.map((match)=>{return {id:match.unique_id,match:match['team-1']+"-"+match['team-2']}});
            console.log(matches);


            axios.post('https://slack.com/api/chat.postMessage',{
                "text": "Choose a Match and Send me 'match <number>' : "+ matches.map((obj,i)=>(i+1)+". "+obj.match).join(" | "),
                "channel": req.body.event.channel
            },{headers:{ 'Content-type': 'application/json','Authorization': 'Bearer '+process.env.SLACK_TOKEN}}).then(
                (res)=>{console.log(res.data)}
                )

        })
    }

    if(req.body.event.text.indexOf('match')>=0){
        console.log(matches[parseInt(req.body.event.text.split(" ")[1])-1].id)
        axios.get('https://cricapi.com/api/cricketScore?apikey='+process.env.API_KEY+'&unique_id='+matches[parseInt(req.body.event.text.split(" ")[1])-1].id).then(response=>{
            console.log(response.data.score)
     
            axios.post('https://slack.com/api/chat.postMessage',{
                "text": response.data.score,
                "channel": req.body.event.channel
            },{headers:{ 'Content-type': 'application/json','Authorization': 'Bearer '+process.env.SLACK_TOKEN}}).then(
                (res)=>{console.log(res.data)}
                )


        })
    }

    
    res.json({challenge:req.body.challenge})
})

server.listen(process.env.PORT || 8080,(req,res)=>{
    console.log("server started");
})