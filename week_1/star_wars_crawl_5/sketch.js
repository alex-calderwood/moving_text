
let activeBackground = "#000000";

let frameRate = 30; // Frames per second

let texts = [
    {
        "text": "hello",
        "ease": "linear(0, 0.25, 1)", // css easing function
        "start": 0, // default to previous can use frame numbers or a string - "10s", "1m" for minute / second
        "end": "5s",        // same format - define the exact frame end moment
        "from": {
            x: 0,
            y: 0,
            scale: 1, // modifier on size
        },
        "to": { // values default to whatever from was
            x: 100,
            y: 150,
            scale: 1,
        },
        "background": "#000000", // background color, defaults to not changing from the previous background color
        "class": "word", // a css class
        "font": "Times",
        "style": {color: 'red'}, // any other css, applied on top of whatever this is 
        // "keyframes":  { transform: "rotate(0) scale(100%)" }, // overwrite the other animations
    },
    {
        "text": "timing -issue?",
        "start": 0, // default to previous can use frame numbers or a string - "10s", "1m" for minute / second
        "end": "5s",        // same format - define the exact frame end moment
        "from": {
            x: 0,
            y: 0,
            scale: 1, // modifier on size
        },
        "to": { // values default to whatever from was
            x: 100,
            y: 150,
            scale: 2,
        },
        "color": "#d6f2b5", // text color
        "background": "#000000", // background color, defaults to not changing from the previous background color
        "class": "word", // a css class
        "font": "Times",
        // "keyframes":  { transform: "rotate(0) scale(100%)" }, // overwrite the other animations
        "timing": {duration: 1000, iterations: 1, fill: "forwards"},
    },
    {
        "text": "goodbye",
        "start": "1s",
        "duration": "2s",
        "from": {x: 100},
        "to": {x: 300},
    },
    {
        "text": "goodbye big",
        "start": "2s",
        "duration": "3s",
        "from": {x: 100},
        "to": {x: 300, scale: 2},
    },
]

// ============================================================

let font;

function preload() {
  font = loadFont("./assets/News Gothic Bold/News Gothic Bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  createTexts(texts);
}

function draw() {
    
}

const DEFAULT_STYLE = {
  "text": "",
  "ease": null,
  "start": "previous", // default to previous can use frame numbers or a string - "10s", "1m" for minute / second
  "duration": null,
  "from": {x: 0, y: 0, scale: 1},
  "to": null,
  "color": "#ffffff", // text color
  "background": "#000000", // background color, defaults to not changing from the previous background color
  "id": null,       // DOM ID defaults to 'text-<n> - where '<n>'is the number of the text
  "class": null,    // DOM class defaults to 'word'
  "font": "Times New Roman",
  "style": null,// any other css, applied on top of whatever this is 
  "keyframes":  null, // overwrite the other animations
  "timing": null,
}

const REQUIRED_FIELDS = ["text", "start", "font"]

function createTexts(texts) {
    let textID = 0;

    for (let schema of texts) {
        // create an element
        let el = document.createElement("div");

        // anchor transforms to the text's center
        el.style.transformOrigin = "center center";

        // take each word out of normal flow so words don't push each other around
        el.style.position = "absolute";

        // stay hidden until it's this word's start time (revealed in onText)
        el.style.visibility = "hidden";

        for (let [key, defaultValue] of Object.entries(DEFAULT_STYLE)) {
            if (schema?.[key] == null) {
                schema[key] = defaultValue;
            }
        }

        // validate text schema
        for (let field of REQUIRED_FIELDS) {
            if (schema?.[field] == null) {
                console.error(`text schema is missing field: ${field}. Found schema:`, schema);
            }
        }

        el.innerText = schema.text;

        // many ways to modify an element's css https://dev.to/itstrueintheory/how-to-change-css-styles-with-javascript-from-basic-to-advanced-methods-355p
        if(schema?.class != null) {
            el.className = schema.class
        }

        // Create the element ID
        if(schema?.id != null) {
            el.id = schema.id;
        } else {
            el.id = `text-${textID}`;
        }

        let wordsContainer = document.getElementById("words");
        if (wordsContainer == null) {
            console.error("Could not find an element with id 'words'. Make sure your HTML has an element with the words id, such as <div id=\"words\"></div>")
        }
        wordsContainer.appendChild(el);

        console.log("Created", el, "from", schema);

        el.style.color = schema.color;
        el.style.fontFamily = schema.font;

        // Set the style CSS
        if (schema?.style != null) {
            if (typeof schema.style !== 'object') {
                console.error('Style must be of type object, found', schema.style)
            }

            for(let [property, value] of Object.entries(schema.style)) {
                el.style.setProperty(property, value);
            }
        }

        if(schema?.keyframes == null) {
            let fromX     = schema?.from?.x ?? 0;
            let fromY     = schema?.from?.y ?? 0;
            let fromScale = schema?.from?.scale ?? 1;

            let toX       = schema?.to?.x ?? fromX;
            let toY       = schema?.to?.y ?? fromY;
            let toScale   = schema?.to?.scale ?? fromScale;

            fromScale = `${fromScale * 100}%`;
            toScale = `${toScale * 100}%`;

            let keyframes = [
                {'transform': `translate(${fromX}px, ${fromY}px) scale(${fromScale})`,},
                {'transform': `translate(${toX}px, ${toY}px) scale(${toScale})` ,},

            ]
            schema.keyframes = keyframes;
        }


        let startTime = toMillis(schema.start);
        let duration; 
        if (schema?.end != null && schema?.duration != null) {
            console.warn(`schema set both end and duration, defaulting to end ${schema.end} for schema`, schema);
        }
        if (schema?.end != null) {
            duration = toMillis(schema.end) - startTime;
            schema.duration = duration;
        } else if (schema?.duration != null) {
            duration = toMillis(schema.duration);
            schema.duration = duration;
        }

        if(schema?.timing == null) {
            schema.timing = {
                duration: duration,
                iterations: 1,
                fill: "forwards",
            }
        }

        // When it is time for the text to appear, call onText() to do such things as change the background color
        setTimeout(onText, startTime, el, schema);

        textID += 1;
    }
}

// convertes a number or string to milliseconds
// ie 
// "2s" -> 2000
// 20 -> 20
function toMillis(value) {
    if (value == null) {
        console.error(`toTime passed a null value:`, value);
        return null;
    }

    if (typeof value == 'number') {
        return value; // milliseconds
    }

    if (typeof value == 'string') {
        let numerical = value.slice(0, -1);
        let mod = 1;
        // TODO implement this
        if(value.endsWith('ms')) {          // milliseconds
            mod = 1;
        } else if (value.endsWith('s')) {   // seconds
            mod = 1000; 
        } else if (value.endsWith('m')) {   // minutes
            mod = 1000 * 60;
        } else if (value.endsWith('h')) {   // hours
            mod = 1000 * 60 * 60;
        } else if (value.endsWith('d')) {   // days
            mod = 1000 * 60 * 60 * 24;
        }

        return Number(numerical) * mod;
    }

    throw new Error("Could not convert", value, "to milliseconds")
}


function onText(el, schema) {
    // reveal the word now that it's reached its start time
    el.style.visibility = "visible";

    // Change the background color
    if(schema?.background != null) {
        document.getElementById("words").style.background = schema.background;
    }

    // animation timing https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
    el.animate(schema.keyframes, schema.timing);
}