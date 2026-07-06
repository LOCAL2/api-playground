import type { ApiEndpoint } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const recipeEndpoints: ApiEndpoint[] = [
  {
    id: 'recipes-list',
    name: 'Get All Recipes',
    description: 'ดึงรายการสูตรอาหารทั้งหมด (100 เมนู) รองรับกรองตาม category, difficulty, calories และค้นหาจากชื่อหรือคำอธิบาย',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/recipes',
    category: 'Recipes',
    queryParameters: [
      { name: 'search', type: 'string', required: false, description: 'ค้นหาจากชื่อหรือคำอธิบาย', example: 'ผัดกะเพรา' },
      { name: 'category', type: 'string', required: false, description: 'กรองตามประเภทอาหาร: Thai, Italian, Japanese, American, Mexican, Chinese, Indian, French', example: 'Thai' },
      { name: 'difficulty', type: 'string', required: false, description: 'กรองตามความยาก: easy, medium, hard', example: 'easy' },
      { name: 'maxCalories', type: 'number', required: false, description: 'กรองตามแคลอรี่สูงสุด', example: '500' },
      { name: 'page', type: 'number', required: false, description: 'หน้าที่ต้องการ', example: '1' },
      { name: 'limit', type: 'number', required: false, description: 'จำนวนต่อหน้า', example: '10' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนรายการสูตรอาหาร พร้อม pagination metadata' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/recipes',
      'ตัวอย่าง filter: GET /api/recipes?category=Thai&difficulty=easy',
      'ตัวอย่าง search: GET /api/recipes?search=ผัดกะเพรา',
      'ตัวอย่าง filter แคลอรี่: GET /api/recipes?maxCalories=400',
      'category ที่มี: Thai, Italian, Japanese, American, Mexican, Chinese, Indian, French',
      'difficulty: easy, medium, hard',
    ],
  },
  {
    id: 'recipes-get-by-id',
    name: 'Get Recipe by ID',
    description: 'ดึงข้อมูลสูตรอาหารแบบละเอียดจาก ID รวมถึง ingredients, steps, เวลาทำ, แคลอรี่ และ tags',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/recipes/:id',
    category: 'Recipes',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสูตรอาหาร เช่น 1, 2, 3 ... 100' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'คืนข้อมูลสูตรอาหารแบบละเอียด' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสูตรอาหาร' },
    ],
    notes: [
      'ตัวอย่าง: GET /api/recipes/1',
      'response มี: id, title, description, ingredients(array), steps(array), category, prepTime, cookTime, servings, difficulty, calories, tags, image, createdAt',
    ],
  },
  {
    id: 'recipes-create',
    name: 'Create Recipe',
    description: 'เพิ่มสูตรอาหารใหม่เข้าระบบ',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/recipes',
    category: 'Recipes',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อเมนู', example: 'ผัดกะเพราหมูสับ' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบายเมนู', example: 'เมนูคลาสสิกกินกับข้าว' },
        { name: 'ingredients', type: 'string[]', required: false, description: 'รายการวัตถุดิบ', example: '["หมูสับ 200g","กะเพรา 1 กำ","กระเทียม 5 กลีบ"]' },
        { name: 'steps', type: 'string[]', required: false, description: 'ขั้นตอนการทำ', example: '["ผัดกระเทียม","ใส่หมูสับ","ใส่กะเพรา"]' },
        { name: 'category', type: 'string', required: false, description: 'ประเภทอาหาร', example: 'Thai' },
        { name: 'prepTime', type: 'number', required: false, description: 'เวลาเตรียม (นาที)', example: '10' },
        { name: 'cookTime', type: 'number', required: false, description: 'เวลาปรุง (นาที)', example: '10' },
        { name: 'servings', type: 'number', required: false, description: 'จำนวนที่เสิร์ฟ (คน)', example: '2' },
        { name: 'difficulty', type: 'string', required: false, description: 'ความยาก: easy, medium, hard', example: 'easy' },
        { name: 'calories', type: 'number', required: false, description: 'แคลอรี่ต่อหน่วยบริการ', example: '420' },
        { name: 'tags', type: 'string[]', required: false, description: 'tags', example: '["spicy","quick","stir-fry"]' },
      ],
    },
    requiresAuth: false,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'เพิ่มสูตรอาหารสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title' },
    ],
    notes: [
      'ตัวอย่าง: POST /api/recipes → {"title": "ผัดกะเพราหมูสับ", "category": "Thai", "difficulty": "easy", "calories": 420}',
    ],
  },
  {
    id: 'recipes-update',
    name: 'Update Recipe',
    description: 'อัปเดตสูตรอาหารทั้งหมด ต้องส่ง title',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/recipes/:id',
    category: 'Recipes',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสูตรอาหาร' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'ชื่อเมนู', example: 'ผัดกะเพราหมูสับ (Updated)' },
        { name: 'description', type: 'string', required: false, description: 'คำอธิบายใหม่' },
        { name: 'ingredients', type: 'string[]', required: false, description: 'รายการวัตถุดิบใหม่' },
        { name: 'steps', type: 'string[]', required: false, description: 'ขั้นตอนใหม่' },
        { name: 'category', type: 'string', required: false, description: 'ประเภทอาหาร', example: 'Thai' },
        { name: 'prepTime', type: 'number', required: false, description: 'เวลาเตรียม (นาที)' },
        { name: 'cookTime', type: 'number', required: false, description: 'เวลาปรุง (นาที)' },
        { name: 'servings', type: 'number', required: false, description: 'จำนวนที่เสิร์ฟ' },
        { name: 'difficulty', type: 'string', required: false, description: 'easy, medium, hard' },
        { name: 'calories', type: 'number', required: false, description: 'แคลอรี่' },
        { name: 'tags', type: 'string[]', required: false, description: 'tags' },
      ],
      note: 'PUT ต้องส่ง title เสมอ',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 400, meaning: 'Bad Request', description: 'ไม่ได้ส่ง title' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสูตรอาหาร' },
    ],
    notes: [
      'ตัวอย่าง: PUT /api/recipes/1 → {"title": "ผัดกะเพราหมูสับ (Updated)", "category": "Thai", "difficulty": "easy"}',
    ],
  },
  {
    id: 'recipes-patch',
    name: 'Partially Update Recipe',
    description: 'อัปเดตสูตรอาหารบางส่วน ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/recipes/:id',
    category: 'Recipes',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสูตรอาหาร' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'รูปแบบ request body' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: false, description: 'ชื่อเมนูใหม่' },
        { name: 'calories', type: 'number', required: false, description: 'แคลอรี่ใหม่', example: '380' },
        { name: 'difficulty', type: 'string', required: false, description: 'ความยากใหม่', example: 'medium' },
        { name: 'servings', type: 'number', required: false, description: 'จำนวนที่เสิร์ฟใหม่' },
        { name: 'tags', type: 'string[]', required: false, description: 'tags ใหม่' },
        { name: 'ingredients', type: 'string[]', required: false, description: 'วัตถุดิบใหม่' },
        { name: 'steps', type: 'string[]', required: false, description: 'ขั้นตอนใหม่' },
      ],
      note: 'ส่งเฉพาะ field ที่ต้องการเปลี่ยน',
    },
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'อัปเดตสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสูตรอาหาร' },
    ],
    notes: [
      'ตัวอย่างเปลี่ยนแค่ calories: PATCH /api/recipes/1 → {"calories": 380}',
    ],
  },
  {
    id: 'recipes-delete',
    name: 'Delete Recipe',
    description: 'ลบสูตรอาหารออกจากระบบ',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/recipes/:id',
    category: 'Recipes',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'ID ของสูตรอาหาร' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'ลบสำเร็จ' },
      { code: 404, meaning: 'Not Found', description: 'ไม่พบสูตรอาหาร' },
    ],
    notes: [
      'ตัวอย่าง: DELETE /api/recipes/1',
      'ไม่ต้องส่ง body ใดๆ',
    ],
  },
]
