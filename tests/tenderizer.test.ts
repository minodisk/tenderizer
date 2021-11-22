import { describe, expect, it } from "@jest/globals";
import { tenderize } from "../src/tenderizer";
import EasyTable from "easy-table";

describe("target", () => {
  it("dosn't allow number", () => {
    expect(() => tenderize(1 as any)).toThrowError();
  });

  it("dosn't allow string", () => {
    expect(() => tenderize("a" as any)).toThrowError();
  });

  it("dosn't allow bool", () => {
    expect(() => tenderize(true as any)).toThrowError();
  });

  it("empty", () => {
    expect(tenderize({})).toStrictEqual([]);
  });

  it("shallow", () => {
    expect(
      tenderize({
        a: 1,
        b: true,
        c: "TENERIZE",
      })
    ).toStrictEqual([
      {
        a: 1,
        b: true,
        c: "TENERIZE",
      },
    ]);
  });

  it("deep object", () => {
    expect(tenderize({ a: 1, b: { b1: "a", b2: 3 }, c: 3 })).toStrictEqual([
      {
        a: 1,
        "b.b1": "a",
        "b.b2": 3,
        c: 3,
      },
    ]);
  });

  it("deep", () => {
    expect(
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
    ).toStrictEqual([
      {
        a: 1,
        b: 2,
        "c.d": 4,
        "c.e": 5,
        "f.g.i": 10,
        "f.g.j": 11,
        "f.h.i": 12,
        "f.h.j": 13,
      },
      {
        b: 3,
        "c.d": 6,
        "c.e": 7,
        "f.g.i": 14,
        "f.g.j": 15,
        "f.h.i": 16,
        "f.h.j": 17,
      },
      { "c.d": 8, "c.e": 9 },
    ]);
  });
});

describe("prefix", () => {
  it("with shallow target", () => {
    expect(
      tenderize(
        {
          a: 1,
        },
        ["x"]
      )
    ).toStrictEqual([
      {
        "x.a": 1,
      },
    ]);
  });

  it("with deep target", () => {
    expect(
      tenderize(
        {
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
        },
        ["x"]
      )
    ).toStrictEqual([
      {
        "x.a": 1,
        "x.b": 2,
        "x.c.d": 4,
        "x.c.e": 5,
        "x.f.g.i": 10,
        "x.f.g.j": 11,
        "x.f.h.i": 12,
        "x.f.h.j": 13,
      },
      {
        "x.b": 3,
        "x.c.d": 6,
        "x.c.e": 7,
        "x.f.g.i": 14,
        "x.f.g.j": 15,
        "x.f.h.i": 16,
        "x.f.h.j": 17,
      },
      { "x.c.d": 8, "x.c.e": 9 },
    ]);
  });
});

describe("easy-table", () => {
  it("shallow", () => {
    const t = new EasyTable();
    tenderize({ a: 1, b: { b1: "a", b2: 3 }, c: 3 }).forEach((o) => {
      Object.keys(o).forEach((k) => {
        const v = o[k];
        t.cell(k, v);
      });
      t.newRow();
    });
    expect(t.toString()).toStrictEqual(
      `
a  b.b1  b.b2  c
-  ----  ----  -
1  a     3     3
`.replace(/^\n/, "")
    );
  });

  it("deep", () => {
    const t = new EasyTable();
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
    }).forEach((o) => {
      Object.keys(o).forEach((k) => {
        const v = o[k];
        t.cell(k, v);
      });
      t.newRow();
    });
    expect(t.toString()).toBe(
      `
a  b  c.d  c.e  f.g.i  f.g.j  f.h.i  f.h.j
-  -  ---  ---  -----  -----  -----  -----
1  2  4    5    10     11     12     13   
   3  6    7    14     15     16     17   
      8    9                              
`.replace(/^\n/, "")
    );
  });
});
