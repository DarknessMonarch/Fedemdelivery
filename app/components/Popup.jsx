import styles from "@/app/styles/popup.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import { IoIosCloseCircle as ExitIcon } from "react-icons/io";

export default function PopupComponent({  
  content,
}) {
  const { popup, togglePopup } = useDrawerStore();

  if (!popup) {
    return null;
  }

  return (
    <div className={styles.popupBackdrop}>
    <div className={styles.popupContainer}>
      <div className={styles.popupHeader}>
        <div className={styles.popupExit}>
          <ExitIcon
            className={styles.popupIcon}
            alt="Exit icon"
            onClick={togglePopup}
            width={30}
            height={30}
          />
        </div>
      </div>
      {content}
    </div>
    </div>

  );
}
