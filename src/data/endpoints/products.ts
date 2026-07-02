import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const productEndpoints: ApiEndpoint[] = [
  {
    id: 'products-list',
    name: 'Get All Products',
    description: 'ดึงรายการสินค้าทั้งหมด รองรับการค้นหาและ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/products',
    category: 'Products',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อสินค้า', example: 'headphone' },
      { name: 'minPrice', type: 'number', required: false, description: 'ราคาขั้นต่ำ', example: '100' },
      { name: 'maxPrice', type: 'number', required: false, description: 'ราคาสูงสุด', example: '5000' },
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการสินค้าทั้งหมด' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/products',
      'ตัวอย่าง search: GET /api/products?search=headphone',
      'ตัวอย่าง filter ราคา: GET /api/products?minPrice=100&maxPrice=5000',
    ],
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
      { name: 'id', type: 'string', required: true, description: 'Product ID (ลองใช้: 1, 2, หรือ 3)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลสินค้า' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
  },
  {
    id: 'products-create',
    name: 'Create Product',
    description: 'เพิ่มสินค้าใหม่',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/products',
    category: 'Products',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อสินค้า', example: 'Wireless Headphone' },
        { name: 'price', type: 'number', required: true, description: 'ราคา', example: '1990' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดสินค้า', example: 'หูฟังไร้สาย ตัดเสียงรบกวน' },
        { name: 'stock', type: 'integer', required: false, description: 'จำนวนในสต็อก', example: '50' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มสินค้าสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ' },
    ],
  },
  {
    id: 'products-update',
    name: 'Update Product',
    description: 'อัปเดตข้อมูลสินค้าทั้งหมด',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/products/:id',
    category: 'Products',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อสินค้า', example: 'Wireless Headphone Pro' },
        { name: 'price', type: 'number', required: true, description: 'ราคา', example: '2490' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดสินค้า' },
        { name: 'stock', type: 'integer', required: false, description: 'จำนวนในสต็อก', example: '30' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ถูกต้อง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
  },
  {
    id: 'products-patch',
    name: 'Partially Update Product',
    description: 'อัปเดตสินค้าบางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/products/:id',
    category: 'Products',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'price', type: 'number', required: false, description: 'ราคาใหม่', example: '1790' },
        { name: 'stock', type: 'integer', required: false, description: 'จำนวน stock ใหม่', example: '100' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
  },
  {
    id: 'products-delete',
    name: 'Delete Product',
    description: 'ลบสินค้าออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/products/:id',
    category: 'Products',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
  },
]
