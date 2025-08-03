#!/bin/bash

# Generate SSL certificates for development
# This script creates self-signed certificates for local development

echo "🔐 Generating SSL certificates for development..."

# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=Development/L=Local/O=SmartShort/CN=localhost"

# Set proper permissions
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem

echo "✅ SSL certificates generated successfully!"
echo "📁 Location: nginx/ssl/"
echo "🔑 Key: nginx/ssl/key.pem"
echo "📜 Certificate: nginx/ssl/cert.pem"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use real certificates from a trusted CA." 