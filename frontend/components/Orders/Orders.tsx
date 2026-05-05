import Button from "../Button/Button";
import css from "./Orders.module.css";

export default function Orders() {
  const handleAddOrder = () => {};
  return (
    <div>
      <Button onClick={handleAddOrder} className={css.addButton}>
        +
      </Button>
    </div>
  );
}
