import { describe, expect, it } from "@jest/globals";
import { tenderize } from "../src/tenderizer";
import EasyTable from "easy-table";

describe("tenderize", () => {
  describe("parameter: target", () => {
    it("dosn't allow number", () => {
      expect(() => tenderize(1 as any)).toThrowError();
    });

    it("dosn't allow string", () => {
      expect(() => tenderize("a" as any)).toThrowError();
    });

    it("dosn't allow bool", () => {
      expect(() => tenderize(true as any)).toThrowError();
    });

    it("dosn't allow array", () => {
      expect(() => tenderize([])).toThrowError();
    });

    it("empty", () => {
      expect(tenderize({})).toStrictEqual([]);
    });

    it("shallow object", () => {
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

    it("nested object", () => {
      expect(tenderize({ a: 1, b: { b1: "a", b2: 3 }, c: 3 })).toStrictEqual([
        {
          a: 1,
          "b.b1": "a",
          "b.b2": 3,
          c: 3,
        },
      ]);
    });

    it("object with shallow array", () => {
      expect(
        tenderize({
          a: [1, 2],
        })
      ).toStrictEqual([{ a: 1 }, { a: 2 }]);
    });

    // it("object with nested array", () => {
    //   expect(
    //     tenderize({
    //       a: [
    //         [4, 5],
    //         [6, 7],
    //       ],
    //     })
    //   ).toStrictEqual([
    //     { "a.0": 4, "a.1": 5 },
    //     { "a.0": 6, "a.1": 7 },
    //   ]);
    // });

    it("object with object array", () => {
      expect(
        tenderize({
          a: [
            {
              b: 1,
              c: 2,
            },
            {
              b: 3,
              c: 4,
            },
          ],
        })
      ).toStrictEqual([
        { "a.b": 1, "a.c": 2 },
        { "a.b": 3, "a.c": 4 },
      ]);
    });

    it("complex", () => {
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
          k: {
            l: {
              m: 18,
              n: {
                o: 19,
                p: 20,
              },
            },
          },
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
          "k.l.m": 18,
          "k.l.n.o": 19,
          "k.l.n.p": 20,
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

  describe("paramter: prefix", () => {
    it("without prefix", () => {
      expect(
        tenderize({
          a: 1,
        })
      ).toStrictEqual([
        {
          a: 1,
        },
      ]);
    });

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

    it("with long prefix", () => {
      expect(
        tenderize(
          {
            a: 1,
          },
          ["x", "y", "z"]
        )
      ).toStrictEqual([
        {
          "x.y.z.a": 1,
        },
      ]);
    });
  });

  describe("with easy-table", () => {
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
});
