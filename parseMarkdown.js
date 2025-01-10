function parseMarkdown(text) {
    // жирный текст (*текст*)
    text = text.replace(/\*{2}([^\*]+)\*{2}/g, '<strong>$1</strong>');
    // курсив (*текст*)
    text = text.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    // зачёркнутый текст (~~текст~~)
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
    // цитаты (> текст)
    text = text.replace(/^>\s(.+)/gm, '<blockquote>$1</blockquote>');
    // списки (- текст)
    text = text.replace(/^- (.+)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>'); // оборачиваем список в <ul>
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
    // обработка ссылок типа !сообщество@инстанс
    text = text.replace(/!([\w\d_]+)@([\w\d\.-]+)/g, (match, community, instance) => {
        const url = `https://lgor360.github.io/oldemmi/community.html?server=${instance}&community=${community}`;
        return `<a href="${url}" rel="noopener noreferrer">${community}@${instance}</a>`;
    });
    return text;
}
