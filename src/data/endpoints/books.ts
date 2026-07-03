import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const bookEndpoints: ApiEndpoint[] = [
  {
    id: 'books-list',
    name: 'Get All Books',
    description: 'ดึงรายการหนังสือทั้งหมด (250+ เล่ม) รองรับการกรองตาม genre, ผู้แต่ง, ค้นหาจากชื่อหรือ ISBN และ pagination',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/books',
    category: 'Books',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือ ISBN', example: 'Clean Code' },
      { name: 'genre', type: 'string', required: false, description: 'กรองตาม genre เช่น Programming, Design, Business, Self-Help, Science, History, Fiction', example: 'Programming' },
      { name: 'author', type: 'string', required: false, description: 'กรองตามชื่อผู้แต่ง', example: 'Robert' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการหนังสือ พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/books',
      'ตัวอย่าง filter genre: GET /api/books?genre=Programming',
      'ตัวอย่าง filter ผู้แต่ง: GET /api/books?author=Martin',
      'ตัวอย่าง search: GET /api/books?search=Clean+Code',
      'ตัวอย่าง search ด้วย ISBN: GET /api/books?search=9780132350884',
      'genre ที่มี: Programming, Design, Business, Self-Help, Science, History, Fiction',
    ],
  },
  {
    id: 'books-get-by-isbn',
    name: 'Get Book by ISBN',
    description: 'ดึงข้อมูลหนังสือแบบละเอียดจาก ISBN รวมถึงผู้แต่ง, สำนักพิมพ์, จำนวนหน้า, คะแนน และภาษา',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN ของหนังสือ เช่น 9780132350884' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลหนังสือแบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนังสือ' },
    ],
    notes: [
      'ตัวอย่าง (Clean Code): GET /api/books/9780132350884',
      'response มี: id, title, author, isbn, genre, description, year, pages, rating, publisher, language, cover, createdAt',
    ],
  },
]
