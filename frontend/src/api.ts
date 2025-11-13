export async function fetchAnnonces() {
  try {
    const response = await fetch("http://localhost:8000/annonces");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch annonces:", error);
    throw error;
  }
}
