let newWord = document.createElement("div");

const keyframes = [
  { transform: "rotate(0) translate3d(-50%, -50%, 0)", color: "black" },
  { color: "#431236", offset: 0.3 },
  { transform: "rotate(360deg) translate3d(-50%, -50%, 0)", color: "black" },
];

const timing = {
  duration: 3000,
  iterations: Infinity,
};

for (let i = 0; i < 10; i += 1) {
    newWord.innerText = "[Drunk]"

    let body = document.querySelector("body");

    newWord.classList += "word";
    console.log("body", body)
    body.appendChild(newWord);

    newWord.animate(keyframes, timing);

}
