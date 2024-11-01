"use client";

import { useCornerstone } from "@/context/CornerstoneContext";
import getUniqueID from "@/utils/uniqueID";
import { Enums } from "@cornerstonejs/core";
import React from "react";

export default function Cornerstone({
  type,
  orientation,
  className,
}: {
  type: Enums.ViewportType;
  orientation: Enums.OrientationAxis;
  className: string;
}) {
  const {
    toolGroup,
    renderingEngine,
    scheduleResize,
    addViewport,
    removeViewport,
  } = useCornerstone();
  const viewportId = React.useMemo(() => getUniqueID("viewport"), []);
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);

  const ref = React.useCallback(
    (node: HTMLDivElement) => {
      const resizeObserver = new ResizeObserver(() => {
        scheduleResize();
      });
      resizeObserver.observe(node);

      node.oncontextmenu = (e) => e.preventDefault();

      setElement(node);

      return () => {
        resizeObserver.disconnect();
        setElement(null);
      };
    },
    [scheduleResize]
  );

  React.useEffect(() => {
    if (!renderingEngine) return;
    if (!element) return;

    renderingEngine.enableElement({
      element,
      viewportId,
      type,
      defaultOptions: { orientation },
    });

    addViewport(viewportId);

    return () => {
      renderingEngine.disableElement(viewportId);

      removeViewport(viewportId);
    };
  }, [
    renderingEngine,
    type,
    orientation,
    element,
    addViewport,
    removeViewport,
    viewportId,
  ]);

  React.useEffect(() => {
    if (!toolGroup) return;
    if (!renderingEngine) return;

    console.log("adding viewport", viewportId, "to toolgroup");
    toolGroup.addViewport(viewportId, renderingEngine.id);

    return () => {
      console.log("removing viewport", viewportId, "from toolgroup");
      toolGroup.removeViewports(renderingEngine.id, viewportId);
    };
  }, [toolGroup, renderingEngine, viewportId]);

  return <div ref={ref} className={className}></div>;
}
