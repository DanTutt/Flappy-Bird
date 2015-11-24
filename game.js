/**
 * Created by DanTutt on 11/13/15.
 */
// NEW: 1. WindowSetup function and call from main. ADD TO THE GLOBAL VARS AND ADD GAME STATE
// 2. Width and height are now pulling from the global var (in canvasSetup).
// 3. Load Graphics is updated and is now putting info into our fishsprite.js
// 4. Add gameLoop function, update function, and render function.
// 5. Add the massive Fish object function.
// 6. Add the onpress function because it is being referenced.
// Pretty much this is the original code minus the coral being added.

// keep in mind that I have all calls and references to corals commented out for the time being. For now this should just animate the fish and begin the in game state so that you can make the fish jump.
// Also note that the fish is being drawn in the update function that refreshes constantly. that is how we are scrolling the animation.

// Global state
var
    canvas,
    renderingContext,
    width,
    height,
    sharkPosition = 550,
    foregroundPosition = 0,
    backgroundPosition = 0,
    frames = 0, // Counts the number of frames rendered.

// The playable fish character
    fish,
    corals,

// State vars
    currentState,

// Our game has three states: the splash screen, gameplay, and the score display.
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };


/**
 * Fish class. Creates instances of Fish.
 * @constructor
 */
function Fish() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3, 4, 3, 2, 1 ]; // The animation sequence

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Fish jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Fish
     */
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 6: 4;

        this.frame += frames % n === 0 ? 1: 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleFish();
        } else { // Game state
            this.updatePlayingFish();
        }
    };

    /**
     * Runs the fish through its idle animation.
     */
    this.updateIdleFish = function () {
        this.y = height - 280 + 30 * Math.cos(frames / 15);
        this.rotation = 0;
    };

    /**
     * Determines fish animation for the player-controlled fish.
     */
    this.updatePlayingFish = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when fish touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }
        if (this.y <= 0) {

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }
        if (this.y == update.shark) {

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // When fish lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 8, this.rotation + 0.2);
        } else {
            this.rotation = -0.1;
        }
    };

    /**
     * Draws Fish to canvas renderingContext
     * @param  {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

        // translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        // draws the fish with center in origo
        fishSprite[n].draw(renderingContext, -fishSprite[n].width / 2, -fishSprite[n].height / 2);

        renderingContext.restore();
    };
}

/**
 * Called on mouse or touch press. Update and change state depending on current game state.
 * @param  {MouseEvent/TouchEvent} evt - the onpress event
 */
function onpress(evt) {
    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            fish.jump();
            break;

        case states.Game: // The game is in progress. Update fish velocity.
            fish.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY, clickX = evt.keyCode;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }
            if (clickX ===55) {
                clickX= evt.touches[0].clientX;

            }


            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                corals.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }
}

/**
 * Sets the canvas dimensions based on the window dimensions and registers the event handler.
 */
function windowSetup() {
    // Retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    // Set the width and height if we are on a display with a width > 500px (e.g., a desktop or tablet environment).
    var inputEvent = "touchstart";
    if (width >= 500) {
        width = 550;
        height = 430;
        inputEvent = "keydown";
    }

    // Create a listener on the input event.
    document.addEventListener(inputEvent, onpress);
}

/**
 * Creates the canvas.
 */
function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "8px solid blue";

    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    // Initiate graphics and ok button
    var img = new Image();
    img.src = "images/MyGameSprite.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;

        okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };

        gameLoop();
    };
}

/**
 * Initiates the game.
 */
function main() {
    windowSetup();
    canvasSetup();

    currentState = states.Splash; // Game begins at the splash screen.

    document.body.appendChild(canvas); // Append the canvas we've created to the body element in our HTML document.

    fish = new Fish();
    corals = new CoralCollection();

    loadGraphics();
}

/**
 * The game loop. Update and render all sprites before the window repaints.
 */
function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

/**
 * Updates all moving sprites: foreground, fish, and corals
 */
function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 4) % 238;// Move left two px each frame. Wrap every 14px.

    }
    if (currentState !== states.Score) {
        backgroundPosition = (backgroundPosition -.05) % 230; // Move left two px each frame. Wrap every 14px.

    }
    if (currentState !== states.Score) {
        sharkPosition = (sharkPosition -3) % 5000; // Move left two px each frame. Wrap every 14px.

    }

    if (currentState === states.Game) {
        corals.update();
    }


    fish.update();
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);


    // Draw background sprites
    backgroundSprite.draw(renderingContext, backgroundPosition, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundPosition + backgroundSprite.width, height - backgroundSprite.height);

    corals.draw(renderingContext);
    fish.draw(renderingContext);

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);

    //sharkSprite.draw(renderingContext, sharkPosition, height - 450);
    //sharkSprite.draw(renderingContext, sharkPosition + 500,  height - 300);
    //sharkSprite.draw(renderingContext, sharkPosition + 1000, height - 450);
    //sharkSprite.draw(renderingContext, sharkPosition + 1500,  height - 200);
    //sharkSprite.draw(renderingContext, sharkPosition + 2000, height - 450);
    //sharkSprite.draw(renderingContext, sharkPosition + 2500,  height - 300);
    //sharkSprite.draw(renderingContext, sharkPosition + 3000, height - 450);
    //sharkSprite.draw(renderingContext, sharkPosition + 3500,  height - 200);
    //sharkSprite.draw(renderingContext, sharkPosition + 4000, height - 450);
    //sharkSprite.draw(renderingContext, sharkPosition + 4500,  height - 300);

}
function CoralCollection() {
    this._corals = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._corals = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._corals.push(new Coral()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {
        //var randomShark = Math.floor(Math.random() * 100) + 100;
        if (frames % 200 === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) { // Iterate through the array of corals and update each.
            var coral = this._corals[i]; // The current coral.

            if (i === 0) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
                coral.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
            }

            coral.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (coral.x < -coral.width) { // If the coral has moved off screen . . .
                this._corals.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];
            coral.draw();
        }
    };
}

/**
 * The Coral class. Creates instances of Coral.
 */
function Coral() {
    this.x = 550;
    this.y = height - (sharkSprite.height + foregroundSprite.height + 120 + 400 * Math.random());
    this.width = sharkSprite.width;
    this.height = sharkSprite.height;

    /**
     * Determines if the fish has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
// intersection
        var cx = Math.min(Math.max(fish.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(fish.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(fish.y, this.y + this.height + 120), this.y + 2 * this.height + 120);
// Closest difference
        var dx = fish.x - cx;
        var dy1 = fish.y - cy1;
        var dy2 = fish.y - cy2;
// Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = fish.radius * fish.radius;
// Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        sharkSprite.draw(renderingContext, this.x, this.y);
        sharkSprite.draw(renderingContext, this.x, this.y + 120 + this.height);
    }
}


