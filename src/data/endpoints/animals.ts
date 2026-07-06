import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const animalEndpoints: ApiEndpoint[] = [
  {
    id: 'animals-list',
    name: 'Get All Animals',
    description: 'ดึงรายการสัตว์ทั้งหมด (100 ชนิด) รองรับกรองตาม category, habitat, diet, conservation status และค้นหาจากชื่อหรือชื่อวิทยาศาสตร์',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/animals',
    category: 'Animals',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือชื่อวิทยาศาสตร์', example: 'Lion' },
      { name: 'category', type: 'string', required: false, description: 'กรองตามประเภท: Mammal, Bird, Reptile, Fish, Amphibian, Insect, Arachnid', example: 'Mammal' },
      { name: 'habitat', type: 'string', required: false, description: 'กรองตามถิ่นที่อยู่: Forest, Ocean, Desert, Grassland, Arctic, Rainforest, Freshwater', example: 'Ocean' },
      { name: 'diet', type: 'string', required: false, description: 'กรองตามอาหาร: Carnivore, Herbivore, Omnivore', example: 'Carnivore' },
      { name: 'conservationStatus', type: 'string', required: false, description: 'กรองตามสถานะการอนุรักษ์ เช่น Endangered, Vulnerable', example: 'Endangered' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการสัตว์ พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/animals',
      'ตัวอย่าง filter: GET /api/animals?category=Mammal&habitat=Ocean',
      'ตัวอย่าง search: GET /api/animals?search=Lion',
      'ตัวอย่าง filter diet: GET /api/animals?diet=Carnivore',
      'ตัวอย่าง filter conservation: GET /api/animals?conservationStatus=Endangered',
      'category: Mammal, Bird, Reptile, Fish, Amphibian, Insect, Arachnid',
      'conservationStatus: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered',
    ],
  },
  {
    id: 'animals-get-by-id',
    name: 'Get Animal by ID',
    description: 'ดึงข้อมูลสัตว์แบบละเอียดจาก ID รวมถึงชื่อวิทยาศาสตร์, ถิ่นที่อยู่, อาหาร, อายุขัย, น้ำหนัก, ขนาด, สถานะการอนุรักษ์',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/animals/:id',
    category: 'Animals',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสัตว์ เช่น 1, 2, 3 ... 100' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลสัตว์แบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสัตว์' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/animals/1',
      'response มี: id, name, scientificName, category, habitat, diet, lifespan(years), weight, length, conservationStatus, description, image, createdAt',
    ],
  },
  {
    id: 'animals-create',
    name: 'Create Animal',
    description: 'เพิ่มข้อมูลสัตว์ใหม่เข้าระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/animals',
    category: 'Animals',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อสัตว์', example: 'Red Panda' },
        { name: 'scientificName', type: 'string', required: false, description: 'ชื่อวิทยาศาสตร์', example: 'Ailurus fulgens' },
        { name: 'category', type: 'string', required: false, description: 'ประเภท: Mammal, Bird, Reptile, Fish, Amphibian, Insect, Arachnid', example: 'Mammal' },
        { name: 'habitat', type: 'string', required: false, description: 'ถิ่นที่อยู่', example: 'Forest' },
        { name: 'diet', type: 'string', required: false, description: 'Carnivore, Herbivore, Omnivore', example: 'Herbivore' },
        { name: 'lifespan', type: 'number', required: false, description: 'อายุขัย (ปี)', example: '15' },
        { name: 'weight', type: 'string', required: false, description: 'น้ำหนัก', example: '3-6 kg' },
        { name: 'length', type: 'string', required: false, description: 'ขนาด', example: '0.5-0.65 m' },
        { name: 'conservationStatus', type: 'string', required: false, description: 'สถานะการอนุรักษ์', example: 'Endangered' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย', example: 'Red pandas are small arboreal mammals...' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มสัตว์สำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name' },
    ],
    notes: [
      'ตัวอย่าง: POST /api/animals → {"name": "Red Panda", "scientificName": "Ailurus fulgens", "category": "Mammal", "conservationStatus": "Endangered"}',
    ],
  },
  {
    id: 'animals-update',
    name: 'Update Animal',
    description: 'อัปเดตข้อมูลสัตว์ทั้งหมด ต้องส่ง name',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/animals/:id',
    category: 'Animals',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสัตว์' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'ชื่อสัตว์', example: 'Lion' },
        { name: 'scientificName', type: 'string', required: false, description: 'ชื่อวิทยาศาสตร์' },
        { name: 'category', type: 'string', required: false, description: 'ประเภทสัตว์' },
        { name: 'habitat', type: 'string', required: false, description: 'ถิ่นที่อยู่' },
        { name: 'diet', type: 'string', required: false, description: 'อาหาร' },
        { name: 'lifespan', type: 'number', required: false, description: 'อายุขัย (ปี)' },
        { name: 'weight', type: 'string', required: false, description: 'น้ำหนัก' },
        { name: 'length', type: 'string', required: false, description: 'ขนาด' },
        { name: 'conservationStatus', type: 'string', required: false, description: 'สถานะการอนุรักษ์' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบาย' },
      ],
      note: 'PUT ต้องส่ง name เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง name' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสัตว์' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/animals/1 → {"name": "Lion", "category": "Mammal", "habitat": "Grassland", "diet": "Carnivore"}',
    ],
  },
  {
    id: 'animals-patch',
    name: 'Partially Update Animal',
    description: 'อัปเดตข้อมูลสัตว์บางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/animals/:id',
    category: 'Animals',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสัตว์' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'ชื่อใหม่' },
        { name: 'conservationStatus', type: 'string', required: false, description: 'สถานะการอนุรักษ์ใหม่', example: 'Vulnerable' },
        { name: 'lifespan', type: 'number', required: false, description: 'อายุขัยใหม่ (ปี)' },
        { name: 'habitat', type: 'string', required: false, description: 'ถิ่นที่อยู่ใหม่' },
        { name: 'diet', type: 'string', required: false, description: 'อาหารใหม่' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบายใหม่' },
        { name: 'weight', type: 'string', required: false, description: 'น้ำหนักใหม่' },
        { name: 'length', type: 'string', required: false, description: 'ขนาดใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสัตว์' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยน conservation status: PATCH /api/animals/1 → {"conservationStatus": "Vulnerable"}',
    ],
  },
  {
    id: 'animals-delete',
    name: 'Delete Animal',
    description: 'ลบข้อมูลสัตว์ออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/animals/:id',
    category: 'Animals',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสัตว์' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสัตว์' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/animals/1',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
