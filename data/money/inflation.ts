/**
 * Price data for the Inflation Time Machine.
 *
 * CPI_INDEX: World Bank indicator FP.CPI.TOTL, "Consumer price index (2010 = 100)",
 * India, retrieved October 2026 (series last updated 13 July 2026). Values for
 * 1990-2025 are actual. From 2026 on the lab ASSUMES 4% a year, the inflation
 * target the Government notified for the RBI for April 2026 to March 2031.
 *
 * PETROL_DELHI: Petroleum Planning & Analysis Cell (PPAC), "Revision in Retail
 * Selling Prices of Petrol and Diesel at Delhi", price as on 1 April of each
 * year (IOC outlets), Rs per litre.
 */

export const CPI_SOURCE = {
  label: "World Bank, Consumer price index for India (2010 = 100)",
  url: "https://data.worldbank.org/indicator/FP.CPI.TOTL?locations=IN",
};
export const PETROL_SOURCE = {
  label: "PPAC, retail selling price of petrol at Delhi",
  url: "https://ppac.gov.in/retail-selling-price-rsp-of-petrol-diesel-and-domestic-lpg/rsp-of-petrol-and-diesel-at-delhi-up-to-15-6-2017",
};
export const TARGET_SOURCE = {
  label: "Inflation target of 4% notified for April 2026 to March 2031",
  url: "https://www.outlookmoney.com/banking/rbi-to-maintain-4-per-cent-inflation-target-until-2031-centre",
};

export const CPI_INDEX: Record<number, number> = {
  1990: 22.95, 1991: 26.13, 1992: 29.21, 1993: 31.06, 1994: 34.24, 1995: 37.75, 1996: 41.13, 1997: 44.08,
  1998: 49.91, 1999: 52.24, 2000: 54.34, 2001: 56.39, 2002: 58.82, 2003: 61.05, 2004: 63.35, 2005: 66.04,
  2006: 69.87, 2007: 74.32, 2008: 80.53, 2009: 89.29, 2010: 100, 2011: 108.91, 2012: 119.24, 2013: 131.18,
  2014: 139.92, 2015: 146.79, 2016: 154.05, 2017: 159.18, 2018: 165.45, 2019: 171.62, 2020: 182.99,
  2021: 192.38, 2022: 205.27, 2023: 216.86, 2024: 227.6, 2025: 233.06,
};

export const LAST_ACTUAL_YEAR = 2025;
export const ASSUMED_FUTURE_INFLATION = 0.04;
export const FIRST_YEAR = 1990;
export const LAST_YEAR = 2045;
export const THIS_YEAR = 2026;

/** Official petrol price at Delhi on 1 April of each year (PPAC). */
export const PETROL_DELHI: Record<number, number> = {
  2002: 26.54, 2003: 33.49, 2004: 33.71, 2005: 37.99, 2006: 43.51, 2007: 42.85, 2008: 45.52, 2009: 40.62,
  2010: 47.93, 2011: 58.37, 2012: 65.64, 2013: 68.31, 2014: 72.26, 2015: 60.49, 2016: 59.68, 2017: 66.29,
};

export function cpiFor(year: number): number {
  if (year <= LAST_ACTUAL_YEAR) return CPI_INDEX[Math.max(FIRST_YEAR, year)];
  return CPI_INDEX[LAST_ACTUAL_YEAR] * Math.pow(1 + ASSUMED_FUTURE_INFLATION, year - LAST_ACTUAL_YEAR);
}

export interface InflationItem {
  id: string;
  label: string;
  unit: string;
  anchorYear: number;
  anchorPrice: number;
  anchorNote: string;
}

export const INFLATION_ITEMS: InflationItem[] = [
  { id: "samosa", label: "A samosa", unit: "each", anchorYear: THIS_YEAR, anchorPrice: 20, anchorNote: "₹20 in 2026 is an illustrative price, not a survey figure." },
  { id: "petrol", label: "A litre of petrol (Delhi)", unit: "a litre", anchorYear: 2017, anchorPrice: 66.29, anchorNote: "Starts from the official PPAC price on 1 April 2017. The dots are real PPAC prices." },
  { id: "school-fees", label: "A year of school fees", unit: "a year", anchorYear: THIS_YEAR, anchorPrice: 60000, anchorNote: "₹60,000 a year in 2026 is an illustrative fee. Real fees vary widely and have often risen faster than average prices." },
];

/** Price of an item in `year`, moved with the all-items consumer price index. */
export function priceIn(item: InflationItem, year: number): number {
  return item.anchorPrice * (cpiFor(year) / cpiFor(item.anchorYear));
}

/** What ₹100 from `from` is worth in `to` money. */
export function rupeesEquivalent(amount: number, from: number, to: number): number {
  return amount * (cpiFor(to) / cpiFor(from));
}
