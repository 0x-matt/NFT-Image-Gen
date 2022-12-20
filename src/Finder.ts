
import * as fs from "fs";
import { debuglog } from "util";
import { LayerObjectConfig, RarityDelimiter } from "./config";
import { DebugLog } from "./DebugLog";

export interface LayerObject {
	id: number,
	elements: LayerImageObject[],
	bypassDNA: boolean,

	name?: string,
	blend?: GlobalCompositeOperation,
	opacity?: number,
}

export interface LayerImageObject {
	layerIndex: number, // 所在层
	id: number,
	name: string,
	filename: string,
	path: string,
	weight: number,
	pair?: string,   // 配对信息
}

/* 
 * 配对层数信息, 命名格式: 
 * $2_1$, 命名中存在这样的信息，表示需要配对
 * 2 表示和第二层配对
 * 1 对应的配对标记
 */
export interface LayerPair {
	layerFlag: string,
	itemFlag: string,
}

export class Finder {
    static BASEPATH = process.cwd();
    static BUILDDIR = `${Finder.BASEPATH}/build`;
    static LAYERSDIR = `${Finder.BASEPATH}/layers`;

	public static layersSetup(layersOrder: LayerObjectConfig[]): LayerObject[] {
		return layersOrder.map((layerObj: LayerObjectConfig, idx: number) => {
			// 层数从 1 开始
			const i = idx + 1;
			let obj:LayerObject = {
				id: i,
				bypassDNA: false,
				elements: Finder.getElements(`${Finder.LAYERSDIR}/${layerObj.name}/`, i)
			};
			//DebugLog.Log(obj);
			return obj;
		});
	}

    private static cleanName(_str: string): string {
        // (0, -4): '.png', backWeapon01#20.png ---> backWeapon01#20
        let nameWithoutExtension = _str.slice(0, -4);
        // backWeapon01#20 --> backWeapon01
        let nameWithoutWeight = nameWithoutExtension.split(RarityDelimiter).shift();
        if (!nameWithoutWeight) {
            nameWithoutWeight = "";
        }
        return nameWithoutWeight;
    }

    private static getRarityWeight(_str: string): number {
        let nameWithoutExtension = _str.slice(0, -4);
        let nameWithoutWeight = Number(
            // backWeapon01#20 --> backWeapon01 20 ---> 20
            nameWithoutExtension.split(RarityDelimiter).pop()
        );
        if (isNaN(nameWithoutWeight)) {
            nameWithoutWeight = 1;
        }
        return nameWithoutWeight;
    }

	private static getPairInfo(_str: string, layerIndex: number): string | undefined {
		let nameWithoutExtension = _str.slice(0, -4);
		let nameWithoutWeight: string | undefined = nameWithoutExtension.split(RarityDelimiter).shift();
		let ret: string | undefined = undefined;
		if (nameWithoutWeight) {
			let arr = /[$](?:.*)[$]/g.exec(nameWithoutWeight);
			if (arr && arr.length > 0) {
				ret = arr[0];
			}
		}

        return ret;
    }

    // path: layers/ sub directory name
    public static getElements(path: string, layerIndex: number): LayerImageObject[] {
        let rets: LayerImageObject[] = fs
            .readdirSync(path)
            .filter((item) => !/(?:^|\/)\.[^\/\.]/g.test(item))
            .map((ele, idx) => {
                // ele: layer image name
                if (ele.includes("-")) {
                    throw new Error(
                        `layer name can not contain dashes, please fix: ${ele}`
                    );
                }
                let obj: LayerImageObject = {
					layerIndex: layerIndex,
                    id: idx,
                    name: this.cleanName(ele),
                    filename: ele,
                    path: `${path}${ele}`,
                    weight: this.getRarityWeight(ele),
					pair: this.getPairInfo(ele, layerIndex)
                };
                return obj;
            });
        return rets;
    }
}
