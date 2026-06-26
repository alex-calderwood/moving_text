// ============================================================
// YOUR SCENES — add, remove, or reorder these.
//
// A scene is just { effect, frames, ...settings } and they play in order.
// Every effect is ONE function in the `effects` table further down — even
// "scroll" and "pause". To add a new animation, write one function there
// and use its name as a scene's "effect". That's the whole system.
//
// Common settings:
//   effect   which animation to play (see the list below)
//   frames   how long the scene lasts (60 frames is about 1 second)
//   text     the words to show          (most effects)
//   body     multi-line text            ("scroll")
//   color    "#RRGGBB"
//   size     text size in pixels
//   ease     "linear" | "easeIn" | "easeOut" | "easeInOut" | "back"
//            | "bounce" (several bounces) | "bounceOnce" (a single hop)
//   font     any CSS font, e.g. "Georgia", "Courier New"   (optional)
//   fadeOut  fraction of the scene that fades out at the end (optional)
//   wobbleX, wobbleY   gentle sway in pixels                (optional)
//   background  "#RRGGBB" behind the text. It lingers from the scene that
//               sets it until another scene sets a new one (optional)
//
// Effects: "fade", "dissolve", "rise", "plop", "wipe", "iris",
//          "slide" (move and/or scale), "slideLeft", "typewriter",
//          "unfold", "unpack", "scroll", "pause"
//
// "slide" takes from:{x,y,scale} and to:{x,y,scale}. x/y are fractions of the
// canvas (0 = left/top, 1 = right/bottom; below 0 or above 1 = off-screen);
// scale multiplies the text size. Every piece is optional, so a plain zoom is
// just from:{scale:0.5} to:{scale:1.2} (it stays centered at full size).
// ============================================================

// Set by each scene's optional "background"; it lingers until changed.
let activeBackground = "#000000";

// ---- a simple starter example (uncomment to use) ----
// scenes = [
//   { effect: "unpack",   text: "This Is Just To Say",        frames: 190, color: "#FFD23F", size: 70, ease: "back",    font: "Georgia" },
//   { effect: "pause",    frames: 70 },
//   { effect: "dissolve", text: "By William Carlos Williams", frames: 120, color: "#FF5DA2", size: 24, ease: "easeOut", font: "Courier New", wobbleX: 5, wobbleY: 3 },
//   { effect: "pause",    frames: 90 },
//   { effect: "scroll",   body: "I have eaten\nthe plums\nthat were in\nthe icebox", frames: 360, color: "#FFB347", size: 130, wobbleX: 12, wobbleY: 4 },
//   { effect: "pause",    frames: 80 },
//   { effect: "slide",    text: "you were probably saving them for breakfast", frames: 300, color: "#9D7BFF", size: 100, ease: "easeInOut", fadeOut: 0.15, wobbleX: 8, wobbleY: 5, from: { x: 1.5, y: 0.5 }, to: { x: -0.5, y: 0.5 } },
//   { effect: "pause",    frames: 70 },
//   { effect: "iris",     text: "Forgive me", frames: 120, color: "#FF6B6B", size: 80, ease: "easeOut", font: "Impact", fadeOut: 0.15 },
//   { effect: "pause",    frames: 80 },
//   { effect: "scroll",   body: "they were delicious\nso sweet", frames: 320, color: "#7CF5C2", size: 20 },
//   { effect: "scroll",   body: "and so cold", frames: 320, color: "#7CF5C2", size: 20 },
// ];

// ---- the original Star Wars opening crawl (uncomment to use) ----
// scenes = [
//   { effect: "fade",   text: "A long time ago in a galaxy far, far away....", frames: 220, color: "#A1FAFF", size: 28, background: "#000000" },
//   { effect: "pause",  frames: 60 },
//   { effect: "scroll", body: "It is a period of civil war.\nRebel spaceships, striking\nfrom a hidden base, have won\ntheir first victory against\nthe evil Galactic Empire.\n\nDuring the battle, Rebel\nspies managed to steal secret\nplans to the Empire's\nultimate weapon, the DEATH\nSTAR, an armored space\nstation with enough power to\ndestroy an entire planet.\n\nPursued by the Empire's\nsinister agents, Princess\nLeia races home aboard her\nstarship, custodian of the\nstolen plans that can save\nher people and restore\nfreedom to the galaxy....", frames: 1600, color: "#FFE81F", size: 60 },
// ];

// Option 3 - default
scenes = [
  // Title card — the words arrive, then the credit slips past.
  { effect: "unpack",    text: "This Is Just To Say",         frames: 180, color: "#FFD27F", size: 90, ease: "back",      font: "Georgia", background: "#2B2F57" },
  { effect: "slideLeft", text: "by William Carlos Williams",  frames: 150, color: "#9FB1D6", size: 50, font: "Courier New" },
  { effect: "pause", frames: 60 },

  { effect: "typewriter", text: "I have eaten", frames: 200, color: "#ECE3D0", size: 70, ease: "linear",  font: "Courier New", fadeOut: 0.05,  },
  { effect: "slide", text: "the plums", frames: 200, color: "#C8417F", size: 300, ease: "easeOut", font: "Georgia", fadeOut: 0.2, from: { scale: 1 }, to: { scale: 1.1 } }, // ripe, swelling — the purple sets in here
  { effect: "plop",       text: "that were in", frames: 90,  color: "#8FA0C8", size: 56 },
  { effect: "iris",       text: "the icebox",   frames: 120, color: "#BDEBFF", size: 80, ease: "easeOut", fadeOut: 0.1 },          // a cold door opens
  { effect: "pause", frames: 70 },

  { effect: "wipe",     text: "and which",         frames: 70,  color: "#B9B4D6", size: 48 }, // a quick reveal across
  { effect: "dissolve", text: "you were probably", frames: 120, color: "#B9B4D6", size: 56, ease: "easeOut", fadeOut: 0.25, wobbleX: 5, wobbleY:10 }, // uncertain
  { effect: "slide",    text: "saving",            frames: 130, color: "#C9C3E6", size: 68, ease: "easeOut", fadeOut: 0.1,                  from: { x: 0.5, y: 1.4 },  to: { x: 0.5, y: 0.5 } }, // rises from below
  { effect: "slide",    text: "for breakfast",     frames: 130, color: "#F2C14E", size: 68, ease: "easeOut", fadeOut: 0.1, font: "Georgia", from: { x: 0.5, y: -0.4 }, to: { x: 0.5, y: 0.5 } }, // descends from above — mirror of "saving"
  { effect: "pause", frames: 70 },

  { effect: "dissolve", text: "Forgive me", frames: 240, color: "#F58FB0", size: 210, ease: "easeInOut", font: "Georgia", fadeOut: 0.1 }, // still, sincere center; lingers and slowly fades
  { effect: "pause", frames: 50 },
  { effect: "rise", text: "they were delicious", frames: 120, color: "#F2A65A", size: 60, ease: "easeOut", fadeOut: 0.1, font: "Georgia" },
  { effect: "slide", text: "so sweet",           frames: 120, color: "#FFD27F", size: 25, ease: "easeOut", font: "Georgia", fadeOut: 0.0, from: { scale: 0.5 }, to: { scale: 1.2 } }, // savored
  { effect: "dissolve", text: "and so cold",     frames: 210, color: "#A9E4FF", size: 200, ease: "easeInOut", fadeOut: 0.45, },          // the lingering aftertaste, fading to black
  { effect: "pause", frames: 100},
  { effect: "pause", frames: 1, background: "#000000" },
];

// ============================================================

const REVEAL_BY = 0.85;  // unfold/unpack/typewriter finish here

let font;

function preload() {
  font = loadFont("./assets/News Gothic Bold/News Gothic Bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowWidth * 0.75);
  textFont(font);
}

function draw() {
  let info = findScene();
  if (!info) return;

  activeBackground = backgroundFor(info.index);
  background(activeBackground);

  drawScene(info.scene, info.frame);
}

// --- timeline ---

function findScene() {
  // frameCount is 1 on the first draw, so subtract 1 for a 0-based clock
  let time = frameCount - 1;
  let elapsed = 0;

  for (let i = 0; i < scenes.length; i++) {
    let scene = scenes[i];

    if (time < elapsed + scene.frames) {
      return { scene: scene, frame: time - elapsed, index: i };
    }

    elapsed += scene.frames;
  }

  return null;
}

// The background lingers: use the most recent scene (at or before this one)
// that set a "background", or black if none have.
function backgroundFor(index) {
  for (let i = index; i >= 0; i--) {
    if (scenes[i].background) return scenes[i].background;
  }
  return "#000000";
}

function progress(frame, frames) {
  return frame / frames;
}

// --- easing: reshape a 0..1 progress so motion speeds up or slows down ---

const EASINGS = {
  linear: (x) => x,
  easeIn: (x) => x * x,
  easeOut: (x) => 1 - (1 - x) * (1 - x),
  easeInOut: (x) => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2),
  back: (x) => {
    // overshoots a little past the target, then settles back
    let overshoot = 1.70158;
    return 1 + (overshoot + 1) * pow(x - 1, 3) + overshoot * pow(x - 1, 2);
  },
  bounce: (x) => {
    let n = 7.5625, d = 2.75;
    if (x < 1 / d) return n * x * x;
    if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
    if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
    return n * (x -= 2.625 / d) * x + 0.984375;
  },
  bounceOnce: (x) => {
    if (x < 0.7) return pow(x / 0.7, 2);           // accelerate down
    return 1 - 0.15 * sin((x - 0.7) / 0.3 * PI);  // single hop
  },
};

function ease(name, x) {
  let fn = EASINGS[name] || EASINGS.linear;
  return fn(constrain(x, 0, 1));
}

function revealProgress(prog) {
  return min(prog / REVEAL_BY, 1);
}

function endFade(prog, amount) {
  // amount = fraction of the scene spent fading out at the end (0 = no fade)
  if (!amount) return 1;
  return map(prog, 1 - amount, 1, 1, 0, true);
}

// --- motion ---

function motionOffset(scene, frame) {
  let wobble = sin(frame * 0.04);
  return {
    x: wobble * (scene.wobbleX || 0),
    y: wobble * (scene.wobbleY || 0),
  };
}

// --- drawing helpers ---

function setFill(hex, alpha) {
  let col = color(hex);
  col.setAlpha(alpha);
  fill(col);
  noStroke();
}

function drawText(str, x, y, size, hex, alpha, align, maxWidth) {
  setFill(hex, alpha);
  textSize(size);
  textAlign(align[0], align[1]);
  if (maxWidth) text(str, x, y, maxWidth);
  else text(str, x, y);
}

// --- run a scene by looking up its effect ---

function drawScene(scene, frame) {
  textFont(scene.font || font);

  let prog = ease(scene.ease, progress(frame, scene.frames));
  let move = motionOffset(scene, frame);

  // shared values every effect can use
  let context = {
    scene: scene,
    text: scene.text,
    size: scene.size,
    color: scene.color,
    prog: prog,                               // 0 -> 1 eased progress
    reveal: revealProgress(prog),             // 0 -> 1: how much has appeared
    fade: endFade(prog, scene.fadeOut) * 255, // full, fades out only if fadeOut is set
    move: move,
    x: width / 2 + move.x,
    y: height / 2 + move.y,
  };

  let run = effects[scene.effect];
  if (run) run(context);
}

// To add your own animation, add ONE function here, then use its name as a
// scene's "effect". Each function gets the context object (context) built above.
const effects = {
  // fade in and back out
  fade(context) {
    drawText(context.text, context.x, context.y, context.size, context.color, sin(context.prog * PI) * 255, [CENTER, CENTER]);
  },

  // cross-dissolve: fade in fast, hold, then fade out
  dissolve(context) {
    let alpha = min(1, context.prog * 4) * context.fade;
    drawText(context.text, context.x, context.y, context.size, context.color, alpha, [CENTER, CENTER]);
  },

  // float up from the bottom
  rise(context) {
    let y = map(context.prog, 0, 1, height, height / 2) + context.move.y;
    drawText(context.text, context.x, y, context.size, context.color, min(1, context.prog * 2) * context.fade, [CENTER, CENTER]);
  },

  // drops in from above and lands solidly with a bounce, then sits
  plop(context) {
    let fall = min(context.prog / 0.4, 1); // finish the fall in the first 40%
    let y = lerp(-context.size, height / 2, EASINGS.bounceOnce(fall)) + context.move.y;
    drawText(context.text, context.x, y, context.size, context.color, context.fade, [CENTER, CENTER]);
  },

  // move and/or grow between two points. from/to take {x, y, scale}; each
  // piece is optional (x/y default to center 0.5, scale defaults to 1).
  // A plain zoom is from:{scale:0.5} to:{scale:1.2}.
  slide(context) {
    let from = context.scene.from || {};
    let to = context.scene.to || {};
    let x = lerp(from.x ?? 0.5, to.x ?? 0.5, context.prog) * width + context.move.x;
    let y = lerp(from.y ?? 0.5, to.y ?? 0.5, context.prog) * height + context.move.y;
    let size = context.size * lerp(from.scale ?? 1, to.scale ?? 1, context.prog);
    drawText(context.text, x, y, size, context.color, context.fade, [CENTER, CENTER]);
  },

  // slide straight across the screen
  slideLeft(context) {
    textSize(context.size);
    let half = textWidth(context.text) / 2;
    let x = map(context.prog, 0, 1, -half, width + half) + context.move.x;
    drawText(context.text, x, context.y, context.size, context.color, context.fade, [CENTER, CENTER]);
  },

  // reveal left-to-right by covering the rest with the background
  wipe(context) {
    drawText(context.text, context.x, context.y, context.size, context.color, context.fade, [CENTER, CENTER]);
    textSize(context.size);
    let textW = textWidth(context.text);
    setFill(activeBackground, 255);
    rect(context.x - textW / 2 + textW * context.reveal, 0, textW, height);
  },

  // circular "iris" opening, common in old films
  iris(context) {
    let radius = context.reveal * width;
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(context.x, context.y, radius, 0, TWO_PI);
    drawingContext.clip();
    drawText(context.text, context.x, context.y, context.size, context.color, context.fade, [CENTER, CENTER]);
    drawingContext.restore();
  },

  // type one character at a time
  typewriter(context) {
    let count = floor(context.reveal * context.text.length);
    drawText(context.text.substring(0, count), context.x, context.y, context.size, context.color, context.fade, [CENTER, CENTER]);
  },

  // letters open one at a time
  unfold(context) {
    drawParts(context.text.split(""), context.x, context.y, context.size, context.reveal, context.color, context.fade, "letter");
  },

  // words open one at a time
  unpack(context) {
    drawParts(context.text.split(" "), context.x, context.y, context.size, context.reveal, context.color, context.fade, "word");
  },

  // a block of text scrolling up the screen (Star Wars style). Uses `body`.
  scroll(context) {
    let body = context.scene.body;
    let lineCount = body.split("\n").length;
    let blockHeight = lineCount * context.size * 1.4;
    // start fully below the bottom and end fully above the top
    let y = lerp(height + context.size, -blockHeight, context.prog) + context.move.y;
    drawText(body, width * 0.1 + context.move.x, y, context.size, context.color, 255, [LEFT, BASELINE], width * 0.8);
  },

  // hold on an empty screen for `frames`
  pause(context) {},
};

// Letters or words fold open one at a time
function drawParts(parts, cx, cy, size, prog, hex, alpha, kind) {
  textSize(size);
  let gap = kind === "word" ? textWidth(" ") : 0;

  // total width so we can center the whole row
  let total = gap * (parts.length - 1);
  for (let i = 0; i < parts.length; i++) {
    total += textWidth(parts[i]);
  }

  let x = cx - total / 2;
  for (let i = 0; i < parts.length; i++) {
    let charW = textWidth(parts[i]);

    // each part opens during its own slice of the progress (0..1)
    let open = map(prog, i / parts.length, (i + 1) / parts.length, 0, 1);
    open = constrain(open, 0, 1);

    if (open > 0) {
      drawText(parts[i], x + charW / 2, cy, size * open, hex, alpha * open, [CENTER, CENTER]);
    }
    x += charW + gap;
  }
}
