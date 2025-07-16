import fs from "fs";

let restaurantData = [];

try {
  const rawData = fs.readFileSync("./data/mock_food_delivery_data.json");
  restaurantData = JSON.parse(rawData);
  console.log("mocked data loaded form JSON file");
} catch (error) {
  console.log("error reading file");
}

export default restaurantData;
