const fetch = require("node-fetch");
const url = require("url");

module.exports = async (req, res) => {
  // добавляем CORS-заголовки для разрешения всего
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // обрабатываем preflight-запросы (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // успешный ответ для preflight
  }

  if (req.method!== 'POST') {
    if (req.method!== 'GET') {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }

  let requestUrl, method, headers, body, need;

  if (req.method === 'GET') {
    const urlParts = url.parse(req.originalUrl, true);
    requestUrl = urlParts.href;
    method = 'GET';
    headers = {};
    body = {};
    need = 'json';
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        if (key === 'need') {
          need = req.query[key];
        } else if (key === 'url') {
          requestUrl = req.query[key];
        } else {
          body[key] = req.query[key];
        }
      }
    }
  } else {
    try {
      const requestBody = JSON.parse(req.rawBody);
      requestUrl = requestBody.url;
      method = requestBody.method || 'GET';
      headers = requestBody.headers || {};
      body = requestBody.body || {};
      need = requestBody.need || 'json';
    } catch (error) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
  }

  try {
    const response = await fetch(requestUrl, { method, headers, body: JSON.stringify(body) });
    if (need === "text") {
      const data = await response.text();
      res.status(response.status).send(data);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
