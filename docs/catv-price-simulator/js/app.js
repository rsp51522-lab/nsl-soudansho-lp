// =====================================================
// 固定費削減シミュレーター メインロジック（通話・電話対応版）
// =====================================================

let smartphoneRowCount = 0;
let compareChart = null;
let catvSmartphoneOverrides = {};

// =====================================================
// 初期化
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
  initFiberCarrierSelect();
  addSmartphoneRow(); // 最初の1台を自動追加
});

function initFiberCarrierSelect() {
  const sel = document.getElementById('fiber-carrier');
  FIBER_CARRIERS.forEach(carrier => {
    const opt = document.createElement('option');
    opt.value = carrier;
    opt.textContent = carrier;
    sel.appendChild(opt);
  });
}

// =====================================================
// 光回線 イベント
// =====================================================

function onFiberCarrierChange() {
  const carrier = document.getElementById('fiber-carrier').value;
  const planSel = document.getElementById('fiber-plan');
  const priceEl = document.getElementById('fiber-price');

  planSel.innerHTML = '<option value="">-- プランを選択 --</option>';
  priceEl.textContent = '--';
  planSel.disabled = !carrier;

  if (carrier) {
    getFiberPlansByCarrier(carrier).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.plan;
      opt.textContent = `${p.plan}（${p.price.toLocaleString()}円/月）`;
      opt.dataset.price = p.price;
      planSel.appendChild(opt);
    });
  }

  // 光電話オプションを更新
  updatePhoneOptionRow(carrier);
  // スマホのセット割バッジを全台更新
  updateAllSetDiscountBadges();
}

function onFiberPlanChange() {
  const planSel = document.getElementById('fiber-plan');
  const selected = planSel.options[planSel.selectedIndex];
  const priceEl = document.getElementById('fiber-price');
  priceEl.textContent = selected && selected.dataset.price
    ? parseInt(selected.dataset.price).toLocaleString()
    : '--';
  updateAllSetDiscountBadges();
}

// =====================================================
// 光電話オプション
// =====================================================

function updatePhoneOptionRow(carrier) {
  const row = document.getElementById('phone-option-row');
  const phoneSel = document.getElementById('phone-option');
  const priceEl = document.getElementById('phone-price');

  const options = getPhoneOptionsByCarrier(carrier);

  if (options.length === 0) {
    row.style.display = 'none';
    phoneSel.innerHTML = '';
    priceEl.textContent = '--';
    return;
  }

  row.style.display = 'block';
  phoneSel.innerHTML = '<option value="">-- 選択してください --</option>';
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.optionName;
    opt.textContent = `${o.optionName}（${o.price === 0 ? '0' : o.price.toLocaleString()}円/月）`;
    opt.dataset.price = o.price;
    phoneSel.appendChild(opt);
  });
  priceEl.textContent = '--';
}

function onPhoneOptionChange() {
  const sel = document.getElementById('phone-option');
  const selected = sel.options[sel.selectedIndex];
  const priceEl = document.getElementById('phone-price');
  if (selected && selected.dataset.price !== undefined) {
    priceEl.textContent = parseInt(selected.dataset.price).toLocaleString();
  } else {
    priceEl.textContent = '--';
  }
}

// =====================================================
// スマホ行 追加・削除
// =====================================================

function addSmartphoneRow() {
  if (smartphoneRowCount >= 8) {
    alert('スマートフォンは最大8台まで入力できます。');
    return;
  }
  smartphoneRowCount++;
  const rowId = smartphoneRowCount;
  const container = document.getElementById('smartphone-rows');

  const rowHtml = `
    <div class="sp-row" id="sp-row-${rowId}">
      <div class="sp-row-header">
        <span class="sp-row-number">
          <i class="fas fa-mobile-alt"></i> スマホ ${rowId}台目
        </span>
        ${rowId > 1 ? `<button class="btn-remove" onclick="removeSmartphoneRow(${rowId})"><i class="fas fa-times"></i></button>` : ''}
      </div>

      <!-- データプラン（容量） -->
      <div class="sp-section-label"><i class="fas fa-database"></i> データプラン</div>
      <div class="form-row form-row-3">
        <div class="form-group">
          <label>キャリア</label>
          <select id="sp-carrier-${rowId}" onchange="onSpCarrierChange(${rowId})">
            <option value="">-- 選択 --</option>
            ${CARRIERS.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>プラン（容量）</label>
          <select id="sp-plan-${rowId}" onchange="onSpPlanChange(${rowId})" disabled>
            <option value="">-- キャリアを先に選択 --</option>
          </select>
        </div>
        <div class="form-group price-display">
          <label>月額料金</label>
          <div class="price-box">
            <span class="price-value" id="sp-price-${rowId}">--</span>
            <span class="price-unit">円/月</span>
          </div>
        </div>
      </div>

      <!-- セット割バッジ -->
      <div id="sp-badge-${rowId}" class="set-badge-area"></div>

      <!-- 通話オプション（現在のキャリア） -->
      <div class="sp-section-label mt-8"><i class="fas fa-phone"></i> 通話オプション</div>
      <div class="form-row form-row-2" id="sp-call-row-${rowId}" style="display:none;">
        <div class="form-group">
          <label>通話プラン</label>
          <select id="sp-call-${rowId}" onchange="onSpCallChange(${rowId})" disabled>
            <option value="">-- キャリアを先に選択 --</option>
          </select>
        </div>
        <div class="form-group price-display">
          <label>通話オプション料金</label>
          <div class="price-box">
            <span class="price-value" id="sp-call-price-${rowId}">--</span>
            <span class="price-unit">円/月</span>
          </div>
        </div>
      </div>
      <div class="call-placeholder" id="sp-call-placeholder-${rowId}">
        <i class="fas fa-arrow-up" style="font-size:0.75rem; margin-right:4px;"></i>キャリアを選択すると通話オプションが表示されます
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', rowHtml);

  if (smartphoneRowCount >= 8) {
    const btn = document.getElementById('add-smartphone-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
  }
}

function removeSmartphoneRow(rowId) {
  const row = document.getElementById(`sp-row-${rowId}`);
  if (row) row.remove();
  delete catvSmartphoneOverrides[rowId];
  const btn = document.getElementById('add-smartphone-btn');
  if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
}

// =====================================================
// スマホ イベント
// =====================================================

function onSpCarrierChange(rowId) {
  delete catvSmartphoneOverrides[rowId];

  const carrier = document.getElementById(`sp-carrier-${rowId}`).value;
  const planSel = document.getElementById(`sp-plan-${rowId}`);
  const callSel = document.getElementById(`sp-call-${rowId}`);
  const callRow = document.getElementById(`sp-call-row-${rowId}`);
  const callPlaceholder = document.getElementById(`sp-call-placeholder-${rowId}`);
  const priceEl = document.getElementById(`sp-price-${rowId}`);
  const callPriceEl = document.getElementById(`sp-call-price-${rowId}`);

  // データプランリセット
  planSel.innerHTML = '<option value="">-- プランを選択 --</option>';
  priceEl.textContent = '--';
  planSel.disabled = !carrier;

  // 通話オプションリセット
  callSel.innerHTML = '<option value="">-- 選択してください --</option>';
  callPriceEl.textContent = '--';

  if (carrier) {
    // データプラン選択肢
    getPlansByCarrier(carrier).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.plan;
      opt.textContent = p.plan;
      planSel.appendChild(opt);
    });

    // 通話オプション選択肢
    const callOptions = getCallOptionsByCarrier(carrier);
    if (callOptions.length > 0) {
      callOptions.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.optionName;
        opt.textContent = `${o.optionName}（${o.price.toLocaleString()}円/月）`;
        opt.dataset.price = o.price;
        callSel.appendChild(opt);
      });
      callSel.disabled = false;
      callRow.style.display = 'flex';
      if (callPlaceholder) callPlaceholder.style.display = 'none';
    } else {
      callSel.disabled = true;
      callRow.style.display = 'none';
      if (callPlaceholder) callPlaceholder.style.display = 'none';
    }
  } else {
    callSel.disabled = true;
    callRow.style.display = 'none';
    if (callPlaceholder) { callPlaceholder.style.display = 'block'; }
  }

  updateSetDiscountBadge(rowId);
}

function onSpPlanChange(rowId) {
  delete catvSmartphoneOverrides[rowId];

  const carrier = document.getElementById(`sp-carrier-${rowId}`).value;
  const plan    = document.getElementById(`sp-plan-${rowId}`).value;
  const priceEl = document.getElementById(`sp-price-${rowId}`);
  const fiberCarrier = document.getElementById('fiber-carrier').value;

  if (carrier && plan) {
    const planData = getSmartphonePlan(carrier, plan);
    if (planData) {
      const setOk = isSetDiscountApplicable(planData.condition, fiberCarrier);
      priceEl.textContent = (setOk ? planData.discountedPrice : planData.basePrice).toLocaleString();
    } else {
      priceEl.textContent = '--';
    }
  } else {
    priceEl.textContent = '--';
  }

  updateSetDiscountBadge(rowId);
}

function onSpCallChange(rowId) {
  if (catvSmartphoneOverrides[rowId]) {
    delete catvSmartphoneOverrides[rowId].call;
  }

  const sel = document.getElementById(`sp-call-${rowId}`);
  const selected = sel.options[sel.selectedIndex];
  const priceEl = document.getElementById(`sp-call-price-${rowId}`);
  if (selected && selected.dataset.price !== undefined) {
    priceEl.textContent = parseInt(selected.dataset.price).toLocaleString();
  } else {
    priceEl.textContent = '--';
  }
}

// =====================================================
// セット割バッジ更新
// =====================================================

function updateSetDiscountBadge(rowId) {
  const badgeArea = document.getElementById(`sp-badge-${rowId}`);
  if (!badgeArea) return;

  const carrier = document.getElementById(`sp-carrier-${rowId}`)?.value;
  const plan    = document.getElementById(`sp-plan-${rowId}`)?.value;
  const fiberCarrier = document.getElementById('fiber-carrier').value;
  const priceEl = document.getElementById(`sp-price-${rowId}`);

  badgeArea.innerHTML = '';
  if (!carrier || !plan) return;

  const planData = getSmartphonePlan(carrier, plan);
  if (!planData) return;

  if (planData.condition) {
    const setOk = isSetDiscountApplicable(planData.condition, fiberCarrier);
    if (setOk) {
      badgeArea.innerHTML = `
        <div class="set-badge applied">
          <i class="fas fa-check-circle"></i>
          <strong>${planData.condition}</strong>とのセット割が適用されています
          （<span class="discount-amount">月額 -${planData.discount.toLocaleString()}円</span>）
        </div>`;
      priceEl.textContent = planData.discountedPrice.toLocaleString();
    } else {
      const conditionLabel = fiberCarrier ? `現在：${fiberCarrier}` : '光回線未選択';
      badgeArea.innerHTML = `
        <div class="set-badge not-applied">
          <i class="fas fa-exclamation-triangle"></i>
          <strong>${planData.condition}</strong>とのセット割条件が一致しません（${conditionLabel}）
          ― 基本料金 ${planData.basePrice.toLocaleString()}円/月で計算
        </div>`;
      priceEl.textContent = planData.basePrice.toLocaleString();
    }
  } else {
    badgeArea.innerHTML = `
      <div class="set-badge no-condition">
        <i class="fas fa-info-circle"></i>
        このプランはセット割対象外です（割引なし）
      </div>`;
    priceEl.textContent = planData.discountedPrice.toLocaleString();
  }
}

function updateAllSetDiscountBadges() {
  for (let i = 1; i <= smartphoneRowCount; i++) {
    const el = document.getElementById(`sp-row-${i}`);
    if (el) updateSetDiscountBadge(i);
  }
}

// =====================================================
// メイン計算処理
// =====================================================

function calculate(options = {}) {
  // --- 光回線 ---
  const fiberCarrier = document.getElementById('fiber-carrier').value;
  const fiberPlan    = document.getElementById('fiber-plan').value;
  if (!fiberCarrier || !fiberPlan) {
    showError('光回線のキャリアとプランを選択してください。');
    return;
  }
  const fiberPlanData = FIBER_PLANS.find(p => p.carrier === fiberCarrier && p.plan === fiberPlan);
  if (!fiberPlanData) { showError('光回線プランのデータが見つかりませんでした。'); return; }
  const currentFiberPrice = fiberPlanData.price;

  // --- 光電話オプション ---
  const phoneSel     = document.getElementById('phone-option');
  const phoneSelected = phoneSel.options[phoneSel.selectedIndex];
  const currentPhonePrice = (phoneSelected && phoneSelected.dataset.price !== undefined)
    ? parseInt(phoneSelected.dataset.price) : 0;
  const currentPhoneLabel = (phoneSelected && phoneSelected.value)
    ? `${fiberCarrier} ${phoneSelected.value}` : null;

  // --- スマホ ---
  const smartphones = [];
  let hasSmartphone = false;

  for (let i = 1; i <= smartphoneRowCount; i++) {
    const rowEl = document.getElementById(`sp-row-${i}`);
    if (!rowEl) continue;
    const carrier = document.getElementById(`sp-carrier-${i}`)?.value;
    const plan    = document.getElementById(`sp-plan-${i}`)?.value;
    if (!carrier || !plan) continue;

    hasSmartphone = true;
    const planData = getSmartphonePlan(carrier, plan);
    if (!planData) continue;

    const setOk = isSetDiscountApplicable(planData.condition, fiberCarrier);
    const dataPrice = setOk ? planData.discountedPrice : planData.basePrice;

    // 通話オプション
    const callSel = document.getElementById(`sp-call-${i}`);
    const callSelected = callSel ? callSel.options[callSel.selectedIndex] : null;
    const callPrice = (callSelected && callSelected.dataset.price !== undefined)
      ? parseInt(callSelected.dataset.price) : 0;
    const callLabel = (callSelected && callSelected.value) ? callSelected.value : '通話なし';

    smartphones.push({
      rowId: i,
      carrier,
      plan,
      planData,
      setApplied: setOk,
      dataPrice,
      callPrice,
      callLabel,
      currentPrice: dataPrice + callPrice,
    });
  }

  if (!hasSmartphone) {
    showError('スマートフォンのキャリアとプランを少なくとも1台入力してください。');
    return;
  }

  // =====================
  // 現在の合計料金
  // =====================
  const currentSpTotal  = smartphones.reduce((s, sp) => s + sp.currentPrice, 0);
  const currentTotal    = currentFiberPrice + currentPhonePrice + currentSpTotal;

  // =====================
  // CATV料金計算
  // =====================
  const catvFiberPrice = CATV_FIBER_PLAN.price;          // 4,389円
  const catvPhonePrice = CATV_PHONE_OPTION.price;        // 1,089円（光でんわ）

  // スマホ台数分のCATVプランを推奨（通話オプション込み）
  const catvSpDetails = smartphones.map((sp, idx) => {
    const recommendedPlan = recommendCatvPlan(sp.plan);
    // 現在の通話プランに近いCATVの通話オプションを推奨
    const recommendedCall = recommendCatvCall(sp.callPrice);
    const override = catvSmartphoneOverrides[sp.rowId] || {};
    const catvPlan = getCatvSmartphonePlan(override.plan) || recommendedPlan;
    const catvCall = getCatvCallOption(override.call) || recommendedCall;
    const catvDataPrice = catvPlan.discountedPrice;
    const catvCallPrice = catvCall.price;
    return {
      rowId:             sp.rowId,
      index:             idx + 1,
      originalCarrier:   sp.carrier,
      originalPlan:      sp.plan,
      originalDataPrice: sp.dataPrice,
      originalCallPrice: sp.callPrice,
      originalCallLabel: sp.callLabel,
      originalPrice:     sp.currentPrice,
      catvPlan,
      catvDataPrice,
      catvCall,
      catvCallPrice,
      catvPrice:         catvDataPrice + catvCallPrice,
      recommendedPlan,
      recommendedCall,
      isPlanCustomized:  catvPlan.plan !== recommendedPlan.plan,
      isCallCustomized:  catvCall.optionName !== recommendedCall.optionName,
    };
  });

  const catvSpTotal = catvSpDetails.reduce((s, sp) => s + sp.catvPrice, 0);
  const catvTotal   = catvFiberPrice + catvPhonePrice + catvSpTotal;

  // 節約額
  const savingMonthly = currentTotal - catvTotal;
  const savingYearly  = savingMonthly * 12;
  const saving3Years  = savingMonthly * 36;

  const resultData = {
    fiberCarrier, fiberPlan, currentFiberPrice,
    currentPhonePrice, currentPhoneLabel,
    smartphones, currentSpTotal, currentTotal,
    catvFiberPrice, catvPhonePrice,
    catvSpDetails, catvSpTotal, catvTotal,
    savingMonthly, savingYearly, saving3Years,
  };

  // 問い合わせフォーム用に結果を保存
  _lastCalcResult = resultData;

  displayResults(resultData, options);
}

function getCatvSmartphonePlan(planName) {
  return CATV_SMARTPHONE_PLANS.find(p => p.plan === planName) || null;
}

function getCatvCallOption(optionName) {
  return CATV_CALL_OPTIONS.find(o => o.optionName === optionName) || null;
}

function onCatvSmartphoneChange(rowId, field, value) {
  if (!catvSmartphoneOverrides[rowId]) {
    catvSmartphoneOverrides[rowId] = {};
  }
  catvSmartphoneOverrides[rowId][field] = value;
  calculate({ scroll: false });
}

/**
 * 現在の通話料金に近いCATVの通話オプションを推奨
 * 通話なし(0円) → 通話なし
 * 有料通話あり  → 同等の通話オプション（かけ放題なら同等、それ以外は10分カケホ）
 */
function recommendCatvCall(currentCallPrice) {
  if (currentCallPrice === 0) {
    return CATV_CALL_OPTIONS[0]; // 通話なし
  } else if (currentCallPrice >= 1500) {
    return CATV_CALL_OPTIONS[2]; // カケホ(1,650円)
  } else {
    return CATV_CALL_OPTIONS[1]; // 10分カケホ(759円)
  }
}

/**
 * プラン名からGB数（数値）を抽出する
 * 例: "eximo3G"→3, "MAX無制限"→999, "mini4GB"→4, "irumo0.5G"→0.5,
 *     "ライト７G"→7, "30G"→30, "110G"→110, "５G"→5
 */
function extractGb(planName) {
  const s = planName.replace(/[\s　]/g, '');
  // 無制限系
  if (/無制限|unlimit/i.test(s)) return 999;
  // 全角数字を半角に変換
  const normalized = s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  // 数値部分を抽出（小数点対応）
  const m = normalized.match(/([\d.]+)\s*[gG][bB]?/);
  if (m) return parseFloat(m[1]);
  return 1; // 該当なし→1Gとみなす
}

/**
 * CATVプランのGB数リスト: 1G / 3G / 5G
 * 現在のプランのGB数に最も近いCATVプランを選ぶ
 * ただし 5G超 は必ず 5G を選ぶ（5Gが上限のため）
 */
function recommendCatvPlan(currentPlan) {
  const gb = extractGb(currentPlan);
  const catvGbs = [1, 3, 5]; // CATVプランのGB数

  // 5G超（無制限・大容量）は上限の5Gプランを推奨
  if (gb > 5) return CATV_SMARTPHONE_PLANS[2]; // 5G

  // 最も差が小さいCATVプランを選ぶ
  let minDiff = Infinity;
  let bestIdx = 0;
  catvGbs.forEach((catvGb, idx) => {
    const diff = Math.abs(gb - catvGb);
    if (diff < minDiff) { minDiff = diff; bestIdx = idx; }
  });
  return CATV_SMARTPHONE_PLANS[bestIdx];
}

// =====================================================
// 結果表示
// =====================================================

function displayResults(data, options = {}) {
  const {
    fiberCarrier, fiberPlan, currentFiberPrice,
    currentPhonePrice, currentPhoneLabel,
    smartphones, currentTotal,
    catvFiberPrice, catvPhonePrice,
    catvSpDetails, catvTotal,
    savingMonthly, savingYearly, saving3Years,
  } = data;

  // STEPインジケーター更新
  document.getElementById('step-dot-3').classList.add('active');

  // 節約バナー
  document.getElementById('result-monthly').textContent = `${savingMonthly.toLocaleString()}円`;
  document.getElementById('result-yearly').textContent  = `${savingYearly.toLocaleString()}円`;
  document.getElementById('result-3years').textContent  = `${saving3Years.toLocaleString()}円`;

  const banner = document.getElementById('saving-banner');
  banner.classList.toggle('positive', savingMonthly >= 0);
  banner.classList.toggle('negative', savingMonthly < 0);

  // セット割通知
  const setNotice = document.getElementById('set-discount-notice');
  const appliedList    = smartphones.filter(sp => sp.setApplied);
  const notAppliedList = smartphones.filter(sp => !sp.setApplied && sp.planData.condition);
  let noticeHtml = '';
  if (appliedList.length > 0) {
    noticeHtml += `<div class="notice-applied"><i class="fas fa-check-circle"></i>
      <strong>セット割自動適用済み：</strong>
      ${appliedList.map(sp => `スマホ${sp.rowId}台目（${sp.carrier}）`).join('、')}
      → ${fiberCarrier}とのセット割が自動反映されています</div>`;
  }
  if (notAppliedList.length > 0) {
    noticeHtml += `<div class="notice-not-applied"><i class="fas fa-exclamation-triangle"></i>
      <strong>セット割未適用：</strong>
      ${notAppliedList.map(sp => `スマホ${sp.rowId}台目（${sp.carrier}）`).join('、')}
      → セット割条件の光回線と一致しないため基本料金で計算しています</div>`;
  }
  setNotice.innerHTML = noticeHtml;
  setNotice.style.display = noticeHtml ? 'block' : 'none';

  // ===== 現在の料金内訳 =====
  let currentDetailHtml = '';
  // 光回線
  currentDetailHtml += detailItem('fas fa-wifi', `${fiberCarrier}（${fiberPlan}）`, currentFiberPrice);
  // 光電話
  if (currentPhonePrice > 0 && currentPhoneLabel) {
    currentDetailHtml += detailItem('fas fa-phone-alt', currentPhoneLabel, currentPhonePrice, '', 'phone-icon');
  }
  // スマホ
  smartphones.forEach(sp => {
    const setTag = sp.setApplied
      ? `<span class="tag-set-applied">セット割適用</span>`
      : (sp.planData.condition ? `<span class="tag-set-none">セット割なし</span>` : `<span class="tag-set-na">割引対象外</span>`);
    currentDetailHtml += detailItem('fas fa-mobile-alt',
      `スマホ${sp.rowId}台目 ${sp.carrier}（${sp.plan}）${setTag}`, sp.dataPrice);
    if (sp.callPrice > 0) {
      currentDetailHtml += detailItem('fas fa-phone',
        `　└ 通話：${sp.callLabel}`, sp.callPrice, 'sub-item');
    } else {
      currentDetailHtml += detailItem('fas fa-phone',
        `　└ 通話：${sp.callLabel}`, 0, 'sub-item text-gray');
    }
  });
  document.getElementById('current-detail').innerHTML = currentDetailHtml;
  document.getElementById('current-total-display').textContent = `${currentTotal.toLocaleString()}円/月`;

  // ===== CATV料金内訳 =====
  let catvDetailHtml = '';
  // CATV光回線
  catvDetailHtml += detailItem('fas fa-wifi',
    `ひかりネット（10G）<span class="tag-set-applied">CATV</span>`, catvFiberPrice, '', 'catv-price');
  // CATV光電話
  catvDetailHtml += detailItem('fas fa-phone-alt',
    `光でんわ<span class="tag-set-applied">CATV</span>`, catvPhonePrice, 'phone-icon', 'catv-price');
  catvDetailHtml += `
    <div class="catv-edit-note">
      <i class="fas fa-sliders-h"></i>
      ケーブルスマホの容量・通話はここで変更できます
    </div>`;
  // CATVスマホ
  catvSpDetails.forEach(sp => {
    catvDetailHtml += catvSmartphoneControlItem(sp);
    catvDetailHtml += catvCallControlItem(sp);
  });
  document.getElementById('catv-detail').innerHTML = catvDetailHtml;
  document.getElementById('catv-total-display').textContent = `${catvTotal.toLocaleString()}円/月`;

  // ===== 詳細テーブル =====
  let tbodyHtml = '';

  // 光回線行
  const fiberDiff = currentFiberPrice - catvFiberPrice;
  tbodyHtml += tableRow(
    `<span class="badge badge-blue"><i class="fas fa-wifi"></i> 光回線</span>`,
    `${fiberCarrier}（${fiberPlan}）`,
    currentFiberPrice,
    `ひかりネット（10G）`,
    catvFiberPrice,
    fiberDiff
  );

  // 光電話行
  const phoneDiff = currentPhonePrice - catvPhonePrice;
  const currentPhoneDisplay = currentPhoneLabel || '光電話なし';
  tbodyHtml += tableRow(
    `<span class="badge badge-phone"><i class="fas fa-phone-alt"></i> 固定電話</span>`,
    currentPhoneDisplay,
    currentPhonePrice,
    `光でんわ（CATV）`,
    catvPhonePrice,
    phoneDiff
  );

  // スマホ行
  catvSpDetails.forEach((sp, idx) => {
    const src = smartphones[idx];
    const setLabel = src?.setApplied
      ? '<span class="tag-set-applied">セット割適用</span>'
      : (src?.planData?.condition ? '<span class="tag-set-none">割引なし</span>' : '');
    const customLabel = (sp.isPlanCustomized || sp.isCallCustomized)
      ? '<span class="tag-set-none">変更済み</span>'
      : '<span class="tag-set-applied">自動おすすめ</span>';
    tbodyHtml += tableRow(
      `<span class="badge badge-green"><i class="fas fa-mobile-alt"></i> スマホ${sp.index}台目</span>`,
      `${sp.originalCarrier}（${sp.originalPlan}）${setLabel}<br><small class="text-gray">通話：${sp.originalCallLabel}（${sp.originalCallPrice.toLocaleString()}円）</small>`,
      sp.originalPrice,
      `ケーブルスマホ（${sp.catvPlan.plan}）${customLabel}<br><small class="text-gray">通話：${sp.catvCall.optionName}（${sp.catvCallPrice.toLocaleString()}円）</small>`,
      sp.catvPrice,
      sp.originalPrice - sp.catvPrice
    );
  });

  // 合計行
  tbodyHtml += `
    <tr class="total-row">
      <td colspan="2"><strong>合計</strong></td>
      <td class="text-right"><strong>${currentTotal.toLocaleString()}円</strong></td>
      <td></td>
      <td class="text-right catv-price"><strong>${catvTotal.toLocaleString()}円</strong></td>
      <td class="text-right ${savingMonthly >= 0 ? 'save-positive' : 'save-negative'}">
        <strong>${savingMonthly >= 0 ? '-' : '+'}${Math.abs(savingMonthly).toLocaleString()}円</strong>
      </td>
    </tr>`;
  document.getElementById('detail-tbody').innerHTML = tbodyHtml;

  // グラフ描画
  drawChart(data);

  // 結果セクション表示
  const resultSection = document.getElementById('result-section');
  resultSection.style.display = 'block';
  if (options.scroll !== false) {
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// =====================================================
// HTML生成ヘルパー
// =====================================================

function detailItem(icon, label, price, extraLabelClass = '', extraPriceClass = '') {
  const priceStr = price === 0 ? '0' : price.toLocaleString();
  const priceColor = extraPriceClass || '';
  return `
    <div class="detail-item">
      <span class="detail-label ${extraLabelClass}">
        <i class="${icon}"></i> ${label}
      </span>
      <span class="detail-price ${priceColor}">${priceStr}円</span>
    </div>`;
}

function catvSmartphoneControlItem(sp) {
  const planOptions = CATV_SMARTPHONE_PLANS.map(plan => `
    <option value="${plan.plan}" ${plan.plan === sp.catvPlan.plan ? 'selected' : ''}>
      ${plan.plan}（${plan.discountedPrice.toLocaleString()}円/月）
    </option>`).join('');
  const tag = sp.isPlanCustomized
    ? '<span class="tag-set-none">変更済み</span>'
    : '<span class="tag-set-applied">自動おすすめ</span>';

  return `
    <div class="detail-item catv-edit-item">
      <span class="detail-label catv-edit-label">
        <i class="fas fa-mobile-alt"></i>
        <span class="catv-edit-title">スマホ${sp.index}台目 ケーブルスマホ ${tag}</span>
        <select class="catv-mini-select"
          aria-label="スマホ${sp.index}台目 ケーブルスマホ データ容量"
          onchange="onCatvSmartphoneChange(${sp.rowId}, 'plan', this.value)">
          ${planOptions}
        </select>
      </span>
      <span class="detail-price catv-price">${sp.catvDataPrice.toLocaleString()}円</span>
    </div>`;
}

function catvCallControlItem(sp) {
  const callOptions = CATV_CALL_OPTIONS.map(call => `
    <option value="${call.optionName}" ${call.optionName === sp.catvCall.optionName ? 'selected' : ''}>
      ${call.optionName}（${call.price.toLocaleString()}円/月）
    </option>`).join('');
  const priceClass = sp.catvCallPrice > 0 ? 'catv-price' : 'text-gray';
  const tag = sp.isCallCustomized
    ? '<span class="tag-set-none">変更済み</span>'
    : '<span class="tag-set-applied">自動おすすめ</span>';

  return `
    <div class="detail-item catv-edit-item sub-item">
      <span class="detail-label catv-edit-label">
        <i class="fas fa-phone"></i>
        <span class="catv-edit-title">通話 ${tag}</span>
        <select class="catv-mini-select"
          aria-label="スマホ${sp.index}台目 ケーブルスマホ 通話"
          onchange="onCatvSmartphoneChange(${sp.rowId}, 'call', this.value)">
          ${callOptions}
        </select>
      </span>
      <span class="detail-price ${priceClass}">${sp.catvCallPrice.toLocaleString()}円</span>
    </div>`;
}

function tableRow(category, currentLabel, currentPrice, catvLabel, catvPrice, diff) {
  const diffClass = diff >= 0 ? 'save-positive' : 'save-negative';
  const diffStr   = `${diff >= 0 ? '-' : '+'}${Math.abs(diff).toLocaleString()}円`;
  return `
    <tr>
      <td>${category}</td>
      <td>${currentLabel}</td>
      <td class="text-right">${currentPrice.toLocaleString()}円</td>
      <td>${catvLabel}</td>
      <td class="text-right catv-price">${catvPrice.toLocaleString()}円</td>
      <td class="text-right ${diffClass}">${diffStr}</td>
    </tr>`;
}

// =====================================================
// グラフ描画
// 「現在」「CATV後」の2本の積み上げ棒グラフ
// 光回線／固定電話／スマホ（台数分）を色分けして重ねて表示
// =====================================================

function drawChart(data) {
  const {
    currentFiberPrice, currentPhonePrice, smartphones, currentTotal,
    catvFiberPrice, catvPhonePrice, catvSpDetails, catvTotal
  } = data;

  const ctx = document.getElementById('compareChart').getContext('2d');
  if (compareChart) { compareChart.destroy(); compareChart = null; }

  // X軸ラベル：「現在の料金」「CATV乗り換え後」の2本
  const labels = ['現在の料金', 'CATV乗り換え後'];

  // ─── 色定義 ───
  const COLOR_FIBER       = { bg: 'rgba(59,130,246,0.85)',  border: 'rgba(37,99,235,1)'   }; // 青：光回線
  const COLOR_PHONE       = { bg: 'rgba(139,92,246,0.85)', border: 'rgba(109,40,217,1)'   }; // 紫：固定電話
  // スマホは台数分、緑系グラデーション
  const SP_COLORS = [
    { bg: 'rgba(16,185,129,0.85)',  border: 'rgba(5,150,105,1)'   },
    { bg: 'rgba(52,211,153,0.85)',  border: 'rgba(16,185,129,1)'  },
    { bg: 'rgba(110,231,183,0.85)', border: 'rgba(52,211,153,1)'  },
    { bg: 'rgba(167,243,208,0.85)', border: 'rgba(110,231,183,1)' },
    { bg: 'rgba(209,250,229,0.85)', border: 'rgba(167,243,208,1)' },
    { bg: 'rgba(6,95,70,0.85)',     border: 'rgba(6,78,59,1)'     },
    { bg: 'rgba(4,120,87,0.85)',    border: 'rgba(6,95,70,1)'     },
    { bg: 'rgba(5,150,105,0.85)',   border: 'rgba(4,120,87,1)'    },
  ];

  // ─── データセット構築 ───
  // 各データセット：[現在の値, CATV後の値] の2要素配列
  const datasets = [];

  // 1. 光回線
  datasets.push({
    label: '光回線',
    data: [currentFiberPrice, catvFiberPrice],
    backgroundColor: COLOR_FIBER.bg,
    borderColor: COLOR_FIBER.border,
    borderWidth: 1,
    borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
    borderSkipped: 'bottom',
    stack: 'total',
  });

  // 2. 固定電話
  datasets.push({
    label: '固定電話',
    data: [currentPhonePrice, catvPhonePrice],
    backgroundColor: COLOR_PHONE.bg,
    borderColor: COLOR_PHONE.border,
    borderWidth: 1,
    borderRadius: 0,
    borderSkipped: 'bottom',
    stack: 'total',
  });

  // 3. スマホ（台数分）
  smartphones.forEach((sp, i) => {
    const col = SP_COLORS[i % SP_COLORS.length];
    const catvSp = catvSpDetails[i];
    const isLast = (i === smartphones.length - 1);
    datasets.push({
      label: `スマホ${i + 1}台目`,
      data: [sp.currentPrice, catvSp ? catvSp.catvPrice : 0],
      backgroundColor: col.bg,
      borderColor: col.border,
      borderWidth: 1,
      // 最後のスマホ層の上端を丸める
      borderRadius: isLast
        ? { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 }
        : 0,
      borderSkipped: 'bottom',
      stack: 'total',
    });
  });

  // ─── 合計ラベルをグラフ上部に表示するカスタムプラグイン ───
  const totalLabelPlugin = {
    id: 'totalLabel',
    afterDatasetsDraw(chart) {
      const { ctx: c, chartArea: { top }, scales: { x, y } } = chart;
      const totals = [currentTotal, catvTotal];
      const saving = currentTotal - catvTotal;

      totals.forEach((total, i) => {
        const xPos = x.getPixelForValue(i);
        const yPos = y.getPixelForValue(total) - 10;
        c.save();
        c.font = 'bold 13px "Noto Sans JP", sans-serif';
        c.fillStyle = i === 1 ? 'rgba(5,150,105,1)' : 'rgba(37,99,235,1)';
        c.textAlign = 'center';
        c.fillText(`${total.toLocaleString()}円`, xPos, yPos);
        c.restore();
      });

      // 節約額を2本の棒の中間に表示
      const x0 = x.getPixelForValue(0);
      const x1 = x.getPixelForValue(1);
      const midX = (x0 + x1) / 2;
      const yTop = y.getPixelForValue(Math.max(currentTotal, catvTotal)) - 28;

      if (saving > 0) {
        c.save();
        // 吹き出し背景
        const label = `月 ${saving.toLocaleString()}円節約！`;
        c.font = 'bold 14px "Noto Sans JP", sans-serif';
        const tw = c.measureText(label).width;
        const ph = 26, pw = tw + 20;
        const rx = midX - pw / 2, ry = yTop - ph / 2;
        c.fillStyle = 'rgba(5,150,105,0.92)';
        roundRect(c, rx, ry, pw, ph, 6);
        c.fill();
        c.fillStyle = '#fff';
        c.textAlign = 'center';
        c.fillText(label, midX, ry + 17);
        c.restore();
      }
    }
  };

  // 角丸ヘルパー
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  compareChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 48 } },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Noto Sans JP', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 14,
          },
        },
        tooltip: {
          mode: 'index',
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}円`,
            footer: items => {
              const total = items.reduce((s, i) => s + i.parsed.y, 0);
              return `合計: ${total.toLocaleString()}円`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            font: { family: "'Noto Sans JP', sans-serif", size: 14, weight: 'bold' },
          },
          grid: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: v => `${v.toLocaleString()}円`,
            font: { family: "'Noto Sans JP', sans-serif", size: 11 },
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    },
    plugins: [totalLabelPlugin],
  });
}

// =====================================================
// ユーティリティ
// =====================================================
function showError(msg) { alert(`⚠️ ${msg}`); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// =====================================================
// 問い合わせモーダル制御
// =====================================================

// 最後の計算結果を保持するグローバル変数
let _lastCalcResult = null;

/** モーダルを開く・計算結果プレビューをセット */
function openInquiryModal() {
  if (!_lastCalcResult) {
    showError('先に「節約額を自動計算する」を押してください。');
    return;
  }
  const { savingMonthly, savingYearly, saving3Years, currentTotal, catvTotal } = _lastCalcResult;

  // プレビューに結果を自動セット
  document.getElementById('modal-result-preview').innerHTML = `
    <div class="preview-item">
      <div class="preview-label">現在の月額合計</div>
      <div class="preview-value">${currentTotal.toLocaleString()}円</div>
    </div>
    <div class="preview-item">
      <div class="preview-label">CATV後の月額合計</div>
      <div class="preview-value">${catvTotal.toLocaleString()}円</div>
    </div>
    <div class="preview-item">
      <div class="preview-label">💰 月額節約額</div>
      <div class="preview-value" style="color:#047857;">${savingMonthly.toLocaleString()}円</div>
    </div>
    <div class="preview-item">
      <div class="preview-label">📅 年間節約額</div>
      <div class="preview-value" style="color:#047857;">${savingYearly.toLocaleString()}円</div>
    </div>
  `;

  // フォームリセット
  document.getElementById('inquiry-name').value    = '';
  document.getElementById('inquiry-tel').value     = '';
  document.getElementById('inquiry-email').value   = '';
  document.getElementById('inquiry-message').value = '';
  document.getElementById('modal-error').style.display = 'none';
  document.getElementById('modal-form').style.display  = 'block';
  document.getElementById('modal-success').style.display = 'none';

  // モーダル表示
  const modal = document.getElementById('inquiry-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** モーダルを閉じる */
function closeInquiryModal() {
  document.getElementById('inquiry-modal').classList.remove('open');
  document.body.style.overflow = '';
}

/** オーバーレイクリックで閉じる */
function closeInquiryModalOutside(e) {
  if (e.target === document.getElementById('inquiry-modal')) {
    closeInquiryModal();
  }
}

/** ESCキーでモーダルを閉じる */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeInquiryModal();
});

/**
 * 問い合わせ送信（mailto）
 * 計算結果＋入力情報をメール本文に自動セットして送信
 */
function sendInquiry() {
  const name    = document.getElementById('inquiry-name').value.trim();
  const tel     = document.getElementById('inquiry-tel').value.trim();
  const email   = document.getElementById('inquiry-email').value.trim();
  const message = document.getElementById('inquiry-message').value.trim();
  const errEl   = document.getElementById('modal-error');

  // バリデーション
  if (!name) {
    errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> お名前を入力してください。';
    errEl.style.display = 'flex'; return;
  }
  if (!tel) {
    errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> 電話番号を入力してください。';
    errEl.style.display = 'flex'; return;
  }
  errEl.style.display = 'none';

  const r = _lastCalcResult;

  // メール本文を構築
  const body = [
    '【固定費削減シミュレーター お問い合わせ】',
    '',
    '■ お客様情報',
    `お名前：${name}`,
    `電話番号：${tel}`,
    email ? `メールアドレス：${email}` : '',
    '',
    '■ シミュレーション結果',
    `現在の月額合計：${r.currentTotal.toLocaleString()}円`,
    `CATV乗り換え後：${r.catvTotal.toLocaleString()}円`,
    `月額節約額　　：${r.savingMonthly.toLocaleString()}円`,
    `年間節約額　　：${r.savingYearly.toLocaleString()}円`,
    `3年間節約総額：${r.saving3Years.toLocaleString()}円`,
    '',
    '■ 現在のご契約内容',
    `光回線：${r.fiberCarrier}（${r.fiberPlan}）${r.currentFiberPrice.toLocaleString()}円/月`,
    r.currentPhonePrice > 0 ? `固定電話：${r.currentPhoneLabel || '光電話'}　${r.currentPhonePrice.toLocaleString()}円/月` : '固定電話：なし',
    ...r.smartphones.map((sp, i) =>
      `スマホ${i+1}台目：${sp.carrier}（${sp.plan}）データ${sp.dataPrice.toLocaleString()}円 + 通話${sp.callPrice.toLocaleString()}円 = ${sp.currentPrice.toLocaleString()}円/月`
    ),
    '',
    '■ CATV乗り換え後',
    `ひかりネット（10G）：${r.catvFiberPrice.toLocaleString()}円/月`,
    `光でんわ：${r.catvPhonePrice.toLocaleString()}円/月`,
    ...r.catvSpDetails.map((sp, i) =>
      `スマホ${i+1}台目 ケーブルスマホ（${sp.catvPlan.plan}）：${sp.catvDataPrice.toLocaleString()}円 + 通話(${sp.catvCall.optionName})${sp.catvCallPrice.toLocaleString()}円 = ${sp.catvPrice.toLocaleString()}円/月`
    ),
    '',
    message ? `■ ご質問・備考\n${message}` : '',
    '',
    '※ このメールはCATVシミュレーターより自動送信されました。',
  ].filter(l => l !== null && l !== undefined).join('\n');

  const subject = `【CATV乗り換え相談】${name}様 月${r.savingMonthly.toLocaleString()}円節約シミュレーション`;
  const mailto  = `mailto:asano@nextsaleslab.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // メーラーを開く
  window.location.href = mailto;

  // 送信完了画面に切り替え
  setTimeout(() => {
    document.getElementById('modal-form').style.display  = 'none';
    document.getElementById('modal-success').style.display = 'block';
    document.getElementById('modal-result-preview').style.display = 'none';
  }, 600);
}
