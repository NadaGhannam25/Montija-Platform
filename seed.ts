import { db } from "./server/db";
import { products, categories, insertProductSchema } from "./shared/schema";
import { users } from "./shared/models/auth";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");
  
  // Create a mock family user if none exists
  const familyEmail = "family@example.com";
  let [family] = await db.select().from(users).where(eq(users.email, familyEmail));
  
  if (!family) {
    [family] = await db.insert(users).values({
      email: familyEmail,
      firstName: "عائلة",
      lastName: "الأصيل",
    }).returning();
  }

  // Check if products exist
  const existing = await db.select().from(products);
  if (existing.length === 0) {
    await db.insert(products).values([
      {
        familyId: family.id,
        name: "معمول مشكل",
        description: "علبة معمول مشكل بحشوات التمر والفستق والجوز.",
        price: "45.00",
        imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        category: "حلويات",
        rating: "4.8",
        salesCount: 150
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
        description: "عطر شرقي فواح بمزيج العود والعنبر.",
        price: "120.00",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        category: "عطور",
        rating: "4.9",
        salesCount: 80
      },
      {
        familyId: family.id,
        name: "باقة ورد هدايا",
        description: "باقة ورد طبيعي منسقة مع شوكولاتة فاخرة.",
        price: "150.00",
        imageUrl: "https://images.unsplash.com/photo-1563241598-6ceef6f2f211",
        category: "هدايا",
        rating: "5.0",
        salesCount: 20
      }
    ]);
    console.log("Seeded products");
  } else {
    console.log("Products already exist");
  }
}

seed().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(e => {
  console.error("Error seeding", e);
  process.exit(1);
});
