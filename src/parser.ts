/** Один параметр функции. */
export interface Param {
  type: string;      // например "const std::vector<int>&"
  name: string;      // например "v"
  direction: string; // "in" или "in,out"
}

/** Результат разбора сигнатуры функции. */
export interface FunctionInfo {
  returnType: string;
  name: string;
  params: Param[];
}

/**
 * Делит строку параметров по запятым, но не трогает запятые внутри <...>, (...), [...].
 * Например "std::map<int, int>& m, int k" -> ["std::map<int, int>& m", "int k"].
 * @param raw строка между скобками функции
 * @returns массив отдельных параметров
 */
export function splitParams(raw: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of raw) {
    if (ch === '<' || ch === '(' || ch === '[') {
      depth++;
    }
    if (ch === '>' || ch === ')' || ch === ']') {
      depth--;
    }
    if (ch === ',' && depth === 0) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim() !== '') {
    result.push(current.trim());
  }
  return result;
}

/**
 * Разбирает один параметр: отделяет тип от имени и определяет направление.
 * @param text текст параметра, например "const int& x = 5"
 * @returns объект Param или null, если разобрать не удалось
 */
export function parseParam(text: string): Param | null {
  const noDefault = text.split('=')[0].trim(); // убираем значение по умолчанию
  const m = noDefault.match(/^(.*?)([A-Za-z_]\w*)\s*(\[\s*\])?$/);
  if (!m) {
    return null;
  }
  const type = (m[1] + (m[3] ?? '')).trim();
  const name = m[2];
  const isConst = /\bconst\b/.test(type);
  const isRefOrPtr = /[&*]/.test(type) || m[3] !== undefined;
  const direction = isRefOrPtr && !isConst ? 'in,out' : 'in';
  return { type, name, direction };
}

/**
 * Разбирает сигнатуру функции C++.
 * @param signature текст сигнатуры (может быть на нескольких строках)
 * @returns FunctionInfo или null, если это не похоже на функцию
 */
export function parseFunction(signature: string): FunctionInfo | null {
  // берём текст только до { или ;
  const head = signature.split(/[{;]/)[0].replace(/\s+/g, ' ').trim();
  const m = head.match(/^(.*?)\s*([A-Za-z_~][\w:]*)\s*\((.*)\)\s*(?:const)?$/);
  if (!m) {
    return null;
  }
  const params: Param[] = [];
  for (const raw of splitParams(m[3])) {
    if (raw === 'void') {
      continue;
    }
    const p = parseParam(raw);
    if (p) {
      params.push(p);
    }
  }
  return { returnType: m[1].trim(), name: m[2], params };
}

/**
 * Собирает текст Doxygen-комментария.
 * @param info разобранная функция
 * @param indent отступ, который нужно добавить к каждой строке
 * @returns готовый комментарий с переводом строки в конце
 */
export function buildComment(info: FunctionInfo, indent: string): string {
  const lines: string[] = ['/**', ` * @brief TODO: описание функции ${info.name}`, ' *'];
  for (const p of info.params) {
    lines.push(` * @param[${p.direction}] ${p.name} Описание параметра (${p.type})`);
  }
  if (info.returnType !== '' && info.returnType !== 'void') {
    lines.push(` * @return Описание (${info.returnType})`);
  }
  lines.push(' */');
  return lines.map(l => indent + l).join('\n') + '\n';
}