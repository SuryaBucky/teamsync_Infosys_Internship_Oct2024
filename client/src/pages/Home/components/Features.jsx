import HeroBgAnimation from './HeroBgAnimation';
import Groups3Icon from '@mui/icons-material/Groups3';
import TimelineIcon from '@mui/icons-material/Timeline';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PublicIcon from '@mui/icons-material/Public';

const featuresData = [
  {
    icon: <ElectricBoltIcon fontSize="inherit" />,
    title: 'Project Management',
    description: 'Effortlessly manage your personal projects, assign tasks to team members, and keep track of progress in real-time, enhancing productivity.',
  },
  {
    icon: <Groups3Icon fontSize="inherit" />,
    title: 'Team Collaboration',
    description: 'Collaborate with team members seamlessly, communicate in real-time, and keep track of your team’s progress through integrated tools.',
  },
  {
    icon: <PublicIcon fontSize="inherit" />,
    title: 'Community Building',
    description: 'Connect with like-minded individuals, build communities, share ideas, and expand your network for greater opportunities.',
  },
  {
    icon: <TimelineIcon fontSize="inherit" />,
    title: 'Time Tracking',
    description: 'Monitor your time efficiently, set productivity goals, and analyze your progress to improve overall efficiency and performance.',
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="flex flex-col items-center bg-[#13111C] pb-[200px] -mt-20 bg-gradient-to-t from-transparent via-[rgba(23,92,230,0.02)] to-[rgba(23,92,230,0)] clip-path-polygon-custom lg:pb-[200px] md:pb-[100px]"
    >
      <div className="w-[70px] h-[70px] text-[36px] font-extrabold text-[#306EE8] flex justify-center items-center rounded-full border-4 border-[#306EE8] bg-opacity-10 bg-[#306EE8] mb-5 md:w-[50px] md:h-[50px] md:text-[32px]">
        1
      </div>

      <h2 className="text-[#306EE8] text-center text-[52px] font-extrabold mt-5 md:text-[36px] md:mt-3">
        Key Features
      </h2>

      <p className="text-center text-[20px] leading-relaxed font-semibold text-gray-400 max-w-[700px] mb-20 md:text-[16px] md:mb-12">
        Discover how our app simplifies project management and makes collaboration effortless.
      </p>

      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative w-[380px] h-[260px] bg-[#1E2131] border border-[#306EE8] rounded-lg p-8 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-10px] md:w-[320px] md:h-[240px] md:p-6"
            >
              <div>
                <h3 className="text-[22px] font-semibold text-[#65a4f8] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[16px] text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="absolute bottom-2 right-2 w-[50px] h-[50px] flex justify-center items-center border-2 border-[#65a4f8] rounded-[40%_60%_40%_16px] text-[#306EE8] p-3 md:w-[60px] md:h-[60px]">
                {feature.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block absolute inset-0 z-0">
          <HeroBgAnimation />
        </div>
      </div>
    </section>
  );
};

export default Features;
