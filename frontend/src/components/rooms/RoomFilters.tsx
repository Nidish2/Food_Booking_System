import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { AutocompleteInput } from "../common/AutocompleteInput";
import type { RoomFilters as RoomFiltersType } from "../../types/room.types";
import { X } from "lucide-react";

type RoomFiltersProps = {
  value: RoomFiltersType;
  onChange: (value: RoomFiltersType) => void;
  roomTypes: string[];
};

export function RoomFilters({ value, onChange, roomTypes }: RoomFiltersProps) {
  const update = (key: keyof RoomFiltersType, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const hasFilters = Object.values(value).some((v) => v !== undefined && v !== "");

  return (
    <div className="relative z-30 rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(9,47,107,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6 items-end">
        <Input
          label="Check-in"
          type="date"
          value={value.checkInDate ?? ""}
          onChange={(event) => update("checkInDate", event.target.value)}
          className="w-full"
        />
        <Input
          label="Check-out"
          type="date"
          value={value.checkOutDate ?? ""}
          onChange={(event) => update("checkOutDate", event.target.value)}
          className="w-full"
        />
        <div className="lg:col-span-2">
          <AutocompleteInput
            label="Room Type"
            placeholder="Search Suite, King..."
            value={value.type ?? ""}
            onChange={(nextValue) => update("type", nextValue)}
            suggestions={roomTypes}
            helperText=""
          />
        </div>
        <Input
          label="Capacity"
          type="number"
          placeholder="1 guest"
          value={value.capacity ?? ""}
          onChange={(event) => update("capacity", event.target.value)}
          className="w-full"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min Price"
            type="number"
            placeholder="Min"
            value={value.minPrice ?? ""}
            onChange={(event) => update("minPrice", event.target.value)}
            className="w-full"
          />
          <Input
            label="Max Price"
            type="number"
            placeholder="Max"
            value={value.maxPrice ?? ""}
            onChange={(event) => update("maxPrice", event.target.value)}
            className="w-full"
          />
        </div>
      </div>
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onChange({})}
            className="text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-full py-1.5 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
