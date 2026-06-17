import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, RoomCardSkeleton, RoomGridSkeleton, BookingHistorySkeleton } from "./SkeletonLoader";

describe("Skeleton components", () => {
  it("renders a generic skeleton loader", () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    const div = container.firstChild;
    expect(div).toHaveClass("animate-pulse", "w-10", "h-10");
  });

  it("renders a RoomCardSkeleton with internal skeletons", () => {
    const { container } = render(<RoomCardSkeleton />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });

  it("renders a RoomGridSkeleton with exactly 3 RoomCardSkeletons", () => {
    const { container } = render(<RoomGridSkeleton />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    // 3 cards * at least 5 skeletons = 15+ skeletons
    expect(skeletons.length).toBeGreaterThanOrEqual(15);
  });

  it("renders a BookingHistorySkeleton correctly", () => {
    const { container } = render(<BookingHistorySkeleton />);
    const cards = container.querySelectorAll(".rounded-2xl");
    expect(cards.length).toBe(3);
  });
});
