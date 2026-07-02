import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const userEndpoints: ApiEndpoint[] = [
  {
    id: 'users-list',
    name: 'Get All Users',
    description: 'ดึงรายการผู้ใช้ทั้งหมด รองรับการค้นหาและ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users',
    category: 'Users',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรืออีเมล', example: 'john' },
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการผู้ใช้ทั้งหมด' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/users',
      'ตัวอย่าง search: GET /api/users?search=john',
    ],
  },
  {
    id: 'users-get-by-id',
    name: 'Get User by ID',
    description: 'ดึงข้อมูลผู้ใช้ตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID (ลองใช้: 1, 2, หรือ 3)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลผู้ใช้' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
  },
  {
    id: 'users-create',
    name: 'Create User',
    description: 'สร้างผู้ใช้ใหม่',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/users',
    category: 'Users',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล', example: 'John Doe' },
        { name: 'email', type: 'string', required: true, description: 'อีเมล (ต้องไม่ซ้ำ)', example: 'john@example.com' },
        { name: 'password', type: 'string', required: true, description: 'รหัสผ่าน (อย่างน้อย 8 ตัว)', example: 'password123' },
        { name: 'role', type: 'string', required: false, description: 'user หรือ admin (default: user)', example: 'user' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้างผู้ใช้สำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบหรือไม่ถูกต้อง' },
      { code: 409, meaning: 'Conflict', description: 'อีเมลนี้มีในระบบแล้ว' },
    ],
  },
  {
    id: 'users-update',
    name: 'Update User',
    description: 'อัปเดตข้อมูลผู้ใช้ทั้งหมด',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล', example: 'Jane Doe' },
        { name: 'email', type: 'string', required: true, description: 'อีเมล', example: 'jane@example.com' },
        { name: 'avatar', type: 'string', required: false, description: 'URL รูปโปรไฟล์', example: 'https://i.pravatar.cc/150?u=jane' },
        { name: 'bio', type: 'string', required: false, description: 'คำอธิบายตัวเอง', example: 'นักพัฒนา Full Stack' },
        { name: 'role', type: 'string', required: false, description: 'user หรือ admin', example: 'user' },
      ],
      note: 'PUT ต้องส่ง name และ email เสมอ field ที่ไม่ส่งจะถูก reset เป็นค่าว่าง',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name หรือ email' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
    notes: [
      `ตัวอย่าง request body:\n{\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "avatar": "https://i.pravatar.cc/150?u=jane",\n  "bio": "นักพัฒนา Full Stack",\n  "role": "user"\n}`,
      'PUT แทนที่ข้อมูลทั้งหมด ต้องส่งทุก field ที่ต้องการเก็บไว้',
    ],
  },
  {
    id: 'users-patch',
    name: 'Partially Update User',
    description: 'อัปเดตข้อมูลผู้ใช้บางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'ชื่อใหม่', example: 'Jane Doe' },
        { name: 'email', type: 'string', required: false, description: 'อีเมลใหม่', example: 'jane@example.com' },
        { name: 'avatar', type: 'string', required: false, description: 'URL รูปโปรไฟล์ใหม่', example: 'https://i.pravatar.cc/150?u=jane' },
        { name: 'bio', type: 'string', required: false, description: 'คำอธิบายตัวเองใหม่', example: 'นักพัฒนา Full Stack' },
        { name: 'role', type: 'string', required: false, description: 'role ใหม่', example: 'admin' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน ไม่ต้องส่งครบทุก field',
    },
    notes: [
      `ตัวอย่างเปลี่ยนเฉพาะชื่อ:\n{\n  "name": "Jane Doe"\n}`,
      `ตัวอย่างเปลี่ยนหลาย field:\n{\n  "email": "newemail@example.com",\n  "bio": "นักพัฒนา Full Stack"\n}`,
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ถูกต้อง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
  },
  {
    id: 'users-delete',
    name: 'Delete User',
    description: 'ลบผู้ใช้ออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
  },
]
