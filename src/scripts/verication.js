export { HandledCanvas, draw, generate, sizeFit }
import { Rec, Pol, random } from "./common";

const gridStyle = {
    fillStyle: "rgb(63, 63, 63)",
    strokeStyle: "rgb(255, 255, 255)",
    lineJoin: "round",
    lineWidth: "2"
};
const renderStyle = {
    textAlign: "center",
    textBaseline: "middle",
    lineWidth: "2",
    strokeStyle: "rgb(63, 0, 0)",
    fillStyle: "rgba(255, 0, 0, 0.7)"
};

class HandledCanvas {
    /**@type {string[]} */
    code;
    data;
    /**@type {HTMLCanvasElement } */
    canvas;
    ctx;
    anim = true;
    info = false;
    debug = false;
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas, ctx = canvas.getContext('2d')) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    check(str) {
        return str == this.code;
    }

    generateCode = ({ length, _fontH, _fontW }) => {
        var { _code, _data } = generate(
            this.ctx,
            {
                length,
                _fontH,
                _fontW
            },
            this.debug
        );
        this.code = _code;
        this.data = _data;
    }

    delay = [];
    dateMs = Date.now();
    fpsRec = 0;
    delayRec = 0;
    redrawCode = ({ height, width, padding, _fontW, dpi }) => {
        sizeFit(this.ctx, dpi);
        draw(
            this.ctx,
            {
                height,
                width,
                padding,
                _fontW,
                code: this.code,
                data: this.data
            },
            this.debug
        );
        if (this.info) {
            var _date = Date.now();
            var _delay = _date - this.dateMs;
            this.dateMs = _date;
            this.delay.push(_delay);
            this.ctx.font = `${~~(0.8 * padding)}px sans`;
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = "#f00";

            const la = 30;
            if (this.delay.length == la) {
                var sum = 0, _val;
                while ((_val = this.delay.pop()))
                    sum += _val;
                this.delayRec = Math.round(sum / la);
                this.fpsRec = Math.round(la * 10000 / sum) / 10;
            }
            this.ctx.fillText(`渲染延时: ${this.delayRec}ms`, padding + 4, padding / 2);
            this.ctx.fillText(`FPS: ${this.fpsRec}`, padding + 4, height - padding / 2);
        }
    }

    storedData;
    refreshCode = ({ length, height, width, padding, _fontH, _fontW, dpi }) => {
        this.generateCode({ length, _fontH, _fontW });
        this.redrawCode({ height, width, padding, _fontW, dpi });
    }

    setupAnim = ({ length, height, width, padding, _fontH, _fontW, dpi }) => {
        this.storedData = { length, height, width, padding, _fontH, _fontW, dpi };
        return this;
    }
    animRefresh = () => {
        var { length, height, width, padding, _fontH, _fontW, dpi } = this.storedData;
        this.generateCode({ length, _fontH, _fontW });
        this.redrawCode({ height, width, padding, _fontW, dpi });
        if (this.anim) requestAnimationFrame(this.animRefresh);
    }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
const sizeFit = (ctx, dpi) => {
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{ width, height }} config 
 */
const clear = (ctx, { width, height }) => {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
}

/**
 * 
 * @param {CanvasRenderingContext2D} _ctx 
 * @param {{ width, height, padding, _fontW }} config 
 */
const grid = (_ctx, { width, height, padding, _fontW, code }) => {
    _ctx.save();
    Object.assign(_ctx, gridStyle);
    var length = code.length;
    var axis = {
        x: [],
        y: [0, padding, height - padding, height]
    };
    axis.x.push(0);
    for (let _i = 0; _i <= length; _i++)
        axis.x.push(_i * _fontW + padding);
    axis.x.push(width);
    for (let px = 0; px < axis.x.length - 1; px++)
        for (let py = 0; py < axis.y.length - 1; py++)
            if ((px + py) % 2)
                _ctx.fillRect(
                    axis.x[px],
                    axis.y[py],
                    axis.x[px + 1] - axis.x[px],
                    axis.y[py + 1] - axis.y[py]);
    var lines = [
        [[0, padding],
        [width, padding]],
        [[0, height - padding],
        [width, height - padding]],
        [[padding, 0],
        [padding, height]],
        [[width - padding, 0],
        [width - padding, height]]];
    _ctx.beginPath();
    lines.forEach((e) => {
        _ctx.moveTo(e[0][0], e[0][1]);
        _ctx.lineTo(e[1][0], e[1][1]);
    });
    _ctx.stroke();
    _ctx.restore();
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{length, _fontH, _fontW}} config 
 * @param {boolean} useDebug 
 * @returns 
 */
const generate = (ctx, { length, _fontH, _fontW }, useDebug = false) => {
    ctx.save();
    var code = "", data = [];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < length; i++) {
        ctx.save();
        var code_char = random.char(),
            code_offset = random.offset(_fontH, _fontW),
            code_angle = random.angle(),
            code_fill = random.color(useDebug),
            code_font = `${~~random.size(_fontH)}px ${random.font()}`;
        code += code_char;
        ctx.font = code_font;
        var measures = ctx.measureText(code_char);
        data.push({
            offset: code_offset,
            angle: code_angle,
            ctx: {
                fillStyle: code_fill,
                font: code_font,
            },
            box: {
                top: measures.actualBoundingBoxAscent,
                bottom: measures.actualBoundingBoxDescent,
                left: measures.actualBoundingBoxLeft,
                right: measures.actualBoundingBoxRight
            }
        });
        ctx.restore();
    }
    ctx.restore();
    return { _code: code, _data: data }
}
/**
 * Draw elements onto the provided canvas
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{width, height, padding, _fontW, code, data}}
 * @param {boolean} useDebug 
 */
const draw = (ctx, { width, height, padding, _fontW, code, data }, useDebug = false) => {
    ctx.save();
    var length = code.length;
    clear(ctx, { width, height });
    useDebug && grid(ctx, { width, height, padding, _fontW, code });
    var curX = padding + 0.5 * _fontW;
    for (let i = 0; i < length; i++) {
        var code_ch = code[i],
            { offset, angle, box } = data[i],
            { top, bottom, left, right } = box,
            _w = left + right, _h = top + bottom;
        var { r: _r, theta: _theta } = Pol(curX + offset.x, height / 2 + offset.y);
        var fixed = Rec(_r, _theta - angle);

        ctx.save();
        Object.assign(ctx, renderStyle);
        ctx.rotate(angle);
        if (useDebug) {
            var lx = fixed.x - _w * 0.5, rx = lx + _w, // x - left & right
                ty = fixed.y - _h * 0.5, by = ty + _h; // y - top & bottom
            // BOX
            ctx.fillRect(
                lx, ty,
                _w, _h
            );
            // CROSS
            ctx.beginPath();
            ctx.moveTo(lx, ty);
            ctx.lineTo(rx, by);
            ctx.moveTo(lx, by);
            ctx.lineTo(rx, ty);
            ctx.stroke();
        }
        Object.assign(ctx, data[i].ctx);
        ctx.fillText(
            code_ch,
            fixed.x + (left - right) * 0.5,
            fixed.y + (top - bottom) * 0.5
        );
        curX += _fontW;
        ctx.restore();
    }
    ctx.restore();
}