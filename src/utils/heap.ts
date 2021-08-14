export class Heap {
  private node: number[] = [];
  private index: Record<number, undefined | Set<number>> = [];
  constructor(private compare = (x: number, y: number) => x < y) {}
  push(...values: number[]) {
    for (const value of values) {
      this.node[this.node.length] = value;
      if (!this.index[value]) {
        this.index[value] = new Set();
      }
      this.index[value]?.add(this.node.length - 1);
      this.upheap();
    }
  }
  top() {
    return this.node[0];
  }
  size() {
    return this.node.length;
  }
  empty() {
    return this.node.length === 0;
  }
  pop() {
    const res = this.node[0];
    this.swap(0, this.node.length - 1); // 末尾要素を根に持ってくる
    this.index[res]?.delete(this.node.length - 1);
    this.node.splice(this.node.length - 1, 1); // 末尾要素の削除

    this.downheap();
    return res;
  }
  private swap(a: number, b: number) {
    this.index[this.node[a]]?.delete(a);
    this.index[this.node[b]]?.delete(b);

    const tmp = this.node[a];
    this.node[a] = this.node[b];
    this.node[b] = tmp;

    if (!this.index[this.node[a]]) {
      this.index[this.node[a]] = new Set();
    }
    if (!this.index[this.node[b]]) {
      this.index[this.node[b]] = new Set();
    }
    this.index[this.node[a]]?.add(a);
    this.index[this.node[b]]?.add(b);
  }
  private upheap() {
    let x = this.node.length - 1,
      parent = 0 | ((x - 1) / 2); // 現在のノードと親ノード
    while (x > 0 && this.compare(this.node[parent], this.node[x])) {
      // 親ノードと現在のノードを入れ替える
      this.swap(x, parent);

      x = parent;
      parent = 0 | ((x - 1) / 2);
    }
  }
  private downheap() {
    let x = 0,
      left = x * 2 + 1,
      right = x * 2 + 2; // 右の子
    const length = this.node.length,
      comp = this.compare;
    const swapped =
      (left < length && comp(this.node[x], this.node[left])) ||
      (right < length && comp(this.node[x], this.node[right]));
    while (
      (left < length && comp(this.node[x], this.node[left])) ||
      (right < length && comp(this.node[x], this.node[right]))
    ) {
      const max =
        right < length && comp(this.node[left], this.node[right])
          ? right
          : left; // 右の子がないことがあるため、このようにした
      // 比較関数により、より"大きい"とされた方と入れ替える
      this.swap(x, max);

      x = max;
      left = x * 2 + 1;
      right = x * 2 + 2;
    }
    return swapped;
  }
}
