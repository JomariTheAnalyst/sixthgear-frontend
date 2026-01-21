/**
 * First Gear Coffee Menu Data
 * Complete menu with categories, items, prices, and descriptions
 */

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  sizes?: {
    size: string
    price: number
  }[]
  image?: string
  popular?: boolean
  customizations?: string[]
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  items: MenuItem[]
}

export const menuData: MenuCategory[] = [
  {
    id: "hot-coffee",
    name: "Hot Coffee",
    description: "Freshly brewed espresso-based classics",
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "Rich, bold shot of pure coffee perfection",
        price: 80,
        sizes: [
          { size: "Single", price: 80 },
          { size: "Double", price: 120 },
        ],
        popular: true,
      },
      {
        id: "americano",
        name: "Americano",
        description: "Smooth espresso with hot water for a clean finish",
        price: 100,
        sizes: [
          { size: "12oz", price: 100 },
          { size: "16oz", price: 130 },
        ],
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and foam",
        price: 130,
        sizes: [
          { size: "12oz", price: 130 },
          { size: "16oz", price: 160 },
        ],
        popular: true,
      },
      {
        id: "latte",
        name: "Caffè Latte",
        description: "Creamy espresso with steamed milk and light foam",
        price: 140,
        sizes: [
          { size: "12oz", price: 140 },
          { size: "16oz", price: 170 },
        ],
        popular: true,
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Velvety microfoam over double espresso",
        price: 150,
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Rich chocolate blended with espresso and steamed milk",
        price: 160,
        sizes: [
          { size: "12oz", price: 160 },
          { size: "16oz", price: 190 },
        ],
      },
      {
        id: "caramel-macchiato",
        name: "Caramel Macchiato",
        description: "Vanilla-flavored latte with caramel drizzle",
        price: 170,
        sizes: [
          { size: "12oz", price: 170 },
          { size: "16oz", price: 200 },
        ],
      },
    ],
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    description: "Chilled perfection for hot days",
    items: [
      {
        id: "iced-americano",
        name: "Iced Americano",
        description: "Espresso over ice with cold water",
        price: 110,
        sizes: [
          { size: "16oz", price: 110 },
          { size: "22oz", price: 140 },
        ],
      },
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "Espresso with cold milk over ice",
        price: 150,
        sizes: [
          { size: "16oz", price: 150 },
          { size: "22oz", price: 180 },
        ],
        popular: true,
      },
      {
        id: "iced-hazelnut-latte",
        name: "Iced Hazelnut Latte",
        description: "Smooth espresso with creamy hazelnut and chilled milk",
        price: 170,
        sizes: [
          { size: "16oz", price: 170 },
          { size: "22oz", price: 200 },
        ],
        popular: true,
        image: "/images/firstgear-coffee/hazelnut.png",
      },
      {
        id: "cold-brew",
        name: "Cold Brew Delight",
        description: "Slow-steeped coffee with bold aroma and silky finish",
        price: 160,
        sizes: [
          { size: "16oz", price: 160 },
          { size: "22oz", price: 190 },
        ],
        popular: true,
        image: "/images/firstgear-coffee/coldbrew.png",
      },
      {
        id: "iced-mocha",
        name: "Iced Mocha Fusion",
        description:
          "Rich chocolate, fresh espresso, and whipped cream perfection",
        price: 170,
        sizes: [
          { size: "16oz", price: 170 },
          { size: "22oz", price: 200 },
        ],
        image: "/images/firstgear-coffee/mochafusion.png",
      },
      {
        id: "frappe",
        name: "Coffee Frappe",
        description: "Blended iced coffee with whipped cream",
        price: 180,
        sizes: [
          { size: "16oz", price: 180 },
          { size: "22oz", price: 210 },
        ],
      },
      {
        id: "iced-caramel-macchiato",
        name: "Iced Caramel Macchiato",
        description: "Vanilla latte over ice with caramel drizzle",
        price: 180,
        sizes: [
          { size: "16oz", price: 180 },
          { size: "22oz", price: 210 },
        ],
      },
    ],
  },
  {
    id: "non-coffee",
    name: "Non-Coffee",
    description: "Delicious alternatives for everyone",
    items: [
      {
        id: "hot-chocolate",
        name: "Hot Chocolate",
        description: "Rich, creamy chocolate with whipped cream",
        price: 130,
        sizes: [
          { size: "12oz", price: 130 },
          { size: "16oz", price: 160 },
        ],
      },
      {
        id: "iced-chocolate",
        name: "Iced Chocolate",
        description: "Chilled chocolate drink over ice",
        price: 140,
        sizes: [
          { size: "16oz", price: 140 },
          { size: "22oz", price: 170 },
        ],
      },
      {
        id: "matcha-latte",
        name: "Matcha Latte",
        description: "Premium Japanese green tea with steamed milk",
        price: 160,
        sizes: [
          { size: "Hot 12oz", price: 160 },
          { size: "Iced 16oz", price: 170 },
        ],
      },
      {
        id: "chai-latte",
        name: "Chai Latte",
        description: "Spiced tea with steamed milk",
        price: 150,
        sizes: [
          { size: "Hot 12oz", price: 150 },
          { size: "Iced 16oz", price: 160 },
        ],
      },
      {
        id: "fruit-smoothie",
        name: "Fruit Smoothie",
        description: "Blended fresh fruits with yogurt",
        price: 170,
        customizations: ["Mango", "Strawberry", "Mixed Berry"],
      },
      {
        id: "lemon-iced-tea",
        name: "Lemon Iced Tea",
        description: "Refreshing tea with fresh lemon",
        price: 100,
        sizes: [
          { size: "16oz", price: 100 },
          { size: "22oz", price: 130 },
        ],
      },
    ],
  },
  {
    id: "food-snacks",
    name: "Food & Snacks",
    description: "Perfect companions for your coffee",
    items: [
      {
        id: "croissant",
        name: "Butter Croissant",
        description: "Flaky, buttery French pastry",
        price: 80,
      },
      {
        id: "chocolate-croissant",
        name: "Chocolate Croissant",
        description: "Croissant filled with rich chocolate",
        price: 95,
      },
      {
        id: "blueberry-muffin",
        name: "Blueberry Muffin",
        description: "Moist muffin loaded with blueberries",
        price: 90,
      },
      {
        id: "banana-bread",
        name: "Banana Bread",
        description: "Homemade banana bread slice",
        price: 85,
      },
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        description: "Triple-decker with chicken, bacon, lettuce, tomato",
        price: 180,
      },
      {
        id: "tuna-sandwich",
        name: "Tuna Sandwich",
        description: "Fresh tuna salad on toasted bread",
        price: 150,
      },
      {
        id: "ham-cheese-panini",
        name: "Ham & Cheese Panini",
        description: "Grilled panini with ham and melted cheese",
        price: 160,
      },
      {
        id: "cookies",
        name: "Cookies (3pcs)",
        description: "Freshly baked chocolate chip cookies",
        price: 70,
      },
      {
        id: "brownies",
        name: "Fudge Brownies",
        description: "Rich, chocolatey brownies",
        price: 95,
      },
    ],
  },
]

// Helper function to get all popular items
export const getPopularItems = (): MenuItem[] => {
  const popularItems: MenuItem[] = []
  menuData.forEach((category) => {
    category.items.forEach((item) => {
      if (item.popular) {
        popularItems.push(item)
      }
    })
  })
  return popularItems
}

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `₱${price}`
}
