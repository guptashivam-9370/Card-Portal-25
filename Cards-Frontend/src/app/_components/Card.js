const Card = ({ card, id }) => {
  return (
    <>
      <div className="card">
        <div className="head">
          <p className="num">Card {id + 1}</p>
          <a
            href={card.pdf_url}
            target="_blank"
            download={`alcheringa_${card.pass_type.toLowerCase()}_card_${
              card.user_id
            }.pdf`}
          >
            <img src="images/download.svg" />
          </a>
        </div>
        <div className="image-container">
          {card.download_url ? (
            <img
              className="image"
              src={card.download_url}
              alt={`Card for ${card.user_id}`}
            />
          ) : (
            <p>Image unavailable for {card.user_id}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
