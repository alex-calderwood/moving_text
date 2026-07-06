// Text event schema
// Each entry in `textEvents` is one word/phrase that animates on screen.
// Fields (required unless a default is listed):
//
//   text        - the string to display                                    (required)
//
//   type        - how the text animates                                    default "slide"
//                 "slide" - animate via the Web Animations API (from/to transforms)
//                 "css"   - reveal the text and add a CSS class to drive the animation
//
//   font        - font family                                              (required)
//                 Serif:
//                   "Baskerville"       - elegant, high-contrast, classic book typography
//                   "Palatino Linotype" - warm, calligraphic, humanist serif
//                   "Garamond"          - refined old-style serif, timeless literary feel
//                   "Georgia"           - sturdy screen-friendly serif, great readability
//                   "Times"             - traditional newspaper/typewriter serif
//                 Sans-serif:
//                   "Futura"            - geometric, clean, modernist
//                   "Gill Sans"         - humanist sans, friendly yet crisp
//                   "Century Gothic"    - rounded geometric, airy and light
//                   "Optima"            - elegant sans with subtle flared strokes
//                   "Avenir"            - smooth, understated, contemporary
//
//   start       - when it appears: "2s"/"500ms"/number(ms), or "previous"
//                 ("previous" = when the prior text's animation ends)       default 0
//
//   duration    - how long the animation runs: "1s"/"500ms"/number(ms)     default null
//
//   easing      - CSS easing function                                      default "linear"
//                 keywords:     "linear", "ease", "ease-in", "ease-out", "ease-in-out"
//                 named curves: e.g. "easeIn", "easeInOutCubic" - browse them (with
//                               copy-paste cubic-bezier values) at https://easings.net/
//                 custom curve: "cubic-bezier(0.33, 1, 0.68, 1)"
//                 reference:    https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
//
//   from        - starting transform {x, y, scale}                         default {x:0, y:0, scale:1}
//   to          - ending transform {x, y, scale}, missing axes reuse `from` default null
//
//   color       - text color                                              default "#ffffff"
//                 examples: "white", "#d6f2b5", "rgb(214, 242, 181)", "hsl(88, 65%, 83%)"
//
//   background  - page background color set when the text appears          default "#000000"
//                 defaults to not changing from the previous background color
//                 examples: "black", "#000000", "rgb(0, 0, 0)"
//
//   id          - DOM id                                                  default "text-<n>"
//   style       - object of extra CSS applied to the element              default null
//   keyframes   - Web Animations keyframes; overrides from/to             default null
//   timing      - Web Animations timing object; overrides duration/easing default null


// ============================================================

const DEFAULT_STYLE = {
  "text": "",
  "type": "slide",
  "easing": "linear", 
  "start": 0,
  "duration": null,
  "from": {x: 0, y: 0, scale: 1},
  "to": null,
  "color": "#ffffff",
  "background": "#000000",
  "id": null,       // DOM ID defaults to 'text-<n> - where '<n>'is the number of the text
  "font": "Times New Roman",
  "style": null,// any other css, applied on top of whatever this is 
  "keyframes":  null, // overwrite the other animations
  "timing": null,
}

const REQUIRED_FIELDS = ["text", "start", "font", "type"]

function createTextEventFromSchemas(schemas) {
    let textID = 0;
    let previousEnd = 0; // tracks the end time (ms) of the most recently scheduled text, so "start" can default to it

    for (let schema of schemas) {
        prepareSchema(schema);

        createTextEvent(schema, textID, previousEnd);
        textID += 1;

        previousEnd = schema.start + (schema.duration ?? 0);
    }
}

// The default type: animate with the Web Animations API.
const slide = {
    create(schema) {
        let element = createBaseElement(schema);
        // stay hidden until it's this word's start time (revealed in play)
        element.style.visibility = "hidden";
        schema.keyframes ??= buildKeyframes(schema);
        schema.timing   ??= buildTiming(schema);
        return element;
    },
    play(element, schema) {
        element.style.visibility = "visible";
        // animation timing https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
        element.animate(schema.keyframes, schema.timing);
    }
};

// Animate by adding a CSS class and letting CSS keyframes/transitions run.
const css = {
    play(element, schema) {
        element.style.visibility = "visible";
        element.classList.add(schema.animationClass);
    }
};

// All available event types
let eventTypes = { slide, css };

function prepareSchema(schema) {
    let eventType = eventTypes[schema.type];

    if (eventType.create) {
        schema.create = eventType.create;
    } else {
        schema.create = slide.create;
    }

    if (eventType.play) {
        schema.play = eventType.play;
    } else {
        schema.play = slide.play;
    }

    return schema;
}

function createBaseElement(schema) {
    let element = document.createElement("div");

    // take each word out of normal flow so words don't push each other around
    element.style.position = "absolute";
    // anchor transforms to the text's center
    element.style.transformOrigin = "center center";

    element.innerText = schema.text;

    return element;
}

function createTextEvent(schema, textID, previousEnd) {
    // Fill in defaults and check that the required fields exist
    validate(schema);

    // Resolve timing to milliseconds before creating the element
    if (schema.start === "previous") {
        schema.start = previousEnd;
    }
    schema.start = toMillis(schema.start);
    if (schema.duration != null) {
        schema.duration = toMillis(schema.duration);
    }

    let element = makeElementFromSchema(schema, textID);

    let wordsContainer = document.getElementById("words");
    if (wordsContainer == null) {
        throw new Error("Could not find an element with id 'words'. Make sure your HTML has an element with the words id, such as <div id=\"words\"></div>");
    }
    wordsContainer.appendChild(element);

    // console.log("Created", element, "from", schema);

    element.style.color = schema.color;
    element.style.fontFamily = schema.font;

    // Set the style CSS
    if (schema.style != null) {
        if (typeof schema.style !== 'object') {
            throw new Error(`Style must be of type object, found ${schema.style}`);
        }

        for (let [property, value] of Object.entries(schema.style)) {
            element.style.setProperty(property, value);
        }
    }

    // Use setTimeout to wait for the appropriate delay time (schema.start) and then 
    // play the event
    // setTimeout calls a function after a defined ms delay, and passes in the remaining arguments to the function that is called (playTextEvent)
    setTimeout(playTextEvent, schema.start, element, schema);
}

function playTextEvent(element, schema) {
    // Change the background color
    if(schema.background) {
        document.getElementById("words").style.background = schema.background;
    }

    // play the text event: reveal the text and run its type's animation
    // schema.play might be any function
    schema.play(element, schema);
}

// build Web Animations keyframes from the schema's from/to transforms
function buildKeyframes(schema) {
    let fromX = schema.from?.x ?? 0;
    let fromY = schema.from?.y ?? 0;
    let fromScale = schema.from?.scale ?? 1;

    let toX = schema.to?.x ?? fromX;
    let toY = schema.to?.y ?? fromY;
    let toScale = schema.to?.scale ?? fromScale;

    fromScale = `${fromScale * 100}%`;
    toScale = `${toScale * 100}%`;

    return [
        { 'transform': `translate(${fromX}px, ${fromY}px) scale(${fromScale})`, },
        { 'transform': `translate(${toX}px, ${toY}px) scale(${toScale})`, },
    ];
}

// build a Web Animations timing object (schema.duration must already be in ms)
function buildTiming(schema) {
    return {
        duration: schema.duration,
        easing: schema.easing,
        iterations: 1,
        fill: "forwards",
        composite: "add", // compose with the element's base transform (from `style`) instead of overwriting it
    };
}

function makeElementFromSchema(schema, textID) {
    let element = schema.create(schema);
    element.className = schema.type

    // Create the element ID
    if (schema.id != null) {
        element.id = schema.id;
    } else {
        element.id = `text-${textID}`;
    }
    return element;
}

// Validates a text schema: 
// fills in missing fields with defaults
// throws an error if required fields are missing
function validate(schema) {
    for (let [key, defaultValue] of Object.entries(DEFAULT_STYLE)) {
        if (schema[key] == null) {
            schema[key] = defaultValue;
        }
    }

    // validate text schema
    for (let field of REQUIRED_FIELDS) {
        if (schema?.[field] == null) {
            throw new Error(`text schema is missing field: ${field}. Found schema: ${JSON.stringify(schema)}`);
        }
    }
}

// converts a number or string to milliseconds
// ie 
// "2s" -> 2000
// 20 -> 20
function toMillis(value) {
    if (value == null) {
        throw new Error(`toMillis passed a null value: ${value}`);
    }

    if (typeof value == 'number') {
        return value; // milliseconds
    }

    if (typeof value == 'string') {
        let numerical = value.slice(0, -1);
        let mod = 1;
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

    throw new Error(`Could not convert ${value} to milliseconds`)
}