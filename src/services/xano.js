const AUTH_URL = import.meta.env.VITE_XANO_AUTH_URL
const API_URL = import.meta.env.VITE_XANO_API_URL
const API_ORIGIN = (() => {
  try { return new URL(API_URL).origin } catch { return '' }
})()

async function request(base, path, { method = 'GET', body, token, headers = {} } = {}) {
  if (!base) throw new Error('Xano base URL missing')
  const allHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }
  const res = await fetch(`${base}${path}`, {
    method,
    headers: allHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Xano ${method} ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function requestMultipart(base, path, { method = 'POST', formData, token, headers = {} } = {}) {
  if (!base) throw new Error('Xano base URL missing')
  const allHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }
  const res = await fetch(`${base}${path}`, {
    method,
    headers: allHeaders,
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Xano multipart ${method} ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export const xanoAuth = {
  login: (email, password) => request(AUTH_URL, '/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request(AUTH_URL, '/auth/me', { token }),
}

export const xanoProducts = {
  list: () => request(API_URL, '/product'),
  create: (product, token) => request(API_URL, '/product', { method: 'POST', body: product, token }),
  update: (id, product, token) => request(API_URL, `/product/${id}`, { method: 'PUT', body: product, token }),
  remove: (id, token) => request(API_URL, `/product/${id}`, { method: 'DELETE', token }),
}

export async function uploadImage(file, token) {
  if (!file) throw new Error('No file provided')
  const fd = new FormData()
  // Append both common field names to be compatible with different Xano setups
  fd.append('image', file)
  fd.append('file', file)
  const candidates = ['/upload/image', '/upload', '/files', '/file']
  for (const path of candidates) {
    try {
      const res = await requestMultipart(API_URL, path, { method: 'POST', formData: fd, token })
      const url = res?.url ?? res?.path ?? res?.file?.url ?? res?.file?.path ?? res?.data?.url ?? res?.data?.path
      if (url) {
        return makeAbsolute(url)
      }
    } catch (err) {
      // try next endpoint
    }
  }
  throw new Error('Upload endpoint not available')
}

export function mapProduct(p) {
  const id = p?.id ?? p?.ID ?? p?.product_id ?? p?._id ?? p?.uuid
  const name = p?.name ?? p?.title ?? p?.product_name ?? 'Producto'
  const category = p?.category ?? p?.categoria ?? 'Perros'
  const brand = p?.brand ?? p?.marca ?? 'Genérico'
  const priceRaw = p?.price ?? p?.precio ?? 0
  const priceNum = Math.round(Number(priceRaw) || 0)
  const image = makeAbsolute(p?.image_url ?? p?.image ?? p?.photo ?? '')
  const stock = p?.stock ?? p?.inventory ?? 20
  return { id, name, category, brand, price: priceNum, image, stock }
}

export async function fetchProductsNormalized() {
  const raw = await xanoProducts.list()
  const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : [])
  return list.map(mapProduct)
}
function makeAbsolute(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`
  return url
}