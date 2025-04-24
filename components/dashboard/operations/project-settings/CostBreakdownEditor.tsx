"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface CostItem {
  label: string;
  amount: number;
}

interface Props {
  value?: CostItem[];
  onChange: (items: CostItem[]) => void;
  onTotalChange: (total: number) => void;
}

export default function CostBreakdownEditor({ value = [], onChange, onTotalChange }: Props) {
  // استخدام useRef للتحكم في التحديثات المتكررة
  const isInitialMount = useRef(true);
  const previousValue = useRef<CostItem[]>([]);
  
  // تحسين إدارة الحالة
  const [items, setItems] = useState<CostItem[]>(() => {
    return Array.isArray(value) && value.length > 0 ? value : [];
  });

  // مزامنة مع البيانات الأولية
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // التحقق من وجود تغييرات فعلية
    const hasChanged = JSON.stringify(previousValue.current) !== JSON.stringify(value);
    
    if (hasChanged && Array.isArray(value)) {
      previousValue.current = value;
      setItems(value);
    }
  }, [value]);

  // تحديث البيانات في الأب
  const updateParent = useCallback((newItems: CostItem[]) => {
    const validItems = newItems.filter(item => 
      item.label.trim() !== '' || item.amount !== 0
    );
    
    onChange(validItems);
    
    const total = validItems.reduce((sum, item) => 
      sum + (Number(item.amount) || 0), 0
    );
    
    onTotalChange(total);
  }, [onChange, onTotalChange]);

  // معالجة إضافة بند جديد
  const handleAdd = useCallback(() => {
    setItems(current => {
      const newItems = [...current, { label: "", amount: 0 }];
      requestAnimationFrame(() => updateParent(newItems));
      return newItems;
    });
  }, [updateParent]);

  // معالجة تحديث البند
  const handleUpdate = useCallback((index: number, field: keyof CostItem, value: string | number) => {
    setItems(current => {
      const newItems = current.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: field === 'amount' ? Number(value) || 0 : value
          };
        }
        return item;
      });
      requestAnimationFrame(() => updateParent(newItems));
      return newItems;
    });
  }, [updateParent]);

  // معالجة حذف البند
  const handleRemove = useCallback((index: number) => {
    setItems(current => {
      const newItems = current.filter((_, i) => i !== index);
      requestAnimationFrame(() => updateParent(newItems));
      return newItems;
    });
  }, [updateParent]);

  // إضافة حساب الإجمالي
  const totalCost = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            تفاصيل التكاليف الثابتة
          </CardTitle>
          <Button 
            onClick={handleAdd} 
            variant="outline" 
            className="gap-2 hover:bg-primary/5 transition-colors"
            type="button"
          >
            <PlusCircle className="w-4 h-4 text-primary" /> 
            إضافة بند جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
                layoutId="empty-state"
              >
                <p className="text-gray-500">لم تتم إضافة أي تكاليف ثابتة حتى الآن</p>
                <Button 
                  onClick={handleAdd}
                  variant="ghost" 
                  className="mt-2 text-primary hover:bg-primary/5"
                  type="button"
                >
                  إضافة أول بند
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="space-y-3"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                    className="grid grid-cols-12 gap-4 items-center bg-gray-50/50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="col-span-6">
                      <Input
                        placeholder="اسم البند"
                        value={item.label}
                        onChange={(e) => handleUpdate(index, "label", e.target.value)}
                        className="bg-white border-gray-200 focus:border-primary/50"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="القيمة (ر.س)"
                        value={item.amount || ''}
                        onChange={(e) => handleUpdate(index, "amount", e.target.value)}
                        className="bg-white border-gray-200 focus:border-primary/50 text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="col-span-2 text-right">
                      <Button 
                        onClick={() => handleRemove(index)}
                        variant="ghost" 
                        className="hover:bg-red-50 group"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* إضافة عرض الإجمالي */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    إجمالي التكاليف الثابتة الشهرية
                  </span>
                </div>
                <motion.div
                  key={totalCost}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-end"
                >
                  <span className="text-2xl font-bold text-primary">
                    {totalCost.toLocaleString('ar-SA')} 
                  </span>
                  <span className="text-sm text-gray-500">ريال سعودي</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
