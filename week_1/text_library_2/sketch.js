
function preload() {

}

function setup() {
  createCanvas(windowWidth, windowHeight);


  // get the text events from the file textEvents.js
  let textEvents = initialPoem;

  // Call the function defined in engine.js
  createTextEventFromSchemas(textEvents);

  
}

function draw() {
    
}

// Shoot a word up the middle of the screen when space is released.
// The longer space is held, the faster the shot (shorter animation duration).
let spacePressedAt = 0;

function keyPressed() {
    if (key === ' ' && spacePressedAt === 0) {
        spacePressedAt = millis(); // start timing the hold
    }
}

function keyReleased() {
    if (key === ' ') {
        let held = millis() - spacePressedAt;
        spacePressedAt = 0;

        // longer hold -> shorter duration -> faster shot
        let min = 100;
        let max = 5000;
        let duration = constrain(max - (held ** 2) / 6, min, max);

        let text = random(['pow', 'boom', 'brrrr', 'oomph', 'crash', 'bang', 'ow']);
        let x = random(0, windowWidth);
        let y = random(0, windowHeight);
        

        let word = {
            "text": text,
            "type": "slide",
            "start": 0,
            "duration": duration,
            "from": {x:0, y: random([0, windowHeight])},
            "to":   {x: x, y: y},
            "easing": "ease-out",
            "font": "Futura",
        };
        // console.log('keyReleased, creating', word);

        createTextEventFromSchemas([word]);
    }
}