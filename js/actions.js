const api = `https://${localStorage.getItem("accountServer")}/api/v3`
const lemmyToken = localStorage.getItem("lemmyToken");

async function upOrDownPost(like, type, id) {
    try {
        const response = await fetch("https://oldemmi.vercel.app/api/server.js", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                url: `https://${server}/api/v3/post/like`,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${lemmyToken}`
                },
                body: {
                    "score": like,
                    `${type}_id`: id
                }
            })
        });
        console.log(JSON.stringify(await response.json(), null, 2));
    } catch (error) {
        alert(`action failed: ${error}`);
    }
}
