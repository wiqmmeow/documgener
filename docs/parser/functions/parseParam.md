[**documgener**](../../README.md)

***

[documgener](../../modules.md) / [parser](../README.md) / parseParam

# Function: parseParam()

> **parseParam**(`text`): [`Param`](../interfaces/Param.md) \| `null`

Defined in: parser.ts:50

Разбирает один параметр: отделяет тип от имени и определяет направление.

## Parameters

### text

`string`

текст параметра, например "const int& x = 5"

## Returns

[`Param`](../interfaces/Param.md) \| `null`

объект Param или null, если разобрать не удалось
