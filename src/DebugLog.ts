
import { DebugLogging } from "./config";

export class DebugLog {
	public static Log(...argus: any[]) {
		if (DebugLogging) {
			// console.log(argus);
		} else {
			// 
		}

		console.log(...argus);
	}
}