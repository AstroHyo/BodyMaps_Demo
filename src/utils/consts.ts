import { Color } from "@cornerstonejs/core/dist/types/types";

export const DEFAULT_SEGMENTATION_OPACITY = 0.6;

export const DEFAULT_IMAGE_WINDOW = 40;
export const DEFAULT_IMAGE_LEVEL = 500;

export const DEFAULT_SEGMENTATION_CONFIG = {
  fillAlpha: DEFAULT_SEGMENTATION_OPACITY,
  fillAlphaInactive: DEFAULT_SEGMENTATION_OPACITY,
  outlineOpacity: DEFAULT_SEGMENTATION_OPACITY,
  outlineOpacityInactive: DEFAULT_SEGMENTATION_OPACITY,
  outlineWidth: 3,
  outlineWidthInactive: 3,
};

const RED: Color = [230, 25, 75, 255];
const BLUE: Color = [0, 130, 200, 255];
const MAROON: Color = [128, 0, 0, 255];
const BROWN: Color = [170, 110, 40, 255];
const OLIVE: Color = [128, 128, 0, 255];
const TEAL: Color = [0, 128, 128, 255];
const PURPLE: Color = [145, 30, 180, 255];
const MAGENTA: Color = [240, 50, 230, 255];
const LIME: Color = [50, 205, 50, 255];
export const defaultColors: Color[] = [
  RED,
  BLUE,
  MAROON,
  BROWN,
  OLIVE,
  TEAL,
  PURPLE,
  MAGENTA,
  LIME,
];
export const NVcolorMaps: {
  name: string;
  cmap: {
    R: number[];
    G: number[];
    B: number[];
    A: number[];
    // I: number[];
  };
}[] = [
  {
    name: "RED",
    cmap: {
      R: [0, 230],
      G: [0, 25],
      B: [0, 75],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "BLUE",
    cmap: {
      R: [0, 0],
      G: [0, 130],
      B: [0, 200],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "MAROON",
    cmap: {
      R: [0, 128],
      G: [0],
      B: [0],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "BROWN",
    cmap: {
      R: [0, 170],
      G: [0, 110],
      B: [0, 40],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "OLIVE",
    cmap: {
      R: [0, 128],
      G: [0, 128],
      B: [0, 0],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "TEAL",
    cmap: {
      R: [0, 0],
      G: [0, 128],
      B: [0, 128],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "PURPLE",
    cmap: {
      R: [0, 145],
      G: [0, 30],
      B: [0, 180],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "MAGENTA",
    cmap: {
      R: [0, 240],
      G: [0, 50],
      B: [0, 230],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
  {
    name: "LIME",
    cmap: {
      R: [0, 50],
      G: [0, 205],
      B: [0, 50],
      A: [0, 255],
      //   I: [255, 255],
    },
  },
];

export const accepted_exts = [".nii.gz", ".nii"];
