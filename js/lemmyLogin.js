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
