import * as vscode from 'vscode';
import { parseFunction, buildComment } from './parser';

/**
 * Вызывается VS Code при первом запуске команды плагина.
 * @param context контекст плагина (сюда складываем подписки)
 */
export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('documgener.generate', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Сначала откройте файл.');
      return;
    }
    const doc = editor.document;
    const startLine = editor.selection.active.line;

    // собираем до 6 строк, пока не встретим { или ; (сигнатура может быть на нескольких строках)
    let text = '';
    for (let i = startLine; i < Math.min(startLine + 6, doc.lineCount); i++) {
      const line = doc.lineAt(i).text;
      text += line + ' ';
      if (/[{;]/.test(line)) {
        break;
      }
    }

    const info = parseFunction(text);
    if (!info) {
      vscode.window.showErrorMessage('documgener: на этой строке не найдена функция.');
      return;
    }

    // сохраняем отступ первой строки функции
    const first = doc.lineAt(startLine);
    const indent = first.text.substring(0, first.firstNonWhitespaceCharacterIndex);

    const comment = buildComment(info, indent);
    editor.edit(builder => builder.insert(new vscode.Position(startLine, 0), comment));
  });

  context.subscriptions.push(cmd);
}

/** Вызывается при выключении плагина. */
export function deactivate() {}