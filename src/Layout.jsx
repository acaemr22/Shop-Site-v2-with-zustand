import { useState, createContext, useReducer } from "react";
import Navbar from "./Components/Navbar";
import { Outlet, useSearchParams } from "react-router-dom";
import Footer from "./Components/Footer";
import { create } from "zustand";
import { produce } from "immer";

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
      return {
        basketProducts: [
          {
            text: action.text,
            number: action.number ? action.number : action.number === 0 ? 0 : 1,
            img: action.img,
            price: action.price,
            path: action.path,
          },
          ...state,
        ],
      };
    case "dec":
      const decObj = state.find((element) => element.path === action.path);
      const indexOfDecObj = state.findIndex(
        (element) => element.path === decObj.path
      );

      const decBasketProducts = produce(state, (draft) => {
        draft[indexOfDecObj] = { ...decObj, number: decObj.number - 1 };
      });

      localStorage.setItem("basketProducts", JSON.stringify(decBasketProducts));

      return { basketProducts: decBasketProducts };

    case "inc":
      const incObj = state.find((element) => element.path === action.path);

      const indexOfIncObj = state.findIndex(
        (element) => element.path === incObj.path
      );

      const incBasketProducts = produce(state, (draft) => {
        draft[indexOfIncObj] = {
          ...incObj,
          number:
            incObj.number +
            (action.number ? action.number : action.number === 0 ? 0 : 1),
        };
      });

      localStorage.setItem("basketProducts", JSON.stringify(incBasketProducts));
      return {
        basketProducts: incBasketProducts,
      };

    case "del":
      localStorage.setItem(
        "basketProducts",
        JSON.stringify(state.filter((p) => p.path !== action.path))
      );
      const returnArry = state.filter((p) => p.path !== action.path);
      return { basketProducts: returnArry };

    case "clear":
      localStorage.setItem("basketProducts", JSON.stringify([]));
      return { basketProducts: [] };

    default:
      return { basketProducts: state };
  }
};

export const useBasketProductsStore = create((set) => ({
  basketProducts: JSON.parse(localStorage.getItem("basketProducts")) || [],
  dispatch: (args) =>
    set((state) => basketProductsReducer(state.basketProducts, args)),
}));

function Layout() {
  // const [basketProducts, dispatchBasketProducts] = useReducer(
  //   basketProductsReducer,
  //   JSON.parse(localStorage.getItem("basketProducts")) || []
  // );

  const basketProducts = useBasketProductsStore(
    (state) => state.basketProducts
  );
  const dispatchBasketProducts = useBasketProductsStore(
    (state) => state.dispatch
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
