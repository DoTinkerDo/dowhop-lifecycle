// "use strict";

// // adapted from http://git.io/blingjs
// var $ = document.querySelectorAll.bind(document);

// Node.prototype.on = window.on = function (name, fn) {
//   this.addEventListener(name, fn);
//   return this;
// };

// NodeList.prototype.__proto__ = Array.prototype;

// NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
//   this.forEach(function (el) {
//     el.on(name, fn);
//   });
//   return this;
// };
// // end of bling.js ----

// var target = null;

// var tabs = $('.tab').on('click',  function() {
//   target = $(this.hash)[0];
//   console.log(target);
//   target.id = ''; //commented to check if fixes error message cannot set prop of undefined, when clicking a tab twice.
//   if (location.hash === this.hash) {
//     setTimeout(update)
//   }
// }).map(function(el) {
//   el.tabindex = 0;
//   return el;
// });

// var targets = tabs.map(function(el) {
//   return el.hash;
// });

// var panels = $(targets.join(', '))
//   .map(function(el) {
//     el.dataset.old = el.id;
//     return el;
//   });

function update() {
  console.log('something changed')
  // if (target) {
  //   target.id = target.dataset.old;
  //   target = null;
  // }

  // var hash = window.location.hash;
  // if (targets.indexOf(hash) !== -1) {
  //   return show(hash);
  // }
  // if (!hash) {
  //   show();
  // }
}

// function show(id) {
//   if (!id) {
//     id = targets[0];
//   }
//   tabs.forEach(function(el) {
//     var match = el.hash === id;
//     el.classList[match ? 'add' : 'remove']('selected');
//     el.setAttribute('aria', match);
//   });

//   panels.forEach(function(el) {
//     var match = '#' + el.id === id;
//     el.style.display = match ? '' : 'none';
//     el.setAttribute('aria-hidden', !match);
//   });
// }

window.addEventListener('hashchange', update);

// if (targets.indexOf(window.location.hash) !== -1) {
//  update();
// } else {
//   show();
// }
