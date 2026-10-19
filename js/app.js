import { SpeakingStudio } from "./speakingStudio.js";
import { WritingStudio } from "./writingStudio.js";
import { RecipesHub } from "./recipesHub.js";
import { StudyTracker } from "./studyTracker.js";
import { MockTestRunner } from "./mockTestRunner.js";
import { storageEngine } from "./storageEngine.js";

class App {
  constructor() {
    this.currentView = "dashboard";
    this.speakingStudio = null;
    this.writingStudio = null;
    this.recipesHub = null;
    this.studyTracker = null;
    this.mockTestRunner = null;

    this.init();
  }

  init() {
    this.renderDashboard();
    this.setupNavigation();
    this.updateStreakDisplay();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .bottom-nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Handle in-dashboard quick actions
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-jump]");
      if (target) {
        const view = target.dataset.jump;
        this.switchView(view);
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update Desktop Nav bar
    document.querySelectorAll(".nav-item").forEach((item) => {
      if (item.dataset.view === viewName) {
        item.classList.add("active");
        if (viewName === "speaking") item.classList.add("nav-speaking");
        if (viewName === "writing") item.classList.add("nav-writing");
      } else {
        item.classList.remove("active", "nav-speaking", "nav-writing");
      }
    });

    // Update Mobile Bottom Nav bar
    document.querySelectorAll(".bottom-nav-item").forEach((item) => {
      if (item.dataset.view === viewName) {
        item.classList.add("active");
        if (viewName === "writing") item.classList.add("nav-writing");
      } else {
        item.classList.remove("active", "nav-writing");
      }
    });

    // Update View Containers
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Lazy instantiate module views
    if (viewName === "speaking" && !this.speakingStudio) {
      this.speakingStudio = new SpeakingStudio("view-speaking");
    } else if (viewName === "writing" && !this.writingStudio) {
      this.writingStudio = new WritingStudio("view-writing");
    } else if (viewName === "recipes" && !this.recipesHub) {
      this.recipesHub = new RecipesHub("view-recipes");
    } else if (viewName === "tracker") {
      this.studyTracker = new StudyTracker("view-tracker");
    } else if (viewName === "tests" && !this.mockTestRunner) {
      this.mockTestRunner = new MockTestRunner("view-tests");
    } else if (viewName === "dashboard") {
      this.renderDashboard();
    }
  }

  updateStreakDisplay() {
    const streak = storageEngine.getCurrentStreak();
    const streakEl = document.getElementById("streak-counter");
    if (streakEl) {
      streakEl.textContent = `🔥 Chuỗi ${streak} ngày`;
    }
  }

  renderDashboard() {
    const dashContainer = document.getElementById("view-dashboard");
    if (!dashContainer) return;

    const streak = storageEngine.getCurrentStreak();
    const progress = storageEngine.getStudyPlanProgress();
    let completedDays = 0;
    for (let i = 1; i <= 28; i++) {
      if (progress[i]) completedDays++;
    }
    const percent = Math.round((completedDays / 28) * 100);

    dashContainer.innerHTML = `
      <!-- Hero Welcome Banner -->
      <div class="glass-card" style="margin-bottom: var(--space-xl); background: linear-gradient(135deg, rgba(0, 210, 255, 0.12) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(15, 23, 42, 0.8) 100%); border-color: rgba(0, 210, 255, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
          <div style="max-width: 680px;">
            <span class="badge badge-cyan" style="margin-bottom:8px;">HỆ THỐNG ÔN THI TOEIC S&W CHUYÊN SÂU</span>
            <h1 style="font-size:2.2rem; margin-bottom:10px; line-height:1.2;">
              Chinh Phục <span style="background:var(--grad-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">TOEIC Speaking & Writing</span>
            </h1>
            <p style="font-size:1rem; color:#cbd5e1; line-height:1.7;">
              Tích hợp trọn bộ bí kíp từ <strong>Collins Skills for TOEIC Test</strong> và <strong>Tomato TOEIC Speaking & Writing Flow</strong>. Luyện nói có ghi âm & nhận diện giọng nói, luyện viết chuẩn bàn phím QWERTY và thi thử 5 Actual Tests chuẩn ETS.
            </p>
            
            <div style="display:flex; gap:12px; margin-top:20px; flex-wrap:wrap;">
              <button class="btn btn-speaking" data-jump="speaking">
                🎙 Vào Phòng Luyện Nói
              </button>
              <button class="btn btn-writing" data-jump="writing">
                ✍️ Vào Phòng Luyện Viết
              </button>
              <button class="btn btn-secondary" data-jump="tracker">
                📅 Lộ Trình 28 Ngày (${percent}%)
              </button>
            </div>
          </div>

          <!-- Quick Stats Pillar -->
          <div style="display:flex; flex-direction:column; gap:12px; min-width:240px;">
            <div style="background:rgba(0,0,0,0.4); padding:14px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:14px;">
              <div style="font-size:1.8rem;">🔥</div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Chuỗi Luyện Tập</div>
                <div style="font-size:1.3rem; font-weight:800; color:#fbbf24;">${streak} Ngày Liên Tiếp</div>
              </div>
            </div>

            <div style="background:rgba(0,0,0,0.4); padding:14px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:14px;">
              <div style="font-size:1.8rem;">🎯</div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Mục Tiêu ETS</div>
                <div style="font-size:1.3rem; font-weight:800; color:#34d399;">Level 8 / Level 9 (190+)</div>
              </div>
            </div>

            <div style="background:rgba(0,0,0,0.4); padding:14px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:14px;">
              <div style="font-size:1.8rem;">📚</div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Tiến Độ 4 Tuần</div>
                <div style="font-size:1.3rem; font-weight:800; color:#00d2ff;">${completedDays}/28 Bài Đã Học</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2 Core Portals: Speaking & Writing Overview -->
      <div class="grid-2" style="margin-bottom: var(--space-xl);">
        <!-- Speaking Portal -->
        <div class="glass-card" style="border-top:4px solid var(--accent-cyan);">
          <div class="glass-card-header">
            <div>
              <span class="badge badge-cyan" style="margin-bottom:4px;">PHÂN HỆ NÓI</span>
              <h3 style="color:#fff;">TOEIC Speaking Studio</h3>
            </div>
            <span style="font-size:1.2rem; font-weight:800; color:#38bdf8;">11 Câu Hỏi</span>
          </div>
          <p style="font-size:0.9rem; line-height:1.6; margin-bottom:14px;">
            Mô phỏng phòng thi máy tính IBT với bộ đếm giờ chuẩn ETS (Preparation & Speaking time), ghi âm giọng nói qua micro, nhận diện giọng nói và đối chiếu với đáp án mẫu Band 8.
          </p>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.85rem; color:#cbd5e1; margin-bottom:16px;">
            <div>• <strong>Q1–2:</strong> Đọc to đoạn văn (Read a Text Aloud) - 45s</div>
            <div>• <strong>Q3:</strong> Miêu tả tranh (Describe a Picture) - 45s</div>
            <div>• <strong>Q4–6:</strong> Phản xạ câu hỏi khảo sát (Respond to Questions) - 15s/30s</div>
            <div>• <strong>Q7–9:</strong> Quét lịch trình trả lời (Using Information) - 15s/30s</div>
            <div>• <strong>Q10:</strong> Đề xuất giải pháp khiếu nại (Propose a Solution) - 60s</div>
            <div>• <strong>Q11:</strong> Bày tỏ quan điểm cá nhân (Express an Opinion) - 60s</div>
          </div>
          <button class="btn btn-speaking" style="width:100%;" data-jump="speaking">
            Vào Luyện Nói Ngay →
          </button>
        </div>

        <!-- Writing Portal -->
        <div class="glass-card" style="border-top:4px solid var(--accent-purple);">
          <div class="glass-card-header">
            <div>
              <span class="badge badge-purple" style="margin-bottom:4px;">PHÂN HỆ VIẾT</span>
              <h3 style="color:#fff;">TOEIC Writing Studio</h3>
            </div>
            <span style="font-size:1.2rem; font-weight:800; color:#c084fc;">8 Câu Hỏi</span>
          </div>
          <p style="font-size:0.9rem; line-height:1.6; margin-bottom:14px;">
            Luyện gõ bàn phím chuẩn ETS QWERTY: Tự động kiểm tra 2 từ khóa trong tranh (Q1-5), giả lập hộp thư doanh nghiệp (Q6-7) và bộ đếm từ trực tiếp 300+ từ cho bài luận Opinion Essay (Q8).
          </p>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.85rem; color:#cbd5e1; margin-bottom:16px;">
            <div>• <strong>Q1–5:</strong> Viết 1 câu dựa vào tranh và 2 từ khóa (8 phút tổng)</div>
            <div>• <strong>Q6–7:</strong> Viết email phản hồi công sở (10 phút / email)</div>
            <div>• <strong>Q8:</strong> Viết bài luận thể hiện quan điểm ~300 từ (30 phút)</div>
          </div>
          <button class="btn btn-writing" style="width:100%;" data-jump="writing">
            Vào Luyện Viết Ngay →
          </button>
        </div>
      </div>

      <!-- Quick Feature Access Row -->
      <div class="grid-3">
        <div class="glass-card" style="cursor:pointer;" data-jump="recipes">
          <div style="font-size:1.8rem; margin-bottom:8px;">📖</div>
          <h4 style="color:#fff; margin-bottom:6px;">Kho Bí Kíp & Recipes</h4>
          <p style="font-size:0.85rem; color:#94a3b8;">
            Tra cứu nhanh 7 nguyên liệu Speaking, 5 công thức viết câu, 5 dạng email và 5 chủ đề luận kinh điển.
          </p>
        </div>

        <div class="glass-card" style="cursor:pointer;" data-jump="tests">
          <div style="font-size:1.8rem; margin-bottom:8px;">🏆</div>
          <h4 style="color:#fff; margin-bottom:6px;">Actual Mock Tests 1–5</h4>
          <p style="font-size:0.85rem; color:#94a3b8;">
            Thi thử toàn diện liên tục chuẩn thời lượng thi máy tính ETS có bảng quy đổi điểm và Level.
          </p>
        </div>

        <div class="glass-card" style="cursor:pointer;" data-jump="tracker">
          <div style="font-size:1.8rem; margin-bottom:8px;">📅</div>
          <h4 style="color:#fff; margin-bottom:6px;">Lộ Trình Ôn Luyện 28 Ngày</h4>
          <p style="font-size:0.85rem; color:#94a3b8;">
            Kế hoạch chi tiết từng ngày được thiết kế khoa học giúp bạn tự tin đạt band điểm mong muốn.
          </p>
        </div>
      </div>
    `;
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
