import type { CategoryInfo } from '@/types'

/**
 * Metadata for each API category
 */
export const categories: CategoryInfo[] = [
  {
    name: 'Users',
    description: 'Endpoints สำหรับจัดการข้อมูลผู้ใช้ รองรับ CRUD และค้นหา',
    icon: 'Users',
    color: 'blue',
  },
  {
    name: 'Posts',
    description: 'Endpoints สำหรับจัดการโพสต์และบทความ รองรับ CRUD และค้นหา',
    icon: 'FileText',
    color: 'pink',
  },
  {
    name: 'Products',
    description: 'Endpoints สำหรับจัดการสินค้า รองรับ CRUD ค้นหา และกรองราคา',
    icon: 'Package',
    color: 'green',
  },
  {
    name: 'Students',
    description: 'Endpoints สำหรับจัดการข้อมูลนักศึกษา รองรับ CRUD และค้นหาด้วยชื่อหรือรหัสนักศึกษา',
    icon: 'GraduationCap',
    color: 'cyan',
  },
]
