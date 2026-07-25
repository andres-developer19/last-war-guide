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
    else {
console.log("API request successful te pica ese culo");
    }

    return response.json();
}


// pages/api/lwatlas.js  (o app/api/lwatlas/route.js si usas App Router)
export default async function handler(req, res) {
  const response = await fetch('https://api.lwatlas.com/v1/', {
    headers: {
      'X-Api-Key': process.env.API_KEY
    }
  });
  const data = await response.json();
  res.status(response.status).json(data);
}