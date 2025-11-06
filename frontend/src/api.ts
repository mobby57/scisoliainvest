export async function fetchAnnonces() {
  const response = await fetch("http://localhost:8000/annonces");
  return await response.json();
}
