const BASE_URL = "http://localhost:4000/api/login/admin";

document.getElementById("loginForm").addEventListener("submit", handleLoginFormSubmit);

async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const contra = await sha256(password); 
        const token = await authenticateUser(email, contra);
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
            return data;
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

function saveTokenToSessionStorage(data) {
    console.log(data);
    const tokenG = data.data.token; 
    const id = data.data.id_admin;
    sessionStorage.setItem("token", tokenG); // Guardar el token en sessionStorage
    sessionStorage.setItem("", id); // Guardar el Id en sessionStorage
}
