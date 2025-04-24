const crypto = require("crypto");

// ✅ استخدم نفس SALLA_WEBHOOK_SECRET الموجود في Vercel
const secret = "ff1acbb915c748680dd5d6554c6343"; // استبدل هذا بالقيمة الحقيقية

// ✅ هذا هو البودي المُستخدم لإنشاء التوقيع
const body = JSON.stringify({
  event: "product.created",
  data: { id: "TEST001", name: "منتج يدوي" },
  store: { hash: "naseqqq" }
});

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

console.log("✅ التوقيع الجاهز:", signature);
console.log("📦 البودي المستخدم:", body);
console.log("\n📋 أمر CURL الجاهز:\n");
console.log(`curl -X POST https://bn-v07.vercel.app/api/salla/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-salla-signature: ${signature}" \\
  -d '${body}'`);