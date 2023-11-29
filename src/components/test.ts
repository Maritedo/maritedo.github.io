import { getDPI, Pol, Rec, between } from '../scripts/normal'

export class Fabric {
    private _objects: FabricObj[]
    private _activated: Map<FabricObj, boolean>;
    private _width: number = 100;
    private _height: number = 100;
    public cvs: {
        top: HTMLCanvasElement;
        bottom: HTMLCanvasElement;
    };
    public ctx: {
        top: CanvasRenderingContext2D;
        bottom: CanvasRenderingContext2D;
    };
    private _dpi: number = 1;
    public get dpi() { return this._dpi }
    public set dpi(val: number) {
        this._dpi = val;
        this._updateSize();
        this.refresh();
    }

    constructor(cvs_top: HTMLCanvasElement, cvs_bottom: HTMLCanvasElement, ctx_top: CanvasRenderingContext2D, ctx_bottom: CanvasRenderingContext2D) {
        this.cvs = {
            top: cvs_top,
            bottom: cvs_bottom
        };
        this.ctx = {
            top: ctx_top,
            bottom: ctx_bottom
        };
        this._objects = new Array<FabricObj>;
        this._activated = new Map<FabricObj, boolean>;
        window.addEventListener('resize', () => {
            this.dpi = getDPI(/* this.ctx.bottom */);
        });
        cvs_top.addEventListener("mousedown", (e) => {
            this.onMouseDown(e);
        });
        cvs_top.addEventListener("mousemove", (e) => {
            this.onMouseMove(e);
        });
        window.addEventListener("mouseup", () => {
            this.onMouseUp();
        });
        this._dpi = getDPI(/* this.ctx.bottom */);
        this._updateSize();
    }

    public add(...objects: FabricObj[]): Fabric {
        this._objects.push(...objects);
        objects.forEach((obj) => this._activated.set(obj, false));
        return this;
    }
    public remove(object: FabricObj, successCallback?: (deletedObj: FabricObj) => void): Fabric {
        const _index = this._objects.indexOf(object);
        if (_index != -1) {
            const obj_: FabricObj = this._objects.splice(_index, 1)[0];
            successCallback && successCallback.call(this, obj_);
            this._activated.delete(object);
        }
        return this;
    }
    public clear(): Fabric {
        this.ctx.top.clearRect(0, 0, this._width, this._height);
        this.ctx.bottom.clearRect(0, 0, this._width, this._height);
        return this;
    }
    private _setStatus = (status: boolean) => (object: FabricObj): Fabric => {
        if (this._activated.get(object) !== void 0)
            this._activated.set(object, status);
        return this;
    }
    public activate = this._setStatus(true);
    public inactivate = this._setStatus(false);

    public render(...objs: FabricObj[]): Fabric {
        this._updateTransform();
        objs.forEach((obj) => {
            obj.render(this.ctx.bottom);
            this._activated.get(obj) && obj.renderController(this.ctx.top);
        });
        return this;
    }
    public setSize(width: number, height: number): Fabric {
        this._width = width;
        this._height = height;
        this._updateSize();
        this._setDispSize();
        return this;
    }
    public refresh(): Fabric {
        this.clear();
        this.render(...this._objects);
        return this;
    }

    private _updateTransform(): void {
        this.ctx.top.setTransform(this.dpi, 0, 0, this.dpi, 0, 0);
        this.ctx.bottom.setTransform(this.dpi, 0, 0, this.dpi, 0, 0);
    }
    private _setDispSize(): void {
        this.cvs.top.style.setProperty('width', this._width + 'px');
        this.cvs.top.style.setProperty('height', this._height + 'px');
        this.cvs.bottom.style.setProperty('width', this._width + 'px');
        this.cvs.bottom.style.setProperty('height', this._height + 'px');
    }
    private _updateSize(): void {
        this.cvs.top.width = this._width * this.dpi;
        this.cvs.top.height = this._height * this.dpi;
        this.cvs.bottom.width = this._width * this.dpi;
        this.cvs.bottom.height = this._height * this.dpi;
    }

    public getObjsAt(dx: number, dy: number): FabricObj[] {
        return this._objects.filter((obj) => obj.containPoint(dx, dy));
    }
    public getObjAt(dx: number, dy: number): FabricObj | undefined {
        return this._objects.find((obj) => obj.containPoint(dx, dy));
    }

    private _stateStore?: {
        operatingObj: FabricObj,
        startX: number,
        startY: number,
        originX: number,
        originY: number
    }
    private _nonlocked_ = true;
    private onMouseDown(e: MouseEvent) {
        if (e.target != this.cvs.top) return;
        let needRefresh = false;
        const obj = this.getObjAt(e.offsetX, e.offsetY);
        this._activated.forEach((activated_, obj_) => {
            if (obj_ == obj) {
                if (!activated_)
                    needRefresh = true;
                this.activate(obj_);
                this._stateStore = {
                    operatingObj: obj,
                    startX: e.offsetX,
                    startY: e.offsetY,
                    originX: obj.x,
                    originY: obj.y
                };
            }
            if (obj_ !== obj && activated_) {
                needRefresh = true;
                this.inactivate(obj_);
            }
        });
        if (needRefresh) this.refresh();
    }
    private onMouseMove(e: MouseEvent) {
        if (this._stateStore && this._nonlocked_) {
            this._nonlocked_ = false;
            this._stateStore.operatingObj.x = this._stateStore.originX + e.offsetX - this._stateStore.startX;
            this._stateStore.operatingObj.y = this._stateStore.originY + e.offsetY - this._stateStore.startY;
            this.refresh();
            requestAnimationFrame(() => this._nonlocked_ = true);
        }
    }
    private onMouseUp() {
        this._stateStore = undefined;
    }

    // public test() {
    //     this._updateTransform();
    //     this.ctx.top.fillStyle = '#000';
    //     for (let i = 0; i <= 512; i++)
    //         for (let j = 0; j <= 512; j++)
    //             if (this.getObjAt(i, j) !== void 0)
    //                 this.ctx.top.fillRect(i, j, 1, 1)
    // }
}

abstract class FabricObj {
    public abstract flag: string;
    public x: number = 0;
    public y: number = 0;
    public axisX: string = 'left'; // 'left' || 'right' || 'center'
    public axisY: string = 'top'; // 'top' || 'bottom' || 'middle'
    public rotate: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public translateX: number = 0;
    public translateY: number = 0;
    public ctxStyle?: Object;
    private static offsetMapper: Map<string, number> = new Map([
        ['top', 0],
        ['left', 0],
        ['middle', .5],
        ['center', .5],
        ['right', 1],
        ['bottom', 1]
    ])
    public static parseAxis(val: string): { axisX: string; axisY: string } {
        const _axis = { axisX: 'left', axisY: 'top' };
        const splitted = val.split('-');
        switch (splitted[0]) {
            case 'center': _axis.axisX = 'center'; break;
            case 'right': _axis.axisX = 'right'; break;
            case 'middle': _axis.axisY = 'middle'; break;
            case 'bottom': _axis.axisY = 'bottom'; break;
            default: break;
        }
        if (splitted[1])
            switch (splitted[1]) {
                case 'middle': _axis.axisY = 'middle'; break;
                case 'bottom': _axis.axisY = 'bottom'; break;
            }
        return _axis;
    }

    constructor(options: any) {
        options.x && (this.x = options.x);
        options.y && (this.y = options.y);
        options.axis && ({ axisX: this.axisX, axisY: this.axisY } = FabricObj.parseAxis(options.axis));
        options.rotate && (this.rotate = options.rotate);
        options.scale && (this.scaleX = this.scaleY = options.scale);
        options.scaleX && (this.scaleX = options.scaleX);
        options.scaleY && (this.scaleY = options.scaleY);
        options.translateX && (this.translateX = options.translateX);
        options.translateY && (this.translateY = options.translateY);
        options.ctxStyle && (this.ctxStyle = options.ctxStyle);
    }

    public render(_ctx: CanvasRenderingContext2D): void {
        _ctx.save();
        this._transform(_ctx);
        this._applyStyle(_ctx);
        this._render(_ctx);
        _ctx.restore();
    }
    public renderController(_ctx: CanvasRenderingContext2D): void {
        const len = 8;
        _ctx.save();
        this._transform(_ctx, true);
        const boundingBox = this._getBoundingBox();
        const axes = {
            x: [0, boundingBox.w / 2 * this.scaleX, boundingBox.w * this.scaleX],
            y: [0, boundingBox.h / 2 * this.scaleY, boundingBox.h * this.scaleY]
        };
        // Init Styles
        _ctx.strokeStyle = '#000';
        _ctx.fillStyle = '#f20';
        _ctx.lineWidth = 2;
        _ctx.setLineDash([5, 5]);
        // Draw Lines
        _ctx.beginPath();
        _ctx.moveTo(0, 0);
        _ctx.lineTo(axes.x[2], axes.y[0]);
        _ctx.lineTo(axes.x[2], axes.y[2]);
        _ctx.lineTo(axes.x[0], axes.y[2]);
        _ctx.closePath();
        _ctx.stroke();
        // Draw Points
        const points = [
            [axes.x[0], axes.y[0]],
            [axes.x[1], axes.y[0]],
            [axes.x[2], axes.y[0]],
            [axes.x[0], axes.y[1]],
            [axes.x[1], this.scaleY > 0 ? axes.y[0] - 2 * len : axes.y[2] - 2 * len],
            [axes.x[2], axes.y[1]],
            [axes.x[0], axes.y[2]],
            [axes.x[1], axes.y[2]],
            [axes.x[2], axes.y[2]]
        ];
        for (const point of points)
            _ctx.fillRect(point[0] - len / 2, point[1] - len / 2, len, len);
        _ctx.restore();
    }
    public containPoint(x: number, y: number): boolean {
        const _fixed0 = Pol(x - this.x, y - this.y);
        const _fixed1 = Rec(_fixed0.r, _fixed0.theta - this.rotate);
        const boundingBox = this._getBoundingBox();
        return between(
            _fixed1.x - this.translateX + (FabricObj.offsetMapper.get(this.axisX) || 0) * boundingBox.w * this.scaleX,
            0,
            this.scaleX * boundingBox.w
        ) && between(
            _fixed1.y - this.translateY + (FabricObj.offsetMapper.get(this.axisY) || 0) * boundingBox.h * this.scaleY,
            0,
            this.scaleY * boundingBox.h
        );
    }

    private _applyStyle(_ctx: CanvasRenderingContext2D) {
        Object.assign(_ctx, this.ctxStyle);
    }
    private _transform(_ctx: CanvasRenderingContext2D, noscale: boolean = false): void {
        _ctx.translate(this.x, this.y);
        _ctx.rotate(this.rotate);
        const boundingBox = this._getBoundingBox();
        _ctx.translate(
            this.translateX - (FabricObj.offsetMapper.get(this.axisX) || 0) * boundingBox.w * this.scaleX,
            this.translateY - (FabricObj.offsetMapper.get(this.axisY) || 0) * boundingBox.h * this.scaleY
        );
        if (!noscale) _ctx.scale(this.scaleX, this.scaleY);
    }

    abstract _render(_ctx: CanvasRenderingContext2D): void;
    abstract _getBoundingBox(): { w: number, h: number };
}

export class Rect extends FabricObj {
    public flag: string = "rect";
    public radius: number = 0;
    public width: number = 0;
    public height: number = 0;
    public fill: boolean = true;
    public stroke: boolean = false;

    _render(_ctx: CanvasRenderingContext2D): void {
        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(0, 0, this.width, this.height);
        _ctx.closePath();
        if (this.fill) _ctx.fill();
        if (this.stroke) _ctx.stroke();
        _ctx.restore();
    }
    _getBoundingBox(): { w: number; h: number; } {
        return {
            w: this.width,
            h: this.height
        }
    }
    constructor(options: {
        width: number,
        height: number,
        radius: number,
        fill: boolean,
        stroke: boolean,
        // Shared
        x: number,
        y: number,
        axisX: string,
        axisY: string,
        axis: string,
        scaleX: number,
        scaleY: number,
        scale: number,
        translateX: number,
        translateY: number,
        rotate: number,
        ctxStyle: Object
    }) {
        super(options);
        options.width && (this.width = options.width);
        options.height && (this.height = options.height);
        options.radius && (this.radius = options.radius);
        if (options.fill !== void 0) this.fill = options.fill;
        if (options.stroke !== void 0) this.stroke = options.stroke;
    }
}