"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, ExternalLink, Check, Clock, AlertTriangle, ShoppingCart, Tag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Product } from "@/types/products";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onSync: () => void;
  isFiltered?: boolean;
}

export default function ProductList({ products, loading, onSync, isFiltered = false }: ProductListProps) {
  // حالة إظهار ملخص الأسعار لكل منتج
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  
  const toggleExpandProduct = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  // إذا كانت القائمة فارغة
  if (!loading && products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-amber-50 mb-4">
            <ShoppingCart className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {isFiltered ? "لا توجد منتجات تطابق الفلتر" : "لا توجد منتجات"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {isFiltered 
              ? "قم بتعديل معايير الفلترة للعثور على المنتجات" 
              : "لم يتم العثور على أي منتجات في حسابك. قم بإضافة منتجات أو مزامنتها من سلة."}
          </p>
          {!isFiltered && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={onSync}
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
              >
                مزامنة من سلة
              </Button>
              <Button variant="outline">
                إضافة منتج يدويًا
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // تحميل النموذج المبدئي
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
            <div className="flex items-center">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="mr-4 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <div className="flex">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md mr-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // البطاقات المتقدمة للمنتجات
  return (
    <div className="space-y-4" dir="rtl">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <Card className="overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              {/* صورة المنتج */}
              <div className="relative h-24 w-24 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* معلومات المنتج */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.category && (
                    <Badge variant="outline" className="mr-2 text-xs bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                      {product.category}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {product.sku && (
                    <span className="inline-flex items-center text-xs">
                      <span className="text-gray-400">SKU:</span>
                      <span className="mr-1 font-mono">{product.sku}</span>
                    </span>
                  )}
                  
                  {/* حالة التسعير */}
                  {product.has_pricing ? (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex items-center gap-1">
                      <Check className="h-3 w-3 ml-1" /> {/* Changed back to ml-1 because in RTL context, ml will appear on the right */}
                      تم التسعير
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3 ml-1" /> {/* Changed back to ml-1 because in RTL context, ml will appear on the right */}
                      بدون تسعير
                    </Badge>
                  )}
                </div>
                
                {/* معلومات إضافية - تظهر عند التوسيع */}
                <AnimatePresence>
                  {expandedProductId === product.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2"
                    >
                      <Separator className="my-2" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">السعر الأصلي:</span>
                          <span className="font-medium">{product.price || "غير متوفر"} ريال</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">السعر المقترح:</span>
                          <span className="font-medium text-green-600">{(product.price || 0) * 1.3} ريال</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">الحالة:</span>
                          <span className="font-medium">{product.is_available ? "متوفر" : "غير متوفر"}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-3">
                        <Link href={`/dashboard/products/${product.id}`} passHref>
                          <Button size="sm" variant="outline" className="gap-1 text-xs">
                            <Edit className="h-3 w-3 ml-1" />
                            عرض التفاصيل
                          </Button>
                        </Link>
                        
                        {product.url && (
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1 text-xs">
                              <ExternalLink className="h-3 w-3 ml-1" />
                              عرض في المتجر
                            </Button>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* أزرار الإجراءات */}
              <div className="flex items-start gap-2 sm:flex-col md:flex-row md:items-center">
                <Link href={`/dashboard/products/${product.id}`} passHref>
                  <Button 
                    className={`gap-2 ${product.has_pricing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                    size="sm"
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
                </Link>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                        onClick={() => toggleExpandProduct(product.id)}
                      >
                        {expandedProductId === product.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{expandedProductId === product.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}