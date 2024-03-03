const baseURL = "http://localhost:4000/api";
const token = sessionStorage.getItem("token");

let isFetchingData = false;

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
