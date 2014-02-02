# Introduction to making html5/javascript games with Coquette.js

[Coquette](http://coquette.maryrosecook.com/) is a game development library from developer [Mary Rose Cook](https://github.com/maryrosecook). It looks like it was abstracted from her [Ludum Dare 26 entry, *Left Right Space*](https://github.com/maryrosecook/leftrightspace).

I was struck by how straightforward and easy to use Coquette is, and made a weird asteroids-like game over a couple of afternoons: [BlockSnot](https://github.com/sethvincent/BlockSnot/).

## Let’s take a look at the basics of using Coquette.

To create a game with Coquette, you start with a simple game object:

```
var Game = function(canvasId, width, height) {
  this.coquette = new Coquette(this, canvasId, width, height, "#000");
};
```

You can create `update()` and `draw()` methods on `Game` and these will get called automatically:

```
Game.prototype.update = function(tick){
  // do something on each update
  // this is a reasonable place to handle collision detection
  // and other calculations
};

Game.prototype.draw = function(){
  // draw stuff to the screen that belongs to the game
};
```

## Coquette is comprised of a few modules:
- entities
- collider
- inputter
- renderer
- ticker


## Entities

Entities are all the things in the game, like the player, enemies, items, etc.

To create an entity, first create a constructor function that takes a `game` object and a `settings` object as arguments:

```
var Pizza = function(game, settings){
  this.game = game;
  this.toppings = settings.toppings;
};
```

Like the `Game` object, entities can have `update()`, and `draw()` methods that get called automatically:

```
Pizza.prototype.update = function(tick){
  // do something on each update
};

Pizza.prototype.draw = function(){
  // draw stuff to the screen that belongs to the Pizza
};
```

Now, to **create instances** of `Pizza`, use the `coquette.entities.create()` method:

```
coquette.entities.create(Pizza, {
  toppings: ['cheese', 'pepperoni']
}, function(pizza) {
  // in this optional callback you can do stuff with your
  // newly created entity
});
```

**Delete an entity** with the `coquette.entities.delete()` method:

```
coquette.entities.delete(pizza, function(){
  console.log(‘yeah, eat that pizza.’);
});
```

**Get all entities** with the `coquette.entities.all()` method.

You can pass the name of one of your entity constructors to get entities of a certain type returned as an array: coquette.entities.all(Pizza)

## Collider
Use the Collider module to check to see if to entities collide in the game.

Here’s an example from the Coquette readme of a Player entity that supports collision detection:

```
var Player = function() {
  this.pos = { x: 10, y: 20 };
  this.size = { x: 50, y: 30 };
  this.boundingBox = coquette.collider.CIRCLE;

  this.collision = function(other, type) {
    if (type === coquette.collider.INITIAL) {
      console.log("Ow,", other, "hit me.");
    } else if (type === coquette.collider.SUSTAINED) {
      console.log("Ow,", other, "is still hitting me.");
    }
  };

  this.uncollision = function(other) {
    console.log("Phew,", other, "has stopped hitting me.");
  };
};
```

An entity must have `size`, `position`, and `boundingBox` properties like above in order for collision detection to work.



## Inputter

Coquette’s input handling currently only supports keyboard events.

To use it, call `coquette.inputter.state()`, and pass in the key that you’re looking for:

```
var up = coquette.inputter.state(coquette.inputter.UP_ARROW);
```

Here’s how the list of keycodes map to names in Coquette:

```
BACKSPACE: 8,
TAB: 9,
ENTER: 13,
SHIFT: 16,
CTRL: 17,
ALT: 18,
PAUSE: 19,
CAPS_LOCK: 20,
ESC: 27,
SPACE: 32,
PAGE_UP: 33,
PAGE_DOWN: 34,
END: 35,
HOME: 36,
LEFT_ARROW: 37,
UP_ARROW: 38,
RIGHT_ARROW: 39,
DOWN_ARROW: 40,
INSERT: 45,
DELETE: 46,
ZERO: 48,
ONE: 49,
TWO: 50,
THREE: 51,
FOUR: 52,
FIVE: 53,
SIX: 54,
SEVEN: 55,
EIGHT: 56,
NINE: 57,
A: 65,
B: 66,
C: 67,
D: 68,
E: 69,
F: 70,
G: 71,
H: 72,
I: 73,
J: 74,
K: 75,
L: 76,
M: 77,
N: 78,
O: 79,
P: 80,
Q: 81,
R: 82,
S: 83,
T: 84,
U: 85,
V: 86,
W: 87,
X: 88,
Y: 89,
Z: 90,
F1: 112,
F2: 113,
F3: 114,
F4: 115,
F5: 116,
F6: 117,
F7: 118,
F8: 119,
F9: 120,
F10: 121,
F11: 122,
F12: 123,
NUM_LOCK: 144,
SCROLL_LOCK: 145,
SEMI_COLON: 186,
EQUALS: 187,
COMMA: 188,
DASH: 189,
PERIOD: 190,
FORWARD_SLASH: 191,
GRAVE_ACCENT: 192,
OPEN_SQUARE_BRACKET: 219,
BACK_SLASH: 220,
CLOSE_SQUARE_BRACKET: 221,
SINGLE_QUOTE: 222
```

## Renderer

Coquette’s renderer module calls the `draw()` that you define for the game and all entities in the game.

Inside of any of those `draw()` methods you can use this line to get the canvas drawing context and draw:

```
var context = coquette.renderer.getCtx();
```


## Ticker

The ticker updates the game loop at 60 frames per second. 

From the project readme: 

> “If the main game object or a game entity has an `update()` function, it will get called on each tick. If the main game object or a game entity has a `draw()` function, it will get called on each tick.”

## Make a game!
Coquette is an awesome choice for simple 2d games – it is well-suited to the use in [Ludum Dare](http://ludumdare.com/compo/) and other game jams.

Take a look at [the demos in the Coquette Github repo](https://github.com/maryrosecook/coquette/tree/master/demos), and [dig around in my BlockSnot game](https://github.com/sethvincent/BlockSnot) for ideas.