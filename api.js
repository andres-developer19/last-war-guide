const API_KEY = "lwa_live_Wgb9W91NnQZTHtYe3KPbKmCoA6yLwyEM";
const BASE_URL = "https://api.lwatlas.com/v1";

async function apiRequest(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "X-Api-Key": API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }

    return response.json();
}