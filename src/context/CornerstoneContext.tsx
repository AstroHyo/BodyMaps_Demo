"use client";

import arrayBufferToNiftiImageVolume from "@/utils/arrayBufferToNiftiImageVolume";
import {
  DEFAULT_SEGMENTATION_CONFIG,
  DEFAULT_SEGMENTATION_OPACITY,
  DEFAULT_IMAGE_WINDOW,
  DEFAULT_IMAGE_LEVEL,
  defaultColors,
} from "@/utils/consts";
import { initCornerstone, TOOLS } from "@/utils/cornerstone";
import getUniqueID from "@/utils/uniqueID";
import {
  cache,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from "@cornerstonejs/core";
import {
  Enums,
  PanTool,
  SegmentationDisplayTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  ZoomTool,
  segmentation,
} from "@cornerstonejs/tools";
import type ToolGroup from "@cornerstonejs/tools/dist/types/store/ToolGroupManager/ToolGroup";
import {
  RepresentationPublicInput,
  SegmentationPublicInput,
} from "@cornerstonejs/tools/dist/types/types";
import React from "react";

type Segmentation = {
  organName: string;
  content: ArrayBuffer;
  volumeCM: string;
  meanHU: string;
};

type _Segmentation = Segmentation & {
  volumeId: string;
  segmentationId: string;
};

type CornerstoneContextType = {
  initialized: boolean;
  setVolumeURL: (url: string) => void;
  scheduleResize: () => void;
  addViewport: (id: string) => void;
  removeViewport: (id: string) => void;
  renderingEngine: RenderingEngine | null;
  toolGroup: ToolGroup | null;

  segmentations: Segmentation[];
  setSegmentations: (segmentations: Segmentation[]) => void;

  segmentationVisibilities: boolean[];
  setSegmentationVisibilities: React.Dispatch<React.SetStateAction<boolean[]>>;

  toolGroupOpacity: number;
  setToolGroupOpacity: (opacity: number) => void;

  window: number;
  setWindow: (window: number) => void;
  level: number;
  setLevel: (level: number) => void;
};

const CornerstoneContext = React.createContext<CornerstoneContextType | null>(
  null
);

export const CornerstoneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = React.useState(false);
  const [viewports, setViewports] = React.useState<string[]>([]);
  const [volumeURL, setVolumeURL] = React.useState<string | undefined>(
    undefined
  );
  const [volumeId, setVolumeId] = React.useState<string | undefined>(undefined);
  const [toolGroup, setToolGroup] = React.useState<ToolGroup | null>(null);
  const [segmentations, _setSegmentations] = React.useState<_Segmentation[]>(
    []
  );
  const [segmentationVisibilities, setSegmentationVisibilities] =
    React.useState<boolean[]>([]);
  const [toolGroupOpacity, setToolGroupOpacity] = React.useState<number>(
    DEFAULT_SEGMENTATION_OPACITY
  );
  const [window, setWindow] = React.useState<number>(DEFAULT_IMAGE_WINDOW);
  const [level, setLevel] = React.useState<number>(DEFAULT_IMAGE_LEVEL);

  React.useEffect(() => {
    if (!initialized) return;
    if (!volumeURL) return;

    const _volumeId = `nifti:${volumeURL}`;

    console.log("loading volume", _volumeId);
    volumeLoader.createAndCacheVolume(_volumeId).then(() => {
      console.log("loaded volume", _volumeId);
      setVolumeId(_volumeId);
    });

    return () => {
      console.log("removing volume", _volumeId);
      cache.removeVolumeLoadObject(_volumeId);
    };
  }, [initialized, volumeURL]);

  React.useEffect(() => {
    initCornerstone().then(() => setInitialized(true));
  }, []);

  const [renderingEngine, setRenderingEngine] =
    React.useState<RenderingEngine | null>(null);

  React.useEffect(() => {
    if (!initialized) return;
    console.log("rendering engine is set");
    setRenderingEngine(new RenderingEngine());
  }, [initialized]);

  const renderingEngineRef = React.useRef<RenderingEngine | null>(null);
  React.useEffect(() => {
    renderingEngineRef.current = renderingEngine;
  }, [renderingEngine]);
  const resizeDebounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scheduleResize = React.useCallback(() => {
    if (resizeDebounceTimeoutRef.current) {
      clearTimeout(resizeDebounceTimeoutRef.current);
    }

    resizeDebounceTimeoutRef.current = setTimeout(() => {
      renderingEngineRef?.current?.resize();
      resizeDebounceTimeoutRef.current = null;
    }, 10);
  }, []);

  const addViewport = React.useCallback((id: string) => {
    setViewports((prev) => [...prev, id]);
  }, []);

  const removeViewport = React.useCallback((id: string) => {
    setViewports((prev) => prev.filter((v) => v !== id));
  }, []);

  React.useEffect(() => {
    if (!renderingEngine) return;
    if (!volumeId) return;
    if (!viewports.length) return;

    console.log("setting volume", [{ volumeId }], "for viewports", viewports);
    setVolumesForViewports(renderingEngine, [{ volumeId }], viewports);

    console.log("triggering render");
    renderingEngine.render();
  }, [renderingEngine, volumeId, viewports]);

  const setSegmentations = (newSegmentations: Segmentation[]) => {
    console.log("setting segmentations", newSegmentations);
    _setSegmentations(
      newSegmentations.map(
        ({ content, ...others }): _Segmentation => ({
          volumeId: arrayBufferToNiftiImageVolume({ buffer: content }).volumeId,
          segmentationId: getUniqueID("segmentation"),
          content,
          ...others,
        })
      )
    );

    setSegmentationVisibilities(newSegmentations.map(() => true));
  };

  React.useEffect(() => {
    if (!segmentations.length) return;
    if (!initialized) return;
    if (!renderingEngine) return;
    if (!volumeId) return;
    if (!viewports.length) return;

    const tgid = getUniqueID("toolGroup");
    console.log("creating toolgroup", tgid);

    const tg = ToolGroupManager.createToolGroup(tgid);
    if (!tg) {
      throw new Error("Failed to create tool group");
    }

    TOOLS.forEach((t) => {
      console.log("adding tool", t.toolName, "to toolgroup");
      tg.addTool(t.toolName);
    });

    tg.setToolActive(StackScrollMouseWheelTool.toolName);
    tg.setToolEnabled(SegmentationDisplayTool.toolName);
    tg.setToolActive(PanTool.toolName, {
      bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
    });
    tg.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: Enums.MouseBindings.Secondary }],
    });

    setToolGroup(tg);

    return () => {
      console.log("destroying toolgroup", tgid);
      ToolGroupManager.destroyToolGroup(tgid);
      setToolGroup(null);
    };
  }, [segmentations, initialized, renderingEngine, volumeId, viewports]);

  React.useEffect(() => {
    if (!toolGroup) return;
    if (!segmentations.length) return;
    if (!ToolGroupManager.getToolGroup(toolGroup.id)) return;

    const segSpecs = segmentations.map(
      ({ segmentationId, volumeId }): SegmentationPublicInput => ({
        segmentationId,
        representation: {
          type: Enums.SegmentationRepresentations.Labelmap,
          data: {
            volumeId,
          },
        },
      })
    );
    console.log("adding segmentations", segSpecs);

    segmentation.addSegmentations(segSpecs);

    const segRepSpecs = segmentations.map(
      ({ segmentationId }, i): RepresentationPublicInput => ({
        segmentationId,
        type: Enums.SegmentationRepresentations.Labelmap,
        options: {
          colorLUTOrIndex: [defaultColors[i], defaultColors[i]],
        },
      })
    );

    console.log(
      "adding segmentation representations",
      segRepSpecs,
      "to toolGroup",
      toolGroup.id
    );

    segmentation
      .addSegmentationRepresentations(toolGroup.id, segRepSpecs, {
        renderInactiveSegmentations: true,
        representations: {
          [Enums.SegmentationRepresentations.Labelmap]:
            DEFAULT_SEGMENTATION_CONFIG,
        },
      })
      .then((ids) => {
        console.log("added segmentation representations", ids);
      });

    return () => {
      segmentations.forEach((s) => {
        console.log("removing segmentation", s.segmentationId);
        segmentation.state.removeSegmentation(s.segmentationId);
      });
    };
  }, [segmentations, toolGroup]);

  React.useEffect(() => {
    if (!toolGroup) return;

    const segReps = segmentation.state.getSegmentationRepresentations(
      toolGroup.id
    );

    if (segReps?.length !== segmentationVisibilities.length) return;

    segmentationVisibilities.forEach((visible, i) => {
      const segRepID = segReps?.[i]?.segmentationRepresentationUID;
      if (!segRepID) {
        throw new Error("Segmentation index out of bounds");
      }

      console.log("updating visibility of", segRepID, "to", visible);
      segmentation.config.visibility.setSegmentVisibility(
        toolGroup.id,
        segRepID,
        1,
        visible
      );
    });
  }, [toolGroup, segmentationVisibilities]);

  React.useEffect(() => {
    if (!toolGroup) return;

    segmentation.config.setToolGroupSpecificConfig(toolGroup.id, {
      renderInactiveSegmentations: true,
      representations: {
        [Enums.SegmentationRepresentations.Labelmap]: {
          ...DEFAULT_SEGMENTATION_CONFIG,
          fillAlpha: toolGroupOpacity,
          fillAlphaInactive: toolGroupOpacity,
          outlineOpacity: toolGroupOpacity,
          outlineOpacityInactive: toolGroupOpacity,
        },
      },
    });
  }, [toolGroupOpacity, toolGroup]);

  React.useEffect(() => {
    if (!renderingEngine) return;

    renderingEngine.getVolumeViewports().forEach((vv) => {
      vv.setProperties({
        voiRange: {
          upper: level + window / 2,
          lower: level - window / 2,
        },
      });
      vv.render();
    });
  }, [window, level, renderingEngine]);

  return (
    <CornerstoneContext.Provider
      value={{
        initialized,
        renderingEngine,
        toolGroup,
        scheduleResize,
        addViewport,
        removeViewport,
        setVolumeURL,

        segmentations,
        setSegmentations,

        segmentationVisibilities,
        setSegmentationVisibilities,

        toolGroupOpacity,
        setToolGroupOpacity,

        window,
        setWindow,
        level,
        setLevel,
      }}
    >
      {children}
    </CornerstoneContext.Provider>
  );
};

export const useCornerstone = (): CornerstoneContextType => {
  const context = React.useContext(CornerstoneContext);

  if (!context) {
    throw new Error("useCornerstone must be used within a CornerstoneProvider");
  }

  return context;
};
