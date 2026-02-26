import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_ANSWERS: Record<string, string> = {
  "التوصيل": "يستغرق التوصيل عادة من 1 إلى 3 أيام عمل داخل المدينة.",
  "الدفع": "نقبل الدفع عبر مدى، Apple Pay، أو الدفع عند الاستلام.",
  "الشكاوى": "يمكنك رفع شكوى عبر صفحة طلباتي، وسنقوم بمراجعتها في أسرع وقت."
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot'|'user', text: string}[]>([
    { role: 'bot', text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن التوصيل، الدفع، أو الشكاوى.' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(p => [...p, { role: 'user', text }]);
    setInput("");

    setTimeout(() => {
      const match = Object.keys(PRESET_ANSWERS).find(k => text.includes(k));
      const response = match ? PRESET_ANSWERS[match] : "عذراً، لم أفهم سؤالك. يرجى اختيار أحد المواضيع: التوصيل، الدفع، الشكاوى.";
      setMessages(p => [...p, { role: 'bot', text: response }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] sm:w-[380px]"
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-orange-500 text-primary-foreground p-4 flex flex-row items-center justify-between">
                <div className="font-bold text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  المساعد الذكي
                </div>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-muted/30">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="p-3 bg-card border-t border-border/50 flex gap-2">
                <Input 
                  placeholder="اكتب رسالتك هنا..." 
                  className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/50"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                />
                <Button size="icon" className="rounded-full flex-shrink-0" onClick={() => handleSend(input)}>
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        size="icon" 
        className="w-14 h-14 rounded-full shadow-xl shadow-primary/40 bg-gradient-to-tr from-primary to-orange-500 hover:scale-110 transition-transform duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </div>
  );
}
