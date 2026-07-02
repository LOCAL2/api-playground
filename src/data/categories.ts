import type { CategoryInfo } from '@/types'

/**
 * Metadata for each API category
 * Used in the sidebar and category overview page
 */
export const categories: CategoryInfo[] = [
  {
    name: 'Users',
    description: 'Endpoints for managing user accounts, profiles, and user data.',
    icon: 'Users',
    color: 'blue',
  },
  {
    name: 'Authentication',
    description: 'Endpoints for user authentication, token management, and session handling.',
    icon: 'Lock',
    color: 'amber',
  },
  {
    name: 'Products',
    description: 'Endpoints for product catalog management including CRUD operations.',
    icon: 'Package',
    color: 'green',
  },
  {
    name: 'Orders',
    description: 'Endpoints for order processing, tracking, and order history.',
    icon: 'ShoppingCart',
    color: 'orange',
  },
  {
    name: 'Categories',
    description: 'Endpoints for managing product and content categories.',
    icon: 'Tag',
    color: 'purple',
  },
  {
    name: 'Posts',
    description: 'Endpoints for blog posts, articles, and content management.',
    icon: 'FileText',
    color: 'pink',
  },
  {
    name: 'Comments',
    description: 'Endpoints for managing comments and replies on posts.',
    icon: 'MessageSquare',
    color: 'indigo',
  },
  {
    name: 'Todos',
    description: 'Endpoints for task management and to-do list operations.',
    icon: 'CheckSquare',
    color: 'teal',
  },
  {
    name: 'Sports',
    description: 'Endpoints for sports data, teams, players, and scores.',
    icon: 'Trophy',
    color: 'yellow',
  },
  {
    name: 'Movies',
    description: 'Endpoints for movie database, ratings, and film information.',
    icon: 'Film',
    color: 'red',
  },
  {
    name: 'Books',
    description: 'Endpoints for book catalog, authors, and reading lists.',
    icon: 'BookOpen',
    color: 'cyan',
  },
  {
    name: 'Countries',
    description: 'Endpoints for country data, geography, and regional information.',
    icon: 'Globe',
    color: 'emerald',
  },
  {
    name: 'Dashboard',
    description: 'Endpoints for dashboard statistics, analytics, and summary data.',
    icon: 'LayoutDashboard',
    color: 'violet',
  },
]
