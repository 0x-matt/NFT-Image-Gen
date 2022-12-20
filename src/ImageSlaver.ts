
import * as fs from 'fs'
import { Finder } from './Finder';
import { loadImage, createCanvas, Image as NCImage, Canvas } from 'canvas';
import { LayerDnaElement } from "./ImageDna";
import { LayerConfigurations } from "./config";
import { CavasFormat, CavasBackground } from "./Constants";

export interface ImageLoadedObject {
	dnaElement: LayerDnaElement,
	loadedImage: NCImage | null;
}

export class ImageSlaver {

	static _cvs: Canvas;
	static cvs() {
		if (!this._cvs) {
			this._cvs = createCanvas(CavasFormat.width, CavasFormat.height);
		}
		return this._cvs;
	}

	static _ctx: CanvasRenderingContext2D;
	static ctx() : CanvasRenderingContext2D {
		if (!this._ctx) {
			let r = this.cvs().getContext("2d");
			r.imageSmoothingEnabled = CavasFormat.smoothing;
			this._ctx = r;
		}
		return this._ctx;
	}

	public static async loadLayerImage(_dnaElement: LayerDnaElement) : Promise<ImageLoadedObject | undefined> {
		try {
			let ret: Promise<ImageLoadedObject | undefined> = new Promise(async (resolve) => {
				let imageValue: NCImage | null = null;
				if (_dnaElement.selectedElement) {
					imageValue = await loadImage(_dnaElement.selectedElement.path);
				}
				resolve({dnaElement: _dnaElement, loadedImage: imageValue});
			});
			return ret;
		} catch (err) {
			console.error("Error loading image:", err);
		}
	}

	public static saveImage(counter: number) {
		let cvs = this.cvs();
		fs.writeFileSync(`${Finder.BUILDDIR}/images/${counter}.png`, cvs.toBuffer(`image/png`));
	}

	public static draw(renderArray: (ImageLoadedObject | undefined)[], configIndex: number) {
		let ctx = ImageSlaver.ctx();
        ctx.clearRect(0, 0, CavasFormat.width, CavasFormat.height);
        if (CavasBackground.generate) {
			this.drawBackground();
        }

		renderArray.forEach((renderObj, index) => {
			const len = LayerConfigurations[configIndex].layersOrder.length;
			if (renderObj) {
				this.drawElement(renderObj, index, len);
			}
		});
	}

	static drawBackground() {
		let ctx = this.ctx();
		ctx.fillStyle = CavasBackground.static ? CavasBackground.default : this.genColor();
		ctx.fillRect(0, 0, CavasFormat.width, CavasFormat.height);
	}

	static genColor() : string {
		let hue = Math.floor(Math.random() * 360);
		let pastel = `hsl(${hue}, 100%, ${CavasBackground.brightness})`;
		return pastel;
	}

	static drawElement(renderObj:ImageLoadedObject, idx: number, length: number) {
		let ctx = this.ctx();
		let alpha: number = 1.0;
		if (renderObj.dnaElement.opacity) {
			alpha = renderObj.dnaElement.opacity;
		}
		ctx.globalAlpha = alpha;

		if (renderObj.dnaElement.blend) {
			ctx.globalCompositeOperation = renderObj.dnaElement.blend;
		}

		if (renderObj.loadedImage) {
			ctx.drawImage(renderObj.loadedImage as any, 0, 0, CavasFormat.width, CavasFormat.height);
		}
	}
}