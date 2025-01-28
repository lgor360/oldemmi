const likeMap = new Map();

// функция для получения профиля
async function upOrDownPost(like, type, id) {
    try {
        const response = await fetch("https://oldemmi.vercel.app/api/server.js", {
            method: "POST",
            headers: { "content-type": "application/json", "cache-control": "no-cache" },
            body: JSON.stringify({
                url: `https://${server}/api/v3/${type}/like?nope=${Date.now()}`,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                    "authorization": `Bearer ${localStorage.getItem("lemmyToken")}`
                },
                body: {
                    "score": like,
                    [type + "_id"]: id
                }
            })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        if (response.ok) {
            return data;
        } else {
            alert("sorry, but action failed :(");
            return "not";
        }
    } catch (error) {
        alert(`action failed: ${error}`);
    }
}

async function voteContent(mlike, type, id, mylike) {
    if (!localStorage.getItem("lemmyToken")) {
        window.location.href = `https://oldemmi.vercel.app/login`;
    }
    const currentVote = likeMap.get(id) || mylike;
    const like = mlike === currentVote ? 0 : mlike; // отменяем лайк, если кликнули повторно
    const action = await upOrDownPost(like, type, id);
    if (action !== "not") {
        const upvotes = type === "post" ? action.post_view.counts.upvotes : action.comment_view.counts.upvotes;
        const downvotes = type === "post" ? action.post_view.counts.downvotes : action.comment_view.counts.downvotes;
        const userVote = type === "post" ? action.post_view.my_vote : action.comment_view.my_vote;
        likeMap.set(id, userVote);

        // обновляем счетчики и стили кнопок
        document.querySelector(`#vote${id}`).textContent = upvotes;
        document.querySelector(`#vote${id}`).style.color = userVote === 1 ? "#b3c46d" : "#ffffff";
        document.querySelector(`#down${id}`).textContent = downvotes;
        document.querySelector(`#down${id}`).style.color = userVote === -1 ? "#b3c46d" : "#ffffff";
    }
}

// функция для получения профиля
async function fedFetch(q, type) {
    try {
        const response = await fetch(`https://${localStorage.getItem("accountServer")}/api/v3/resolve_object?q=${q}`, {
            method: "GET",
            headers: { "content-type": "application/json", "authorization": `Bearer ${lemmyToken}` }
        });
        return await response.json();
    } catch (error) {
        alert(`error while loading federated object: ${error}`);
    }
}
