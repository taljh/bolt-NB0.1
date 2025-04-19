const crypto = require("crypto");

const secret = "🔐 حط هنا نفس SALLA_WEBHOOK_SECRET من Vercel";
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