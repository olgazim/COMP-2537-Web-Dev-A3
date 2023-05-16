const setup = async () => {
  $("#pokemonCards").empty();
  let response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
  );
  //   const pokemons = response.data.results;
  // slice the pokemons
  const pokemons = response.data.results.slice(0, 15);
  for (let i = 0; i < pokemons.length; i++) {
    let innerResponse = await axios.get(`${pokemons[i].url}`);
    let thisPokemon = innerResponse.data;
    //   show modal on More btn click
    $("#pokemonCards").append(`
      <div class="pokemonCard card" pokemonName=${thisPokemon.name}>
        <h3>${thisPokemon.name}</h3> 
        <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal">
          More
        </button>
        </div>  
        `);
  }

  // display pokemon details in modal
  $("body").on("click", ".pokemonCard", async function (e) {
    const pokemonName = $(this).attr("pokemonName");
    console.log("pokemonName: ", pokemonName);
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const pokemonDetails = res.data;
    console.log("res.data: ", pokemonDetails);
    const types = pokemonDetails.types.map((type) => type.type.name);
    console.log("types: ", types);
    $(".modal-body").html(`
        <div style="width:200px">
            <img src="${
              pokemonDetails.sprites.other["official-artwork"].front_default
            }" alt="${pokemonDetails.name}"/>
            <div>
                <h3>Abilities</h3>
                <ul>
                    ${pokemonDetails.abilities
                      .map((ability) => `<li>${ability.ability.name}</li>`)
                      .join("")}
                </ul>
            </div>

            <div>
                <h3>Stats</h3>
                <ul>
                ${pokemonDetails.stats
                  .map(
                    (stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`
                  )
                  .join("")}
                </ul>
            </div>
        </div>

          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join("")}
          </ul>
      
        `);
    $(".modal-title").html(`<h2>${pokemonDetails.name.toUpperCase()}</h2>`);
  });
};

$(document).ready(setup);
