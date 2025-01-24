async function parseMarkdown(text) {
    const response = await fetch("https://oldemmi.vercel.app/api/server.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ marktext: text })
    });

    if (!response.ok) {
        throw new Error(`server returned error: ${response.status}`);
    }

    const marktextgotovo = await response.text(); // получаем текст
    return marktextgotovo;
}
