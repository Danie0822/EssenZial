const BASE_URL = "http://localhost:4000/api/login/admin";

document.getElementById("loginForm").addEventListener("submit", handleLoginFormSubmit);

async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const token = await authenticateUser(email, password);
        saveTokenToSessionStorage(token); 
        window.location.href = "menu.html";
    } catch (error) {
        alert(error.message);
    }
}

async function authenticateUser(email, password) {
    try {
        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);
        const url = `${BASE_URL}?correo=${encodedEmail}&clave=${encodedPassword}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.success) {
            const token = data.data.token;
            if (typeof token === "string") {
                return token;
            } else {
                throw new Error("El token recibido no es válido");
            }
        } else if (response.status === 401) {
            throw new Error("Credenciales inválidas");
        } else {
            throw new Error(data.message || "Error de autenticación");
        }
    } catch (error) {
        console.log( error);
        throw new Error("Error de conexión");
    }
}

function saveTokenToSessionStorage(token) {
    sessionStorage.setItem("token", token); // Guardar el token en sessionStorage
}
