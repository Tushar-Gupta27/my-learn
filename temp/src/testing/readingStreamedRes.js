const axios = require("axios");

async function readStreamAsyncIterator(url) {
  const response = await axios.get(url);
  const decoder = new TextDecoder(); // For decoding text data

  for await (const chunk of response.data) {
    const textChunk = decoder.decode(chunk);
    console.log("Received chunk:", textChunk);
    // Process the textChunk
  }
  console.log("Stream finished");
}

// Example usage:
readStreamAsyncIterator("http://localhost:3000/stream");
