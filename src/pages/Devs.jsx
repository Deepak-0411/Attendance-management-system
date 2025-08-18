import { DevCard } from "../components/DevCard/DevCard";
import { Particles } from "../components/DevCard/particals";

function Devs() {
  const developers = [
    {
      image:
        "https://images.pexels.com/photos/33209129/pexels-photo-33209129.jpeg",
      name: "Nikku Ansh",
      role: "Ui Designer",
      description: "B.Tech CSE\n235/UCS/026",
    },
    {
      image: "https://images.pexels.com/photos/262391/pexels-photo-262391.jpeg",
      name: "Deepak Kumar",
      role: "Frontent Developer",
      description: "B.Tech CSE\n235/UCS/050",
    },
    {
      image: "https://images.pexels.com/photos/904332/pexels-photo-904332.jpeg",
      name: "Harsh Singh",
      role: "Backend Developer",
      description: "B.Tech CSE\n235/UCS/058",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black/90 px-4 py-10 overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0">
        <Particles />
      </div>

      {/* Section Heading */}
      <h2 className="relative z-10 mb-12 lg:mb-20 text-3xl sm:text-4xl font-bold text-white tracking-wide text-center">
        Meet Our Developers
      </h2>

      {/* Developer Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
        {developers.map((dev, idx) => (
          <DevCard key={idx} {...dev} />
        ))}
      </div>
    </div>
  );
}

export default Devs;
