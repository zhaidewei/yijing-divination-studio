const REQUIRED_ENTROPY = 80;
const LANG = (document.documentElement.lang || "zh").toLowerCase().startsWith("en") ? "en" : "zh";
const IS_EN = LANG === "en";

const TRIGRAMS = {
  "111": { name: "乾", enName: "Qian", symbol: "☰", image: "天", enImage: "Heaven" },
  "110": { name: "兑", enName: "Dui", symbol: "☱", image: "泽", enImage: "Lake" },
  "101": { name: "离", enName: "Li", symbol: "☲", image: "火", enImage: "Fire" },
  "100": { name: "震", enName: "Zhen", symbol: "☳", image: "雷", enImage: "Thunder" },
  "011": { name: "巽", enName: "Xun", symbol: "☴", image: "风", enImage: "Wind" },
  "010": { name: "坎", enName: "Kan", symbol: "☵", image: "水", enImage: "Water" },
  "001": { name: "艮", enName: "Gen", symbol: "☶", image: "山", enImage: "Mountain" },
  "000": { name: "坤", enName: "Kun", symbol: "☷", image: "地", enImage: "Earth" },
};

const HEXAGRAMS = new Map([
  ["111|111", { no: 1, name: "乾为天" }],
  ["000|000", { no: 2, name: "坤为地" }],
  ["010|100", { no: 3, name: "水雷屯" }],
  ["001|010", { no: 4, name: "山水蒙" }],
  ["010|111", { no: 5, name: "水天需" }],
  ["111|010", { no: 6, name: "天水讼" }],
  ["000|010", { no: 7, name: "地水师" }],
  ["010|000", { no: 8, name: "水地比" }],
  ["011|111", { no: 9, name: "风天小畜" }],
  ["111|110", { no: 10, name: "天泽履" }],
  ["000|111", { no: 11, name: "地天泰" }],
  ["111|000", { no: 12, name: "天地否" }],
  ["111|101", { no: 13, name: "天火同人" }],
  ["101|111", { no: 14, name: "火天大有" }],
  ["000|001", { no: 15, name: "地山谦" }],
  ["100|000", { no: 16, name: "雷地豫" }],
  ["110|100", { no: 17, name: "泽雷随" }],
  ["001|011", { no: 18, name: "山风蛊" }],
  ["000|110", { no: 19, name: "地泽临" }],
  ["011|000", { no: 20, name: "风地观" }],
  ["101|100", { no: 21, name: "火雷噬嗑" }],
  ["001|101", { no: 22, name: "山火贲" }],
  ["001|000", { no: 23, name: "山地剥" }],
  ["000|100", { no: 24, name: "地雷复" }],
  ["111|100", { no: 25, name: "天雷无妄" }],
  ["001|111", { no: 26, name: "山天大畜" }],
  ["001|100", { no: 27, name: "山雷颐" }],
  ["110|011", { no: 28, name: "泽风大过" }],
  ["010|010", { no: 29, name: "坎为水" }],
  ["101|101", { no: 30, name: "离为火" }],
  ["110|001", { no: 31, name: "泽山咸" }],
  ["100|011", { no: 32, name: "雷风恒" }],
  ["111|001", { no: 33, name: "天山遁" }],
  ["100|111", { no: 34, name: "雷天大壮" }],
  ["101|000", { no: 35, name: "火地晋" }],
  ["000|101", { no: 36, name: "地火明夷" }],
  ["011|101", { no: 37, name: "风火家人" }],
  ["101|110", { no: 38, name: "火泽睽" }],
  ["010|001", { no: 39, name: "水山蹇" }],
  ["100|010", { no: 40, name: "雷水解" }],
  ["001|110", { no: 41, name: "山泽损" }],
  ["011|100", { no: 42, name: "风雷益" }],
  ["110|111", { no: 43, name: "泽天夬" }],
  ["111|011", { no: 44, name: "天风姤" }],
  ["110|000", { no: 45, name: "泽地萃" }],
  ["000|011", { no: 46, name: "地风升" }],
  ["110|010", { no: 47, name: "泽水困" }],
  ["010|011", { no: 48, name: "水风井" }],
  ["110|101", { no: 49, name: "泽火革" }],
  ["101|011", { no: 50, name: "火风鼎" }],
  ["100|100", { no: 51, name: "震为雷" }],
  ["001|001", { no: 52, name: "艮为山" }],
  ["011|001", { no: 53, name: "风山渐" }],
  ["100|110", { no: 54, name: "雷泽归妹" }],
  ["100|101", { no: 55, name: "雷火丰" }],
  ["101|001", { no: 56, name: "火山旅" }],
  ["011|011", { no: 57, name: "巽为风" }],
  ["110|110", { no: 58, name: "兑为泽" }],
  ["011|010", { no: 59, name: "风水涣" }],
  ["010|110", { no: 60, name: "水泽节" }],
  ["011|110", { no: 61, name: "风泽中孚" }],
  ["100|001", { no: 62, name: "雷山小过" }],
  ["010|101", { no: 63, name: "水火既济" }],
  ["101|010", { no: 64, name: "火水未济" }],
]);

const YAO_LABELS = IS_EN ? ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Top Line"] : ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const HISTORY_KEY = "zhouyi_recent_casts_v1";
const HISTORY_LIMIT = 20;

const els = {
  question: document.getElementById("question"),
  entropyText: document.getElementById("entropyText"),
  entropyBar: document.getElementById("entropyBar"),
  castBtn: document.getElementById("castBtn"),
  focusOverlay: document.getElementById("focusOverlay"),
  focusQuestion: document.getElementById("focusQuestion"),
  focusEntropyText: document.getElementById("focusEntropyText"),
  focusEntropyBar: document.getElementById("focusEntropyBar"),
  focusCastBtn: document.getElementById("focusCastBtn"),
  focusCancelBtn: document.getElementById("focusCancelBtn"),
  resultPanel: document.getElementById("resultPanel"),
  hexagramSummary: document.getElementById("hexagramSummary"),
  flowLog: document.getElementById("flowLog"),
  copyResultBtn: document.getElementById("copyResultBtn"),
  copyResultStatus: document.getElementById("copyResultStatus"),
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  aiBtn: document.getElementById("aiBtn"),
  historyList: document.getElementById("historyList"),
  interpretPanel: document.getElementById("interpretPanel"),
  interpretText: document.getElementById("interpretText"),
};

let entropyState = new Uint32Array(1);
crypto.getRandomValues(entropyState);
entropyState = entropyState[0] ^ (Date.now() >>> 0);
let entropyCount = 0;
let entropyCollecting = false;
let entropyCompleted = false;
let lastPoint = { x: 0, y: 0, t: 0 };
let currentResult = null;
let historyItems = [];

class SeededRng {
  constructor(seed) {
    this.state = seed >>> 0;
    if (this.state === 0) {
      this.state = 0x6d2b79f5;
    }
  }

  nextU32() {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  }

  nextFloat() {
    return this.nextU32() / 0xffffffff;
  }

  int(min, max) {
    const span = max - min + 1;
    return min + (this.nextU32() % span);
  }
}

function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mixEntropy(value) {
  if (!entropyCollecting) {
    return;
  }

  const v = value >>> 0;
  entropyState ^= v + 0x9e3779b9 + ((entropyState << 6) >>> 0) + (entropyState >>> 2);
  entropyState >>>= 0;
  entropyCount += 1;
  updateEntropyUi();
}

function capturePointerEntropy(x, y) {
  const now = performance.now();
  const dx = Math.abs(x - lastPoint.x);
  const dy = Math.abs(y - lastPoint.y);
  const dt = Math.floor(now - lastPoint.t);

  if (dx + dy + dt < 3) {
    return;
  }

  const packed = ((x & 0x3ff) << 20) ^ ((y & 0x3ff) << 10) ^ (dt & 0x3ff);
  mixEntropy(packed);
  lastPoint = { x, y, t: now };
}

function entropyProgress() {
  return Math.min(1, entropyCount / REQUIRED_ENTROPY);
}

function updateEntropyUi() {
  const pct = entropyProgress();
  const width = `${(pct * 100).toFixed(1)}%`;
  els.entropyBar.style.width = width;
  els.focusEntropyBar.style.width = width;

  if (entropyCollecting) {
    els.entropyText.textContent = IS_EN
      ? `Silent-reading collection: ${entropyCount}/${REQUIRED_ENTROPY} entropy samples captured.`
      : `默读采集中：已收集 ${entropyCount}/${REQUIRED_ENTROPY} 份行为熵。`;
    if (pct < 1) {
      els.focusEntropyText.textContent = IS_EN
        ? `Collected ${entropyCount}/${REQUIRED_ENTROPY}. Keep reading and interacting naturally.`
        : `已收集 ${entropyCount}/${REQUIRED_ENTROPY} 份行为熵，请继续默读并自然交互。`;
    } else {
      els.focusEntropyText.textContent = IS_EN
        ? `Collection complete (${entropyCount}). Click "Finish Reading & Cast".`
        : `采集完成（${entropyCount}份），可点击“完成默读，开始起卦”。`;
    }
  } else if (entropyCompleted) {
    els.entropyText.textContent = IS_EN
      ? `Collection completed for this cast (${entropyCount}). Entropy is captured only during the focus modal.`
      : `本次起卦采集完成（${entropyCount}份）。行为熵仅在默读弹层期间采集。`;
    els.focusEntropyText.textContent = IS_EN ? `Completed (${entropyCount}).` : `本次采集完成（${entropyCount}份）。`;
  } else {
    els.entropyText.textContent = IS_EN
      ? 'Entropy is collected only while the "Read & Cast" modal is open.'
      : "行为熵只在“默读问题并起卦”弹层开启期间采集。";
    els.focusEntropyText.textContent = IS_EN ? 'Collection starts after clicking "Read & Cast".' : "点击“进入默读并起卦”后开始采集。";
  }
  updateButtons();
}

function updateButtons() {
  const questionOk = els.question.value.trim().length > 0;
  const entropyOk = entropyProgress() >= 1;
  els.castBtn.disabled = !questionOk || entropyCollecting;
  els.focusCastBtn.disabled = !(entropyCollecting && entropyOk);
  els.aiBtn.disabled = !currentResult;
  els.copyResultBtn.disabled = !currentResult;
}

function splitIntoTwo(total, rng) {
  return rng.int(1, total - 1);
}

function oneChange(total, rng) {
  const left = splitIntoTwo(total, rng);
  const right = total - left;
  const rightAfterHuman = right - 1;
  const leftR = left % 4 || 4;
  const rightR = rightAfterHuman % 4 || 4;
  const removed = 1 + leftR + rightR;
  const next = total - removed;

  return {
    total,
    left,
    right,
    rightAfterHuman,
    leftR,
    rightR,
    removed,
    next,
  };
}

function makeOneLine(rng, idx) {
  let total = 49;
  const changes = [];

  for (let i = 0; i < 3; i += 1) {
    const change = oneChange(total, rng);
    changes.push(change);
    total = change.next;
  }

  const value = total / 4;
  if (![6, 7, 8, 9].includes(value)) {
    throw new Error(IS_EN ? `Line ${idx + 1} calculation error: ${value}` : `第${idx + 1}爻计算异常，得到 ${value}`);
  }

  const yin = value === 6 || value === 8;
  const moving = value === 6 || value === 9;
  const changedYin = moving ? !yin : yin;

  return {
    index: idx,
    value,
    yin,
    moving,
    changedYin,
    changes,
  };
}

function bitsToHexagram(bits) {
  const lower = bits.slice(0, 3).join("");
  const upper = bits.slice(3, 6).join("");
  const key = `${upper}|${lower}`;
  const item = HEXAGRAMS.get(key);
  if (!item) {
    throw new Error(IS_EN ? `Missing hexagram mapping: ${key}` : `卦象映射缺失: ${key}`);
  }

  return {
    ...item,
    upper,
    lower,
    key,
    upperTrig: TRIGRAMS[upper],
    lowerTrig: TRIGRAMS[lower],
  };
}

function nuclearBits(bits) {
  return [bits[1], bits[2], bits[3], bits[2], bits[3], bits[4]];
}

function oppositeBits(bits) {
  return bits.map((b) => (b === 1 ? 0 : 1));
}

function reverseBits(bits) {
  return [...bits].reverse();
}

function renderYao(line) {
  const body = line.yin ? "— —" : "———";
  const mark = line.value === 6 ? " ×" : line.value === 9 ? " ○" : "";
  return `${body}${mark}`;
}

function buildFlowText(lines) {
  const out = [];
  out.push(
    IS_EN
      ? "Yarrow-stalk procedure: each line uses three transformations, starting from forty-nine stalks.\n"
      : "大衍筮法（蓍草法）流程：每爻三变，起于四十九策。\n"
  );

  lines.forEach((line) => {
    out.push(IS_EN ? `${YAO_LABELS[line.index]} (value=${line.value}):` : `${YAO_LABELS[line.index]}（值=${line.value}）：`);
    line.changes.forEach((c, i) => {
      if (IS_EN) {
        out.push(
          `  Change ${i + 1}: total=${c.total}, split left=${c.left}/right=${c.right}, ` +
            `after taking one from right -> ${c.rightAfterHuman}, residues left=${c.leftR}, right=${c.rightR}, ` +
            `removed=${c.removed}, remaining=${c.next}`
        );
      } else {
        out.push(
          `  第${i + 1}变：总数${c.total}，分二为 左${c.left}/右${c.right}，右取一为人后余${c.rightAfterHuman}，` +
            `左余${c.leftR}、右余${c.rightR}，本变去${c.removed}，存${c.next}`
        );
      }
    });
    out.push("");
  });

  return out.join("\n");
}

function buildResult(question) {
  const seedBase = fnv1a(`${question}|${Date.now()}|${entropyState}|${entropyCount}`) ^ entropyState;
  const rng = new SeededRng(seedBase >>> 0);

  const lines = [];
  for (let i = 0; i < 6; i += 1) {
    lines.push(makeOneLine(rng, i));
  }

  const baseBits = lines.map((line) => (line.yin ? 0 : 1));
  const changedBits = lines.map((line) => (line.changedYin ? 0 : 1));
  const base = bitsToHexagram(baseBits);
  const changed = bitsToHexagram(changedBits);
  const nuclear = bitsToHexagram(nuclearBits(baseBits));
  const opposite = bitsToHexagram(oppositeBits(baseBits));
  const reverse = bitsToHexagram(reverseBits(baseBits));
  const movingLines = lines
    .filter((line) => line.moving)
    .map((line) => YAO_LABELS[line.index]);

  return {
    question,
    seed: seedBase >>> 0,
    lines,
    baseBits,
    changedBits,
    base,
    changed,
    nuclear,
    opposite,
    reverse,
    movingLines,
    flowText: buildFlowText(lines),
  };
}

function renderSummary(result) {
  const linesTopDown = [...result.lines].reverse();
  const lineHtml = linesTopDown
    .map((line, i) => {
      const label = YAO_LABELS[5 - i];
      return `<div class="yao">${label}${IS_EN ? ": " : "："}${renderYao(line)}</div>`;
    })
    .join("");

  const movingText = result.movingLines.length > 0 ? result.movingLines.join(IS_EN ? ", " : "、") : IS_EN ? "No moving lines" : "无动爻";
  const upperName = IS_EN ? result.base.upperTrig.enName : result.base.upperTrig.name;
  const lowerName = IS_EN ? result.base.lowerTrig.enName : result.base.lowerTrig.name;
  const changedUpperName = IS_EN ? result.changed.upperTrig.enName : result.changed.upperTrig.name;
  const changedLowerName = IS_EN ? result.changed.lowerTrig.enName : result.changed.lowerTrig.name;

  els.hexagramSummary.innerHTML = `
    <p><strong>${IS_EN ? "Question" : "所问"}:</strong> ${escapeHtml(result.question)}</p>
    <p><strong>${IS_EN ? "Primary Hexagram" : "本卦"}:</strong> #${result.base.no} ${result.base.name}
      ${IS_EN ? `(${upperName}${result.base.upperTrig.symbol} above ${lowerName}${result.base.lowerTrig.symbol} below)` : `（上${upperName}${result.base.upperTrig.symbol} 下${lowerName}${result.base.lowerTrig.symbol}）`}
    </p>
    <p><strong>${IS_EN ? "Changed Hexagram" : "变卦"}:</strong> #${result.changed.no} ${result.changed.name}
      ${IS_EN ? `(${changedUpperName}${result.changed.upperTrig.symbol} above ${changedLowerName}${result.changed.lowerTrig.symbol} below)` : `（上${changedUpperName}${result.changed.upperTrig.symbol} 下${changedLowerName}${result.changed.lowerTrig.symbol}）`}
    </p>
    <p><strong>${IS_EN ? "Moving Lines" : "动爻"}:</strong> ${movingText}</p>
    <div class="line-grid">${lineHtml}</div>
    <p class="muted">${
      IS_EN
        ? 'Note: "○" = old yang (9), "×" = old yin (6). Both are moving lines.'
        : "注：符号“○”代表老阳（九），“×”代表老阴（六），均为动爻。"
    }</p>
  `;

  els.flowLog.textContent = result.flowText;
  els.resultPanel.hidden = false;
}

function buildCastResultText(result) {
  const movingText = result.movingLines.length > 0 ? result.movingLines.join(IS_EN ? ", " : "、") : IS_EN ? "No moving lines" : "无动爻";
  const linesText = [...result.lines]
    .reverse()
    .map((line, i) => `${YAO_LABELS[5 - i]}${IS_EN ? ": " : "："}${renderYao(line)} (value=${line.value})`)
    .join("\n");
  const upperName = IS_EN ? result.base.upperTrig.enName : result.base.upperTrig.name;
  const lowerName = IS_EN ? result.base.lowerTrig.enName : result.base.lowerTrig.name;
  const changedUpper = IS_EN ? result.changed.upperTrig.enName : result.changed.upperTrig.name;
  const changedLower = IS_EN ? result.changed.lowerTrig.enName : result.changed.lowerTrig.name;

  if (IS_EN) {
    return [
      "I Ching Casting Result",
      "",
      `Question: ${result.question}`,
      `Primary hexagram: #${result.base.no} ${result.base.name} (upper ${upperName}, lower ${lowerName})`,
      `Changed hexagram: #${result.changed.no} ${result.changed.name} (upper ${changedUpper}, lower ${changedLower})`,
      `Moving lines: ${movingText}`,
      "",
      "Six lines (top to bottom):",
      linesText,
    ].join("\n");
  }

  return [
    "周易起卦结果",
    "",
    `问题：${result.question}`,
    `本卦：第${result.base.no}卦 ${result.base.name}（上${upperName} 下${lowerName}）`,
    `变卦：第${result.changed.no}卦 ${result.changed.name}（上${changedUpper} 下${changedLower}）`,
    `动爻：${movingText}`,
    "",
    "六爻（自上而下）：",
    linesText,
  ].join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) {
    throw new Error(IS_EN ? "Clipboard copy is not supported in this browser." : "当前浏览器不支持复制到剪贴板。");
  }
}

function setCopyResultStatus(message, isError = false) {
  els.copyResultStatus.textContent = message;
  els.copyResultStatus.style.color = isError ? "#8f2e21" : "";
}

function getAiPendingText() {
  return IS_EN
    ? "Local interpretation is disabled. Enter your Anthropic API key and click AI Interpretation."
    : "本地解卦已关闭。请填写 Anthropic API Key 后点击“AI解卦”。";
}

function serializeResult(result) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    question: result.question,
    lines: result.lines.map((line) => ({
      index: line.index,
      value: line.value,
      yin: line.yin,
      moving: line.moving,
      changedYin: line.changedYin,
    })),
    base: {
      no: result.base.no,
      name: result.base.name,
      upper: result.base.upper,
      lower: result.base.lower,
    },
    changed: {
      no: result.changed.no,
      name: result.changed.name,
      upper: result.changed.upper,
      lower: result.changed.lower,
    },
    flowText: result.flowText,
  };
}

function hydrateResultFromHistory(item) {
  if (!item?.base?.upper || !item?.base?.lower || !item?.changed?.upper || !item?.changed?.lower) {
    return null;
  }

  const lines = Array.isArray(item.lines)
    ? item.lines.map((line) => ({
        index: Number(line.index),
        value: Number(line.value),
        yin: Boolean(line.yin),
        moving: Boolean(line.moving),
        changedYin: Boolean(line.changedYin),
      }))
    : [];

  const base = {
    ...item.base,
    upperTrig: TRIGRAMS[item.base.upper],
    lowerTrig: TRIGRAMS[item.base.lower],
  };
  const changed = {
    ...item.changed,
    upperTrig: TRIGRAMS[item.changed.upper],
    lowerTrig: TRIGRAMS[item.changed.lower],
  };

  return {
    question: item.question,
    lines,
    base,
    changed,
    movingLines: lines.filter((line) => line.moving).map((line) => YAO_LABELS[line.index]),
    flowText: item.flowText || buildFlowText(lines),
  };
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          item.question &&
          item.base &&
          item.changed &&
          item.base.upper &&
          item.base.lower &&
          item.changed.upper &&
          item.changed.lower
      )
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems.slice(0, HISTORY_LIMIT)));
  } catch {
    // Ignore storage quota / privacy-mode errors.
  }
}

function formatHistoryTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return IS_EN ? "Unknown time" : "未知时间";
  return date.toLocaleString();
}

function renderHistoryList() {
  if (!historyItems.length) {
    els.historyList.innerHTML = `<p class="muted">${IS_EN ? "No recent casts yet." : "暂无历史起卦记录。"}</p>`;
    return;
  }

  els.historyList.innerHTML = historyItems
    .map((item, index) => {
      const movingCount = Array.isArray(item.lines) ? item.lines.filter((line) => line.moving).length : 0;
      return `
        <article class="history-item">
          <div class="history-meta">${escapeHtml(formatHistoryTime(item.createdAt))}</div>
          <div class="history-question">${escapeHtml(item.question)}</div>
          <div class="history-brief">
            #${item.base.no} ${escapeHtml(item.base.name)} → #${item.changed.no} ${escapeHtml(item.changed.name)} · ${
              IS_EN ? `moving lines: ${movingCount}` : `动爻数：${movingCount}`
            }
          </div>
          <button class="secondary history-open" data-history-index="${index}">${IS_EN ? "View" : "查看"}</button>
        </article>
      `;
    })
    .join("");
}

function pushHistory(result) {
  historyItems = [serializeResult(result), ...historyItems].slice(0, HISTORY_LIMIT);
  saveHistory();
  renderHistoryList();
}

async function requestAiInterpretation(result, apiKey, model) {
  const sys = IS_EN
    ? "You are a rigorous I Ching interpretation assistant. Based on the primary hexagram, changed hexagram, moving lines, and user question, provide a structured analysis: overall meaning, timing judgment, risks, and action suggestions. Avoid deterministic superstition and emphasize agency."
    : "你是一位严谨的周易解卦助手。请基于本卦、变卦、动爻和提问，给出结构化分析：卦义、时机判断、风险、行动建议。避免迷信决定论，强调人可修正行为。";

  const user = IS_EN
    ? [
        `Question: ${result.question}`,
        `Primary hexagram: #${result.base.no} ${result.base.name}`,
        `Changed hexagram: #${result.changed.no} ${result.changed.name}`,
        `Moving lines: ${result.movingLines.length ? result.movingLines.join(", ") : "No moving lines"}`,
        "Please output four sections:",
        "1) Overall hexagram reading",
        "2) Core tension",
        "3) Three actionable suggestions",
        "4) One concise reminder",
      ].join("\n")
    : [
        `用户问题：${result.question}`,
        `本卦：第${result.base.no}卦 ${result.base.name}`,
        `变卦：第${result.changed.no}卦 ${result.changed.name}`,
        `动爻：${result.movingLines.length ? result.movingLines.join("、") : "无动爻"}`,
        "请输出四段：",
        "1) 卦象总论",
        "2) 关键矛盾",
        "3) 三条可执行建议",
        "4) 一句提醒",
      ].join("\n");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: sys,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(IS_EN ? `AI request failed: ${resp.status} ${text}` : `AI请求失败：${resp.status} ${text}`);
  }

  const data = await resp.json();
  if (Array.isArray(data.content)) {
    const texts = data.content.filter((c) => c.type === "text" && c.text).map((c) => c.text);
    if (texts.length > 0) {
      return texts.join("\n");
    }
  }

  throw new Error(IS_EN ? "No readable text found in AI response." : "AI响应中未找到可读文本。");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resetEntropyState() {
  const seed = new Uint32Array(1);
  crypto.getRandomValues(seed);
  entropyState = seed[0] ^ (Date.now() >>> 0);
  entropyCount = 0;
  lastPoint = { x: 0, y: 0, t: performance.now() };
}

function closeFocusOverlay() {
  els.focusOverlay.hidden = true;
  document.body.classList.remove("screen-locked");
}

function openFocusOverlay(question) {
  resetEntropyState();
  entropyCollecting = true;
  entropyCompleted = false;
  els.focusQuestion.textContent = question;
  els.focusOverlay.hidden = false;
  document.body.classList.add("screen-locked");
  updateEntropyUi();
}

function cancelFocusOverlay() {
  entropyCollecting = false;
  entropyCompleted = false;
  resetEntropyState();
  closeFocusOverlay();
  updateEntropyUi();
}

function wireEntropyEvents() {
  window.addEventListener("mousemove", (e) => {
    capturePointerEntropy(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      capturePointerEntropy(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      mixEntropy((window.scrollY * 2654435761 + Date.now()) >>> 0);
    },
    { passive: true }
  );

  window.addEventListener("click", (e) => {
    const packed = ((e.clientX & 0xffff) << 16) ^ (e.clientY & 0xffff) ^ Date.now();
    mixEntropy(packed >>> 0);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      return;
    }
    mixEntropy((e.key.charCodeAt(0) || 0) ^ Date.now());
  });

  els.question.addEventListener("input", () => {
    updateButtons();
  });
}

function openHistoryAt(index) {
  if (index < 0 || index >= historyItems.length) return;
  const item = historyItems[index];
  const hydrated = hydrateResultFromHistory(item);
  if (!hydrated) return;
  currentResult = hydrated;
  renderSummary(currentResult);
  setCopyResultStatus("");
  els.interpretPanel.hidden = false;
  els.interpretText.textContent = getAiPendingText();
  updateButtons();
}

function wireActions() {
  els.castBtn.addEventListener("click", () => {
    const question = els.question.value.trim();
    if (!question) return;
    openFocusOverlay(question);
  });

  els.focusCancelBtn.addEventListener("click", () => {
    cancelFocusOverlay();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && entropyCollecting) {
      cancelFocusOverlay();
    }
  });

  els.focusCastBtn.addEventListener("click", () => {
    if (!entropyCollecting || entropyProgress() < 1) return;

    const question = els.question.value.trim();
    if (!question) {
      cancelFocusOverlay();
      return;
    }

    entropyCollecting = false;
    closeFocusOverlay();

    try {
      currentResult = buildResult(question);
      entropyCompleted = true;
      renderSummary(currentResult);
      setCopyResultStatus("");
      pushHistory(currentResult);
      els.interpretPanel.hidden = false;
      els.interpretText.textContent = getAiPendingText();
    } catch (err) {
      entropyCompleted = false;
      alert(IS_EN ? `Casting failed: ${err.message}` : `起卦失败：${err.message}`);
    } finally {
      updateEntropyUi();
      updateButtons();
    }
  });

  els.aiBtn.addEventListener("click", async () => {
    if (!currentResult) return;
    els.interpretPanel.hidden = false;

    const apiKey = els.apiKey.value.trim();
    if (!apiKey) {
      els.interpretText.textContent = getAiPendingText();
      return;
    }

    const model = els.model.value.trim();
    els.aiBtn.disabled = true;
    els.aiBtn.textContent = IS_EN ? "Interpreting..." : "AI解卦中...";

    try {
      const text = await requestAiInterpretation(currentResult, apiKey, model);
      els.interpretText.textContent = text;
    } catch (err) {
      els.interpretText.textContent = IS_EN
        ? `${getAiPendingText()}\n\nAI call failed: ${err.message}`
        : `${getAiPendingText()}\n\nAI调用失败：${err.message}`;
    } finally {
      els.aiBtn.textContent = IS_EN ? "AI Interpretation" : "AI解卦";
      updateButtons();
    }
  });

  els.historyList.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest("[data-history-index]");
    if (!btn) return;
    const index = Number(btn.getAttribute("data-history-index"));
    if (Number.isNaN(index)) return;
    openHistoryAt(index);
  });

  els.copyResultBtn.addEventListener("click", async () => {
    if (!currentResult) return;
    const text = buildCastResultText(currentResult);
    try {
      await copyTextToClipboard(text);
      setCopyResultStatus(IS_EN ? "Cast result copied." : "卦象结果已复制。");
    } catch (err) {
      setCopyResultStatus(IS_EN ? `Copy failed: ${err.message}` : `复制失败：${err.message}`, true);
    }
  });
}

historyItems = loadHistory();
renderHistoryList();
if (historyItems.length) {
  openHistoryAt(0);
}
wireEntropyEvents();
wireActions();
updateEntropyUi();
updateButtons();
