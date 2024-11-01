import React from "react";

export default function SegmentationDataModal({
  opened,
  segments,
  setOpened,
}: {
  opened: boolean;
  segments?: { organName: string; volumeCM: string; meanHU: string }[];
  setOpened: (opened: boolean) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && opened) {
        setOpened(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpened(false);
      }
    };

    if (opened) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [opened, setOpened]);

  if (!opened) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={ref} className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Segmentation Data</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setOpened(false)}
          >
            &times;
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Tissue</th>
              <th className="pb-2">Cross-sectional Area</th>
              <th className="pb-2">Mean HU</th>
            </tr>
          </thead>
          <tbody>
            {segments?.map(({ organName, volumeCM, meanHU }, i) => (
              <tr key={`organ-${i}`}>
                <td className="py-2">{organName}</td>
                <td className="py-2">{volumeCM}</td>
                <td className="py-2">{meanHU}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
