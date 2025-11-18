import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ضروري لعمل React build على Netlify
export default defineConfig({
  plugins: [react()],

  // *** التعديل الجديد يبدأ هنا لتصحيح خطأ الحظر ***
  server: {
    // هذه الإضافة تسمح لـ Vite بالعمل على النطاقات الفرعية العشوائية لبيئات التطوير السحابية.
    allowedHosts: [".csb.app", "localhost"],
  },
  // *** التعديل الجديد ينتهي هنا ***
});
