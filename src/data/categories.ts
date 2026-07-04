import type { CategoryInfo } from '@/types'

export const categories: CategoryInfo[] = [
  {
    name: 'Users',
    description: 'Endpoints สำหรับจัดการข้อมูลผู้ใช้ รองรับ CRUD, ค้นหา, เรียงลำดับ และ pagination',
    icon: 'Users',
    color: 'blue',
  },
  {
    name: 'Posts',
    description: 'Endpoints สำหรับจัดการโพสต์และบทความ รองรับ CRUD, ค้นหา, กรอง tag และ pagination',
    icon: 'FileText',
    color: 'pink',
  },
  {
    name: 'Products',
    description: 'Endpoints สำหรับจัดการสินค้า รองรับ CRUD, ค้นหา, กรองราคา, กรอง stock และ pagination',
    icon: 'Package',
    color: 'green',
  },
  {
    name: 'Students',
    description: 'Endpoints สำหรับจัดการข้อมูลนักศึกษา รองรับ CRUD และค้นหาด้วยชื่อหรือรหัสนักศึกษา',
    icon: 'GraduationCap',
    color: 'cyan',
  },
  {
    name: 'Movies',
    description: 'Endpoints สำหรับดึงข้อมูลภาพยนตร์ 250+ เรื่อง รองรับ CRUD, ค้นหา, กรอง genre/ปี/คะแนน และ pagination',
    icon: 'Film',
    color: 'purple',
  },
  {
    name: 'Books',
    description: 'Endpoints สำหรับดึงข้อมูลหนังสือ 250+ เล่ม รองรับ CRUD, ค้นหา, กรอง genre/ผู้แต่ง และ pagination',
    icon: 'BookOpen',
    color: 'amber',
  },
  {
    name: 'Countries',
    description: 'Endpoints สำหรับดึงข้อมูลประเทศทั่วโลก 50 ประเทศ รองรับ CRUD, กรอง region และค้นหาจากชื่อ',
    icon: 'Globe',
    color: 'sky',
  },
  {
    name: 'Recipes',
    description: 'Endpoints สำหรับจัดการสูตรอาหาร 100 เมนู ทั้งไทยและต่างประเทศ รองรับ CRUD, กรอง category/difficulty และค้นหา',
    icon: 'ChefHat',
    color: 'orange',
  },
  {
    name: 'Animals',
    description: 'Endpoints สำหรับดึงข้อมูลสัตว์ 100 ชนิด รองรับ CRUD, กรอง category/habitat/diet/conservation status และค้นหา',
    icon: 'PawPrint',
    color: 'emerald',
  },
  {
    name: 'Todos',
    description: 'Endpoints สำหรับจัดการ Todo List รองรับสร้าง, ลบ, toggle สถานะ และกรอง priority',
    icon: 'CheckSquare',
    color: 'rose',
  },
]
