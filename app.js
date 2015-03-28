function waitForConnection() {
  // TODO wait for other to connect
  var opponent = new Player("Other Yoda", "img/hero2.jpg", 1, 10);
  opponent.summon(1, 2, 'Ah');
  opponent.summon(1, 2, 'Ah');
  return opponent;
}

(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg", 2, 10);
  player.summon(1, 2, 'Ah');
  var opponent = waitForConnection();

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

  ssConnect("ws://ss.abstractbinary.org:7001/ws", function() {
  });
})();
