// Definición de la URL base para la solicitud de inicio de sesión
const BASE_URL = "http://localhost:4000/api/login/cliente";

document.getElementById("loginForm").addEventListener("submit", handleLoginFormSubmit);
// Función asincrónica para manejar el envío del formulario de inicio de sesión
async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("correo").value;
    const password = document.getElementById("contrasena").value;
    try {
        // Calcular el hash de la contraseña utilizando la función sha256
        const contra = await sha256(password); 
        // Autenticar al usuario con el correo electrónico y la contraseña proporcionados
        const token = await authenticateUser(email, contra);
        // Guardar el token de sesión en sessionStorage
        saveTokenToSessionStorage(token); 
        window.location.href = "homepage.html";
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
        throw new Error("Credenciales inválidas");
    }
}
// Función para guardar la info
function saveTokenToSessionStorage(data) {
    console.log(data);
    const tokenG = data.data.token; 
    const id = data.data.id_cliente;
    const nombre = data.data.nombre_cliente;
    const apellido = data.data.apellido_cliente; 
    const telefono_cliente = data.data.telefono_cliente;
    const correo_cliente = data.data.correo_cliente;
    sessionStorage.setItem("nombre_cliente", nombre); 
    sessionStorage.setItem("token", tokenG); 
    sessionStorage.setItem("id_cliente", id);
    sessionStorage.setItem("apellido_cliente", apellido); 
    sessionStorage.setItem("telefono_cliente", telefono_cliente); 
    sessionStorage.setItem("correo_cliente", correo_cliente); 
}
