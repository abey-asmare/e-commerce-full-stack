import "../../styles/card.css"; //importing css file for the cards

function Card(props) {
  return (
    <div className="">
      <div className="main-card-div">
        <div className="Card-div">
          <img className="Card-img" src={props.img} alt="" />
          <p className="label">{props.label}</p>
          <p className="category">{props.category}</p>
          <p>{props.title}</p>
          <p className="colors">{props.colors}</p>
          <p className="price">{props.price}</p>
          {props.discount ? (
            <p className="discount">{props.discountedPrice}% Off</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
//key-id label category title colors price discountedPrice imageUrl stockStatus

export default Card;
