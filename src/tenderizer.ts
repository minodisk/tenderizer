type Struct = { [key: string]: any };
type Shallow = Array<Shallow | Struct>;
type Deep = Array<Shallow>;

export function tenderize(
  target: Struct,
  prefix: Array<string> = []
): Array<Struct> {
  const t1 = decompose(target, prefix);
  const t2 = slice(t1);
  return t2.map(compose);
}

function decompose(value: any, keys: Array<string>): Deep {
  if (Array.isArray(value)) {
    return decomposeArray(value, keys);
  }
  if (isObject(value)) {
    return decomposeObject(value, keys);
  }
  throw new Error(`target should be an object`);
}

function decomposeChild(value: any, keys: Array<string>): Shallow {
  if (Array.isArray(value)) {
    return decomposeArray(value, keys);
  }
  if (isObject(value)) {
    const t = decomposeObject(value, keys);
    return [compose(t)];
  }
  return [{ [keys.join(".")]: value }];
}

function decomposeArray(arr: Array<any>, keys: Array<string>): Deep {
  return arr.map((v) => decomposeChild(v, keys));
}

function decomposeObject(obj: Struct, keys: Array<string>): Deep {
  return Object.keys(obj).map((k) => decomposeChild(obj[k], [...keys, k]));
}

function slice(deep: Deep): Deep {
  const res = [];
  for (let i = 0; i < deep.length; i++) {
    const s = deep[i];
    for (let j = 0; j < s.length; j++) {
      if (res[j] == null) {
        res[j] = [s[j]];
      } else {
        res[j].push(s[j]);
      }
    }
  }
  return res;
}

function compose(shallow: Shallow): Struct {
  return shallow
    .flatMap((el) => {
      if (Array.isArray(el)) {
        return compose(el);
      } else {
        return el;
      }
    })
    .reduce((obj, o) => ({ ...obj, ...o }), {});
}

function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
