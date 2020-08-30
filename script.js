'use strict';

//write your code here

const tabsWrapper$ = document.querySelector('.tabs-wrapper');

tabsWrapper$.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab')) {
        return;
    }
    const { lat, lang } = e.target.dataset;
    tabsWrapper$.querySelectorAll('.tab').forEach((e) => e.classList.remove('selected'));
    e.target.classList.add('selected');
});