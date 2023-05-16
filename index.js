const setup = async () => {
  $("#pokemonCards").empty();
  let response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
  );
  //   const pokemons = response.data.results;
  // slice the pokemons
  const pokemons = response.data.results.slice(0, 15);
  var newList = $(`<ol></ol>`);
  for (let i = 0; i < pokemons.length; i++) {
    newList.append(`<li> ${pokemons[i].name}</li>`);
  }
  $("#pokemonCards").append(newList);
  console.log(pokemons);
};

$(document).ready(setup);
