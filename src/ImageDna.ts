
import { DNA_DELIMITER, GENE_SPLITER } from "./config";
import { DebugLog } from "./DebugLog";
import { LayerImageObject, LayerObject } from "./Finder";

export interface LayerDnaElement {
	name?: string,
	blend?: GlobalCompositeOperation,
	opacity?: number,
	selectedElement?: LayerImageObject
}

export class ImageDna {

	public static dnaList = new Set();

	public static constructLayerToDna(_dna: string = "", _layers: LayerObject[] = []): LayerDnaElement[] {
		let array: LayerDnaElement[] = _layers.map((layer: LayerObject, index: number) => {
			// find: return the first element in the provided array that satisfied the provided testing function.
			let selectedElement = layer.elements.find((e) => {
				// 找出每一层中和基因片段 gene 中元素对应的图片元素
				let gene = _dna.split(DNA_DELIMITER)[index];
				return e.id == this.geneNumber(gene);
			});

			if (!selectedElement) {
				// Can throw an error according to design purpose
			}

			let dnaElement: LayerDnaElement = {
				name: layer.name,
				blend: layer.blend,
				opacity: layer.opacity,
				selectedElement: selectedElement
			};

			return dnaElement;
		});
		return array;
	}

	// gene: dna 中每一层的基因序列, 返回该基因所在的层数
	private static geneNumber(gene: string) : number {

		// 删除参数序列
		function removeQueryStrings(_gene: string) {
			const query = /(\?.*$)/;
			return _gene.replace(query, "");
		}

		const withoutOptions = removeQueryStrings(gene);

		// 格式: `索引:图片名 - 索引:图片名 - 索引:图片名`
		let n = Number(withoutOptions.split(GENE_SPLITER).shift());
		return n;
	}

	public static createDna(_layers: LayerObject[]) : string {
		let totalWeight = 0;
		let genes: string[] = [];
		let pairs: string[] = [];
		for (const layer of _layers) {
			// 有配对需求，先尝试配对
			if (pairs.length > 0) {
				let re = layer.elements.find((ele) => {
					return ele.pair && pairs.includes(ele.pair);
				});
				if (re && re.pair) {
					let s = `${re.id}:${re.filename}${
						layer.bypassDNA ? "?bypassDNA=true" : ""}`;
					genes.push(s);

					DebugLog.Log('----配对 befor: ', s, 'pairs: ', pairs);
					// 删除配对消息
					let idx: number = pairs.indexOf(re.pair);
					if (idx !== -1) {
						pairs.splice(idx, 1);
					}
					DebugLog.Log('----配对 after: ', s, 'pairs: ', pairs);
					continue;
				}
			}

			let totalWeight: number = 0;
			layer.elements.forEach((ele => {
				totalWeight += ele.weight;
			}));
			/* 
			 * Math.random() greater than or equal to 0 and less than 1, 相当于一个百分比的值;
			 * totalWeight: 理想值为 100
			 * random < totalWeight
			 */
			let random = Math.floor(Math.random() * totalWeight);
			InnerLoop: for (let i = 0; i < layer.elements.length; i++) {
				let ele: LayerImageObject = layer.elements[i];
				random -= ele.weight;
				// 由于 random < totalWeight, 所以每一层总会选择一张图片
				if (random < 0) {
					let s = `${ele.id}:${ele.filename}${
						layer.bypassDNA ? "?bypassDNA=true" : ""}`;
					genes.push(s);

					// 检查配对
					if (ele.pair && !pairs.includes(ele.pair)) {
						pairs.push(ele.pair);
					}

					break InnerLoop;
				}
			}
		}
		/* 格式: `索引:图片名 - 索引:图片名 - `
		 * genes 数组个数应该与层数一致，层与层之间用 '-' 隔开。
		 */
		return genes.join(DNA_DELIMITER);
	}

	// 是否是一个新的 dna
	public static isDnaUnique(_dna: string = "") : boolean {
		// _dna 格式: `索引:图片名 - 索引:图片名 - `
		const _filterDna = this.filterDNAOptions(_dna);
		return !this.dnaList.has(_filterDna);
	}

	// 过滤 dna
	public static filterDNAOptions(_dna: string) {
		const dnaItems = _dna.split(DNA_DELIMITER);
		const filteredDNA = dnaItems.filter((ele) => {
			const query: RegExp = /(\?.*$)/;
			const queryString: RegExpExecArray | null = query.exec(ele);
			if (!queryString) {
				// 过滤以 ? 开头的 dna
				return true;
			}

			/* 以 ? 开头的，例如 ?ab=12&e=we&h=23
			 * 语法解析:
			 * ...obj，可以把一个 obj 的所有 k v 展开
			 * 在 obj 内部使用 [value]，可以把 value 变成 symbol 类型
			 * 最终解析为: { ab: '12', e: 'we', h: '23' }
			 * 
			 * 目前主要用于 bypassDNA
			 */
			const paramsString = queryString[1].substring(1);
			const options = paramsString.split("&").reduce((obj, cur) => {
				const kvs = cur.split('&');
				return {...obj, [kvs[0]] : kvs[1]};
			}, {});

			if (Object.keys(options).includes('bypassDNA')) {
				return (options as any).bypassDNA;
			}
			return false;
		});
		return filteredDNA.join(DNA_DELIMITER);
	}
}