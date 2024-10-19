import { getStatusColor } from "../../utils/helpers";
export const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
      {status}
    </span>
  );