import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const todoEndpoints: ApiEndpoint[] = [
  {
    id: 'todos-list',
    name: 'Get All Todos',
    description: 'ดึงรายการ Todo ทั้งหมด รองรับกรองตามสถานะ (completed) และ priority',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/todos',
    category: 'Todos',
    queryParameters: [
      { name: 'completed', type: 'boolean', required: false, description: 'กรองตามสถานะ: true = เสร็จแล้ว, false = ยังไม่เสร็จ', example: 'false' },
      { name: 'priority', type: 'string', required: false, description: 'กรองตาม priority: low, medium, high', example: 'high' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการ Todo' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/todos',
      'ตัวอย่าง filter งานยังไม่เสร็จ: GET /api/todos?completed=false',
      'ตัวอย่าง filter priority สูง: GET /api/todos?priority=high',
    ],
  },
  {
    id: 'todos-get-by-id',
    name: 'Get Todo by ID',
    description: 'ดึงข้อมูล Todo แบบละเอียดจาก ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของ Todo เช่น 1, 2, 3' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูล Todo' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ Todo' },
    ],
    notes: ['ตัวอย่าง: GET /api/todos/1'],
  },
  {
    id: 'todos-create',
    name: 'Create Todo',
    description: 'สร้าง Todo ใหม่ พร้อมกำหนด title, description, priority และ dueDate',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/todos',
    category: 'Todos',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่องาน (ต้องไม่ว่างเปล่า)', example: 'ทำรายงานวิชา Web Dev' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดเพิ่มเติม', example: 'สรุปเนื้อหา Chapter 5-7' },
        { name: 'priority', type: 'string', required: false, description: 'ระดับความสำคัญ: low, medium (default), high', example: 'high' },
        { name: 'dueDate', type: 'string', required: false, description: 'วันครบกำหนด (ISO 8601)', example: '2025-12-31' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้าง Todo สำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title หรือ title ว่างเปล่า' },
    ],
    notes: [
      'priority default คือ "medium" ถ้าไม่ส่งมา',
      'completed จะเป็น false เสมอตอนสร้าง',
    ],
  },
  {
    id: 'todos-update',
    name: 'Update Todo',
    description: 'อัปเดตข้อมูล Todo ทั้งหมด ต้องส่ง title',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของ Todo' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่องาน', example: 'ทำรายงาน' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียด' },
        { name: 'priority', type: 'string', required: false, description: 'low, medium, high', example: 'high' },
        { name: 'completed', type: 'boolean', required: false, description: 'สถานะ', example: 'false' },
        { name: 'dueDate', type: 'string', required: false, description: 'วันครบกำหนด (ISO 8601)', example: '2025-12-31' },
      ],
      note: 'PUT ต้องส่ง title เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ Todo' },
    ],
  },
  {
    id: 'todos-patch',
    name: 'Partially Update Todo',
    description: 'อัปเดตข้อมูล Todo บางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของ Todo' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: false, description: 'ชื่องานใหม่' },
        { name: 'description', type: 'string', required: false, description: 'รายละเอียดใหม่' },
        { name: 'priority', type: 'string', required: false, description: 'low, medium, high', example: 'high' },
        { name: 'completed', type: 'boolean', required: false, description: 'สถานะใหม่', example: 'true' },
        { name: 'dueDate', type: 'string', required: false, description: 'วันครบกำหนดใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ Todo' },
    ],
    notes: ['ตัวอย่าง: PATCH /api/todos/1 → {"title": "ชื่อใหม่"}'],
  },
  {
    id: 'todos-delete',
    name: 'Delete Todo',
    description: 'ลบ Todo ออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของ Todo' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ Todo' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/todos/1',
      'ไม่ต้องส่ง body ใดๆ',
      'response จะว่างเปล่า (204 No Content)',
    ],
  },
]
