import style from './Card.css'
const Card = (props) => {
  return (
    <div className={style.card}>
      {props.children}
    </div>
  );
}

export default Card;