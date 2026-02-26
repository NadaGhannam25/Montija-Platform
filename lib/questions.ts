export type Category = "ثقافي" | "طبخ" | "فقه";
export interface Question { id: string; text: string; options: string[]; correctIndex: number; }
export const questionsDB: Record<Category, Question[]> = {
  "ثقافي": [
    { id: "c1", text: "ما هي عاصمة الدولة الأموية؟", options: ["بغداد", "دمشق", "القاهرة", "المدينة المنورة"], correctIndex: 1 },
    // ... باقي الأسئلة
  ],
  "طبخ": [
    { id: "k1", text: "ما هو المكون الرئيسي في طبق الحمص؟", options: ["الفول", "الحمص", "العدس", "البازلاء"], correctIndex: 1 },
    // ... باقي الأسئلة
  ],
  "فقه": [
    { id: "f1", text: "ما هو الركن الثاني من أركان الإسلام؟", options: ["الزكاة", "الصوم", "إقام الصلاة", "الحج"], correctIndex: 2 },
    // ... باقي الأسئلة
  ]
};
export function getRandomQuestions(category: Category, count: number = 6) {
  return [...questionsDB[category]].sort(() => 0.5 - Math.random()).slice(0, count);
}
