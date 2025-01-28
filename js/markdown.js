async function parseMarkdown(text) {
    const scriptmark = document.createElement("script");
    scriptmark.src = "https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js";
    document.head.appendChild(scriptmark);
    var md = new Remarkable();
    return md.render(`${text}`);
}
