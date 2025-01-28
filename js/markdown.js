async function parseMarkdown(text) {
    const scriptmark = document.createElement("script");
    scriptmark.src = "https://unpkg.com/showdown/dist/showdown.min.js";
    document.head.appendChild(scriptmark);
    var md = new showdown.Converter();
    return md.makeHtml(`${text}`);
}
