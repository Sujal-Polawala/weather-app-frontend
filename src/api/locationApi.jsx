// src/api/locationApi.js
import axios from "axios";

const key = import.meta.env.VITE_OPENCAGE_API_KEY;

export const getCitySuggestions = async (query) => {
  if (!query) return [];

  const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      key: key,
      q: query,
      limit: 10, // fetch more and filter manually
      language: "en",
    },
  });

  const results = res.data.results || [];
  console.log(results)

  return results
    .filter((r) => {
      const comp = r.components;
      const city = comp.city || comp.town || comp.village || "";
      return city.toLowerCase().startsWith(query.toLowerCase());
    })
    .map((r) => {
      const comp = r.components;
      const city = comp.city || comp.town || comp.village;
      const country = comp.country;
      return `${city}, ${country}`;
    })
    .filter((value, index, self) => self.indexOf(value) === index); // unique values
};
