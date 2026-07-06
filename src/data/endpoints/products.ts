import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const productEndpoints: ApiEndpoint[] = [
  {
    id: 'products-list',
    name: 'Get All Products',
    description: 'ดึงรายการสินค้าทั้งหมด (250+ รายการ) รองรับค้นหา, กรองตามหมวดหมู่, ช่วงราคา, สต็อก, เรียงลำดับ และ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/products',
    category: 'Products',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือรายละเอียดสินค้า', example: 'headphone' },
      { name: 'category', type: 'string', required: false, description: 'กรองตาม categoryId: 1 (Electronics), 2 (Books), 3 (Accessories)', example: '1' },
      { name: 'minPrice', type: 'number', required: false, description: 'ราคาขั้นต่ำ (บาท)', example: '500' },
      { name: 'maxPrice', type: 'number', required: false, description: 'ราคาสูงสุด (บาท)', example: '5000' },
      { name: 'inStock', type: 'boolean', required: false, description: 'กรองตามสต็อก: true = มีสต็อก (stock > 0), false = หมดสต็อก (stock = 0)', example: 'true' },
      { name: 'sort', type: 'string', required: false, description: 'เรียงตาม: price, createdAt (default: createdAt)', example: 'price' },
      { name: 'order', type: 'string', required: false, description: 'ทิศทาง: asc หรือ desc (default: desc)', example: 'asc' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '12' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการสินค้า พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/products',
      'ตัวอย่าง filter ราคา: GET /api/products?minPrice=500&maxPrice=2000',
      'ตัวอย่าง sort ราคาถูก-แพง: GET /api/products?sort=price&order=asc',
      'ตัวอย่าง เฉพาะสินค้าในสต็อก: GET /api/products?inStock=true&limit=20',
      'categoryId: 1=Electronics, 2=Books, 3=Accessories',
    ],
  },
  {
    id: 'products-get-by-id',
    name: 'Get Product by ID',
    description: 'ดึงข้อมูลสินค้าแบบละเอียดจาก ID รวมถึงราคา, สต็อก, รูปภาพ และ SKU',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/products/:id',
    category: 'Products',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID เช่น 1, 2, ... 250' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลสินค้าแบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/products/1',
      'response มี: id, name, description, price, categoryId, stock, sku, images(array), createdAt',
    ],
  },
  {
    id: 'products-create',
    name: 'Create Product',
    description: 'เพิ่มสินค้าใหม่เข้าระบบ',
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
        { name: 'name', type: 'string', required: true, description: 'ชื่อสินค้า', example: 'Wireless Headphone Pro' },
        { name: 'price', type: 'number', required: true, description: 'ราคา (บาท)', example: '1990' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดสินค้า', example: 'หูฟังไร้สาย ตัดเสียงรบกวน' },
        { name: 'stock', type: 'number', required: false, description: 'จำนวนในสต็อก (default: 0)', example: '50' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มสินค้าสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name หรือ price' },
    ],
    notes: [
      'ตัวอย่าง: POST /api/products → {"name": "Wireless Headphone Pro", "price": 1990, "stock": 50}',
    ],
  },
  {
    id: 'products-update',
    name: 'Update Product',
    description: 'อัปเดตข้อมูลสินค้าทั้งหมด ต้องส่ง name และ price',
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
        { name: 'name', type: 'string', required: true, description: 'ชื่อสินค้า', example: 'Wireless Headphone Pro Max' },
        { name: 'price', type: 'number', required: true, description: 'ราคา (บาท)', example: '2490' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดสินค้า', example: 'รุ่นอัปเกรด ตัดเสียงรบกวนดีขึ้น' },
        { name: 'stock', type: 'number', required: false, description: 'จำนวนในสต็อก', example: '30' },
      ],
      note: 'PUT ต้องส่ง name และ price เสมอ field ที่ไม่ส่งจะถูก reset',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name หรือ price' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/products/1 → {"name": "Wireless Headphone Pro Max", "price": 2490, "stock": 30}',
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
        { name: 'name', type: 'string', required: false, description: 'ชื่อสินค้าใหม่', example: 'Wireless Headphone Pro' },
        { name: 'price', type: 'number', required: false, description: 'ราคาใหม่', example: '1790' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดใหม่' },
        { name: 'stock', type: 'number', required: false, description: 'จำนวน stock ใหม่', example: '100' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสินค้า' },
    ],
    notes: [
      'ตัวอย่างลดราคา: PATCH /api/products/1 → {"price": 990}',
      'ตัวอย่างเติม stock: PATCH /api/products/1 → {"stock": 200}',
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
    notes: [
      'ตัวอย่าง: DELETE /api/products/250',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
