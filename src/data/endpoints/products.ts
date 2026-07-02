import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const productEndpoints: ApiEndpoint[] = [
  {
    id: 'products-list',
    name: 'List All Products',
    description: 'ดึงรายการสินค้าทั้งหมด รองรับการค้นหาและกรองข้อมูล',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/products',
    category: 'Products',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือ description', example: 'headphone' },
      { name: 'category', type: 'string', required: false, description: 'กรองตาม category ID', example: '1' },
      { name: 'minPrice', type: 'number', required: false, description: 'ราคาขั้นต่ำ', example: '10' },
      { name: 'maxPrice', type: 'number', required: false, description: 'ราคาสูงสุด', example: '200' },
      { name: 'inStock', type: 'boolean', required: false, description: 'กรองเฉพาะสินค้าที่มีในสต็อก', example: 'true' },
      { name: 'sort', type: 'string', required: false, description: 'เรียงตาม: price, name, createdAt', example: 'price' },
      { name: 'order', type: 'string', required: false, description: 'ทิศทาง: asc หรือ desc', example: 'asc' },
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า (สูงสุด 100)', example: '20' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการสินค้าพร้อม pagination' },
    ],
    notes: ['ตัวอย่าง: /api/products?search=keyboard', 'ตัวอย่าง: /api/products?minPrice=50&maxPrice=200&sort=price&order=asc'],
  },
  {
    id: 'products-get-by-id',
    name: 'Get Product by ID',
    description: 'ดึงข้อมูลสินค้าตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/products/:id',
    category: 'Products',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID (ลองใช้: 1, 2, 3, หรือ 4)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลสินค้า' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้านี้' },
    ],
  },
]
