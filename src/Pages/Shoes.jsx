import { useState, useEffect, Suspense } from "react";
import Card from "../Components/Card";
import {
  useLoaderData,
  useOutletContext,
  defer,
  Await,
} from "react-router-dom";

import Loading from "./Loading";


export async function loader() {
  async function fetchData() {
    const fetchedData = await fetch("/web-scraper/JSON/Shoes/scrapedDataShoes.json");
    return await fetchedData.json()
  }
  return { resp: fetchData() };
}

const Shoes = () => {
  const { searchParamsList } = useOutletContext();

  const [searchParams, setSearchParams] = searchParamsList;
  let search = searchParams.get("search");
  const shoes = useLoaderData();
  const [filteredShoes, setFilteredShoes] = useState(shoes);

  useEffect(() => {
    search = searchParams.get("search");
    setFilteredShoes(
      search
        ? shoes.filter((shoe) =>
            shoe.title.toLocaleUpperCase().includes(search.toLocaleUpperCase())
          )
        : shoes
    );
  }, [searchParams.get("search")]);

  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-3 lg:px-10 py-10">
      <Suspense fallback={<Loading/>}>
        <Await
          resolve={shoes.resp}
          errorElement={<p>Error loading package location!</p>}
        >
          {(resp) => resp.map((shoe) => (
            <Card
              classNameImg={" p-5 sm:p-10 md:p-20 sm:w-[400px]"}
              key={shoe.id}
              id={shoe.id}
              price={shoe.price}
              productName={shoe.title}
              img={shoe.url}
              number={shoe.number}
            />
          ))}
        </Await>
      </Suspense>
    </main>
  );
};

export default Shoes;
