#!/bin/sh

INPUT_FILE="https://raw.githubusercontent.com/traPtitech/rucQ/main/openapi.yaml"
OUTPUT_FILE="./src/api/schema.d.ts"

npx openapi-typescript $INPUT_FILE -o $OUTPUT_FILE
npm run format
