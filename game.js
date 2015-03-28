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

function Game (player, opponent) {
  this.player = player;
  this.opponent = opponent;
  this.phase = 'recruit';

  this.endPhase = function () {
    console.log('Phase finished, waiting for opponent');
    // TODO wait for opponent
    switch (this.phase) {
      case 'recruit':
        this.recruit();
        this.phase = 'defend';
        break;
      case 'defend':
        this.defend();
        this.phase = 'gather';
        break;
      case 'gather':
        this.gather();
        this.phase = 'attack';
        break;
      case 'attack':
        this.attack();
        this.phase = 'recruit';
        break;
    }
  }

  this.recruit = function() {
  };

  this.defend = function() {
  };

  this.gather = function() {
  };

  this.attack = function() {
  };
}
