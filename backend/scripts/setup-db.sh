#!/bin/bash

echo "🚀 Director of One - Database Setup"
echo "=================================="

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first: https://www.postgresql.org/download/"
    exit 1
fi

# Create database if it doesn't exist
echo "📦 Creating database..."
createdb directorofone 2>/dev/null || echo "Database 'directorofone' already exists"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run migrations
echo "🔄 Running database migrations..."
npm run db:push

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now:"
echo "  - Start the development server: npm run dev"
echo "  - View the database: npm run db:studio"
echo "  - Reset the database: npm run db:reset"