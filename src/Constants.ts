
export enum NETWORK {
	Eth = 'Eth',
	Sol = 'Sol'
}

export const CavasFormat = {
    width: 2000,
    height: 2000,
    smoothing: false,
};

export const CavasBackground = {
    generate: true,
    brightness: "80%",
    static: false,
    default: "#000000",
};

export const BlendMode = {
	/* ctx.globalCompositeOperation:
	 *
	 * type GlobalCompositeOperation = 
	 * "color" | "color-burn" | "color-dodge" | "copy" | "darken" | 
	 * "destination-atop" | "destination-in" | "destination-out" | 
	 * "destination-over" | "difference" | "exclusion" | "hard-light" | 
	 * "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | 
	 * "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | 
	 * "source-in" | "source-out" | "source-over" | "xor";
	 * 
	 */
	sourceOver: "source-over",
	sourceIn: "source-in",
	sourceOut: "source-out",
	sourceAtop: "source-out",
	destinationOver: "destination-over",
	destinationIn: "destination-in",
	destinationOut: "destination-out",
	destinationAtop: "destination-atop",
	lighter: "lighter",
	copy: "copy",
	xor: "xor",
	multiply: "multiply",
	screen: "screen",
	overlay: "overlay",
	darken: "darken",
	lighten: "lighten",
	colorDodge: "color-dodge",
	colorBurn: "color-burn",
	hardLight: "hard-light",
	softLight: "soft-light",
	difference: "difference",
	exclusion: "exclusion",
	hue: "hue",
	saturation: "saturation",
	color: "color",
	luminosity: "luminosity",
  };