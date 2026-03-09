import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NoticeBanner() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div
      className="w-full bg-red-600 text-white"
      role="alert"
      data-testid="banner-notice"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 opacity-90" />
        <p className="text-sm font-medium leading-relaxed">
          {isAr
            ? "تنبيه: هذه المنصة مشروع تعليمي فقط، أُنشئت لتطوير المهارات التقنية لدى الطلاب وليست سوقاً حقيقياً. لا يتم تنفيذ أي طلبات فعلية أو إجراء مدفوعات حقيقية."
            : "Notice: This platform is for learning purposes only. It was created as a student project to develop technical skills and is not a real marketplace — no actual orders are fulfilled and no real payments are processed."}
        </p>
      </div>
    </div>
  );
}
