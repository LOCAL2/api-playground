import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const postEndpoints: ApiEndpoint[] = [
  {
    id: 'posts-list',
    name: 'Get All Posts',
    description: 'ดึงรายการโพสต์ทั้งหมด รองรับการค้นหาและ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts',
    category: 'Posts',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจาก title หรือ content', example: 'REST API' },
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการโพสต์ทั้งหมด' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/posts',
      'ตัวอย่าง search: GET /api/posts?search=REST API',
    ],
  },
  {
    id: 'posts-get-by-id',
    name: 'Get Post by ID',
    description: 'ดึงข้อมูลโพสต์ตาม ID',
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
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'หัวข้อโพสต์', example: 'Introduction to REST APIs' },
        { name: 'content', type: 'string', required: true, description: 'เนื้อหาโพสต์', example: 'REST (Representational State Transfer) is...' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array ของ tag', example: '["api", "rest"]' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้างโพสต์สำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ครบ' },
    ],
  },
  {
    id: 'posts-update',
    name: 'Update Post',
    description: 'อัปเดตข้อมูลโพสต์ทั้งหมด',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'หัวข้อโพสต์', example: 'Updated Title' },
        { name: 'content', type: 'string', required: true, description: 'เนื้อหาโพสต์', example: 'Updated content...' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array ของ tag', example: '["api", "http"]' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ข้อมูลไม่ถูกต้อง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
  },
  {
    id: 'posts-patch',
    name: 'Partially Update Post',
    description: 'อัปเดตโพสต์บางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: false, description: 'หัวข้อใหม่', example: 'New Title' },
        { name: 'content', type: 'string', required: false, description: 'เนื้อหาใหม่' },
        { name: 'tags', type: 'string[]', required: false, description: 'tag ใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
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
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
  },
]
