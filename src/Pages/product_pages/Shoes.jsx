import { Suspense } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";

import { Products } from "./Bottles";

import Loading from "../Loading";

export async function loader() {
  async function fetchData() {
    const fetchedData = await fetch(
      "/web-scraper/JSON/Shoes/scrapedDataShoes.json"
    );
    return await fetchedData.json();
  }
  return defer({ resp: fetchData() });
}

const Shoes = () => {
  const shoes = useLoaderData();

  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-3 lg:px-10 py-10">
      <Suspense fallback={<Loading />}>
        <Await
          resolve={shoes.resp}
        >
          <Products classNameImg={" p-5 sm:p-10 md:p-20 sm:w-[400px]"} />
        </Await>
      </Suspense>
    </main>
  );
};

export default Shoes;
