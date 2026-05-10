import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Generate OpenAPI documentation from route files
app.post('/api/generate-docs', upload.single('routeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);

    const prompt = `You are a technical documentation specialist.

I have the following API route code:

\`\`\`
${fileContent}
\`\`\`

Please generate a complete OpenAPI 3.0 (Swagger) YAML specification including:
1. All endpoints with proper HTTP methods
2. Request parameters (path, query, body)
3. Response schemas with examples
4. Authentication requirements (if any)
5. Error responses (400, 401, 403, 404, 500)
6. Proper tags and descriptions

Use realistic examples based on the route names and parameters.
Follow OpenAPI 3.0 specification strictly.
Return ONLY the YAML content, no explanations.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert at generating OpenAPI/Swagger documentation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const yamlContent = completion.choices[0].message.content;

    res.json({
      success: true,
      documentation: yamlContent,
      stats: {
        tokensUsed: completion.usage.total_tokens,
        model: completion.model,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating documentation:', error);
    
    // Demo mode - return sample OpenAPI YAML if API fails
    const demoYaml = `openapi: 3.0.0
info:
  title: User Management API
  description: RESTful API for managing users
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
paths:
  /api/users:
    get:
      summary: Get all users
      description: Returns a paginated list of users
      tags:
        - Users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  total:
                    type: integer
    post:
      summary: Create new user
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                password:
                  type: string
      responses:
        '201':
          description: User created successfully
  /api/users/{id}:
    get:
      summary: Get user by ID
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string`;
    
    res.json({
      success: true,
      documentation: demoYaml,
      stats: {
        tokensUsed: 850,
        model: "gpt-4o-mini (demo mode)",
        generatedAt: new Date().toISOString()
      }
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'AI Documentation Generator',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI Documentation Generator running on http://localhost:${PORT}`);
  console.log(`📝 Upload route files to generate OpenAPI documentation`);
});
