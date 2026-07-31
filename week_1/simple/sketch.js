let body = document.querySelector("body");

for (let i = 0; i < 10; i += 1) {
    let newWord = document.createElement("div");

    newWord.innerText = "[Drunk" + i + "]";

    newWord.classList = "word";

    let distance = 130 * i;

    let color = "#ff28c6"
    if (i % 2 == 0) {
      color = "#238a2a"
    }

    const keyframes = [
      { transform: `rotate(0) translate(${distance}px, 0px)`, color: "black" },
      { color: color },
      { transform: `rotate(360deg)  translate(${distance}px, 0px) `, color: "black" },
    ];

    const timing = {
      duration: 5000,
      iterations: Infinity,
    };
    
    body.appendChild(newWord);
    console.log(newWord);
    newWord.animate(keyframes, timing);
}
