import React, { useEffect, useState } from "react";
import { searchSounds } from "../services/freesoundService";
import { useLocation } from "react-router-dom";

const AmbientPlayer = () => {
  const location = useLocation();
  const selectedVoice = location.state?.voice || "";
  const [voices, setVoices] = useState([]);
  const [phase, setPhase] = useState("inhale");
  const [scale, setScale] = useState(1);
  const [audio, setAudio] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [sounds, setSounds] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timers, setTimers] = useState([]);



  // Load available voices
  useEffect(() => {
    const loadVoices = () => setVoices(speechSynthesis.getVoices());
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Function to speak text
  const speak = (text) => {
    if (!selectedVoice || !text) return;
    speechSynthesis.cancel(); // cancel ongoing utterances

    const utterance = new SpeechSynthesisUtterance(text);

    //use the voice selected selected from the voiceSelectionPage
    const voice = voices.find((v) => v.name === selectedVoice);

    if (voice) utterance.voice = voice;
    utterance.rate = 0.9; // slower pace for meditation
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // Fetch ambient sounds
  useEffect(() => {
    searchSounds("rain").then((res) => {
      if (!res) return;
      const validSounds = res.filter((s) => s.previews?.["preview-hq-mp3"]);
      setSounds(validSounds);
    });
  }, []);

  // Breathing cycle (4-4-4-4)
  useEffect(() => {
    if (!selectedVoice || voices.length === 0) return;

    const phases = [
      { name: "inhale", duration: 4000, scale: 1.5, text: "Breathe in" },
      { name: "hold", duration: 4000, scale: 1.5, text: "Hold" },
      { name: "exhale", duration: 4000, scale: 0.7, text: "Breathe out" },
      { name: "hold", duration: 4000, scale: 0.7, text: "Hold" },
    ];

    let currentIndex = 0;
    let timers = [];

    const runCycle = () => {
      const currentPhase = phases[currentIndex];
      setPhase(currentPhase.name);
      speak(currentPhase.text);

      if (currentPhase.name === "inhale" || currentPhase.name === "exhale") {
        const t1 = setTimeout(() => setScale(currentPhase.scale), 50);
        timers.push(t1);
      }

      const t2 = setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        if (currentIndex === 0) setCycleCount((prev) => prev + 1);
        runCycle();
      }, currentPhase.duration);
      timers.push(t2);
    };

    runCycle();

    return () => {
      timers.forEach(clearTimeout);
      speechSynthesis.cancel();
    };
  }, [voices, selectedVoice]);

  //Start meditation
  const startMeditation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCycleCount(0);
    runCycle();
  };

  // Stop meditation
  const stopMeditation = () => {
    setIsPlaying(false);
    timers.forEach(clearTimeout);
    setTimers([]);
    speechSynthesis.cancel();
  };

  // Ambient sound controls
  const playSound = (url) => {
    if (audio) audio.pause();
    const newAudio = new Audio(url);
    newAudio.loop = true;
    newAudio.play().catch(() => { });
    setAudio(newAudio);
  };

  const stopSound = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // reset so next play starts fresh
    }
    setAudio(null);
  };

  // UI helpers
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
          <p className="text-lg text-gray-300">4 seconds</p>
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


      <div className="flex gap-4">
        <button
          onClick={startMeditation}
          disabled={isPlaying}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={stopMeditation}
          disabled={!isPlaying}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg disabled:opacity-50"
        >
          Stop
        </button>
      </div>


      {/* Ambient Sounds */}
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
};

export default AmbientPlayer;














