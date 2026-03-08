import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Code2, Globe, BookOpen, Cpu, Star, Heart, Users, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function About() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const content = {
    ar: {
      heroTitle: "من نحن",
      heroBadge: "قصتنا وفريقنا",
      heroDesc: "منتجة هي منصة تجارة إلكترونية متكاملة صُممت بعناية لدعم الأسر المنتجة المحلية وتمكينها من الوصول إلى عملاء من جميع أنحاء المملكة.",
      platformTitle: "عن المنصة",
      platformDesc1: "تأسست منتجة خلال برنامج هندسة الأوامر (Prompt Engineering Program) الذي نظّمته الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)، وهو برنامج متخصص يهدف إلى تطوير كفاءات المطورين والمصممين في توظيف تقنيات الذكاء الاصطناعي لبناء منتجات رقمية مبتكرة.",
      platformDesc2: "انطلقت الفكرة من إيمان عميق بأن الأسر المنتجة تمتلك منتجات استثنائية تستحق وصولاً أوسع وسوقاً رقمية متطورة. ولذلك بُنيت المنصة لتكون جسراً يربط بين المنتِج والمستهلك، مع تجربة مستخدم احترافية وتصميم عصري يعكس هوية المنتجات المحلية.",
      sdaiaLabel: "برنامج سدايا للذكاء الاصطناعي",
      teamTitle: "فريق التطوير",
      teamDesc: "صُنعت منتجة بشغف وإبداع من قِبل فريق من المطورين المؤمنين بأثر التقنية في دعم الاقتصاد المحلي.",
      skillsLabel: "المهارات والتقنيات",
      passionLabel: "الشغف",
      devs: [
        {
          name: "ندى المطيري",
          role: "مطورة متكاملة · مصممة UI/UX · متخصصة نظم معلومات",
          avatar: "ن",
          specialtyIcon: Layers,
          specialty: "Full-Stack & UI/UX",
          bio: "متخصصة في نظم المعلومات ومطورة متكاملة (Full-Stack Developer) ومصممة واجهات مستخدم (UI/UX). تؤمن ندى بأن التقنية أداةٌ للتأثير الإيجابي في المجتمعات، وتعمل باستمرار على بناء منصات رقمية عصرية تجمع بين الجمال البصري والأداء العالي. تمتلك خبرة واسعة في تصميم تجارب مستخدم سلسة وبناء تطبيقات ويب متكاملة.",
          skills: ["React & TypeScript", "Node.js & Express", "UI/UX Design", "نظم المعلومات", "قواعد البيانات", "Tailwind CSS"],
          passion: "بناء منتجات رقمية ذات أثر حقيقي تدعم المجتمعات والأعمال.",
        },
        {
          name: "لطيفة العمير",
          role: "مطورة برمجيات · مساهمة في تطوير المنصة",
          avatar: "ل",
          specialtyIcon: Sparkles,
          specialty: "Software Development",
          bio: "مطورة برمجيات متحمسة تؤمن بقوة التعاون والتعلم المستمر. أسهمت لطيفة في تطوير منصة منتجة ببصمة واضحة في كتابة الكود وتحسين التجربة الرقمية، وتسعى دائماً إلى تطوير حلول تقنية مبتكرة تخدم المستخدم وتلبي احتياجاته بكفاءة وإبداع.",
          skills: ["Full-Stack Development", "JavaScript", "تصميم المنتجات", "حل المشكلات التقنية", "التعاون الإبداعي", "الذكاء الاصطناعي"],
          passion: "تطوير حلول تقنية مبتكرة تخدم المجتمع وتُحدث فرقاً حقيقياً.",
        },
      ],
    },
    en: {
      heroTitle: "About Us",
      heroBadge: "Our Story & Team",
      heroDesc: "Muntija is a full-featured e-commerce platform carefully designed to empower local productive families and connect them with customers across the Kingdom.",
      platformTitle: "About the Platform",
      platformDesc1: "Muntija was developed during the Prompt Engineering Program organized by the Saudi Data and Artificial Intelligence Authority (SDAIA) — a specialized program aimed at developing developers' and designers' capabilities in leveraging AI technologies to build innovative digital products.",
      platformDesc2: "The idea was born from a deep belief that productive families possess exceptional products deserving wider reach and a sophisticated digital marketplace. The platform was built to be a bridge between producer and consumer, with a professional user experience and a modern design that reflects the identity of local Saudi products.",
      sdaiaLabel: "SDAIA AI Program",
      teamTitle: "Development Team",
      teamDesc: "Muntija was crafted with passion and creativity by a team of developers who believe in technology's power to support the local economy.",
      skillsLabel: "Skills & Technologies",
      passionLabel: "Passion",
      devs: [
        {
          name: "Nada Almutairi",
          role: "Full-Stack Developer · UI/UX Designer · Information Systems Specialist",
          avatar: "N",
          specialtyIcon: Layers,
          specialty: "Full-Stack & UI/UX",
          bio: "An Information Systems specialist, Full-Stack Developer, and UI/UX Designer who is deeply passionate about building modern, user-friendly digital platforms. Nada believes technology is a tool for positive community impact and continuously works on creating impactful solutions that support communities and businesses. She brings expertise spanning intuitive user experience design and end-to-end web application development.",
          skills: ["React & TypeScript", "Node.js & Express", "UI/UX Design", "Information Systems", "Databases", "Tailwind CSS"],
          passion: "Building digital products with real impact that support communities and businesses.",
        },
        {
          name: "Latifah Alomair",
          role: "Software Developer · Platform Contributor",
          avatar: "L",
          specialtyIcon: Sparkles,
          specialty: "Software Development",
          bio: "An enthusiastic software developer who believes in the power of collaboration and continuous learning. Latifah made a clear contribution to building Muntija's platform through her coding work and improving the digital experience. She always strives to develop innovative technical solutions that serve users efficiently and creatively.",
          skills: ["Full-Stack Development", "JavaScript", "Product Design", "Problem Solving", "Creative Collaboration", "Artificial Intelligence"],
          passion: "Developing innovative technical solutions that serve the community and make a real difference.",
        },
      ],
    },
  };

  const c = isAr ? content.ar : content.en;

  return (
    <div className="min-h-screen pb-20">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-20 pb-24">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div {...fadeIn} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20"
          >
            <Heart className="w-4 h-4 fill-primary" />
            {c.heroBadge}
          </motion.div>
          <motion.h1 {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            {c.heroTitle}
          </motion.h1>
          <motion.p {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {c.heroDesc}
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-16">

        {/* ── Platform Story ────────────────────────────────────── */}
        <motion.section {...fadeIn} transition={{ duration: 0.5 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-5 border border-primary/20">
                <BookOpen className="w-4 h-4" />
                {c.platformTitle}
              </div>
              <p className="text-foreground leading-relaxed text-lg mb-6">{c.platformDesc1}</p>
              <p className="text-muted-foreground leading-relaxed">{c.platformDesc2}</p>
            </div>
            <div>
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Cpu className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 font-semibold uppercase tracking-wide">{c.sdaiaLabel}</p>
                    <p className="font-black text-lg">{isAr ? "سدايا" : "SDAIA"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Code2, label: isAr ? "مطور بالكامل" : "Fully Coded", val: "100%" },
                    { icon: Star,  label: isAr ? "منتجات"       : "Products",    val: "10+" },
                    { icon: Users, label: isAr ? "أسر منتجة"    : "Families",    val: "1+" },
                  ].map(item => (
                    <div key={item.label} className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                      <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="font-black text-xl text-foreground">{item.val}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Team ──────────────────────────────────────────────── */}
        <motion.section {...fadeIn} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 border border-primary/20">
              <Users className="w-4 h-4" />
              {c.teamTitle}
            </div>
            <h2 className="text-4xl font-black mb-3">{c.teamTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{c.teamDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {c.devs.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                data-testid={`card-dev-${i + 1}`}
              >
                {/* ── Card Header — uses site primary palette ── */}
                <div className="bg-gradient-to-br from-primary/12 to-primary/4 border-b border-primary/10 px-7 py-6 flex items-center gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl shadow-md shadow-primary/25 shrink-0">
                    {dev.avatar}
                  </div>
                  {/* Name & role */}
                  <div className="min-w-0">
                    <h3 className="font-black text-xl text-foreground leading-tight">{dev.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-snug">{dev.role}</p>
                    {/* Specialty chip */}
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                      <dev.specialtyIcon className="w-3 h-3" />
                      {dev.specialty}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="px-7 py-6 space-y-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">{dev.bio}</p>

                  {/* Skills */}
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      {c.skillsLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full bg-muted text-foreground border border-border/60 font-medium text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Passion */}
                  <div className="pt-4 border-t border-border/50 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{dev.passion}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <motion.section {...fadeIn} transition={{ duration: 0.5 }} className="pb-8">
          <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-3xl border border-primary/20 p-12 text-center">
            <Globe className="w-12 h-12 text-primary mx-auto mb-5" />
            <h3 className="text-3xl font-black mb-4">
              {isAr ? "ابدأ رحلتك معنا" : "Start Your Journey With Us"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              {isAr
                ? "اكتشف مئات المنتجات المحلية من أسر منتجة بأيدٍ ماهرة وقلوب مخلصة."
                : "Discover hundreds of local products from productive families crafted with skilled hands and sincere hearts."}
            </p>
            <Button asChild size="lg" className="rounded-full px-10 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              <Link href="/">{isAr ? "تصفح المنتجات" : "Browse Products"}</Link>
            </Button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
