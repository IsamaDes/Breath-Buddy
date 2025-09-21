import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VoiceSelection = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);
            console.log("Available voices:", availableVoices.map(v => v.name));
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const maleVoiceNames = ["Alex", "Daniel", "Fred", "Thomas", "Google UK English Male"];
    const femaleVoiceNames = ["Alice", "Amelie", "Anna", "Fiona", "Karen", "Samantha", "Victoria", "Google UK English Female"];

    const maleVoices = voices.filter(v => maleVoiceNames.some(name => v.name.includes(name)));
    const femaleVoices = voices.filter(v => femaleVoiceNames.some(name => v.name.includes(name)));

    const handleVoiceClick = (voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);

        // Test speech
        const utterance = new SpeechSynthesisUtterance(`Hello, my name is ${voice.name}`);
        utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    };

    const handleGoToMeditationPage = () => {
        if (selectedVoice) {
            navigate("/ambient", { state: { voice: selectedVoice.name } });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-lg text-center space-y-6">
                <h2 className="text-2xl font-semibold text-white">Select Your Voice</h2>

                {/* Male Voices */}
                <div>
                    <h3 className="text-lg text-blue-300 mb-2">Male Voices</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {maleVoices.map((voice, i) => (
                            <button
                                key={i}
                                onClick={() => handleVoiceClick(voice)}
                                className={`px-4 py-2 rounded-lg text-white transition ${selectedVoice?.name === voice.name
                                    ? "bg-blue-600 shadow-lg scale-105"
                                    : "bg-blue-500/70 hover:bg-blue-600"
                                    }`}
                            >
                                {voice.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Female Voices */}
                <div>
                    <h3 className="text-lg text-pink-300 mt-4 mb-2">Female Voices</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {femaleVoices.map((voice, i) => (
                            <button
                                key={i}
                                onClick={() => handleVoiceClick(voice)}
                                className={`px-4 py-2 rounded-lg text-white transition ${selectedVoice?.name === voice.name
                                    ? "bg-pink-600 shadow-lg scale-105"
                                    : "bg-pink-500/70 hover:bg-pink-600"
                                    }`}
                            >
                                {voice.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleGoToMeditationPage}
                    disabled={!selectedVoice}
                    className={`w-full px-6 py-3 rounded-xl text-lg font-semibold transition mt-6 ${selectedVoice
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                        : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                        }`}
                >
                    Start Meditation
                </button>
            </div>
        </div>
    );
};

export default VoiceSelection;
