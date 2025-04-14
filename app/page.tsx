import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calculator, BarChart3, RefreshCcw, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] via-white to-[#5B5AEC]/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDBoMTAwdjEwMEgxMDB6IiBmaWxsPSIjNUI1QUVDMDUiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto text-center mb-12 relative">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#5B5AEC] to-[#8584FF] opacity-20 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="relative group cursor-default">
          <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-[#5B5AEC] via-[#6C6DFF] to-[#5B5AEC] text-transparent bg-clip-text bg-300% animate-gradient">
            نَسيق
          </h1>
          <Sparkles className="absolute -top-8 -right-8 w-6 h-6 text-[#5B5AEC] opacity-0 group-hover:opacity-100 transition-all duration-700" />
        </div>
        
        <p className="text-2xl text-gray-600 font-medium relative inline-block">
          نظام تسعير وإدارة ذكي لمشاريع العبايات
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5B5AEC] scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></span>
        </p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(91,90,236,0.25)] border-0 relative overflow-hidden hover:shadow-[0_0_50px_-6px_rgba(91,90,236,0.35)] transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B5AEC]/5 via-transparent to-[#5B5AEC]/5 pointer-events-none"></div>
        
        <CardHeader className="text-center relative z-10 px-8 pt-10">
          <CardTitle className="text-3xl mb-8 text-[#5B5AEC] font-bold relative inline-block">
            ما هو نَسيق؟
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#5B5AEC]/20"></div>
          </CardTitle>
          <CardDescription className="text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto">
            نَسيق ليس مجرد حاسبة... هو نواة لنظام ERP ذكي، مصمم خصيصًا لقطاع العبايات.
            يسهّل عليك اتخاذ قرارات مبنية على أرقام فعلية، ويؤسس لإدارة متكاملة تغطي كل نواحي مشروعك –
            من التسعير، للمخزون، للإنتاج، وحتى التوسّع كمصنع أو براند شامل.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {[
            { icon: Calculator, title: "تسعير دقيق", desc: "احتساب التكلفة بدقة وضمان وجود هامش ربح واضح" },
            { icon: BarChart3, title: "تحليل ذكي", desc: "اتخاذ قرارات مبنية على تحليل فعلي وبيانات دقيقة" },
            { icon: RefreshCcw, title: "إدارة متكاملة", desc: "نظام متكامل يغطي كل نواحي مشروعك" }
          ].map((feature, i) => (
            <Card key={i} className="bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border-0 group">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B5AEC]/10 to-[#5B5AEC]/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-[#5B5AEC]" />
                </div>
                <CardTitle className="text-center text-lg font-bold text-gray-800">{feature.title}</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  {feature.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-6 pb-10">
          <Link href="/login" className="w-auto">
            <Button 
              size="lg" 
              className="text-lg px-16 py-7 bg-[#5B5AEC] hover:bg-[#5B5AEC]/90 shadow-lg hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                ابدأ الآن
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#5B5AEC] via-[#6C6DFF] to-[#5B5AEC] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </Link>
          <p className="text-sm text-gray-500 hover:text-[#5B5AEC] transition-colors duration-300">
            تم تطويره من قبل طلال الجهني
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}