"use strict";
var triptych = new Vue({
    el: '#triptych',
    data: {
        leftHidden: JSON.parse(localStorage.getItem('triptych') || '{}').leftHidden,
        centerHidden: JSON.parse(localStorage.getItem('triptych') || '{}').centerHidden,
        rightHidden: JSON.parse(localStorage.getItem('triptych') || '{}').rightHidden,
    },
    created: function () {
        if (this.leftHidden)
            this.hideLeft(false);
        if (this.centerHidden)
            this.hideCenter(false);
        if (this.rightHidden)
            this.hideRight(false);
    },
    methods: {
        hideLeft: function (saveState = true) {
            if (saveState) {
                this.leftHidden = !this.leftHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.leftHidden = this.leftHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(1)');
            if (this.leftHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideCenter: function (saveState = true) {
            if (saveState) {
                this.centerHidden = !this.centerHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.centerHidden = this.centerHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(2)');
            if (this.centerHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideRight: function (saveState = true) {
            if (saveState) {
                this.rightHidden = !this.rightHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.rightHidden = this.rightHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(3)');
            if (this.rightHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        }
    }
});

/**
 * Change all active tabs on selected snippet language
 */
$('input[type="radio"]').on('change', function (event) {
    if (!event.target.id.startsWith('__tabbed')) return;
    var label = event.target.nextElementSibling; // HTMLLabelElement
    $('label').each(function(i, el){
        if (label === el) return;
        if (!el.htmlFor.startsWith('__tabbed')) return;
        if (el.innerText !== label.innerText) return;
        $(el).prev().prop("checked", true);
    });
});