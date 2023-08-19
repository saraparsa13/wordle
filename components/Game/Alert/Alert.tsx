import { useAppSelector } from "../../../store/hooks";
import styles from "./Alert.module.css";

const Alert: React.FC = () => {
  const { message } = useAppSelector(
    ({ game: { alertMessage } }) => alertMessage
  );

  return <div className={styles["alert-container"]}>{message}</div>;
};

export default Alert;
