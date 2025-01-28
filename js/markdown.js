async function parseMarkdown(text) {
  const scriptmark = document.createElement("script");
  scriptmark.src = "https://unpkg.com/showdown/dist/showdown.min.js";

  // возвращаем Promise, который выполнится после загрузки скрипта
  await new Promise((resolve, reject) => {
    scriptmark.onload = resolve;
    scriptmark.onerror = reject;
  });

  var md = new showdown.Converter();
  return md.makeHtml(`${text}`);
}
