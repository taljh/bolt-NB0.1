"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  PackageOpen,
  Tag,
  ShoppingCart,
  Wallet,
  BarChart3,
  Edit,
  ExternalLink,
  Calendar,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProductPricingForm from "@/components/dashboard/products/ProductPricingForm";
import type { Product } from "@/types/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [pricingData, setPricingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // جلب بيانات المنتج وبيانات التسعير
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // التحقق من المستخدم
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // جلب معلومات المنتج
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();

        if (productError) {
          throw new Error('لم يتم العثور على المنتج');
        }

        // جلب بيانات التسعير إن وجدت
        const { data: pricing, error: pricingError } = await supabase
          .from('pricing_details')
          .select('*')
          .eq('product_id', params.id)
          .single();

        if (!pricingError && pricing) {
          setPricingData(pricing);
        }

        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "خطأ",
          description: error instanceof Error ? error.message : "حدث خطأ أثناء جلب بيانات المنتج",
          variant: "destructive",
        });
        router.push('/dashboard/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [supabase, router, params.id, toast]);

  // تنسيق تاريخ الإنشاء
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-1" />
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-amber-50 mb-4">
            <PackageOpen className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لم يتم العثور على المنتج
          </h3>
          <p className="text-gray-500 mb-6">
            لا يمكن العثور على المنتج المطلوب أو أنه لا ينتمي إلى حسابك.
          </p>
          <Link href="/dashboard/products" passHref>
            <Button>العودة إلى قائمة المنتجات</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 space-y-6"
    >
      {/* زر العودة والعنوان */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/dashboard/products')}
            className="h-9 w-9 border-dashed"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
          <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.url && (
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4 ml-1" />
                عرض في المتجر
              </Button>
            </a>
          )}
          <Button 
            size="sm" 
            className={`gap-2 ${product.has_pricing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            onClick={() => setActiveTab("pricing")}
          >
            {product.has_pricing ? (
              <>
                <Edit className="h-4 w-4 ml-1" />
                تعديل التسعير
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 ml-1" />
                تسعير المنتج
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-white">
            التسعير
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* بطاقة صورة المنتج والمعلومات الأساسية */}
            <Card className="overflow-hidden border-gray-100 md:col-span-1">
              <div className="aspect-square relative bg-gray-50 flex items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <PackageOpen className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.has_pricing ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 ml-0.5" />
                      تم التسعير
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 ml-0.5" />
                      بحاجة للتسعير
                    </Badge>
                  )}
                  
                  {product.is_available ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      متوفر
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      غير متوفر
                    </Badge>
                  )}
                  
                  {product.category && (
                    <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                      {product.category}
                    </Badge>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 text-sm">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">رمز المنتج (SKU):</span>
                      <span className="font-medium font-mono">{product.sku}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">السعر الأصلي:</span>
                    <span className="font-medium">{product.price} ريال</span>
                  </div>
                  
                  {pricingData?.final_price && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">السعر النهائي (بعد التسعير):</span>
                      <span className="font-medium text-green-600">{pricingData.final_price} ريال</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الإضافة:</span>
                    <span className="font-medium">{formatDate(product.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* معلومات المنتج التفصيلية */}
            <Card className="border-gray-100 md:col-span-2">
              <CardHeader>
                <CardTitle>معلومات المنتج</CardTitle>
                <CardDescription>تفاصيل ومواصفات المنتج</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* وصف المنتج */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">الوصف</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || "لا يوجد وصف متاح لهذا المنتج."}
                  </p>
                </div>
                
                <Separator />
                
                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-indigo-100 rounded-full">
                          <ShoppingCart className="h-5 w-5 text-indigo-600" />
                        </span>
                        <div>
                          <p className="text-xs text-indigo-600">سعر البيع</p>
                          <p className="font-bold text-lg">{product.price} ريال</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-emerald-50 border-emerald-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-emerald-100 rounded-full">
                          <BarChart3 className="h-5 w-5 text-emerald-600" />
                        </span>
                        <div>
                          <p className="text-xs text-emerald-600">السعر المقترح</p>
                          <p className="font-bold text-lg">
                            {pricingData?.suggested_price || Math.round(product.price * 1.3)} ريال
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-violet-50 border-violet-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-violet-100 rounded-full">
                          <Tag className="h-5 w-5 text-violet-600" />
                        </span>
                        <div>
                          <p className="text-xs text-violet-600">حالة المنتج</p>
                          <p className="font-bold">{product.is_available ? "متوفر" : "غير متوفر"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                {/* معلومات إضافية */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">معلومات إضافية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">رقم المنتج:</span>
                      <span className="font-medium">{product.id}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">تم تسعيره:</span>
                      <span className="font-medium">{product.has_pricing ? "نعم" : "لا"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">المخزون:</span>
                      <span className="font-medium">{product.quantity || "غير محدد"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-medium">{product.weight || "غير محدد"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between bg-gray-50 border-t border-gray-100 p-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Info className="h-4 w-4 ml-2" />
                  آخر تحديث: {formatDate(product.updated_at)}
                </div>
                <div>
                  <Link href="/dashboard/products" passHref>
                    <Button variant="ghost">العودة للقائمة</Button>
                  </Link>
                  <Button 
                    className="mr-2"
                    onClick={() => setActiveTab("pricing")}
                  >
                    {product.has_pricing ? "تعديل التسعير" : "تسعير المنتج"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-0">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ProductPricingForm productId={params.id} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}