// Video https://www.starwars.com/video/star-wars-episode-iv-a-new-hope-opening-crawl

// Good tutorial for 3D Text https://www.youtube.com/watch?v=3tTZlTq4Cxs&t=559s

// Star Wars Logo Hex Codes from https://www.schemecolor.com/star-wars-logo-colors.php
let textColor;
let backgroundColor;


let intro1;
let title1, title2;
let passage;

let speed;
let textX;
let textY;

let font;
let graphics;
let poemLines;

let width;
let height;

let fontSize;

function preload() {
  //  News Gothic bold is used for the main body of the crawl and episode number
  // https://freefonts.co/fonts/news-gothic-bold_1
  font = loadFont('./assets/News Gothic Bold/News Gothic Bold.otf');
  poemLines = loadStrings('./assets/This Is Just To Say.txt');
}

function setup() {
  rectMode(CORNERS);

  textColor =  color("#FFE81F");
  backgroundColor = color(0, 0, 0);
  speed = 3;

  intro1 = "A long time ago in a galaxy far, far away...."

  // title1 = "The Raven";
  // title2 = "By Edgar Allen Poe";

  title1 = "This Is Just To Say"
  title2 = "By William Carlos Williams"
  // title1 = title2 = ""

  passage = poemLines.join('\n');

  // Set up the height of the canvas
  width = windowWidth;
  height = width * 3/4; // The original Star Wars screening was a 4:3 aspect ratio
  createCanvas(width, height);
  
  // 0, 0 in this mode represents the center of the screen
  graphics = createGraphics(width, height, WEBGL);

  // Text settings
  graphics.rectMode(CENTER);
  graphics.textFont(font);

  // Set up the initial location of the text
  fontSize = width / 14;
  textX = - width/2;
  textY = 7 * fontSize;
  graphics.textSize(fontSize);

  // Draw to the graphics buffer.
  graphics.translate(0, height/2);
  graphics.rotateX(PI / 2.5);
}


// Animation timeline, measured in frames: the moments each phase ends/begins.
let introEnd = 230;
let crawlStart = 290;

function draw() {
  graphics.background(0);

  if (frameCount < introEnd) {
    background(0);
    textSize(height / 14)
    // Calculate transparancy
    let progress = (frameCount / introEnd);        // 0-1 proportion complete
    let alpha = (1/2 - abs(progress - 1/2) ) * 10; // transparancy amount
    fill(161, 250, 255, alpha * 255); // light blue: RGB values range from 0-255
    rectMode(CENTER);
    textAlign(LEFT);
    text(intro1, width/2, height, width * 9/12, height);

  } else if (frameCount > crawlStart) {
    playCrawl();
  }
}

function playCrawl() {
  graphics.fill(textColor);

  // Draw the Title (Episode IV)
  graphics.textAlign(CENTER);
  graphics.textSize(fontSize);
  graphics.text(title1, 0, textY - fontSize * 6.7);

  // Draw the second title (A NEW HOPE)
  graphics.push();
    graphics.textAlign(CENTER);
    graphics.textSize(fontSize * 1.4);
    graphics.translate(0, textY - fontSize * 3.4); // Move to the position first
    graphics.scale(0.7, 1.6); // then stretch vertically
    graphics.text(title2, 0, 0); // draw at the local origin
  graphics.pop();

  // Draw the main scrolling text
  graphics.textAlign(LEFT);
  graphics.textSize(fontSize);
  // P5 does not support justified text, so we will have to use our own
  // custom text justification function
  graphics.text(passage, textX, textY)
  // justifiedText(passage, textX, textY, width);

  // Move the text up
  textY -= speed;

  // Draw the 3D graphics as an image
  image(graphics, 0, 0);
}

function justifiedText(str, x, y, lineWidth) {
  let lines = str.split('\n');
  let leading = fontSize * 1.8; // How much space between the lines?

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    let lineY = y + i * leading;
    let words = line.split(' ');

    // The last line of a paragraph (followed by a blank line or the end)
    // and single-word lines are not stretched.
    let isParagraphEnd = i === lines.length - 1 || lines[i + 1].trim() === '';
    if (isParagraphEnd || words.length === 1) {
      graphics.text(line, x, lineY);
      continue;
    }

    // Add up the width of all the words on this line.
    let wordsWidth = 0;
    for (let j = 0; j < words.length; j++) {
      wordsWidth += graphics.textWidth(words[j]);
    }

    // Share the leftover space evenly in the gaps between the words.
    let gap = (lineWidth - wordsWidth) / (words.length - 1);

    // Draw each word, moving right by its width plus the gap.
    let cx = x;
    for (let j = 0; j < words.length; j++) {
      graphics.text(words[j], cx, lineY);
      cx += graphics.textWidth(words[j]) + gap;
    }
  }
}