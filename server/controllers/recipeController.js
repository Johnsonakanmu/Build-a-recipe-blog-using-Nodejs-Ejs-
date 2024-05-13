require("../models/database");
const Recipe = require("../models/Recipe");
const Category = require("../models/Category");
module.exports = {
  //HOme page
  homePage: async (req, res) => {
    try {
      const limitNumber = 5;
      const categories = await Category.find().limit(limitNumber);
      const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      const yoruba = await Recipe.find({ category: "Yoruba" }).limit(
        limitNumber
      );
      const igbo = await Recipe.find({ category: "Igbo" }).limit(limitNumber);
      const american = await Recipe.find({ category: "American" }).limit(
        limitNumber
      );

      const food = { latest, yoruba, igbo, american };

      res.render("index", { title: "Cooking Blog - Home", categories, food });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  },

  /**
   * GET
   * categories
   */
  exporeCategories: async (req, res) => {
    try {
      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render("categories", {
        title: "Cooking Blog - Categoreis",
        categories,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  },

  /**
   * GET
   * Recipes: id
   */
  exploreRecipe: async (req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);

      res.render("recipe", {
        title: "Cooking Blog- Recipe ",
        recipe,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "error Occured" });
    }
  },

  /**
   * GET
   * categories:ID
   */
  exporeCategoriesByID: async (req, res) => {
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ category: categoryId }).limit(
        limitNumber
      );
      res.render("categories", {
        title: "Cooking Blog - Categoreis",
        categoryById,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  },

  /**
   *Post/search
   * Seaarch
   */
  searchRecipe: async (req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find({
        $text: { $search: searchTerm, $diacriticSensitive: true },
      });
      res.render("search", {
        title: "Cooking Blog - Search",
        recipe,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  },

  exploreLatest: async (req, res) => {
    try {
      const limitNumber = 10;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

      res.render("explore-latest", {
        title: "Cooking Blog- Explore-Latest ",
        recipe,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "error Occured" });
    }
  },

  //How to Generate random in ejs
  exploreRendom: async (req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render("explore-random", {
        title: "Cooking Blog - Explore Latest",
        recipe,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  },
  // To submit recipe
  submitRecipe: async (req, res) => {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");

    res.render("submit-recipe", {
      title: "Cooking Blog - Submit recipe",
      infoErrorsObj,
      infoSubmitObj,
    });
  },

  // posting new recipe
  submitRecipeOnPost: async (req, res) => {
    try {
      let imageUploadFile;
      let uploadPath;
      let newImageName;

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No files where upload...");
      } else {
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath =
          require("path").resolve("./") + "/public/uploads/" + newImageName;

        imageUploadFile.mv(uploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });
      }

      const newRecipe = await Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName,
      });
      await newRecipe.save();
      req.flash("infoSubmit", "Recipe has been added");
      res.redirect("/submit-recipe");
    } catch (error) {
      req.flash("infoErrors", error);
      res.redirect("/submit-recipe");
    }
  },

  aboutUs: async (req, res) =>{
    res.render('about-us')
  },

  contactUs: async (req, res) =>{
    res.render('contact-us')
  }
};




//TO INSERT DOMMY DB INTO UR MONGODB B/4 USING THE DB

// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "Yam with goat meat pepper soup",
//         description: `In Nigeria, pepper soup, also known as Ukodo, is a typical family dish. Many people enjoy
//           eating native soup in the evenings and at dinner. The major ingredients in this meal are
//           pepper and goat meat. This is one of the most calorie-dense foods. It is high in carbohydrate
//           complexes, omega-3 fatty acids, and vitamins B6 and B1.
//          Source: https://www.jamieoliver.com/recipes/yam-recipes/yam-with-goat-meat-pepper-soup/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Goat meat",
//           "two large onion bulbs",
//           "Dry pepper",
//           "Large tuber yam",
//           "Salt",
//           "Stock cubes",
//           "Basil",
//           "Dry Ashanti pepper leaves",
//         ],
//         category: "Igbo",
//         image: "yam with goat meat pepper soup.jpg",
//       },
//       {
//         name: "Jollof rice with chicken",
//         description: `Jollof rice is a favourite and popular source of nutrition for the Igbo people and the rest
//         of West Africa. The rice is cooked in a tomato-flavoured liquid. Jollof rice is made using
//         beef, poultry, or fish. It is a versatile dish that works well for both dinner and parties.

//          Source:  https://www.legit.ng/1164659-types-igbo-culture-food.html/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Sliced medium tomatoes",
//           "Red bell pepper stemmed, seeded and quartered",
//           "Small red onions diced",
//           "Scotch bonnet pepper or habanero",
//           "Vegetable oil",
//           "1 lb boneless chicken thighs (450g)",
//           "Teaspoons curry powder",
//           "Teaspoon dried thyme",
//           "2 cups parboiled long grain rice (400g)",
//         ],
//         category: "Igbo",
//         image: "jollof rice with chicken.jpg",
//       },

//       {
//         name: "Ugu vegetable soup",
//         description: `he Igbo soup has seafood, veggies, various portions of meat, and fluted pumpkin leaves.
//          The soup is delicious and healthful, owing to the inclusion of Ugu leaves in its preparation.
//           The fluted pumpkin leaf known as Ugu grows in Nigeria and other tropical African countries.
//          Pumpkin leaves are high in vitamins and minerals. You can make this soup either with or
//         without meat. If you want to add meat, you can use cow feet, beef, goat meat, dried cowhide
//         or chicken.

//          Source:  https://www.legit.ng/1164659-types-igbo-culture-food.html/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Ugu (pumpkin) leaves",
//           "Palm oil 3.Dried Fish",
//           "Waterleaf",
//           "Okporoko (stockfish)",
//           "Crayfish",
//           "Pepper",
//         ],
//         category: "Igbo",
//         image: "igbo-food-ugu vegetable soup.jpg",
//       },

//       {
//         name: "Nkwobi",
//         description: `This is one of the Nigerians' most popular meals. It is usually considered an evening meal,
//          simply a cooked cow foot mixed in spicy palm oil paste.

//          Source:  https://www.legit.ng/1164659-types-igbo-culture-food.html/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "2kg cow foot (cut into sizeable pieces)",
//           "Palm oil",
//           "1 tablespoon powdered edible potash",
//           "1 teaspoon ground Ehu seeds",
//           "Utazi leaves",
//           "Ugba",
//           " 2 tablespoons ground crayfish",
//           "2 habanero peppers (or to your taste)",
//           "1 medium onion",
//           "Salt",
//           "big stock cubes",
//           "medium onion",
//         ],
//         category: "Igbo",
//         image: "jollof rice with chicken.jpg",
//       },

//       {
//         name: "Igbin",
//         description: `Original Igbin chops by the Yoruba tribe are the best for snack time. The dish is made of snails garnished with pepper sauce and onion. You can also turn it into a stew and serve it with fermented cassava fufu (Akpu), dried cassava (Eba/Garri), boiled & pounded yams (yam fufu), or green plantains fufu. Read more:

//          Source:  https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Shalled jumbo snails",
//           "Onion",
//           "Scotch bonnet peppers",
//           "Lime (or lemons)",
//           "Shrimp powder",
//           "Seafood bouillon powder",
//           "Bay leaf",
//           "palm Oil",
//         ],
//         category: "Yoruba",
//         image: "igbin.jpg",
//       },

//       {
//         name: "Ewa agoyin",
//         description: `
//         Agoyin originates from the Beninoise people. They call beans Ewa. You boil the beans till they are well cooked before mashing them into a soft paste.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Black/brown-eyed beans",
//           "Red palm oil",
//           "Crayfish",
//           "Oninos",
//           "Salt to taste",
//           "Pepper",
//           "Stock cubes",
//         ],
//         category: "Yoruba",
//         image: "ewa-agoyin.jpg",
//       },

//       {
//         name: "Asun",
//         description: `Asun is among the primary meals of the day in the Yoruba food culture. You prepare this finger-licking food by frying goat meat with a lot of pepper. Asun dish's breathtaking aroma makes it irresistible. You will love it if you are a fan of meat dishes.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Goat meat (cut with the skin)",
//           "Habanero pepers",
//           "Thyme",
//           "Oninos",
//           "Salt to taste",
//           "Palm oil",
//           "Stock cubes",
//           "Black pepper (Optional)",
//           "Red bell pepper",
//         ],
//         category: "Yoruba",
//         image: "asun.jpg",
//       },

//       {
//         name: "Amala",
//         description: `Amala is a classical Yoruba dish made out of cassava flour or yam. You only make yam flour into a smooth cake-like dish and serve it with different soups like Ewedu or Gbegiri. Amala food gets a dark brown color from the dry yam flour.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: ["Water", "Sifted yam flour", "Hot water"],
//         category: "Yoruba",
//         image: "amala.jpg",
//       },

//       {
//         name: "Key lime pie",
//         description: `If life gives you limes, don’t make limeade, make a Key lime pie. The official state pie of Florida, this sassy tart has made herself a worldwide reputation, which started in – where else? – the Florida Keys, from whence come the tiny limes that gave the pie its name.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Concoction of key lime juice",
//           "Aweetened condensed milk",
//           "egg yolks",
//         ],
//         category: "American",
//         image: "keylime-pie-american.jpg",
//       },

//       {
//         name: "Jambalaya",
//         description: `Jambalaya, crawfish pie, file gumbo … what dish could be so evocative that it inspired Hank Williams to write a party song for it in 1952 and dozens more to cover it (including everyone from Jo Stafford to Credence Clearwater Revival to Emmylou Harris)

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-yoruba-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: ["Meat", "Vegetable", "Rice", "egg yolks"],
//         category: "American",
//         image: "ambalaya-american.jpg",
//       },
//       {
//         name: "Tuwo Shinkafa",
//         description: `The most popular and well-liked Hausa dish in restaurants is these rice balls. Typically, soft rice is used to prepare it.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-hausa-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: ["medium/short grain", "rice", "water"],
//         category: "Hausa",
//         image: "tuwo-hausa.jpg",
//       },

//       {
//         name: "Dambu Nama",
//         description: `On the list of the most popular Hausa foods is a locally made Dambu delicacy that is made with beef. Dambu is not just a Hausa delicacy but is popular among other tribes in Nigeria.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-hausa-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Beef",
//           "pepper",
//           "salt",
//           "A red pepper",
//           "spicy seasoning cubes",
//           "Onion",
//           "Ginger powder",
//         ],
//         category: "Hausa",
//         image: "dambu-hausa.jpg",
//       },

//       {
//         name: "Miyan Geda",
//         description: `On the list of the most popular Hausa foods is a locally made Dambu delicacy that is made with beef. Dambu is not just a Hausa delicacy but is popular among other tribes in Nigeria.

//          Source: https://www.legit.ng/ask-legit/top/1144103-top-hausa-foods-names/`,
//         email: "johnsonakanmu2017@gmail.com",
//         ingredients: [
//           "Groundnut",
//           "Beef",
//           "Crayfish",
//           "Onion",
//           "palm Oil",
//           "Salt",
//           "Daddawa",
//           "Pepper",
//         ],
//         category: "Hausa",
//         image: "miyan-hausa.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDymmyRecipeData();

// async function insertDymmyData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Hausa",
//         image: "hausa-food.jpg",
//       },
//       {
//         name: "American",
//         image: "americans.jpg",
//       },
//       {
//         name: "Yoruba",
//         image: "yoruba-food.jpg",
//       },
//       {
//         name: "Mexican",
//         image: "mexican-food.jpg",
//       },
//       {
//         name: "Spanish",
//         image: "spaish-food.jpg",
//       },
//       {
//         name: "Igbo",
//         image: "igbo-food-ugu vegetable soup.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err" + error);
//   }
// }

// insertDymmyData();
