

document.addEventListener("DOMContentLoaded", function () {
  let addIngredientsBtn = document.getElementById("addIngredientsBtn");
  if (addIngredientsBtn) {
    let ingredientList = document.querySelector(".ingredientList");
    let ingredientDiv = document.querySelector(".ingredientDiv");

    addIngredientsBtn.addEventListener("click", function () {
      let newIngredients = ingredientDiv.cloneNode(true);
      let input = newIngredients.querySelector("input");
      input.value = "";
      ingredientList.appendChild(newIngredients);
    });
  } 
});


 