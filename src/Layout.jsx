import { useState, createContext, useReducer } from "react";
import Navbar from "./Components/Navbar";
import { Outlet, useSearchParams } from "react-router-dom";
import Footer from "./Components/Footer";

const basketProductsReducer = (state, action) => {
  if (action.type === "add") {
    const booleanState = state.some((element) => element.path === action.path);
    console.log(booleanState);
    if (booleanState) {
      action.type = "inc";
    }

    if (action.number === 0) {
      action.type = "none";
    }
  }

  switch (action.type) {
    case "add":
      console.log(action);
      console.log(state);

      localStorage.setItem(
        "basketProducts",
        JSON.stringify([
          {
            text: action.text,
            number: action.number ? action.number : action.number === 0 ? 0 : 1,
            img: action.img,
            price: action.price,
            path: action.path,
          },
          ...state,
        ])
      );
      return [
        {
          text: action.text,
          number: action.number ? action.number : action.number === 0 ? 0 : 1,
          img: action.img,
          price: action.price,
          path: action.path,
        },
        ...state,
      ];
    case "dec":
      const decObj = state.find((element) => element.path === action.path);
      const filteredStateDec = state.filter(
        (element) => element.path !== decObj.path
      );
      localStorage.setItem(
        "basketProducts",
        JSON.stringify([
          { ...decObj, number: decObj.number - 1 },
          ...filteredStateDec,
        ])
      );
      return [{ ...decObj, number: decObj.number - 1 }, ...filteredStateDec];

    case "inc":
      const incObj = state.find((element) => element.path === action.path);
      const filteredStateInc = state.filter(
        (element) => element.path !== incObj.path
      );
      localStorage.setItem(
        "basketProducts",
        JSON.stringify([
          {
            ...incObj,
            number:
              incObj.number +
              (action.number ? action.number : action.number === 0 ? 0 : 1),
          },
          ...filteredStateInc,
        ])
      );
      return [
        {
          ...incObj,
          number:
            incObj.number +
            (action.number ? action.number : action.number === 0 ? 0 : 1),
        },
        ...filteredStateInc,
      ];

    case "del":
      localStorage.setItem(
        "basketProducts",
        JSON.stringify(state.filter((p) => p.path !== action.path))
      );
      return state.filter((p) => p.path !== action.path);

    case "clear":
      localStorage.setItem("basketProducts", JSON.stringify([]));
      return [];

    default:
      return state;
  }
};

const useBasketStore = create((set) => ({
  products: [],
  dispatch: (args) => set((state) => reducer(state, args)),
}));

const dispatch = useBasketStore((state) => state.dispatch);
dispatch({ type: types.increase, by: 2 });

function Layout() {
  const [basketProducts, dispatchBasketProducts] = useReducer(
    basketProductsReducer,
    JSON.parse(localStorage.getItem("basketProducts")) || []
  );

  const loggedIn = localStorage.getItem("loggedIn") || false;
  const [searchParams, setSearchParams] = useSearchParams();
  let isLoggedIn = localStorage.getItem("isLoggedIn") || false;
  localStorage.setItem("isLoggedIn", isLoggedIn);

  return (
    <div className="">
      <Navbar
        setSearchParams={setSearchParams}
        basketProducts={basketProducts}
        dispatchBasketProducts={dispatchBasketProducts}
        loggedIn={loggedIn}
        searchParams={searchParams}
      />
      <Outlet
        context={{
          searchParamsList: [searchParams, setSearchParams],
          basket: [basketProducts, dispatchBasketProducts],
          loggedIn,
        }}
      />
      <Footer />
    </div>
  );
}

export default Layout;
