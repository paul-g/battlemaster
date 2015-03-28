function waitForConnection() {
  // TODO wait for other to connect
  var opponent = new Player("Other Yoda", "img/hero2.jpg");
  opponent.creatures = [];
  return opponent;
}

(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg");
  var opponent = waitForConnection();

  var game = new Game(player, opponent);

  var topController = app.controller('TopController', ["$scope", function ($scope) {
    var self = this;
    self.screen = "login";
    self.loginCode = "";
    self.loginName = "";
    self.loggingIn = false;
    self.doLogin = function() {
      console.log("logging in", self.loginName, self.loginCode);
      self.loggingIn = true;
      ssConnect("ws://ss.abstractbinary.org:7001/ws", function() {
        ssOnEvent(function(event) {
          console.log("Received SS event", event);
          if (event.Subscribed != null) {
            var sub = event.Subscribed;
            console.log("got Subscribed:", sub)
            $scope.$apply(function() {
              self.loginCode = sub.Topic;
            });
          }
          if (event.Broadcast != null) {
            var bc = event.Broadcast;
            console.log("got Broadcast: ", bc);
            console.log(bc.Data);
          }
        });
        ssJoinGame(self.loginCode);
        ssSend({playerJoin: {
          name: self.loginName,
        }});
        $scope.$apply(function() {
          self.screen = 'lobby';
        });
      });
    }
  }]);

  var playerController = app.controller('PlayerController', function() {
    this.players = [player, opponent];
    this.summon = function() {
      player.summon(
        this.summonParams.attack,
        this.summonParams.life
      );
    };
    this.summonParams = {
      attack: '0',
      life: '1'
    };
    this.endPhase = function() {
      game.endPhase();
      this.gamePhase = game.phase;
    }
    this.gamePhase = game.phase;
});
})();
