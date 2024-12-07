import { useState } from "react";
import ProductCard from "../components/product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading: productLoading, data: searchedData } =
    useSearchProductsQuery({
      search,
      sort,
      category,
      page,
      price: maxPrice,
    });

  console.log(searchedData);

  const addToCartHandler = () => {};
  const isPreviousPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h1>Filters</h1>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="desc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {!loadingCategories &&
              categoriesResponse?.categories?.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-product-list">
          {searchedData?.products?.map((item) => (
            <ProductCard
              productId={item?._id}
              name={item?.name}
              price={item?.price}
              stock={item?.stock}
              photo={item?.photo}
              handler={addToCartHandler}
            />
          ))}
        </div>
        {/* <article>
          <button
            disabled={isPreviousPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            {page} of {4}
          </span>
          <button
            disabled={isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article> */}
        {searchedData && searchedData.totalPage >= 1 && (
          <article>
            <button
              disabled={!isPreviousPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
