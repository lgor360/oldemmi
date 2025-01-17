if (window.innerWidth < 550) {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=550, initial-scale=1.0');
}
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://lgor360.github.io/oldemmi/css/dark.css?nocache=" + new Date().getTime();
document.head.appendChild(link);
