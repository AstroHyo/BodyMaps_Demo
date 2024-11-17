"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Menu,
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Cornerstone from "@/components/Cornerstone";
import { Enums } from "@cornerstonejs/core";
import { useCornerstone } from "@/context/CornerstoneContext";

import NiivueCanvas from "@/components/Niivue";
import SegmentationDataModal from "@/components/SegmentationDataModal";
import VisualizationControls from "@/components/VisualizationControls";

export default function Visualization() {
  const [showModal, setShowModal] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [fullscreenPanel, setFullscreenPanel] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarMinimized((prev) => !prev);
  };

  const toggleFullscreen = (panelIndex: number) => {
    setFullscreenPanel((prev) => (prev === panelIndex ? null : panelIndex));
  };

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.style.width = sidebarMinimized ? "64px" : "256px";
    }
  }, [sidebarMinimized]);

  const {
    segmentations,
    segmentationVisibilities,
    setSegmentationVisibilities,
    toolGroupOpacity,
    setToolGroupOpacity,
    window,
    setWindow,
    level,
    setLevel,
  } = useCornerstone();

  useEffect(() => {
    if (!segmentations.length) {
      router.push("/");
    }
  }, [segmentations, router]);

  if (!segmentations.length) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-black text-white">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-900 p-4 flex flex-col transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}
        style={{ width: sidebarMinimized ? "64px" : "256px" }}
      >
        <div className="flex items-center justify-between mb-6 whitespace-nowrap">
          {!sidebarMinimized && (
            <button
              className="flex items-center text-gray-400 hover:text-white"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
          )}
          <button
            className="text-gray-400 hover:text-white ml-auto"
            onClick={toggleSidebar}
            aria-label={
              sidebarMinimized ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarMinimized ? (
              <Menu className="w-6 h-6" />
            ) : (
              <ChevronLeft className="w-6 h-6" />
            )}
          </button>
        </div>
        <div
          className={`transition-opacity duration-300 ease-in-out ${
            sidebarMinimized ? "opacity-0" : "opacity-100"
          }`}
        >
          <VisualizationControls
            segments={segmentations}
            visibilities={segmentationVisibilities}
            setVisibilities={setSegmentationVisibilities}
            opacity={toolGroupOpacity}
            setOpacity={setToolGroupOpacity}
            window={window}
            setWindow={setWindow}
            level={level}
            setLevel={setLevel}     
          />
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300 w-full whitespace-nowrap"
            onClick={() => setShowModal(true)}
            disabled={!segmentations.length}
          >
            Show Segmentation Data
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-wrap">
        {[0, 1, 2, 3].map((panelIndex) => (
          <div
            key={panelIndex}
            className={`
              ${
                fullscreenPanel === null
                  ? "w-1/2 h-1/2"
                  : fullscreenPanel === panelIndex
                  ? "w-full h-full"
                  : "hidden"
              }
              border border-gray-800 relative
            `}
          >
            {panelIndex === 3 ? (
              <NiivueCanvas
                className="absolute inset-0 flex"
                style={{ opacity: toolGroupOpacity }}
                segmentations={segmentations}
                visibilities={segmentationVisibilities}
              />
            ) : (
              <Cornerstone
                className="absolute inset-0 flex"
                type={Enums.ViewportType.ORTHOGRAPHIC}
                orientation={
                  panelIndex === 0
                    ? Enums.OrientationAxis.AXIAL
                    : panelIndex === 1
                    ? Enums.OrientationAxis.SAGITTAL
                    : Enums.OrientationAxis.CORONAL
                }
              />
            )}

            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => toggleFullscreen(panelIndex)}
            >
              {fullscreenPanel === panelIndex ? (
                <Minimize2 className="w-6 h-6" />
              ) : (
                <Maximize2 className="w-6 h-6" />
              )}
            </button>
          </div>
        ))}
      </div>

      <SegmentationDataModal
        opened={showModal}
        setOpened={setShowModal}
        segments={segmentations}
      />
    </div>
  );
}
