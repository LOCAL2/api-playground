import type { CategoryInfo } from '@/types'

/**
 * Metadata for each API category
 */
export const categories: CategoryInfo[] = [
  {
    name: 'Users',
    description: 'Endpoints สำหรับจัดการข้อมูลผู้ใช้ รองรับ CRUD, ค้นหา, เรียงลำดับ และ pagination — ประยุกต์ใช้ทำระบบ Admin Panel, หน้า Profile ผู้ใช้, หรือระบบจัดการสมาชิก',
    icon: 'Users',
    color: 'blue',
  },
  {
    name: 'Posts',
    description: 'Endpoints สำหรับจัดการโพสต์และบทความ รองรับ CRUD, ค้นหา, กรอง tag และ pagination — ประยุกต์ใช้ทำระบบ Blog, กระดานข่าว, หรือ Content Management System',
    icon: 'FileText',
    color: 'pink',
  },
  {
    name: 'Products',
    description: 'Endpoints สำหรับจัดการสินค้า รองรับ CRUD, ค้นหา, กรองราคา, กรอง stock และ pagination — ประยุกต์ใช้ทำร้านค้าออนไลน์, ระบบจัดการ inventory, หรือแคตตาล็อกสินค้า',
    icon: 'Package',
    color: 'green',
  },
  {
    name: 'Students',
    description: 'Endpoints สำหรับจัดการข้อมูลนักศึกษา รองรับ CRUD และค้นหาด้วยชื่อหรือรหัสนักศึกษา — ประยุกต์ใช้ทำระบบทะเบียนนักศึกษา หรือ Student Portal',
    icon: 'GraduationCap',
    color: 'cyan',
  },
  {
    name: 'Movies',
    description: 'Endpoints สำหรับดึงข้อมูลภาพยนตร์ 250+ เรื่อง รองรับค้นหา, กรอง genre/ปี/คะแนน และ pagination — ประยุกต์ใช้ทำแอปรีวิวหนัง, ระบบแนะนำภาพยนตร์, หรือ Streaming Platform',
    icon: 'Film',
    color: 'purple',
  },
  {
    name: 'Books',
    description: 'Endpoints สำหรับดึงข้อมูลหนังสือ 250+ เล่ม รองรับค้นหา, กรอง genre/ผู้แต่ง และ pagination — ประยุกต์ใช้ทำแอปรีวิวหนังสือ, ร้านหนังสือออนไลน์, หรือระบบ Library',
    icon: 'BookOpen',
    color: 'amber',
  },
  {
    name: 'Countries',
    description: 'Endpoints สำหรับดึงข้อมูลประเทศทั่วโลก 50 ประเทศ รองรับกรอง region และค้นหาจากชื่อ — ประยุกต์ใช้ทำ dropdown ประเทศ, แผนที่โลก, หรือแอปเดินทาง',
    icon: 'Globe',
    color: 'sky',
  },
  {
    name: 'Todos',
    description: 'Endpoints สำหรับจัดการ Todo List รองรับสร้าง, ลบ, toggle สถานะ และกรอง priority — ประยุกต์ใช้ทำแอป Task Manager, Kanban Board, หรือ Productivity App',
    icon: 'CheckSquare',
    color: 'emerald',
  },
]
