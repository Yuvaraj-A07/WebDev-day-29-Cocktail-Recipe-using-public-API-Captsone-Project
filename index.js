import express from "express";
import axios from "axios";

const port = 3000;
const app = express();
const d = new Date();
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    const result = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php" // public API to get cocktail recipe
    );
    const output = result.data.drinks[0];
    const keys = Object.keys(output); // extracting all the keys in the result
    let ingredients = []; // to store total ingredients from the API
    let items = []; // to store the ingredients with their measures.

    // In this below function extracting the ingredients from the response object
    keys.forEach((key) => {
      // console.log(`${key}: ${output[key]}`);
      if (key.includes("strIngredient")) {
        if (output[key] !== null) {
          items.push(key);
        }
      }
    });

    // this function stores the ingredients with their measures this is send to the inedx.ejs
    for(let i=0; i < items.length; i++){
        let start = i+1;
        let measure = output["strMeasure"+start];
        let ingredient = output[items[i]];
        // this is to check that for particular ingredients the measure is not given so that inside this we eliminating 
        // the measure which have null for that specific ingredient.
        if(measure === null){ 
            measure = '';
        }
        ingredients.push(measure+''+ingredient); // conctinating the measure and ingredient. ex '1/2 cup Cocoa powder' 
    }
    res.render("index.ejs", {recipe: output, ingredient: ingredients, year: d.getFullYear()});
  } catch (error) {
    console.log("Failed to fetch", error);// to catch the interupt.
  }
});

app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
