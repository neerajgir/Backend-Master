import client from "../client.js"

async function stream() {
    try {
    // XADD: Add an entry to a stream
    await client.xadd("mystream", "*", "sensor-id", 1234, "temperature", 25);
    console.log('XADD mystream: Added entry');

    // XRANGE: Retrieve entries in a range
    const entries = await client.xrange("mystream", "-", "+");
    console.log(`XRANGE mystream: ${entries}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.disconnect();
  }
}

stream()