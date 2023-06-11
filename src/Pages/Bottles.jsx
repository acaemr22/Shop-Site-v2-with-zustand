import { useState, useEffect, Suspense } from "react";
import {
  useLoaderData,
  useOutletContext,
  defer,
  Await,
} from "react-router-dom";
import Card from "../Components/Card";
import Loading from "./Loading";

export async function loader() {
  async function fetchData() {
    const fetchedData = await fetch(
      "/web-scraper/JSON/SuCo/scrapedDataSuCoBottles.json"
    );

    return await fetchedData.json();
  }
  return defer({ resp: fetchData() });
}

const Bottles = () => {
  const { searchParamsList } = useOutletContext();

  const [searchParams, setSearchParams] = searchParamsList;
  let search = searchParams.get("search");
  const bottles = useLoaderData();
  const [filteredBottles, setFilteredBottles] = useState(bottles);

  useEffect(() => {
    search = searchParams.get("search");
    setFilteredBottles(
      search
        ? bottles.filter((bottle) =>
            bottle.title
              .toLocaleUpperCase()
              .includes(search.toLocaleUpperCase())
          )
        : bottles
    );
  }, [searchParams.get("search")]);

  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-3 lg:px-10 py-10 bg-gray-100">
      <Suspense fallback={<Loading />}>
        <Await
          resolve={bottles.resp}
          errorElement={<p>Error loading package location!</p>}
        >
          {(resp) =>
            resp.map((bottle) => (
              <Card
                key={bottle.id}
                id={bottle.id}
                price={bottle.price}
                productName={bottle.title}
                img={bottle.url}
                number={bottle.number}
              />
            ))
          }
        </Await>
      </Suspense>{" "}
    </main>
  );
};

export default Bottles;
