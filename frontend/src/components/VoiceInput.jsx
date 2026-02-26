function VoiceInput({ onResult }) {
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.onresult = e => onResult(e.results[0][0].transcript)
    recognition.start()
  }

  return <button onClick={startListening}>🎤 Speak</button>
}

export default VoiceInput