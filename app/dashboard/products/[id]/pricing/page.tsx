"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductPricingForm from "@/components/dashboard/products/ProductPricingForm";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  sku: string;
  user_id: string;
}

interface PricingPageProps {
  params: {
    id: string;
  };
}

export default function ProductPricingPage({ params }: PricingPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();
  const productId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // التحقق من المستخدم
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "غير مصرح",
            description: "يجب تسجيل الدخول أولاً",
            variant: "destructive",
          });
          router.push('/login');
          return;
        }

        // جلب بيانات المنتج
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) {
          throw new Error('خطأ في جلب بيانات المنتج');
        }

        // التحقق من ملكية المنتج
        if (product.user_id !== user.id) {
          toast({
            title: "غير مصرح",
            description: "لا يمكنك الوصول لهذا المنتج",
            variant: "destructive",
          });
          router.push('/dashboard/products');
          return;
        }

        setProduct(product);

      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "خطأ",
          description: error instanceof Error ? error.message : "حدث خطأ أثناء جلب البيانات",
          variant: "destructive",
        });
        router.push('/dashboard/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, supabase, toast, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium text-red-600">لم يتم العثور على المنتج</h3>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">تسعير المنتج: {product.name}</h1>
        {product.sku && (
          <p className="text-gray-500 mt-1">رقم المنتج: {product.sku}</p>
        )}
      </div>

      <ProductPricingForm productId={product.id} />
    </div>
  );
}