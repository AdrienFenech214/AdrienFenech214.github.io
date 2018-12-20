const E = {
    _fr: function() {
        E._get('/fr', function() {
            location.reload();
        });
    },
    _en: function() {
        E._get('/en', function() {
            location.reload();
        });
    },
    _get: function (url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(null);

        xhr.onloadend = function () {
            const response = JSON.parse(xhr.response);
            return cb(response.err, response.obj, response.status, response.message);
        };
    },

    _post: function (url, obj, cb, withCredentials) {
        const xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        /**
         * !important
         */
        if (withCredentials) {
            xhr.withCredentials = true;
        }

        xhr.send(JSON.stringify(obj));

        xhr.onloadend = function () {
            const response = JSON.parse(xhr.response);
            return cb(response.err, response.obj, response.status, response.message);
        };
    },

    _create: function (tag, innerHTML, className, attributes, parentDom) {
        const e = document.createElement(tag || 'div');
        if (innerHTML != null) {
            e.innerHTML = innerHTML;
        }
        if (className != null) {
            e.className = className;
        }
        if (attributes != null) {
            Object.keys(attributes).forEach(function (key) {
                e.setAttribute(key, attributes[key]);
            });
        }
        if (parentDom != null) {
            parentDom.appendChild(e);
        }
        return e;
    },

    _O: function (s) {
        function O_O() {
            return E._create('div', '', 'hide', null, document.body);
        }

        if (s.startsWith('#')) {
            const elt = document.getElementById(s.slice(1, s.length));
            if (elt)
                return elt;
            return O_O();
        } else if (s.startsWith('.')) {
            return document.getElementsByClassName(s);
        }
        return O_O();
    },

    _: function (s) {
        function O_O() {
            return E._create('div', '', 'hide', null, document.body);
        }

        if (s.startsWith('#')) {
            const elt = document.getElementById(s.slice(1, s.length));
            if (elt)
                return elt;
            return O_O();
        } else if (s.startsWith('.')) {
            return document.getElementsByClassName(s);
        }
        return O_O();
    },

    _new_dynamic_result_container: function(parent, dataToLoad) {
        const id = '_' + parent.getAttribute('id') + '_container';

        // Delete the old container if exist
        const old_container = E._O('#' + id);
        old_container.parentNode.removeChild(old_container);
        // Create container
        const container = E._create('div', null, 'dynamic-container z-depth-2', { id: id, style: '' }, document.body);
        
        // Close the suggest container 
        const closeBtn = parent.querySelector(".close");
        closeBtn.addEventListener("click", function( event ){
            container.style.display = "none";
        });
        const searchInput = parent.querySelector("#search");
        /*searchInput.addEventListener("blur", function( event ) {
            setTimeout(function(){ container.style.display = "none" },100)
        });*/

        // Get the coordinate of the parent element
        const rect = parent.getBoundingClientRect();
        // Apply the coordinate of parent to the container
        container.style.position = "absolute";
        container.style.left = (rect.left + document.body.scrollLeft + document.documentElement.scrollLeft) + 'px';
        container.style.right = (rect.right + document.body.scrollLeft + document.documentElement.scrollLeft) + 'px';
        container.style.top = (rect.bottom + document.body.scrollTop + document.documentElement.scrollTop) + 'px';
        //container.style.height = '100px';
        container.style.zIndex = '9999';
        container.style.width = (rect.right - rect.left) + 'px';

        container['getNewChildRow'] = function() {
            //return E._create('div', null, 'col s12 no-padding', null, wrapper);
            return E._create('a', null, 'child', { href: '#!' }, container);
        };

        container['getNewChildRowWithImg'] = function(link) {
            document.getElementById("search_bar").setAttribute("action", link);
            const row = E._create('a', null, 'child row', { href: link }, container);
            const sub_row = E._create('div', null, 'col s12 sub-child valign-wrapper no-padding', null, row);
            //return E._create('div', null, 'col s12 no-padding', null, wrapper);
            const imgWrapper = E._create('div', null, 'col img-wrapper valign-wrapper', null, sub_row);
            const img = E._create('img', null, null, null, imgWrapper);
            const elt = E._create('div', null, 'col s12', null, sub_row);

            return {
                a: row,
                img: img,
                elt: elt
            }
        };

        container['destroy'] = function() {
            container.parentNode.removeChild(container);
        };

        (dataToLoad || []).forEach(function(e) {
            const obj = container.getNewChildRowWithImg();
            obj.img.setAttribute('src', e.img);
            E._create('p', e.text || '', 'col s12', null, obj.elt);
        });

        return container;
    },

    Notify(ntfy, options) {
        if (!options) {
            options = {
                class: '',
                cancellable: true,
            };
        }

        if (options.cancellable == null) {
            options['cancellable'] = true;
        }

        const id = 'id_' + Math.round((Math.random() * 100000)).toString();

        function show() {
            const cancellableDom =
                options.cancellable ?
                    '<a class="ntfy-cancel" id="cancel_' + id + '">' +
                    '<i class="material-icons">clear</i>' +
                    '</a>'
                    : '';

            const html =
                '<div id="' + id + '">' +
                cancellableDom +
                '<div class="valign-wrapper">' +
                '<i class="material-icons">' + ntfy.icon + '</i>' +
                '<div>' +
                '<span class="title">' + ntfy.title + '</span>' +
                '<br />' +
                '<div class="text">' + ntfy.body + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            M.toast({
                html: html,
                displayLength: options.length || 60000,
                inDuration: 800,
                outDuration: 800,
                activationPercent: options.cancellable ? 0.8 : 999,
                classes: 'ntfy-panel ' + options.class,
                completeCallback: options.completeCallback || function () {
                }
            });

            if (options.cancellable) {
                E._('#cancel_' + id).onclick = function () {
                    const toastInstance = M.Toast.getInstance(E._('#' + id).parentNode);
                    toastInstance.dismiss();
                };
            }

            if (options.custom) {
                E._('#' + id).appendChild(options.custom);
            }
        }

        if (options.delay && options.delay > 0) {
            setTimeout(show, options.delay);
        } else {
            show();
        }

        return {
            dismiss: function (onDismiss) {
                const toastInstance = M.Toast.getInstance(E._('#' + id).parentNode);
                if (toastInstance) {

                    if (onDismiss) {
                        const mutationObserver = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                onDismiss();
                            });
                        });
                        mutationObserver.observe(E._('#' + id).parentNode, {
                            attributes: false,
                            characterData: false,
                            childList: true,
                            subtree: true,
                            attributeOldValue: false,
                            characterDataOldValue: false
                        });
                    }

                    toastInstance.dismiss();
                }
            }
        };
    },
    
    goTo: function(url, queries) {
        /*$('body').animate({ opacity: '0' }, 1000, 'easeInOutQuart', function() {*/
            var form = document.createElement('form');
            form.method = 'GET';
            form.action = url;

            if (queries) {
                for (var i = 0; i < queries.length; i++) {
                    var query = queries[i];
                    var input = document.createElement('input');
                    input.setAttribute('name', query.name);
                    input.setAttribute('value', query.value);
                    form.appendChild(input);
                }
            }


            var button = document.createElement("input");
            button.setAttribute('type', "submit");
            form.appendChild(button);
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();

            /*setTimeout(function() { $('body').animate({ opacity: '1' }, 500, 'easeInOutQuart'); }, 1000);*/
        /*});*/
    },
    
    fastSignup: function() {

        const emailRegExp = new RegExp('^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
        const emailInput = E._O('#email');

        const obj = { email: '', set_code: 'code_basic', from: window.location.hostname + window.location.pathname };

        if (!emailRegExp.test(emailInput.value.replace(/\s/g,'')))
            return;
        else
            obj.email = emailInput.value.replace(/\s/g,'').trim().toLowerCase();

        E._post('https://platform.estimeo.com/website/signup', obj, function(err) {
            if (err) {
                console.error(err);
            } else {
                return E.goTo('https://platform.estimeo.com/');
            }
        }, true);
    },
    
    isFastSignup: function(){
        var fS = document.querySelector("#fastSignup");
        if(fS){
            /*var elems = document.querySelectorAll('select');
            if(elems){
                var instances = M.FormSelect.init(elems, {});
            }*/
            
            fS.addEventListener("submit", function( event ){
                event.preventDefault();
                E.fastSignup();
                return false;
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var sideNavElems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(sideNavElems, {
        "edge":"left"
    });

    var dropDownElems = document.querySelectorAll('.dropdown-trigger');
    var instances2 = M.Dropdown.init(dropDownElems, {
        "constrainWidth":false
    })
      
    var carouselElems = document.querySelector('.carousel.carousel-slider');
    if(carouselElems){
        var instance3 = M.Carousel.init(carouselElems,{
            fullWidth: true,
            indicators: true
        });
    }
    
    E.isFastSignup();

    if (!localStorage.getItem('cookie_already_shown')) {
        E.Notify({
            icon: 'settings',
            title: 'Gestion des Cookies',
            body: 'Nous utilisons des cookies pour vous garantir la meilleure expérience et améliorer la performance de notre site.\n' +
                'Pour plus d’informations, consultez nos CGU et notre politique cookie. En continuant votre navigation, vous acceptez le dépôt des cookies.'
        }, {
            delay: 1000 * 60 * 60 * 24,
            cancellable: true
        });
        localStorage.setItem('cookie_already_shown', (new Date()).toString());
    }
});