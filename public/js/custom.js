const socket = io(); 
 
// let username  = '';
// do {
//     username = prompt('Please Enter YOur self!', '', (result) => {
//         console.log('prompt() result via callback: ', result);
//     });
// }
// while (!username);

//connect clients
socket.on("connect", () => {
    // either with send()
    // socket.send("Hello!");
  
    // or with emit() and custom event names
    // socket.emit("salutations",username, { "mr": "john" }, Uint8Array.from([1, 2, 3, 4]));
   
  });
  socket.on("SignUperror",(data)=>
  {
      console.log(`data message `,data)
  });
  
function Login(){
    console.log('login')
    socket.emit("OnLogin", {email:'kalra@gmail.com' ,password :'1234578'});
}

function Signup(){
    socket.emit("OnSignup", {name:'kalradev' , email:'kalradev123@gmail.com' ,password :'1234578'});
}

function playOnline(type){ 
    console.log(type)
    socket.emit("playOnline", {types:type});
}
function gameEntry(ID){ 
    console.log(ID)
    socket.emit("gameEntry", {id:ID});
}
