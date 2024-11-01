"use client";

import dynamic from "next/dynamic";

const DynamicVisualization = dynamic(
  () => import("@/components/Visualization"),
  { ssr: false }
);

export default function VisualizationPage() {
  return <DynamicVisualization />;
}
