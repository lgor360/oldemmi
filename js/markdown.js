async function parseMarkdown(text) {
    const response = await fetch("https://oldemmi.vercel.app/api/markApi.js", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ marktext: `${text}` })
    });

    if (!response.ok) {
        throw new Error(`server returned error: ${response.status}`);
    }

    const marktextgotovo = await response.json(); // получаем текст
    alert(JSON.stringify(marktextgotovo, null, 2));;
    return marktextgotovo;
}
