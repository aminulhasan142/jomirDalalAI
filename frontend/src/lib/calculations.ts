import {
  AnaGondaConversionResponse,
  DecimalToAnaResponse,
  FamilyHeir,
  HeirDistribution,
  InheritanceAuditResponse,
  ShareBreakdown,
} from './types';

// Constants according to Bangladesh land administration standards
// 16 Ana = 1 Full Share
// 1 Ana = 20 Gonda -> 16 * 20 = 320 Gonda
// 1 Gonda = 4 Kara -> 320 * 4 = 1280 Kara
// 1 Kara = 3 Kranti -> 1280 * 3 = 3840 Kranti
// 1 Kranti = 15 Til -> 3840 * 15 = 57600 Til
export const TOTAL_TIL_IN_16_ANA = 57600;
export const TIL_PER_ANA = 3600;
export const TIL_PER_GONDA = 180;
export const TIL_PER_KARA = 45;
export const TIL_PER_KRANTI = 15;
export const SQFT_PER_DECIMAL = 435.6;

export function anaGondaToTil(breakdown: ShareBreakdown): number {
  const ana = Number(breakdown.ana) || 0;
  const gonda = Number(breakdown.gonda) || 0;
  const kara = Number(breakdown.kara) || 0;
  const kranti = Number(breakdown.kranti) || 0;
  const til = Number(breakdown.til) || 0;

  return (
    ana * TIL_PER_ANA +
    gonda * TIL_PER_GONDA +
    kara * TIL_PER_KARA +
    kranti * TIL_PER_KRANTI +
    til
  );
}

export function tilToDecimal(totalTil: number): number {
  return totalTil / TOTAL_TIL_IN_16_ANA;
}

export function convertAnaGondaToDecimal(
  breakdown: ShareBreakdown,
  totalLandDecimal: number = 0
): AnaGondaConversionResponse {
  const totalTil = anaGondaToTil(breakdown);
  const decimalShare = tilToDecimal(totalTil);
  const percentage = decimalShare * 100;
  const actualAreaDecimal = totalLandDecimal > 0 ? decimalShare * totalLandDecimal : undefined;
  const actualAreaSqft = actualAreaDecimal ? actualAreaDecimal * SQFT_PER_DECIMAL : undefined;

  const parts: string[] = [];
  if (breakdown.ana > 0) parts.push(`${breakdown.ana} আনা`);
  if (breakdown.gonda > 0) parts.push(`${breakdown.gonda} গণ্ডা`);
  if (breakdown.kara > 0) parts.push(`${breakdown.kara} কড়া`);
  if (breakdown.kranti > 0) parts.push(`${breakdown.kranti} ক্রান্তি`);
  if (breakdown.til && breakdown.til > 0) parts.push(`${breakdown.til} তিল`);

  return {
    ana: breakdown.ana,
    gonda: breakdown.gonda,
    kara: breakdown.kara,
    kranti: breakdown.kranti,
    til: breakdown.til || 0,
    decimal_share: Number(decimalShare.toFixed(6)),
    percentage: Number(percentage.toFixed(4)),
    total_til: Math.round(totalTil),
    actual_area_decimal: actualAreaDecimal ? Number(actualAreaDecimal.toFixed(4)) : undefined,
    actual_area_sqft: actualAreaSqft ? Number(actualAreaSqft.toFixed(2)) : undefined,
    formatted_text_bn: parts.length > 0 ? parts.join(" ") : "০ আনা",
  };
}

export function convertDecimalToAnaGonda(
  decimalShare: number,
  totalLandDecimal: number = 0
): DecimalToAnaResponse {
  const boundedDecimal = Math.max(0, Math.min(1.0, decimalShare));
  const rawTotalTil = Math.round(boundedDecimal * TOTAL_TIL_IN_16_ANA);

  let remaining = rawTotalTil;
  const ana = Math.floor(remaining / TIL_PER_ANA);
  remaining %= TIL_PER_ANA;

  const gonda = Math.floor(remaining / TIL_PER_GONDA);
  remaining %= TIL_PER_GONDA;

  const kara = Math.floor(remaining / TIL_PER_KARA);
  remaining %= TIL_PER_KARA;

  const kranti = Math.floor(remaining / TIL_PER_KRANTI);
  remaining %= TIL_PER_KRANTI;

  const til = remaining;

  const shareBreakdown: ShareBreakdown = { ana, gonda, kara, kranti, til };
  const parts: string[] = [];
  if (ana > 0) parts.push(`${ana} আনা`);
  if (gonda > 0) parts.push(`${gonda} গণ্ডা`);
  if (kara > 0) parts.push(`${kara} কড়া`);
  if (kranti > 0) parts.push(`${kranti} ক্রান্তি`);
  if (til > 0) parts.push(`${til} তিল`);

  const actualAreaDecimal = totalLandDecimal > 0 ? boundedDecimal * totalLandDecimal : undefined;
  const actualAreaSqft = actualAreaDecimal ? actualAreaDecimal * SQFT_PER_DECIMAL : undefined;

  return {
    decimal_share: Number(boundedDecimal.toFixed(6)),
    percentage: Number((boundedDecimal * 100).toFixed(4)),
    share_breakdown: shareBreakdown,
    formatted_text_bn: parts.length > 0 ? parts.join(" ") : "০ আনা",
    total_til: rawTotalTil,
    actual_area_decimal: actualAreaDecimal ? Number(actualAreaDecimal.toFixed(4)) : undefined,
    actual_area_sqft: actualAreaSqft ? Number(actualAreaSqft.toFixed(2)) : undefined,
  };
}

// Farai'd Islamic Inheritance Calculation Engine
export function calculateIslamicInheritance(
  heirs: FamilyHeir[],
  totalShare: number = 1.0,
  totalLandDecimal: number = 0
): InheritanceAuditResponse {
  let hasSon = false;
  let sonCount = 0;
  let daughterCount = 0;
  let wifeCount = 0;
  let husbandCount = 0;
  let motherCount = 0;
  let fatherCount = 0;

  for (const h of heirs) {
    const rel = h.relation.trim();
    if (rel === 'পুত্র' || rel.toLowerCase() === 'son') {
      sonCount += h.count;
      if (h.count > 0) hasSon = true;
    } else if (rel === 'কন্যা' || rel.toLowerCase() === 'daughter') {
      daughterCount += h.count;
    } else if (rel === 'স্ত্রী' || rel.toLowerCase() === 'wife') {
      wifeCount += h.count;
    } else if (rel === 'স্বামী' || rel.toLowerCase() === 'husband') {
      husbandCount += h.count;
    } else if (rel === 'মাতা' || rel.toLowerCase() === 'mother') {
      motherCount += h.count;
    } else if (rel === 'পিতা' || rel.toLowerCase() === 'father') {
      fatherCount += h.count;
    }
  }

  const hasChildren = sonCount > 0 || daughterCount > 0;
  const distributions: HeirDistribution[] = [];
  let remainingShare = totalShare;

  // 1. Spouses
  if (wifeCount > 0) {
    // 1/8 if children, 1/4 if no children
    const wifeFraction = hasChildren ? 1 / 8 : 1 / 4;
    const totalWivesShare = totalShare * wifeFraction;
    const perWifeShare = totalWivesShare / wifeCount;
    remainingShare -= totalWivesShare;

    distributions.push({
      relation: 'Wife',
      relation_bn: 'স্ত্রী',
      count: wifeCount,
      per_heir_share_decimal: Number(perWifeShare.toFixed(6)),
      total_share_decimal: Number(totalWivesShare.toFixed(6)),
      per_heir_percentage: Number(((perWifeShare / totalShare) * 100).toFixed(4)),
      total_percentage: Number(((totalWivesShare / totalShare) * 100).toFixed(4)),
      per_heir_area_decimal: totalLandDecimal ? Number((perWifeShare * totalLandDecimal).toFixed(4)) : undefined,
      total_area_decimal: totalLandDecimal ? Number((totalWivesShare * totalLandDecimal).toFixed(4)) : undefined,
      quranic_fraction_bn: hasChildren ? '১/৮ (সন্তান সাপেক্ষে)' : '১/৪ (সন্তানহীন)',
      rule_applied: 'কুরআনিক নির্ধারিত অংশ (Zawil-Furood)',
    });
  } else if (husbandCount > 0) {
    // 1/4 if children, 1/2 if no children
    const husbandFraction = hasChildren ? 1 / 4 : 1 / 2;
    const totalHusbandShare = totalShare * husbandFraction;
    remainingShare -= totalHusbandShare;

    distributions.push({
      relation: 'Husband',
      relation_bn: 'স্বামী',
      count: 1,
      per_heir_share_decimal: Number(totalHusbandShare.toFixed(6)),
      total_share_decimal: Number(totalHusbandShare.toFixed(6)),
      per_heir_percentage: Number(((totalHusbandShare / totalShare) * 100).toFixed(4)),
      total_percentage: Number(((totalHusbandShare / totalShare) * 100).toFixed(4)),
      per_heir_area_decimal: totalLandDecimal ? Number((totalHusbandShare * totalLandDecimal).toFixed(4)) : undefined,
      total_area_decimal: totalLandDecimal ? Number((totalHusbandShare * totalLandDecimal).toFixed(4)) : undefined,
      quranic_fraction_bn: hasChildren ? '১/৪ (সন্তান সাপেক্ষে)' : '১/২ (সন্তানহীন)',
      rule_applied: 'কুরআনিক নির্ধারিত অংশ (Zawil-Furood)',
    });
  }

  // 2. Parents
  if (motherCount > 0) {
    const motherFraction = hasChildren ? 1 / 6 : 1 / 3;
    const totalMotherShare = totalShare * motherFraction;
    remainingShare -= totalMotherShare;

    distributions.push({
      relation: 'Mother',
      relation_bn: 'মাতা',
      count: 1,
      per_heir_share_decimal: Number(totalMotherShare.toFixed(6)),
      total_share_decimal: Number(totalMotherShare.toFixed(6)),
      per_heir_percentage: Number(((totalMotherShare / totalShare) * 100).toFixed(4)),
      total_percentage: Number(((totalMotherShare / totalShare) * 100).toFixed(4)),
      per_heir_area_decimal: totalLandDecimal ? Number((totalMotherShare * totalLandDecimal).toFixed(4)) : undefined,
      total_area_decimal: totalLandDecimal ? Number((totalMotherShare * totalLandDecimal).toFixed(4)) : undefined,
      quranic_fraction_bn: hasChildren ? '১/৬ (সন্তান সাপেক্ষে)' : '১/৩ (সন্তানহীন)',
      rule_applied: 'কুরআনিক নির্ধারিত অংশ (Zawil-Furood)',
    });
  }

  if (fatherCount > 0) {
    const fatherFraction = hasChildren ? 1 / 6 : 0;
    let totalFatherShare = totalShare * fatherFraction;
    if (!hasSon && !hasChildren) {
      // Father takes remainder as Asaba
      totalFatherShare = remainingShare;
      remainingShare = 0;
    } else {
      remainingShare -= totalFatherShare;
    }

    distributions.push({
      relation: 'Father',
      relation_bn: 'পিতা',
      count: 1,
      per_heir_share_decimal: Number(totalFatherShare.toFixed(6)),
      total_share_decimal: Number(totalFatherShare.toFixed(6)),
      per_heir_percentage: Number(((totalFatherShare / totalShare) * 100).toFixed(4)),
      total_percentage: Number(((totalFatherShare / totalShare) * 100).toFixed(4)),
      per_heir_area_decimal: totalLandDecimal ? Number((totalFatherShare * totalLandDecimal).toFixed(4)) : undefined,
      total_area_decimal: totalLandDecimal ? Number((totalFatherShare * totalLandDecimal).toFixed(4)) : undefined,
      quranic_fraction_bn: hasChildren ? '১/৬' : 'অবশিষ্টাংশ (আসাবা)',
      rule_applied: hasChildren ? 'কুরআনিক নির্ধারিত অংশ' : 'আসাবা হিসেবে অবশিষ্ট অংশ',
    });
  }

  // 3. Children (Residuary Asaba 2:1 rule)
  if (sonCount > 0 || daughterCount > 0) {
    if (sonCount > 0) {
      // 2 units per son, 1 unit per daughter
      const totalUnits = sonCount * 2 + daughterCount;
      const unitValue = remainingShare / totalUnits;

      const perSonShare = unitValue * 2;
      const totalSonShare = perSonShare * sonCount;

      distributions.push({
        relation: 'Son',
        relation_bn: 'পুত্র',
        count: sonCount,
        per_heir_share_decimal: Number(perSonShare.toFixed(6)),
        total_share_decimal: Number(totalSonShare.toFixed(6)),
        per_heir_percentage: Number(((perSonShare / totalShare) * 100).toFixed(4)),
        total_percentage: Number(((totalSonShare / totalShare) * 100).toFixed(4)),
        per_heir_area_decimal: totalLandDecimal ? Number((perSonShare * totalLandDecimal).toFixed(4)) : undefined,
        total_area_decimal: totalLandDecimal ? Number((totalSonShare * totalLandDecimal).toFixed(4)) : undefined,
        quranic_fraction_bn: 'অবশিষ্টাংশ (২ অংশ প্রতি পুত্র)',
        rule_applied: 'আসাবা বিল গাইর (২:১ অনুপাত)',
      });

      if (daughterCount > 0) {
        const perDaughterShare = unitValue;
        const totalDaughterShare = perDaughterShare * daughterCount;

        distributions.push({
          relation: 'Daughter',
          relation_bn: 'কন্যা',
          count: daughterCount,
          per_heir_share_decimal: Number(perDaughterShare.toFixed(6)),
          total_share_decimal: Number(totalDaughterShare.toFixed(6)),
          per_heir_percentage: Number(((perDaughterShare / totalShare) * 100).toFixed(4)),
          total_percentage: Number(((totalDaughterShare / totalShare) * 100).toFixed(4)),
          per_heir_area_decimal: totalLandDecimal ? Number((perDaughterShare * totalLandDecimal).toFixed(4)) : undefined,
          total_area_decimal: totalLandDecimal ? Number((totalDaughterShare * totalLandDecimal).toFixed(4)) : undefined,
          quranic_fraction_bn: 'অবশিষ্টাংশ (১ অংশ প্রতি কন্যা)',
          rule_applied: 'আসাবা বিল গাইর (২:১ অনুপাত)',
        });
      }
    } else {
      // Daughters only (Zawil Furood)
      const daughterFraction = daughterCount === 1 ? 1 / 2 : 2 / 3;
      const totalDaughterShare = totalShare * daughterFraction;
      const perDaughterShare = totalDaughterShare / daughterCount;

      distributions.push({
        relation: 'Daughter',
        relation_bn: 'কন্যা',
        count: daughterCount,
        per_heir_share_decimal: Number(perDaughterShare.toFixed(6)),
        total_share_decimal: Number(totalDaughterShare.toFixed(6)),
        per_heir_percentage: Number(((perDaughterShare / totalShare) * 100).toFixed(4)),
        total_percentage: Number(((totalDaughterShare / totalShare) * 100).toFixed(4)),
        per_heir_area_decimal: totalLandDecimal ? Number((perDaughterShare * totalLandDecimal).toFixed(4)) : undefined,
        total_area_decimal: totalLandDecimal ? Number((totalDaughterShare * totalLandDecimal).toFixed(4)) : undefined,
        quranic_fraction_bn: daughterCount === 1 ? '১/২ (একক কন্যা)' : '২/৩ (একাধিক কন্যা)',
        rule_applied: 'কুরআনিক নির্ধারিত অংশ',
      });
    }
  }

  const totalDistributed = distributions.reduce((acc, curr) => acc + curr.total_share_decimal, 0);
  const warnings: string[] = [];
  const notes_bn: string[] = [
    'মুসলিম উত্তরাধিকার আইন (ফারায়েজ) অনুযায়ী শরিকদের হিসেব প্রস্তুতকৃত।',
    'প্রত্যেক সহ-শরিকের বৈধ নামজারি (মিউটেশন) ব্যতিরেকে জমি কেনাবেচা ঝুঁকিপূর্ণ।',
  ];

  if (daughterCount > 0 && sonCount > 0) {
    notes_bn.push('পুত্র ও কন্যার মধ্যে কুরআনুল কারীমের বিধানমতে ২:১ অনুপাতে অবশিষ্টাংশ বণ্টিত হয়েছে।');
  }

  return {
    deceased_owner: 'মৃত ব্যক্তি',
    system: 'islamic',
    total_distributed_decimal: Number(totalDistributed.toFixed(6)),
    total_percentage: Number(((totalDistributed / totalShare) * 100).toFixed(2)),
    heir_distributions: distributions,
    excluded_heirs: [],
    fraud_risk: 'LOW',
    risk_level: 'GREEN',
    warnings,
    notes_bn,
  };
}
