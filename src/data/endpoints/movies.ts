import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const movieEndpoints: ApiEndpoint[] = [
  {
    id: 'movies-list',
    name: 'Get All Movies',
    description: 'ดึงรายการภาพยนตร์ทั้งหมด (250+ เรื่อง) รองรับการกรองตาม genre, ปีที่ออกฉาย, คะแนนขั้นต่ำ, ค้นหาจากชื่อ และ pagination — ประยุกต์ใช้ทำหน้า Browse ภาพยนตร์, ระบบแนะนำหนัง, หรือ Streaming Platform',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/movies',
    category: 'Movies',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อเรื่อง', example: 'Avengers' },
      { name: 'genre', type: 'string', required: false, description: 'กรองตาม genre เช่น Action, Drama, Comedy, Sci-Fi, Horror', example: 'Action' },
      { name: 'year', type: 'number', required: false, description: 'กรองตามปีที่ออกฉาย', example: '2023' },
      { name: 'minRating', type: 'number', required: false, description: 'คะแนนขั้นต่ำ (0-10)', example: '7' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า (default: 9999)', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการหนัง พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง (ทั้งหมด): GET /api/movies',
      'ตัวอย่าง filter genre: GET /api/movies?genre=Action',
      'ตัวอย่าง filter คะแนน: GET /api/movies?minRating=8&limit=20',
      'ตัวอย่าง search: GET /api/movies?search=Dark+Knight',
      'ตัวอย่าง filter ปี: GET /api/movies?year=2023&genre=Drama',
      'genre ที่มี: Action, Sci-Fi, Drama, Comedy, Horror, Romance, Animation, Thriller, Adventure, Fantasy, History, War, Music, Biography',
      'ประยุกต์ใช้: หน้า Browse ใน Streaming App, ระบบแนะนำหนังตาม genre ที่ชื่นชอบ, หน้ากรองหนังตามปีหรือคะแนน',
    ],
  },
  {
    id: 'movies-get-by-id',
    name: 'Get Movie by ID',
    description: 'ดึงข้อมูลภาพยนตร์แบบละเอียดจาก ID รวมถึง genre, นักแสดง, ผู้กำกับ, ระยะเวลา, คะแนน และ poster — ประยุกต์ใช้ทำหน้า Detail ของหนัง หรือ modal แสดงข้อมูลเมื่อกดเลือก',
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
      'response มี fields: id, title, description, genre(array), year, rating, director, cast(array), duration(minutes), language, poster, createdAt',
      'ประยุกต์ใช้: หน้า Detail ของหนัง, แสดง cast และ crew, แสดง poster และ rating',
    ],
  },
]
