class StorageEngine {
  constructor() {
    this.dbName = "ToeicMasterFlowDB";
    this.dbVersion = 1;
    this.db = null;
    this.initIndexedDB();
  }

  // Initialize IndexedDB for storing audio recordings
  initIndexedDB() {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("recordings")) {
          db.createObjectStore("recordings", { keyPath: "id" });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn("IndexedDB initialization error:", e);
        resolve(null);
      };
    });
  }

  // Save Audio Recording Blob
  async saveAudioRecording(questionId, audioBlob, transcript = "") {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("recordings", "readwrite");
        const store = tx.objectStore("recordings");
        const record = {
          id: questionId,
          blob: audioBlob,
          transcript: transcript,
          timestamp: new Date().toISOString()
        };
        store.put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        console.warn("Error saving audio recording:", err);
        resolve(false);
      }
    });
  }

  // Get Audio Recording Blob
  async getAudioRecording(questionId) {
    if (!this.db) await this.initIndexedDB();
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("recordings", "readonly");
        const store = tx.objectStore("recordings");
        const request = store.get(questionId);

        request.onsuccess = () => {
          if (request.result) {
            const url = URL.createObjectURL(request.result.blob);
            resolve({
              url: url,
              transcript: request.result.transcript,
              timestamp: request.result.timestamp
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  // LocalStorage Helpers for Writing Drafts & Tests
  saveWritingDraft(questionId, text) {
    try {
      localStorage.setItem(`toeic_wrt_${questionId}`, text);
      this.updateStreak();
    } catch (e) {}
  }

  getWritingDraft(questionId) {
    return localStorage.getItem(`toeic_wrt_${questionId}`) || "";
  }

  // Study Plan Progress
  saveStudyPlanProgress(dayIndex, completed) {
    const key = "toeic_study_plan_progress";
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data[dayIndex] = completed;
    localStorage.setItem(key, JSON.stringify(data));
    this.updateStreak();
  }

  getStudyPlanProgress() {
    const key = "toeic_study_plan_progress";
    return JSON.parse(localStorage.getItem(key) || "{}");
  }

  // Streak Management
  updateStreak() {
    const today = new Date().toISOString().split("T")[0];
    const lastActive = localStorage.getItem("toeic_last_active_date");
    let streak = parseInt(localStorage.getItem("toeic_current_streak") || "0", 10);

    if (!lastActive) {
      streak = 1;
    } else if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (lastActive === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }

    localStorage.setItem("toeic_last_active_date", today);
    localStorage.setItem("toeic_current_streak", streak.toString());
    return streak;
  }

  getCurrentStreak() {
    return parseInt(localStorage.getItem("toeic_current_streak") || "1", 10);
  }

  // Mock Test History
  saveTestResult(testId, results) {
    const key = "toeic_test_history";
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    history.unshift({
      testId,
      timestamp: new Date().toISOString(),
      results
    });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
    this.updateStreak();
  }

  getTestHistory() {
    const key = "toeic_test_history";
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
}

export const storageEngine = new StorageEngine();
