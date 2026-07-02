import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const miscEndpoints: ApiEndpoint[] = [
  // === COMMENTS ===
  {
    id: 'comments-list-by-post',
    name: 'List Comments by Post',
    description: 'ดึง comment ทั้งหมดของโพสต์นั้น',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/posts/:postId/comments',
    category: 'Comments',
    pathParameters: [
      { name: 'postId', type: 'string', required: true, description: 'Post ID (ลองใช้: 1, 2)' },
    ],
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'จำนวนต่อหน้า', example: '20' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการ comment' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบโพสต์' },
    ],
  },
  {
    id: 'comments-delete',
    name: 'Delete Comment',
    description: 'ลบ comment',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/comments/:id',
    category: 'Comments',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Comment ID (ลองใช้: 1, 2, 3, 4)' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 403, meaning: 'Forbidden', description: 'ไม่ใช่เจ้าของ comment' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ comment' },
    ],
  },
  // === TODOS ===
  {
    id: 'todos-list',
    name: 'List Todos',
    description: 'ดึง todo ทั้งหมดของ user ที่ login อยู่',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/todos',
    category: 'Todos',
    queryParameters: [
      { name: 'completed', type: 'boolean', required: false, description: 'กรองตามสถานะ: true หรือ false', example: 'false' },
      { name: 'priority', type: 'string', required: false, description: 'กรองตาม priority: low, medium, high', example: 'high' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการ todo' },
      { code: 401, meaning: 'Unauthorized', description: 'ไม่ได้ login' },
    ],
  },
  {
    id: 'todos-toggle',
    name: 'Toggle Todo',
    description: 'สลับสถานะ completed ของ todo',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/todos/:id/toggle',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Todo ID (ลองใช้: 1, 2, 3)' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'สลับสถานะสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ todo' },
    ],
  },
  {
    id: 'todos-delete',
    name: 'Delete Todo',
    description: 'ลบ todo',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Todo ID' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ todo' },
    ],
  },
  // === CATEGORIES ===
  {
    id: 'categories-list',
    name: 'List Categories',
    description: 'ดึง category ทั้งหมด',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/categories',
    category: 'Categories',
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการ category' },
    ],
  },
  // === COUNTRIES ===
  {
    id: 'countries-list',
    name: 'List All Countries',
    description: 'ดึงรายการประเทศทั้งหมด รองรับการค้นหา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/countries',
    category: 'Countries',
    queryParameters: [
      { name: 'region', type: 'string', required: false, description: 'กรองตาม region: Asia, Europe, Americas, Oceania', example: 'Asia' },
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อประเทศ', example: 'Thai' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการประเทศ' },
    ],
  },
  {
    id: 'countries-get-by-code',
    name: 'Get Country by Code',
    description: 'ดึงข้อมูลประเทศตาม country code',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'ISO country code เช่น TH, US, JP, GB' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลประเทศ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบ country code นี้' },
    ],
  },
  // === SPORTS ===
  {
    id: 'sports-teams-list',
    name: 'List Sports Teams',
    description: 'ดึงรายการทีมกีฬา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/sports/teams',
    category: 'Sports',
    queryParameters: [
      { name: 'sport', type: 'string', required: false, description: 'กรองตามประเภท: football, basketball', example: 'football' },
      { name: 'country', type: 'string', required: false, description: 'กรองตาม country code', example: 'TH' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการทีม' },
    ],
  },
  {
    id: 'sports-players-get',
    name: 'Get Player Details',
    description: 'ดึงข้อมูลนักกีฬาตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/sports/players/:id',
    category: 'Sports',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Player ID (ลองใช้: 1 หรือ 2)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลนักกีฬา' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบนักกีฬา' },
    ],
  },
  // === MOVIES ===
  {
    id: 'movies-list',
    name: 'List Movies',
    description: 'ดึงรายการหนัง รองรับการค้นหาและกรอง',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/movies',
    category: 'Movies',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหนัง', example: 'Inception' },
      { name: 'genre', type: 'string', required: false, description: 'กรองตาม genre', example: 'Action' },
      { name: 'year', type: 'integer', required: false, description: 'กรองตามปีที่ออก', example: '2010' },
      { name: 'minRating', type: 'number', required: false, description: 'คะแนนขั้นต่ำ (0-10)', example: '8.0' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการหนัง' },
    ],
  },
  {
    id: 'movies-get-by-id',
    name: 'Get Movie Details',
    description: 'ดึงข้อมูลหนังตาม ID',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Movie ID (ลองใช้: 1, 2, 3, 4, หรือ 5)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลหนัง' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนัง' },
    ],
  },
  // === BOOKS ===
  {
    id: 'books-list',
    name: 'List Books',
    description: 'ดึงรายการหนังสือ รองรับการค้นหา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/books',
    category: 'Books',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือผู้แต่ง', example: 'Clean Code' },
      { name: 'genre', type: 'string', required: false, description: 'กรองตาม genre', example: 'Technology' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการหนังสือ' },
    ],
  },
  {
    id: 'books-get-by-isbn',
    name: 'Get Book by ISBN',
    description: 'ดึงข้อมูลหนังสือตาม ISBN',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN ของหนังสือ (ลองใช้: 9780132350884)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลหนังสือ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนังสือ' },
    ],
  },
  // === DASHBOARD ===
  {
    id: 'dashboard-stats',
    name: 'Get Dashboard Statistics',
    description: 'ดึงสถิติสรุปสำหรับ admin dashboard',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/dashboard/stats',
    category: 'Dashboard',
    queryParameters: [
      { name: 'period', type: 'string', required: false, description: 'ช่วงเวลา: today, week, month, year', example: 'month' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนสถิติ' },
      { code: 403, meaning: 'Forbidden', description: 'Admin only' },
    ],
  },
  {
    id: 'dashboard-revenue',
    name: 'Get Revenue Report',
    description: 'ดึงข้อมูลรายได้แยกตามช่วงเวลา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/dashboard/revenue',
    category: 'Dashboard',
    queryParameters: [
      { name: 'from', type: 'string', required: true, description: 'วันที่เริ่มต้น (ISO 8601)', example: '2024-01-01' },
      { name: 'to', type: 'string', required: true, description: 'วันที่สิ้นสุด (ISO 8601)', example: '2024-12-31' },
      { name: 'groupBy', type: 'string', required: false, description: 'จัดกลุ่มตาม: day, week, month', example: 'month' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลรายได้' },
      { code: 400, meaning: 'Bad Request', description: 'วันที่ไม่ถูกต้อง' },
      { code: 403, meaning: 'Forbidden', description: 'Admin only' },
    ],
  },
]
