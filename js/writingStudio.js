import { writingQuestions } from "./data/writingData.js";
import { TimerEngine } from "./timerEngine.js";
import { storageEngine } from "./storageEngine.js";

export class WritingStudio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentQuestionIndex = 0;
    this.timer = null;

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.loadSavedDraft();
  }

  get currentQuestion() {
    return writingQuestions[this.currentQuestionIndex];
  }

  render() {
    if (!this.container) return;
    const q = this.currentQuestion;

    this.container.innerHTML = `
      <div class="section-title-wrap">
        <div class="section-subtitle" style="color:var(--accent-purple);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Phòng Luyện Viết ETS Chuẩn Bàn Phím QWERTY • Writing Studio
        </div>
        <h2 class="section-title">${q.title}</h2>
        <p class="section-desc">Phần thi Viết TOEIC IBT: Tổng thời gian <strong>60 phút</strong> | 8 câu hỏi | Thang điểm: <strong>0 - 200 (Level 1-9)</strong></p>
      </div>

      <!-- Question Pills Navigator -->
      <div class="q-navigator">
        ${writingQuestions.map((item, idx) => `
          <button class="q-nav-pill ${idx === this.currentQuestionIndex ? 'active' : ''}" data-idx="${idx}" style="${idx === this.currentQuestionIndex ? 'background:var(--grad-writing); border-color:transparent;' : ''}">
            <span>Q${idx + 1}</span>
            <small>${item.part === 1 ? 'SENTENCE' : item.part === 2 ? 'EMAIL' : 'ESSAY'}</small>
          </button>
        `).join('')}
      </div>

      <!-- Section Timer Panel -->
      <div class="ets-timer-panel" style="border-color:var(--accent-purple); box-shadow:0 0 20px rgba(139, 92, 246, 0.2);">
        <div class="timer-phase-wrap">
          <div class="phase-indicator" style="background:var(--accent-purple); box-shadow:0 0 10px var(--accent-purple);"></div>
          <div>
            <div class="timer-phase-title">Thời Gian Làm Bài (Writing Timer)</div>
            <div class="timer-phase-status" id="wrt-timer-status">
              ${q.part === 1 ? 'Gợi ý: 8 phút cho cả 5 câu' : q.part === 2 ? 'Thời gian quy định: 10 phút' : 'Thời gian quy định: 30 phút'}
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <div class="timer-digits" id="wrt-timer-digits" style="color:#c084fc; text-shadow:0 0 15px rgba(192, 132, 252, 0.6);">
            ${q.part === 1 ? '08:00' : q.part === 2 ? '10:00' : '30:00'}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-toggle-timer">▶ Chạy giờ</button>
        </div>
      </div>

      <!-- Main Writing View: Dynamic by Question Type -->
      <div class="grid-split-7-5">
        <!-- Left: Question & Input Work Area -->
        <div class="glass-card">
          ${this.renderLeftWorkArea(q)}
        </div>

        <!-- Right: Coaching, Templates & Model Band Answers -->
        <div class="glass-card">
          <div class="glass-card-header">
            <h4 style="display:flex; align-items:center; gap:8px;">
              <span>🏆 Tiêu Chuẩn Điểm Cao & Bài Mẫu</span>
            </h4>
            <span class="badge badge-purple">${q.part === 1 ? 'Band 3/3' : q.part === 2 ? 'Band 4/4' : 'Band 5/5'}</span>
          </div>

          ${this.renderRightCoachingArea(q)}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderLeftWorkArea(q) {
    if (q.part === 1) {
      // Questions 1-5: Write a sentence based on picture
      return `
        <div class="glass-card-header">
          <span class="badge badge-cyan">Câu Hỏi ${q.number}/5: Viết Câu Theo Tranh</span>
          <span class="badge badge-amber">Trọng tâm: ${q.grammarFocus}</span>
        </div>

        <div style="border-radius:10px; overflow:hidden; border:1px solid #334155; margin-bottom:14px; max-height:240px; background:#000; display:flex; justify-content:center;">
          <img src="${q.image}" alt="TOEIC Writing Picture" style="width:100%; height:auto; max-height:240px; object-fit:contain;">
        </div>

        <div style="margin-bottom:10px;">
          <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">2 TỪ KHÓA BẮT BUỘC PHẢI DÙNG:</div>
          <div class="keyword-tags-bar" id="keyword-tags-container">
            ${q.keywords.map(kw => `
              <span class="keyword-tag" id="tag-${kw.toLowerCase()}">
                <span>${kw}</span>
              </span>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:14px;">
          <label style="font-size:0.85rem; color:#cbd5e1; font-weight:600; display:block; margin-bottom:6px;">
            Nhập câu tiếng Anh của bạn (chỉ viết ĐÚNG 1 câu hoàn chỉnh):
          </label>
          <textarea class="essay-textarea" id="wrt-input" style="height:110px; font-size:1.05rem;" placeholder="Type your sentence here using both keywords..."></textarea>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <small id="wrt-feedback-hint" style="color:var(--text-muted);">
              Sử dụng đúng cả 2 từ khóa không đổi gốc từ.
            </small>
            <button class="btn btn-writing btn-sm" id="btn-save-draft">Lưu Câu Này</button>
          </div>
        </div>
      `;
    }

    if (q.part === 2) {
      // Questions 6-7: Email response
      return `
        <div class="glass-card-header">
          <span class="badge badge-purple">Email Response (Câu ${q.number})</span>
          <span class="badge badge-emerald">Thời lượng: 10 phút</span>
        </div>

        <div class="email-client-frame" style="margin-bottom:16px;">
          <div class="email-meta-header">
            <div class="email-row"><span class="email-label">From:</span><span class="email-val">${q.emailPrompt.from}</span></div>
            <div class="email-row"><span class="email-label">To:</span><span class="email-val">${q.emailPrompt.to}</span></div>
            <div class="email-row"><span class="email-label">Date:</span><span class="email-val">${q.emailPrompt.date}</span></div>
            <div class="email-row"><span class="email-label">Subject:</span><span class="email-val" style="color:#38bdf8; font-weight:600;">${q.emailPrompt.subject}</span></div>
          </div>
          <div class="email-content-body">
            ${q.emailPrompt.body.replace(/\n\n/g, '<br><br>')}
          </div>
        </div>

        <div class="email-instructions-box">
          <h5>Yêu Cầu Bài Viết Phản Hồi (Directions):</h5>
          <div>${q.directions.replace(/\n/g, '<br>')}</div>
        </div>

        <div style="margin-top:16px;">
          <label style="font-size:0.88rem; color:#fff; font-weight:600; display:block; margin-bottom:6px;">
            Khung Soạn Thảo Email Của Bạn:
          </label>
          <textarea class="essay-textarea" id="wrt-input" style="height:220px;" placeholder="Dear ...,&#10;&#10;Thank you for your email..."></textarea>
          
          <div class="essay-footer-status">
            <span class="word-count-badge" id="wrt-word-count">Số từ: 0 words</span>
            <button class="btn btn-writing btn-sm" id="btn-save-draft">Lưu Thư Này</button>
          </div>
        </div>
      `;
    }

    if (q.part === 3) {
      // Question 8: Opinion Essay
      return `
        <div class="glass-card-header">
          <span class="badge badge-rose">Question 8: Write an Opinion Essay</span>
          <span class="badge badge-emerald">Mục tiêu: 300+ Từ</span>
        </div>

        <div style="background:#0f172a; padding:16px; border-radius:10px; border-left:4px solid var(--accent-purple); margin-bottom:16px; line-height:1.7; font-size:1.02rem; color:#fff;">
          ${q.promptText.replace(/\n\n/g, '<br><br>')}
        </div>

        <!-- Tomato Step 1: Brainstorming Scratchpad -->
        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">
            📝 Nháp Ý Tưởng (Step 1: Brainstorming Scratchpad):
          </label>
          <textarea class="scratchpad" id="wrt-scratchpad" placeholder="Ghi nhanh luận điểm chính, 2 lý do cốt lõi và ví dụ minh họa..."></textarea>
        </div>

        <!-- Essay Textarea -->
        <div class="essay-editor-wrapper">
          <textarea class="essay-textarea" id="wrt-input" style="height:340px;" placeholder="Write your full essay here (Introduction, Body Paragraph 1, Body Paragraph 2, Conclusion)..."></textarea>
          
          <div class="essay-footer-status">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="word-count-badge" id="wrt-word-count">0 / 300 từ</span>
              <span id="wrt-word-indicator" style="font-size:0.8rem; color:var(--text-muted);">(Cần thêm từ để đạt tiêu chuẩn 300+ từ)</span>
            </div>
            <button class="btn btn-writing btn-sm" id="btn-save-draft">Lưu Bài Luận</button>
          </div>
        </div>
      `;
    }
  }

  renderRightCoachingArea(q) {
    if (q.part === 1) {
      return `
        <div style="margin-bottom:14px; background:rgba(0, 210, 255, 0.08); border-left:3px solid var(--accent-cyan); padding:10px 12px; border-radius:4px; font-size:0.85rem; color:#bae6fd;">
          <strong>Bí quyết ngữ pháp Tomato:</strong> ${q.tips}
        </div>

        <div style="font-size:0.88rem; font-weight:700; color:#34d399; margin-bottom:8px;">
          3 Cách Viết Mẫu Đạt Điểm Tối Đa (Band 3/3):
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${q.sampleSentences.map((s, i) => `
            <div style="background:#0b1120; border:1px solid #334155; border-radius:8px; padding:10px 12px; font-size:0.9rem; color:#f1f5f9; line-height:1.6;">
              <span style="color:var(--accent-purple); font-weight:bold;">Cách ${i + 1}:</span> "${s}"
            </div>
          `).join('')}
        </div>
      `;
    }

    if (q.part === 2) {
      return `
        <div style="margin-bottom:14px; background:rgba(139, 92, 246, 0.1); border-left:3px solid var(--accent-purple); padding:10px 12px; border-radius:4px; font-size:0.85rem; color:#ddd6fe;">
          <strong>Bí quyết phản hồi Email:</strong> Phải trả lời đầy đủ từng yêu cầu gạch đầu dòng. Sử dụng câu chào chuyên nghiệp, chia đoạn rõ ràng và kết thúc lịch sự.
        </div>

        <div style="font-size:0.88rem; font-weight:700; color:#34d399; margin-bottom:8px;">
          Bài Viết Mẫu Điểm Tuyệt Đối (Band 4/4):
        </div>
        <div style="background:#0b1120; border:1px solid #334155; border-radius:8px; padding:14px; font-size:0.88rem; line-height:1.7; color:#f1f5f9; white-space:pre-line; max-height:300px; overflow-y:auto;">
          ${q.sampleBand4}
        </div>

        <div style="margin-top:12px; background:rgba(16, 185, 129, 0.08); padding:10px; border-radius:6px; font-size:0.82rem; color:#a7f3d0; border-left:3px solid var(--status-emerald);">
          <strong>Nhận xét:</strong> ${q.modelAnalysis}
        </div>
      `;
    }

    if (q.part === 3) {
      return `
        <!-- Brainstorming Notes -->
        <div style="margin-bottom:12px; background:rgba(245, 158, 11, 0.08); border-left:3px solid var(--status-amber); padding:10px 12px; border-radius:4px; font-size:0.82rem; color:#fde68a;">
          <strong>Ý Tưởng Mẫu (Brainstorming Blueprint):</strong>
          <ul style="padding-left:16px; margin-top:6px; line-height:1.6;">
            ${q.brainstormingNotes.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>

        <div style="font-size:0.88rem; font-weight:700; color:#34d399; margin-bottom:8px;">
          Bài Luận Mẫu Band 5 (${q.wordCount} Từ):
        </div>
        <div style="background:#0b1120; border:1px solid #334155; border-radius:8px; padding:14px; font-size:0.88rem; line-height:1.8; color:#f1f5f9; max-height:280px; overflow-y:auto;">
          ${q.sampleBand5.replace(/\n\n/g, '<br><br>')}
        </div>

        <div style="margin-top:12px; background:rgba(16, 185, 129, 0.08); padding:10px; border-radius:6px; font-size:0.82rem; color:#a7f3d0; border-left:3px solid var(--status-emerald);">
          <strong>Phân tích giám khảo:</strong> ${q.modelAnalysis}
        </div>
      `;
    }
  }

  setupEventListeners() {
    // Navigator pills
    this.container.querySelectorAll(".q-nav-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        this.currentQuestionIndex = idx;
        this.render();
        this.loadSavedDraft();
      });
    });

    // Real-time Text Input Listener
    const inputArea = this.container.querySelector("#wrt-input");
    if (inputArea) {
      inputArea.addEventListener("input", () => {
        this.handleTextInput();
      });
    }

    // Timer button
    const btnToggleTimer = this.container.querySelector("#btn-toggle-timer");
    if (btnToggleTimer) {
      btnToggleTimer.addEventListener("click", () => this.toggleWritingTimer());
    }

    // Save draft button
    const btnSave = this.container.querySelector("#btn-save-draft");
    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const text = inputArea ? inputArea.value : "";
        storageEngine.saveWritingDraft(this.currentQuestion.id, text);
        btnSave.textContent = "✓ Đã Lưu!";
        setTimeout(() => { btnSave.textContent = "Lưu"; }, 1500);
      });
    }
  }

  handleTextInput() {
    const q = this.currentQuestion;
    const inputArea = this.container.querySelector("#wrt-input");
    if (!inputArea) return;
    const text = inputArea.value;

    // Check Question 1-5 Keywords
    if (q.part === 1 && q.keywords) {
      const lowerText = text.toLowerCase();
      q.keywords.forEach(kw => {
        const tag = this.container.querySelector(`#tag-${kw.toLowerCase()}`);
        if (tag) {
          // Check for keyword presence (or common plural/verb forms)
          const isPresent = lowerText.includes(kw.toLowerCase()) || 
            lowerText.includes(kw.toLowerCase() + "s") || 
            lowerText.includes(kw.toLowerCase() + "es") ||
            lowerText.includes(kw.toLowerCase() + "ed") ||
            lowerText.includes(kw.toLowerCase() + "ing");

          if (isPresent) {
            tag.classList.add("matched");
          } else {
            tag.classList.remove("matched");
          }
        }
      });
    }

    // Word Counter for Email & Essay
    const wordCountEl = this.container.querySelector("#wrt-word-count");
    const indicatorEl = this.container.querySelector("#wrt-word-indicator");
    if (wordCountEl) {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      if (q.part === 3) {
        wordCountEl.textContent = `${words} / 300 từ`;
        if (words >= 300) {
          wordCountEl.classList.add("target-met");
          if (indicatorEl) {
            indicatorEl.textContent = "🎉 Tuyệt vời! Đã vượt ngưỡng 300 từ chuẩn ETS!";
            indicatorEl.style.color = "var(--status-emerald)";
          }
        } else {
          wordCountEl.classList.remove("target-met");
          if (indicatorEl) {
            indicatorEl.textContent = `(Còn thiếu ${300 - words} từ để đạt mức khuyến nghị 300+)`;
            indicatorEl.style.color = "var(--status-amber)";
          }
        }
      } else {
        wordCountEl.textContent = `Số từ: ${words} words`;
      }
    }
  }

  toggleWritingTimer() {
    const btn = this.container.querySelector("#btn-toggle-timer");
    const digits = this.container.querySelector("#wrt-timer-digits");
    const q = this.currentQuestion;
    const totalSeconds = q.part === 1 ? 480 : q.part === 2 ? 600 : 1800;

    if (this.timer && this.timer.intervalId) {
      this.timer.stop();
      this.timer = null;
      if (btn) btn.textContent = "▶ Chạy giờ";
    } else {
      if (btn) btn.textContent = "⏸ Tạm dừng";
      this.timer = new TimerEngine({
        prepDuration: 0,
        actionDuration: totalSeconds,
        onTick: (rem, formatted) => {
          if (digits) {
            digits.textContent = formatted;
            if (rem <= 60) digits.classList.add("warning");
          }
        },
        onFinish: () => {
          if (digits) digits.textContent = "HẾT GIỜ!";
          if (btn) btn.textContent = "▶ Làm lại";
        }
      });
      this.timer.start(0, totalSeconds);
    }
  }

  loadSavedDraft() {
    const text = storageEngine.getWritingDraft(this.currentQuestion.id);
    const inputArea = this.container.querySelector("#wrt-input");
    if (inputArea && text) {
      inputArea.value = text;
      this.handleTextInput();
    }
  }
}
