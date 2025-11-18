// src/lib/voter.js
export function getOrCreateVoterId() {
    try {
      let vid = localStorage.getItem("voterId");
      if (!vid) {
        // إنشاء معرف بسيط فريد (UUID-lite)
        vid = 'v-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
        localStorage.setItem("voterId", vid);
      }
      return vid;
    } catch (e) {
      // في حال تعذر الوصول إلى localStorage
      return 'v-unknown';
    }
  }
  