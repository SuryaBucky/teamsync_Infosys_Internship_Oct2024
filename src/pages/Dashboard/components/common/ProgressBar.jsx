import { getProgressColor } from "../../utils/helpers";
export const ProgressBar = ({ progress }) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{progress}%</span>
    </div>
  );