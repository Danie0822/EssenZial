const baseURL = "http://localhost:4000/api";
const token = sessionStorage.getItem("token");

 async function fetchData(endpoint) {
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
    }
}

 async function createData(endpoint, formData) {
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
    }
}

 async function updateData(endpoint, formData) {
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
    }
}

 async function deleteData(endpoint) {
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
    }
}
