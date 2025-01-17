const fetch = require("node-fetch");

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url, method = 'GET', headers, body } = req.body;
    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
