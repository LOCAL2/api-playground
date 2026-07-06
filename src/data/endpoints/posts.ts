import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const postEndpoints: ApiEndpoint[] = [
  {
    id: 'posts-list',
    name: 'Get All Posts',
    description: 'ดึงรายการโพสต์ทั้งหมด (200+ บทความ) รองรับกรองตาม userId, tag, ค้นหาจากชื่อหรือเนื้อหา และ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts',
    category: 'Posts',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือเนื้อหา', example: 'REST API' },
      { name: 'userId', type: 'string', required: false, description: 'กรองโพสต์ของ user ID นั้น', example: '1' },
      { name: 'tag', type: 'string', required: false, description: 'กรองตาม tag', example: 'api' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการโพสต์ พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/posts',
      'ตัวอย่าง search: GET /api/posts?search=REST+API',
      'ตัวอย่าง filter tag: GET /api/posts?tag=api',
      'ตัวอย่าง โพสต์ของ user 1: GET /api/posts?userId=1',
      'ตัวอย่าง pagination: GET /api/posts?page=1&limit=10',
      'tags ที่มี: api, rest, tutorial, http, json, postman, auth, security, crud, cors, node ฯลฯ',
    ],
  },
  {
    id: 'posts-get-by-id',
    name: 'Get Post by ID',
    description: 'ดึงข้อมูลโพสต์แบบละเอียดจาก ID รวมถึงเนื้อหา, tags, status และ userId ของผู้เขียน',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post ID เช่น 1, 2, ... 200' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลโพสต์แบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/posts/1',
      'response มี: id, title, content, excerpt, tags, status, userId, coverImage, createdAt',
    ],
  },
  {
    id: 'posts-create',
    name: 'Create Post',
    description: 'สร้างโพสต์ใหม่ด้วย title, content และ tags',
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
        { name: 'content', type: 'string', required: true, description: 'เนื้อหาโพสต์', example: 'REST API คือ...' },
        { name: 'tags', type: 'string[]', required: false, description: 'รายการ tag', example: '["api", "tutorial"]' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'สร้างโพสต์สำเร็จ excerpt จะถูก generate อัตโนมัติ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title หรือ content' },
    ],
    notes: [
      'excerpt จะถูก generate จาก content อัตโนมัติ (150 ตัวอักษรแรก)',
      'status จะเป็น "published" เสมอ',
      'userId จะถูก set เป็น "1" โดยอัตโนมัติ',
      'ตัวอย่าง: POST /api/posts → {"title": "Introduction to REST APIs", "content": "REST API คือ...", "tags": ["api", "tutorial"]}',
    ],
  },
  {
    id: 'posts-update',
    name: 'Update Post',
    description: 'อัปเดตโพสต์ทั้งหมด ต้องส่ง title และ content',
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
        { name: 'title', type: 'string', required: true, description: 'หัวข้อใหม่', example: 'REST APIs Explained' },
        { name: 'content', type: 'string', required: true, description: 'เนื้อหาใหม่', example: 'Updated content...' },
        { name: 'tags', type: 'string[]', required: false, description: 'tags ใหม่', example: '["api", "rest", "guide"]' },
      ],
      note: 'PUT ต้องส่ง title และ content เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title หรือ content' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/posts/1 → {"title": "REST APIs Explained", "content": "Updated content..."}',
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
        { name: 'title', type: 'string', required: false, description: 'หัวข้อใหม่', example: 'REST APIs v2' },
        { name: 'content', type: 'string', required: false, description: 'เนื้อหาใหม่' },
        { name: 'tags', type: 'string[]', required: false, description: 'tags ใหม่', example: '["api"]' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยนแค่ tags: PATCH /api/posts/1 → {"tags": ["api", "rest"]}',
    ],
  },
  {
    id: 'posts-delete',
    name: 'Delete Post',
    description: 'ลบโพสต์ออกจากระบบ',
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
    notes: [
      'ตัวอย่าง: DELETE /api/posts/200',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
