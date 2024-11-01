import { defaultColors } from "@/utils/consts";

export default function VisualizationControls({
  segments,
  visibilities,
  setVisibilities,
  opacity,
  setOpacity,
}: {
  segments?: { organName: string }[];
  visibilities: boolean[];
  setVisibilities: React.Dispatch<React.SetStateAction<boolean[]>>;
  opacity: number;
  setOpacity: (opacity: number) => void;
}) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 whitespace-nowrap">
        Organ Controls
      </h2>
      <div className="mb-4 whitespace-nowrap">
        <button
          className="text-sm text-blue-400 hover:text-blue-300 mr-4"
          onClick={() => setVisibilities(segments?.map(() => true) || [])}
        >
          Select All
        </button>
        <button
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={() => setVisibilities(segments?.map(() => false) || [])}
        >
          Deselect All
        </button>
      </div>
      {segments?.map(({ organName }, i) => (
        <label
          key={`organ-${i}`}
          className="flex items-center mb-2 cursor-pointer whitespace-nowrap"
        >
          <input
            type="checkbox"
            checked={!!visibilities[i]}
            onChange={(e) =>
              setVisibilities(
                (prev) =>
                  segments?.map((_, j) =>
                    j === i ? e.target.checked : prev[j]
                  ) || []
              )
            }
            className="mr-2"
          />
          <span className="flex-1">{organName}</span>
          <span
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{
              backgroundColor: `rgba(${defaultColors[i].join(",")})`,
            }}
          ></span>
        </label>
      ))}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 whitespace-nowrap">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </>
  );
}
