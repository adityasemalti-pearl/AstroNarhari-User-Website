import { IoArrowForward, IoBriefcaseOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5";

export default function Careers() {
  const jobs = [
    {
      title: "Senior Astrologer",
      department: "Consultation",
      type: "Full-Time / Part-Time",
      location: "Remote",
      experience: "3+ Years",
    },
    {
      title: "React.js Frontend Developer",
      department: "Engineering",
      type: "Full-Time",
      location: "Dehradun / Remote",
      experience: "2+ Years",
    },
    {
      title: "Tarot Card Reader",
      department: "Consultation",
      type: "Freelance",
      location: "Remote",
      experience: "2+ Years",
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      type: "Full-Time",
      location: "Dehradun, India",
      experience: "1-3 Years",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0616] text-white">
      <div className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute left-1/2 -top-20 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-700/20 blur-[140px]" />
        
        <div className="relative mx-auto max-w-4xl">
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
            We Are Hiring ✨
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Shape The Future Of <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Astrology</span> With Us
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Join our passionate team of developers, creators, and cosmic experts. Help us bring ancient wisdom to the modern digital world.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12">
          <h2 className="text-2xl font-bold">Open Positions</h2>
          <p className="text-gray-400 mt-1">Find your next role at Namah-Astro</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:border-purple-500/50 hover:bg-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    {job.department}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold group-hover:text-purple-300 transition">
                    {job.title}
                  </h3>
                </div>
                <span className="rounded-full bg-purple-600/20 p-3 text-purple-400">
                  <IoBriefcaseOutline size={20} />
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                  <IoTimeOutline className="text-purple-400" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IoLocationOutline className="text-purple-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-purple-400">Exp:</span>
                  <span>{job.experience}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-sm text-gray-400">Remote / On-site</span>
                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105">
                  Apply Now
                  <IoArrowForward size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}