function parseMarkdown(text) {
            // списки
            text = text.replace(/^(\s*)([-*+]|[0-9]+\.)\s+(.+)/gm, (_, space, bullet, item) => {
                const tag = /^[0-9]+\./.test(bullet) ? 'ol' : 'ul';
                return `${space}<${tag}><li>${item}</li></${tag}>`;
            });
            // чекбоксы
            text = text.replace(/\[ \]\s(.+)/g, '<input type="checkbox" disabled>$1');
            text = text.replace(/\[x\]\s(.+)/gi, '<input type="checkbox" checked disabled>$1');
            // подчёркнутый текст
            text = text.replace(/__([^_]+)__/g, '<u>$1</u>');
            // жирный текст (*текст*)
            text = text.replace(/\*{2}([^\*]+)\*{2}/g, '<strong>$1</strong>');
            // курсив (*текст*)
            text = text.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
            // зачёркнутый текст (~~текст~~)
            text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
            // цитаты (> текст)
            text = text.replace(/^>\s(.+)/gm, '<blockquote>”$1”</blockquote>');
            // код (`текст`)
            text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
            // прописные (~текст~)
            text = text.replace(/~(.*?)~/g, '<sub>$1</sub>');
            // заглавные (^текст^)
            text = text.replace(/\^(.*?)\^/g, '<sup>$1</sup>');
            // спойлеры (::spoiler текст:::)
            text = text.replace(/::: spoiler (.+?)\n([\s\S]+?)\n:::/g, 
                '<details><summary>$1</summary><div>$2</div></details>');
            // картинки
            text = text.replace(/!\[([^\]]*)\]\((https?:\/\/[^\)]+\.(jpg|jpeg|png|gif|webp))\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');
            // ссылки ([текст](ссылка))
            text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>');
            // заголовки
            text = text.replace(/^(#+)\s*(.+)$/gm, (_, hashes, content) => `<h${hashes.length}>${content}</h${hashes.length}>`);
            // переносы строк
            text = text.replace(/\\n/g, '<br>');
            text = text.replace(/\\/g, '<br>');
            // обработка ссылок типа !сообщество@инстанс
            text = text.replace(/!([\w\d_]+)@([\w\d\.-]+)/g, (match, community, instance) => {
                const url = `https://lgor360.github.io/oldemmi/community.html?server=${instance}&community=${community}`;
                return `<a href="${url}" rel="noopener noreferrer">${community}@${instance}</a>`;
            });
            // таблицы
            text = text.replace(/^\|(.+?)\|\n\|[-\s|]+\|\n((?:\|.+?\|\n)*)/gm, (_, headers, rows) => {
                const headerCells = headers.split('|').map(cell => `<td>${cell.trim()}</td>`).join('');
                const bodyRows = rows.trim().split('\n').map(row => {
                        const cells = row.split('|').filter(cell => cell.trim() !== '').map(cell => `<td>${cell.trim()}</td>`).join('');
                        return `<tr>${cells}</tr>`;
                    }).join('');
                    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
                }
            );
          return text;
}
