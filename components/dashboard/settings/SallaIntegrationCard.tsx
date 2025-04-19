"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";

interface SallaIntegrationCardProps {
  userId: string;
}

export default function SallaIntegrationCard({ userId }: SallaIntegrationCardProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  
  const sallaAuthUrl = "https://s.salla.sa/auth/auto?access_token=eyJpdiI6IlRJSy9QODVIelBJUXY4ZzlrUWIraXc9PSIsInZhbHVlIjoiMzR3dHpLKzB0MWVrNzJuV1hHNEk4clEyeVd3eHRVQStFb2lLVXpPaWREMVZYN3BzN2ZpeHd5MXNMbEpheUFHR0NvVGxWL2tUby9kVE5rQWFkSStTc0E9PSIsIm1hYyI6IjcwZWE1N2Q2YTIzNmVhNTRlMTdmMjcxYTUwMGNhODg3OTA3NjdlNTk2N2VhZWZlZWFhMzA3OTdlMjQ1YTNhZmIiLCJ0YWciOiIifQ==&source=partners&url=https%3A%2F%2Fs.salla.sa%2Fapps%2Finstall%2F1016490457";

  const syncProducts = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/salla/sync-products', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to sync products');
      
      toast({
        title: "تم بنجاح",
        description: `تم مزامنة ${data.count} منتج من المتجر`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء مزامنة المنتجات",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>متصل بـ: <strong>{storeName}</strong></span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={syncProducts}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري المزامنة...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2" />
                      مزامنة المنتجات
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">إدارة الربط</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>لم يتم الربط مع سلة بعد</span>
            </div>
            <Button asChild>
              <a href={sallaAuthUrl}>ربط الآن</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
