import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import {
  getCharacter,
  getStarWarsCharacters,
  searchCharacter,
} from "./api/people.js";

function App() {
  const InputSearch = useRef(null);

  const [page, setPage] = useState(1);
  const [textInput, setTextInput] = useState("");
  const [people, setPeople] = useState(null);
  const [errorState, setErrorState] = useState({ hasError: false });
  const [characterId, setCharacterId] = useState(1);
  const [detail, setDetail] = useState({});

  const handleError = (error) => {
    setErrorState({ hasError: true, message: error.message });
  };

  const showDetail = async (character) => {
    let id = Number(character.url.split("/").slice(-2)[0]);
    setCharacterId(id);
  };

  const onChangeSearch = (e) => {
    e.preventDefault();
    const text = InputSearch.current.value;
    setTextInput(text);
  };

  const onSubmitSearch = async (e) => {
    if (e.key === "Enter") {
      InputSearch.current.value = "";
      setDetail({});
      const data = await searchCharacter(textInput);
      setDetail(data.results[0]);
      setPeople(data);
    }
  };

  const onChangePage = (next) => {
    if (people.previous && page + next <= 0) {
      return;
    }
    if (people.next && page + next > 9) {
      return;
    }
    setPage(page + next);
  };

  useEffect(() => {
    getStarWarsCharacters(page).then(setPeople).catch(handleError);
  }, [page]);

  useEffect(() => {
    getCharacter(characterId).then(setDetail).catch(handleError);
  }, [characterId]);

  useEffect(() => {
    console.log(people);
  }, [people]);

  return (
    <div>
      <input
        ref={InputSearch}
        type="text"
        onChange={onChangeSearch}
        onKeyDown={onSubmitSearch}
        placeholder="Search a character"
      />
      <ul>
        {errorState.hasError && <p>{errorState.message}</p>}
        {people &&
          people.results.map((characters) => {
            return (
              <li key={characters.name} onClick={() => showDetail(characters)}>
                {characters.name}
              </li>
            );
          })}
      </ul>
      <section>
        <button onClick={() => onChangePage(-1)}>prev</button>
        {page}
        <button onClick={() => onChangePage(1)}>next</button>
      </section>
      {detail && (
        <aside>
          <h1>{detail.name}</h1>
          <ul>
            <li>height: {detail.height}</li>
            <li>mass: {detail.mass}</li>
            <li>Year of birth: {detail.birth_year}</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

export default App;
