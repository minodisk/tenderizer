type Struct = { [key: string]: any };
type Shallow = Array<Shallow | Struct>;
type Deep = Array<Shallow>;

export function tenderize(
  target: Struct,
  prefix: Array<string> = []
): Array<Struct> {
  return slice(decompose(target, prefix)).map(compose);
}

function decompose(value: Struct, keys: Array<string>): Deep {
  if (isObject(value)) {
    return decomposeObject(value, keys);
  }
  throw new Error(`target isn't an object`);
}

function decomposeChild(
  value: any,
  keys: Array<string>,
  isParentArray: boolean = false
): Shallow {
  if (isObject(value)) {
    return [compose(decomposeObject(value, keys))];
  }
  if (Array.isArray(value)) {
    return decomposeArray(value, keys, isParentArray);
  }
  return [{ [keys.join(".")]: value }];
}

function decomposeArray(
  arr: Array<any>,
  keys: Array<string>,
  isParentArray: boolean = false
): Deep {
  if (isParentArray) {
    return arr.map((v, i) => decomposeChild(v, [...keys, `${i}`], true));
  } else {
    return arr.map((v) => decomposeChild(v, keys, true));
  }
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
  return (
    !Array.isArray(obj) &&
    Object.prototype.toString.call(obj) === "[object Object]"
  );
}
