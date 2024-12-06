import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";

function Home() {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = () => {};

  if (isError) toast.error("Cannot Fetch The Products");

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products?.map((i, index) => (
            <ProductCard
              key={i?._id}
              productId={i?._id}
              name={i?.name}
              price={i?.price}
              stock={i?.stock}
              photo={i?.photo}
              handler={addToCartHandler}
            />
          ))
        )}
      </main>
    </div>
  );
}

export default Home;
