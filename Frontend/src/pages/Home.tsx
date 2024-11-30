import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"

function Home() {

  const addToCartHandler = () => {}

  return (
    <div className="home">
      <section>

      </section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>
      <main>
        <ProductCard productId="11" name="Macbook" price={45454} stock={31} photo="https://m.media-amazon.com/images/I/71MUhny6I0L._AC_UF894,1000_QL80_FMwebp_.jpg"  handler={addToCartHandler} />
        </main>
    </div>
  )
}

export default Home
