function parseMarkdown(text) {
    const marktextgotovo = fetch("https://oldemmi.vercel.app/api/server.js", {
        method: "POST",
        body: JSON.stringify({ marktext: text })
    });
    return marktextgotovo;
}
