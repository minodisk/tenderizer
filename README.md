![Tenderizer](./tenderizer.svg)

---

Slice a deep object into multiple shallow objects.

[![codecov](https://img.shields.io/codecov/c/github/minodisk/tenderizer/main?style=flat-square&token=8ShEV6U5i2)](https://codecov.io/gh/minodisk/tenderizer)[![npm](https://img.shields.io/npm/v/tenderizer?style=flat-square)](https://www.npmjs.com/package/tenderizer)

## Installation

```bash
npm i tenderizer
```

## Usage

```typescript
import { tenderize } from "tenderizer";

console.log(
  tenderize({
    a: 1,
    b: [2, 3],
    c: [
      { d: 4, e: 5 },
      { d: 6, e: 7 },
      { d: 8, e: 9 },
    ],
    f: [
      { g: { i: 10, j: 11 }, h: { i: 12, j: 13 } },
      { g: { i: 14, j: 15 }, h: { i: 16, j: 17 } },
    ],
  })
);
// Output:
// [
//   {
//     a: 1,
//     b: 2,
//     "c.d": 4,
//     "c.e": 5,
//     "f.g.i": 10,
//     "f.g.j": 11,
//     "f.h.i": 12,
//     "f.h.j": 13,
//   },
//   {
//     b: 3,
//     "c.d": 6,
//     "c.e": 7,
//     "f.g.i": 14,
//     "f.g.j": 15,
//     "f.h.i": 16,
//     "f.h.j": 17,
//   },
//   { "c.d": 8, "c.e": 9 },
// ]
```
