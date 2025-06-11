import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	// 1. ПРАВИЛЬНЫЙ ПОРЯДОК УДАЛЕНИЯ ДАННЫХ
	console.log('Начинаю полную очистку базы данных в правильном порядке...')
	// -> Сначала удаляем самые зависимые "детали" (товары в корзинах)
	await prisma.cartItem.deleteMany({})
	// -> Затем удаляем "варианты" товаров (например, пицца 30см, 40см)
	await prisma.productItem.deleteMany({})
	// -> Теперь можно удалять сами "корзины" и "заказы"
	await prisma.order.deleteMany({})
	await prisma.cart.deleteMany({})
	// -> ... и только теперь можно безопасно удалить сами "товары"
	await prisma.product.deleteMany({})
	// -> ... и "категории"
	await prisma.category.deleteMany({})

	// Очистим и остальные таблицы для полной чистоты
	await prisma.storyItem.deleteMany({})
	await prisma.story.deleteMany({})
	await prisma.ingredient.deleteMany({})
	console.log('Старые данные успешно удалены.')

	// 2. Создаем новые категории для ГИС-Центра
	console.log('Создаю новые категории...')
	const dataCategory = await prisma.category.create({
		data: {
			name: 'Готовые данные и карты',
		},
	})

	const servicesCategory = await prisma.category.create({
		data: {
			name: 'Аналитические услуги',
		},
	})
	console.log('Категории успешно созданы.')

	// 3. Создаем список новых товаров (услуг) с привязкой к категориям
	// Важно: в этом проекте у каждого "Продукта" должен быть хотя бы один "Вариант продукта" (ProductItem)
	console.log('Создаю новые товары и их варианты...')

	// ТОВАР 1
	const product1 = await prisma.product.create({
		data: {
			name: 'Спутниковые снимки высокого разрешения',
			imageUrl: '/products/gis-satellite.jpg',
			categoryId: dataCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product1.id, price: 15000 },
	})

	// ТОВАР 2
	const product2 = await prisma.product.create({
		data: {
			name: 'Топографическая карта региона N',
			imageUrl: '/products/gis-topo-map.jpg',
			categoryId: dataCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product2.id, price: 7500 },
	})

	// ТОВАР 3
	const product3 = await prisma.product.create({
		data: {
			name: 'Набор демографических данных',
			imageUrl: '/products/gis-demography.jpg',
			categoryId: dataCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product3.id, price: 25000 },
	})

	// ТОВАР 4
	const product4 = await prisma.product.create({
		data: {
			name: 'Карта коммерческой недвижимости',
			imageUrl: '/products/gis-real-estate.jpg',
			categoryId: dataCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product4.id, price: 22000 },
	})

	// ТОВАР 5
	const product5 = await prisma.product.create({
		data: {
			name: 'Анализ расположения торговой точки',
			imageUrl: '/products/gis-location-analysis.jpg',
			categoryId: servicesCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product5.id, price: 45000 },
	})

	// ТОВАР 6
	const product6 = await prisma.product.create({
		data: {
			name: 'Экологический мониторинг территории',
			imageUrl: '/products/gis-eco-monitoring.jpg',
			categoryId: servicesCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product6.id, price: 60000 },
	})

	// ТОВАР 7
	const product7 = await prisma.product.create({
		data: {
			name: 'Создание интерактивной веб-карты',
			imageUrl: '/products/gis-web-map.jpg',
			categoryId: servicesCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product7.id, price: 35000 },
	})

	// ТОВАР 8
	const product8 = await prisma.product.create({
		data: {
			name: 'Консультация ГИС-специалиста',
			imageUrl: '/products/gis-consulting.jpg',
			categoryId: servicesCategory.id,
		},
	})
	await prisma.productItem.create({
		data: { productId: product8.id, price: 5000 },
	})

	console.log('Все готово! База данных успешно заполнена новыми данными.')
}

main()
	.catch(e => {
		console.error('Произошла ошибка:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
