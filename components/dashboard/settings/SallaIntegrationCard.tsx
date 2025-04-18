"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface SallaIntegrationCardProps {
  userId: string;
}

export default function SallaIntegrationCard({ userId }: SallaIntegrationCardProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const supabase = createClientComponentClient();

      if (!userId) {
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("salla_tokens")
        .select("store_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("فشل التحقق من حالة الربط:", error.message);
        setIsConnected(false);
      } else if (data && data.store_name) {
        setStoreName(data.store_name);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      setIsLoading(false);
    };

    checkConnection();
  }, [userId]);

  return (
    <Card className="border border-gray-200 shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">الربط مع سلة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>جاري التحقق من حالة الربط...</span>
          </div>
        ) : isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>متصل بـ: <strong>{storeName}</strong></span>
            </div>
            <Button variant="outline">إدارة الربط</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>لم يتم الربط مع سلة بعد</span>
            </div>
            <Button asChild>
              <a href="/api/salla/connect">ربط الآن</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
