const apiClient = {
  getPokemones: () => {
    return fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0", {
      method: "GET",
    });
  },
  getPokemon: (url) => {
    return fetch(url, {
      method: "GET",
    });
  },
};

export default apiClient;
