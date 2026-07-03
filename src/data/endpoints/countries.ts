import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const countryEndpoints: ApiEndpoint[] = [
  {
    id: 'countries-list',
    name: 'Get All Countries',
    description: 'ดึงรายการประเทศทั้งหมด (50 ประเทศ) รองรับการกรองตาม region และค้นหาจากชื่อ',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/countries',
    category: 'Countries',
    queryParameters: [
      { name: 'region', type: 'string', required: false, description: 'กรองตาม region: Asia, Europe, Americas, Africa, Oceania', example: 'Asia' },
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อประเทศ', example: 'Thailand' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการประเทศ พร้อม total count' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/countries',
      'ตัวอย่าง filter region: GET /api/countries?region=Asia',
      'ตัวอย่าง search: GET /api/countries?search=Thailand',
      'region ที่มี: Asia (16), Europe (13), Americas (8), Africa (8), Oceania (5)',
      'response มี: id, name, code(ISO 3166-1), capital, region, population, area(km²), currency, language, flag(emoji)',
    ],
  },
  {
    id: 'countries-get-by-code',
    name: 'Get Country by Code',
    description: 'ดึงข้อมูลประเทศแบบละเอียดจากรหัส ISO 3166-1 alpha-2 เช่น TH, US, JP',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'รหัสประเทศ ISO 3166-1 alpha-2 (case-insensitive) เช่น TH, US, JP' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลประเทศแบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบประเทศ' },
    ],
    notes: [
      'ตัวอย่าง (ไทย): GET /api/countries/TH',
      'ตัวอย่าง (ญี่ปุ่น): GET /api/countries/JP',
      'ตัวอย่าง (สหรัฐอเมริกา): GET /api/countries/US',
      'รหัส case-insensitive (th, TH, Th ได้ผลเหมือนกัน)',
    ],
  },
]
