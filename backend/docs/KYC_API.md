# KYC API Documentation

## Overview

The KYC (Know Your Customer) API provides endpoints for managing user verification processes in the Solia Invest platform. This includes document submission, status checking, and administrative review workflows.

## Base URL

`/api/kyc`

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Submit KYC Profile

**POST** `/submit`

Submit KYC documents for verification.

**Request Body:**

```json
{
  "documents": [
    {
      "type": "id_card",
      "url": "https://example.com/document1.jpg"
    },
    {
      "type": "proof_of_address", 
      "url": "https://example.com/document2.jpg"
    }
  ]
}
```

**Response:**

```json
{
  "message": "KYC profile submitted successfully",
  "profile": { ... },
  "documents": [ ... ]
}
```

### 2. Get KYC Status

**GET** `/status`

Get the current KYC status for the authenticated user.

**Response:**

```json
{
  "profile": {
    "_id": "profile_id",
    "userId": "user_id",
    "status": "pending",
    "submittedAt": "2024-01-01T00:00:00.000Z",
    "reviewedAt": null,
    "reviewerId": null,
    "notes": null
  },
  "documents": [
    {
      "_id": "document_id",
      "type": "id_card",
      "url": "https://example.com/document.jpg",
      "status": "pending",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Review KYC Profile (Admin Only)

**POST** `/:profileId/review`

Review and approve/reject a KYC profile.

**Request Body:**

```json
{
  "status": "approved",
  "notes": "Documents verified successfully"
}
```

**Response:**

```json
{
  "message": "KYC profile approved successfully",
  "profile": { ... }
}
```

### 4. List Pending KYC Profiles (Admin Only)

**GET** `/pending`

Get a list of all pending KYC profiles.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "profiles": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 5. Get KYC Profile by ID (Admin Only)

**GET** `/:profileId`

Get detailed information about a specific KYC profile.

**Response:**

```json
{
  "profile": { ... },
  "documents": [ ... ]
}
```

## Document Types

- `id_card` - National ID card or passport
- `passport` - Passport document
- `proof_of_address` - Utility bill, bank statement, etc.
- `other` - Other supporting documents

## Status Values

- `pending` - Awaiting review
- `approved` - Verification successful
- `rejected` - Verification failed

## Middleware

- `checkKycApproved` - Blocks actions requiring KYC verification
- `checkKycSubmitted` - Requires KYC submission before proceeding
- `checkKycPending` - Validates profile is in pending state for admin actions

## Error Responses

Common error responses include:

- `400` - Bad request (invalid data)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error
