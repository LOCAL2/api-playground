import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const todoEndpoints: ApiEndpoint[] = [
  {
    id: 'todos-list',
    name: 'Get All Todos',
    description: 'ดึงรายการ Todo ทั้งหมด รองรับกรองตามสถานะ (completed) และ priority — ประยุกต์ใช้ทำแอป Todo List, Task Manager, หรือ Kanban Board',
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
      'ประยุกต์ใช้: หน้า My Tasks, แสดง todo list บน dashboard, กรองงานตาม priority',
    ],
  },
  {
    id: 'todos-create',
    name: 'Create Todo',
    description: 'สร้าง Todo ใหม่ พร้อมกำหนด title, description, priority และ dueDate — ประยุกต์ใช้ทำฟอร์มเพิ่มงานใหม่ หรือ quick add ใน Productivity App',
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
      'ประยุกต์ใช้: ฟอร์มเพิ่มงาน, Quick add task, สร้าง Todo จาก voice command',
    ],
  },
  {
    id: 'todos-toggle',
    name: 'Toggle Todo Status',
    description: 'สลับสถานะ Todo ระหว่าง completed กับ incomplete ด้วย endpoint เดียว ไม่ต้องส่ง body — ประยุกต์ใช้กับ checkbox ในรายการ Todo',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/todos/:id/toggle',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของ Todo' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืน Todo ที่อัปเดตแล้ว โดย completed จะถูก toggle' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ Todo' },
    ],
    notes: [
      'ตัวอย่าง: PATCH /api/todos/1/toggle',
      'ไม่ต้องส่ง body ใดๆ',
      'ถ้า completed เป็น false จะกลายเป็น true และในทางกลับกัน',
      'ประยุกต์ใช้: กด checkbox เพื่อ mark งานว่าเสร็จหรือยังไม่เสร็จ',
    ],
  },
  {
    id: 'todos-delete',
    name: 'Delete Todo',
    description: 'ลบ Todo ออกจากระบบ — ประยุกต์ใช้กับปุ่มลบหรือ swipe to delete ใน Todo List',
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
      'ประยุกต์ใช้: ปุ่มลบใน Task Manager, swipe-to-delete ใน mobile app',
    ],
  },
]
