import { MoreVertical } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { MemberAvatars } from '../common/MemberAvatars';
import { StatusBadge } from '../common/StatusBadge';

export const ProjectRow = ({ project }) => (
  <tr className="border-b last:border-b-0 hover:bg-gray-50">
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{project.icon}</span>
        <div>
          <div className="font-medium text-sm md:text-md line-clamp-1">{project.name}</div>
          <div className="text-xs text-gray-500">{project.slug}</div>
        </div>
      </div>
    </td>
    <td className="py-4 px-2">
      <span className="inline-flex justify-center items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
        {project.status}
      </span>
    </td>
    <td className="hidden sm:table-cell py-4 px-4 text-black text-xs">
      <div className="max-w-[200px] truncate" title={project.about}>
        {project.about}
      </div>
    </td>
    <td className="py-4 px-4">
      <div className="flex -space-x-2">
        {[...Array(Math.min(3, project.members))].map((_, i) => (
          <img
            key={i}
            src={`https://i.pravatar.cc/32?img=${i + 1}`}
            alt={`Member ${i + 1}`}
            className="w-7 h-7 rounded-full border-2 border-white"
          />
        ))}
        {project.members > 3 && (
          <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
            +{project.members - 3}
          </div>
        )}
      </div>
    </td>
    <td className="py-4 px-4">
      <ProgressBar progress={project.progress} />
    </td>
    <td className="py-4 px-2">
      <button className="p-1 hover:bg-gray-100 rounded">
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </button>
    </td>
  </tr>
);