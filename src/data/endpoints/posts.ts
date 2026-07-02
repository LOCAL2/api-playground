import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const postEndpoints: ApiEndpoint[] = [
  {
    id: 'posts-list',
    name: 'List All Posts',
    description: 'ดึงรายการโพสต์ทั้งหมด',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts',
    category: 'Posts',
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '10' },
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจาก title', example: 'REST' },
      { name: 'status', type: 'string', required: false, description: 'กรองตาม status: published, draft', example: 'published' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการโพสต์' },
    ],
  },
  {
    id: 'posts-get-by-id',
    name: 'Get Post by ID',
    description: 'ดึงโพสต์ตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post ID (ลองใช้: 1, 2, หรือ 3)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลโพสต์' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
  },
  {
    id: 'posts-create',
    name: 'Create Post',
    description: 'สร้างโพสต์ใหม่',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/posts',
    category: 'Posts',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'หัวข้อโพสต์', example: 'Introduction to REST APIs' },
        { name: 'content', type: 'string', required: true, description: 'เนื้อหาโพสต์' },
        { name: 'excerpt', type: 'string', required: false, description: 'สรุปสั้น' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array ของ tag', example: '["api", "rest"]' },
        { name: 'status', type: 'string', required: false, description: 'published หรือ draft (default: draft)', example: 'published' },
      ],
    },
    requiresAuth: true,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้างโพสต์สำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ' },
      { code: 401, meaning: 'Unauthorized', description: 'ไม่ได้ login' },
    ],
  },
  {
    id: 'posts-delete',
    name: 'Delete Post',
    description: 'ลบโพสต์',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post ID' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 401, meaning: 'Unauthorized', description: 'ไม่ได้ login' },
      { code: 403, meaning: 'Forbidden', description: 'ไม่ใช่ผู้เขียน' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
  },
]
