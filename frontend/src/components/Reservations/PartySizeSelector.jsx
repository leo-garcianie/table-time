import { PARTY_SIZE_OPTIONS } from "../../utils/constants.js";

const PartySizeSelector = ({ selectedSize, onSizeSelected }) => {
  return (
    <div className="card z-99">
      <div className="">
        <h3 className="text-lg font-semibold text-dark">
          For how many guests?
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {PARTY_SIZE_OPTIONS.map((size) => {
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => onSizeSelected(size)}
              className={`size-10 rounded-md font-base transition-all duration-200 cursor-pointer justify-self-center
                ${
                  isSelected
                    ? "bg-primary text-white scale-105"
                    : "bg-white border border-gray-200 text-dark hover:border-primary/40 hover:bg-primary/10"
                }
                `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PartySizeSelector;
