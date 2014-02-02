# animation sequences with javascript and the canvas

Let’s make some canvas animations happen for a specific amount of time before stopping, or to perform certain movements, then stop.

We can define an animation then run it on mouse click or key press.

The trick is to define a trigger that starts the animation, draw the thing and concurrently step toward an end condition, and define an end condition.

In these examples I’m using [crtrdg.js](http://crtrdg.com) to set up the canvas and provide some helper methods, but you could easily accomplish this with plain javascript or with other game/canvas libraries.

Here’s an example where a box spins for a while after clicking the mouse:

```
var Game = require('crtrdg-gameloop');
var Mouse = require('crtrdg-mouse');

var game = new Game();

var box = {
  position: { x: game.width/2, y: game.height/2 },
  size: { x: 100, y: 100 }
};

box.rotate = function(){
  degrees += 25;
}

var mouse = new Mouse(game);
mouse.on('click', function(){
  box.rotate();
});

var degrees = 0;
game.on('update', function(){
  if (degrees > 0){
    degrees--;
  }
});

game.on('draw', function(context){
  context.save();
  context.translate(box.position.x, box.position.y);
  context.rotate(degrees);
  context.fillStyle = '#fff';
  context.fillRect(-box.size.x/2, -box.size.y/2, box.size.x, box.size.y);
  context.restore();
});
```
[Demo: http://superbigtree.com/crtrdg-demos/01](http://superbigtree.com/crtrdg-demos/01/)


This example moves the block and spins it only when the wasd keys are pressed on the keyboard:

```
var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');

var game = new Game();
var keyboard = new Keyboard(game);

var box = {
  position: { x: game.width / 2, y: game.height / 2 },
  velocity: { x: 0, y: 0 },
  size: { x: 100, y: 100 }
};

box.rotate = function(){
  if (degrees < 15){
    degrees += 25;
  }
};

box.input = function(keys){
  if ('A' in keys){
    box.velocity.x = -5;
    box.rotate();
  }

  if ('D' in keys){
    box.velocity.x = 5;
    box.rotate();
  }

  if ('W' in keys){
    box.velocity.y = -5;
    box.rotate();
  }

  if ('S' in keys){
    box.velocity.y = 5;
    box.rotate();
  }
};

var degrees = 0;
game.on('update', function(){
  if (degrees > 0){
    degrees--;
  }
  
  box.input(keyboard.keysDown);
  
  box.position.x += box.velocity.x;
  box.position.y += box.velocity.y;
  
  box.velocity.x *= .9;
  box.velocity.y *= .9;
});

game.on('draw', function(context){
  context.save();
  context.translate(box.position.x, box.position.y);
  context.rotate(degrees);
  context.fillStyle = '#fff';
  context.fillRect(-50, -50, box.size.x, box.size.y);
  context.restore();
});
```
[Demo: http://superbigtree.com/crtrdg-demos/02](http://superbigtree.com/crtrdg-demos/02)

This example extends the previous one to increase the size of the box when the mouse is clicked, and if the player is holding down the shift key when the mouse is clicked, the size of the box decreases:

```
var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');

var game = new Game();
var keyboard = new Keyboard(game);
var mouse = new Mouse(game);

mouse.on('click', function(){
  if ('<shift>' in keyboard.keysDown){
    box.size.x -= 25;
    box.size.y -= 25;
  } else {
    box.size.x += 25;
    box.size.y += 25;
  }
});

var box = {
  position: { x: game.width / 2, y: game.height / 2 },
  velocity: { x: 0, y: 0 },
  size: { x: 100, y: 100 }
};

box.rotate = function(){
  if (degrees < 15){
    degrees += 25;
  }
};

box.input = function(keys){
  if ('A' in keys){
    box.velocity.x = -5;
    box.rotate();
  }

  if ('D' in keys){
    box.velocity.x = 5;
    box.rotate();
  }

  if ('W' in keys){
    box.velocity.y = -5;
    box.rotate();
  }

  if ('S' in keys){
    box.velocity.y = 5;
    box.rotate();
  }
};

var degrees = 0;
game.on('update', function(){
  if (degrees > 0){
    degrees--;
  }
  
  box.input(keyboard.keysDown);
  
  box.position.x += box.velocity.x;
  box.position.y += box.velocity.y;
  
  box.velocity.x *= .9;
  box.velocity.y *= .9;
});

game.on('draw', function(context){
  context.save();
  context.translate(box.position.x, box.position.y);
  context.rotate(degrees);
  context.fillStyle = '#fff';
  context.fillRect(-box.size.x/2, -box.size.y/2, box.size.x, box.size.y);
  context.restore();
});
```
[Demo: http://superbigtree.com/crtrdg-demos/03](http://superbigtree.com/crtrdg-demos/03/)

Let’s add boundaries to the game so that the box can’t be moved outside the browser window:

```
var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');

var game = new Game();
var keyboard = new Keyboard(game);
var mouse = new Mouse(game);

mouse.on('click', function(){
  if ('<shift>' in keyboard.keysDown){
    box.size.x -= 25;
    box.size.y -= 25;
  } else {
    box.size.x += 25;
    box.size.y += 25;
  }
});

var box = {
  position: { x: game.width / 2, y: game.height / 2 },
  velocity: { x: 0, y: 0 },
  size: { x: 100, y: 100 },
  speed: 10
};

box.rotate = function(){
  if (degrees < 15){
    degrees += 25;
  }
};

box.input = function(keys){
  if ('A' in keys){
    box.velocity.x = - this.speed;
    box.rotate();
  }

  if ('D' in keys){
    box.velocity.x = this.speed;
    box.rotate();
  }

  if ('W' in keys){
    box.velocity.y = - this.speed;
    box.rotate();
  }

  if ('S' in keys){
    box.velocity.y = this.speed;
    box.rotate();
  }
};

box.boundaries = function(){
  if (this.position.x <= this.size.x / 2){
    this.position.x = this.size.x / 2;
  }

  if (this.position.x >= game.width - this.size.x / 2){
    this.position.x = game.width - this.size.x / 2
  }

  if (this.position.y <= this.size.y / 2){
    this.position.y = this.size.y / 2
  }

  if (this.position.y >= game.height - this.size.y / 2 ){
    this.position.y = game.height - this.size.y / 2;
  }
}

var degrees = 0;
game.on('update', function(){
  if (degrees > 0){
    degrees--;
  }
  
  box.input(keyboard.keysDown);
  
  box.position.x += box.velocity.x;
  box.position.y += box.velocity.y;
  
  box.velocity.x *= .9;
  box.velocity.y *= .9;

  box.boundaries()
});

game.on('draw', function(context){
  context.save();
  context.translate(box.position.x, box.position.y);
  context.rotate(degrees);
  context.fillStyle = '#fff';
  context.fillRect(-box.size.x/2, -box.size.y/2, box.size.x, box.size.y);
  context.restore();
});
```
[Demo: http://superbigtree.com/crtrdg-demos/04](http://superbigtree.com/crtrdg-demos/04/)