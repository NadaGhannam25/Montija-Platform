import { users, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const hashBuffer = (await scryptAsync(password, salt, 32)) as Buffer;
  return key === hashBuffer.toString("hex");
}

export async function registerUser(email: string, password: string, firstName: string, lastName: string, userType: "customer" | "family") {
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    throw new Error("البريد الإلكتروني مسجل بالفعل");
  }

  const hashedPassword = await hashPassword(password);
  const [user] = await db.insert(users).values({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    userType,
  }).returning();

  return user;
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  if (!user.password) throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");

  return user;
}
