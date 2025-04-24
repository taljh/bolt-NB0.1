import { getAnalyticsData } from "@/components/dashboard/analytics/AnalyticsServer";
import AnalyticsClient from "@/components/dashboard/analytics/AnalyticsClient";

export default async function AnalyticsPage() {
  const products = await getAnalyticsData();
  
  return <AnalyticsClient products={products} />;
}
