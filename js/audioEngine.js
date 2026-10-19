class AudioEngine {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.stream = null;
    this.recognition = null;
    this.isRecording = false;
    this.liveTranscript = "";
    this.onTranscriptUpdate = null;
    this.visualizerAnimationId = null;

    this.initSpeechRecognition();
  }

  // Ensure AudioContext is initialized on user interaction
  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  // Play standard ETS Exam Beep chime
  playBeep(frequency = 880, duration = 0.4, type = "sine") {
    try {
      this.ensureAudioContext();
      if (!this.audioContext) return;

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext beep failed:", e);
    }
  }

  // Double beep for end of response time
  playEndBeep() {
    this.playBeep(660, 0.2);
    setTimeout(() => {
      this.playBeep(440, 0.35);
    }, 220);
  }

  // Web Speech API: Real-time Speech-to-Text Recognition
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.liveTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(this.liveTranscript.trim() + (interimTranscript ? " " + interimTranscript : ""));
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
      };
    }
  }

  // Start recording from microphone with visualizer
  async startRecording(canvasElement = null) {
    this.audioChunks = [];
    this.liveTranscript = "";
    this.ensureAudioContext();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;

      // Start Speech Recognition
      if (this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          console.warn("Recognition already active or failed:", e);
        }
      }

      // Hook up Audio Visualizer
      if (canvasElement && this.audioContext) {
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);
        this.drawVisualizer(canvasElement);
      }

      return true;
    } catch (err) {
      console.error("Microphone access denied or unavailable:", err);
      return false;
    }
  }

  // Stop recording and return Audio Blob & URL
  stopRecording() {
    return new Promise((resolve) => {
      if (this.visualizerAnimationId) {
        cancelAnimationFrame(this.visualizerAnimationId);
        this.visualizerAnimationId = null;
      }

      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }

      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        this.isRecording = false;
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.isRecording = false;

        // Clean up stream tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve({
          blob: audioBlob,
          url: audioUrl,
          transcript: this.liveTranscript.trim()
        });
      };

      this.mediaRecorder.stop();
    });
  }

  // Draw animated audio visualizer waves
  drawVisualizer(canvas) {
    if (!canvas || !this.analyser) return;
    const ctx = canvas.getContext("2d");
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      this.visualizerAnimationId = requestAnimationFrame(render);
      this.analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        
        // Gradient color: Cyan to Purple
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "#00d2ff");
        grad.addColorStop(1, "#8b5cf6");

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    render();
  }

  // Text-to-Speech prompt reading (native English accent)
  speakText(text, rate = 0.95) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = "en-US";

    // Try finding natural US English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("US"))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
