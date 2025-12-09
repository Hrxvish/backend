# Retail Sales Management System - Backend

## Overview
Backend service for TruEstate Retail Sales Management System.  
Handles full-text search, multi-select/range-based filters, sorting, and pagination over the sales dataset.

## Tech Stack
Node.js

Express.js

MongoDB + Mongoose

REST API (JSON)

Modular service-based architecture

Environment Variables (.env)

## Search Implementation Summary
- Full-text search on **Customer Name** and **Phone Number** (case-insensitive).
- Implemented in `salesService.getSales` using a single search pipeline.
- Search works in combination with filters, sorting, and pagination.

## Filter Implementation Summary
- Multi-select filters:
  - Customer Region, Gender, Product Category, Tags, Payment Method
- Range filters:
  - Age Range (ageMin, ageMax)
  - Date Range (dateFrom, dateTo)
- All filters parsed once in `queryParser.parseQuery` and applied in a single filter pipeline.
- Invalid numeric ranges (e.g., ageMin > ageMax) are handled by swapping bounds.

## Sorting Implementation Summary
- Supported sort fields:
  - Date (default: Newest first)
  - Quantity
  - Customer Name (A–Z / Z–A)
- Sorting is applied after filters in `sortRecords`, preserving all active search and filter constraints.

## Pagination Implementation Summary
- Page size default: **10 items per page** (configurable via `limit`).
- Inputs: `page`, `limit` query params.
- Outputs: `meta` object with page, totalPages, totalItems, hasNextPage, hasPrevPage.
- Pagination preserves the current search, filter, and sort state.

## Setup Instructions

1. Install dependencies:
   ```bash
   cd backend
   npm install
