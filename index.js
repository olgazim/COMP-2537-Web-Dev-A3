const PAGE_SIZE = 10;
const MAX_BUTTONS = 5;
let currentPage = 1;
var pokemons = [];
var selected_pokemons = [];

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  $("#pokemonCards").empty();
  $("#pokemonCardsHeader").empty();

  startIndex = (currentPage - 1) * PAGE_SIZE;
  endIndex = currentPage * PAGE_SIZE;
  selected_pokemons = pokemons.slice(startIndex, endIndex);

  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    $("#pokemonCards").append(`
      <div class="pokemonCard card" pokemonName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn dark-blue" data-toggle="modal" data-target="#pokemonModal">
          More
        </button>
        </div>  
        `);
  });

  const numPages = Math.ceil(pokemons.length / PAGE_SIZE);
  const startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  const endPage = Math.min(startPage + MAX_BUTTONS - 1, numPages);

  $("#pagination").empty();

  $("#pagination").append(`
    <button class="btn dark-blue page ml-1 firstButton" value="1">
      First
    </button>
  `);

  if (currentPage > 1) {
    $("#pagination").append(`
      <button class="btn dark-blue page ml-1 prevButton" value="${
        currentPage - 1
      }">
        Previous
      </button>
    `);
  }

  $(".firstButton").on("click", function () {
    currentPage = 1;
    paginate(currentPage, PAGE_SIZE, pokemons);
  });

  $(".prevButton").on("click", function () {
    currentPage--;
    paginate(currentPage, PAGE_SIZE, pokemons);
  });

  for (let i = startPage; i <= endPage; i++) {
    const active = i === currentPage ? "active" : "";
    $("#pagination").append(`
    <button class="btn dark-blue page ml-1 numberedButtons ${active}" value="${i}">
      ${i}
    </button>
  `);
  }

  $(".numberedButtons").on("click", function () {
    currentPage = parseInt($(this).val());
    paginate(currentPage, PAGE_SIZE, pokemons);
  });

  if (currentPage < numPages) {
    $("#pagination").append(`
      <button class="btn dark-blue page ml-1 nextButton" value="${
        currentPage + 1
      }">
        Next
      </button>
    `);
  }

  $(".nextButton").on("click", function () {
    currentPage++;
    paginate(currentPage, PAGE_SIZE, pokemons);
  });

  $("#pagination").append(`
    <button class="btn dark-blue page ml-1 lastButton" value="${numPages}">
      Last
    </button>
  `);

  $(".lastButton").on("click", function () {
    currentPage = numPages;
    paginate(currentPage, PAGE_SIZE, pokemons);
  });

  // Update the pokemon count
  const totalPokemons = pokemons.length;
  const displayPokemonCards = selected_pokemons.length;
  const displayStart = (currentPage - 1) * PAGE_SIZE + 1;
  const displayEnd = displayStart + displayPokemonCards;
  $("#pokemonCardsHeader").append(`
    <h2 class="dark-blue-f">${displayPokemonCards} out of ${totalPokemons}</h2>
   
    <p>${displayStart} - ${displayEnd}</p>`);
};

const fetchPokemonTypes = async () => {
  $("#pokemonTypesFilter").empty();
  const res = await axios.get("https://pokeapi.co/api/v2/type");
  const types = res.data.results.map((type) => type.name);
  types.forEach((type) => {
    $("#pokemonTypesFilter").append(`
    <div class="filters mx-2">
    <input id="${type}" class="filter" type="checkbox" name="type" onclick="setup()" value="${type}">
    <label for="${type}" for="${type}" class="px-2"> ${type} </label>
    </div>
    `);
  });
};

// const filterPokemonsByType = async (pokemons, selectedTypes) => {};

const setup = async () => {
  $("#pokemonCards").empty();
  let response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
  );
  pokemons = response.data.results;

  paginate(currentPage, PAGE_SIZE, pokemons);

  // display pokemon details in modal
  $("body").on("click", ".pokemonCard", async function (e) {
    const pokemonName = $(this).attr("pokemonName");
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const pokemonDetails = res.data;
    // console.log("res.data: ", pokemonDetails);
    const types = pokemonDetails.types.map((type) => type.type.name);
    console.log("types: ", types);
    $(".modal-body").html(`
        <div>
        <div  class="text-center">
                <img id="limit-w" src="${
                  pokemonDetails.sprites.other["official-artwork"].front_default
                }" alt="${pokemonDetails.name}"/>
            </div>
            <!-- ABILITIES SECTION --->
            <div>
                <h3 class="title py-2 px-3">Abilities</h3>
                <ul>
                    ${pokemonDetails.abilities
                      .map((ability) => `<li>${ability.ability.name}</li>`)
                      .join("")}
                </ul>
            </div>
            <!-- STATS SECTION --->
            <div>
                <h3 class="title py-2 px-3">Stats</h3>
                <ul>
                ${pokemonDetails.stats
                  .map(
                    (stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`
                  )
                  .join("")}
                </ul>
            </div>

            <!-- TYPES SECTION --->
            <div>
                <h3 class="title py-2 px-3">Types</h3>
                <ul>
                    ${types.map((type) => `<li>${type}</li>`).join("")}
                </ul>
            </div>
        </div>
      
        `);
    $(".modal-title").html(`<h2>${pokemonDetails.name.toUpperCase()}</h2>`);
  });

  // add event listener to pagination buttons
  $("body").on("click", ".numberedButtons", async function (e) {
    const pageNum = parseInt($(this).attr("value"));
    currentPage = pageNum;
    // if (selectedTypes.length == 0) {
    paginate(currentPage, POKEMONS_PER_PAGE, pokemons);

    // }

    //update pagination buttons
    updatePaginationDiv(currentPage, numPages);
  });
};

fetchPokemonTypes();

$(document).ready(setup);
