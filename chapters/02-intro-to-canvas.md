# Introduction to the HTML5 canvas tag
> Creating basic keyboard and mouse interaction with the html5 canvas tag.

We're going to use the html5 canvas tag to draw a small rectangle to the screen and move it around using the keyboard's arrow keys. This will provide a very basic introduction to game development using javascript and the canvas tag.

To get started, we need to create a basic index.html file with these contents: 

```
<!DOCTYPE html>
<html>

<head>
<title>canvas and keyboard interaction example.</title>
</head>

<body>
  <canvas id="game"></canvas>

  <!-- include our javascript -->
  <script src="app.js"></script>
</body>

</html>
```

Now, create an app.js file with these two lines:

```
var canvas = document.getElementById('game');

var context = canvas.getContext('2d');
```

In this code we find the canvas tag by its `game` id and save that to a new canvas variable.

Next, we state we'll be drawing on the canvas in a 2d context by running `canvas.getContext('2d')` and saving that to the `context` variable. To draw in a 3d context we would pass `'webgl'` as the argument rather than `'2d'`. We'll explore 3d/WebGL drawing later in the book.

To experiment with these statements, try running them in the Chrome javascript console.

Copy this and run it in the Chrome console:

```
var canvas = document.getElementById('game');
canvas;
```

You should get something like this returned:

```
<canvas id="game"></canvas>
```

And if you run this in the Chrome console:

```
var context = canvas.getContext('2d');
context;
```

You'll be able to open up and inspect the `context` object that we'll use later to draw to the canvas.

# Starting the game and the game loop

We want our game to perform certain actions every frame, and we'll use a `loop()` function to do that.

To kick off our loop and start the game, we'll define a `startGame()` function like this:

```
function startGame(){ 
  canvas.height = 400;
  canvas.width = 800;

  loop();
}
```

We set the width and height of the canvas, and call the `loop()` function. When `startGame()` is called, the loop will start running. We haven't defined `loop()` yet, so let's do that next.

```
function loop(){
  requestAnimationFrame(loop);

  update();

  draw();
}
```

The `requestAnimationFrame()` function is a browser API that runs animations at a consistent framerate, and pauses the animation automatically when the tab/window loses focus. We pass the `loop` function to `requestAnimationFrame()` so that on each frame, `loop()` is called.

Next we call `update()` and `draw()`.

`update()` performs the calculations in our game. It can calculate trajectory, check for player input, detect collisions, and other actions that are oriented toward math and game state.

`draw()` is used to draw things to the canvas.

Let's define empty `update()` and `draw()` functions so that they exist and can be used later:

```
function update(){
  // update the game
}

function draw(){
  // draw to the canvas
}
```

Now that we've got the basic structure of the game, let's define our player character so it can be drawn to the screen.

We'll name it `box`, since it'll be a box. `box` will be an object with these properties:
- x position
- y position
- width
- height
- speed
- color

Create `box` with these initial values:

```
var box = {
  x: 50,
  y: 50,
  width: 10,
  height: 10,
  speed: 10,
  color: '#4f5654'
};
```

That gives our box a starting position, size, speed and color.

Next we need to define `update()` and `draw()` methods on `box` that can be called on each loop.

Let's start with `draw()`:

```
box.draw = function() {
  context.fillStyle = box.color;

  context.fillRect(box.x, box.y, box.width, box.height);
};
```

`context.fillStyle` is set to the color of the box.

`context.fillRect()` draws a rectangle and accepts the x position, y position, width, and height, of the box. It draws with the color set in `context.fillStyle`.

Now we can add `box.draw()` to the game's `draw()` function:

```
function draw(){
  box.draw()
}
```

Add a call to `startGame()` to the end of the app.js file so we can experiment with the code:

```
startGame();
```

You should see a small dark grey box in the top left corner of the canvas.

Now let's make the box move! Create `box.update()`:

```
box.update = function() {
  box.x += box.speed;
  box.y += box.speed;
};
```

To start, we're making the box move from the top left to the bottom right automatically. Add `box.update()` to the game's `update()` function:

```
function update(){
  box.update()
}
```

Check that out in the browser and you should see the square moving from the top left to the bottom right of the canvas and eventually disappearing past the boundary of the canvas.

Instead of making `box` move automatically, let's make it move when we press the arrow keys.

For this, we need to listen for events that occur when a key is pressed, so we'll use `window.addEventListener()`.

We want to check for when a key is pressed down, and when it is released, so we'll listen for the `keydown` and `keyup` events.

When a key is down, we'll store it's keyCode in an object named `keysDown`.

Initialize the `keysDown` object:

```
var keysDown = {};
```

Implement `window.addEventListener()` for the `keydown` event:

```
window.addEventListener('keydown', function(event) {

  keysDown[event.keyCode] = true;

  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
  }
});
```

With this code, we listen for the `keydown` event, and when it fires, the anonymous callback function is executed. We get the `event` object, which has detailed information about the event. The only info we need from `event` in this case is the keyCode of the key that is pressed down, and that is accessible at `event.keyCode`.

With `keysDown[event.keyCode] = true;` we create a property on the `keysDown` object with the name of the property set to the key's keyCode, and the value set to `true`, making it easy to tell if a key is in the `keysDown` object.

The thing about the arrow keys is that they have a purpose in the browser: scrolling the page.

We don't want the page to scroll when we're moving `box` around, so we need to disable that defulat behavior.

`event.preventDefault()` keeps a key from performing its defualt behavior. We want to be careful how we use `event.preventDefault()` for accessibility and usability reasons. If we disabled all keys that would make normal navigation and keyboard actions impossible.

So we use the `if` statement to check if the keys being pressed are the arrow keys: 37, 38, 39, 49.

If the keyCode is 37, 38, 39, or 40, their default behavior is prevented.

Next, we need to listen for `keyup` events. If we don't, the keysDown object will continue to include keys that are no longer being pressed down.

Implement `window.addEventListener()` for the `keyup` event:

```
window.addEventListener('keyup', function(event) {
  delete keysDown[event.keyCode];
});
```

All this does is listen for the `keyup` event, and when it fires, execute the anonymous callback function.

With `delete keysDown[event.keyCode];` we remove the key's keyCode from the `keysDown` object.

In the game's `update()` function add this line so that we can log to the console which keys are currently being pressed:

```
console.log(keysDown);
```

This let's us see which keys are down as we're pressing them.

Next, we need to make the position of `box` changed based on the keys we're pressing.

Let's create a `box.input()` method:

```
box.input = function(){
  // down
  if (40 in keysDown) {
    box.y += box.speed;
  }

  // up
  if (38 in keysDown) {
    box.y -= box.speed;
  }

  // left
  if (37 in keysDown) {
    box.x -= box.speed;
  }

  // right
  if (39 in keysDown) {
    box.x += box.speed;
  }
}
```

It's important to remember that the canvas coordinates start at zero in the top left corner. So to make `box` move down or to the right, we add `box.speed` to its position. And if we want `box` to move up or left, we subtract `box.speed` from its position.

Add `box.input()` to the `box.update()`, replacing what we had there previously:

```
box.update = function() {
  box.input();
};
```

This will run our `box.input()` method every loop, check to see if arrow keys are being pressed, and if so, move the box. Try it out!

Wait a minute, there's been something weird going on. Whenever the box moves, it draws a line. Everywhere you make the box go it leaves a trail.

We need to clear the canvas on every frame so that the old box positions get deleted, and make it look like the box is moving rather than drawing a line.

To do this, we can add `context.clearRect()` to the game's `draw()` function:

```
function draw(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  box.draw();
}
```

Try this out in the browser again and you'll see the box no longer leaves a trail.

## Here's the full code (with comments) for our simple canvas / input example:

```
// Here we select the canvas with an id of game 
// this is where we will draw our game assets
var canvas = document.querySelector('#game');

// What kind of drawing will we do?
// our game is in 2d, so our drawing will happen in the _context_ of 2 dimensions
var context = canvas.getContext('2d');

function startGame(){ 
  // set the width and height of our drawing canvas
  canvas.height = 400;
  canvas.width = 800;

  // start the game loop
  loop();
}

// any thing inside the loop() function gets run on every loop
function loop(){
  // this function runs the loop at a consistent rate, 
  // and only runs the loop when the browser tab is in focus
  requestAnimationFrame( loop, canvas );

  // update the game
  update();

  // draw new stuff after they've been updated
  draw();
}

// make a box object
// give it a starting x, y location, a width, height, speed, and color
var box = {
  x: 50,
  y: 50,
  width: 10,
  height: 10,
  speed: 10,
  color: '#4f5654'
};

// this function manages all the user input for the box object
box.input = function(){

  // check if any of the arrow keys are in the keysDown object
  if (40 in keysDown) {
    box.y += box.speed;
  }
  if (38 in keysDown) {
    box.y -= box.speed;
  }
  if (37 in keysDown) {
    box.x -= box.speed;
  }
  if (39 in keysDown) {
    box.x += box.speed;
  }
}

// draw the box
box.draw = function() {
  // set the color of the box
  context.fillStyle = box.color;

  // actually draw the box to the canvas
  context.fillRect(box.x, box.y, box.width, box.height);
};

// update the game
function update(){
  // check for any input relevant to the box
  // every time the game is updated
  box.input();
}

// draw on the canvas
function draw(){
  // this clears the canvas so that when the box is drawn each time
  // it looks like it moves, rather than drawing a line that follows the path
  // of the box. comment out the context.clearRect line to see what i mean.
  context.clearRect(0, 0, canvas.width, canvas.height);
  box.draw();
}

// this object contains any keyboard keys that are currently pressed down
var keysDown = {};

// here we add an event listener that watches for when the user presses any keys
window.addEventListener('keydown', function(event) {

  // add the key being pressed to the keysDown object
  keysDown[event.keyCode] = true;

  // if the user is pressing any of the arrow keys, disable the default
  // behavior so the page doesn't move up and down
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
  }
});

// this event listener watches for when keys are released
window.addEventListener('keyup', function(event) {
  // and removes the key from the keysdown object
  delete keysDown[event.keyCode];
});

// start the game
startGame();
```

That's it, and you made stuff move around the screen!

There are a few things left that you can explore:
- making the box stop at the boundaries of the canvas
- drawing an image instead of a rectangle
- creating an enemy object
- implementing collision detection
- making the player and enemy shoot bullets/arrows/whatever

