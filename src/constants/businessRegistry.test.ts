import { test, expect, describe } from "bun:test";
import { BUSINESS_CATEGORIES_INFO, ALL_BUSINESSES } from "./businessRegistry";

describe("Business Registry Constants", () => {
  test("should have a non-empty BUSINESS_CATEGORIES_INFO array", () => {
    expect(Array.isArray(BUSINESS_CATEGORIES_INFO)).toBe(true);
    expect(BUSINESS_CATEGORIES_INFO.length).toBeGreaterThan(0);
  });

  test("should have unique IDs for all categories", () => {
    const ids = BUSINESS_CATEGORIES_INFO.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  test("should have all required properties for each category", () => {
    BUSINESS_CATEGORIES_INFO.forEach((category) => {
      expect(category.id).toBeDefined();
      expect(category.icon).toBeDefined();
      expect(category.label).toBeDefined();
      expect(category.labelHi).toBeDefined();
      expect(category.terminology).toBeDefined();
      expect(Array.isArray(category.defaultServices)).toBe(true);
      expect(category.defaultServices.length).toBeGreaterThan(0);
    });
  });

  test("should have valid terminology for each category", () => {
    BUSINESS_CATEGORIES_INFO.forEach((category) => {
      const { terminology } = category;
      expect(terminology.provider).toBeDefined();
      expect(terminology.action).toBeDefined();
      expect(terminology.noun).toBeDefined();
      expect(terminology.item).toBeDefined();
      expect(terminology.unit).toBeDefined();
    });
  });

  test("should have valid default services for each category", () => {
    BUSINESS_CATEGORIES_INFO.forEach((category) => {
      category.defaultServices.forEach((service) => {
        expect(service.id).toBeDefined();
        expect(service.name).toBeDefined();
        expect(typeof service.price).toBe("number");
        expect(typeof service.avgTime).toBe("number");
      });
    });
  });

  test("should have ALL_BUSINESSES matching BUSINESS_CATEGORIES_INFO", () => {
    expect(ALL_BUSINESSES).toBe(BUSINESS_CATEGORIES_INFO);
  });
});
