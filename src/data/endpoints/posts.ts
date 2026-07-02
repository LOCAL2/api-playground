import type { ApiEndpoint } from '@/types'

const BASE_URL = 'https://api.example.com/v1'

export const postEndpoints: ApiEndpoint[] = [
  {
    id: 'posts-list',
    name: 'List All Posts',
    description: 'Retrieve a paginated list of published blog posts.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/posts',
    category: 'Posts',
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Posts per page', example: '10' },
      { name: 'userId', type: 'string', required: false, description: 'Filter by author user ID', example: 'usr_123' },
      { name: 'tag', type: 'string', required: false, description: 'Filter by tag', example: 'javascript' },
      { name: 'search', type: 'string', required: false, description: 'Search in title and content', example: 'api design' },
      { name: 'status', type: 'string', required: false, description: 'Filter by status: published, draft (auth required for draft)', example: 'published' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns paginated posts list' },
    ],
  },
  {
    id: 'posts-get-by-id',
    name: 'Get Post by ID',
    description: 'Retrieve a single post with its full content.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post unique identifier' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns post with full content' },
      { code: 404, meaning: 'Not Found', description: 'Post not found' },
    ],
  },
  {
    id: 'posts-create',
    name: 'Create Post',
    description: 'Publish a new blog post or save as draft.',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/posts',
    category: 'Posts',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'Post title', example: 'Introduction to REST APIs' },
        { name: 'content', type: 'string', required: true, description: 'Post body content (Markdown supported)' },
        { name: 'excerpt', type: 'string', required: false, description: 'Short summary for preview' },
        { name: 'tags', type: 'string[]', required: false, description: 'Array of tag strings', example: '["api", "rest", "tutorial"]' },
        { name: 'status', type: 'string', required: false, description: 'published or draft (default: draft)', example: 'published' },
        { name: 'coverImage', type: 'string', required: false, description: 'URL for cover image' },
      ],
    },
    requiresAuth: true,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'Post created successfully' },
      { code: 400, meaning: 'Bad Request', description: 'Missing title or content' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
    ],
  },
  {
    id: 'posts-update',
    name: 'Update Post',
    description: 'Update an existing post content and metadata.',
    method: 'PUT',
    baseUrl: BASE_URL,
    path: '/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'Post title' },
        { name: 'content', type: 'string', required: true, description: 'Post body content' },
        { name: 'tags', type: 'string[]', required: false, description: 'Updated tags' },
        { name: 'status', type: 'string', required: false, description: 'published or draft' },
      ],
    },
    requiresAuth: true,
    authNote: 'Only the post author or admin can update',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Post updated' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error' },
      { code: 403, meaning: 'Forbidden', description: 'Not the author' },
      { code: 404, meaning: 'Not Found', description: 'Post not found' },
    ],
  },
  {
    id: 'posts-delete',
    name: 'Delete Post',
    description: 'Permanently delete a post and its comments.',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/posts/:id',
    category: 'Posts',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Post unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'Post deleted' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
      { code: 403, meaning: 'Forbidden', description: 'Not the author or admin' },
      { code: 404, meaning: 'Not Found', description: 'Post not found' },
    ],
  },
]
