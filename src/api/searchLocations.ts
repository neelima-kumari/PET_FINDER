import axios from "axios";

const searchLocations = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.post("https://frontend-take-home-service.fetch.com/locations/search", {
      geoBoundingBox: {
        bottom_left: { lat: latitude - 0.1, lon: longitude - 0.1 },
        top_right: { lat: latitude + 0.1, lon: longitude + 0.1 }
      },
      size: 1
    },{
        withCredentials: true
    });
    console.log("Location data:", response.data);
    if (response.data.results.length > 0) {
      return response.data.results[0];
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
  return null;
};

export default searchLocations;
