//const API_URL = "http://192.168.0.170:80";
const API_URL = "http://localhost:3000";

export async function uploadChunk(chunk, filename, chunkNumber, totalChunks) {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("filename", filename);
  formData.append("chunkNumber", chunkNumber);
  formData.append("totalChunks", totalChunks);

  const response = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
  if (!response.ok) throw new Error("Chunk upload failed");
}

export async function checkUploadedChunks(filename) {
  const response = await fetch(`${API_URL}/upload/status/${filename}`);
  if (!response.ok) throw new Error("Failed to fetch uploaded chunks");
  return response.json();
}

export async function checkStatus(filename) {
  const response = await fetch(`${API_URL}/upload/status/${filename}`);
  return response.json();
}
