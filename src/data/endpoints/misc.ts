import type { ApiEndpoint } from '@/types'

const BASE_URL = 'https://api.example.com/v1'

export const miscEndpoints: ApiEndpoint[] = [
  // === COMMENTS ===
  {
    id: 'comments-list-by-post',
    name: 'List Comments by Post',
    description: 'Retrieve all comments for a specific post.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/posts/:postId/comments',
    category: 'Comments',
    pathParameters: [
      { name: 'postId', type: 'string', required: true, description: 'Post unique identifier' },
    ],
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Comments per page', example: '20' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns list of comments' },
      { code: 404, meaning: 'Not Found', description: 'Post not found' },
    ],
  },
  {
    id: 'comments-create',
    name: 'Add Comment',
    description: 'Post a new comment on a blog post.',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/posts/:postId/comments',
    category: 'Comments',
    pathParameters: [
      { name: 'postId', type: 'string', required: true, description: 'Post unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'content', type: 'string', required: true, description: 'Comment text (max 1000 chars)', example: 'Great article!' },
        { name: 'parentId', type: 'string', required: false, description: 'Parent comment ID for replies', example: 'cmt_789' },
      ],
    },
    requiresAuth: true,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'Comment added' },
      { code: 400, meaning: 'Bad Request', description: 'Empty content or content too long' },
      { code: 401, meaning: 'Unauthorized', description: 'Must be logged in to comment' },
      { code: 404, meaning: 'Not Found', description: 'Post not found' },
    ],
  },
  {
    id: 'comments-delete',
    name: 'Delete Comment',
    description: 'Remove a comment from a post.',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/comments/:id',
    category: 'Comments',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Comment unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'Comment deleted' },
      { code: 403, meaning: 'Forbidden', description: 'Not the comment author or admin' },
      { code: 404, meaning: 'Not Found', description: 'Comment not found' },
    ],
  },

  // === TODOS ===
  {
    id: 'todos-list',
    name: 'List Todos',
    description: 'Get all todo items for the authenticated user.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/todos',
    category: 'Todos',
    queryParameters: [
      { name: 'completed', type: 'boolean', required: false, description: 'Filter by completion status', example: 'false' },
      { name: 'priority', type: 'string', required: false, description: 'Filter by priority: low, medium, high', example: 'high' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns user\'s todo list' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
    ],
  },
  {
    id: 'todos-create',
    name: 'Create Todo',
    description: 'Add a new todo item.',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/todos',
    category: 'Todos',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'title', type: 'string', required: true, description: 'Todo title', example: 'Study REST API chapter 3' },
        { name: 'description', type: 'string', required: false, description: 'Additional details' },
        { name: 'priority', type: 'string', required: false, description: 'low, medium, or high (default: medium)', example: 'high' },
        { name: 'dueDate', type: 'string', required: false, description: 'Due date in ISO 8601 format', example: '2025-12-31T23:59:59Z' },
      ],
    },
    requiresAuth: true,
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'Todo created' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
    ],
  },
  {
    id: 'todos-toggle',
    name: 'Toggle Todo Completion',
    description: 'Mark a todo as completed or uncompleted.',
    method: 'PATCH',
    baseUrl: BASE_URL,
    path: '/todos/:id/toggle',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Todo unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Todo completion status toggled' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
      { code: 404, meaning: 'Not Found', description: 'Todo not found' },
    ],
  },
  {
    id: 'todos-delete',
    name: 'Delete Todo',
    description: 'Remove a todo item.',
    method: 'DELETE',
    baseUrl: BASE_URL,
    path: '/todos/:id',
    category: 'Todos',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Todo unique identifier' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token' },
    ],
    requiresAuth: true,
    statusCodes: [
      { code: 204, meaning: 'No Content', description: 'Todo deleted' },
      { code: 404, meaning: 'Not Found', description: 'Todo not found' },
    ],
  },

  // === CATEGORIES ===
  {
    id: 'categories-list',
    name: 'List Categories',
    description: 'Retrieve all product/content categories.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/categories',
    category: 'Categories',
    queryParameters: [
      { name: 'parentId', type: 'string', required: false, description: 'Filter by parent category (null for top-level)', example: 'cat_top' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns category tree' },
    ],
  },
  {
    id: 'categories-create',
    name: 'Create Category',
    description: 'Add a new product or content category.',
    method: 'POST',
    baseUrl: BASE_URL,
    path: '/categories',
    category: 'Categories',
    requiredHeaders: [
      { name: 'Content-Type', value: 'application/json', description: 'Request body format' },
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin)' },
    ],
    requestBody: {
      contentType: 'application/json',
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Category name', example: 'Electronics' },
        { name: 'slug', type: 'string', required: true, description: 'URL-friendly identifier', example: 'electronics' },
        { name: 'description', type: 'string', required: false, description: 'Category description' },
        { name: 'parentId', type: 'string', required: false, description: 'Parent category ID for subcategories' },
        { name: 'image', type: 'string', required: false, description: 'Category image URL' },
      ],
    },
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 201, meaning: 'Created', description: 'Category created' },
      { code: 400, meaning: 'Bad Request', description: 'Validation error or duplicate slug' },
      { code: 403, meaning: 'Forbidden', description: 'Admin only' },
    ],
  },

  // === COUNTRIES ===
  {
    id: 'countries-list',
    name: 'List All Countries',
    description: 'Retrieve a list of all countries with their codes and basic information.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/countries',
    category: 'Countries',
    queryParameters: [
      { name: 'region', type: 'string', required: false, description: 'Filter by region: Asia, Europe, Americas, Africa, Oceania', example: 'Asia' },
      { name: 'search', type: 'string', required: false, description: 'Search by country name', example: 'Thai' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns list of countries' },
    ],
  },
  {
    id: 'countries-get-by-code',
    name: 'Get Country by Code',
    description: 'Retrieve detailed information about a country using its ISO 3166-1 alpha-2 code.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/countries/:code',
    category: 'Countries',
    pathParameters: [
      { name: 'code', type: 'string', required: true, description: 'ISO 3166-1 alpha-2 country code (e.g., TH, US, JP)' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns country details' },
      { code: 404, meaning: 'Not Found', description: 'Country code not found' },
    ],
  },

  // === SPORTS ===
  {
    id: 'sports-teams-list',
    name: 'List Sports Teams',
    description: 'Retrieve a list of sports teams with filtering options.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/sports/teams',
    category: 'Sports',
    queryParameters: [
      { name: 'sport', type: 'string', required: false, description: 'Filter by sport type: football, basketball, tennis', example: 'football' },
      { name: 'country', type: 'string', required: false, description: 'Filter by country code', example: 'TH' },
      { name: 'league', type: 'string', required: false, description: 'Filter by league name', example: 'Premier League' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns list of teams' },
    ],
  },
  {
    id: 'sports-players-get',
    name: 'Get Player Details',
    description: 'Retrieve detailed statistics and profile of a sports player.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/sports/players/:id',
    category: 'Sports',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Player unique identifier' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns player profile and stats' },
      { code: 404, meaning: 'Not Found', description: 'Player not found' },
    ],
  },

  // === MOVIES ===
  {
    id: 'movies-list',
    name: 'List Movies',
    description: 'Retrieve a paginated list of movies with filtering and sorting.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/movies',
    category: 'Movies',
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Items per page', example: '20' },
      { name: 'genre', type: 'string', required: false, description: 'Filter by genre', example: 'Action' },
      { name: 'year', type: 'integer', required: false, description: 'Filter by release year', example: '2024' },
      { name: 'minRating', type: 'number', required: false, description: 'Minimum rating (0-10)', example: '7.0' },
      { name: 'search', type: 'string', required: false, description: 'Search by title', example: 'Avengers' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns paginated movie list' },
    ],
  },
  {
    id: 'movies-get-by-id',
    name: 'Get Movie Details',
    description: 'Retrieve detailed information about a specific movie.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/movies/:id',
    category: 'Movies',
    pathParameters: [
      { name: 'id', type: 'string', required: true, description: 'Movie unique identifier' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns movie details' },
      { code: 404, meaning: 'Not Found', description: 'Movie not found' },
    ],
  },

  // === BOOKS ===
  {
    id: 'books-list',
    name: 'List Books',
    description: 'Retrieve a list of books with filtering by genre, author, and rating.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/books',
    category: 'Books',
    queryParameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Items per page', example: '20' },
      { name: 'genre', type: 'string', required: false, description: 'Filter by genre', example: 'Technology' },
      { name: 'author', type: 'string', required: false, description: 'Filter by author name', example: 'Robert Martin' },
      { name: 'search', type: 'string', required: false, description: 'Search by title or ISBN', example: 'Clean Code' },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns paginated book list' },
    ],
  },
  {
    id: 'books-get-by-isbn',
    name: 'Get Book by ISBN',
    description: 'Retrieve detailed book information using its ISBN.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/books/:isbn',
    category: 'Books',
    pathParameters: [
      { name: 'isbn', type: 'string', required: true, description: 'ISBN-10 or ISBN-13 code', },
    ],
    requiresAuth: false,
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns book details' },
      { code: 404, meaning: 'Not Found', description: 'Book not found' },
    ],
  },

  // === DASHBOARD ===
  {
    id: 'dashboard-stats',
    name: 'Get Dashboard Statistics',
    description: 'Retrieve summary statistics for the admin dashboard.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/dashboard/stats',
    category: 'Dashboard',
    queryParameters: [
      { name: 'period', type: 'string', required: false, description: 'Time period: today, week, month, year', example: 'month' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns aggregated statistics' },
      { code: 401, meaning: 'Unauthorized', description: 'Invalid token' },
      { code: 403, meaning: 'Forbidden', description: 'Admin only' },
    ],
  },
  {
    id: 'dashboard-revenue',
    name: 'Get Revenue Report',
    description: 'Retrieve revenue data broken down by period for charts and analytics.',
    method: 'GET',
    baseUrl: BASE_URL,
    path: '/dashboard/revenue',
    category: 'Dashboard',
    queryParameters: [
      { name: 'from', type: 'string', required: true, description: 'Start date (ISO 8601)', example: '2025-01-01' },
      { name: 'to', type: 'string', required: true, description: 'End date (ISO 8601)', example: '2025-12-31' },
      { name: 'groupBy', type: 'string', required: false, description: 'Group by: day, week, month', example: 'month' },
    ],
    requiredHeaders: [
      { name: 'Authorization', value: 'Bearer {token}', description: 'JWT access token (admin)' },
    ],
    requiresAuth: true,
    authNote: 'Admin role required',
    statusCodes: [
      { code: 200, meaning: 'OK', description: 'Returns revenue data array' },
      { code: 400, meaning: 'Bad Request', description: 'Invalid date range' },
      { code: 403, meaning: 'Forbidden', description: 'Admin only' },
    ],
  },
]
