const express = require('express');
const cors = require('cors');
require('dotenv').config()
const matchmaking = require('./MatchMaking');
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 5000
const Log = require('debug')('server');
const io = require("socket.io")(http);
const socketEvents = require("./Utility/Constant").gameplayEvents;
const commonVar = require("./Utility/Constant").commonVar;
const gameCategory = require("./Utility/Constant").gameCategory;
const sendSocket = require("./Gameplay/Ludo").GetSocket;
const CreatePrivateRoom = require('./PrivateRoom').CreatePrivateRoom;
const JoinPrivateRoom = require('./PrivateRoom').JoinPrivateRoom;
const SendConnectionRequest = require('./PawnColourAssigner').SendRequestConnection
const conn = require('./config/db')

const gamePlaY = require('./src/GamePlayData/gamePlay')

const bcrypt = require('bcrypt');
const check = require('./src/validation/CheckValidation')

sendSocket(io);
app.use(express.static('public'))
app.use(cors())
app.get("/servertesting", (req, res) => {
  res.sendFile(path.join(__dirname + '/test.html'));
});
let message = null
let statusCode = 400
let error = {}
io.on("connection", (socket) => {
  console.log('connected', socket.id)
  // Log("someone connected " + socket.id)
  OnMatchMaking(socket)
  OnPrivateRoomRequest(socket)
  OnJoinPrivateRoomRequested(socket)
  OnDisconnected(socket)
  ReConnected(socket)
  //Game play
  playOnline(socket)
  gameEntry(socket)
 
});

function playOnline(socket) {
  socket.on('playOnline', async function (data) {
    if (gameCategory.type1 == data.types) {
      console.log('battle', gamePlaY.onebattle)
      socket.emit('onlineData', gamePlaY)
    }
    else if (gameCategory.type2 == data.types) {
      console.log('OneWinner', gamePlaY.oneWinner)
      socket.emit('onlineData', gamePlaY)
    }
    else if (gameCategory.type3 == data.types) {
      console.log('TwoWinners', gamePlaY.twoWinner)
      socket.emit('onlineData', gamePlaY)
    }
    else if (gameCategory.type4 == data.types) {
      console.log('ThreeWinners', gamePlaY)
      socket.emit('onlineData', gamePlaY)
    } else {
      console.log('ThreeWinners', gamePlaY.allData)
    }

  })
}
function gameEntry(socket) {
  socket.on("gameEntry", (data) => {
    //GAme entry
    console.log(data)
  });
}
// function OnLogin(socket) {
//   console.log('socket Id', socket.id)
// }
function OnDisconnected(socket) {
  socket.on("disconnect", () => {
    let id = socket.username !== undefined ? socket.username : socket.id;
    Log("someone disconnect " + id)
  });
}

function OnMatchMaking(socket) {
  socket.on(socketEvents.OnMatchMaking, (data) => {
    socket.playerId = data[commonVar.playerId];
    socket.username = data[commonVar.username];
    let obj = {
      socket: socket,
      data: data
    }
    Log(data[commonVar.username] + " requested making ");
    Log(data)
    matchmaking(obj);
  });
}

function OnPrivateRoomRequest(socket) {
  socket.on(socketEvents.OnPrivateRoomRequest, (data) => {
    Log("Private room request");
    socket.playerId = data[commonVar.playerId];
    socket.username = data[commonVar.username];
    let obj = {
      socket: socket,
      data: data
    }
    CreatePrivateRoom(obj);
  });
}
function OnJoinPrivateRoomRequested(socket) {
  socket.on(socketEvents.OnJoinPrivateRoomRequested, (data) => {
    Log("join Private room request");
    socket.playerId = data[commonVar.playerId];
    socket.username = data[commonVar.username];
    let obj = {
      socket: socket,
      data: data,
      roomName: data[commonVar.roomName]
    };

    JoinPrivateRoom(obj);
  });
}
function ReConnected(socket) {
  socket.on(socketEvents.OnGameRejoiningRequest, (data) => {
    Log("Got reconnection request " + data[commonVar.username]);
    socket.username = data.username;
    let obj = {
      socket: socket,
      playerId: data[commonVar.playerId],
      username: data[commonVar.username],
      roomName: data[commonVar.roomName]
    }
    SendConnectionRequest(obj);
  });
}
http.listen(port, () => {
  Log("Server listening on port =>", port);
})

// login & Sign up
  // OnLogin(socket)
  // Login & Sign up
      // socket.on('OnLogin', async function (data) {
      //   console.log('connection ID', data)
      //   try {
      //     const formData = {
      //       username: req.body.username,
      //       email: '',
      //       password: req.body.password
      //     };

      //     // Check requeted user is exist or not
      //     let sql = `SELECT * FROM users WHERE LOWER(username)= ? limit ?`;
      //     let user = await conn.query(sql, [formData.username.toLowerCase(), 1]);
      //     console.log('user', user)
      //     if (user.length > 0) {
      //       const usersRows = (JSON.parse(JSON.stringify(user))[0]);
      //       const comparison = await bcrypt.compare(formData.password, usersRows.password)
      //       if (comparison) {
      //         const webtoken = await Token.generateAuthToken(usersRows.id)
      //         console.log('webtoken', webtoken)
      //         statusCode = 200
      //         message = 'Login success'
      //         tokens = webtoken
      //       } else {
      //         statusCode = 401
      //         message = 'Login failed'
      //         error.password = "Password does not match!"
      //       }
      //     } else {
      //       statusCode = 404
      //       message = 'Login failed'
      //       error.password = "Username does not exist!"
      //     }
      //     const responseData = {
      //       status: statusCode,
      //       message,
      //       token: tokens,
      //       errors: error
      //     }
      //     socket.emit('SuccessOr', responseData)
      //   } catch (e) {
      //     console.log(e)
      //     // res.status(404).send()
      //   }
      // });
      // socket.on('OnSignup', async function (data) {

      //   try {
      //     console.log(data)
      //     const formData = {
      //       email: data.email,
      //       password: data.password
      //     }

      //     let sql = `SELECT * FROM users WHERE LOWER(email) = ? limit ?`;
      //     let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
      //     if (!user) {
      //       throw new Error()
      //     }
      //     if (user.length > 0) {
      //       statusCode = 409
      //       message = `${data.email} is already exist`
      //     } else {
      //       sql = `INSERT INTO users set ?`;
      //       user = await conn.query(sql, formData)
      //       if (user) {
      //         statusCode = 201
      //         message = `${data.email} is create successfully`
      //       } else {
      //         statusCode = 500
      //         message = `Something went wrong!`
      //         error = `Database error`
      //       }
      //     }
      //     const responseData = {
      //       status: statusCode,
      //       message,
      //       errors: error
      //     }
      //     socket.emit('SignUperror', responseData)
      //     // const usersRows = (JSON.parse(JSON.stringify(user))[0]);

      //     // if (!usersRows || !usersRows.avatar) {
      //     //     throw new Error()
      //     // }
      //     // if(usersRows.avatar ==null) usersRows.avatar = 'Avatar/default.png';
      //     // const responseData = {
      //     //     status: 200,
      //     //     message:'Success',
      //     //     avatarLink:`${req.protocol}://${req.headers.host}/${usersRows.avatar}`,
      //     //     errors: error
      //     // }
      //     // console.log(user)
      //   } catch (e) {
      //     console.log(e)
      //     // res.status(404).send()
      //   }
      // });