declare var Vue: any;
declare var rxjs: any;

function int(x) {
    return Math.floor(x);
}

class GNode {
    key: number;
    x: number;
    y: number;
    left: GNode;
    right: GNode;
    parent: GNode;
    canvas: HTMLElement;
    nativeElement: HTMLElement;
    constructor(key: number, x, y, canvas: HTMLElement) {
        this.key = key;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        const el = document.createElement('div');
        el.classList.add('node');
        el.innerHTML = this.key.toString();
        el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.nativeElement = el;
        this.render();
    }
    render() {
        this.canvas.appendChild(this.nativeElement);
    }
}

var visualizer = new Vue({
    el: '#visualizer',
    data: {
        value: 0,
        playing: false,
        keys: [],
        zoom: 1,
        nodes: [null],
        options: {
            dotSize: 14,
            width: 'auto',
            height: 4,
            contained: false,
            direction: 'ltr',
            data: null,
            min: 0,
            max: 10,
            interval: 1,
            disabled: false,
            clickable: true,
            duration: 0.5,
            adsorb: true,
            lazy: false,
            tooltip: 'active',
            tooltipPlacement: 'top',
            tooltipFormatter: void 0,
            useKeyboard: false,
            keydownHook: null,
            dragOnClick: false,
            enableCross: true,
            fixed: false,
            minRange: void 0,
            maxRange: void 0,
            order: true,
            marks: false,
            dotOptions: void 0,
            process: true,
            dotStyle: void 0,
            railStyle: void 0,
            processStyle: void 0,
            tooltipStyle: void 0,
            stepStyle: void 0,
            stepActiveStyle: void 0,
            labelStyle: void 0,
            labelActiveStyle: void 0,
        }
    },
    created: function () {
        this.reloadState();
        // this.play();
    },
    methods: {
        play: async function() {
            this.playing = !this.playing;
            while (this.keys.length) {
                if (!this.playing) return;
                this.addGNode(this.keys.shift());
                await rxjs.timer(1000).toPromise();
            }
        },
        nextStep: function() {
            this.addGNode(this.keys.shift());
        },
        addGNode: function(key: number) {
            const canvas: HTMLElement = document.querySelector('.visualizer__body__container');
            let x, y = 0;
            if (this.numberOfNodes() === 0) {
                x = canvas.offsetWidth / 2;
                y = canvas.offsetHeight / 2;
            } else {

            }
            const node = new GNode(key, x, y, canvas);
            this.nodes.push(node);
        },
        addKye: function() {
            while (true) {
                const r = window['randint'](0, 101);
                if (this.keys.indexOf(r) === -1) {
                    this.keys.push(r);
                    return;
                }
            }
        },
        reloadState: function() {
            this.keys = [];
            while (this.keys.length !== 10) {
                this.addKye();
            }
        },
        shuffle: function() {
            const N = this.keys.length;
            for (let i = 0; i < N; i++) {
                const r = window['randint'](0, i + 1);
                this.exch(this.keys, i ,r);
            }
            this.keys.reverse();
        },
        zoomIn: function() {
            if (this.zoom === 1) return;
            this.zoom += 0.1;
        },
        zoomOut: function() {
            if (this.zoom === 0.1) return;
            this.zoom -= 0.1;
        },
        resetZoom: function () {
            this.zoom = 1;
        },
        exch: function(arr, i, j) {
            const v = arr[i]
            arr[i] = arr[j];
            arr[j] = v;
        },
        /**
         * Height of Binary heap
         */
        height: function (node?: GNode) {
            if (node) {
                const index = this.nodes.indexOf(node)
                while (false) {

                }
            } else {
                return int(Math.log2(this.numberOfNodes()));
            }
        },
        /**
         * Number of nodes in Binary heap
         */
        numberOfNodes: function () {
            return this.nodes.length - 1;
        },
        /**
         * Parent of node in Binary heap
         * @param node
         */
        parent: function (node: GNode) {
            const index = this.nodes.indexOf(node);
            return this.nodes[int(index / 2)];
        }
    },
    components: {
        'vueSlider': window[ 'vue-slider-component' ],
    }
})

