#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "post": {
      "name": "'"${NAME}"'",
      "location": "'"${LOCATION}"'",
      "content": "'"${CONTENT}"'",
      "rating": "'"${RATING}"'"
    }
  }'

echo