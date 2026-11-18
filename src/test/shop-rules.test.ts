import { describe, expect, it, vi } from "vitest";
import { PRODUCTS } from "@/data/site";
import { engravingRequiresText, sortProducts, unitPrice } from "@/lib/shop";
import { submitForm, validateEmail, validateZip } from "@/lib/forms";

const board = PRODUCTS.find((p) => p.slug === "everyday-board")!;

describe("pricing", () => {
  it("starts the Everyday Board at $65 with base options", () => {
    expect(unitPrice(board, { size: "Small 12 x 9 in", wood: "Maple", engraving: "No engraving" })).toBe(65);
  });
  it("adds size, wood, and engraving modifiers from the data file", () => {
    expect(unitPrice(board, { size: "Large 20 x 14 in", wood: "Walnut", engraving: "Custom message" })).toBe(65 + 40 + 10 + 15);
  });
  it("sorts by price low to high", () => {
    const sorted = sortProducts(PRODUCTS, "price-asc");
    expect(sorted[0]?.slug).toBe("engraved-ornament");
    expect(sorted.at(-1)?.slug).toBe("end-grain-butcher-block");
  });
});

describe("engraving text rule", () => {
  it("requires text for name and message engraving only", () => {
    expect(engravingRequiresText("Name or monogram")).toBe(true);
    expect(engravingRequiresText("Custom message")).toBe(true);
    expect(engravingRequiresText("No engraving")).toBe(false);
  });
});

describe("form validation", () => {
  it("accepts 5 digit ZIP and ZIP+4, rejects others", () => {
    expect(validateZip("98327")).toBe("");
    expect(validateZip("98327-1234")).toBe("");
    expect(validateZip("9832")).not.toBe("");
  });
  it("rejects an invalid email with the specified message", () => {
    expect(validateEmail("name@")).toBe("Enter a valid email address, like name@example.com");
  });
});

describe("delivery honesty", () => {
  it("never reports sent when no endpoint is configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await submitForm("order-request", {}, "")).toEqual({ status: "not-connected" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it("reports an error, not sent, when the endpoint fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    const res = await submitForm("order-request", {}, "https://example.test/form");
    expect(res.status).toBe("error");
  });
});
