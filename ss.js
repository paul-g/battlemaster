var ss;
var ssCode;

function ssConnect(serverAddr, onConnect) {
  console.log("Opening websocket to %s", serverAddr);
  ss = new WebSocket(serverAddr);
  ss.onopen = function(event) {
    console.log("Websocket open");
    onConnect();
  };
}

function ssJoinGame(code) {
  ssCode = code;
  ss.send(JSON.stringify({
    subscribe: {
      topic: ssCode,
      replayAfter: 0
    },
  }));
}

function ssSend(data) {
  ss.send(JSON.stringify({
    send: {
      topic: ssCode,
      data: data,
    },
  }))
}

function ssOnEvent(onEvent) {
  ss.onmessage = function(event) {
    console.log("received websocket event", event)
    var msg = JSON.parse(event.data)
    if (msg != null) {
      onEvent(msg);
    }
  };
}
