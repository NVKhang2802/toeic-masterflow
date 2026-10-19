import { mockTestsData } from "./data/mockTestsData.js";
import { speakingQuestions } from "./data/speakingData.js";
import { writingQuestions } from "./data/writingData.js";
import { storageEngine } from "./storageEngine.js";

export class MockTestRunner {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedTestId = "actual-test-1";
    this.currentExamType = null; // 'speaking' | 'writing'
    this.examQuestionIndex = 0;
    this.examAnswers = {};

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="section-title-wrap">
        <div class="section-subtitle" style="color:var(--status-emerald);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
          Đấu Trường Thi Thử Chuẩn ETS • Actual Tests 1 - 5
        </div>
        <h2 class="section-title">Phòng Thi Thử Máy Tính Toàn Diện</h2>
        <p class="section-desc">Mô phỏng 100% trải nghiệm thi máy IBT: Tự động chuyển câu, thu âm giọng nói, chấm điểm và quy đổi Level theo thang điểm 200 ETS.</p>
      </div>

      <!-- Test Selection Cards Grid -->
      <div class="grid-3" style="margin-bottom: var(--space-xl);">
        ${mockTestsData.map((test, idx) => `
          <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between; border-color:${this.selectedTestId === test.id ? 'var(--status-emerald)' : 'var(--border-card)'};">
            <div>
              <div class="glass-card-header">
                <span class="badge ${idx === 0 ? 'badge-emerald' : idx === 4 ? 'badge-rose' : 'badge-cyan'}">
                  ${idx === 0 ? 'ĐỀ KHUYÊN DÙNG' : idx === 4 ? 'ĐỀ NÂNG CAO' : 'CHÍNH THỨC'}
                </span>
                <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">ETS-IBT</span>
              </div>
              <h4 style="margin-bottom:8px; color:#fff;">${test.name}</h4>
              <p style="font-size:0.85rem; line-height:1.6; margin-bottom:14px;">${test.description}</p>
              
              <div style="font-size:0.82rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px; margin-bottom:16px;">
                <div>🎙 <strong>Speaking:</strong> 11 câu (~20 phút)</div>
                <div>✍️ <strong>Writing:</strong> 8 câu (60 phút)</div>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              <button class="btn btn-speaking btn-sm" style="flex:1;" data-action="start-mock-speaking" data-testid="${test.id}">
                Thi Speaking
              </button>
              <button class="btn btn-writing btn-sm" style="flex:1;" data-action="start-mock-writing" data-testid="${test.id}">
                Thi Writing
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Score Conversion & Band Reference Table -->
      <div class="glass-card">
        <div class="glass-card-header">
          <h4 style="color:#fff;">📊 Bảng Quy Đổi Điểm Số & Cấp Độ ETS (Score & Proficiency Levels)</h4>
          <span class="badge badge-cyan">Chuẩn Viện Khảo Thí Hoa Kỳ</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
            <thead style="background:#1e293b; color:#94a3b8;">
              <tr>
                <th style="padding:10px 14px;">Cấp Độ (Level)</th>
                <th style="padding:10px 14px;">Điểm Speaking (0-200)</th>
                <th style="padding:10px 14px;">Điểm Writing (0-200)</th>
                <th style="padding:10px 14px;">Năng Lực Giao Tiếp Tương Ứng</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-top:1px solid #334155;">
                <td style="padding:10px 14px; font-weight:700; color:#34d399;">Level 8 / Level 9</td>
                <td style="padding:10px 14px; color:#00d2ff; font-weight:600;">190 – 200</td>
                <td style="padding:10px 14px; color:#c084fc; font-weight:600;">200</td>
                <td style="padding:10px 14px; color:#cbd5e1;">Thành thạo gần như người bản ngữ, diễn đạt xuất sắc mọi tình huống công sở phức tạp.</td>
              </tr>
              <tr style="border-top:1px solid #1e293b;">
                <td style="padding:10px 14px; font-weight:700; color:#38bdf8;">Level 7 / Level 8</td>
                <td style="padding:10px 14px; color:#00d2ff; font-weight:600;">160 – 180</td>
                <td style="padding:10px 14px; color:#c084fc; font-weight:600;">170 – 190</td>
                <td style="padding:10px 14px; color:#cbd5e1;">Giao tiếp công sở lưu loát, giải quyết tốt khiếu nại, viết email và bài luận mạch lạc.</td>
              </tr>
              <tr style="border-top:1px solid #1e293b;">
                <td style="padding:10px 14px; font-weight:700; color:#fbbf24;">Level 6 / Level 7</td>
                <td style="padding:10px 14px; color:#00d2ff; font-weight:600;">130 – 150</td>
                <td style="padding:10px 14px; color:#c084fc; font-weight:600;">140 – 160</td>
                <td style="padding:10px 14px; color:#cbd5e1;">Đáp ứng tốt các yêu cầu giao tiếp hàng ngày, còn mắc một số lỗi ngữ pháp nhỏ khi nói nhanh.</td>
              </tr>
              <tr style="border-top:1px solid #1e293b;">
                <td style="padding:10px 14px; font-weight:700; color:#94a3b8;">Level 5 / Level 6</td>
                <td style="padding:10px 14px; color:#00d2ff; font-weight:600;">110 – 120</td>
                <td style="padding:10px 14px; color:#c084fc; font-weight:600;">110 – 130</td>
                <td style="padding:10px 14px; color:#cbd5e1;">Giao tiếp cơ bản, cần bổ sung vốn từ chuyên sâu và cấu trúc câu phức.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.querySelectorAll("[data-action='start-mock-speaking']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const testId = e.currentTarget.dataset.testid;
        this.startMockSpeakingExam(testId);
      });
    });

    this.container.querySelectorAll("[data-action='start-mock-writing']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const testId = e.currentTarget.dataset.testid;
        this.startMockWritingExam(testId);
      });
    });
  }

  startMockSpeakingExam(testId) {
    // Switch to Speaking Studio in authentic test mode
    const navSpeaking = document.querySelector("[data-view='speaking']");
    if (navSpeaking) {
      navSpeaking.click();
      // Click 'Go for TOEIC' mode
      setTimeout(() => {
        const testModeBtn = document.querySelector(".mode-btn[data-mode='test']");
        if (testModeBtn) testModeBtn.click();
      }, 100);
    }
  }

  startMockWritingExam(testId) {
    // Switch to Writing Studio
    const navWriting = document.querySelector("[data-view='writing']");
    if (navWriting) {
      navWriting.click();
    }
  }
}
