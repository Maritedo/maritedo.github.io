export { HandledCanvas, draw, generate, sizeFit }
import { Rec, Pol, random } from "./normal"

const gridStyle = {
    fillStyle: "rgb(63, 63, 63)",
    strokeStyle: "rgb(255, 255, 255)",
    lineJoin: "round",
    lineWidth: "2"
}
const renderStyle = {
    textAlign: "center",
    textBaseline: "middle",
    lineWidth: "2",
    strokeStyle: "rgb(63, 0, 0)",
    fillStyle: "rgba(255, 0, 0, 0.7)"
}

class HandledCanvas {
    /**@type {string[] | undefined} */
    code = "aaa"
    /**@type {{offset: { x: number, y: number }, angle: number, ctx: { fillStyle: string, font: string }, box: { top: number, bottom: number, left: number, right: number }}[] | undefined} */
    data
    /**@type {HTMLCanvasElement} */
    canvas
    /**@type {CanvasRenderingContext2D} */
    ctx
    anim = true
    info = false
    debug = false

    /**
     * 构造画布接管对象
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(canvas, ctx = canvas.getContext('2d')) {
        this.canvas = canvas
        this.ctx = ctx
    }

    /**
     * 校验验证码
     * @param {string} str 
     */
    check(str) {
        return str == this.code
    }

    /**
     * 生成新的验证码
     * @param {{ length: number, _fontH: number, _fontW: number }} config 
     */
    generateCode(config) {
        ({ code: this.code, data: this.data } = generate(
            this.ctx,
            config,
            this.debug
        ))
    }

    /**@type {number[]}*/
    delay = []
    dateMs = Date.now()
    fpsRec = 0
    delayRec = 0

    /**
     * 重新绘制验证码
     * @param {{ height: number, width: number, padding: number, _fontW: number, dpi: number }} config 
     */
    redrawCode(config) {
        const { height, padding, dpi } = config
        sizeFit(this.ctx, dpi)
        Object.assign(config, { code: this.code, data: this.data })
        draw(this.ctx, config, this.debug)
        if (this.info) {
            const _date = Date.now()
            const _delay = _date - this.dateMs
            this.dateMs = _date
            this.delay.push(_delay)
            this.ctx.font = `${~~(0.8 * padding)}px sans`
            this.ctx.textAlign = "left"
            this.ctx.textBaseline = "middle"
            this.ctx.fillStyle = "#f00"

            const queneLength = 30
            if (this.delay.length == queneLength) {
                let sum = 0, _val
                while ((_val = this.delay.pop()))
                    sum += _val
                this.delayRec = Math.round(sum / queneLength)
                this.fpsRec = Math.round(queneLength * 10000 / sum) / 10
            }
            this.ctx.fillText(`渲染延时: ${this.delayRec}ms`, padding + 4, padding / 2)
            this.ctx.fillText(`FPS: ${this.fpsRec}`, padding + 4, height - padding / 2)
        }
    }

    storedData
    /**
     * 刷新
     * @param {{ length: number, height: number, width: number, padding: number, _fontH: number, _fontW: number, dpi: number }} config 
     */
    refreshCode = (config) => {
        this.generateCode(config)
        this.redrawCode(config)
    }

    /**
     * 初始化并启动连续刷新
     * @param {{ length: number, height: number, width: number, padding: number, _fontH: number, _fontW: number, dpi: number }} config 
     */
    setupAnim = (config) => {
        const { length, height, width, padding, _fontH, _fontW, dpi } = config
        this.storedData = { length, height, width, padding, _fontH, _fontW, dpi }
        return this
    }
    animRefresh = () => {
        this.generateCode(this.storedData)
        this.redrawCode(this.storedData)
        if (this.anim) requestAnimationFrame(this.animRefresh)
    }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} dpi
 */
const sizeFit = (ctx, dpi) => {
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0)
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{ width: number, height: number }} config 
 */
const clear = (ctx, config) => {
    const { width, height } = config
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, width, height)
}

/**
 * 
 * @param {CanvasRenderingContext2D} _ctx 
 * @param {{ width: number, height: number, padding: number, _fontW: number }} config 
 */
const grid = (_ctx, config) => {
    _ctx.save()
    const { width, height, padding, _fontW, code } = config
    Object.assign(_ctx, gridStyle)
    const length = code.length
    const axis = {
        x: [0],
        y: [0, padding, height - padding, height]
    }
    for (let _i = 0; _i <= length; _i++)
        axis.x.push(_i * _fontW + padding)
    axis.x.push(width)
    for (let px = 0; px < axis.x.length - 1; px++)
        for (let py = 0; py < axis.y.length - 1; py++)
            if ((px + py) % 2)
                _ctx.fillRect(
                    axis.x[px],
                    axis.y[py],
                    axis.x[px + 1] - axis.x[px],
                    axis.y[py + 1] - axis.y[py])
    const lines = [
        [[0, padding],
        [width, padding]],
        [[0, height - padding],
        [width, height - padding]],
        [[padding, 0],
        [padding, height]],
        [[width - padding, 0],
        [width - padding, height]]]
    _ctx.beginPath()
    lines.forEach((e) => {
        _ctx.moveTo(e[0][0], e[0][1])
        _ctx.lineTo(e[1][0], e[1][1])
    })
    _ctx.stroke()
    _ctx.restore()
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{ length: number, _fontH: number, _fontW: number }} config 
 * @param {boolean} useDebug 
 * @returns 
 */
const generate = (ctx, config, useDebug = false) => {
    ctx.save()
    const { length, _fontH, _fontW } = config
    let code = "", data = []
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (let i = 0; i < length; i++) {
        ctx.save()
        const code_char = random.char(),
            code_offset = random.offset(_fontH, _fontW),
            code_angle = random.angle(),
            code_fill = random.color(useDebug),
            code_font = `${~~random.size(_fontH)}px ${random.font()}`
        code += code_char
        ctx.font = code_font
        const measures = ctx.measureText(code_char)
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
        })
        ctx.restore()
    }
    ctx.restore()
    return { code, data }
}
/**
 * Draw elements onto the provided canvas
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{width: number, height: number, padding: number, _fontW: number, code: string, data: {offset: { x: number, y: number }, angle: number, ctx: { fillStyle: string, font: string }, box: { top: number, bottom: number, left: number, right: number }}[] | undefined}} config
 * @param {boolean} useDebug 
 */
const draw = (ctx, config, useDebug = false) => {
    ctx.save()
    const { width, height, padding, _fontW, code, data } = config
    const length = code.length
    clear(ctx, { width, height })
    useDebug && grid(ctx, { width, height, padding, _fontW, code })
    let curX = padding + 0.5 * _fontW
    for (let i = 0; i < length; i++) {
        const code_ch = code[i],
            { offset, angle, box } = data[i],
            { top, bottom, left, right } = box,
            _w = left + right, _h = top + bottom
        const { r: _r, theta: _theta } = Pol(curX + offset.x, height / 2 + offset.y)
        const fixed = Rec(_r, _theta - angle)

        ctx.save()
        Object.assign(ctx, renderStyle)
        ctx.rotate(angle)
        if (useDebug) {
            let lx = fixed.x - _w * 0.5, rx = lx + _w, // x - left & right
                ty = fixed.y - _h * 0.5, by = ty + _h  // y - top & bottom
            // BOX
            ctx.fillRect(
                lx, ty,
                _w, _h
            )
            // CROSS
            ctx.beginPath()
            ctx.moveTo(lx, ty)
            ctx.lineTo(rx, by)
            ctx.moveTo(lx, by)
            ctx.lineTo(rx, ty)
            ctx.stroke()
        }
        Object.assign(ctx, data[i].ctx)
        ctx.fillText(
            code_ch,
            fixed.x + (left - right) * 0.5,
            fixed.y + (top - bottom) * 0.5
        )
        curX += _fontW
        ctx.restore()
    }
    ctx.restore()
}