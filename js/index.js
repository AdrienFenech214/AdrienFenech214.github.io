//Simon Goetz 11/09/2018
//Initialize modals and tabs with no options
var _smart_delay = {
    INSTANT: 0,
    //FAST: 750,      // Date
    FAST: 250,
    SLOW: 1500 // Number / Free / Area
};
var timeout_ref = [];
document.addEventListener('DOMContentLoaded', function () {
    E._O('#newsletterSubmit').onclick = function () {
        E._O('#newsletterSubmit').classList.add('disabled');
        var obj = {
            firstname: E._O('#first_name').value.trim(),
            lastname: E._O('#last_name').value.trim(),
            email: E._O('#email').value.trim()
        };
        if (obj.firstname.length > 0 && obj.lastname.length > 0 && obj.email.length > 0) {
            E._post('/subscribe', obj, function (err) {
                if (err) {
                    E._O('#newsletterSubmit').classList.remove('disabled');
                    M.toast({ html: 'An error occured !' });
                    return console.error(err);
                }
                E._O('#newsletterSubmit').classList.remove('disabled');
                E._O('#newsletterSubmit').classList.add('green');
                E._O('#newsletterSubmit').innerHTML = '';
                E._create('i', 'check_circle_outline', 'material-icons white-text', null, E._O('#newsletterSubmit'));
                E._O('#newsletterSubmit').onclick = function () { };
            });
        }
    };
    var searchInput = E._O('#search');
    searchInput.oninput = function () {
        if (searchInput.value.trim().length === 0) {
            searchInput.removeAttribute('style');
        }
        else {
            searchInput.setAttribute('style', 'background-color: white !important');
        }
        clearTimeout(timeout_ref[searchInput.getAttribute('id')]);
        timeout_ref[searchInput.getAttribute('id')] = setTimeout(function () {
            E._post('/search', { name: searchInput.value.trim() }, function (err, array) {
                var containerInstance = E._new_dynamic_result_container(E._O('#nav_search'));
                if (err) {
                    return; // console.error(err);
                }
                array = array.splice(0, 5);
                array.forEach(function (e) {
                    var childParent = containerInstance.getNewChildRowWithImg('/search/' + e.key);
                    childParent.img.setAttribute('src', e.logo_link);
                    E._create('p', toTitleCase(e.name || ''), 'col s12 m6 l4 title trunc', null, childParent.elt);
                    E._create('p', toTitleCase(e.sector), 'col s4 m6 l4 hide-on-small-only trunc', null, childParent.elt);
                    var wrapper = E._create('div', null, 'col s4 right-align valign-wrapper hide-on-med-and-down', null, childParent.elt);
                    E._create('p', e.location, 'font-small trunc', null, wrapper);
                    //E._create('i', 'check_circle', 'material-icons', null, wrapper);
                    /*
                        Ranked: check_circle
                        Not ranked: cancel
                        Pending: watch_later
                    */
                });
            });
        }, _smart_delay.INSTANT);
    };
    E._get('https://platform.estimeo.com/website/latestRecords', function (err, arr) {
        if (err) {
            return console.error(err);
        }
        var parent = E._O('#latestRecords');
        /**
         *
         //each rank in rankings
         tr(onclick="document.location.href='/search/" + rank.href + "'")
             td
                 img(src="/img/partners/" + rank.img, alt="")
             td
                 each sector in rank.sector
                     span.badge.blue-grey.darken-1.white-text #{sector}
             td #{rank.pays}
             td
                 a.btn(href="/search/" + rank.href)
                     i.material-icons check_circle
         */
        (arr || []).forEach(function (obj) {
            var tr = E._create('tr', null, null, { onclick: "document.location.href='/search/" + obj.key + "'" }, parent);
            var td_img = E._create('td', null, null, null, tr);
            E._create('img', null, null, { src: obj.logo_link, alt: "" }, td_img);
            var td_sector = E._create('td', null, null, null, tr);
            E._create('span', obj.sector, 'badge blue-grey darken-1 white-text', null, td_sector);
            E._create('td', obj.location, null, null, tr);
            var td_a = E._create('td', null, null, null, tr);
            var a = E._create('a', null, null, { href: "/search/" + obj.key }, td_a);
            E._create('i', 'open_in_new', 'material-icons', null, a);
        });
    });
    /*
    ANIMATIONS
    */
    //var energy-origin = document.querySelectorAll("[id^='Energy_Circle']");
    //all tweens run in direct succession
    var theTimeline = new TimelineLite();
    // RESET
    TweenLite.set("#mainhead__title", { opacity: 1 });
    TweenLite.set("#mainhead__baseline", { opacity: 1 });
    TweenLite.set("#mainhead__data-1", { opacity: 0, y: 220 });
    TweenLite.set("#mainhead__data-2", { opacity: 0, y: 220 });
    TweenLite.set("#mainhead__data-3", { opacity: 0, y: 220 });
    TweenLite.set("#mainhead__data-4", { opacity: 0, y: 220 });
    //TweenLite.set("#main__customers-1",{opacity:0});
    //TweenLite.set("#main__customers-2",{opacity:0});
    //TweenLite.set("#main__customers-3",{opacity:0});
    //TweenLite.set("#main__customers-4",{opacity:0});
    TweenLite.set("#main__offerStartup img", { opacity: 0, x: -600 });
    TweenLite.set("#main__offerIncubator img", { opacity: 0, x: 600 });
    TweenLite.set("#main__offerInvestor img", { opacity: 0, x: -600 });
    TweenLite.set("#main__offerBank img", { opacity: 0, x: 600 });
    theTimeline
        // INIT
        .to("#mainhead__title", 2, { opacity: 1 })
        .to("#mainhead__baseline", 0, { opacity: 1 })
        // ANIMATE
        /*.to("#mainhead__title", 0.4, {opacity:1})*/
        /*.to("#mainhead__baseline", 0.4, {opacity:1})*/
        .to("#mainhead__data-1", 0.4, { opacity: 1, y: 0 })
        .to("#mainhead__data-2", 0.4, { opacity: 1, y: 0 })
        .to("#mainhead__data-3", 0.4, { opacity: 1, y: 0 })
        .to("#mainhead__data-4", 0.4, { opacity: 1, y: 0 });
    /*
    SCROLL ANIMATION
    */
    var tlMainCustomers = new TimelineMax();
    tlMainCustomers
        .to("#main__customers-1", 0.4, { opacity: 1 })
        .to("#main__customers-2", 0.4, { opacity: 1 })
        .to("#main__customers-3", 0.4, { opacity: 1 })
        .to("#main__customers-4", 0.4, { opacity: 1 });
    var scrollController = new ScrollMagic.Controller();
    var scrollCustomers = new ScrollMagic.Scene({
        triggerElement: "#main__customers",
        offset: -200
    })
        .setTween(tlMainCustomers)
        /*.addIndicators()*/
        .addTo(scrollController);
    var scrollOfferStartup = new ScrollMagic.Scene({
        triggerElement: "#main__offerStartup"
    })
        .setTween("#main__offerStartup img", 0.4, { opacity: 1, x: 0 })
        /*.addIndicators()*/
        .addTo(scrollController);
    var scrollOfferIncubator = new ScrollMagic.Scene({
        triggerElement: "#main__offerIncubator"
    })
        .setTween("#main__offerIncubator img", 0.4, { opacity: 1, x: 0 })
        /*.addIndicators()*/
        .addTo(scrollController);
    var scrollOfferInvestor = new ScrollMagic.Scene({
        triggerElement: "#main__offerInvestor"
    })
        .setTween("#main__offerInvestor img", 0.4, { opacity: 1, x: 0 })
        /*.addIndicators()*/
        .addTo(scrollController);
    var scrollOfferInvestor = new ScrollMagic.Scene({
        triggerElement: "#main__offerBank"
    })
        .setTween("#main__offerBank img", 0.4, { opacity: 1, x: 0 })
        /*.addIndicators()*/
        .addTo(scrollController);
});
function getToast(name, logo_link) {
    return '<div class="valign-wrapper">' +
        '<img src="' + logo_link + '", style="max-width: 48px; max-height: 48px;"/>' +
        '<h1 style="font-size: 2rem; margin: 0 0 0 10px;">' + toTitleCase(name) + '</h1>' +
        '</div>';
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
