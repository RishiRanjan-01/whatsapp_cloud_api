const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
// app.use(express.json());
app.use(bodyParser.json());

const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(process.env.PORT || 8080, () => {
    console.log('Server listening on port 8080');
})

app.get("/webhook", (req,res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challange"];
    let token = req.query["hub.verify_token"];


    if(mode && token){
        if(mode === "subscribe" && token === myToken){
            res.status(200).send(challange);
        }
        else{
            res.status(403).send("Forbidden");
        }
    }

});

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        if(body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.message && body_param.entry[0].changes[0].value.message[0]){

            let phoneNo_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].body;

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v15.0/"+phoneNo_id+"/message?access_token="+token,
                data:{
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body: "Hi I am Rishi"
                    }
                },
                Headers:{
                    "Content-Type": "application/json"
                }
            });
            res.status(200);
        }
        else{
            response.sendStatus(404)
        }
    }

});