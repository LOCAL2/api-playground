import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const studentEndpoints: ApiEndpoint[] = [
  {
    id: 'students-list',
    name: 'Get All Students',
    description: 'ดึงรายการนักศึกษาทั้งหมด รองรับการค้นหาด้วยชื่อหรือรหัสนักศึกษา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/students',
    category: 'Students',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือรหัสนักศึกษา', example: 'วรเดช' },
      { name: 'gender', type: 'string', required: false, description: 'กรองตามเพศ: ชาย หรือ หญิง', example: 'ชาย' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการนักศึกษาทั้งหมด' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/students',
      'ตัวอย่าง search ด้วยชื่อ: GET /api/students?search=วรเดช',
      'ตัวอย่าง search ด้วยรหัส: GET /api/students?search=6931901001',
    ],
  },
  {
    id: 'students-get-by-id',
    name: 'Get Student by ID',
    description: 'ดึงข้อมูลนักศึกษาตามรหัสนักศึกษา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'รหัสนักศึกษา (เช่น 6931901001)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลนักศึกษา' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
  },
  {
    id: 'students-create',
    name: 'Create Student',
    description: 'เพิ่มข้อมูลนักศึกษาใหม่',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/students',
    category: 'Students',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'รหัสนักศึกษา', example: '6931901016' },
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล (พร้อมคำนำหน้า)', example: 'นายสมชาย ใจดี' },
        { name: 'gender', type: 'string', required: false, description: 'เพศ: ชาย หรือ หญิง', example: 'ชาย' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มนักศึกษาสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ' },
      { code: 409, meaning: 'Conflict', description: 'รหัสนักศึกษานี้มีอยู่แล้ว' },
    ],
  },
  {
    id: 'students-update',
    name: 'Update Student',
    description: 'อัปเดตข้อมูลนักศึกษาทั้งหมด',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'รหัสนักศึกษา' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล', example: 'นาย วรเดช พันธ์พืช' },
        { name: 'gender', type: 'string', required: false, description: 'เพศ: ชาย หรือ หญิง', example: 'ชาย' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ถูกต้อง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
  },
  {
    id: 'students-patch',
    name: 'Partially Update Student',
    description: 'อัปเดตข้อมูลนักศึกษาบางส่วน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'รหัสนักศึกษา' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'ชื่อ-นามสกุลใหม่' },
        { name: 'gender', type: 'string', required: false, description: 'เพศใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
  },
  {
    id: 'students-delete',
    name: 'Delete Student',
    description: 'ลบข้อมูลนักศึกษา',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'รหัสนักศึกษา' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
  },
]
