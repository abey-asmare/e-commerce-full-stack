import React from "react";

import "../../styles/cardside.css";

//edit the whole shit

function CardSide(props) {
  return (
    <div className="main-card">
      <div className="card">
        <img src={props.img} alt="" className="card-image" />
        <div className="card-content">
          <p className="card-label">{props.label}</p>
          <p className="card-category">{props.category}</p>
          <p className="card-name">{props.name}</p>
          <p className="card-colors">{props.colors}</p>
          <p className="card-price">${props.price}</p>
          {props.discount ? (
            <p className="discount">{props.discountedPrice}% Off</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
//key-id label category title colors price discountedPrice imageUrl stockStatus

/**  <div className="main-card-div">
            <div className="Card-div">
            
            <img className="Card-img" src={props.img} alt="" />
            <p className="label">{props.label}</p>
            <p className="category">{props.category}</p>
            <p>{props.title}</p>
            <p className="colors">{props.colors}</p>
            <p className="price">{props.price}</p>
        </div>
        </div> */
export default CardSide;
