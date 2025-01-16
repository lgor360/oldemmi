let page = 1; // текущая страница для загрузки
const limit = 9; // количество постов на одну загрузку
const server = localStorage.getItem("accountServer") || urlParams.get('server') || "lemmy.world";
const api = `https://${server}/api/v3`
const lemmyToken = localStorage.getItem("lemmyToken");

function instanceapply() {
    const instdiv = document.querySelector(".navbar .oldemmi .text .instance");
    instdiv.innerHTML = `
        ${server}
    `;
}

async function getLoggined() {
    try {
        const response = await fetch(`${api}/site`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${lemmyToken}`
            }
        });
        const data = await response.json();
        return data.my_user.local_user_view.person;
    } catch (error) {
        alert(`error while loading profile: ${error}`);
    }
}

async function validateToken() {
    const serverUrl = `https://${server}/api/v3/user/validate_auth`;

    try {
        const response = await fetch(serverUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${lemmyToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("token is valid:", data);
        return true; // токен валидный
    } catch (error) {
        console.error("token validation failed:", error);
        return false; // токен не валидный
    }
}

async function loginedornot() {
    try {
        const profileInBar = document.querySelector(".navbar .normal .neP .profileInBar");
        const changeServer = document.getElementById("changeServer");
        const login = document.getElementById("login");
        const logout = document.getElementById("logout");
            
        if (lemmyToken) {
            const lemmyTokenValid = await validateToken();
            if (lemmyTokenValid) {
                profileInBar.style.display = "flex";
                logout.style.display = "flex";
                changeServer.style.display = "none";
                login.style.display = "none";

                const user = await getLoggined();
                profileInBar.innerHTML = `
                    <img onclick="goToProfile('${user.name}', '${server}')" src="${user.avatar || 'https://lgor360.github.io/oldemmi/user.png'}">
                    <div class="text">
                        ${user.display_name || user.name}
                    </div>
                `;
            } else {
                logout("notvalid");
            }
        }
        return;
    } catch (error) {
        alert(`error while account login check: ${error}`);
    }
}

function login() {
    window.location.href = `https://lgor360.github.io/oldemmi/login.html`;
}

async function logout(option) {
    const confirmation = confirm("are you sure want to logout?");
    if (!confirmation) {
        return; // если пользователь нажал "нет", ничего не делаем
    }

    const proxyUrl = "https://tide-decisive-resolution.glitch.me/proxy";
    const logoutData = {
        url: `https://${server}/api/v3/user/logout`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lemmyToken}`
        },
        body: {}
    };

    try {
        if (option === "userlogout") {
        // выполняем запрос на выход через прокси
            const response = await fetch(proxyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logoutData)
            });

            if (!response.ok) {
                throw new Error(`logout failed: ${response.status} ${response.statusText}`);
            }
        }
        // удаляем токен и сервер из LocalStorage
        localStorage.removeItem("lemmyToken");
        localStorage.removeItem("accountServer");

        // перезапускаем текущую страницу
        location.reload();
    } catch (error) {
        alert(`error during logout: ${error}`);
    }
}
