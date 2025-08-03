# SmartShort Backend API Documentation

## Overview
SmartShort is a full-stack URL shortening application with AI-powered analytics, real-time tracking, and comprehensive user management.

## Base URL
```
http://localhost:5000
```

## Authentication
- **Current Status**: Backend uses `userId` in request body/query for demo purposes
- **Frontend Auth**: Handled entirely by NextAuth.js (JWT sessions)
- **Note**: Backend expects `userId` to be passed in requests for user-specific operations

## API Endpoints

### 1. URL Management (`/api/urls`)

#### POST `/api/urls/create`
**Purpose**: Create a new shortened URL
**Authentication**: Requires `userId` in request body
**Input**:
```json
{
  "originalUrl": "https://example.com",
  "customAlias": "optional-custom-alias",
  "title": "Optional Title",
  "description": "Optional description",
  "expiresAt": "2024-12-31T23:59:59Z",
  "userId": "user_id_here"
}
```
**Output**:
```json
{
  "success": true,
  "data": {
    "_id": "url_id",
    "originalUrl": "https://example.com",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:5000/r/abc123",
    "title": "Optional Title",
    "description": "Optional description",
    "clicks": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "userId": "user_id"
  },
  "metadata": {
    "suggestedAlias": "suggested-alias",
    "category": "category"
  }
}
```

#### GET `/api/urls/user`
**Purpose**: Get user's URLs with pagination and filtering
**Authentication**: Requires `userId` in query params
**Query Parameters**:
- `userId`: User ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: 'createdAt')
- `order`: Sort order ('asc' or 'desc', default: 'desc')

**Output**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "url_id",
      "originalUrl": "https://example.com",
      "shortCode": "abc123",
      "title": "Link Title",
      "description": "Link description",
      "clicks": 15,
      "uniqueClicks": 12,
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": null,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET `/api/urls/top/list`
**Purpose**: Get top performing URLs (public)
**Authentication**: None required
**Query Parameters**:
- `limit`: Number of URLs to return (default: 10)

**Output**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "url_id",
      "shortCode": "abc123",
      "title": "Popular Link",
      "clicks": 1500,
      "domain": "example.com"
    }
  ]
}
```

#### GET `/api/urls/search`
**Purpose**: Search URLs by title, description, or keywords
**Authentication**: Requires `userId` in query params
**Query Parameters**:
- `userId`: User ID
- `q`: Search query
- `page`: Page number
- `limit`: Items per page

**Output**: Same as `/api/urls/user`

#### GET `/api/urls/:urlId`
**Purpose**: Get single URL details
**Authentication**: Requires `userId` in query params
**Output**:
```json
{
  "success": true,
  "data": {
    "_id": "url_id",
    "originalUrl": "https://example.com",
    "shortCode": "abc123",
    "title": "Link Title",
    "description": "Link description",
    "keywords": ["keyword1", "keyword2"],
    "clicks": 15,
    "uniqueClicks": 12,
    "clickHistory": [...],
    "createdAt": "2024-01-01T00:00:00Z",
    "expiresAt": null
  }
}
```

#### GET `/api/urls/:urlId/stats`
**Purpose**: Get detailed URL statistics
**Authentication**: Requires `userId` in query params
**Output**:
```json
{
  "success": true,
  "data": {
    "url": {
      "_id": "url_id",
      "shortCode": "abc123",
      "title": "Link Title"
    },
    "stats": {
      "totalClicks": 150,
      "uniqueClicks": 120,
      "clickRate": 5.2,
      "topReferrers": [...],
      "topCountries": [...],
      "topBrowsers": [...],
      "clicksByDay": {...}
    }
  }
}
```

#### PUT `/api/urls/:urlId`
**Purpose**: Update URL details
**Authentication**: Requires `userId` in request body
**Input**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "expiresAt": "2024-12-31T23:59:59Z",
  "userId": "user_id"
}
```

#### DELETE `/api/urls/:urlId`
**Purpose**: Delete a URL
**Authentication**: Requires `userId` in request body
**Input**:
```json
{
  "userId": "user_id"
}
```

#### DELETE `/api/urls/bulk/delete`
**Purpose**: Bulk delete multiple URLs
**Authentication**: Requires `userId` in request body
**Input**:
```json
{
  "urlIds": ["url_id_1", "url_id_2"],
  "userId": "user_id"
}
```

### 2. Analytics (`/api/analytics`)

#### GET `/api/analytics/user/stats`
**Purpose**: Get user dashboard statistics
**Authentication**: Requires `userId` in query params
**Output**:
```json
{
  "success": true,
  "data": {
    "totalUrls": 25,
    "totalClicks": 1500,
    "recentUrls": 5,
    "topUrls": [
      {
        "_id": "url_id",
        "shortCode": "abc123",
        "originalUrl": "https://example.com",
        "clicks": 150,
        "title": "Top Link"
      }
    ],
    "clicksByDay": {
      "2024-01-01": 25,
      "2024-01-02": 30
    }
  }
}
```

#### GET `/api/analytics/user/timeline`
**Purpose**: Get user activity timeline
**Authentication**: Requires `userId` in query params
**Output**:
```json
{
  "success": true,
  "data": [
    {
      "type": "url_created",
      "urlId": "url_id",
      "shortCode": "abc123",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "type": "url_clicked",
      "urlId": "url_id",
      "clicks": 15,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### GET `/api/analytics/url/:urlId/performance`
**Purpose**: Get detailed URL performance analytics
**Authentication**: Requires `userId` in query params
**Output**:
```json
{
  "success": true,
  "data": {
    "url": {
      "_id": "url_id",
      "shortCode": "abc123",
      "title": "Link Title"
    },
    "performance": {
      "totalClicks": 150,
      "uniqueClicks": 120,
      "clickRate": 5.2,
      "conversionRate": 0.8,
      "topReferrers": [...],
      "topCountries": [...],
      "topBrowsers": [...],
      "clicksByHour": {...},
      "clicksByDay": {...}
    }
  }
}
```

#### GET `/api/analytics/global/stats`
**Purpose**: Get global statistics (public)
**Authentication**: None required
**Output**:
```json
{
  "success": true,
  "data": {
    "totalUrls": 10000,
    "totalClicks": 500000,
    "totalUsers": 1000,
    "recentUrls": 150,
    "topUrls": [...]
  }
}
```

### 3. URL Redirection

#### GET `/r/:shortCode`
**Purpose**: Redirect short URL to original URL
**Authentication**: None required
**Behavior**: 
- Updates click statistics
- Emits real-time updates via Socket.IO
- Redirects to original URL

### 4. Health Check

#### GET `/api/health`
**Purpose**: Health check endpoint
**Authentication**: None required
**Output**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600
}
```

### 5. Test Routes (`/api/test`)

#### POST `/api/test/setup-demo`
**Purpose**: Create demo user and test data
**Authentication**: None required
**Output**:
```json
{
  "success": true,
  "message": "Demo data created successfully",
  "userId": "demo_user_id",
  "userEmail": "demo@example.com"
}
```

#### GET `/api/test/demo-user`
**Purpose**: Get demo user information
**Authentication**: None required
**Output**:
```json
{
  "success": true,
  "user": {
    "id": "demo_user_id",
    "email": "demo@example.com",
    "name": "Demo User"
  },
  "urlsCount": 3,
  "urls": [...]
}
```

## Socket.IO Events

### Client to Server
- `joinUserRoom`: Join user's private room for real-time updates
- `requestStats`: Request initial statistics

### Server to Client
- `urlClicked`: Emitted when a URL is clicked
- `urlCreated`: Emitted when a new URL is created
- `statsUpdate`: Emitted when statistics are updated

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error message (development only)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Data Models

### User Model
```javascript
{
  email: String (required, unique),
  name: String (required),
  image: String,
  provider: String (enum: ['google', 'credentials']),
  providerId: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### URL Model
```javascript
{
  originalUrl: String (required),
  shortCode: String (required, unique),
  customAlias: String,
  title: String,
  description: String,
  keywords: [String],
  previewImage: String,
  domain: String,
  userId: ObjectId (required, ref: 'User'),
  isActive: Boolean,
  expiresAt: Date,
  clicks: Number,
  uniqueClicks: Number,
  lastClicked: Date,
  clickHistory: [{
    timestamp: Date,
    ip: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String,
    device: String,
    browser: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/smartshort
CORS_ORIGIN=http://localhost:3000
BASE_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
``` 