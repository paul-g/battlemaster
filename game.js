function pausecomp(millis) {
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

function Creature (id, attack, life, command, player) {
  this.id = id;
  this.attack = attack;
  this.life = life;
  this.img = 'img/battlemaster_fighter.png';
  this.command = command;
  this.currentStep = 0;
  this.owner = player;
  this.startFight = function() {
    this.img = 'img/battlemaster_fighter_red.png';
  }
  this.endFight = function() {
    this.img = 'img/battlemaster_fighter.png';
  }
  this.fight = function(creature) {
      this.life -= creature.attack;
      if (this.life <= 0) {
        // this creature has died
        console.log('Dies --> ');
        console.log(creature);
        this.owner.removeCreature(this);
      }
  }
  this.getNextCommand = function () {
    var c =this.command[this.currentStep];
    if (c === 'A') {
      c = 'A' + this.command[this.currentStep + 1];
    }
    return c;
  }
  this.attacks = function () {
    return this.command[this.currentStep] === 'A';
  }
  this.isGatherer = function() {
    return this.command[this.currentStep] === 'G';
  }
  this.moveToNextCommand = function () {
    if (this.command[this.currentStep] === 'A')
      this.currentStep += 2;
    else
      this.currentStep++;
    if (this.currentStep >= command.length)
      this.currentStep = 0;
  }
  this.doGather = function() {
    this.moveToNextCommand();
  }
  this.doAttack = function(creatures) {
    var c = this.getNextCommand();
    console.log('Resolve attack command ' + c);
    if (creatures.length === 0)
      return;

    if (c[1] === 'h') {
      // fight creature with lowest health
      var creature = {life: '10000'};
      for (var i = 0; i < creatures.length; i++)
        if (creatures[i].life < creature.life)
          creature = creatures[i];
    } else if (c[1] === 'H') {
      var creature = {life: '0'};
      for (var i = 0; i < creatures.length; i++)
        if (creatures[i].life > creature.life)
          creature = creatures[i];
    }
    console.log(this);
    console.log('fights');
    console.log(creature);
    this.startFight();
    creature.startFight();
    this.fight(creature);
    creature.fight(this);
    this.endFight();
    creature.endFight();
    this.moveToNextCommand();
  }
}

function Player (name, img, id, mana) {
  this.name = name;
  this.img = img;
  this.creatures = [];
  this.id = id;
  this.creatureId = 0;
  this.mana = mana;
  this.print = function() {
    console.log(name);
  };
  this.summon = function(attack, life, command) {
    var id = this.id * 100 + this.creatureId;
    this.creatureId++;
    this.creatures.push(new Creature(id, attack, life, command, this));
    console.log('Summoning creature, attack: ' + attack + ' life: ' + life);
    this.mana = this.mana - (attack + life);
  }
  this.attackingCreatures = function () {
    var attackers = [];
    for (var i = 0; i < this.creatures.length; i++)
      if (this.creatures[i].attacks())
        attackers.push(this.creatures[i]);
    return attackers;
  }
  this.removeCreature = function(creature) {
   var index = 0;
    for (var i = 0; i < this.creatures.length; i++)
      if (this.creatures[i].id === creature.id) {
        index = i;
        break;
      }
    this.creatures.splice(index, 1);
 }
  this.gatherMana = function() {
    var gs = this.gatherers();
    for (var i = 0; i < gs.length; i++)
      gs[i].doGather();
    this.mana += gs.length;
  }
  this.gatherers = function() {
    var gatherers = [];
    for (var i = 0; i < this.creatures.length; i++)
      if (this.creatures[i].isGatherer())
        gatherers.push(this.creatures[i]);
    return gatherers;
  }
  this.checkEndGame = function() {
    if (this.creatures.length === 0) {
      this.img = 'img/player_dead.png';
      return;
    }
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
        this.phase = 'gather';
        // TODO copy other player's state
//        var newpl = new Player("Big Yoda", "img/hero2.jpg", 1, 15);
//        newpl.summon(2, 3, 'G');
//        for (var k in newpl)
//          this.player[k] = newpl[k];
//        console.log(this.opponent);
        break;
//      case 'defend':
//        this.defend();
//        this.phase = 'gather';
//        break;
      case 'gather':
        this.gather();
        this.phase = 'attack';
        break;
      case 'attack':
        this.attack();
        this.opponent.checkEndGame();
        this.player.checkEndGame();
        this.phase = 'recruit';
        break;
    }

  }

  this.recruit = function() {
  };

  this.defend = function() {
  };

  this.gather = function() {
    this.player.gatherMana();
    this.opponent.gatherMana();
  };

  this.playerOne = function () {
    return this.player.id === 1 ? this.player : this.opponent;
  }
  this.playerTwo = function () {
    return this.player.id === 2 ? this.player : this.opponent;
  }

  this.attack = function() {
    var playerOne = this.playerOne();
    var playerTwo = this.playerTwo();

    p1Attackers = playerOne.attackingCreatures();
    p2Attackers = playerTwo.attackingCreatures();
    console.log('player 1 attackers:');
    console.log(p1Attackers);
    console.log('player 2 attackers:');
    console.log(p2Attackers);

    // resolve attacks in order
    var i = 0;
    var j = 0;
    var turn = 0;
    while (!(i >= p1Attackers.length && j >= p2Attackers.length)) {
      console.log('Resolving attack');
      if (turn % 2 === 0) {
        if (i < p1Attackers.length) {
          p1Attackers[i].doAttack(playerTwo.creatures);
          i++;
        }
      } else if (j < p2Attackers.length) {
        p2Attackers[j].doAttack(playerOne.creatures);
        j++;
      }
      // need to update attackers in case one of them died during this iteration
      p1Attackers = playerOne.attackingCreatures();
      p2Attackers = playerTwo.attackingCreatures();
      turn = (turn + 1) % 2;
    }
  };
}
