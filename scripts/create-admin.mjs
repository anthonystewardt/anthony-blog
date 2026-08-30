import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import readline from "node:readline/promises";
import process from "node:process";

const prisma = new PrismaClient();
const input = readline.createInterface({ input: process.stdin, output: process.stdout });

async function askHidden(label) {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    return input.question(label);
  }
  process.stdout.write(label);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    const onData = (key) => {
      if (key === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdin.off("data", onData);
        reject(new Error("Operación cancelada"));
        return;
      }
      if (key === "\r" || key === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (key === "\u007f") {
        if (value.length) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      value += key;
      process.stdout.write("•");
    };
    process.stdin.on("data", onData);
  });
}

try {
  console.log("\nCrear o actualizar administrador\n");
  const name = (await input.question("Nombre: ")).trim();
  const email = (await input.question("Email: ")).trim().toLowerCase();
  const password = await askHidden("Contraseña (mínimo 12 caracteres): ");
  const confirmation = await askHidden("Confirmar contraseña: ");

  if (name.length < 2) throw new Error("El nombre debe tener al menos 2 caracteres.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("El email no es válido.");
  if (password.length < 12) throw new Error("La contraseña debe tener al menos 12 caracteres.");
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");

  const hashedPassword = await bcrypt.hash(password, 12);
  const existing = await prisma.user.findUnique({ where: { email } });
  const admin = existing
    ? await prisma.user.update({ where: { email }, data: { name, password: hashedPassword, role: "ADMIN" } })
    : await prisma.user.create({ data: { name, email, password: hashedPassword, role: "ADMIN" } });

  console.log(`\nAdministrador ${existing ? "actualizado" : "creado"}: ${admin.email}`);
  console.log("Ya puedes iniciar sesión en /login.\n");
} catch (error) {
  console.error(`\nNo se creó el administrador: ${error instanceof Error ? error.message : "Error desconocido"}\n`);
  process.exitCode = 1;
} finally {
  input.close();
  await prisma.$disconnect();
}
