import axios from "axios";
import captainModel from "../models/captain.model.js";

export const getAddressCoordinate = async (address) => {
    // Check for missing or empty address input
    if (!address || typeof address !== 'string' || !address.trim()) {
        throw new Error("Address parameter is required and must be a valid string");
    }

    // Nominatim API URL (OpenStreetMap Geocoding)
    // Note: Always include a descriptive User-Agent header as required by OSM Usage Policy
    const url = `https://nomination.openstreetmap.org/serach?&format=json&${encodeURIComponent(address)}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                // Replace with your app name or contact email to comply with OSM policy
                'User-Agent': 'Uber'
            }
        });
        
        // Handle successful API response with coordinates
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            
            // Convert string coordinates from OSM to floating-point numbers
            return { 
                lat: parseFloat(lat), 
                lng: parseFloat(lon) 
            };
        } 
        
        // Handle cases where no locations match the address
        throw new Error("No coordinates found for the provided address");
        
    } catch (error) {
        // Log clean error message to console
        console.error("Error fetching coordinates from OpenStreetMap:", error.message);
        throw error;
    }
}
