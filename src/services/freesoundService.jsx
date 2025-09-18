// src/services/freesoundService.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;

export const searchSounds = async (query) => {
  try {
    const response = await axios.get(
      `https://freesound.org/apiv2/search/text/`,
      {
        params: {
          query,
          token: API_KEY,
          fields: "id,name,previews",
        },
      }
    );

    // Filter out sounds without a preview
    const validSounds = response.data.results.filter(
      (sound) => sound.previews?.["preview-hq-mp3"]
    );

    return validSounds; // array of sound objects with preview URLs
  } catch (err) {
    console.error("Error fetching sounds from Freesound:", err);
    return [];
  }
};
