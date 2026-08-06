// =====================================================
// 料金データ定義（料金比較.xlsx 最新版より）
// ※ キャリア名・プラン名・料金はExcelデータと完全一致
// =====================================================

// =====================================================
// スマホ データプラン（容量）
// キャリア：ドコモ / au / SoftBank / 楽天モバイル / ahamo / UQ / Ymobile / NUROmobile
// =====================================================
const SMARTPHONE_PLANS = [
  // ─── ドコモ ───
  { carrier: "ドコモ", plan: "MAX1G",       basePrice: 5698, condition: "ドコモ光", discount: 1210, discountedPrice: 4488 },
  { carrier: "ドコモ", plan: "MAX3G",       basePrice: 6798, condition: "ドコモ光", discount: 1210, discountedPrice: 5588 },
  { carrier: "ドコモ", plan: "MAX無制限",    basePrice: 8448, condition: "ドコモ光", discount: 1210, discountedPrice: 7238 },
  { carrier: "ドコモ", plan: "eximo1G",     basePrice: 4565, condition: "ドコモ光", discount: 1100, discountedPrice: 3465 },
  { carrier: "ドコモ", plan: "eximo3G",     basePrice: 5665, condition: "ドコモ光", discount: 1100, discountedPrice: 4565 },
  { carrier: "ドコモ", plan: "eximo無制限",  basePrice: 7315, condition: "ドコモ光", discount: 1100, discountedPrice: 6215 },
  { carrier: "ドコモ", plan: "ギガホ3G",    basePrice: 5665, condition: "ドコモ光", discount: 1100, discountedPrice: 4565 },
  { carrier: "ドコモ", plan: "ギガホ無制限", basePrice: 7315, condition: "ドコモ光", discount: 1100, discountedPrice: 6215 },
  { carrier: "ドコモ", plan: "ライト１G",    basePrice: 3465, condition: "ドコモ光", discount: 550,  discountedPrice: 2915 },
  { carrier: "ドコモ", plan: "ライト３G",    basePrice: 4565, condition: "ドコモ光", discount: 550,  discountedPrice: 4015 },
  { carrier: "ドコモ", plan: "ライト５G",    basePrice: 5665, condition: "ドコモ光", discount: 1100, discountedPrice: 4565 },
  { carrier: "ドコモ", plan: "ライト７G",    basePrice: 6765, condition: "ドコモ光", discount: 1100, discountedPrice: 5665 },
  { carrier: "ドコモ", plan: "irumo0.5G",   basePrice: 550,  condition: "ドコモ光", discount: 0,    discountedPrice: 550  },
  { carrier: "ドコモ", plan: "irumo3G",     basePrice: 2167, condition: "ドコモ光", discount: 1100, discountedPrice: 1067 },
  { carrier: "ドコモ", plan: "irumo6G",     basePrice: 2827, condition: "ドコモ光", discount: 1100, discountedPrice: 1727 },
  { carrier: "ドコモ", plan: "irumo9G",     basePrice: 3377, condition: "ドコモ光", discount: 1100, discountedPrice: 2277 },
  { carrier: "ドコモ", plan: "mini4GB",     basePrice: 2750, condition: "ドコモ光", discount: 1210, discountedPrice: 1540 },
  { carrier: "ドコモ", plan: "mini10G",     basePrice: 3850, condition: "ドコモ光", discount: 1210, discountedPrice: 2640 },
  // ─── ahamo（セット割なし） ───
  { carrier: "ahamo",       plan: "30G",    basePrice: 2950, condition: null, discount: 0, discountedPrice: 2950 },
  { carrier: "ahamo",       plan: "110G",   basePrice: 4950, condition: null, discount: 0, discountedPrice: 4950 },
  // ─── au ───
  { carrier: "au",          plan: "1G",     basePrice: 4708, condition: "auひかり", discount: 1100, discountedPrice: 3608 },
  { carrier: "au",          plan: "2G",     basePrice: 6358, condition: "auひかり", discount: 1100, discountedPrice: 5258 },
  { carrier: "au",          plan: "5G",     basePrice: 8008, condition: "auひかり", discount: 1100, discountedPrice: 6908 },
  { carrier: "au",          plan: "無制限",  basePrice: 7458, condition: "auひかり", discount: 1100, discountedPrice: 6358 },
  // ─── UQ ───
  { carrier: "UQ",          plan: "５G",    basePrice: 4048, condition: "auひかり", discount: 2200, discountedPrice: 1848 },
  { carrier: "UQ",          plan: "30G",    basePrice: 4048, condition: "auひかり", discount: 1100, discountedPrice: 2948 },
  // ─── SoftBank ───
  { carrier: "SoftBank",    plan: "1G",     basePrice: 3278, condition: "SoftBank光", discount: 1100, discountedPrice: 2178 },
  { carrier: "SoftBank",    plan: "2G",     basePrice: 4378, condition: "SoftBank光", discount: 1100, discountedPrice: 3278 },
  { carrier: "SoftBank",    plan: "3G",     basePrice: 4980, condition: "SoftBank光", discount: 1100, discountedPrice: 3880 },
  { carrier: "SoftBank",    plan: "無制限",  basePrice: 7425, condition: "SoftBank光", discount: 1100, discountedPrice: 6325 },
  // ─── Ymobile ───
  { carrier: "Ymobile",     plan: "5GB",    basePrice: 3058, condition: "SoftBank光", discount: 1650, discountedPrice: 1408 },
  { carrier: "Ymobile",     plan: "30G",    basePrice: 4158, condition: "SoftBank光", discount: 1650, discountedPrice: 2508 },
  { carrier: "Ymobile",     plan: "35G",    basePrice: 5258, condition: "SoftBank光", discount: 1650, discountedPrice: 3608 },
  // ─── 楽天モバイル（セット割なし） ───
  { carrier: "楽天モバイル", plan: "3G",    basePrice: 980,  condition: null, discount: 0, discountedPrice: 980  },
  { carrier: "楽天モバイル", plan: "20G",   basePrice: 1980, condition: null, discount: 0, discountedPrice: 1980 },
  { carrier: "楽天モバイル", plan: "無制限", basePrice: 2980, condition: null, discount: 0, discountedPrice: 2980 },
  // ─── NUROmobile（セット割なし） ───
  { carrier: "NUROmobile",  plan: "5GB",    basePrice: 990,  condition: null, discount: 0, discountedPrice: 990  },
  { carrier: "NUROmobile",  plan: "35G",    basePrice: 2699, condition: null, discount: 0, discountedPrice: 2699 },
];

// =====================================================
// スマホ 通話オプション（キャリアごと）
// =====================================================
const CALL_OPTIONS = [
  // ─── ドコモ ───
  { carrier: "ドコモ",      optionName: "通話なし（データのみ）", price: 0    },
  { carrier: "ドコモ",      optionName: "5分カケホ",             price: 880  },
  { carrier: "ドコモ",      optionName: "カケホ（かけ放題）",    price: 1980 },
  // ─── ahamo ───
  { carrier: "ahamo",       optionName: "5分以内かけ放題込み",   price: 0    },
  { carrier: "ahamo",       optionName: "かけ放題オプション",    price: 1100 },
  // ─── au ───
  { carrier: "au",          optionName: "通話なし（データのみ）", price: 0    },
  { carrier: "au",          optionName: "5分かけ放題",           price: 550  },
  { carrier: "au",          optionName: "かけ放題",              price: 1760 },
  // ─── UQ ───
  { carrier: "UQ",          optionName: "通話なし（データのみ）", price: 0    },
  { carrier: "UQ",          optionName: "10分かけ放題",          price: 770  },
  { carrier: "UQ",          optionName: "かけ放題",              price: 1870 },
  // ─── SoftBank ───
  { carrier: "SoftBank",    optionName: "通話なし（データのみ）", price: 0    },
  { carrier: "SoftBank",    optionName: "5分かけ放題",           price: 550  },
  { carrier: "SoftBank",    optionName: "かけ放題",              price: 1980 },
  // ─── Ymobile ───
  { carrier: "Ymobile",     optionName: "通話なし（データのみ）", price: 0    },
  { carrier: "Ymobile",     optionName: "10分カケホ",            price: 880  },
  { carrier: "Ymobile",     optionName: "カケホ（かけ放題）",    price: 1980 },
  // ─── 楽天モバイル ───
  { carrier: "楽天モバイル", optionName: "Rakuten Link（無料）", price: 0    },
  { carrier: "楽天モバイル", optionName: "通常通話（従量制）",   price: 0    },
  // ─── NUROmobile ───
  { carrier: "NUROmobile",  optionName: "通話なし（データのみ）", price: 0   },
  { carrier: "NUROmobile",  optionName: "5分かけ放題",           price: 490  },
];

// =====================================================
// CATV スマホプラン（ケーブルスマホ）
// =====================================================
const CATV_SMARTPHONE_PLANS = [
  { plan: "1G",  basePrice: 1320, discountedPrice: 1320 },
  { plan: "3G",  basePrice: 1650, discountedPrice: 1650 },
  { plan: "5G",  basePrice: 1980, discountedPrice: 1980 },
];

// =====================================================
// CATV スマホ 通話オプション（Excelより）
// =====================================================
const CATV_CALL_OPTIONS = [
  { optionName: "通話なし",       price: 0    },
  { optionName: "10分カケホ",    price: 759  },
  { optionName: "カケホ（かけ放題）", price: 1650 },
];

// =====================================================
// 光回線プラン
// =====================================================
const FIBER_PLANS = [
  // ─── ドコモ光 ───
  { carrier: "ドコモ光",   plan: "１G",   price: 5720 },
  { carrier: "ドコモ光",   plan: "10G",  price: 6380 },
  { carrier: "ドコモ光",   plan: "HOME", price: 5280 },
  // ─── auひかり ───
  { carrier: "auひかり",  plan: "１G",   price: 5610 },
  { carrier: "auひかり",  plan: "10G",  price: 6160 },
  // ─── SoftBank光 ───
  { carrier: "SoftBank光", plan: "１G",   price: 5720 },
  { carrier: "SoftBank光", plan: "10G",  price: 6930 },
  // ─── nuro ───
  { carrier: "nuro",      plan: "１G",   price: 6050 },
  { carrier: "nuro",      plan: "10G",  price: 5500 },
  // ─── nuro３年割 ───
  { carrier: "nuro３年割", plan: "１G",  price: 3980 },
  { carrier: "nuro３年割", plan: "１０G", price: 3980 },
];

// =====================================================
// 光電話オプション（光回線キャリアごと）
// =====================================================
const PHONE_OPTIONS = [
  // ─── ドコモ光 ───
  { carrier: "ドコモ光",   optionName: "電話なし",  price: 0    },
  { carrier: "ドコモ光",   optionName: "光電話",    price: 770  },
  { carrier: "ドコモ光",   optionName: "光電話A",   price: 1650 },
  // ─── auひかり ───
  { carrier: "auひかり",  optionName: "電話なし",  price: 0   },
  { carrier: "auひかり",  optionName: "光電話",    price: 770 },
  // ─── SoftBank光 ───
  { carrier: "SoftBank光", optionName: "電話なし",  price: 0   },
  { carrier: "SoftBank光", optionName: "光電話",    price: 550 },
  // ─── nuro ───
  { carrier: "nuro",      optionName: "電話なし",  price: 0 },
  // ─── nuro３年割 ───
  { carrier: "nuro３年割", optionName: "電話なし", price: 0 },
];

// =====================================================
// CATV 光回線・電話プラン
// 光電話：基本1,419円 → セット割330円引き → 1,089円
// =====================================================
const CATV_FIBER_PLAN = {
  carrier: "ひかりネット(CATV)", plan: "10G", price: 4389
};

const CATV_PHONE_OPTION = {
  optionName: "光でんわ",
  basePrice:  1419,
  discount:   330,
  price:      1089  // セット割適用後
};

// =====================================================
// セット割 適用条件マップ
// スマホの condition フィールドと光回線キャリア名を照合
// =====================================================
const SET_DISCOUNT_MAP = {
  "ドコモ光":   "ドコモ光",
  "auひかり":  "auひかり",
  "SoftBank光": "SoftBank光",
};

// =====================================================
// UI用キャリア一覧
// =====================================================
const CARRIERS       = [...new Set(SMARTPHONE_PLANS.map(p => p.carrier))];
const FIBER_CARRIERS = [...new Set(FIBER_PLANS.map(p => p.carrier))];

// =====================================================
// ヘルパー関数
// =====================================================

/** 指定キャリアのスマホデータプラン一覧 */
function getPlansByCarrier(carrier) {
  return SMARTPHONE_PLANS.filter(p => p.carrier === carrier);
}

/** 指定キャリア・プランのスマホ料金オブジェクトを取得 */
function getSmartphonePlan(carrier, plan) {
  return SMARTPHONE_PLANS.find(p => p.carrier === carrier && p.plan === plan) || null;
}

/** 指定キャリアの通話オプション一覧 */
function getCallOptionsByCarrier(carrier) {
  return CALL_OPTIONS.filter(o => o.carrier === carrier);
}

/** 指定光回線キャリアのプラン一覧 */
function getFiberPlansByCarrier(carrier) {
  return FIBER_PLANS.filter(p => p.carrier === carrier);
}

/** 指定光回線キャリアの電話オプション一覧 */
function getPhoneOptionsByCarrier(carrier) {
  return PHONE_OPTIONS.filter(o => o.carrier === carrier);
}

/**
 * セット割適用判定
 * スマホの condition と光回線キャリア名が一致するか確認
 */
function isSetDiscountApplicable(smartphoneCondition, fiberCarrier) {
  if (!smartphoneCondition || !fiberCarrier) return false;
  return smartphoneCondition === fiberCarrier;
}
