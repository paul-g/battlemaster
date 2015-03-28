

function waitForConnection() {
  // TODO wait for other to connect
  var opponent = new Player("Other Yoda", "img/hero2.jpg");
  opponent.creatures = [new Creature(0, 1), new Creature(0, 1)];
  return opponent;
}

(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg");
  var opponent = waitForConnection();

  var game = new Game(player, opponent);

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
}
)();

