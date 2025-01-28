function parseMarkdown(text) {
    // функция для обработки вложенных элементов
    function processNestedMarkdown(input) {
        // обработка жирного текста (**text**)
        input = input.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // обработка зачёркнутого текста (~~text~~)
        input = input.replace(/~~(.+?)~~/g, '<del>$1</del>');
        // обработка наклонного текста (*text*)
        input = input.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // обработка inline-кода (`code`)
        input = input.replace(/`([^`]+)`/g, '<code>$1</code>');
        return input;
    }

    // обработка заголовков (#, ##, ### и т.д.)
    text = text.replace(/^#{1,6} (.+)$/gm, (match) => {
        const headerLevel = match.match(/^#+/)[0].length;
        const content = match.slice(headerLevel + 1);
        return `<h${headerLevel}>${processNestedMarkdown(content)}</h${headerLevel}>`;
    });

    // обработка ссылок [текст](url)
    text = text.replace(/\[([^\]]+)]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');

    // обработка изображений ![alt](url)
    text = text.replace(/!\[([^\]]*)]\((https?:\/\/[^\)]+)\)/g, '<img src="$2" alt="$1">');

    // обработка блоков кода ```code```
    text = text.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

    // обработка списков (unordered)
    text = text.replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>');
    text = text.replace(/<\/ul>\n<ul>/g, ''); // объединение списков

    // обработка нумерованных списков
    text = text.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');
    text = text.replace(/<\/ol>\n<ol>/g, ''); // объединение списков

    // обработка таблиц с вложениями
    text = text.replace(/^\|(.+?)\|\n\|[-\s|]+\|\n((\|.+?\|\n)+)/gm, (match, header, rows) => {
        const headers = header.split('|').map(h => `<th>${processNestedMarkdown(h.trim())}</th>`).join('');
        const body = rows.trim().split('\n').map(row => {
            const cells = row.split('|').map(cell => `<td>${processNestedMarkdown(cell.trim())}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`;
    });

    // обработка ссылок типа !сообщество@инстанс
    text = text.replace(/!([\w\d_]+)@([\w\d\.-]+)/g, (match, community, instance) => {
        const url = `https://oldemmi.vercel.app/community?server=${instance}&community=${community}`;
        return `<a href="${url}" rel="noopener noreferrer">${community}@${instance}</a>`;
    });

    // обработка блоков ::: spoiler
    text = text.replace(/::: spoiler (.+?)\n([\s\S]+?)\n:::/g, 
        (match, title, content) => `<details><summary>${processNestedMarkdown(title)}</summary><div>${processNestedMarkdown(content)}</div></details>`);

    // обработка переносов строк
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\\/g, '<br>');

    // обработка вложенных стилей
    text = processNestedMarkdown(text);

    return text;
}
