import "../../styles/home.css";
import Card from "./Card";
import { obj } from "../../lib/api"; //this is where my json file is located to populate my cards
import sideObj from "@/lib/side";
import CardSide from "./CardSide";
import Category from "../Category";
import Footer from "../Footer";

function Home() {
  return (
    <div className="relative space-y-10" >
      <div className="px-2 md:px-14">
    <Category></Category>
      <section className="main-section px-2 md:px-14">
        <div className="home-div flex  flex-wrap justify-center">
          {obj.map((x) => (
            <Card
              key={x.id}
              img={x.imageUrl}
              label={x.label}
              category={x.category}
              title={x.title}
              colors={x.colors}
              price={x.price}
              discount={x.discount}
              discountedPrice={x.discountedPrice}
            />
          ))}
        </div>

        <div className="home-div flex flex-col items-start">
          <p className="Because-You-Picked-txt  pl-8">Because You Picked BadBunny</p>
          <div className="flex justify-center m-auto">
            {sideObj.slice(0, 4).map((x) => (
              <Card
                key={x.id} // Ensure a unique key is provided
                img={x.imageUrl}
                label={x.label}
                category={x.category}
                title={x.title}
                colors={x.colors}
                price={x.price}
                discount={x.discount}
                discountedPrice={x.discountedPrice}
              />
            ))}
          </div>
        </div>

        <div className="Products-Just-For-You-div">
          <p className="Products-Just-For-You-txt">Products Just For You</p>
          {obj.slice(0, 8).map((x) => (
            <CardSide
              key={x.id}
              img={x.imageUrl}
              label={x.label}
              category={x.category}
              colors={x.colors}
              price={x.price}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href="#" className="SeeMore -pl-10">
            See More
          </a>
          <svg
            width={"35px"}
            height={"15px"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </section>
    </div>
    <Footer/>
    </div>
  );
}

export default Home;
