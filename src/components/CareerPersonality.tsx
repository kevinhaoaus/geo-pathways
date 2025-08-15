import { useState, useEffect } from 'react';
import { SparklesIcon, FireIcon, BeakerIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import type { HollandProfile } from '@/types';

interface CareerPersonalityProps {
  hollandProfile: HollandProfile;
  showAnimation?: boolean;
}

const personalityTypes = {
  R: {
    name: "The Explorer",
    emoji: "🏔️",
    icon: GlobeAltIcon,
    color: "from-green-500 to-blue-500",
    description: "You love hands-on work and being outdoors",
    strength: "Great with tools and practical problem-solving",
    careers: ["Field Geologist", "Environmental Technician", "Marine Biologist"]
  },
  I: {
    name: "The Investigator", 
    emoji: "🔬",
    icon: BeakerIcon,
    color: "from-purple-500 to-indigo-500",
    description: "You're curious about how things work",
    strength: "Excellent at research and analysis",
    careers: ["Climate Scientist", "Research Geologist", "Data Analyst"]
  },
  A: {
    name: "The Creator",
    emoji: "🎨", 
    icon: SparklesIcon,
    color: "from-pink-500 to-purple-500",
    description: "You express ideas creatively",
    strength: "Amazing at visual communication and design",
    careers: ["Science Communicator", "GIS Specialist", "Environmental Designer"]
  },
  S: {
    name: "The Helper",
    emoji: "🤝",
    icon: FireIcon,
    color: "from-orange-500 to-red-500", 
    description: "You care about helping people and communities",
    strength: "Fantastic at teaching and community engagement",
    careers: ["Environmental Educator", "Policy Advisor", "Community Scientist"]
  },
  E: {
    name: "The Leader",
    emoji: "⚡",
    icon: FireIcon,
    color: "from-yellow-500 to-orange-500",
    description: "You like taking charge and making decisions", 
    strength: "Natural at organizing projects and leading teams",
    careers: ["Environmental Consultant", "Startup Founder", "Project Manager"]
  },
  C: {
    name: "The Organizer",
    emoji: "📊",
    icon: BeakerIcon,
    color: "from-blue-500 to-purple-500",
    description: "You excel at systematic and detailed work",
    strength: "Incredible attention to detail and data management", 
    careers: ["Environmental Analyst", "Lab Manager", "Quality Controller"]
  }
};

export default function CareerPersonality({ hollandProfile, showAnimation = true }: CareerPersonalityProps) {
  const [revealed, setRevealed] = useState(!showAnimation);
  
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setRevealed(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const primaryType = personalityTypes[hollandProfile.primaryCode];
  const secondaryType = hollandProfile.secondaryCode ? personalityTypes[hollandProfile.secondaryCode] : null;

  if (!revealed) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin w-16 h-16 mx-auto mb-4">
          <SparklesIcon className="w-full h-full text-primary-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing your Earth Science personality...
        </h3>
        <p className="text-gray-600">
          Discovering what makes you unique!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Personality Type */}
      <div className={`
        bg-gradient-to-r ${primaryType.color} 
        rounded-xl shadow-lg p-8 text-white text-center
        animate-scale-in
      `}>
        <div className="text-6xl mb-4">{primaryType.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">
          You're {primaryType.name}!
        </h2>
        <p className="text-xl mb-4 text-white/90">
          {primaryType.description}
        </p>
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="font-semibold mb-2">Your Superpower:</p>
          <p className="text-white/90">{primaryType.strength}</p>
        </div>
      </div>

      {/* Secondary Type (if exists) */}
      {secondaryType && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl mr-3">{secondaryType.emoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Plus: {secondaryType.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {secondaryType.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Career Matches */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          🎯 Perfect Earth Science careers for you:
        </h3>
        <div className="grid gap-3">
          {primaryType.careers.map((career, index) => (
            <div 
              key={career}
              className="flex items-center p-3 bg-primary-50 rounded-lg animate-slide-in-right"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                {index + 1}
              </div>
              <span className="font-medium text-primary-900">{career}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🌟 You have amazing potential!
          </h3>
          <p className="text-green-800">
            Your unique combination of interests and strengths makes you perfect for solving 
            some of the world's biggest environmental challenges. Australia needs more people like you 
            in Earth Sciences!
          </p>
        </div>
      </div>

      {/* Share encouragement */}
      <div className="text-center">
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors">
          🚀 See My Full Career Plan
        </button>
      </div>
    </div>
  );
}