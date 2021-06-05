import { Heap } from './heap';

export class PrioritySumStructure {
  private sum = 0;
  private in;
  private d_in;
  private out;
  private d_out;

  constructor(
    private k: number,
    lcompare = (a: number, b: number) => a < b,
    private rcompare = (a: number, b: number) => a > b
  ) {
    this.in = new Heap(lcompare);
    this.d_in = new Heap(lcompare);
    this.out = new Heap(rcompare);
    this.d_out = new Heap(rcompare);
  }
  modify() {
    while (this.in.size() - this.d_in.size() < this.k && !this.out.empty()) {
      const p = this.out.top();
      this.out.pop();
      if (!this.d_out.empty() && p == this.d_out.top()) {
        this.d_out.pop();
      } else {
        this.sum += p;
        this.in.push(p);
      }
    }
    while (this.in.size() - this.d_in.size() > this.k) {
      const p = this.in.top();
      this.in.pop();
      if (!this.d_in.empty() && p == this.d_in.top()) {
        this.d_in.pop();
      } else {
        this.sum -= p;
        this.out.push(p);
      }
    }
    while (!this.d_in.empty() && this.in.top() == this.d_in.top()) {
      this.in.pop();
      this.d_in.pop();
    }
  }
  query() {
    return this.sum;
  }
  insert(x: number) {
    this.in.push(x);
    this.sum += x;
    this.modify();
  }
  erase(x: number) {
    if (!this.in.empty() && this.in.top() == x) {
      this.sum -= x;
      this.in.pop();
    } else if (!this.in.empty() && this.rcompare(this.in.top(), x)) {
      this.sum -= x;
      this.d_in.push(x);
    } else {
      this.d_out.push(x);
    }
    this.modify();
  }
}
