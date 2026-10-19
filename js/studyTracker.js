import { studyPlanData } from "./data/studyPlanData.js";
import { storageEngine } from "./storageEngine.js";

export class StudyTracker {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.progress = storageEngine.getStudyPlanProgress();
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    this.progress = storageEngine.getStudyPlanProgress();

    // Calculate completion stats
    let totalDays = 28;
    let completedCount = 0;
    for (let i = 1; i <= 28; i++) {
      if (this.progress[i]) completedCount++;
    }
    const percent = Math.round((completedCount / totalDays) * 100);

    this.container.innerHTML = `
      <div class="section-title-wrap">
        <div class="section-subtitle" style="color:var(--status-emerald);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          Lộ Trình Bứt Phá 4 Tuần • 28-Day Master Study Plan
        </div>
        <h2 class="section-title">Kế Hoạch Ôn Luyện Chuẩn Tomato & Collins</h2>
        <p class="section-desc">Mỗi ngày dành 60 - 90 phút học theo lộ trình tuần tự từ Starters $\\rightarrow$ Main Dishes $\\rightarrow$ Desserts (Actual Tests).</p>
      </div>

      <!-- Overall Progress Bar Card -->
      <div class="glass-card" style="margin-bottom:var(--space-xl); background:linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="color:#fff;">Tiến Độ Hoàn Thành Lộ Trình: ${completedCount} / 28 Ngày</h4>
            <small style="color:#a7f3d0;">Duy trì liên tục mỗi ngày để đạt phong độ cao nhất khi bước vào phòng thi thật.</small>
          </div>
          <div style="font-family:var(--font-mono); font-size:2rem; font-weight:800; color:#34d399;">
            ${percent}%
          </div>
        </div>
        <div style="width:100%; height:12px; background:rgba(0,0,0,0.5); border-radius:var(--radius-full); overflow:hidden;">
          <div style="width:${percent}%; height:100%; background:var(--grad-primary); transition:width 0.4s ease;"></div>
        </div>
      </div>

      <!-- 4 Weeks Accordion / Cards -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${studyPlanData.map(week => `
          <div class="glass-card">
            <div class="glass-card-header">
              <div>
                <span class="badge badge-cyan" style="margin-bottom:4px;">Tuần ${week.week}</span>
                <h3 style="color:#fff; font-size:1.2rem;">${week.title}</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin-top:2px;">Mục tiêu: ${week.goal}</p>
              </div>
            </div>

            <!-- Days List -->
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${week.days.map(d => {
                const isDone = !!this.progress[d.day];
                const badgeClass = d.skill === 'Speaking' ? 'badge-cyan' : d.skill === 'Writing' ? 'badge-purple' : d.skill === 'Mock Test' ? 'badge-amber' : 'badge-emerald';

                return `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:${isDone ? 'rgba(16, 185, 129, 0.08)' : '#0f172a'}; border:1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : '#1e293b'}; border-radius:8px; transition:all 0.2s;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <input type="checkbox" class="study-day-chk" data-day="${d.day}" ${isDone ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--status-emerald); cursor:pointer;">
                      <span style="font-family:var(--font-mono); font-weight:700; color:#38bdf8; font-size:0.9rem;">
                        Ngày ${d.day < 10 ? '0' + d.day : d.day}:
                      </span>
                      <span class="badge ${badgeClass}" style="font-size:0.75rem;">${d.skill}</span>
                      <span style="font-size:0.9rem; color:${isDone ? '#94a3b8' : '#e2e8f0'}; text-decoration:${isDone ? 'line-through' : 'none'};">
                        ${d.task}
                      </span>
                    </div>

                    <button class="btn btn-secondary btn-sm" data-action="go-practice" data-skill="${d.skill}">
                      Luyện Tập →
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.container.querySelectorAll(".study-day-chk").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const day = parseInt(e.target.dataset.day, 10);
        const isChecked = e.target.checked;
        storageEngine.saveStudyPlanProgress(day, isChecked);
        this.render();
      });
    });

    this.container.querySelectorAll("[data-action='go-practice']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const skill = e.currentTarget.dataset.skill;
        if (skill === "Speaking") {
          document.querySelector("[data-view='speaking']").click();
        } else if (skill === "Writing") {
          document.querySelector("[data-view='writing']").click();
        } else if (skill === "Mock Test") {
          document.querySelector("[data-view='tests']").click();
        } else {
          document.querySelector("[data-view='recipes']").click();
        }
      });
    });
  }
}
