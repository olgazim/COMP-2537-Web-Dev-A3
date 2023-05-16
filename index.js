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
    console.log(thisPokemon);
    $("#pokemonCards").append(`
      <div class="pokemonCard card"  >
        <h3>${thisPokemon.name}</h3> 
        <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal">
          More
        </button>
        </div>  
        `);
  }
};

$(document).ready(setup);
