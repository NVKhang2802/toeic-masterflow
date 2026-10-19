import { recipesData } from "./data/recipesData.js";

export class RecipesHub {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = "speaking"; // 'speaking' | 'writing' | 'connectors'
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="section-title-wrap">
        <div class="section-subtitle" style="color:var(--status-amber);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
          Bách Khoa Bí Kíp & Công Thức • Recipe & Knowledge Hub
        </div>
        <h2 class="section-title">Kho Tri Thức & Công Thức Chuẩn Tomato - Collins</h2>
        <p class="section-desc">Tổng hợp toàn bộ 7 nguyên liệu Speaking Starters, 5 công thức Viết câu tranh, 5 mẫu Email công sở và 5 chủ đề luận kinh điển.</p>
      </div>

      <!-- Category Filter Tabs -->
      <div style="display:flex; gap:10px; margin-bottom:var(--space-lg);">
        <button class="btn ${this.activeTab === 'speaking' ? 'btn-speaking' : 'btn-secondary'}" data-tab="speaking">
          🎙 Speaking Recipes (Nói)
        </button>
        <button class="btn ${this.activeTab === 'writing' ? 'btn-writing' : 'btn-secondary'}" data-tab="writing">
          ✍️ Writing Recipes (Viết)
        </button>
        <button class="btn ${this.activeTab === 'connectors' ? 'btn-primary' : 'btn-secondary'}" data-tab="connectors">
          🔗 Từ Nối & Liên Kết (Connectors)
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="recipe-tab-content">
        ${this.renderTabContent()}
      </div>
    `;

    this.setupEventListeners();
  }

  renderTabContent() {
    if (this.activeTab === "speaking") {
      return `
        <h3 style="margin-bottom:16px; color:#38bdf8;">Starters: 7 Loại Nguyên Liệu Để Nấu Món Speaking</h3>
        <div class="grid-2" style="margin-bottom:24px;">
          ${recipesData.speaking.starters.map(r => `
            <div class="glass-card">
              <div class="glass-card-header">
                <span class="badge badge-cyan">${r.title.split(':')[0]}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">Tomato Flow</span>
              </div>
              <h4 style="margin-bottom:8px; font-size:1.05rem; color:#fff;">${r.title.split(':')[1]}</h4>
              <p style="font-size:0.85rem; margin-bottom:10px; color:#94a3b8;">${r.focus}</p>
              <ul style="padding-left:18px; font-size:0.85rem; color:#cbd5e1; line-height:1.6; margin-bottom:10px;">
                ${r.rules.map(rule => `<li>${rule}</li>`).join('')}
              </ul>
              ${r.example ? `
                <div style="background:#0f172a; padding:8px 12px; border-radius:6px; font-size:0.82rem; color:#a7f3d0; border-left:3px solid var(--status-emerald);">
                  💡 <strong>Ví dụ:</strong> ${r.example}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <h3 style="margin-bottom:16px; color:#38bdf8;">Main Dishes: Chiến Lược 6 Thể Loại Bài Nói (Q1 - Q11)</h3>
        <div class="grid-3">
          ${recipesData.speaking.mainDishes.map(m => `
            <div class="glass-card">
              <div style="font-size:0.95rem; font-weight:700; color:#00d2ff; margin-bottom:6px;">
                ${m.partName}
              </div>
              <p style="font-size:0.85rem; line-height:1.6; color:#cbd5e1;">
                ${m.coreStrategy}
              </p>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (this.activeTab === "writing") {
      return `
        <h3 style="margin-bottom:16px; color:#c084fc;">Starters: 5 Recipes Viết Câu Theo Tranh (Q1 - Q5)</h3>
        <div class="grid-3" style="margin-bottom:24px;">
          ${recipesData.writing.sentenceRecipes.map(r => `
            <div class="glass-card">
              <div class="glass-card-header">
                <span class="badge badge-purple">${r.title.split(':')[0]}</span>
              </div>
              <h4 style="font-size:0.98rem; margin-bottom:8px; color:#fff;">${r.title.split(':')[1]}</h4>
              <p style="font-size:0.85rem; margin-bottom:10px; color:#cbd5e1;">${r.rule}</p>
              <div style="background:#0b1120; padding:8px 10px; border-radius:6px; font-size:0.82rem; color:#a7f3d0; border-left:3px solid var(--status-emerald);">
                <strong>Minh họa:</strong> ${r.example}
              </div>
            </div>
          `).join('')}
        </div>

        <h3 style="margin-bottom:16px; color:#c084fc;">Main Dishes 1: 5 Mẫu Email Công Sở Điển Hình (Q6 - Q7)</h3>
        <div class="grid-2" style="margin-bottom:24px;">
          ${recipesData.writing.emailRecipes.map(e => `
            <div class="glass-card">
              <h4 style="font-size:1rem; color:#e2e8f0; margin-bottom:8px;">${e.title}</h4>
              <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Cụm từ đắt giá gợi ý:</div>
              <ul style="padding-left:18px; font-size:0.85rem; color:#cbd5e1; line-height:1.6;">
                ${e.phrases.map(p => `<li><em>"${p}"</em></li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <h3 style="margin-bottom:16px; color:#c084fc;">Main Dishes 2: 5 Chủ Đề Luận Công Sở Kinh Điển (Q8)</h3>
        <div class="grid-3">
          ${recipesData.writing.essayTopics.map(t => `
            <div class="glass-card">
              <span class="badge badge-rose" style="margin-bottom:8px;">Topic ${t.topicNumber}</span>
              <h4 style="font-size:1rem; color:#fff; margin-bottom:6px;">${t.name}</h4>
              <p style="font-size:0.85rem; color:#cbd5e1;"><strong>Góc nhìn tranh biện:</strong> ${t.focus}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (this.activeTab === "connectors") {
      const c = recipesData.connectors;
      return `
        <h3 style="margin-bottom:16px; color:#38bdf8;">Ngân Hàng Liên Từ & Cụm Từ Nối Tăng Điểm Cohesion</h3>
        <div class="grid-2">
          <div class="glass-card">
            <h4 style="color:#38bdf8; margin-bottom:10px;">📌 Đưa Ra Ví Dụ (Giving Examples)</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${c.givingExamples.map(w => `<span class="badge badge-cyan" style="font-size:0.85rem;">${w}</span>`).join('')}
            </div>
          </div>
          <div class="glass-card">
            <h4 style="color:#a78bfa; margin-bottom:10px;">➕ Bổ Sung Thông Tin (Adding Information)</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${c.addingInformation.map(w => `<span class="badge badge-purple" style="font-size:0.85rem;">${w}</span>`).join('')}
            </div>
          </div>
          <div class="glass-card">
            <h4 style="color:#fbbf24; margin-bottom:10px;">⚡ Tương Phản & Đối Lập (Contrasting)</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${c.contrasting.map(w => `<span class="badge badge-amber" style="font-size:0.85rem;">${w}</span>`).join('')}
            </div>
          </div>
          <div class="glass-card">
            <h4 style="color:#34d399; margin-bottom:10px;">🎯 Kết Luận & Tóm Lược (Concluding)</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${c.concluding.map(w => `<span class="badge badge-emerald" style="font-size:0.85rem;">${w}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  setupEventListeners() {
    this.container.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });
  }
}
