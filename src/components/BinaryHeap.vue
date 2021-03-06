<template>
  <div class="visualizer position-relative d-flex flex-column h-100">
    <div class="p-2 d-flex align-items-center border-bottom">
      <div class="text-18 text-danger"><b>{{t('Playground')}}</b></div>
      <button v-on:click="shuffle" type="button" class="btn btn-secondary btn-sm ml-auto text-nowrap">
        <b-icon-shuffle></b-icon-shuffle>
        {{t('Shuffle')}}
      </button>
      <button v-on:click="init" type="button" class="btn btn-secondary btn-sm ml-1">
        <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
        {{t('Reset')}}
      </button>
    </div>

    <div class="d-flex align-items-center p-2">
      <div class="queue mr-2">
        <div v-for="(key, i) in keys"
             class="queue__item"
             v-bind:key="key"
             v-bind:style="{ zIndex: keys.length-i }">{{ key }}
        </div>
      </div>
      <button v-on:click="addKye" type="button" class="btn btn-secondary btn-sm ml-auto text-nowrap">
        <b-icon-plus></b-icon-plus>
        {{t('Add')}}
      </button>
    </div>

    <div class="visualizer__body flex-fill"></div>

    <div class="p-4 d-flex align-items-center justify-content-center">
<!--      <button v-on:click="prevStep" type="button" class="btn btn-sm btn-secondary" :disabled="gal">-->
<!--        <b-icon-skip-start-fill></b-icon-skip-start-fill>-->
<!--        {{t('Next step')}}-->
<!--      </button>-->
      <button
          v-on:click="nextStep"
          type="button"
          class="btn btn-sm btn-danger ml-3"
          :disabled="gal">
        {{t('Next step')}}
        <b-icon-skip-end-fill></b-icon-skip-end-fill>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {BaseComponent} from '../utils/base-component'
import Component from 'vue-class-component'
import {timer} from 'rxjs'
import {random} from 'lodash'
import {BIconPlus, BIconShuffle, BIconArrowClockwise, BIconSkipStartFill, BIconSkipEndFill} from 'bootstrap-vue'

Vue.component('BIconPlus', BIconPlus);
Vue.component('BIconShuffle', BIconShuffle);
Vue.component('BIconArrowClockwise', BIconArrowClockwise);
Vue.component('BIconSkipStartFill', BIconSkipStartFill);
Vue.component('BIconSkipEndFill', BIconSkipEndFill);

declare const SVG: any;

// Diameter of Node
const D = 28;

// Radius of Node
const R = D / 2;

/**
 * Delay execution for a given number of seconds.
 * The argument may be a floating point number for subsecond precision.
 */
async function sleep(seconds: number) {
  await timer(seconds * 1000).toPromise();
}

function int(x: number) {
  return Math.floor(x);
}

class GNode {
  key: number;
  parent: GNode = null;
  history: any[] = [];
  el: any;
  circle: any;
  text: any;
  line: any;
  lc: any;

  constructor(key: number, draw: any, linesContainer: any) {
    this.key = key;
    this.lc = linesContainer;
    this.el = draw.group();

    this.circle = this.el.circle(D);
    this.circle.fill('#fff');
    this.circle.stroke({color: '#28A745', width: 2});

    this.text = this.el.plain(key);
    this.text.move(14, 3);
    this.text.font({size: 13, family: 'monospace', anchor: 'middle'});
  }

  wrong() {
    this.circle.stroke({color: 'red'})
  }

  right() {
    this.circle.stroke({color: '#28A745'})
  }

  move(x: number, y: number, animate = true) {
    this.history.push([x, y]);
    this.el.animate(animate ? null : 1).cx(x).cy(y);
    if (this.line && this.parent) {
      this.line.animate(animate ? null : 1).plot(this.x, this.y, this.parent.x, this.parent.y);
    }
  }

  get x(): number {
    const last = this.history.length - 1;
    return this.history[last][0];
  }

  get y(): number {
    const last = this.history.length - 1;
    return this.history[last][1];
  }

  lineTo(node: GNode, animate = true) {
    this.parent = node;
    this.line = this.lc.line(this.x, this.y, node.x, node.y);
    this.line.animate(animate ? null : 1).stroke({color: '#222', width: 1});
  }
}

// Use defined props by extending GreetingProps.
@Component
export default class BinaryHeap extends BaseComponent {
  keys: any = null;
  draw: any = null;
  scale = '100%';
  lineContainer: any = null;
  pq: GNode[] = null;
  gal = false; // Global animation lock
  translations = {
    ru: {
      "Playground": "Песочница",
      "Reset": "Сбросить",
      "Add": "Добавить",
      "Shuffle": "Перемешать",
      "Next step": "Следующий шаг",
    }
  }

  created(){
    this.init();
    window.addEventListener("resize", this.onWindowResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  async init(nodes?: number[]) {
    this.pq = [null];
    this.keys = [];
    this.gal = false;
    while (this.keys.length !== 20) {
      this.addKye();
    }

    if (this.draw) this.draw.remove();

    await sleep(0.1); // fix for SVG.js
    this.draw = SVG().addTo(this.$el.querySelector('.visualizer__body'));
    this.draw.width('100%');
    this.draw.height('100%');
    // this.draw.style('height', 'auto');
    this.lineContainer = this.draw.group();

    if (nodes) {
      for (const key of nodes) {
        this.add(key, false);
      }
    }
  }

  onWindowResize() {
    // pass
  }

  nextStep() {
    if (!this.keys.length) return;
    this.add(this.keys.shift());
  }

  prevStep() {
    // pass
  }

  enableGAL() {
    this.gal = true;
  }

  disableGAL() {
    this.gal = false;
  }

  async add(key: number, animate = true): Promise<any> {
    this.enableGAL();

    const node = new GNode(key, this.draw, this.lineContainer);
    this.pq.push(node);

    this.renderHeap(animate);

    // console.log(this.draw.node.getBBox());

    await sleep(.4);

    if (this.parent(node)) {
      node.lineTo(this.parent(node), animate);
      await sleep(.4);
    }

    this.swim(this.numberOfNodes());
  }

  /**
   * Recalculation of the position of all pq
   * after adding a node to the heap.
   */
  renderHeap(animate = true): void {
    const X = this.draw.node.scrollWidth / 2;
    const Y = this.draw.node.scrollHeight / 2;

    for (let i = 1; i <= this.numberOfNodes(); i++) {
      const node = this.pq[i];
      const height = this.height(node);

      /**
       * Y axis calc
       */
      let y = Y;
      y += height * D * 2;
      y -= this.height() * D;

      /**
       * X axis calc
       */
      let x = X;

      const isLeftNode = Number.isInteger(i / 2);
      const parent = this.parent(node);
      if (parent) {
        const exponent = Math.pow(2, this.numberOfLowerLevels(node) + 1) * R;
        if (isLeftNode) {
          x = parent.x - exponent;
        } else {
          x = parent.x + exponent;
        }
      }

      node.move(x, y, animate);
    }
  }

  async swim(k: number): Promise<any> {

    while (k > 1 && this.less(int(k / 2), k)) {
      const p = int(k / 2); // index of parent node

      const parent: GNode = this.pq[p];
      const target: GNode = this.pq[k];

      // Mark nodes as wrong (red circles)
      parent.wrong();
      target.wrong();
      await sleep(0.4);

      // Swap position of two nodes
      const parentLine = parent.line;
      const targetLine = target.line;
      parent.line = target.line = null;

      parent.parent = target.parent = null;

      const x = parent.x;
      const y = parent.y;
      parent.move(target.x, target.y);
      target.move(x, y);

      await sleep(0.4);

      parent.line = targetLine;
      target.line = parentLine;

      parent.parent = target;

      // Mark nodes as right (green circles)
      parent.right();
      target.right();

      // Swap inside DS
      this.exch(this.pq, k, p);

      this.updateLinks(k);
      this.updateLinks(p);

      k = p;
    }

    this.disableGAL();
  }

  updateLinks(k: number): void {
    const parent = this.pq[int(k / 2)];
    const lefChild = this.pq[k * 2];
    const rightChild = this.pq[(k * 2) + 1];

    if (parent) this.pq[k].parent = parent;
    if (lefChild) lefChild.parent = this.pq[k];
    if (rightChild) rightChild.parent = this.pq[k];
  }

  less(i: number, j: number): boolean {
    return this.pq[i].key < this.pq[j].key;
  }

  exch(arr: any[], i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  addKye(): void {
    while (true) {
      const r: number = random(100);
      if (this.keys.indexOf(r) === -1) {
        this.keys.push(r);
        return;
      }
    }
  }

  shuffle(): void {
    const N = this.keys.length;
    for (let i = 0; i < N; i++) {
      const r: number = random(i);
      this.exch(this.keys, i, r);
    }
    this.keys.reverse(); // Hack: change detection for array in Vue
  }

  zoomIn(): void {
    let width = this.draw.width();
    width = parseInt(width, 10);
    width += 10;
    this.scale = `${width}%`;
    this.draw.width(this.scale);
  }

  zoomOut(): void {
    let width = this.draw.width();
    width = parseInt(width, 10);
    width -= 10;
    this.scale = `${width}%`;
    this.draw.width(this.scale);
  }

  numberOfUpperLevels(node: GNode): number {
    let k = this.pq.indexOf(node);
    let h = 0;
    while (k > 1) {
      h = h + 1;
      k = int(k / 2);
    }
    return h;
  }

  numberOfLowerLevels(node: GNode): number {
    return this.height() - this.height(node);
  }

  /**
   * Height of Binary heap
   */
  height(node?: GNode): number {
    if (node) {
      let k = this.pq.indexOf(node);
      let h = 0;
      while (k > 1) {
        h = h + 1;
        k = int(k / 2);
      }
      return h;
    } else {
      return int(Math.log2(this.numberOfNodes()));
    }
  }

  /**
   * Number of pq in Binary heap
   */
  numberOfNodes(): number {
    return this.pq.length - 1;
  }

  /**
   * Parent of node in Binary heap
   * @param node
   */
  parent(node: GNode): GNode {
    const index = this.pq.indexOf(node);
    return this.pq[int(index / 2)];
  }
}
</script>

<style lang="scss">
.zoom-group {
  position: absolute;
  top: 45%;
  right: 10px;
}

.queue {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    display: flex;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 101;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 1));
  }

  &__item {
    $size: 30px;
    min-width: $size;
    height: $size;
    background: #fff;
    text-align: center;
    line-height: $size - 4px;
    font-size: 12px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-left: -8px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
