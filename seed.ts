import { db } from "./server/db";
import { products, reviews } from "./shared/schema";
import { users } from "./shared/models/auth";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");
  
  // Clear existing products and reviews
  await db.delete(reviews);
  await db.delete(products);
  
  // Create a mock family user if none exists
  const familyEmail = "family@example.com";
  let [family] = await db.select().from(users).where(eq(users.email, familyEmail));
  
  if (!family) {
    [family] = await db.insert(users).values({
      email: familyEmail,
      password: "", // placeholder
      userType: "family",
      firstName: "عائلة",
      lastName: "الأصيل",
    }).returning();
  }

  // Create a customer user for reviews
  const customerEmail = "customer@example.com";
  let [customer] = await db.select().from(users).where(eq(users.email, customerEmail));
  
  if (!customer) {
    [customer] = await db.insert(users).values({
      email: customerEmail,
      password: "", // placeholder
      userType: "customer",
      firstName: "محمد",
      lastName: "العلي",
    }).returning();
  }

  // Always reseed
  {
    await db.insert(products).values([
      {
        familyId: family.id,
        name: "كوكيز (Cookies)",
        description: "كوكيز طازج بنكهة الشوكولاتة والجوز، مصنوع بأجود المكونات الطبيعية.",
        price: "45.00",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
        category: "مخبوزات",
        rating: "4.8",
        salesCount: 250
      },
      {
        familyId: family.id,
        name: "ورق عنب",
        description: "ورق عنب حامض حلو بدبس الرمان محضر يومياً.",
        price: "60.00",
        imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975",
        category: "موالح",
        rating: "4.5",
        salesCount: 300
      },
      {
        familyId: family.id,
        name: "عطر ليالي",
        description: "عطر شرقي فواح بمزيج العود والعنبر الفاخر، يدوم طويلاً.",
        price: "120.00",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        category: "عطور",
        rating: "4.9",
        salesCount: 180
      },
      {
        familyId: family.id,
        name: "باقة الورد الفاخرة",
        description: "باقة ورد جميلة منسقة بعناية مع شوكولاتة بلجيكية فاخرة وعطر عود.",
        price: "150.00",
        imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7",
        category: "هدايا",
        rating: "5.0",
        salesCount: 95
      },
      {
        familyId: family.id,
        name: "تمر معمول",
        description: "معمول محشي بالتمر الجودة العالية، مع لمسة من الزبدة الطازجة.",
        price: "50.00",
        imageUrl: "https://images.unsplash.com/photo-1599599810694-b5ac4dd01eae",
        category: "حلويات",
        rating: "4.7",
        salesCount: 200
      },
      {
        familyId: family.id,
        name: "منتج يدوي - حقيبة من الكتان",
        description: "حقيبة يدوية مصنوعة من الكتان الطبيعي، تصميم عصري وعملي.",
        price: "85.00",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
        category: "منتجات يدوية",
        rating: "4.6",
        salesCount: 60
      }
    ]);
  console.log("Seeded products");

  // Get the products
  const allProducts = await db.select().from(products);
  
  // Add sample reviews
  if (customer && allProducts.length > 0) {
    await db.insert(reviews).values([
      {
        productId: allProducts[0].id,
        userId: customer.id,
        rating: 5,
        comment: "منتج ممتاز جداً! الطعم رائع والجودة عالية جداً، حتماً سأطلب مرة أخرى."
      },
      {
        productId: allProducts[1].id,
        userId: customer.id,
        rating: 5,
        comment: "طازج وألذ مما توقعت! الأسرة المنتجة تستحق التقدير."
      },
      {
        productId: allProducts[2].id,
        userId: customer.id,
        rating: 4,
        comment: "رائحة عطرة وتدوم طويلاً. بسعر معقول."
      },
      {
        productId: allProducts[3].id,
        userId: customer.id,
        rating: 5,
        comment: "هدية مثالية! وصلت بسرعة وفي حالة ممتازة."
      }
    ]);
    console.log("Seeded reviews");
  }
}
}

seed().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(e => {
  console.error("Error seeding", e);
  process.exit(1);
});
