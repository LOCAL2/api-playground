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
  {
    id: 'books-create',
    name: 'Create Book',
    description: 'เพิ่มข้อมูลหนังสือใหม่เข้าระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/books',
    category: 'Books',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อหนังสือ', example: 'My New Book' },
        { name: 'author', type: 'string', required: true, description: 'ชื่อผู้แต่ง', example: 'John Author' },
        { name: 'isbn', type: 'string', required: false, description: 'ISBN (ต้องไม่ซ้ำ)', example: '9781234567890' },
        { name: 'genre', type: 'string', required: false, description: 'หมวดหมู่ เช่น Programming, Fiction', example: 'Programming' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย', example: 'หนังสือเกี่ยวกับ...' },
        { name: 'year', type: 'number', required: false, description: 'ปีที่พิมพ์', example: '2024' },
        { name: 'pages', type: 'number', required: false, description: 'จำนวนหน้า', example: '350' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนน (0-5)', example: '4.5' },
        { name: 'publisher', type: 'string', required: false, description: 'สำนักพิมพ์', example: "O'Reilly" },
        { name: 'language', type: 'string', required: false, description: 'ภาษา', example: 'English' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มหนังสือสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title หรือ author' },
      { code: 409, meaning: 'Conflict', description: 'ISBN นี้มีในระบบแล้ว' },
    ],
  },
  {
    id: 'books-update',
    name: 'Update Book',
    description: 'อัปเดตข้อมูลหนังสือทั้งหมด ต้องส่ง title และ author',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN ของหนังสือ' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อหนังสือ', example: 'Clean Code 2nd Edition' },
        { name: 'author', type: 'string', required: true, description: 'ชื่อผู้แต่ง', example: 'Robert C. Martin' },
        { name: 'genre', type: 'string', required: false, description: 'หมวดหมู่', example: 'Programming' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย' },
        { name: 'year', type: 'number', required: false, description: 'ปีที่พิมพ์', example: '2025' },
        { name: 'pages', type: 'number', required: false, description: 'จำนวนหน้า', example: '500' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนน (0-5)', example: '4.8' },
        { name: 'publisher', type: 'string', required: false, description: 'สำนักพิมพ์' },
        { name: 'language', type: 'string', required: false, description: 'ภาษา' },
      ],
      note: 'PUT ต้องส่ง title และ author เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title หรือ author' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนังสือ' },
    ],
  },
  {
    id: 'books-patch',
    name: 'Partially Update Book',
    description: 'อัปเดตข้อมูลหนังสือบางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN ของหนังสือ' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: false, description: 'ชื่อหนังสือใหม่' },
        { name: 'author', type: 'string', required: false, description: 'ชื่อผู้แต่งใหม่' },
        { name: 'genre', type: 'string', required: false, description: 'หมวดหมู่ใหม่' },
        { name: 'rating', type: 'number', required: false, description: 'คะแนนใหม่', example: '4.9' },
        { name: 'pages', type: 'number', required: false, description: 'จำนวนหน้าใหม่' },
        { name: 'year', type: 'number', required: false, description: 'ปีใหม่' },
        { name: 'publisher', type: 'string', required: false, description: 'สำนักพิมพ์ใหม่' },
        { name: 'language', type: 'string', required: false, description: 'ภาษาใหม่' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบายใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนังสือ' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยนแค่ rating: PATCH /api/books/9780132350884 → {"rating": 4.9}',
    ],
  },
  {
    id: 'books-delete',
    name: 'Delete Book',
    description: 'ลบข้อมูลหนังสือออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN ของหนังสือ' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบหนังสือ' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/books/9780132350884',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
