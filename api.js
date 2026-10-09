const API = {
  base: '',

  async request(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(this.base + url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'حدث خطأ ما');
    }
    return data;
  },

  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body) { return this.request('PUT', url, body); },
  delete(url) { return this.request('DELETE', url); },

  // للتوافق فقط (لم يعد مستخدماً)
  token: () => null,
  setToken: () => {},
  clearToken: () => {},
};
