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

// Función para realizar la solicitud de un reporte en formato PDF
const fetchPdf = async (endpoint) => {
    const nombre_admins = sessionStorage.getItem("nombre_admin");
    try {
        const response = await fetch(`${baseURL}${endpoint}${nombre_admins}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el reporte');
        }

        return { success: true, data: response.url }; // Devolver el URL directo del PDF
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        return { success: false, message: error.message };
    }
};

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


// funciones funcionar descargar pdf 
const fetchPdfAndBlob = async (pdfUrl, token) => {
    const pdfResponse = await fetchPdf(pdfUrl);

    if (!pdfResponse.success) {
        throw new Error(pdfResponse.message || 'Error al obtener el reporte');
    }

    return await fetch(pdfResponse.data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const descargarArchivo = (blob, nombreArchivo) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
};