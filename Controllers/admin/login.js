// Definición de la URL base para la solicitud de inicio de sesión
const BASE_URL = "http://localhost:4000/api/login/admin";

document.getElementById("loginForm").addEventListener("submit", handleLoginFormSubmit);
// Función asincrónica para manejar el envío del formulario de inicio de sesión
async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        // Calcular el hash de la contraseña utilizando la función sha256
        const contra = await sha256(password); 
        // Autenticar al usuario con el correo electrónico y la contraseña proporcionados
        const token = await authenticateUser(email, contra);
        // Guardar el token de sesión en sessionStorage
        saveTokenToSessionStorage(token); 
        window.location.href = "menu.html";
    } catch (error) {
        alert(error.message);
    }
}
// Función asincrónica para autenticar al usuario 
async function authenticateUser(email, password) {
    try {
        // Codificar el correo electrónico y la contraseña para incluirlos en la URL de la solicitud
        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);
        const url = `${BASE_URL}?correo=${encodedEmail}&clave=${encodedPassword}`;
        // Realizar una solicitud GET a la API de inicio de sesión
        const response = await fetch(url);
        const data = await response.json();
        // Verificar si la solicitud fue exitosa y si el usuario está autenticado
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
// Función para guardar la info
function saveTokenToSessionStorage(data) {
    console.log(data);
    const tokenG = data.data.token; 
    const id = data.data.id_admin;
    const nombre = data.data.nombre_admin;
    sessionStorage.setItem("nombre_admin", nombre); // Guardar el nombre en sessionStorage
    sessionStorage.setItem("token", tokenG); // Guardar el token en sessionStorage
    sessionStorage.setItem("id_admin", id); // Guardar el Id en sessionStorage
}
