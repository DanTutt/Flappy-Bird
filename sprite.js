// Sprite variables
var
    fishSprite,
    backgroundSprite,
    foregroundSprite,
    topCoralSprite,
    bottomCoralSprite,
    shark,
    textSprites,
    scoreSprite,
    splashScreenSprite,
    okButtonSprite,
    smallNumberSprite,
    largeNumberSprite;

/**
 * Sprite class
 * @param {Image} img - sprite sheet image
 * @param {number} x - x-position in sprite sheet
 * @param {number} y - y-position in sprite sheet
 * @param {number} width - width of sprite
 * @param {number} height - height of sprite
 */
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

/**
 * Draw sprite to canvas context
 *
 * @param {CanvasRenderingContext2D} renderingContext context used for drawing
 * @param {number} x   x-position on canvas to draw from
 * @param {number} y   y-position on canvas to draw from
 */
Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
        x, y, this.width, this.height);
};

/**
 * Initate all sprite
 * @param {Image} img spritesheet image
 */
function initSprites(img) {

    fishSprite = [
        new Sprite(img, 174, 91, 46, 20),
        new Sprite(img, 174, 110, 46, 25),
        new Sprite(img, 174, 133, 46, 33),
        new Sprite(img, 174, 168, 46, 33),
        new Sprite(img, 174, 205, 46, 35)
    ];

    backgroundSprite = new Sprite(img, 0, 0, 420, 110);
    backgroundSprite.color = "aqua"; // save background color
    foregroundSprite = new Sprite(img, 0, 242, 760, 35);

    topCoralSprite = new Sprite(img, 220, 140, 115, 300);
    bottomCoralSprite = new Sprite(img, 220, 91, 115, 300);
    sharkSprite = new Sprite(img, 231, 124, 70, 40);  //3 sharks (img, 231, 124, 70, 104);

    textSprites = {
        floppyFish: new Sprite(img, 59, 114, 96, 22),
        textspriteOver: new Sprite(img, 59, 136, 94, 19),
        getReady: new Sprite(img, 59, 155, 87, 22)
    };

    okButtonSprite = new Sprite(img, 119, 191, 40, 14);

    scoreSprite = new Sprite(img, 138, 56, 113, 58);
    splashScreenSprite = new Sprite(img, 0, 114, 59, 49);

}

function resetGame() {
    document.getElementById("container2").reset();
}