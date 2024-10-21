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
    description: "Collaborate with team members seamlessly, communicate in real-time, and keep track of your team's progress through integrated tools.",
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
      className="min-h-screen flex flex-col items-center bg-[#13111C] pt-16 pb-40 bg-gradient-to-t from-transparent via-[rgba(23,92,230,0.02)] to-[rgba(23,92,230,0)] clip-path-polygon-custom"
    >
      <div className="relative w-full max-w-[800px] mx-auto px-4">
        <div className="w-[60px] h-[60px] text-[32px] font-extrabold text-[#306EE8] flex justify-center items-center rounded-full border-4 border-[#306EE8] bg-opacity-10 bg-[#306EE8] mb-4 mx-auto">
          1
        </div>

        <h2 className="text-[#306EE8] text-center text-4xl lg:text-5xl font-extrabold mt-4 mb-2" id="features">
          Key Features
        </h2>

        <p className="text-center text-lg text-gray-400 max-w-[700px] mx-auto mb-8">
          Discover how our app simplifies project management and makes collaboration effortless.
        </p>

        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="w-full max-w-[350px] h-[220px] bg-[#1E2131] border border-[#306EE8] rounded-lg p-6 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-10px] relative"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[#65a4f8] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-2 right-2 w-[45px] h-[45px] flex justify-center items-center border-2 border-[#65a4f8] rounded-[40%_60%_40%_16px] text-[#306EE8] p-2">
                  {feature.icon}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block absolute inset-0 z-0">
            <div className="flex justify-center">
              <HeroBgAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;