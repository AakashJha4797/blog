const express = require('express');
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const app = express();
require('dotenv').config();
const dbconfig = require('./config/dbConfig');
const usersRoutes = require("./routes/usersRoute");
const blogsRoute = require("./routes/blogsRoute");
const blogActionsRoute = require('./routes/blogActionsRoute');

app.use(express.json());
app.use('/api/users', usersRoutes)
app.use('/api/blogs', blogsRoute)
app.use('/api/blog-actions', blogActionsRoute)

const port = process.env.PORT || 4000;
const server = require("http").createServer(app);

// socket io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
    // join room
    socket.on("join", (userId) => {
        // console.log("joined", userId);
        socket.join(userId);
    });
    // listen for new notification
    socket.on("newNotification", (notification) => {
        socket.to(notification.userId).emit("newNotification", notification);
    });
});

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
});
