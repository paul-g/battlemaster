function waitForConnection() {
  // TODO wait for other to connect
  var opponent = new Player("Other Yoda", "img/hero2.jpg", 1);
  opponent.summon(1, 2, 'Ah');
  opponent.summon(1, 2, 'Ah');
  return opponent;
}

(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg", 2);
  player.summon(1, 2, 'Ah');
  var opponent = waitForConnection();

  var game = new Game(player, opponent);

  var playerController = app.controller('PlayerController', function() {
    this.players = [player, opponent];
    this.summon = function() {
      player.summon(
        this.summonParams.attack,
        this.summonParams.life,
        this.summonParams.command
        );
    };
    this.summonParams = {
      attack: '0',
      life: '1',
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
