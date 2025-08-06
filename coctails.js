const modal = document.getElementById("modal");
const bootstrapModal = new bootstrap.Modal(modal);
const content = modal.querySelector(".content");
const div = document.getElementById("div");

const searchCocktail = async (query) => {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.drinks;
};

const getCoctails = (drinks) => {
  div.innerHTML = "";
  if (!drinks) {
    div.innerHTML = "<p>Коктейли не найдены</p>";
    document.querySelector(".preloader").style.display = "none";
    return;
  }

  const coctails = drinks.map((coctail, index) => {
    const buttonId = `btn-${index}`;
    const card = document.createElement("div");
    card.className = "card m-2";
    card.style.width = "18rem";

    card.innerHTML = `
 <img src=${coctail.strDrinkThumb} class="card-img-top" alt="...">
 <div class="card-body">
 <h5 class="card-title">${coctail.strDrink}</h5>
 <a href="#" id="${buttonId}" class="button btn btn-primary">Подробнее</a>
 </div>`;

    const btn = card.querySelector(`#${buttonId}`);
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      bootstrapModal.show();
      getIngredient(coctail);
    });
    return card;
  });
  div.append(...coctails);
  document.querySelector(".preloader").style.display = "none";

  const close = modal.querySelector(".close");
  close.addEventListener("click", async (e) => {
    modal.style.display = "none";
  });
};

const getIngredient = async (coctail) => {
  content.innerHTML = `<h5>${coctail.strDrink}</h5><ul class="list-unstyled">`;
  for (let i = 1; i <= 15; i++) {
    const ingredient = coctail[`strIngredient${i}`];
    const measure = coctail[`strMeasure${i}`];
    if (ingredient) {
      const ingridientImage = `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;
      const imgUrl = `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;
      content.innerHTML += `
  <li class="d-flex align-items-center my-2">
   <img src="${ingridientImage}" alt="${ingredient}" style="width: 40px; height: 40px; margin-right: 10px;">
   <span>${ingredient} - ${measure || ""}</span>
 </li>
 `;
    }
  }
  content.innerHTML += `<span>${coctail.strInstructions}</span>`;
};

searchBtn.addEventListener("click", async () => {
  const query = input.value.trim();
  if (query !== "") {
    document.querySelector(".preloader").style.display = "flex";
    const drinks = await searchCocktail(query);
    getCoctails(drinks);
  }
});
