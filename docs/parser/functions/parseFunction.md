[**documgener**](../../README.md)

***

[documgener](../../modules.md) / [parser](../README.md) / parseFunction

# Function: parseFunction()

> **parseFunction**(`signature`): [`FunctionInfo`](../interfaces/FunctionInfo.md) \| `null`

Defined in: parser.ts:69

Разбирает сигнатуру функции C++.

## Parameters

### signature

`string`

текст сигнатуры (может быть на нескольких строках)

## Returns

[`FunctionInfo`](../interfaces/FunctionInfo.md) \| `null`

FunctionInfo или null, если это не похоже на функцию
