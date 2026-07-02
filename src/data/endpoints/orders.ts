import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const orderEndpoints: ApiEndpoint[] = [
  {
    id: 'orders-list',
    name: 'List My Orders',
    description: 'ดึงรายการ order ของตัวเอง (ถ้าเป็น admin จะเห็น order ทั้งหมด)',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/orders',
    category: 'Orders',
    queryParameters: [
      { name: 'status', type: 'string', required: false, description: 'กรองตามสถานะ: pending, processing, shipped, delivered, cancelled', example: 'pending' },
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (ได้จาก POST /api/auth/login)' },
    ],
    requiresAuth: true,
    authNote: 'ต้อง login ก่อน ใช้ token จาก POST /api/auth/login',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการ order' },
      { code: 401, meaning: 'Unauthorized', description: 'ไม่ได้ส่ง token หรือ token ไม่ถูกต้อง' },
    ],
  },
  {
    id: 'orders-get-by-id',
    name: 'Get Order by ID',
    description: 'ดึงรายละเอียด order ตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/orders/:id',
    category: 'Orders',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Order ID (ลองใช้: 1, 2, หรือ 3)' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูล order' },
      { code: 401, meaning: 'Unauthorized', description: 'ไม่ได้ส่ง token' },
      { code: 403, meaning: 'Forbidden', description: 'ไม่ใช่ order ของตัวเอง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ order' },
    ],
  },
]
