export const SECTORS = [
  "Power transmission equipment manufacturers (gearboxes, couplings, drives)",
  "Industrial pump & compressor OEMs",
  "Valve & actuator manufacturers",
  "Bearing & precision component manufacturers",
  "Heavy-duty machine tool builders",
  "Jigs, fixtures & tooling manufacturers",
  "Cement plant equipment manufacturers",
  "Mining equipment & crushing machinery OEMs",
  "Port & shipyard material handling operators",
  "Thermal & hydro power plant EPC contractors",
  "Fertilizer & chemical plant constructors",
  "Sugar & ethanol plant machinery suppliers",
  "Upstream drilling equipment fabricators",
  "Midstream pipeline EPC contractors",
  "Skid-mounted package unit builders (separators, metering skids)",
  "Refinery & petrochemical turnaround contractors",
  "Offshore platform structural fabricators",
  "LNG terminal equipment suppliers",
  "Steel melt shop equipment OEMs (EAF, induction furnaces)",
  "Rolling mill machinery manufacturers",
  "Industrial furnace & heat treatment equipment builders",
  "Welding automation system integrators",
  "Continuous casting machine manufacturers",
  "Slag handling & ladle car system builders",
  "ERW & SAW pipe mill equipment suppliers",
  "Pipe end-finishing & beveling machine OEMs",
  "Pipe testing & inspection system manufacturers",
  "Pipe coating & lining plant builders",
  "Pipe bending & manipulation equipment makers",
  "HDPE & polymer pipe extrusion equipment makers",
  "Bulk material handling system integrators (belt, screw, bucket conveyors)",
  "Overhead crane & EOT crane manufacturers",
  "Automated guided vehicle (AGV) system builders",
  "Warehouse & logistics automation integrators",
  "Stackers, reclaimers & ship loaders",
  "Pneumatic conveying system suppliers",
  "Structural steel fabrication shops (bridges, mezzanines, platforms)",
  "Pressure vessel & heat exchanger fabricators",
  "Storage tank (API 650/620) construction contractors",
  "Industrial chimney & flue duct fabricators",
  "Skid & module fabricators for process plants",
  "Custom machine frame & base fabricators",
];

export const COUNTRIES = [
  "USA",
  "UK",
  "Australia",
  "Spain",
  "Taiwan",
  "Scotland",
  "Korea",
  "Japan",
  "Brazil",
];

export interface IcpRow {
  id: number;
  industry: string;
  region: string;
  revenueMin: string;
  revenueMax: string;
  productKeywords: string;
}

// No dummy rows — output table starts empty until n8n responds
export const DUMMY_ICP_ROWS: IcpRow[] = [];
