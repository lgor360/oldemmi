// устанавливаем зависимости
import express from "express";
import bodyParser from "body-parser";
import { LemmyHttp } from "lemmy-js-client";

// создаём сервер express
const app = express();
const port = 3000;

// добавляем поддержку json
app.use(bodyParser.json());

// маршрут для обработки post-запросов
app.post("/api", async (req, res) => {
  try {
    const { instance, needresponse, auth, ...params } = req.body;

    // проверяем наличие instance и needresponse
    if (!instance || !needresponse) {
      return res.status(400).json({ error: "instance and needresponse are required" });
    }

    // создаём клиент lemmy с указанным инстансом
    const lemmy = new LemmyHttp(instance);

    // если токен передан, добавляем его в заголовки
    if (auth) {
      lemmy.setHeaders({ Authorization: `Bearer ${auth}` });
    }

    // проверяем, существует ли метод
    if (typeof lemmy[needresponse] !== "function") {
      return res.status(400).json({ error: "invalid method name" });
    }

    // вызываем метод
    const response = await lemmy[needresponse](params);
    res.json(response); // отправляем данные обратно клиенту
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "internal server error", details: error.message });
  }
});

// запускаем сервер
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
