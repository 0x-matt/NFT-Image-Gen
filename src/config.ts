
export const RarityDelimiter = "#";
export const DNA_DELIMITER = "-";
export const GENE_SPLITER = ":";
export const DebugLogging = false;

export interface LayerObjectConfigOptions {
    opacity?: number,
    blend?: GlobalCompositeOperation, // BlendMode
    bypassDNA? : boolean,
    displayName? : string
}

export interface LayerObjectConfig {
    name: string,
    options?: LayerObjectConfigOptions
}

export interface LayerConfiguration {
    growToSize: number,
    layersOrder: LayerObjectConfig[],
}

export const LayerConfigurations: LayerConfiguration[] = [
    {
        growToSize: 11000,
        layersOrder: [
            { name: "01_background" },
            { name: "02_backhair" },
            { name: "03_backweapon" },
            { name: "04_wholeBody" },
            { name: "05_trousers" },
            { name: "06_coat" },
            { name: "07_earings" },
            { name: "08_eyemask" },
            { name: "09_neckDecoration" },
            { name: "10_headDecoration" },
        ],
    },
];

/*
 * female
            { name: "01_background" },
            { name: "02_backhair" },
            { name: "03_backweapon" },
            { name: "04_wholeBody" },
            { name: "05_trousers" },
            { name: "06_coat" },
            { name: "07_earings" },
            { name: "09_neckDecoration" },
            { name: "10_headDecoration" },
 */
