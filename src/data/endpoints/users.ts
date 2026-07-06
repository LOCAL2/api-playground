import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const userEndpoints: ApiEndpoint[] = [
  {
    id: 'users-list',
    name: 'Get All Users',
    description: 'ดึงรายการผู้ใช้ทั้งหมด (50 คน) รองรับค้นหา, เรียงลำดับ และ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users',
    category: 'Users',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรืออีเมล', example: 'alice' },
      { name: 'sort', type: 'string', required: false, description: 'เรียงตาม field: id, name, email, createdAt (default: id)', example: 'name' },
      { name: 'order', type: 'string', required: false, description: 'ทิศทาง: asc หรือ desc (default: asc)', example: 'asc' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการผู้ใช้ (ไม่มี password field) พร้อม pagination' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/users',
      'ตัวอย่าง search: GET /api/users?search=alice',
      'ตัวอย่าง เรียงตามชื่อ: GET /api/users?sort=name&order=asc',
      'ตัวอย่าง pagination: GET /api/users?page=1&limit=10',
      'password field จะถูกซ่อนเสมอใน response',
    ],
  },
  {
    id: 'users-get-by-id',
    name: 'Get User by ID',
    description: 'ดึงข้อมูลผู้ใช้แบบละเอียดตาม ID รวมถึง avatar, bio และ role',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID เช่น 1, 2, ... 50' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลผู้ใช้ (ไม่มี password field)' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/users/1',
      'ตัวอย่าง admin user: GET /api/users/1 (Alice Johnson, role: admin)',
    ],
  },
  {
    id: 'users-create',
    name: 'Create User',
    description: 'สร้างผู้ใช้ใหม่ด้วย name, email, password และ role',
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
        { name: 'email', type: 'string', required: true, description: 'อีเมล (ต้องไม่ซ้ำในระบบ)', example: 'john@example.com' },
        { name: 'password', type: 'string', required: true, description: 'รหัสผ่าน', example: 'password123' },
        { name: 'role', type: 'string', required: false, description: '"user" หรือ "admin" (default: user)', example: 'user' },
        { name: 'avatar', type: 'string', required: false, description: 'URL รูปโปรไฟล์', example: 'https://i.pravatar.cc/150?u=john' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้างผู้ใช้สำเร็จ คืนข้อมูล user (ไม่มี password)' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ' },
      { code: 409, meaning: 'Conflict', description: 'อีเมลนี้มีในระบบแล้ว' },
    ],
    notes: [
      'password จะถูก hash ก่อนบันทึก ไม่เก็บ plain text',
      'ตัวอย่าง: POST /api/users → {"name": "John Doe", "email": "john@example.com", "password": "password123"}',
    ],
  },
  {
    id: 'users-update',
    name: 'Update User',
    description: 'อัปเดตข้อมูลผู้ใช้ทั้งหมด ต้องส่ง name และ email',
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
        { name: 'bio', type: 'string', required: false, description: 'คำอธิบายตัวเอง', example: 'Full Stack Developer' },
        { name: 'role', type: 'string', required: false, description: '"user" หรือ "admin"', example: 'user' },
      ],
      note: 'PUT แทนที่ข้อมูลทั้งหมด ต้องส่ง name และ email เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name หรือ email' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/users/1 → {"name": "Jane Doe", "email": "jane@example.com"}',
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
        { name: 'bio', type: 'string', required: false, description: 'bio ใหม่', example: 'Full Stack Developer' },
        { name: 'role', type: 'string', required: false, description: 'role ใหม่', example: 'admin' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบผู้ใช้' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยนเฉพาะ bio: PATCH /api/users/1 → {"bio": "Full Stack Developer"}',
      'ตัวอย่างเปลี่ยน avatar: PATCH /api/users/1 → {"avatar": "https://..."}',
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
    notes: [
      'ตัวอย่าง: DELETE /api/users/50',
      'ไม่ต้องส่ง body ใดๆ response จะว่าง (204 No Content)',
    ],
  },
]
