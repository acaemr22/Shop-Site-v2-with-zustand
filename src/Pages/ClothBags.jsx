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
    const fetchedData = await fetch(
      "/web-scraper/JSON/ClothBags/scrapedDataClothBags.json"
    );

    return await fetchedData.json();
  }
  return defer({ resp: fetchData() });
}

const ClothBags = () => {
  const { searchParamsList } = useOutletContext();

  const [searchParams, setSearchParams] = searchParamsList;
  let search = searchParams.get("search");
  const clothBags = useLoaderData();
  const [filteredClothBags, setFilteredClothBags] = useState(clothBags);

  useEffect(() => {
    search = searchParams.get("search");
    setFilteredClothBags(
      search
        ? clothBags.filter((clothBag) =>
            clothBag.title
              .toLocaleUpperCase()
              .includes(search.toLocaleUpperCase())
          )
        : clothBags
    );
  }, [searchParams.get("search")]);

  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-3 lg:px-10 py-10">
      <Suspense fallback={<Loading />}>
        <Await
          resolve={clothBags.resp}
          errorElement={<p>Error loading package location!</p>}
        >
          {(resp) =>
            resp.map((clothBag) => (
              <Card
                key={clothBag.id}
                id={clothBag.id}
                price={clothBag.price}
                productName={clothBag.title}
                img={clothBag.url}
                number={clothBag.number}
              />
            ))
          }
        </Await>
      </Suspense>
    </main>
  );
};

export default ClothBags;
