import { createClient } from '@hey-api/openapi-ts';
const args = process.argv;

createClient({
  input: args.at(-1),
  output: 'src/generated',
  plugins: ['@hey-api/client-fetch'],
});

// http://localhost:5000/docs/swagger.json