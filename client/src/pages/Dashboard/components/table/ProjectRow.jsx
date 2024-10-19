import { MoreVertical } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { MemberAvatars } from '../common/MemberAvatars';
import { StatusBadge } from '../common/StatusBadge';

export const ProjectRow = ({ project }) => (
  <tr className="border-b last:border-b-0 hover:bg-gray-50">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg">{project.icon}</span>
        <div>
          <div className="font-medium text-md">{project.name}</div>
          <div className="text-xs text-gray-500">{project.slug}</div>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <StatusBadge status={project.status} />
    </td>
    <td className="py-4 px-6 text-gray-600">{project.about}</td>
    <td className="py-4 px-6">
      <MemberAvatars count={project.members} />
    </td>
    <td className="py-4 px-6">
      <ProgressBar progress={project.progress} />
    </td>
    <td className="py-4 px-6">
      <button className="p-1 hover:bg-gray-100 rounded">
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </button>
    </td>
  </tr>
);