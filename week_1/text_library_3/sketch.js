
function preload() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // get the text events from the file textEvents.js
  let textEvents = initialPoem;

  // Call the function defined in engine.js
  createTextEventFromSchemas(textEvents);

  fillControls(randomPlacement());
  document.getElementById('controls-title').innerText = describeKeyEvents();
}

function draw() {

}

// Map each key to a function that builds a text schema.
// Add more keys (5, 6, ...) as you build new types.
let keyEvents = {
    '1': createSlideEvent,
    '2': createStretchEvent,
};

function describeKeyEvents() {
    return "Controls: '1' slide, '2' stretch. 'q' clear, 'w' randomize values";
}

function keyPressed() {
    if (key === 'q') {
        document.getElementById('words').innerHTML = '';
        return;
    }

    if (key === 'w') {
        fillControls(randomPlacement());
        return;
    }

    let textEventFunction = keyEvents[key];
    console.log(key, "pressed")
    if (textEventFunction) {
        let textEvent = textEventFunction();
        console.log(textEvent);
        createTextEventFromSchemas([textEvent]);
    }
}

let textOptions = ['pow', 'boom', 'brrrr', 'oomph', 'crash!', 'BANG', 'ow'];

function randomPlacement() {
    let text = random(textOptions);
    let fromX = Math.round(random(0, windowWidth / 3));
    let fromY = Math.round(random(0, windowHeight / 3));
    let toX = Math.round(random(windowWidth/3, windowWidth - 100));
    let toY = Math.round(random(windowHeight/3, windowHeight - 100));
    let size = Math.round(random(13, 80));
    let toScale = 1;
    let duration = Math.round(random(500, 5000));
    return { text, toX, toY, fromX, fromY, size, toScale, duration };
}

// Fill the UI with the values
function fillControls(placement) {
    document.getElementById('control-text').value = placement.text;
    document.getElementById('control-x').value = placement.toX;
    document.getElementById('control-y').value = placement.toY;
    document.getElementById('control-fromX').value = placement.fromX;
    document.getElementById('control-fromY').value = placement.fromY;
    document.getElementById('control-size').value = placement.size;
    document.getElementById('control-toScale').value = placement.toScale;
    document.getElementById('control-duration').value = placement.duration;
}

// Read the values out of #controls.
function readControls() {
    let text = document.getElementById('control-text').value;
    let fromX = parseInt(document.getElementById('control-fromX').value);
    let fromY = parseInt(document.getElementById('control-fromY').value);
    let toX = parseInt(document.getElementById('control-x').value);
    let toY = parseInt(document.getElementById('control-y').value);
    let size = parseInt(document.getElementById('control-size').value);
    let toScale = parseInt(document.getElementById('control-toScale').value);
    let duration = parseInt(document.getElementById('control-duration').value);
    let easing = document.getElementById('control-easing').value;
    let font = document.getElementById('control-font').value;
    let color = document.getElementById('control-color').value;
    let remove = document.getElementById('control-remove').checked ? 'fade' : false;
    return { text, fromX, fromY, toX, toY, size, toScale, duration, easing, font, color, remove };
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