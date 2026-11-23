import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number.parseInt(process.env.PORT || '8082', 10)
const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), 'data', 'offices.json')
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

async function readJsonBody(request) {
  let body = ''

  for await (const chunk of request) {
    body += chunk
    if (Buffer.byteLength(body) > 1024 * 1024) {
      throw Object.assign(new Error('Request body is too large.'), { status: 413 })
    }
  }

  try {
    return JSON.parse(body)
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 })
  }
}

async function readOffices() {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin
  if (ALLOWED_ORIGINS.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  const url = new URL(request.url, 'http://localhost')
  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, { status: 'ok' })
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/offices') {
    try {
      sendJson(response, 200, await readOffices())
    } catch (error) {
      console.error('Failed to read offices:', error)
      sendJson(response, 500, { message: 'Offices could not be loaded.' })
    }
    return
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/api/offices/')) {
    const id = decodeURIComponent(url.pathname.slice('/api/offices/'.length))

    try {
      const offices = await readOffices()
      const remainingOffices = offices.filter((office) => office.id !== id)

      if (remainingOffices.length === offices.length) {
        sendJson(response, 404, { message: 'Office not found.' })
        return
      }

      await mkdir(dirname(DATA_FILE), { recursive: true })
      await writeFile(DATA_FILE, `${JSON.stringify(remainingOffices, null, 2)}\n`, 'utf8')
      sendJson(response, 200, { message: 'Office deleted successfully.' })
    } catch (error) {
      console.error('Failed to delete office:', error)
      sendJson(response, 500, { message: 'Office could not be deleted.' })
    }
    return
  }

  if (request.method !== 'POST' || url.pathname !== '/api/offices/save') {
    sendJson(response, 404, { message: 'Route not found.' })
    return
  }

  try {
    const body = await readJsonBody(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const officeNumber = Number(body.officeNumber)

    if (!name || !Number.isInteger(officeNumber)) {
      sendJson(response, 400, {
        message: 'Office name and a valid integer office number are required.',
      })
      return
    }

    const office = {
      id: randomUUID(),
      name,
      officeNumber,
      savedAt: new Date().toISOString(),
    }
    const offices = await readOffices()
    offices.push(office)
    await mkdir(dirname(DATA_FILE), { recursive: true })
    await writeFile(DATA_FILE, `${JSON.stringify(offices, null, 2)}\n`, 'utf8')

    sendJson(response, 201, office)
  } catch (error) {
    console.error('Failed to save office:', error)
    sendJson(response, error.status || 500, {
      message: error.status ? error.message : 'The office could not be saved.',
    })
  }
})

server.listen(PORT, 'localhost', () => {
  console.log(`Office API listening at http://localhost:${PORT}`)
})
