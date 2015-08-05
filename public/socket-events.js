var socket = io();

// Catch events coming from the server
socket.on('login', function(dataFromServer){
    console.log('Login event fired', dataFromServer);
});

socket.on('login-response', function(dataFromServer){
    console.log('Login Response Fired', dataFromServer);
});

socket.on('create-bid-error', function(data) {
  console.log("Bid error!");
  alert(data.message);
});
