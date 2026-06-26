// Star Wars Logo Hex Codes from https://www.schemecolor.com/star-wars-logo-colors.php
let textColor;
let backgroundColor;

let screenHeight;
let screenWidth;

let passage;
let speed;
let textX;
let textY;

let font;

function preload() {
  //  News Gothic bold is used for the main body of the crawl and episode number
  // https://freefonts.co/fonts/news-gothic-bold_1
  font = loadFont('./assets/News Gothic Bold/News Gothic Bold.otf');
}

function setup() {

  textColor =  color("#FFE81F");
  backgroundColor = color(0, 0, 0);
  speed = 0.4;
  
  // Star Wars Crawl text from https://starwars.fandom.com/wiki/Opening_crawl
  passage = `It is a period of civil war.
Rebel spaceships, striking
from a hidden base, have won
their first victory against
the evil Galactic Empire.

During the battle, Rebel
spies managed to steal secret
plans to the Empire's
ultimate weapon, the DEATH
STAR, an armored space
station with enough power to
destroy an entire planet.

Pursued by the Empire's
sinister agents, Princess
Leia races home aboard her
starship, custodian of the
stolen plans that can save
her people and restore
freedom to the galaxy....`;

  // Set up the height of the canvas
  // The original Star Wars screening was a 4:3 aspect ratio
  windowHeight = 450;
  windowWidth = 600;
  createCanvas(windowWidth, windowHeight);

  // Text settings
  textAlign(LEFT); 
  textFont(font);
  // Set up the initial location of the text
  textX = 0;
  textY = windowHeight;

  textSize(39);
}

function draw() {
  background(0);
  fill(textColor);

  let x = textX;
  let y = textY;
  
  text(passage, x, y);

  textY -= speed;
}