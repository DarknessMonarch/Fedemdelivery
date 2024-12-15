import { useState } from "react";
import styles from "@/app/styles/dropdown.module.css";
import { RiArrowDropDownLine as DropdownIcon  } from "react-icons/ri";

export default function Dropdown({
  options = [],
  onSelect,
  Icon,
  dropPlaceHolder,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    const optionToSelect = typeof option === 'object' ? option.name : option;
    
    setSelectedOption(optionToSelect);
    onSelect(optionToSelect);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownInput} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.dropdownLine}>
        {Icon}
        <span>{selectedOption || dropPlaceHolder}</span>
        </div>
      
        <DropdownIcon
          className={styles.dropdownIcon}
          alt="Dropdown icon"
          aria-label="Dropdown icon"
        />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className={styles.dropdownArea}>
          {options.map((option, index) => (
            <span 
              key={typeof option === 'object' ? option.code : index} 
              onClick={() => handleSelect(option)}
            >
              {typeof option === 'object' ? option.name : option}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}