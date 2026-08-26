import axios from "axios";
import captainModel from "../models/captain.model.js";
const ORS_API_KEY = process.env.ORS_API_KEY;


export const getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url, {
            headers: { "User-Agent": "Uber" } 
        });

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error(`Failed to fetch coordinates for: ${address}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getDistanceAndTime = async (originName, destinationName) => {
    try {
        // Fetch coordinates for origin and destination
        const origin = await getAddressCoordinate(originName);
        const destination = await getAddressCoordinate(destinationName);

        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

        const response = await axios.get(url);

        if (response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                origin: originName,
                destination: destinationName,
                distance_km: route.summary.distance / 1000, // Convert meters to km
                duration_min: route.summary.duration / 60, // Convert seconds to minutes
                origin_coords: origin,
                destination_coords: destination
            };
        } else {
            throw new Error("Failed to fetch distance and time");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAutoCompleteSuggestionservice = async (req, res) => {
    try {
        const { query } = req.query; // Extract query from request

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;

        const response = await axios.get(url, {
            headers: { "User-Agent": "Uber" } // Required by Nominatim
        });

        if (response.data.length > 0) {
            const suggestions = response.data.map((place) => ({
                display_name: place.display_name,
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
            }));

            return res.json({ suggestions });
        } else {
            return res.status(404).json({ message: "No suggestions found" });
        }
    } catch (error) {
        console.error("Autocomplete error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getCaptainInTheRadius = async (ltd , lng , radius)=>{
    const captains  = await captainModel.find({
        location:{
            $geoWithin:{
                $centerSphere:[[lng , ltd] , radius / 6378.1]
            }
        }
    });

    return captains
}