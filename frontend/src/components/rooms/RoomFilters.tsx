import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { AutocompleteInput } from "../common/AutocompleteInput";
import type { RoomFilters as RoomFiltersType } from "../../types/room.types";

type RoomFiltersProps = {
  value: RoomFiltersType;
  onChange: (value: RoomFiltersType) => void;
  roomTypes: string[];
};

export function RoomFilters({ value, onChange, roomTypes }: RoomFiltersProps) {
  const update = (key: keyof RoomFiltersType, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className="mb-6 rounded-lg border border-brand-border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Input
          label="Check-in"
          type="date"
          value={value.checkInDate ?? ""}
          onChange={(event) => update("checkInDate", event.target.value)}
        />
        <Input
          label="Check-out"
          type="date"
          value={value.checkOutDate ?? ""}
          onChange={(event) => update("checkOutDate", event.target.value)}
        />
        <AutocompleteInput
          label="Room Type"
          placeholder="Suite"
          value={value.type ?? ""}
          onChange={(nextValue) => update("type", nextValue)}
          suggestions={roomTypes}
          helperText="Filter by an existing type or type your own."
        />
        <Input
          label="Min Capacity"
          type="number"
          value={value.capacity ?? ""}
          onChange={(event) => update("capacity", event.target.value)}
        />
        <Input
          label="Min Price"
          type="number"
          value={value.minPrice ?? ""}
          onChange={(event) => update("minPrice", event.target.value)}
        />
        <Input
          label="Max Price"
          type="number"
          value={value.maxPrice ?? ""}
          onChange={(event) => update("maxPrice", event.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={() => onChange({})}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
