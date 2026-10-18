import axios from 'axios';
import {
  AnaGondaConversionRequest,
  AnaGondaConversionResponse,
  DecimalToAnaRequest,
  DecimalToAnaResponse,
  InheritanceAuditRequest,
  InheritanceAuditResponse,
  KhatianData,
  ScorecardReport,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const api = {
  // OCR
  extractKhatian: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ success: boolean; data: KhatianData }>('/ocr/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Converter
  convertAnaGonda: async (data: AnaGondaConversionRequest) =>
    apiClient.post<AnaGondaConversionResponse>('/converter/ana-gonda', data),

  convertDecimalToAna: async (data: DecimalToAnaRequest) =>
    apiClient.post<DecimalToAnaResponse>('/converter/decimal-to-ana', data),

  validateShares: async (data: { shares: Array<{ ana: number; gonda: number; kara: number; kranti: number }> }) =>
    apiClient.post<{ is_valid: boolean; total_share_decimal: number; difference_from_full: number }>('/converter/validate-shares', data),

  parseBanglaText: async (data: { text: string }) =>
    apiClient.post<{ parsed: Record<string, number>; formatted_bn: string }>('/converter/parse-bangla', data),

  // Inheritance
  calculateInheritance: async (data: InheritanceAuditRequest) =>
    apiClient.post<InheritanceAuditResponse>('/inheritance/calculate', data),

  auditInheritance: async (data: InheritanceAuditRequest) =>
    apiClient.post<InheritanceAuditResponse>('/inheritance/audit', data),

  // Scorecard
  generateScorecard: async (data: { khatian_data: KhatianData; family_tree?: any }) =>
    apiClient.post<ScorecardReport>('/scorecard/generate', data),

  getScorecard: async (id: string) =>
    apiClient.get<ScorecardReport>(`/scorecard/${id}`),

  // Khatians
  listKhatians: async () => apiClient.get<KhatianData[]>('/khatians'),
  getKhatian: async (id: string) => apiClient.get<KhatianData>(`/khatians/${id}`),
  createKhatian: async (data: KhatianData) => apiClient.post<KhatianData>('/khatians', data),
};
