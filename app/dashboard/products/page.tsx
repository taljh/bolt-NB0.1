"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { RefreshCcw, Search, Plus, Filter, ArrowDownUp, Archive, Layers, BarChart3, Settings2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ProductList from "@/components/dashboard/products/ProductList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [showUnpricedOnly, setShowUnpricedOnly] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // التحقق من المستخدم وجلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // التحقق من المستخدم
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // جلب المنتجات
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        setProducts(products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "خطأ في جلب المنتجات",
          description: "حدث خطأ أثناء جلب قائمة المنتجات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase, router, toast]);

  // مزامنة المنتجات من سلة
  const syncProducts = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/salla/sync-products', {
        method: 'POST'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل في مزامنة المنتجات');
      }

      console.log("✅ Sync success:", result);
      toast({
        title: "تمت المزامنة بنجاح",
        description: `تم تحديث ${result.count} منتج من سلة`,
        variant: "default",
      });

      // تحديث القائمة
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error("❌ Error fetching products after sync:", fetchError);
          throw new Error('فشل في تحديث قائمة المنتجات');
        }

        console.log("✅ Products list updated:", products?.length || 0, "products");
        setProducts(products || []);
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      toast({
        title: "خطأ في المزامنة",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء مزامنة المنتجات من سلة",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setSyncing(false);
    }
  };

  // إضافة حالات تصفية جديدة
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "price">("newest");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "priced" | "unpriced">("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPricingFinished, setIsPricingFinished] = useState(false);
  
  // استخراج الفئات من المنتجات
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    }
    
    // التحقق من اكتمال تسعير جميع المنتجات
    const unpricedCount = products.filter(p => !p.has_pricing).length;
    setIsPricingFinished(products.length > 0 && unpricedCount === 0);
  }, [products]);

  // تصفية المنتجات الموسعة
  const filteredProducts = products.filter(product => {
    // تصفية حسب البحث
    const matchesSearch = search === "" || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku?.toLowerCase() || "").includes(search.toLowerCase());
    
    // تصفية حسب الفئة
    const matchesCategory = !activeCategory || product.category === activeCategory;
    
    // تصفية حسب حالة التسعير
    const matchesPricingTab = activeTab === "all" ||
      (activeTab === "priced" && product.has_pricing) ||
      (activeTab === "unpriced" && !product.has_pricing);
    
    // تصفية حسب حالة المنتجات غير المسعرة
    const matchesPricingFilter = !showUnpricedOnly || !product.has_pricing;
    
    return matchesSearch && matchesCategory && matchesPricingTab && matchesPricingFilter;
  });

  // ترتيب المنتجات
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        // يمكن تغيير هذا لاحقًا حسب بيانات السعر الفعلية
        return a.has_pricing ? -1 : 1;
      default:
        return 0;
    }
  });

  // حساب إحصائيات المنتجات
  const pricedCount = products.filter(p => p.has_pricing).length;
  const unpricedCount = products.filter(p => !p.has_pricing).length;
  const pricedPercentage = products.length > 0 ? (pricedCount / products.length) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <div className="container mx-auto py-8 space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-indigo-50/30 p-8 rounded-2xl shadow-md border border-indigo-100 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700">
                    <Layers className="h-5 w-5" />
                  </span>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-500 text-transparent bg-clip-text">
                    المنتجات
                  </h1>
                </div>
                <p className="text-gray-600">
                  إدارة وتسعير منتجاتك بشكل احترافي مع تحليلات متقدمة
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={syncProducts}
                  disabled={syncing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-sm"
                >
                  <RefreshCcw className={`h-4 w-4 ml-2 ${syncing ? 'animate-spin' : ''}`} />
                  مزامنة من سلة
                </Button>
                <Button variant="outline" className="border-dashed border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منتج
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings2 className="h-4 w-4" />
                      <span className="sr-only">خيارات</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>خيارات المنتجات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 ml-1.5" />
                      <span>تحليلات المنتجات</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Archive className="h-4 w-4 ml-1.5" />
                      <span>أرشفة المنتجات</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Tag className="h-4 w-4 ml-1.5" />
                      <span>إدارة الفئات</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">تقدم التسعير</span>
                <span className="text-sm font-medium">{Math.round(pricedPercentage)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${pricedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 flex justify-start">
                <span className="text-xs text-gray-500">{pricedCount} من {products.length} تم تسعيرها</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Filters Section */}
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(val) => setActiveTab(val as "all" | "priced" | "unpriced")} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              {/* نقل عناصر التصفية إلى اليمين */}
              <TabsList className="flex justify-start mb-4 md:mb-0 order-first">
                <TabsTrigger value="all">كل المنتجات</TabsTrigger>
                <TabsTrigger value="active">نشطة</TabsTrigger>
                <TabsTrigger value="inactive">غير نشطة</TabsTrigger>
                <TabsTrigger value="out-of-stock">نفذت الكمية</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 order-last md:order-last">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowDownUp className="h-3.5 w-3.5 ms-1" />
                      <span>ترتيب: {
                        sortBy === "newest" ? "الأحدث" : 
                        sortBy === "oldest" ? "الأقدم" : 
                        sortBy === "name" ? "الاسم" : 
                        "السعر"
                      }</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      <span className={sortBy === "newest" ? "text-indigo-600 font-medium" : ""}>الأحدث أولاً</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      <span className={sortBy === "oldest" ? "text-indigo-600 font-medium" : ""}>الأقدم أولاً</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      <span className={sortBy === "name" ? "text-indigo-600 font-medium" : ""}>ترتيب أبجدي</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price")}>
                      <span className={sortBy === "price" ? "text-indigo-600 font-medium" : ""}>المسعرة أولاً</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن المنتجات..."
                    className="ps-10 pe-3 w-full md:w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ms-2 me-0">
                      <Filter className="h-4 w-4 ms-2" />
                      تصفية
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuLabel>الفئات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => {
                          if (selectedCategories.includes(category)) {
                            setSelectedCategories(selectedCategories.filter((c) => c !== category));
                          } else {
                            setSelectedCategories([...selectedCategories, category]);
                          }
                        }}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* إعادة ترتيب بطاقات الإحصائيات من اليمين إلى اليسار */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rtl">
              {/* إجمالي المنتجات - أول عنصر من اليمين */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-1.5 bg-indigo-500"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Layers className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">إجمالي المنتجات</h3>
                      <p className="text-2xl font-bold mt-1">{products.length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* تم تسعيرها - عنصر في الوسط */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-1.5 bg-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Tag className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">تم تسعيرها</h3>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold mt-1 text-green-600">{pricedCount}</p>
                        <span className="text-sm text-gray-400 mb-1">({Math.round(pricedPercentage)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* بانتظار التسعير - آخر عنصر من اليسار */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-1.5 bg-amber-500"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-50 w-12 h-12 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">بانتظار التسعير</h3>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold mt-1 text-amber-600">{unpricedCount}</p>
                        <span className="text-sm text-gray-400 mb-1">
                          ({products.length > 0 ? Math.round((unpricedCount / products.length) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Products List */}
            <TabsContent value="all" className="mt-0">
              <AnimatePresence>
                {isPricingFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"
                  >
                    <div className="p-1 bg-green-100 rounded-full">
                      <RefreshCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">تهانينا! تم تسعير جميع المنتجات.</p>
                      <p className="text-sm text-green-600">جميع منتجاتك جاهزة للبيع الآن بأسعار مدروسة.</p>
                    </div>
                  </motion.div>
                )}
                <ProductList
                  products={sortedProducts}
                  loading={loading}
                  onSync={syncProducts}
                  isFiltered={showUnpricedOnly || !!activeCategory || activeTab !== "all"}
                />
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="priced" className="mt-0">
              <ProductList
                products={sortedProducts}
                loading={loading}
                onSync={syncProducts}
                isFiltered={true}
              />
            </TabsContent>
            
            <TabsContent value="unpriced" className="mt-0">
              <ProductList
                products={sortedProducts}
                loading={loading}
                onSync={syncProducts}
                isFiltered={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}