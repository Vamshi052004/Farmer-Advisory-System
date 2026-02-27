function VoiceInput({ onResult }) {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (e) =>
      onResult(e.results[0][0].transcript);

    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      🎤 Speak
    </button>
  );
}

export default VoiceInput;