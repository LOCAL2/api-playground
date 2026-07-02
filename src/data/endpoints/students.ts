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
      'ตัวอย่าง search ด้วยรหัส: GET /api/students?search=69319010014',
      'ตัวอย่าง filter เพศ: GET /api/students?gender=ชาย',
    ],
  },
  {
    id: 'students-get-by-id',
    name: 'Get Student by ID',
    description: 'ดึงข้อมูลนักศึกษาตาม ID (1, 2, 3, ...)',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของนักศึกษา เช่น 1, 2, 3' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลนักศึกษา (มี studentId อยู่ใน response)' },
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
        { name: 'studentId', type: 'string', required: false, description: 'รหัสนักศึกษา 10 หลัก', example: '6931901016' },
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล (พร้อมคำนำหน้า)', example: 'นายสมชาย ใจดี' },
        { name: 'gender', type: 'string', required: false, description: 'เพศ: ชาย หรือ หญิง', example: 'ชาย' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มนักศึกษาสำเร็จ (id จะถูก generate อัตโนมัติ)' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name มา' },
      { code: 409, meaning: 'Conflict', description: 'studentId นี้มีอยู่แล้ว' },
    ],
    notes: [
      `ตัวอย่าง request body:\n{\n  "studentId": "69319010014",\n  "name": "นาย วรเดช พันธ์พืช",\n  "gender": "ชาย"\n}`,
      'ถ้าไม่ส่ง studentId ระบบจะเพิ่มโดยไม่มีรหัสนักศึกษา',
      'id จะถูก generate อัตโนมัติ เช่น ถ้ามี 30 คนอยู่แล้ว id ใหม่จะเป็น 31',
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
      { name: 'id', type: 'string', required: true, description: 'ID ของนักศึกษา เช่น 1, 2, 3' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล', example: 'นายวรเดช พันธ์พืช' },
        { name: 'gender', type: 'string', required: false, description: 'เพศ: ชาย หรือ หญิง', example: 'ชาย' },
        { name: 'studentId', type: 'string', required: false, description: 'รหัสนักศึกษา 10 หลัก', example: '6931901014' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name มา' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/students/1',
      `ตัวอย่าง request body:\n{\n  "name": "นาย วรเดช พันธ์พืช",\n  "gender": "ชาย",\n  "studentId": "69319010014"\n}`,
      'PUT ต้องส่ง name เสมอ เพราะแทนที่ข้อมูลทั้งหมด',
    ],
  },
  {
    id: 'students-patch',
    name: 'Partially Update Student',
    description: 'อัปเดตข้อมูลนักศึกษาบางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/students/:id',
    category: 'Students',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของนักศึกษา เช่น 1, 2, 3' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'ชื่อ-นามสกุลใหม่', example: 'นายวรเดช พันธ์พืช' },
        { name: 'gender', type: 'string', required: false, description: 'เพศใหม่', example: 'ชาย' },
        { name: 'studentId', type: 'string', required: false, description: 'รหัสนักศึกษาใหม่', example: '6931901014' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
    notes: [
      'ตัวอย่าง: PATCH /api/students/1',
      `ตัวอย่างเปลี่ยนเฉพาะชื่อ:\n{\n  "name": "นาย วรเดช พันธ์พืช"\n}`,
      `ตัวอย่างเปลี่ยนเฉพาะรหัส:\n{\n  "studentId": "69319010014"\n}`,
      'PATCH ส่งแค่ field ที่อยากเปลี่ยน ไม่ต้องส่งครบ',
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
      { name: 'id', type: 'string', required: true, description: 'ID ของนักศึกษา เช่น 1, 2, 3' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักศึกษา' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/students/30',
      'ไม่ต้องส่ง body ใดๆ',
      'response จะว่างเปล่า (204 No Content)',
    ],
  },
]
