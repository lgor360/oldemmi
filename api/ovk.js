const fetch = require("node-fetch");

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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, kolvo } = req.query;
  const arr = ["(⁠・⁠∀⁠・⁠)", "sudo rm -rf /", "котики", "тюлени", "(⁠◕⁠ᴗ⁠◕⁠✿⁠)", "<⁠(⁠￣⁠︶⁠￣⁠)⁠>", "бебе", "⊂⁠(⁠・⁠▽⁠・⁠)⁠⊃", "/⁠ᐠ⁠｡⁠ꞈ⁠｡⁠ᐟ⁠\\", "..-.. -...-.-...- ---.--..-  -... -......-..", "(⁠^⁠︶⁠^⁠)", "(O⁠_⁠o)"];

  try {
    for (let i = 0; i < kolvo; i++) {
      const status = "[" + Math.floor(Math.random() * 54) + "] " + arr[Math.floor(Math.random() * arr.length)];
      const url = "https://ovk.to/method/status.set?text=" + status + "&access_token=18951-0b8f1c5e-29721ec7-de6ae91c-252ea53d-028310d1-62c3c47d-37df5df9-6497b6ee-b4b39129-jill";
      await fetch(url);
      await new Promise(resolve => setTimeout(resolve, data * 1000));
    }

    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
