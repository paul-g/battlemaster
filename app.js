function Creature (attack, life) {
  this.attack = attack;
  this.life = life;
  this.img = 'img/battlemaster_fighter.png';
}

function Player (name, img) {
  this.name = name;
  this.img = img;
  this.creatures = [];
  this.print = function() {
    console.log(name);
  };
  this.summon = function(attack, life) {
    this.creatures.push(new Creature(attack, life));
    console.log('Summoning creature, attack: ' + attack + ' life: ' + life);
  }
}

(function () {
  var app = angular.module('battlemaster', []);

  var player = new Player("yoda", "img/hero2.jpg");
  var opponent = new Player("Big Yoda", "img/hero2.jpg");

  // TODO sync these with the server
  opponent.creatures = [new Creature(0, 1), new Creature(0, 1)];

  app.controller('PlayerController', function() {
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
  });
}
)();

