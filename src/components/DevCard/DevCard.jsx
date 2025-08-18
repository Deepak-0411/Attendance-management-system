import React from "react";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const SOCIAL_ICONS = {
  github: { icon: <FaGithub />, label: "GitHub" },
  x: { icon: <FaTwitter />, label: "X" },
  instagram: { icon: <FaInstagram />, label: "Instagram" },
  linkedin: { icon: <FaLinkedin />, label: "LinkedIn" },
};

export const DevCard = ({
  image,
  name,
  role,
  description,
  github,
  x,
  instagram,
  linkedin,
}) => {
  const socials = [
    { url: github, ...SOCIAL_ICONS.github },
    { url: x, ...SOCIAL_ICONS.x },
    { url: instagram, ...SOCIAL_ICONS.instagram },
    { url: linkedin, ...SOCIAL_ICONS.linkedin },
  ].filter((s) => s.url);

  return (
    <div className="relative w-full h-[24rem] max-w-[18rem] rounded-2xl overflow-hidden shadow-xl bg-white text-white mx-auto">
      {/* Image */}
      <img
        src={image}
        alt={`${name} - ${role || "Developer"}`}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div
        className="absolute bottom-0 w-full px-4 pt-8 pb-4 backdrop-blur-sm bg-black/20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, black 80%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 80%, transparent 100%)",
        }}
      >
        <h2 className="text-lg font-semibold">{name}</h2>
        {role && <p className="text-sm text-gray-300">{role}</p>}
        <p className="text-sm text-gray-200 mt-2 mb-4 whitespace-pre-line">
          {description}
        </p>

        {/* Social Links */}
        <div className="flex gap-3 flex-wrap">
          {socials.map(({ url, icon, label }, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full text-lg transition"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
