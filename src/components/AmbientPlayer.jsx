import { useEffect, useState } from "react";
import { searchSounds } from "../services/freesoundService";

export default function AmbientPlayer() {
  const [phase, setPhase] = useState("inhale");
  const [scale, setScale] = useState(1);
  const [audio, setAudio] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);

  const [sounds, setSounds] = useState([]);

  // Fetch sounds
  useEffect(() => {
    searchSounds("rain").then((res) => {
      console.log("Fetched sounds:", res);
      const validSounds = res?.filter((s) => s.previews?.["preview-hq-mp3"]);
      console.log("Valid sounds:", validSounds);
      setSounds(validSounds);
    });
  }, []);

  // Box breathing animation (4-4-4-4 pattern)
  useEffect(() => {
    const phases = [
      {
        name: "inhale",
        duration: 4000,
        scale: 1.5,
        transition: "transform 4s ease-in-out",
      },
      { name: "hold", duration: 4000, scale: 1.5, transition: "none" },
      {
        name: "exhale",
        duration: 4000,
        scale: 0.7,
        transition: "transform 4s ease-in-out",
      },
      { name: "hold", duration: 4000, scale: 0.7, transition: "none" },
    ];

    let currentIndex = 0;

    // Set initial state
    setPhase("inhale");
    setScale(0.7); // Start small

    const runCycle = () => {
      const currentPhase = phases[currentIndex];

      // Set phase first
      setPhase(currentPhase.name);

      // For inhale and exhale, we want smooth scaling
      // For hold, we just maintain the current scale
      if (currentPhase.name === "inhale" || currentPhase.name === "exhale") {
        // Small delay to ensure phase is set before scale change
        setTimeout(() => {
          setScale(currentPhase.scale);
        }, 50);
      }

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        if (currentIndex === 0) {
          setCycleCount((prev) => prev + 1);
        }
        runCycle();
      }, currentPhase.duration);
    };

    // Start the cycle immediately
    runCycle();

    return () => {};
  }, []);

  const playSound = (url) => {
    if (audio) audio.pause();
    const newAudio = new Audio(url);
    newAudio.loop = true;
    newAudio.play().catch(() => {});
    setAudio(newAudio);
  };

  const stopSound = () => {
    if (audio) audio.pause();
    setAudio(null);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "exhale":
        return "Breathe Out";
      case "hold":
        return scale > 1 ? "Hold (Full)" : "Hold (Empty)";
      default:
        return "Breathe";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "bg-blue-400";
      case "exhale":
        return "bg-purple-400";
      case "hold":
        return scale > 1 ? "bg-green-400" : "bg-orange-400";
      default:
        return "bg-blue-400";
    }
  };

  const getShadowColor = () => {
    switch (phase) {
      case "inhale":
        return "shadow-[0_0_60px_rgba(96,165,250,0.6)]";
      case "exhale":
        return "shadow-[0_0_40px_rgba(168,85,247,0.6)]";
      case "hold":
        return scale > 1
          ? "shadow-[0_0_50px_rgba(34,197,94,0.6)]"
          : "shadow-[0_0_30px_rgba(251,146,60,0.6)]";
      default:
        return "shadow-[0_0_40px_rgba(96,165,250,0.4)]";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 space-y-8">
      {/* Breathing Circle */}
      <div className="flex flex-col items-center p-6">
        <div className="relative">
          <div
            className={`rounded-full ${getPhaseColor()} ${getShadowColor()}`}
            style={{
              width: "8rem",
              height: "8rem",
              transform: `scale(${scale})`,
              transition:
                phase === "hold" ? "none" : "transform 4s ease-in-out",
            }}
          />

          {/* Inner circle for visual depth */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-20"
            style={{
              width: "4rem",
              height: "4rem",
              transform: `scale(${scale * 0.6})`,
              transition:
                phase === "hold" ? "none" : "transform 4s ease-in-out",
            }}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-3xl text-white font-light mb-2">
            {getPhaseInstruction()}
          </p>
          <p className="text-lg text-gray-300">
            {phase === "hold" ? "4 seconds" : "4 seconds"}
          </p>
          <p className="text-sm text-gray-400 mt-2">Cycle: {cycleCount}</p>
        </div>
      </div>

      {/* Box Breathing Guide */}
      <div className="text-center text-gray-300 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Box Breathing Pattern</h3>
        <p className="text-sm">
          Inhale for 4 seconds → Hold for 4 seconds → Exhale for 4 seconds →
          Hold for 4 seconds
        </p>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-white text-xl font-semibold mb-4">
          Ambient Sounds
        </h2>
        {sounds.length === 0 && (
          <p className="text-gray-300">Loading sounds...</p>
        )}
        <div className="flex flex-col gap-2">
          {sounds.map((sound) => (
            <div key={sound.id} className="flex gap-2">
              <button
                onClick={() => playSound(sound.previews["preview-hq-mp3"])}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
              >
                Play {sound.name}
              </button>
              <button
                onClick={stopSound}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                Stop
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
