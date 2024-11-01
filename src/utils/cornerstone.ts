"use client";

import { init as initCore, volumeLoader } from "@cornerstonejs/core";
import { cornerstoneNiftiImageVolumeLoader } from "@cornerstonejs/nifti-volume-loader";
import {
  addTool,
  init as initTools,
  PanTool,
  SegmentationDisplayTool,
  StackScrollMouseWheelTool,
  ZoomTool,
} from "@cornerstonejs/tools";

export const TOOLS = [
  StackScrollMouseWheelTool,
  SegmentationDisplayTool,
  ZoomTool,
  PanTool,
];

let initialized: Promise<void> | null = null;
export async function initCornerstone() {
  if (initialized) {
    return initialized;
  }

  initialized = (async () => {
    console.log("CALLING INIT");

    await initCore();
    initTools();

    volumeLoader.registerVolumeLoader(
      "nifti",
      cornerstoneNiftiImageVolumeLoader
    );

    TOOLS.forEach((tool) => {
      console.log("adding tool", tool.toolName, "to cornerstone");
      addTool(tool);
    });

    console.log("init complete");
  })();

  return initialized;
}
