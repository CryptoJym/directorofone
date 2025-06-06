#!/bin/bash

# Test script for DirectorOfOne Integration API endpoints

API_BASE="http://localhost:3000/api/v1"
USER_ID="test-user-123"

echo "🔧 Testing DirectorOfOne Integration API..."
echo "========================================="

# Test 1: Get available integrations
echo -e "\n1️⃣ GET /integrations/available"
curl -s -X GET "$API_BASE/integrations/available" | jq '.'

# Test 2: Get available integrations filtered by category
echo -e "\n2️⃣ GET /integrations/available?category=task-management"
curl -s -X GET "$API_BASE/integrations/available?category=task-management" | jq '.'

# Test 3: Get connected integrations (should be empty initially)
echo -e "\n3️⃣ GET /integrations/connected"
curl -s -X GET "$API_BASE/integrations/connected" \
  -H "x-user-id: $USER_ID" | jq '.'

# Test 4: Connect an integration (Slack)
echo -e "\n4️⃣ POST /integrations/connect (Slack)"
CONNECTION_RESPONSE=$(curl -s -X POST "$API_BASE/integrations/connect" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "integrationId": "slack",
    "config": {
      "workspace": "test-workspace",
      "channel": "#general"
    }
  }')
echo "$CONNECTION_RESPONSE" | jq '.'

# Extract connection ID
CONNECTION_ID=$(echo "$CONNECTION_RESPONSE" | jq -r '.connection.id')
echo "Connection ID: $CONNECTION_ID"

# Test 5: Connect another integration (Trello)
echo -e "\n5️⃣ POST /integrations/connect (Trello)"
curl -s -X POST "$API_BASE/integrations/connect" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "integrationId": "trello"
  }' | jq '.'

# Test 6: Get connected integrations again
echo -e "\n6️⃣ GET /integrations/connected (after connecting)"
curl -s -X GET "$API_BASE/integrations/connected" \
  -H "x-user-id: $USER_ID" | jq '.'

# Test 7: Get integration statistics
echo -e "\n7️⃣ GET /integrations/stats"
curl -s -X GET "$API_BASE/integrations/stats" \
  -H "x-user-id: $USER_ID" | jq '.'

# Test 8: Sync an integration
echo -e "\n8️⃣ POST /integrations/$CONNECTION_ID/sync"
curl -s -X POST "$API_BASE/integrations/$CONNECTION_ID/sync" \
  -H "x-user-id: $USER_ID" | jq '.'

# Test 9: Try to connect an already connected integration (should fail)
echo -e "\n9️⃣ POST /integrations/connect (duplicate - should fail)"
curl -s -X POST "$API_BASE/integrations/connect" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "integrationId": "slack"
  }' | jq '.'

# Test 10: Disconnect an integration
echo -e "\n🔟 DELETE /integrations/$CONNECTION_ID"
curl -s -X DELETE "$API_BASE/integrations/$CONNECTION_ID" \
  -H "x-user-id: $USER_ID" | jq '.'

# Test 11: Get final stats
echo -e "\n1️⃣1️⃣ GET /integrations/stats (final)"
curl -s -X GET "$API_BASE/integrations/stats" \
  -H "x-user-id: $USER_ID" | jq '.'

echo -e "\n✅ Integration API tests completed!"