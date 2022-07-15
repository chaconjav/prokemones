import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Backdrop from "../Backdrop";
import apiClient from "../services/apiClient";

const time = {
  enter: 800,
  exit: 800,
};

const names = {
  enter: "",
  enterActive: "backdropOpen",
  exit: "",
  exitActive: "backdropClosed",
};

const ListPokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filterValueRef = useRef();

  const displayData = useRef();

  const getPokemonData = async (url) => {
    const result = await apiClient.getPokemon(url);
    const pokeData = await result.json();

    const id = pokeData.id;
    const name = pokeData.name;
    const weight = pokeData.weight;
    const height = pokeData.height;
    const sprite_front = pokeData.sprites.front_default;
    const sprite_back = pokeData.sprites.back_default;
    const mov1 = pokeData.moves[0]?.move?.name || "-Sin movimiento-";
    const mov2 = pokeData.moves[1]?.move?.name || "-Sin movimiento-";
    const mov3 = pokeData.moves[2]?.move?.name || "-Sin movimiento-";

    setPokemons((previousPokemons) => [
      ...previousPokemons,
      { id, name, weight, height, sprite_front, sprite_back, mov1, mov2, mov3 },
    ]);
  };

  useEffect(() => {
    async function getData() {
      try {
        const result = await apiClient.getPokemones();

        if (!result.ok) {
          throw Error("Imposible conectar con el sitio");
        }

        const pokemones = await result.json();

        for (let pokemon of pokemones.results) {
          await getPokemonData(pokemon.url);
        }
      } catch (e) {
        alert(e.message);
      }
    }
    getData();
  }, []);

  const deletePokemonHandler = (id) => {
    setPokemons((pokemons) => pokemons.filter((pokemon) => pokemon.id !== id));
    alert(`El pokemon con ID ${id} ha sido eliminado de la lista local.`);
  };

  const changeFilterTypeHandler = (e) => {
    setFilterOption(e.target.value);
    setFilterValue("");
    if (e.target.value !== "all") {
      filterValueRef.current.focus();
    }
  };

  const changeFilterValueHandler = (e) => {
    setFilterValue(e.target.value);
  };

  const applyFilters = (pokemon) => {
    switch (filterOption) {
      case "all":
        return true;
      case "id":
        if (parseInt(filterValue, 10) === pokemon.id) return true;
        return false;
      case "name":
        if (
          filterValue.toLocaleLowerCase() === pokemon.name.toLocaleLowerCase()
        )
          return true;
        return false;
      case "weight":
        if (parseInt(filterValue, 10) === pokemon.weight) return true;
        return false;
      case "height":
        if (parseInt(filterValue, 10) === pokemon.height) return true;
        return false;
      default:
        break;
    }

    return true;
  };

  const openModalHandler = (pokemon) => {
    const sprite_front = pokemon.sprite_front;
    const sprite_back = pokemon.sprite_back;
    const name = pokemon.name;
    const height = pokemon.height;
    const weight = pokemon.weight;
    const mov1 = `1.-${pokemon.mov1}`;
    const mov2 = `2.-${pokemon.mov2}`;
    const mov3 = `3.-${pokemon.mov3}`;

    setShowModal(true);

    displayData.current = {
      sprite_front,
      sprite_back,
      name,
      height,
      weight,
      mov1,
      mov2,
      mov3,
    };
  };

  return (
    <>
      <div className="main">
        <div className="header">POKEMONES</div>
        <div className="filter">
          <select
            name="filterType"
            value={filterOption}
            onChange={(e) => changeFilterTypeHandler(e)}
            className="filterSelection"
          >
            <option value="all">Mostrar Todos</option>
            <option value="id">Buscar por ID</option>
            <option value="name">Buscar por Nombre</option>
            <option value="weight">Buscar por Peso</option>
            <option value="height">Buscar por Altura</option>
          </select>
          {filterOption !== "all" ? (
            <span title="Indique el valor con el que desea realiar la búsqueda">
              <input
                type="text"
                className="filterValue"
                value={filterValue}
                ref={filterValueRef}
                onChange={(e) => changeFilterValueHandler(e)}
              />
            </span>
          ) : (
            <input
              disabled
              type="text"
              className="filterValue"
              value={filterValue}
              ref={filterValueRef}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
        </div>
        <table className="tData tHead1">
          <thead>
            <tr>
              <td width="52%">Datos del Pokemon</td>
              <td width="35%">Imagenes</td>
              <td width="13%">Eliminar</td>
            </tr>
          </thead>
        </table>
        <table className="tData tHead2">
          <thead>
            <tr>
              <td width="13%">ID</td>
              <td width="13%">Nombre</td>
              <td width="13%">Peso</td>
              <td width="13%">Altura</td>
              <td width="17.5%">Frontal</td>
              <td width="17.5%">Trasera</td>
              <td width="13%">X</td>
            </tr>
          </thead>
        </table>
        <table className="tData tBody">
          {pokemons.filter(applyFilters).map((pokemon) => (
            <tbody key={pokemon.id}>
              <tr>
                <td width="13%">{pokemon.id}</td>
                <td width="13%">{pokemon.name}</td>
                <td width="13%">{pokemon.weight}</td>
                <td width="13%">{pokemon.height}</td>
                <td width="17.5%">
                  <img
                    onMouseEnter={() => openModalHandler(pokemon)}
                    src={pokemon.sprite_front}
                    alt="sprite-front"
                  />
                </td>
                <td width="17.5%">
                  <img src={pokemon.sprite_back} alt="sprite-back" />
                </td>
                <td width="13%">
                  <span title="Permite eliminar el pokemón de la lista local.">
                    <button onClick={() => deletePokemonHandler(pokemon.id)}>
                      &times;
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={showModal}
        classNames={names}
        timeout={time}
      >
        <Backdrop
          closeModal={setShowModal.bind(null, false)}
          data={displayData.current}
        />
      </CSSTransition>
    </>
  );
};

export default ListPokemons;
