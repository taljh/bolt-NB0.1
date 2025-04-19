import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SIGNING_SECRET = process.env.SALLA_WEBHOOK_SECRET!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(body: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(body)
    .digest("hex");

  console.log("📌 التوقيع المتوقع:", expected);
  console.log("📥 التوقيع المرسل:", signature);

  console.log("📌 التوقيع المتوقع:", expected);
  console.log("📥 التوقيع المرسل:", signature);

  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    console.log("🧪 SECRET المستخدم:", process.env.SALLA_WEBHOOK_SECRET);
    console.log("📦 Webhook وصل فعليًا 🎉");
    const rawBody = await req.text();
    console.log("📦 محتوى rawBody:", rawBody);
    const signature = req.headers.get("x-salla-signature") || "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const eventType = body.event;
    const product = body.data;
    const storeHash = body.store?.hash;

    console.log("🔍 store_hash اللي وصل من Webhook:", storeHash);

    if (!product.id || !product.name || !storeHash) {
      return NextResponse.json({ error: "Missing product or store info" }, { status: 400 });
    }

    // 🔍 نجيب user_id من جدول salla_tokens بناءً على store_hash
    const { data: tokenRecord, error: tokenError } = await supabase
      .from("salla_tokens")
      .select("user_id")
      .eq("store_hash", storeHash)
      .single();

    if (tokenError || !tokenRecord) {
      console.error("❌ فشل في جلب user_id من salla_tokens:", tokenError);
      return NextResponse.json({ error: "User not found for this store" }, { status: 404 });
    }

    const user_id = tokenRecord.user_id;

    console.log("🧠 user_id المستخدم بعد الاستعلام من salla_tokens:", user_id);

    if (eventType === "product.created") {
      console.log("🟡 يبدأ إدخال المنتج...");

      const { data: insertedProduct, error: insertError } = await supabase
        .from("products_new")
        .insert({
          user_id,
          salla_product_id: product.id,
          name: product.name,
          sku: product.sku || null,
          created_at: new Date().toISOString(),
          source: "salla"
        })
        .select()
        .single();

      console.log("🔵 نتيجة إدخال المنتج:", insertedProduct);

      if (insertError) {
        console.error("❌ خطأ في إضافة المنتج:", insertError);
        throw insertError;
      }

      console.log("🟢 المنتج أُضيف بنجاح... الآن نضيف التسعيرة");

      const { error: pricingError } = await supabase.from("pricing_details").insert({
        user_id,
        product_id: insertedProduct.id
      });

      if (pricingError) {
        console.error("❌ خطأ في إضافة التسعيرة:", pricingError);
      } else {
        console.log("✅ التسعيرة أُضيفت بنجاح");
      }

    } else if (eventType === "product.updated") {
      await supabase
        .from("products_new")
        .update({
          name: product.name,
          sku: product.sku || null
        })
        .eq("user_id", user_id)
        .eq("salla_product_id", product.id);
    } else if (eventType === "product.deleted") {
      await supabase
        .from("products_new")
        .delete()
        .eq("user_id", user_id)
        .eq("salla_product_id", product.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}