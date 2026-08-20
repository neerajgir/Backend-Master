import client from "./client.js"

async function bitmaps() {
  try {
    // SETBIT: Set a bit at a specific offset
    await client.setbit("bitmap", 0, 1);
    console.log('SETBIT bitmap: Set bit at offset 0');

    // GETBIT: Get the value of a bit at a specific offset
    const bit = await client.getbit("bitmap", 0);
    console.log(`GETBIT bitmap 0: ${bit}`);

    // BITCOUNT: Count the number of set bits
    const count = await client.bitcount("bitmap");
    console.log(`BITCOUNT bitmap: ${count}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.disconnect();
  }
}

bitmaps();