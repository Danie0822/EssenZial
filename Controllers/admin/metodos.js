const baseURL = "http://localhost:4000/api";
const imagen = "http://localhost:4000/";
const token = sessionStorage.getItem("token");
// Variable para controlar si se está realizando una operació
let isFetchingData = false;

// Función asincrónica para realizar solicitudes GET a la API
async function fetchData(endpoint) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
// Función asincrónica para realizar solicitudes GET con un parámetro a la API
async function fetchDataWithParam(endpoint, idInventario) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}/${idInventario}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}

// Función asincrónica para realizar solicitudes POST, PUT
async function DataAdmin(endpoint, formData, method) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        return response;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
// Función asincrónica para realizar solicitudes POST, PUT
async function DataNoToken(endpoint, formData, method) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        return response;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
// Función asincrónica para realizar solicitudes POST con FORM DATA
async function createData(endpoint, formData) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
// Función asincrónica para realizar solicitudes PUT con FORM DATA
async function updateData(endpoint, formData) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
// Función asincrónica para realizar solicitudes DELETE
async function deleteData(endpoint) {
    if (isFetchingData) {
        console.log("Otra operación está en curso. Por favor, espere.");
        return { success: false, message: "Otra operación está en curso. Por favor, espere." };
    }

    isFetchingData = true;

    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: error.message };
    } finally {
        isFetchingData = false;
    }
}
