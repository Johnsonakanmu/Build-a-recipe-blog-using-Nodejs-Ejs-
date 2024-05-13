const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.get("", recipeController.homePage);
router.get("/categories", recipeController.exporeCategories);
router.get("/recipe/:id", recipeController.exploreRecipe);
router.get("/categories/:id", recipeController.exporeCategoriesByID);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/explore-random", recipeController.exploreRendom);
router.get("/submit-recipe", recipeController.submitRecipe);
router.post("/submit-recipe", recipeController.submitRecipeOnPost);
router.get('/about-us', recipeController.aboutUs);
router.get('/contact-us', recipeController.contactUs)

module.exports = router;
