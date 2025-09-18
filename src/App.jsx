import { useEffect, useState } from "react";

export default function App() {
  const [phase, setPhase] = useState("inhale");
  const [scale, setScale] = useState(1);

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

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(to bottom right, #0f172a, #4c1d95, #0f172a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "8rem",
          height: "8rem",
          borderRadius: "50%",
          backgroundColor: "#60a5fa",
          boxShadow:
            phase === "inhale"
              ? "0 0 60px rgba(96, 165, 250, 0.5)"
              : "0 0 40px rgba(96, 165, 250, 0.2)",
          transform: `scale(${scale})`,
          transition: "transform 4s ease-in-out",
        }}
      />

      <p
        style={{
          marginTop: "3rem",
          fontSize: "2rem",
          color: "#fff",
          transition: "opacity 1s",
        }}
      >
        {phase === "inhale" ? "Breathe In" : "Breathe Out"}
      </p>
    </div>
  );
}
