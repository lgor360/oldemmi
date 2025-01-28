async function parseMarkdown(text) {
    const response = await fetch("https://oldemmi.vercel.app/convert.js", {
        method: "POST",
        body: JSON.stringify({ marktext: text })
    });

    if (!response.ok) {
        throw new Error(`server returned error: ${response.status}`);
    }

    const marktextgotovo = await response.text(); // получаем текст
    alert(marktextgotovo);
    return marktextgotovo;
}
