#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "post": {
      "title": "'"${TITLE}"'",
      "location": "'"${LOCATION}"'",
      "content": "'"${CONTENT}"'",
      "rating": "'"${RATING}"'"
    }
  }'

echo
