import { getTableTypeColor } from "../../utils/helpers.js";

const TableSelector = ({
  tables = [],
  selectedTable,
  onTableSelect,
  partySize,
}) => {
  const filteredTables = tables.filter(
    (table) => !partySize || table.capacity >= partySize,
  );

  if (filteredTables.length === 0) {
    return (
      <div className="card z-99">
        <div className="text-dark mb-2">
          <p>No tables available for {partySize} people at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card z-999">
      <div className="space-x-2">
        <h3 className="text-lg font-semibold text-dark">Choose a table</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTables.map((table) => {
          const isSelected = selectedTable?.id === table.id;

          return (
            <button
              key={table.id}
              onClick={() => onTableSelect(table)}
              className={`
                p-4 rounded-lg border text-left transition-all duration- cursor-pointer
                ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#1E1E1E]">
                  Table {table.id}
                </span>
                <span
                  className={`px-2 rounded-md text-xs font-medium ${getTableTypeColor(
                    table.type,
                  )}`}
                >
                  {table.type}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>Up to {table.capacity} people</span>
              </div>

              {table.description && (
                <p className="text-sm text-gray-500">{table.description}</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-500">
        <p>
          Only the available tables for {partySize || "the number of"} people
          are shown
        </p>
      </div>
    </div>
  );
};

export default TableSelector;
