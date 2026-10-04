import fs from 'node:fs';
import path from 'node:path';

const summaryPath = path.resolve('coverage/coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error('\x1b[31m[!] No se encontró coverage/coverage-summary.json. Ejecuta primero las pruebas.\x1b[0m');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

// Métricas globales
const metricsList = [
  { id: 'MSTR', name: 'Master (General)', pct: total.statements.pct },
  { id: 'STMT', name: 'Statements', pct: total.statements.pct },
  { id: 'BRNC', name: 'Branches', pct: total.branches.pct },
  { id: 'FUNC', name: 'Functions', pct: total.functions.pct },
  { id: 'LINE', name: 'Lines', pct: total.lines.pct },
];

// Archivos del proyecto
const fileList = [];
Object.keys(summary).forEach((filePath) => {
  if (filePath === 'total') return;
  const relPath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);
  const id = fileName.substring(0, 6).toUpperCase();
  fileList.push({
    id,
    path: relPath,
    pct: summary[filePath].statements.pct,
    stmts: summary[filePath].statements,
    branches: summary[filePath].branches,
    funcs: summary[filePath].functions,
    lines: summary[filePath].lines,
  });
});

const items = [...metricsList, ...fileList];

// Estilos ANSI
const C_CYAN = '\x1b[36m';
const C_YELLOW = '\x1b[33m';
const C_GREEN = '\x1b[32m';
const C_RED = '\x1b[31m';
const C_WHITE = '\x1b[37m';
const C_GRAY = '\x1b[90m';
const C_BLUE_BG = '\x1b[44m\x1b[97m';
const C_RESET = '\x1b[0m';

const METER_HEIGHT = 10;

// ENCABEZADO CON CUADRO ELEGANTE Y TÍTULO LIMPIO
console.log(`\n${C_CYAN}┌────────────────────────────────────────────────────────────────────────────────────────┐${C_RESET}`);
console.log(`${C_CYAN}│${C_RESET}                   ${C_YELLOW}📊 REPORTE DE COBERTURA DE CÓDIGO (VITEST)${C_RESET}                    ${C_CYAN}│${C_RESET}`);
console.log(`${C_CYAN}└────────────────────────────────────────────────────────────────────────────────────────┘${C_RESET}\n`);

// GRÁFICO DE VÚMETROS
let topFrame = '  ';
items.forEach(() => { topFrame += `${C_CYAN}┌──────┐${C_RESET}   `; });
console.log(topFrame);

for (let level = METER_HEIGHT; level >= 1; level--) {
  let rowStr = '  ';
  const threshold = level * 10;

  items.forEach((item) => {
    rowStr += `${C_CYAN}│${C_RESET}`;
    if (item.pct >= threshold - 5) {
      let blockColor = C_WHITE;
      if (level >= 8) blockColor = C_RED;
      else if (level >= 4) blockColor = C_GREEN;
      rowStr += `${blockColor}░░░░░░${C_RESET}`;
    } else {
      rowStr += '      ';
    }
    rowStr += `${C_CYAN}│${C_RESET}   `;
  });
  console.log(rowStr);
}

let botFrame = '  ';
items.forEach(() => { botFrame += `${C_CYAN}└──────┘${C_RESET}   `; });
console.log(botFrame);

// Cajas con Porcentaje Exacto (ej: 95.2% / 100%)
let boxTop = '  ';
let boxMid = '  ';
let boxBot = '  ';
items.forEach((item) => {
  const valStr = `${item.pct.toFixed(1)}%`.padStart(6, ' ');
  const color = item.pct >= 80 ? C_GREEN : C_RED;

  boxTop += `${C_CYAN}┌──────┐${C_RESET}   `;
  boxMid += `${C_CYAN}│${color}${valStr}${C_CYAN}│${C_RESET}   `;
  boxBot += `${C_CYAN}└──────┘${C_RESET}   `;
});
console.log(boxTop);
console.log(boxMid);
console.log(boxBot);

// ID en botón azul
let labelRow = '  ';
items.forEach((item) => {
  const tag = item.id.padStart(7).padEnd(8);
  labelRow += `${C_BLUE_BG}${tag}${C_RESET}   `;
});
console.log(labelRow + '\n');

// TABLA DE LEYENDA DETALLADA Y COMPLETA
console.log(`${C_CYAN}┌─[ DETALLE Y LEYENDA COMPLETA ]────────────────────────────────────────────────────────┐${C_RESET}`);
console.log(` ${C_WHITE}${'CANAL'.padEnd(8)} ${'NOMBRE / RUTA DEL ARCHIVO'.padEnd(42)} ${'STMTS'.padStart(8)} ${'BRANCH'.padStart(8)} ${'FUNCS'.padStart(8)} ${'LINES'.padStart(8)}${C_RESET}`);
console.log(`${C_GRAY} ────────────────────────────────────────────────────────────────────────────────────────${C_RESET}`);

// Sección de Métricas Generales
metricsList.forEach((m) => {
  const pctStr = `${m.pct.toFixed(1)}%`;
  console.log(` ${C_BLUE_BG}${m.id.padEnd(8)}${C_RESET} ${C_YELLOW}${m.name.padEnd(42)}${C_RESET} ${pctStr.padStart(8)} ${'N/A'.padStart(8)} ${'N/A'.padStart(8)} ${pctStr.padStart(8)}`);
});

console.log(`${C_GRAY} ────────────────────────────────────────────────────────────────────────────────────────${C_RESET}`);

// Sección de Archivos del Proyecto
fileList.forEach((f) => {
  const stmts = `${f.stmts.pct.toFixed(1)}%`;
  const branch = `${f.branches.pct.toFixed(1)}%`;
  const funcs = `${f.funcs.pct.toFixed(1)}%`;
  const lines = `${f.lines.pct.toFixed(1)}%`;
  console.log(` ${C_BLUE_BG}${f.id.padEnd(8)}${C_RESET} ${C_WHITE}${f.path.padEnd(42)}${C_RESET} ${stmts.padStart(8)} ${branch.padStart(8)} ${funcs.padStart(8)} ${lines.padStart(8)}`);
});

console.log(`${C_CYAN}└────────────────────────────────────────────────────────────────────────────────────────┘${C_RESET}\n`);