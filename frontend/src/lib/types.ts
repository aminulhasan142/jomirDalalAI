export interface ShareBreakdown {
  ana: number;
  gonda: number;
  kara: number;
  kranti: number;
  til?: number;
}

export interface KhatianOwner {
  owner_id?: string;
  name: string;
  share_text: string;
  share_breakdown: ShareBreakdown;
  calculated_decimal?: number;
  ownership_percentage?: number;
  calculated_area_decimal?: number;
  calculated_area_sqft?: number;
}

export interface FamilyHeir {
  relation: string; // e.g. "স্ত্রী" (Wife), "পুত্র" (Son), "কন্যা" (Daughter), "পিতা" (Father), "মাতা" (Mother)
  count: number;
  name?: string;
}

export interface FamilyTree {
  deceased_owner: string;
  deceased_share?: number | ShareBreakdown;
  system?: "islamic" | "hindu";
  heirs: FamilyHeir[];
}

export interface KhatianData {
  id?: string;
  khatian_no: string;
  mouza: string;
  dag_no: string;
  district?: string;
  upazila?: string;
  khatian_type?: "CS" | "SA" | "RS" | "BS" | "City Survey";
  total_area_decimal: number;
  owners: KhatianOwner[];
  raw_text?: string;
  confidence_score?: number;
}

export interface AnaGondaConversionRequest {
  ana: number;
  gonda: number;
  kara: number;
  kranti: number;
  til?: number;
  total_land_decimal?: number;
}

export interface AnaGondaConversionResponse {
  ana: number;
  gonda: number;
  kara: number;
  kranti: number;
  til?: number;
  decimal_share: number; // e.g. 0.275 (out of 1.0)
  percentage: number; // e.g. 27.5
  total_til: number;
  actual_area_decimal?: number;
  actual_area_sqft?: number;
  formatted_text_bn?: string;
}

export interface DecimalToAnaRequest {
  decimal_share: number;
  total_land_decimal?: number;
}

export interface DecimalToAnaResponse {
  decimal_share: number;
  percentage: number;
  share_breakdown: ShareBreakdown;
  formatted_text_bn: string;
  total_til: number;
  actual_area_decimal?: number;
  actual_area_sqft?: number;
}

export interface HeirDistribution {
  relation: string;
  relation_bn: string;
  count: number;
  per_heir_share_decimal: number;
  total_share_decimal: number;
  per_heir_percentage: number;
  total_percentage: number;
  per_heir_area_decimal?: number;
  total_area_decimal?: number;
  quranic_fraction_bn?: string;
  rule_applied?: string;
}

export interface InheritanceAuditRequest {
  deceased_owner: string;
  deceased_share_decimal?: number;
  deceased_share_ana_gonda?: ShareBreakdown;
  system: "islamic" | "hindu";
  total_land_decimal?: number;
  heirs: FamilyHeir[];
  claimed_seller_share?: number;
}

export interface InheritanceAuditResponse {
  deceased_owner: string;
  system: "islamic" | "hindu";
  total_distributed_decimal: number;
  total_percentage: number;
  heir_distributions: HeirDistribution[];
  excluded_heirs: string[];
  fraud_risk: "LOW" | "MEDIUM" | "HIGH";
  risk_level: "GREEN" | "YELLOW" | "RED";
  warnings: string[];
  notes_bn: string[];
}

export interface AuditCheck {
  id: string;
  title_bn: string;
  category: "MATH" | "INHERITANCE" | "CHAIN_OF_TITLE" | "GOV_RESTRICTION";
  status: "PASS" | "WARN" | "FAIL";
  message_bn: string;
  details_bn?: string;
}

export interface ScorecardReport {
  id: string;
  khatian_no: string;
  mouza: string;
  dag_no: string;
  khatian_type?: string;
  total_area_decimal: number;
  overall_risk: "GREEN" | "YELLOW" | "RED";
  risk_score: number; // 0 - 100
  checks: AuditCheck[];
  owners: KhatianOwner[];
  inheritance_audit?: InheritanceAuditResponse;
  recommendations_bn: string[];
  generated_at: string;
  verifier: string;
}
