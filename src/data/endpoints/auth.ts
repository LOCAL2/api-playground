import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const authEndpoints: ApiEndpoint[] = [
  {
    id: 'auth-login',
    name: 'Login',
    description: 'เข้าสู่ระบบด้วย email และ password รับ JWT access token กลับมา',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/auth/login',
    category: 'Authentication',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'email', type: 'string', required: true, description: 'อีเมลที่ลงทะเบียนไว้', example: 'alice@example.com' },
        { name: 'password', type: 'string', required: true, description: 'รหัสผ่าน', example: 'password' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Login สำเร็จ คืน accessToken และ refreshToken' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง email หรือ password มา' },
      { code: 401, meaning: 'Unauthorized', description: 'email หรือ password ไม่ถูกต้อง' },
    ],
    notes: [
      'Test accounts: alice@example.com (admin), bob@example.com (user), carol@example.com (user)',
      'Password สำหรับทุก account: password',
      'Access token หมดอายุใน 15 นาที',
    ],
  },
  {
    id: 'auth-register',
    name: 'Register',
    description: 'สมัครสมาชิกใหม่ในระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/auth/register',
    category: 'Authentication',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อ-นามสกุล', example: 'John Doe' },
        { name: 'email', type: 'string', required: true, description: 'อีเมล', example: 'john@example.com' },
        { name: 'password', type: 'string', required: true, description: 'รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)', example: 'mypassword' },
        { name: 'confirmPassword', type: 'string', required: true, description: 'ยืนยันรหัสผ่าน (ต้องตรงกับ password)', example: 'mypassword' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สมัครสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ หรือ password ไม่ตรงกัน' },
      { code: 409, meaning: 'Conflict', description: 'อีเมลนี้มีในระบบแล้ว' },
    ],
  },
  {
    id: 'auth-logout',
    name: 'Logout',
    description: 'ออกจากระบบ ยกเลิก token ที่ใช้งานอยู่',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/auth/logout',
    category: 'Authentication',
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token ที่ได้จาก login' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'ออกจากระบบสำเร็จ' },
      { code: 401, meaning: 'Unauthorized', description: 'Token ไม่ถูกต้องหรือหมดอายุ' },
    ],
  },
  {
    id: 'auth-refresh',
    name: 'Refresh Token',
    description: 'ขอ access token ใหม่โดยใช้ refresh token',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/auth/refresh',
    category: 'Authentication',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'refreshToken', type: 'string', required: true, description: 'Refresh token ที่ได้จาก login', example: 'eyJhbGciOiJIUzI1NiIs...' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืน access token ใหม่' },
      { code: 401, meaning: 'Unauthorized', description: 'Refresh token ไม่ถูกต้องหรือหมดอายุ' },
    ],
    notes: ['Refresh token ใช้ได้ครั้งเดียว (token rotation)'],
  },
]
