import http from "http";
import  socketIO from "socket.io";
import express from "express";
import { type } from "express/lib/response";
import { parse } from "path";
import { instrument } from "@socket.io/admin-ui";
import { Http2ServerRequest } from "http2";
import { Socket } from "dgram";
import { doesNotMatch } from "assert";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home2"));
app.get("/*", (_, res)=> res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = socketIO(httpServer);

wsServer.on("connection", (socket2) =>{
    socket2.on("join_room", (roomName, done) =>{
        socket2.join(roomName);
        socket2.to(roomName).emit("welcome");
    });
    socket2.on("offer", (offer, roomName)=>{
      socket2.to(roomName).emit("offer", offer);  
    });
    socket2.on("answer", (answer, roomName)=>{
        socket2.to(roomName).emit("answer", answer);
    });
    socket2.on("ice", (ice, roomName)=>{
        socket2.to(roomName).emit("ice", ice);
    });
});

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);