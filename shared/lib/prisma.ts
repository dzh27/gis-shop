import { PrismaClient } from '@prisma/client'

// Этот код предотвращает создание множества подключений в среде разработки
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

// Создаем один-единственный экземпляр PrismaClient для всего приложения
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}