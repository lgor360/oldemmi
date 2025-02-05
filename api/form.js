const fetch = require("node-fetch");
import { LemmyHttp } from "lemmy-js-client";

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { server, lemmyToken, image } = req.body;

        if (!server || !lemmyToken || !image) {
            return res.status(400).json({ error: "no needed params provided :(" });
        }

        // создаём клиент lemmy с указанным инстансом
        const lemmy = new LemmyHttp(`https://${server}`);
        lemmy.setHeaders({ authorization: `Bearer ${lemmyToken}` });

        // конвертируем base64 в буфер
        const imageBuffer = Buffer.from(image, "base64");
        const response = await lemmy.uploadImage({ image: imageBuffer, auth: lemmyToken });
        
        // проверяем, что ответ не пустой
        const text = await response.text();
        res.status(response.status).send(text);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
