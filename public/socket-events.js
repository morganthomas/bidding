var socket = io();

socket.on('create-bid-error', function(data) {
  console.log("Bid error!");
  alert(data.message);
});