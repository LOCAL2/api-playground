import type { ApiEndpoint } from '@/types'

/**
 * BASE_URL จะถูกแทนด้วย URL จริงหลัง deploy บน Vercel
 * ตัวแปร VITE_API_BASE_URL ตั้งค่าใน Vercel Environment Variables
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-project.vercel.app'

export const userEndpoints: ApiEndpoint[] = [
  {
    id: 'users-list',
    name: 'List All Users',
    description: 'Retrieve a paginated list of all registered users in the system.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users',
    category: 'Users',
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of results per page (max 100)', example: '20' },
      { name: 'sort', type: 'string', required: false, description: 'Sort field: name, email, createdAt', example: 'createdAt' },
      { name: 'order', type: 'string', required: false, description: 'Sort direction: asc or desc', example: 'desc' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (get from POST /api/auth/login)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required. Login with alice@example.com / password to get admin token.',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns paginated list of users' },
      { code: 401, meaning: 'Unauthorized', description: 'Missing or invalid token' },
      { code: 403, meaning: 'Forbidden', description: 'Insufficient permissions (admin only)' },
    ],
    notes: ['Requires admin role', 'Sensitive fields (password) are excluded from response'],
  },
  {
    id: 'users-get-by-id',
    name: 'Get User by ID',
    description: 'Retrieve detailed information about a specific user by their unique ID.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID (try: 1, 2, or 3)' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns user object' },
      { code: 401, meaning: 'Unauthorized', description: 'Missing or invalid token' },
      { code: 404, meaning: 'Not Found', description: 'User with given ID does not exist' },
    ],
  },
  {
    id: 'users-create',
    name: 'Create User',
    description: 'Register a new user account in the system. (Admin only)',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/api/users',
    category: 'Users',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin only)' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Full name of the user', example: 'John Doe' },
        { name: 'email', type: 'string', required: true, description: 'Unique email address', example: 'john@example.com' },
        { name: 'password', type: 'string', required: true, description: 'Password (min 8 characters)', example: 'SecurePass123!' },
        { name: 'role', type: 'string', required: false, description: 'User role: user or admin (default: user)', example: 'user' },
        { name: 'avatar', type: 'string', required: false, description: 'URL to user avatar image' },
      ],
    },
    requiresAuth: true,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'User created successfully' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error or missing required fields' },
      { code: 409, meaning: 'Conflict', description: 'Email already exists' },
    ],
  },
  {
    id: 'users-update',
    name: 'Update User',
    description: 'Update an existing user\'s profile information.',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Updated full name', example: 'Jane Doe' },
        { name: 'email', type: 'string', required: true, description: 'Updated email address', example: 'jane@example.com' },
        { name: 'avatar', type: 'string', required: false, description: 'Updated avatar URL' },
        { name: 'bio', type: 'string', required: false, description: 'Short user biography' },
      ],
    },
    requiresAuth: true,
    authNote: 'Users can only update their own profile. Admins can update any user.',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'User updated successfully' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error' },
      { code: 401, meaning: 'Unauthorized', description: 'Missing or invalid token' },
      { code: 403, meaning: 'Forbidden', description: 'Cannot update another user\'s profile' },
      { code: 404, meaning: 'Not Found', description: 'User not found' },
    ],
  },
  {
    id: 'users-patch',
    name: 'Partially Update User',
    description: 'Partially update specific fields of a user profile.',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'Updated full name' },
        { name: 'avatar', type: 'string', required: false, description: 'Updated avatar URL' },
        { name: 'bio', type: 'string', required: false, description: 'Updated biography' },
      ],
      note: 'Only include fields you want to update',
    },
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'User partially updated' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
      { code: 404, meaning: 'Not Found', description: 'User not found' },
    ],
  },
  {
    id: 'users-delete',
    name: 'Delete User',
    description: 'Permanently delete a user account from the system.',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/api/users/:id',
    category: 'Users',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'User ID' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin only)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'User deleted successfully' },
      { code: 401, meaning: 'Unauthorized', description: 'Missing or invalid token' },
      { code: 403, meaning: 'Forbidden', description: 'Admin role required' },
      { code: 404, meaning: 'Not Found', description: 'User not found' },
    ],
    notes: ['This action is irreversible'],
  },
  {
    id: 'users-get-profile',
    name: 'Get Current User Profile',
    description: 'Retrieve the profile of the currently authenticated user.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/api/users/me',
    category: 'Users',
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns current user profile' },
      { code: 401, meaning: 'Unauthorized', description: 'Missing or invalid token' },
    ],
  },
]
