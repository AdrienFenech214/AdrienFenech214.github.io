//Simon Goetz 11/09/2018
//Initialize modals and tabs with no options
var cards = document.getElementsByClassName('card');
function select(category) {
    console.log(category);
    var isAll = (category === '*') ? 1 : 0;
    var _loop_1 = function (i) {
        var classes = Array.from(cards[i].classList);
        if (classes.includes("category_" + category) || isAll === 1) {
            cards[i].parentNode.classList.remove('scale-out');
            setTimeout(function () {
                cards[i].parentNode.classList.remove('hide');
            }, 250);
        }
        else {
            cards[i].parentNode.classList.add('scale-out');
            setTimeout(function () {
                cards[i].parentNode.classList.add('hide');
            }, 200);
        }
    };
    for (var i = 0; i < cards.length; i++) {
        _loop_1(i);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
    var chooseCommunity = document.querySelector("#chooseCommunity");
    chooseCommunity.addEventListener("change", function (e) {
        select(chooseCommunity.value);
    });
});
