async function parseMarkdown(text) {
    const response = await fetch("https://oldemmi.vercel.app/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ marktext: text })
    });

    if (!response.ok) {
        throw new Error(`server returned error: ${response.status}, ${response.error}, ${response.message}, ${response.stack}`);
    }

    const marktextgotovo = await response.text(); // получаем текст
    return marktextgotovo;
}
