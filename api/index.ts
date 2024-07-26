const fetchers = new Map<string, {
  get: ({ url, params }: {
    url: string;
    params?: Record<string, string>;
  }) => Promise<any>,
  post: ({ url, params, data }: {
    url: string;
    params?: Record<string, string>;
    data?: any;
  }) => Promise<any>
}>

export function createFetcher(name: string, baseUrl: string, headers?: Record<string, string>) {
  if (fetchers.has(name)) {
    return fetchers.get(name)!
  }
  const fetcher = {
    get: ({ url, params }: { url: string, params?: Record<string, string> }) => {
      const slash = baseUrl.endsWith('/') || url.startsWith('/') ? '' : '/'
      let endpoint = `${baseUrl}${slash}${url}`

      const search = new URLSearchParams(params).toString();
      if (search) {
        endpoint += `?${search}`
      }
      return fetch(endpoint, { method: 'GET', headers }).then(res => res.json())
    },
    post: ({ url, params, data }: {
      url: string,
      params?: Record<string, string>,
      data?: any
    }) => {
      const slash = baseUrl.endsWith('/') || url.startsWith('/') ? '' : '/'
      let endpoint = `${baseUrl}${slash}${url}`

      const search = new URLSearchParams(params).toString();
      if (search) {
        endpoint += `?${search}`
      }
      return fetch(endpoint, {
        method: 'POST',
        headers: Object.assign({}, headers, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      })
        .then(res => res.json())
    },
  }
  fetchers.set(name, fetcher)
  return fetcher
}

export function getFetcer(name = 'default') {
  if (!fetchers.has(name)) {
    throw new Error('fetcher not exist')
  }
  return fetchers.get(name)!
}


createFetcher('default', 'http://localhost:3000/api')