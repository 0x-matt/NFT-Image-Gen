
import * as fs from 'fs'

import {
    LayerConfiguration,
    LayerConfigurations,
    LayerObjectConfig,
    RarityDelimiter,
} from "./config";
import { DebugLog } from './DebugLog';
import { LayerImageObject, LayerObject, Finder } from "./Finder";
import { ImageDna, LayerDnaElement } from "./ImageDna";
import { resolve } from "path";
import { ImageLoadedObject, ImageSlaver } from "./ImageSlaver";
import { debug } from 'console';


(function run () {
	buildSetup();
	startCreating();
})();

export function buildSetup() {
	if (fs.existsSync(Finder.BUILDDIR)) {
		fs.rmSync(Finder.BUILDDIR, {recursive: true});
	}

	fs.mkdirSync(Finder.BUILDDIR);
	fs.mkdirSync(`${Finder.BUILDDIR}/json`);
	fs.mkdirSync(`${Finder.BUILDDIR}/images`);
}

export async function startCreating() {

	let configIndex = 0;
	let editionCount = 1;
	let failedCount = 0;

	const layerLength = LayerConfigurations.length;
	while (configIndex < layerLength) {
		let lOrder = LayerConfigurations[configIndex].layersOrder;
		const layers: LayerObject[] = Finder.layersSetup(lOrder);
		// start compound image
		const growToSize: Number = LayerConfigurations[configIndex].growToSize;
		while (editionCount <= growToSize) {
			let newDna: string = ImageDna.createDna(layers);
			DebugLog.Log('newDna', editionCount,'------: ', newDna);
			if (ImageDna.isDnaUnique(newDna)) {
				let results: LayerDnaElement[] = ImageDna.constructLayerToDna(newDna, layers);
				let loadedElements: Promise<ImageLoadedObject | undefined>[] = [];
				results.forEach((dnaElement: LayerDnaElement) => {
					const imageEle: Promise<ImageLoadedObject | undefined> = ImageSlaver.loadLayerImage(dnaElement);
					loadedElements.push(imageEle);
				});
				
				await Promise.all(loadedElements).then((renderArray: (ImageLoadedObject | undefined)[]) => {
					ImageSlaver.draw(renderArray, configIndex);
					ImageSlaver.saveImage(editionCount);
				});

				ImageDna.dnaList.add(ImageDna.filterDNAOptions(newDna));
			} else {
				console.log('[Duplicated]: image dna: ', newDna);
			}
			editionCount += 1;
		}

		configIndex += 1;
	}
}