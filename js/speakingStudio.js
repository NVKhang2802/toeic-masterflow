import { speakingQuestions } from "./data/speakingData.js";
import { audioEngine } from "./audioEngine.js";
import { TimerEngine } from "./timerEngine.js";
import { storageEngine } from "./storageEngine.js";

export class SpeakingStudio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentQuestionIndex = 0;
    this.currentMode = "ready"; // 'ready' | 'set' | 'test'
    this.timer = null;
    this.lastRecording = null;
    this.isRecording = false;

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.loadSavedRecording();
  }

  get currentQuestion() {
    return speakingQuestions[this.currentQuestionIndex];
  }

  render() {
    if (!this.container) return;
    const q = this.currentQuestion;

    this.container.innerHTML = `
      <div class="section-title-wrap">
        <div class="section-subtitle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          Phòng Luyện Nói Tương Tác • Speaking Studio
        </div>
        <h2 class="section-title">${q.title}</h2>
        <p class="section-desc">Chuẩn ETS: Chuẩn bị <strong>${q.prepTime}s</strong> | Trả lời <strong>${q.speakTime}s</strong> | Thang điểm: <strong>0 - ${q.scoreMax}</strong></p>
      </div>

      <!-- Mode & Question Switcher Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div class="mode-switch">
          <button class="mode-btn ${this.currentMode === 'ready' ? 'active' : ''}" data-mode="ready">
            🌱 Get Ready (Có hướng dẫn)
          </button>
          <button class="mode-btn ${this.currentMode === 'set' ? 'active' : ''}" data-mode="set">
            🌿 Get Set (Bán độc lập)
          </button>
          <button class="mode-btn ${this.currentMode === 'test' ? 'active' : ''}" data-mode="test">
            🎯 Go for TOEIC (Mô phỏng thi)
          </button>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" id="btn-listen-prompt" title="Nghe câu hỏi / đề bài">
            🔊 Nghe Đọc Đề Bài
          </button>
        </div>
      </div>

      <!-- Question Pills Navigator -->
      <div class="q-navigator">
        ${speakingQuestions.map((item, idx) => `
          <button class="q-nav-pill ${idx === this.currentQuestionIndex ? 'active' : ''}" data-idx="${idx}">
            <span>Q${idx + 1}</span>
            <small>${item.type.split('_')[0].toUpperCase()}</small>
          </button>
        `).join('')}
      </div>

      <!-- ETS High Precision Countdown Timer -->
      <div class="ets-timer-panel">
        <div class="timer-phase-wrap">
          <div class="phase-indicator prep" id="spk-phase-indicator"></div>
          <div>
            <div class="timer-phase-title" id="spk-phase-title">Giai Đoạn Chuẩn Bị (Preparation)</div>
            <div class="timer-phase-status" id="spk-phase-status">Sẵn sàng bắt đầu</div>
          </div>
        </div>
        <div class="timer-digits" id="spk-timer-digits">${this.formatSeconds(q.prepTime > 0 ? q.prepTime : q.speakTime)}</div>
      </div>

      <!-- Main Practice Area Grid -->
      <div class="grid-split-7-5">
        <!-- Left: Prompt Display -->
        <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="glass-card-header">
              <span class="badge badge-cyan">${q.category || q.title}</span>
              <span class="badge badge-purple">Max: ${q.scoreMax} Điểm</span>
            </div>

            <!-- Dynamic Question Content -->
            <div id="spk-prompt-content" style="min-height: 220px;">
              ${this.renderPromptContent(q)}
            </div>
          </div>

          <!-- Audio Wave Visualizer & Live Transcript -->
          <div>
            <div class="visualizer-container">
              <canvas id="spk-visualizer-canvas" width="600" height="50"></canvas>
            </div>

            <div style="margin-bottom: 12px;">
              <small style="color:var(--text-muted); display:flex; justify-content:space-between;">
                <span>Văn bản nhận diện giọng nói trực tiếp (Speech-to-Text):</span>
                <span id="stt-status" style="color:var(--accent-cyan);">Sẵn sàng</span>
              </small>
              <div class="live-transcript-box" id="spk-live-transcript">
                (Bấm nút 'Bắt Đầu Làm Bài' hoặc 'Nói & Ghi Âm' để hệ thống tự động ghi nhận câu trả lời...)
              </div>
            </div>

            <!-- Action Controls -->
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btn-speaking" id="btn-start-flow">
                ▶ Bắt Đầu Làm Bài (Chuẩn ETS)
              </button>
              <button class="btn btn-secondary" id="btn-manual-record">
                🎙 Thu Âm Ngay
              </button>
              <button class="btn btn-secondary" id="btn-stop-record" disabled>
                ⏹ Dừng Lại
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Coaching & Model Answer Panel -->
        <div class="glass-card">
          <div class="glass-card-header">
            <h4 style="display:flex; align-items:center; gap:8px;">
              <span>🏆 Phân Tích & Đáp Án Mẫu Band 8</span>
            </h4>
            <span class="badge badge-emerald">ETS Level 8 (190-200)</span>
          </div>

          <!-- User Recording Player -->
          <div id="spk-user-audio-box" style="margin-bottom:16px; padding:12px; background:rgba(0,0,0,0.3); border-radius:8px; display:none;">
            <div style="font-size:0.85rem; font-weight:600; margin-bottom:6px; color:#38bdf8;">
              🎧 Bản ghi âm của bạn:
            </div>
            <audio id="spk-user-audio" controls style="width:100%; height:36px;"></audio>
          </div>

          <!-- Model Answer & Explanations (Controlled by Mode) -->
          <div id="spk-model-box">
            ${this.renderModelBox(q)}
          </div>

          <!-- Self Assessment Rubric Checklist -->
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <div style="font-size:0.85rem; font-weight:700; color:#fff; margin-bottom:10px;">
              Bảng Tự Đánh Giá (ETS Speaking Rubric):
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem; color:#cbd5e1;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="chk-rubric-pronunciation">
                <span>Phát âm rõ ràng, chuẩn các âm cuối (/s/, /t/, /d/)</span>
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="chk-rubric-stress">
                <span>Nhấn đúng trọng âm từ nội dung và ngữ điệu tự nhiên</span>
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="chk-rubric-grammar">
                <span>Cấu trúc câu hoàn chỉnh, đúng thì và từ vựng phong phú</span>
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="chk-rubric-timing">
                <span>Thời lượng nói vừa vặn, không ngắt quãng quá 3 giây</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderPromptContent(q) {
    if (q.type === "read_aloud") {
      return `
        <div style="margin-bottom:12px; color:var(--text-secondary); font-size:0.9rem;">
          Đọc to đoạn văn bản sau một cách rõ ràng, trôi chảy và tự nhiên:
        </div>
        <div style="background:#0f172a; padding:18px; border-radius:10px; border-left:4px solid var(--accent-cyan); line-height:1.9; font-size:1.1rem; color:#f8fafc; font-weight:500;">
          ${this.currentMode === 'ready' 
            ? q.promptText.replace(/\//g, '<span style="color:#00d2ff; font-weight:bold; margin:0 4px;">/</span>')
            : q.promptText.replace(/\//g, '')}
        </div>
      `;
    }

    if (q.type === "describe_picture") {
      return `
        <div style="margin-bottom:10px; color:var(--text-secondary); font-size:0.9rem;">
          Quan sát bức ảnh và miêu tả chi tiết người, vật và hoạt động:
        </div>
        <div style="border-radius:10px; overflow:hidden; border:1px solid #334155; margin-bottom:10px; max-height:260px; display:flex; align-items:center; justify-content:center; background:#000;">
          <img src="${q.image}" alt="TOEIC Picture" style="width:100%; height:auto; max-height:260px; object-fit:contain;">
        </div>
      `;
    }

    if (q.type === "respond_questions") {
      return `
        <div style="background:rgba(99, 102, 241, 0.1); border-left:4px solid var(--accent-indigo); padding:12px; border-radius:6px; margin-bottom:14px; font-size:0.88rem; color:#c7d2fe;">
          <strong>Tình huống khảo sát:</strong> ${q.scenario}
        </div>
        <div style="background:#0f172a; padding:18px; border-radius:10px; border:1px solid #334155; font-size:1.15rem; color:#f8fafc; font-weight:600;">
          "${q.promptText}"
        </div>
      `;
    }

    if (q.type === "respond_with_info") {
      return `
        <div style="font-weight:700; color:#38bdf8; margin-bottom:8px; font-size:0.95rem;">
          📅 ${q.scheduleTitle}
        </div>
        ${q.scheduleData ? `
          <div style="background:#0f172a; border:1px solid #334155; border-radius:8px; overflow:hidden; margin-bottom:12px;">
            <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
              <thead style="background:#1e293b; color:#94a3b8;">
                <tr>
                  <th style="padding:8px 12px;">Thời gian</th>
                  <th style="padding:8px 12px;">Nội dung sự kiện</th>
                  <th style="padding:8px 12px;">Diễn giả</th>
                  <th style="padding:8px 12px;">Phòng</th>
                </tr>
              </thead>
              <tbody>
                ${q.scheduleData.map(row => `
                  <tr style="border-top:1px solid #1e293b;">
                    <td style="padding:8px 12px; color:#38bdf8; font-weight:600;">${row.time}</td>
                    <td style="padding:8px 12px; color:#fff;">${row.event}</td>
                    <td style="padding:8px 12px; color:#94a3b8;">${row.speaker}</td>
                    <td style="padding:8px 12px; color:#a78bfa;">${row.room}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
        <div style="background:#1e293b; padding:12px; border-radius:8px; border-left:4px solid var(--accent-cyan); font-weight:600; color:#fff;">
          "${q.promptText}"
        </div>
      `;
    }

    if (q.type === "propose_solution") {
      return `
        <div style="background:rgba(245, 158, 11, 0.1); border-left:4px solid var(--status-amber); padding:12px; border-radius:6px; margin-bottom:12px; font-size:0.88rem; color:#fde68a;">
          <strong>Lời nhắn thoại khẩn cấp:</strong> Nghe nội dung khiếu nại và phản hồi lại bằng giải pháp cụ thể.
        </div>
        <div style="background:#0f172a; padding:14px; border-radius:8px; border:1px solid #334155; font-size:0.95rem; line-height:1.7; color:#e2e8f0; font-style:italic;">
          "${q.audioTranscript}"
        </div>
      `;
    }

    if (q.type === "express_opinion") {
      return `
        <div style="background:#0f172a; padding:18px; border-radius:10px; border-left:4px solid var(--status-rose); font-size:1.1rem; line-height:1.7; color:#f8fafc; font-weight:600;">
          ${q.promptText}
        </div>
      `;
    }

    return `<div>${q.promptText || ''}</div>`;
  }

  renderModelBox(q) {
    if (this.currentMode === "test") {
      return `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:10px;">🔒</div>
          <div style="font-weight:600; color:#e2e8f0;">Chế độ Thi Thử (Go for TOEIC)</div>
          <p style="font-size:0.85rem; margin-top:6px;">Gợi ý và câu trả lời mẫu được ẩn để bạn tập trung phản xạ thi thật. Bạn có thể mở khóa xem mẫu sau khi hoàn thành lượt thu âm.</p>
        </div>
      `;
    }

    return `
      <!-- Outline / Vocabulary for Get Ready & Get Set -->
      ${q.templateOutline ? `
        <div style="margin-bottom:14px; background:rgba(0,0,0,0.25); padding:10px 12px; border-radius:8px;">
          <div style="font-size:0.82rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Dàn ý gợi ý (Framework):</div>
          <ul style="padding-left:18px; font-size:0.82rem; color:#cbd5e1; line-height:1.6;">
            ${q.templateOutline.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${q.phoneticGuide ? `
        <div style="margin-bottom:12px; background:rgba(0, 210, 255, 0.08); border-left:3px solid var(--accent-cyan); padding:8px 12px; border-radius:4px; font-size:0.82rem; color:#bae6fd;">
          <strong>Quy tắc ngữ điệu Collins:</strong> ${q.phoneticGuide}
        </div>
      ` : ''}

      <!-- High Band 8 Sample Script -->
      <div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:0.85rem; font-weight:700; color:#34d399;">Bài Mẫu Band 8 (Level 8):</span>
          <button class="btn btn-secondary btn-sm" id="btn-play-model-audio" style="font-size:0.75rem; padding:3px 8px;">
            🔊 Nghe Mẫu
          </button>
        </div>
        <div style="background:#0b1120; border:1px solid #334155; border-radius:8px; padding:12px; font-size:0.9rem; line-height:1.7; color:#e2e8f0;">
          "${q.sampleBand8}"
        </div>
      </div>

      <div style="background:rgba(16, 185, 129, 0.08); padding:10px; border-radius:6px; font-size:0.82rem; color:#a7f3d0; border-left:3px solid var(--status-emerald);">
        <strong>Phân tích điểm cao:</strong> ${q.modelAnalysis || 'Đáp ứng toàn diện các tiêu chí phát âm, vốn từ và sự mạch lạc của ETS.'}
      </div>
    `;
  }

  setupEventListeners() {
    // Mode switcher buttons
    this.container.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.currentMode = e.target.dataset.mode;
        this.render();
      });
    });

    // Question Navigator
    this.container.querySelectorAll(".q-nav-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        this.currentQuestionIndex = idx;
        this.render();
        this.loadSavedRecording();
      });
    });

    // Listen to prompt
    const btnListenPrompt = this.container.querySelector("#btn-listen-prompt");
    if (btnListenPrompt) {
      btnListenPrompt.addEventListener("click", () => {
        const q = this.currentQuestion;
        const textToRead = q.promptText || q.audioTranscript || q.scenario || q.title;
        audioEngine.speakText(textToRead);
      });
    }

    // Play model answer audio
    const btnPlayModel = this.container.querySelector("#btn-play-model-audio");
    if (btnPlayModel) {
      btnPlayModel.addEventListener("click", () => {
        audioEngine.speakText(this.currentQuestion.sampleBand8, 0.9);
      });
    }

    // Start Flow button (Full ETS Flow: Prep -> Beep -> Record -> Finish)
    const btnStartFlow = this.container.querySelector("#btn-start-flow");
    if (btnStartFlow) {
      btnStartFlow.addEventListener("click", () => this.startEtsExamFlow());
    }

    // Manual Record & Stop
    const btnManualRecord = this.container.querySelector("#btn-manual-record");
    const btnStopRecord = this.container.querySelector("#btn-stop-record");

    if (btnManualRecord) {
      btnManualRecord.addEventListener("click", () => this.startRecordingOnly());
    }
    if (btnStopRecord) {
      btnStopRecord.addEventListener("click", () => this.stopRecordingSession());
    }
  }

  // ETS Exam Flow: Prep Timer -> Beep -> Speak Timer with Recording -> Finish
  startEtsExamFlow() {
    const q = this.currentQuestion;
    const digits = this.container.querySelector("#spk-timer-digits");
    const phaseTitle = this.container.querySelector("#spk-phase-title");
    const phaseStatus = this.container.querySelector("#spk-phase-status");
    const indicator = this.container.querySelector("#spk-phase-indicator");
    const btnStop = this.container.querySelector("#btn-stop-record");
    const btnStart = this.container.querySelector("#btn-start-flow");

    if (btnStart) btnStart.disabled = true;
    if (btnStop) btnStop.disabled = false;

    this.timer = new TimerEngine({
      prepDuration: q.prepTime,
      actionDuration: q.speakTime,
      onTick: (rem, formatted, phase) => {
        if (digits) {
          digits.textContent = formatted;
          if (rem <= 10) {
            digits.classList.add("warning");
          } else {
            digits.classList.remove("warning");
          }
        }
      },
      onPhaseChange: async (phase) => {
        if (phase === "prep") {
          if (phaseTitle) phaseTitle.textContent = "Giai Đoạn Chuẩn Bị (Preparation)";
          if (phaseStatus) phaseStatus.textContent = "Suy nghĩ và sắp xếp câu trả lời...";
          if (indicator) {
            indicator.className = "phase-indicator prep";
          }
        } else if (phase === "action") {
          // Play ETS Beep
          audioEngine.playBeep(880, 0.5);

          if (phaseTitle) phaseTitle.textContent = "Giai Đoạn Trả Lời (Speaking)";
          if (phaseStatus) phaseStatus.textContent = "Đang ghi âm câu trả lời của bạn...";
          if (indicator) {
            indicator.className = "phase-indicator speak";
          }

          // Start Recording
          const canvas = this.container.querySelector("#spk-visualizer-canvas");
          const transcriptBox = this.container.querySelector("#spk-live-transcript");
          audioEngine.onTranscriptUpdate = (text) => {
            if (transcriptBox) transcriptBox.textContent = text;
          };
          await audioEngine.startRecording(canvas);
          this.isRecording = true;
        }
      },
      onFinish: async () => {
        audioEngine.playEndBeep();
        if (phaseTitle) phaseTitle.textContent = "Hoàn Thành (Completed)";
        if (phaseStatus) phaseStatus.textContent = "Đã hoàn thành lượt nói!";
        if (indicator) indicator.className = "phase-indicator";
        await this.stopRecordingSession();
        if (btnStart) btnStart.disabled = false;
      }
    });

    this.timer.start(q.prepTime, q.speakTime);
  }

  async startRecordingOnly() {
    const canvas = this.container.querySelector("#spk-visualizer-canvas");
    const transcriptBox = this.container.querySelector("#spk-live-transcript");
    const btnStop = this.container.querySelector("#btn-stop-record");
    const btnManual = this.container.querySelector("#btn-manual-record");
    const indicator = this.container.querySelector("#spk-phase-indicator");

    audioEngine.playBeep(880, 0.3);
    if (indicator) indicator.className = "phase-indicator speak";

    audioEngine.onTranscriptUpdate = (text) => {
      if (transcriptBox) transcriptBox.textContent = text;
    };

    await audioEngine.startRecording(canvas);
    this.isRecording = true;
    if (btnStop) btnStop.disabled = false;
    if (btnManual) btnManual.disabled = true;
  }

  async stopRecordingSession() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }

    const btnStop = this.container.querySelector("#btn-stop-record");
    const btnManual = this.container.querySelector("#btn-manual-record");
    const btnStart = this.container.querySelector("#btn-start-flow");

    if (btnStop) btnStop.disabled = true;
    if (btnManual) btnManual.disabled = false;
    if (btnStart) btnStart.disabled = false;

    const result = await audioEngine.stopRecording();
    this.isRecording = false;

    if (result && result.blob) {
      await storageEngine.saveAudioRecording(this.currentQuestion.id, result.blob, result.transcript);
      this.showUserAudio(result.url);
    }
  }

  async loadSavedRecording() {
    const saved = await storageEngine.getAudioRecording(this.currentQuestion.id);
    if (saved && saved.url) {
      this.showUserAudio(saved.url);
      const transcriptBox = this.container.querySelector("#spk-live-transcript");
      if (transcriptBox && saved.transcript) {
        transcriptBox.textContent = saved.transcript;
      }
    }
  }

  showUserAudio(url) {
    const audioBox = this.container.querySelector("#spk-user-audio-box");
    const audioElement = this.container.querySelector("#spk-user-audio");
    if (audioBox && audioElement) {
      audioElement.src = url;
      audioBox.style.display = "block";
    }
  }

  formatSeconds(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
