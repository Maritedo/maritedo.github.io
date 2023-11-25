export const propIsTrue = (val) => {
    if (typeof (val) == 'string') {
        return (val == '' || val.toLowerCase() == 'true')
    } else {
        return val == null ? false : val
    }
}

/**
 * Generate a new function which add the given class name to the *element*
 * @param {HTMLElement} element 
 * @returns A new function which add the given class name to the *element*
 */
export const addClassTo = (element) => /** @param {string} className * @returns void*/(className) => element.classList.add(className);

export const keepIn = (x, _min, _max) => {
    return Math.max(Math.min(_max, x), _min);
};

const rate1 = .7, rate2 = .1;
const cmin = 255 * rate1, cmax = 255 - 255 * rate2;
const range = [0, 255];
const _r = range[1] - range[0];

export const randomColor = () => {
    var _vals = [];
    for (let _i = 0; _i < 3; _i++)
        _vals.push(range[0] + Math.round(Math.random() * _r));
    var imin = _vals[0] > _vals[1] ? (_vals[1] >= _vals[2] ? 2 : 1) : (_vals[0] > _vals[2] ? 2 : 0);
    var imax = _vals[0] < _vals[1] ? (_vals[1] <= _vals[2] ? 2 : 1) : (_vals[0] < _vals[2] ? 2 : 0);
    if (_vals[imax] < cmin) _vals[imax] = cmax;
    if (_vals[imin] > cmax) _vals[imin] = cmin;
    return {
        R: _vals[0],
        G: _vals[1],
        B: _vals[2]
    }
}

export const getDPI = (ctx) => {
    return (window.devicePixelRatio || 1) / (ctx.backingStorePixelRatio || 1);
}

export const Rec = (r, theta) => {
    return {
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r
    };
}

export const Pol = (x, y) => {
    return {
        r: Math.sqrt(x ** 2 + y ** 2),
        theta: Math.atan2(y, x) % 360
    };
};

export const random = {
    chars: "112233445566778899abcdefghijkmnrtuyzABDEFGHIJKLMNQRTVY",
    fonts: [
        'century',
        'monaco',
        'verdana',
        'sans-serif',
        'sans',
        'copperplate'
    ],
    char: () => {
        return random.chars[Math.round(Math.random() * (random.chars.length - 1))];
    },
    color: (opacity) => {
        var c = randomColor();
        return opacity ?
            `rgba(${c.R}, ${c.G}, ${c.B}, 0.7)` :
            `rgb(${c.R}, ${c.G}, ${c.B})`;
    },
    size: (_fontH) => {
        return _fontH * 1.0 * (1 + Math.random() / 5);
    },
    angle: () => {
        return (2 * Math.random() - 1) * Math.PI / 12;
    },
    offset: (_fontH, _fontW) => {
        const _p = 0.125;
        return {
            x: Math.random() * _p * _fontW,
            y: Math.random() * _p * _fontH
        };
    },
    font: () => {
        return random.fonts[Math.round(Math.random() * (random.fonts.length - 1))]
    },
}

export const between = (val, val1, val2) => {
    return val1 <= val2 ?
        (val1 <= val && val <= val2) :
        (val2 <= val && val <= val1);
}