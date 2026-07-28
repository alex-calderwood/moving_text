
// The default type: animate with the Web Animations API.
const slide = {
    create(schema) {
        let element = createBaseElement(schema);
        // stay hidden until it's this word's start time (revealed in play)
        element.style.visibility = "hidden";
        schema.keyframes ??= slideKeyframes(schema);
        schema.timing    ??= defaultTiming(schema);
        return element;
    },
    play(element, schema) {
        element.style.visibility = "visible";
        // animation timing https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
        let animation = element.animate(schema.keyframes, schema.timing);
        animation.onfinish = () => slide.remove(element, schema);
    },
    remove(element, schema) {
        if (!schema.remove) { return; }

        if (schema.remove === 'fade') {
            element.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 500, fill: 'forwards' }
            ).onfinish = () => element.remove();
            return;
        }

        element.remove();
    }
};

// resolve the schema's from/to transform values, filling in defaults
function resolveTransform(schema) {
    let fromX = schema.from?.x ?? 0;
    let fromY = schema.from?.y ?? 0;
    let fromScale = schema.from?.scale ?? 1;

    let toX = schema.to?.x ?? fromX;
    let toY = schema.to?.y ?? fromY;
    let toScale = schema.to?.scale ?? fromScale;

    return { fromX, fromY, fromScale, toX, toY, toScale };
}

// build Web Animations keyframes from the schema's from/to transforms
// this is the default keyframe that just animates from one place to another
function slideKeyframes(schema) {
    let { fromX, fromY, fromScale, toX, toY, toScale } = resolveTransform(schema);

    fromScale = `${fromScale * 100}%`;
    toScale = `${toScale * 100}%`;

    return [
        { 'transform': `translate(${fromX}px, ${fromY}px) scale(${fromScale})`, },
        { 'transform': `translate(${toX}px, ${toY}px) scale(${toScale})`, },
    ];
}

// build a Web Animations timing object (schema.duration must already be in ms)
// this is the def
function defaultTiming(schema) {
    return {
        duration: schema.duration,
        easing: schema.easing,
        iterations: 1,
        fill: "forwards",
        composite: "add", // compose with the element's base transform (from `style`) instead of overwriting it
    };
}

// measure a schema's rendered text size without needing it in the DOM yet
function measureTextSize(schema) {
    measureTextSize.canvas ??= document.createElement('canvas');
    let context = measureTextSize.canvas.getContext('2d');
    if (schema.size == null) {
        throw new Error(`stretch text events require a 'size' (font-size) to measure natural text width/height. Found schema: ${JSON.stringify(schema)}`);
    }
    let fontSize = schema.size;
    context.font = `${fontSize} ${schema.font}`;
    return { width: context.measureText(schema.text).width, height: parseFloat(fontSize) };
}

// Animate by adding a CSS class and letting CSS keyframes/transitions run.
// The from/to transform is passed to CSS via custom properties, so the
// @keyframes rule for .stretch (in index.css) can reference them with var().
const stretch = {
    create(schema) {
        let element = createBaseElement(schema);
        let { fromX, fromY, toX, toY } = resolveTransform(schema);

        let { width: naturalWidth, height: naturalHeight } = measureTextSize(schema);
        let xStretch = (toX - fromX + naturalWidth) / naturalWidth;
        let yStretch = (toY - fromY + naturalHeight) / naturalHeight;

        element.style.setProperty('--fromX', `${fromX}px`);
        element.style.setProperty('--fromY', `${fromY}px`);
        element.style.setProperty('--xStretch', xStretch);
        element.style.setProperty('--yStretch', yStretch);
        element.style.setProperty('--toX', `${toX}px`);
        element.style.setProperty('--toY', `${toY}px`);

        element.style.animationDuration = `${schema.duration}ms`;
        element.style.setProperty('--easing', schema.easing);

        // stay hidden until it's this word's start time (revealed in play)
        element.style.visibility = "hidden";
        return element;
    },

    play(element, schema) {
        element.style.visibility = "visible";
    },
};

// All available event types
let eventTypes = { slide, stretch };