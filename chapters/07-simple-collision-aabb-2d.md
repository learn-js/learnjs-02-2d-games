# Simple 2D collision detection with the aabb-2d module

In this chapter we'll take a look at using the [aabb-2d module](https://github.com/chrisdickinson/aabb-2d) to implement simple 2d collision detection for a game.

## Create project folder

```
mkdir simple-collision-example
cd simple-collision-example
```

## Create a package.json file

```
npm init
```

Running `npm init` you'll be prompted to answer some questions about your project. If you're lazy you can hit enter to use the default setting for each prompt, and at the end it'll create a package.json file

## Install development tools

The game modules we're using are designed to work with [browserify](https://github.com/substack/node-browserify), so we'll install that along with [beefy](https://github.com/chrisdickinson/beefy), a tool for serving browserify bundles with a development server.

```
npm install --save-dev beefy browserify
```

## Create start script in package.json

Revise the `scripts` section of your package.json file to look like the following:

```
"scripts": {
  "start": "beefy index.js --live"
},
```

This will allow you to run `npm start` to start the beefy development server. Then you can go to http://localhost:9966 to see your game in action.

## Install dependencies

We'll use the [gameloop-canvas module](https://github.com/sethvincent/gameloop-canvas) to manage the game, the [crtrdg-entity module]() to create entities like the player for the game, and the [crtrdg-arrows module](https://github.com/finnp/crtrdg-arrows) to manage keyboard input. We'll also need the [inherits module](https://github.com/isaacs/inherits) to use with crtrdg-entity, so we'll install all those along with aabb-2d using npm:

```
npm install --save gameloop-canvas crtrdg-entity crtrdg-arrows inherits aabb-2d
```

## Create a box.js file

In a file named box.js we'll create a constructor function named `Box` that we'll use to create entities in the game. It will inherit from the crtrdg-entity module. Later we'll create an index.js file that will require box.js.

### Require necessary modules:

Our box module will depend on crtrdg-entity, crtrdg-arrows, inherits, and the aabb-2d modules. We require them here at the top of the file:

```
var Entity = require('crtrdg-entity');
var Arrows = require('crtrdg-arrows');
var inherits = require('inherits');
var aabb = require('aabb-2d');
```

### Export the Box constructor

This will allow us to require the box module in the index.js file:

```
module.exports = Box;
```

### Inherit methods from the Entity constructor to Box

By inheriting from Entity, our Box constructor will be able to make use of the Entity object's methods.

```
inherits(Box, Entity);
```

### Create the Box constructor

In our Box constructor function, we make the game, size, position, and color options properties. Then, we create a bounds property that is  an aabb object.

```
function Box (options) {
  this.size = options.size;
  this.position = options.position;
  this.color = options.color;
  this.bounds = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);
}
```

### Update method that resets the bounds of the box

In the update method we reset the aabb bounds property with the updated position and size of the object.

```
Box.prototype.update = function update (dt) {
  this.bounds = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);
};
```

### Draw method that draws the box to the canvas

Our draw method is really simple, it just sets the box's color to the context.fillStyle, and draws a rectange based on the box's size and position.

```
Box.prototype.draw = function draw (context) {
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
};

```

### The full box.js file:

Here's how the box.js file looks in its entirety:

```
var Entity = require('crtrdg-entity');
var Arrows = require('crtrdg-arrows');
var inherits = require('inherits');
var aabb = require('aabb-2d');

module.exports = Box;
inherits(Box, Entity);

function Box (options) {
  this.size = options.size;
  this.position = options.position;
  this.color = options.color;
  this.bounds = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);
}

Box.prototype.update = function update (dt) {
  this.bounds = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);
};

Box.prototype.draw = function draw (context) {
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
};

```

## Create an index.js file

### Require necessary modules:

In the index.js file the dependencies are gameloop-canvas, crtrdg-arrows, and the box module we created in box.js.

```
var game = require('gameloop-canvas')();
var Arrows = require('crtrdg-arrows');
var Box = require('./box');
```

### Create the arrows object

Here we initialize the arrows object, and set arrows to expect input using the WASD keys. By default it will expect you to use the arrow keys for keyboard input.

```
var arrows = new Arrows();
arrows.useWASD();
```

### Create player object using Box constructor

We'll create two objects using the Box constructor, and first we'll create a player object. We set the size, position, and color of the player here, by passing in an object with those properties.

```
var player = new Box({
  size: { x: 50, y: 50 },
  position: { x: 250, y: 250 },
  color: '#d1ea34'
});
```

### Set player speed

We'll create an additional property for the player on the fly here, which we'll use in the input method that we'll create next.

```
player.speed = 5;
```

### Create player input method

Next we create the player.input() method, where we check which arrows are down using the arrows.isDown() method.

```
player.input = function () {
  if (arrows.isDown('left')) {
    player.position.x -= player.speed;
  }

  if (arrows.isDown('right')) {
    player.position.x += player.speed;
  }

  if (arrows.isDown('up')) {
    player.position.y -= player.speed;
  }
  
  if (arrows.isDown('down')) {
    player.position.y += player.speed;
  }
};
```

### Create box from Box constructor

Now, we create a goal object using the Box constructor. You'll see it's similar to the player object, except the position and color are different.

```
var goal = new Box({
  size: { x: 50, y: 50 },
  position: { x: 150, y: 150 },
  color: '#f37ae1'
});
```

### Create checkBounds method on box

On the goal we'll also create a checkBounds method that we'll use to see if the player ever intersects the goal. When the player intersects with the goal, the goal will become the same green color as the player.

```
goal.checkBounds = function (other) {
  if (goal.bounds.intersects(other.bounds)) {
    goal.color = other.color;
  }
}
```

### Listen for game update event

Every time the game's update event fires, we'll check keyboard input using the `player.input()` method, update the player and goal bounds by running the `player.update()` and `goal.update()` methods, and check if the goal and player intersect using `goal.checkBounds(player)`.

```
game.on('update', function(dt){
  player.input();
  player.update(dt);
  goal.update(dt);
  goal.checkBounds(player);
});
```

### Listen for game draw event

Every time the game's `draw` event is fired, we clear the canvas of whatever was drawn in the last frame using `canvas.clearRect()`, then draw the player and goal to the screen using their `draw()` methods.

```
game.on('draw', function(context){
  context.clearRect(0, 0, game.width, game.height);
  player.draw(context);
  goal.draw(context);
});
```

### Start the game

This kicks off the game!

```
game.start();
```

### The full index.js file:

```
var game = require('gameloop-canvas')();
var Arrows = require('crtrdg-arrows');
var Box = require('./box');

var arrows = new Arrows();
arrows.useWASD();

var player = new Box({
  size: { x: 50, y: 50 },
  position: { x: 250, y: 250 },
  color: '#d1ea34'
});

player.speed = 5;

player.input = function () {
  if (arrows.isDown('left')) {
    player.position.x -= player.speed;
  }

  if (arrows.isDown('right')) {
    player.position.x += player.speed;
  }

  if (arrows.isDown('up')) {
    player.position.y -= player.speed;
  }
  
  if (arrows.isDown('down')) {
    player.position.y += player.speed;
  }
};

var goal = new Box({
  size: { x: 50, y: 50 },
  position: { x: 150, y: 150 },
  color: '#f37ae1'
});

goal.checkBounds = function (other) {
  if (goal.bounds.intersects(other.bounds)) {
    goal.color = other.color;
  }
}

game.on('update', function(dt){
  player.input();
  player.update(dt);
  goal.update(dt);
  goal.checkBounds(player);
});

game.on('draw', function(context){
  context.clearRect(0, 0, game.width, game.height);
  player.draw(context);
  goal.draw(context);
});

game.start();
```

## Run the development server

Use `npm start` on the command line to run the development server and go to http://localhost:9966 to see the game running in the browser.

The player is the green rectangle, and you can move it around with the WASD keys.     