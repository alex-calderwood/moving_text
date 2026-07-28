let width = 480;
let height = 480 * 2;


function preload() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // get the text events from the file textEvents.js
  let textEvents = initialPoem;

  // Call the function defined in engine.js
  createTextEventFromSchemas(textEvents);

  fillControls(randomPlacement());
}

function draw() {

}




function createSlideEvent() {
    let { text, fromX, fromY, toX, toY, size, toScale, duration, easing, font, color, remove } = readControls();

    return {
        "text": text,
        "type": "slide",
        "start": 0,
        "duration": duration,
        "from": {x: fromX, y: fromY},
        "to":   {x: toX, y: toY, scale: toScale},
        "easing": easing,
        "font": font,
        "color": color,
        "remove": remove,
        "size": `${size}px`,
    };
}

function createStretchEvent() {
    let { text, toX, toY, fromX, fromY, size, duration, easing, font, color } = readControls();

    return {
        "text": text,
        "type": "stretch",
        "start": 0,
        "duration": duration,
        "from": {x: fromX, y: fromY},
        "to":   {x: toX, y: toY},
        "easing": easing,
        "font": font,
        "color": color,
        "size": `${size}px`,
    };
}