(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg", 2, 10);
  player.summon(0, 4, 'Ah');
  var opponent = new Player("Other Yoda", "img/hero2.jpg", 1, 10);

  var game = new Game(player, opponent);

  var playerController = app.controller('PlayerController', function() {
    this.players = [player, opponent];
    this.summon = function() {
      if (this.manaCost() < player.mana && this.summonParams.life > 0)
      player.summon(
        parseInt(this.summonParams.attack),
        parseInt(this.summonParams.life),
        this.summonParams.command
        );
    };
    this.manaCost = function() {
      return parseInt(this.summonParams.attack)
             + parseInt(this.summonParams.life);
    }
    this.summonParams = {
      attack: 0,
      life: 1,
      command: 'Ah',
    };
    this.endPhase = function() {
      game.endPhase();
      this.gamePhase = game.phase;
    }
    this.gamePhase = game.phase;
  });

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
        var playerIdx = 0;
        var cookie = Math.random();
        ssOnEvent(function(event) {
          if (event.Subscribed != null) {
            var sub = event.Subscribed;
            console.log("got Subscribed:", sub)
            $scope.$apply(function() {
              self.loginCode = sub.Topic;
            });
            ssSend(self.loginCode, {playerJoin: {
              name: self.loginName,
              cookie: cookie,
            }});
            if (window.location.hash == "#test") {
              ssSend(self.loginCode, {playerJoin: {
                name: "yoda",
                cookie: "the force"
              }});
            }
          } else if (event.Broadcast != null) {
            var bc = event.Broadcast.Data;
            if (bc.playerJoin != null) {
              var pj = bc.playerJoin;
              console.log("got playerJoin: ", pj)
              if (playerIdx > 1) {
                console.log("already have 2 players");
              } else {
                playerIdx++;
                $scope.$apply(function() {
                  if (pj.cookie == cookie) {
                    player.name = pj.name;
                  } else {
                    opponent.name = pj.name;
                  }
                });
              }
              if (playerIdx == 2) {
                $scope.$apply(function() {
                  self.screen = 'battle';
                });
              }
            } else {
              console.log("got unknown Broadcast: ", bc);
            }
          } else {
            console.log("got unknown SS event", event);
          }
        });
        ssJoinGame(self.loginCode);
        $scope.$apply(function() {
          self.screen = 'lobby';
        });
      });
    }
    if (window.location.hash == "#test") {
      self.loginName = "dev";
      self.doLogin();
    }
  }]);
})();
