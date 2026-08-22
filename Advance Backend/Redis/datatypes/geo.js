import client from "./client.js"

async function geo() {
    try {
      // GEOADD: Add locations
        await client.geoadd("cities", -122.4235, 37.7763, "San Francisco");
        console.log('GEOADD cities: Added San Francisco');

        // GEODIST: Calculate the distance between two locations
        const distance = await client.geodist("cities", "San Francisco", "New York", "km")
        console.log(`GEODIST cities: ${distance} km`)
    } catch (error) {
        console.error("Error:", error)
    } finally {
        client.disconnect()
    }
}

geo()