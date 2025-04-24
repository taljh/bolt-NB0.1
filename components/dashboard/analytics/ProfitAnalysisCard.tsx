import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface ProfitAnalysisProps {
  product: {
    name: string;
    pricing_details: {
      total_direct_cost: number;
      final_price: number;
      profit_margin: number;
      target_segment: 'economic' | 'medium' | 'luxury';
    };
  };
  marketAverages?: {
    avgProfit: number;
    avgPrice: number;
  };
}

export default function ProfitAnalysisCard({ product, marketAverages }: ProfitAnalysisProps) {
  const {
    pricing_details: {
      total_direct_cost,
      final_price,
      profit_margin,
      target_segment
    }
  } = product;

  const profit = final_price - total_direct_cost;
  const profitPercentage = (profit / final_price) * 100;

  // حساب مؤشر الكفاءة
  const getEfficiencyScore = () => {
    const baseScore = 100;
    let score = baseScore;

    // خصم النقاط إذا كان هامش الربح منخفضاً جداً
    if (profit_margin < 15) {
      score -= 30;
    } else if (profit_margin < 25) {
      score -= 15;
    }

    // خصم النقاط إذا كانت التكاليف مرتفعة نسبة للسعر
    const costRatio = total_direct_cost / final_price;
    if (costRatio > 0.8) {
      score -= 20;
    } else if (costRatio > 0.7) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  };

  const efficiencyScore = getEfficiencyScore();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">تحليل الربحية</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">التكلفة المباشرة</p>
            <p className="font-medium text-lg">
              {total_direct_cost.toLocaleString()} ريال
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">الربح</p>
            <p className="font-medium text-lg text-green-600">
              {profit.toLocaleString()} ريال
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">نسبة الربح</p>
            <div className="flex items-center gap-2">
              {profit_margin > (marketAverages?.avgProfit || 25) ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-yellow-500" />
              )}
              <p className="font-medium text-lg">
                {profitPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">مؤشر كفاءة التسعير</p>
            <p className="text-sm font-medium">{efficiencyScore}%</p>
          </div>
          <Progress value={efficiencyScore} className="h-2" />
        </div>

        {marketAverages && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">مقارنة مع السوق</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">متوسط سعر السوق</p>
                <p className="font-medium">
                  {marketAverages.avgPrice.toLocaleString()} ريال
                </p>
                <div className="mt-1">
                  {final_price > marketAverages.avgPrice ? (
                    <p className="text-xs text-yellow-600">
                      أعلى من متوسط السوق بنسبة{" "}
                      {(((final_price - marketAverages.avgPrice) / marketAverages.avgPrice) * 100).toFixed(1)}%
                    </p>
                  ) : (
                    <p className="text-xs text-green-600">
                      أقل من متوسط السوق بنسبة{" "}
                      {(((marketAverages.avgPrice - final_price) / marketAverages.avgPrice) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">متوسط هامش الربح في السوق</p>
                <p className="font-medium">{marketAverages.avgProfit}%</p>
                <div className="mt-1">
                  {profit_margin > marketAverages.avgProfit ? (
                    <p className="text-xs text-green-600">
                      أعلى من المتوسط بـ {(profit_margin - marketAverages.avgProfit).toFixed(1)}%
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-600">
                      أقل من المتوسط بـ {(marketAverages.avgProfit - profit_margin).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {efficiencyScore < 70 && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {efficiencyScore < 50
                ? "يوجد مجال كبير لتحسين كفاءة التسعير. راجع التكاليف وهامش الربح."
                : "يمكن تحسين كفاءة التسعير من خلال مراجعة هيكل التكاليف."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}