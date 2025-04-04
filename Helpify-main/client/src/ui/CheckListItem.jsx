import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function ChecklistItem({ children }) {
  return (
    <li className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-[#2937B1] flex justify-center items-center">
        <FontAwesomeIcon icon={faCheck} className="text-white w-3 h-3" />
      </div>
      <span className="text-[16px] font-medium leading-[26px] text-[rgba(20,20,20,0.8)]">
        {children}
      </span>
    </li>
  );
}

// Validate props
ChecklistItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChecklistItem;
