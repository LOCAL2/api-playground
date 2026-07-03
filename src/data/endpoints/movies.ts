import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const movieEndpoints: ApiEndpoint[] = [
  {
    id: 'movies-list',
    name: 'Get All Movies',
    description: 'ดึงรายการภาพยนตร์ทั้งหมด (250+ เรื่อง) รองรับการกรองตาม genre, ปีที่ออกฉาย, คะแนนขั้นต่ำ, ค้นหาจากชื่อ และ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/movies',
    category: 'Movies',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อเรื่อง', example: 'Dark Knight' },
      { name: 'genre', type: 'string', required: false, description: 'กรองตาม genre เช่น Action, Drama, Comedy, Sci-Fi, Horror', example: 'Action' },
      { name: 'year', type: 'number', required: false, description: 'กรองตามปีที่ออกฉาย', example: '2023' },
      { name: 'minRating', type: 'number', required: false, description: 'คะแนนขั้นต่ำ (0-10)', example: '7' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการหนัง พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/movies',
      'ตัวอย่าง filter genre: GET /api/movies?genre=Action',
      'ตัวอย่าง filter คะแนน: GET /api/movies?minRating=8&limit=20',
      'ตัวอย่าง search: GET /api/movies?search=Dark+Knight',
      'genre ที่มี: Action, Sci-Fi, Drama, Comedy, Horror, Romance, Animation, Thriller, Adventure, Fantasy, History, War, Music, Biography',
    ],
  },
  {
    id: 'movies-get-by-id',
    name: 'Get Movie by ID',
    description: 'ดึงข้อมูลภาพยนตร์แบบละเอียดจาก ID รวมถึง genre, นักแสดง, ผู้กำกับ, ระยะเวลา, คะแนน และ poster',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของหนัง เช่น 1, 2, 3 ... 250' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลหนังแบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนัง' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/movies/1',
      'response มี: id, title, description, genre(array), year, rating, director, cast(array), duration(minutes), language, poster, createdAt',
    ],
  },
  {
    id: 'movies-create',
    name: 'Create Movie',
    description: 'เพิ่มข้อมูลภาพยนตร์ใหม่เข้าระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/movies',
    category: 'Movies',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อเรื่อง', example: 'My Movie' },
        { name: 'genre', type: 'string[]', required: false, description: 'รายการ genre', example: '["Action","Drama"]' },
        { name: 'year', type: 'number', required: false, description: 'ปีที่ออกฉาย', example: '2024' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนน (0-10)', example: '8.5' },
        { name: 'director', type: 'string', required: false, description: 'ชื่อผู้กำกับ', example: 'John Director' },
        { name: 'cast', type: 'string[]', required: false, description: 'รายชื่อนักแสดง', example: '["Actor A","Actor B"]' },
        { name: 'duration', type: 'number', required: false, description: 'ความยาว (นาที)', example: '120' },
        { name: 'language', type: 'string', required: false, description: 'ภาษา', example: 'English' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย', example: 'เรื่องย่อ...' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มหนังสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title' },
    ],
  },
  {
    id: 'movies-update',
    name: 'Update Movie',
    description: 'อัปเดตข้อมูลภาพยนตร์ทั้งหมด ต้องส่ง title',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของหนัง' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อเรื่อง', example: 'Updated Movie Title' },
        { name: 'genre', type: 'string[]', required: false, description: 'รายการ genre', example: '["Drama"]' },
        { name: 'year', type: 'number', required: false, description: 'ปีที่ออกฉาย', example: '2024' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนน (0-10)', example: '9.0' },
        { name: 'director', type: 'string', required: false, description: 'ชื่อผู้กำกับ', example: 'New Director' },
        { name: 'cast', type: 'string[]', required: false, description: 'รายชื่อนักแสดง', example: '["Actor A"]' },
        { name: 'duration', type: 'number', required: false, description: 'ความยาว (นาที)', example: '150' },
        { name: 'language', type: 'string', required: false, description: 'ภาษา', example: 'Thai' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย' },
      ],
      note: 'PUT ต้องส่ง title เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนัง' },
    ],
  },
  {
    id: 'movies-patch',
    name: 'Partially Update Movie',
    description: 'อัปเดตข้อมูลภาพยนตร์บางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของหนัง' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: false, description: 'ชื่อเรื่องใหม่' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนนใหม่', example: '9.5' },
        { name: 'genre', type: 'string[]', required: false, description: 'genre ใหม่', example: '["Action"]' },
        { name: 'year', type: 'number', required: false, description: 'ปีใหม่' },
        { name: 'director', type: 'string', required: false, description: 'ผู้กำกับใหม่' },
        { name: 'cast', type: 'string[]', required: false, description: 'นักแสดงใหม่' },
        { name: 'duration', type: 'number', required: false, description: 'ความยาวใหม่ (นาที)' },
        { name: 'language', type: 'string', required: false, description: 'ภาษาใหม่' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบายใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนัง' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยนแค่ rating: PATCH /api/movies/1 → {"rating": 9.5}',
    ],
  },
  {
    id: 'movies-delete',
    name: 'Delete Movie',
    description: 'ลบข้อมูลภาพยนตร์ออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของหนัง' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนัง' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/movies/1',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
