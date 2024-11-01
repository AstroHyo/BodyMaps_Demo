"use client";

import { NVcolorMaps } from "@/utils/consts";
import { Niivue, NVImage, SLICE_TYPE } from "@niivue/niivue";
import React, { HTMLAttributes } from "react";

export default function NiivueCanvas({
  className,
  style,
  segmentations,
  visibilities,
}: {
  className?: HTMLAttributes<HTMLCanvasElement>["className"];
  style?: HTMLAttributes<HTMLCanvasElement>["style"];
  segmentations?: { organName: string; content: ArrayBuffer }[];
  visibilities: boolean[];
}) {
  const [niivue, setNiivue] = React.useState<Niivue | null>(null);

  React.useEffect(() => {
    const niivue = new Niivue({
      sliceType: SLICE_TYPE.RENDER,
    });

    NVcolorMaps.forEach(({ name, cmap }) =>
      niivue.addColormap(
        name,
        // {Niivue.addColormap} expects I to be optional, but their type definition doesn't reflect that
        cmap as {
          R: number[];
          G: number[];
          B: number[];
          A: number[];
          I: number[];
        }
      )
    );

    setNiivue(niivue);
  }, []);

  const renderRef = React.useCallback(
    (node: HTMLCanvasElement) => {
      if (!niivue) return;
      if (!node) return;

      niivue.attachToCanvas(node);
    },
    [niivue]
  );

  React.useEffect(() => {
    if (!niivue) return;
    if (!segmentations) return;

    segmentations.forEach(({ organName, content }, i) => {
      niivue.addVolume(
        new NVImage(content, `${organName}.nii.gz`, NVcolorMaps[i].name)
      );
    });

    return () => {
      niivue.volumes.forEach((v) => niivue.removeVolume(v));
    };
  }, [niivue, segmentations]);

  React.useEffect(() => {
    if (!niivue) return;
    if (niivue.volumes.length !== visibilities.length) return;

    niivue.volumes.forEach((v, i) => {
      v.opacity = visibilities[i] ? 1 : 0;
    });

    niivue.updateGLVolume();
  }, [visibilities, niivue]);

  return <canvas ref={renderRef} className={className} style={style} />;
}
