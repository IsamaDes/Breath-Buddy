// // src/components/AmbientPlayer.jsx
// import { useEffect, useState } from "react";
// import { searchSounds } from "../services/freesoundService";
// import "./index.css";

// export default function AmbientPlayer() {
//   const [sounds, setSounds] = useState([]);
//   const [phase, setPhase] = useState("inhale");
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (phase === "inhale") {
//         setPhase("exhale");
//         setScale(0.4);
//       } else {
//         setPhase("inhale");
//         setScale(1.5);
//       }
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [phase]);

//   //   useEffect(() => {
//   //     searchSounds("rain").then(setSounds);
//   //   }, []);

//   useEffect(() => {
//     searchSounds("rain").then((result) => {
//       console.log("Fetched sounds:", results);
//       setSounds(res);
//     });
//   }, []);

//   const playSound = (url) => {
//     const audio = new Audio(url);
//     audio.loop = true; // keep playing
//     audio.play();
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-center">
//         <div
//           className={`breath-circle ${phase}`}
//           style={{ transform: `scale(${scale})` }}
//         />
//         <p className="breath-text">
//           {phase === "inhale" ? "Breathe In" : "Breathe Out"}
//         </p>
//       </div>
//       <h2>Ambient Sounds</h2>
//       {sounds.map((sound) => (
//         <button
//           key={sound.id}
//           onClick={() => playSound(sound.previews["preview-hq-mp3"])}
//         >
//           Play {sound.name}
//         </button>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { searchSounds } from "../services/freesoundService";

export default function AmbientPlayer() {
  const [sounds, setSounds] = useState([]);
  const [phase, setPhase] = useState("inhale");
  const [scale, setScale] = useState(1);
  const [audio, setAudio] = useState(null);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === "inhale") {
        setPhase("exhale");
        setScale(0.4);
      } else {
        setPhase("inhale");
        setScale(1.5);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [phase]);

  // Fetch sounds
  useEffect(() => {
    searchSounds("rain").then((res) => {
      console.log("Fetched sounds:", res);
      const validSounds = res?.filter((s) => s.previews?.["preview-hq-mp3"]);
      console.log("Valid sounds:", validSounds);
      setSounds(validSounds);
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 space-y-8">
      {/* Breathing Circle */}
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full transition-all ${
            phase === "inhale"
              ? "shadow-[0_0_60px_rgba(96,165,250,0.5)]"
              : "shadow-[0_0_40px_rgba(96,165,250,0.2)]"
          } bg-blue-400`}
          style={{
            width: "8rem",
            height: "8rem",
            transform: `scale(${scale})`,
            transition: "transform 4s ease-in-out",
          }}
        />
        <p className="mt-12 text-2xl text-white font-light">
          {phase === "inhale" ? "Breathe In" : "Breathe Out"}
        </p>
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
}

// src/components/AmbientPlayer.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AmbientPlayer() {
//   const [sounds, setSounds] = useState([]);
//   const [audio, setAudio] = useState(null);

//   // Replace 'rain' with any ambient type you want
//   const searchQuery = "rain";

//   useEffect(() => {
//     const fetchSounds = async () => {
//       try {
//         const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
//         const response = await axios.get(
//           `https://freesound.org/apiv2/search/text/?query=${searchQuery}&token=${API_KEY}`
//         );
//         console.log("Fetched sounds:", response.data.results);
//         setSounds(response.data.results);
//       } catch (err) {
//         console.error("Error fetching sounds:", err);
//       }
//     };

//     fetchSounds();
//   }, [searchQuery]);

//   const playSound = (url) => {
//     if (audio) {
//       audio.pause();
//     }
//     const newAudio = new Audio(url);
//     newAudio.loop = true; // keep sound looping
//     newAudio.play().catch((err) => console.error("Playback failed:", err));
//     setAudio(newAudio);
//   };

//   const stopSound = () => {
//     if (audio) {
//       audio.pause();
//       setAudio(null);
//     }
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h2>Ambient Sounds</h2>
//       {sounds.length === 0 && <p>Loading sounds...</p>}
//       {sounds.map((sound) => (
//         <div key={sound.id} style={{ marginBottom: "0.5rem" }}>
//           <button onClick={() => playSound(sound.previews["preview-hq-mp3"])}>
//             Play {sound.name}
//           </button>
//           <button onClick={stopSound} style={{ marginLeft: "0.5rem" }}>
//             Stop
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
