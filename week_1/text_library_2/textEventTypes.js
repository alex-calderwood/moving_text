
// The default type: animate with the Web Animations API.
const slide = {
    create(schema) {
        let element = createBaseElement(schema);
        // stay hidden until it's this word's start time (revealed in play)
        element.style.visibility = "hidden";
        schema.keyframes ??= slideKeyframes(schema);
        schema.timing   ??= slideTiming(schema);
        return element;
    },
    play(element, schema) {
        element.style.visibility = "visible";
        // animation timing https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
        element.animate(schema.keyframes, schema.timing);
    }
};

// build Web Animations keyframes from the schema's from/to transforms
// this is the default keyframe that just animates from one place to another
function slideKeyframes(schema) {
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
// this is the def
function slideTiming(schema) {
    return {
        duration: schema.duration,
        easing: schema.easing,
        iterations: 1,
        fill: "forwards",
        composite: "add", // compose with the element's base transform (from `style`) instead of overwriting it
    };
}

// Animate by adding a CSS class and letting CSS keyframes/transitions run.
const css = {
    play(element, schema) {
        element.style.visibility = "visible";
        element.classList.add(schema.animationClass);
    }
};

// All available event types
let eventTypes = { slide, css };