async function parseMarkdown(text) {
    alert(text);
    const response = await fetch("https://oldemmi.vercel.app/api/mark.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ marktext: text }) // отправляем JSON с полем marktext
    });

    if (!response.ok) {
        const errorDetails = await response.json(); // парсим JSON-ответ с ошибкой
        console.error('server error response:', errorDetails); // выводим ошибку и тело запроса
        throw new Error(`server returned error: ${response.status}, ${JSON.stringify(errorDetails)}`);
    }

    const marktextgotovo = await response.text(); // получаем текст (HTML) в случае успеха
    return marktextgotovo;
}
