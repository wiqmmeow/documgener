[**documgener**](../../README.md)

***

[documgener](../../modules.md) / [parser](../README.md) / splitParams

# Function: splitParams()

> **splitParams**(`raw`): `string`[]

Defined in: parser.ts:21

Делит строку параметров по запятым, но не трогает запятые внутри <...>, (...), [...].
Например "std::map<int, int>& m, int k" -> ["std::map<int, int>& m", "int k"].

## Parameters

### raw

`string`

строка между скобками функции

## Returns

`string`[]

массив отдельных параметров
