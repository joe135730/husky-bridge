# API Endpoint Audit - AWS Migration

## Summary
This document audits all API endpoints to ensure they work correctly after migration from Netlify/Render to AWS.

## Issues Found

### 1. ✅ API Base URL Configuration
- **Status**: Correctly configured
- **Location**: `src/api/client.ts`, `src/CreatePost/client.tsx`
- **Current**: Uses `VITE_API_BASE` environment variable
- **Docker Build**: Correctly passes `VITE_API_BASE=http://husky-bridge-alb-384228871.us-east-2.elb.amazonaws.com/api`
- **Action**: None needed

### 2. ⚠️ Duplicate API Client
- **Issue**: `src/CreatePost/client.tsx` has its own axios instance
- **Problem**: Duplicates functionality from `src/Posts/client.ts`
- **Risk**: Inconsistency, maintenance burden
- **Action**: Should consolidate to use `Posts/client.ts`

### 3. ✅ CORS Configuration
- **Status**: Correctly configured for AWS ALB
- **Location**: `husky-bridge-server/index.js`
- **Current**: Includes ALB URL patterns
- **Action**: None needed

### 4. ✅ Session Configuration
- **Status**: Correctly configured with MongoDB session store
- **Location**: `husky-bridge-server/index.js`
- **Action**: None needed

## Frontend API Calls Audit

### Users API (`/api/users/*`)
| Endpoint | Frontend Call | Backend Route | Status |
|----------|---------------|---------------|--------|
| Signup | `POST /users/signup` | `POST /api/users/signup` | ✅ |
| Signin | `POST /users/signin` | `POST /api/users/signin` | ✅ |
| Signout | `POST /users/signout` | `POST /api/users/signout` | ✅ |
| Profile | `POST /users/profile` | `POST /api/users/profile` | ✅ |
| Get All Users | `GET /users` | `GET /api/users` | ✅ |
| Get User By ID | `GET /users/:id` | `GET /api/users/:id` | ✅ |
| Update User | `PUT /users/:id` | `PUT /api/users/:id` | ✅ |
| Delete User | `DELETE /users/:id` | `DELETE /api/users/:id` | ✅ |

### Posts API (`/api/posts/*`)
| Endpoint | Frontend Call | Backend Route | Status |
|----------|---------------|---------------|--------|
| Create Post | `POST /posts` | `POST /api/posts` | ✅ |
| Get All Posts | `GET /posts` | `GET /api/posts` | ✅ |
| Get My Posts | `GET /posts/user` | `GET /api/posts/user` | ✅ |
| Get Participating Posts | `GET /posts/participating` | `GET /api/posts/participating` | ✅ |
| Get Post By ID | `GET /posts/:id` | `GET /api/posts/:id` | ✅ |
| Update Post | `PUT /posts/:id` | `PUT /api/posts/:id` | ✅ |
| Delete Post | `DELETE /posts/:id` | `DELETE /api/posts/:id` | ✅ |
| Mark Complete (Owner) | `PUT /posts/:id/complete-owner` | `PUT /api/posts/:id/complete-owner` | ✅ |
| Mark Complete (Participant) | `PUT /posts/:id/complete-participant` | `PUT /api/posts/:id/complete-participant` | ✅ |
| Participate | `PUT /posts/:id/participate` | `PUT /api/posts/:id/participate` | ✅ |
| Select Participant | `PUT /posts/:id/select/:participantId` | `PUT /api/posts/:id/select/:participantId` | ✅ |
| Get Participants | `GET /posts/:id/participants` | `GET /api/posts/:id/participants` | ✅ |
| Filter Posts | `GET /posts/filter` | `GET /api/posts/filter` | ✅ |
| Mark Complete | `PUT /posts/:id/mark-complete` | `PUT /api/posts/:id/mark-complete` | ✅ |
| Get By Category | `GET /posts/category/:category` | `GET /api/posts/category/:category` | ✅ |
| Get By Categories | `POST /posts/categories` | `POST /api/posts/categories` | ✅ |
| Get By Title | `GET /posts/title/:title` | `GET /api/posts/title/:title` | ✅ |
| Remove Participant | `DELETE /posts/:id/participants/:participantId` | `DELETE /api/posts/:id/participants/:participantId` | ✅ |
| Remove From My Posts | `PUT /posts/:id/remove-from-my-posts` | `PUT /api/posts/:id/remove-from-my-posts` | ✅ |
| Cancel Collaboration | `PUT /posts/:id/cancel-collaboration` | `PUT /api/posts/:id/cancel-collaboration` | ✅ |
| Remove Completed Post | `PUT /posts/:id/remove-completed-post` | `PUT /api/posts/:id/remove-completed-post` | ✅ |

### Chat API (`/api/chat/*`)
| Endpoint | Frontend Call | Backend Route | Status |
|----------|---------------|---------------|--------|
| Get Messages | `GET /chat/:roomId` | `GET /api/chat/:roomId` | ✅ |
| Send Message | `POST /chat` | `POST /api/chat` | ✅ |

### Reports API (`/api/reports/*`)
| Endpoint | Frontend Call | Backend Route | Status |
|----------|---------------|---------------|--------|
| Get All Reports | `GET /reports` | `GET /api/reports` | ✅ |
| Get Reported Post | `GET /reports/:postId` | `GET /api/reports/:postId` | ✅ |
| Report Post | `POST /posts/:postId/report` | `POST /api/posts/:postId/report` | ✅ |
| Keep Post | `POST /reports/:postId/keep` | `POST /api/reports/:postId/keep` | ✅ |
| Delete Reported Post | `DELETE /reports/:postId` | `DELETE /api/reports/:postId` | ✅ |
| Auth Test | `GET /reports-auth-test` | `GET /api/reports-auth-test` | ✅ |

### Auth API (`/api/auth/*`)
| Endpoint | Frontend Call | Backend Route | Status |
|----------|---------------|---------------|--------|
| Check Auth | `GET /auth/current` | `GET /api/auth/current` | ✅ |
| Check Admin | `GET /auth/check-admin` | `GET /api/auth/check-admin` | ✅ |

## Potential Issues

### 1. Reports Routes Path
- **Issue**: Reports router is mounted at `/api` in `index.js`, but routes are defined as `/reports/*`
- **Result**: Actual endpoints are `/api/reports/*` ✅ (Correct)
- **Frontend**: Calls `/reports` which becomes `/api/reports` ✅ (Correct due to baseURL)

### 2. CreatePost Client Duplication
- **Issue**: `CreatePost/client.tsx` duplicates API calls
- **Impact**: Code duplication, potential inconsistencies
- **Recommendation**: Use `Posts/client.ts` instead

## Recommendations

1. ✅ **CORS**: Already correctly configured for AWS ALB
2. ✅ **Session**: Already using MongoDB session store
3. ✅ **API Base URL**: Correctly configured in Docker build
4. ⚠️ **Code Cleanup**: Consider removing duplicate `CreatePost/client.tsx`
5. ✅ **All Endpoints**: All endpoints match between frontend and backend

## Testing Checklist

- [ ] Test all user authentication endpoints
- [ ] Test all post CRUD operations
- [ ] Test chat functionality
- [ ] Test reports functionality (admin only)
- [ ] Test session persistence across page refreshes
- [ ] Test logout functionality
- [ ] Test My Posts page
- [ ] Test Post Detail page after edit

## Notes

- All API calls use `axiosWithCredentials` with `baseURL: API_BASE` (which includes `/api`)
- Frontend calls like `/users/signin` become `/api/users/signin` automatically
- CORS is configured to allow requests from the ALB domain
- Session cookies are configured for HTTP (not HTTPS yet)

