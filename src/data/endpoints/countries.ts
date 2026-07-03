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
      'ตัวอย่าง: GET /api/countries/TH',
      'รหัส case-insensitive (th, TH ได้ผลเหมือนกัน)',
    ],
  },
  {
    id: 'countries-create',
    name: 'Create Country',
    description: 'เพิ่มข้อมูลประเทศใหม่เข้าระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/countries',
    category: 'Countries',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อประเทศ', example: 'Laos' },
        { name: 'code', type: 'string', required: true, description: 'รหัส ISO 3166-1 alpha-2 (ต้องไม่ซ้ำ)', example: 'LA' },
        { name: 'capital', type: 'string', required: false, description: 'เมืองหลวง', example: 'Vientiane' },
        { name: 'region', type: 'string', required: false, description: 'ภูมิภาค', example: 'Asia' },
        { name: 'population', type: 'number', required: false, description: 'จำนวนประชากร', example: '7379358' },
        { name: 'area', type: 'number', required: false, description: 'พื้นที่ (km²)', example: '236800' },
        { name: 'currency', type: 'string', required: false, description: 'สกุลเงิน', example: 'Lao Kip' },
        { name: 'language', type: 'string', required: false, description: 'ภาษา', example: 'Lao' },
        { name: 'flag', type: 'string', required: false, description: 'emoji ธงชาติ', example: '🇱🇦' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มประเทศสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name หรือ code' },
      { code: 409, meaning: 'Conflict', description: 'รหัสประเทศนี้มีในระบบแล้ว' },
    ],
  },
  {
    id: 'countries-update',
    name: 'Update Country',
    description: 'อัปเดตข้อมูลประเทศทั้งหมด ต้องส่ง name',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'รหัสประเทศ ISO 3166-1 alpha-2' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อประเทศ', example: 'Thailand' },
        { name: 'capital', type: 'string', required: false, description: 'เมืองหลวง', example: 'Bangkok' },
        { name: 'region', type: 'string', required: false, description: 'ภูมิภาค', example: 'Asia' },
        { name: 'population', type: 'number', required: false, description: 'จำนวนประชากร', example: '71601103' },
        { name: 'area', type: 'number', required: false, description: 'พื้นที่ (km²)', example: '513120' },
        { name: 'currency', type: 'string', required: false, description: 'สกุลเงิน', example: 'Thai Baht' },
        { name: 'language', type: 'string', required: false, description: 'ภาษา', example: 'Thai' },
        { name: 'flag', type: 'string', required: false, description: 'emoji ธงชาติ', example: '🇹🇭' },
      ],
      note: 'PUT ต้องส่ง name เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบประเทศ' },
    ],
  },
  {
    id: 'countries-patch',
    name: 'Partially Update Country',
    description: 'อัปเดตข้อมูลประเทศบางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'รหัสประเทศ ISO 3166-1 alpha-2' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'ชื่อประเทศใหม่' },
        { name: 'capital', type: 'string', required: false, description: 'เมืองหลวงใหม่' },
        { name: 'population', type: 'number', required: false, description: 'จำนวนประชากรใหม่', example: '72000000' },
        { name: 'area', type: 'number', required: false, description: 'พื้นที่ใหม่ (km²)' },
        { name: 'currency', type: 'string', required: false, description: 'สกุลเงินใหม่' },
        { name: 'language', type: 'string', required: false, description: 'ภาษาใหม่' },
        { name: 'flag', type: 'string', required: false, description: 'emoji ธงชาติใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบประเทศ' },
    ],
    notes: [
      'ตัวอย่างอัปเดตประชากร: PATCH /api/countries/TH → {"population": 72000000}',
    ],
  },
  {
    id: 'countries-delete',
    name: 'Delete Country',
    description: 'ลบข้อมูลประเทศออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'รหัสประเทศ ISO 3166-1 alpha-2' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบประเทศ' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/countries/TH',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
