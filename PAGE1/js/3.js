(function ($) {
    $.fn.extend({
        size: function () {
            return $(this).length;
        }
    });

    $.fn.initBanner = function (options) {
        var $self = $(this);

        $.get(globalVars.a + '/ads/get',
            { place: options.place, device: getDevice(), t: new Date().getTime(), l: options.language, w: $self.width() },
            function (res) {
                if (res.success) {
                    $self.append(res.content);
                    handleClick(res.id);
                } else {
                    $self.removeClass('banner');
                }
            });

        function handleClick(id) {
            $self.on('click', function (e) {
                $.get(globalVars.a + '/stat/click/' + id, { t: new Date().getTime() }, function () {
                });
            })
        }

        function getDevice() {
            if ($(window).width() < 769) {
                return 'mobile';
            }
            return 'desktop';
        }

        return this;
    };

    $(document).ready(function () {
        if (window.innerWidth < 768) {
            var elem = document.getElementById("pb");

            if (elem !== null) {
                $('body').bind('touchmove', function (e) {
                    e.preventDefault()
                }).addClass('stop');
                elem.style.width = '100%';
                setTimeout(function () {
                    $('body').unbind('touchmove').removeClass('stop');
                }, 1000);
            }
        }

        var _tg = parseInt($.cookie('_tg'));
        var tgShown = false;
        if (_tg == 0 || isNaN(_tg)) {
            setTimeout(function () {
                $('#modal_tg').modal('show');
                tgShown = true;
                $.cookie('_tg', 1, { expires: new Date(new Date().getTime() + 1209600000), path: '/' });
            }, 5000);
        }

        var popup = parseInt($.cookie('popup'));
        var popup_sh = parseInt($.cookie('popup_sh'));

        if (isNaN(popup)) {
            popup = 0;
        }
        if (false && (isNaN(popup_sh) || popup_sh === 0)) {
            popup++;
            $.cookie('popup', popup, { expires: new Date(new Date().getTime() + 6 * 3600000), path: '/' });

            if (popup > 3 && !isBot() && !tgShown)
                setTimeout(function () {
                    $('#modal_yan').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    initYandexPopup();

                    var t = 10;
                    var interval = setInterval(function () {
                        $('#yan_timer').text(t);
                        t--;
                        if (t === 0) {
                            $.cookie('popup_sh', 1, { expires: new Date(new Date().getTime() + 6 * 3600000), path: '/' });

                            clearInterval(interval);
                            $('#modal_yan').modal('hide');
                        }
                    }, 1000);
                }, 4000);
        }

        $('img[data-src^="http"]').each(function () {
            $(this).attr('src', $(this).attr('data-src'));
        });

        if (isMobile() || $(window).width() < 768) {
            $('#main_nav .dropdown-toggle').on('click', function () {
                document.location.href = $(this).attr('href');
            });
            $('#mobile_alert').slideDown();
        }
        $('.number, .pin_code').formatter({
            'pattern': '{{999999}}',
            'persistent': true
        });

        $('.btn-delete').on('click', function () {
            return confirm('Are you sure to delete?')
        });

        $(document).on('ready pjax:success', function (data, status, xhr, options) {
            if (data.target.id == 'post-grid') {
                $("html, body").animate({ scrollTop: $('#post-grid').offset().top - 40 + "px" }, 600);
            }
            if (data.target.id == 'user-exam-grid') {
                $("html, body").animate({ scrollTop: $('#user-exam-grid').offset().top - 100 + "px" }, 600);
            }
        });


        $(document).on('click', '#user-exam-grid tr td', function (target) {
            var id = $(target.target.nodeName == 'TD' ? target.target.parentNode : target.target.parentNode.parentNode).data('key');
            $('#modal_test .modal-body').html(testData[id]);
            $('#modal_test').modal('show');
            $('#test_url').attr('href', '/exam/repeat/' + id);
        });

        var table = $('table');
        $('th.sortable')
            .each(function () {
                var th = $(this),
                    thIndex = th.index(),
                    inverse = false;

                th.click(function () {
                    table.find('th a').attr('class', '');
                    th.find('a').addClass(inverse ? 'desc' : 'asc');
                    table.find('td').filter(function () {
                        return $(this).index() === thIndex;
                    }).sortElements(function (a, b) {
                        if ($.isNumeric($.text([a]))) {
                            return parseFloat($.text([a])) > parseFloat($.text([b])) ?
                                inverse ? -1 : 1
                                : inverse ? 1 : -1;
                        }
                        return $.text([a]) > $.text([b]) ?
                            inverse ? -1 : 1
                            : inverse ? 1 : -1;
                    }, function () {
                        return this.parentNode;
                    });
                    inverse = !inverse;
                });
            });
    });
})(jQuery);

function isBot() {
    return /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
}

function isMobile() {
    var isMobile = false; //initiate as false
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;
    return isMobile;
}

function initUniversity(id) {
    var cookieTime = new Date(new Date().getTime() + 36000000000);
    var uns, unv = $.cookie('_un');

    if (unv == undefined) {
        uns = [];
    } else {
        uns = unv.split(",");
    }

    if (uns.indexOf(id) == -1) {
        uns.push(id);
        $.cookie('_un', uns.join(), { expires: cookieTime, path: '/' });
    }

}

function setFocusToSearch() {
    var input = $("input[name*='[search]'][type='text'], input.search");
    if (input.length == 0) {
        input = $('#data-grid-filters input[type=\"text\"]:first');
    }
    if (input != undefined && input.length > 0) {
        input.focus().delay(1000).val(input.val());
        document.getElementById(input.attr('id')).setSelectionRange(100, 100);
    }

    if (!isMobile()) {
        $('.mobile-phone').formatter({
            'pattern': '{{99}} {{999}}-{{99}}-{{99}}',
            'persistent': true
        });

    }

    var len = 0;
    var notMobile = !isMobile();
    $('.gift-card-code').on('input', function (evt) {
        if (len < $(this).val().length) {
            $(this).val(function (_, val) {
                if ((val.length == 4 || val.length == 9) && notMobile) {
                    val += '-';
                }
                val = val.toUpperCase();
                return $(this).val().length < 15 ? val : val.substr(0, 14);
            });
        }
        len = $(this).val().length;
        return false;
    });
}

(function ($) {
    "use strict";
    $.fn.userProfile = function () {
        var container = this;
        var coreInstance;
        var timeOut;

        var specialities = {
            selected: [],

            offer: function (id) {
                var pos = this.itemPos(id);
                if (pos == -1) {
                    return this.add(id);
                } else {
                    return this.remove(id, pos);
                }
            },
            add: function (id) {
                if (this.selected.length < 3) {
                    this.selected.push(id);
                    return true;
                }
                return false;
            },

            remove: function (id, pos) {
                this.selected.splice(pos, 1);
                return true;
            },

            itemPos: function (id) {
                return $.inArray(id, this.selected);
            }
        };

        var universities = $.extend(true, {}, specialities);

        var Core = {
            initialize: function () {
                coreInstance = this;

                $('#save_profile').click(function () {
                    coreInstance.saveProfile();
                });
                $('#choose_profile').click(function () {
                    return coreInstance.chooseProfile();
                });

                container.find('.sp_item').click(function () {
                    $(this).parent().find('.sp_item').removeClass('active').removeClass('sp_pd');
                    $(this).addClass('active');
                });

                $(document).on('ready pjax:success', function (data) {
                    if (data.target.id != undefined) {
                        if (data.target.id == "speciality-grid") {
                            coreInstance.initSpecialityList();
                        } else if (data.target.id == "university-grid") {
                            coreInstance.initUniversityList();
                        }
                    }
                });
                coreInstance.initSpecialityList();
                coreInstance.initUniversityList();

                coreInstance.initSearchBox();
            },

            initSearchBox: function () {
                container.find('input.search-query').keydown(function (event) {
                    if (event.keyCode === 10 || event.keyCode === 13) {
                        event.preventDefault();
                        coreInstance.submitQuery(this);
                    } else {
                        coreInstance.searchQuery(this);
                    }
                });
            },

            searchQuery: function (input) {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    coreInstance.submitQuery(input);
                }, 500)
            },

            submitQuery: function (input) {
                var link = $(input).closest('.sp_body').find('.sp_link');
                link.attr('href', coreInstance.buildQuery(input));
                link.trigger('click');
            },

            buildQuery: function (input) {
                var value = input.value != undefined ? input.value : '';
                return document.location.href +
                    '?' + $(input).data('type') + '=' + value +
                    '&s[]=' + specialities.selected.join('&s[]=') +
                    '&u[]=' + universities.selected.join('&u[]=');
            },

            initSpecialityList: function () {
                $('#sp_speciality .sp_li').click(function () {
                    var key = $(this).data('id');

                    if (specialities.offer(key)) {
                        coreInstance.markSelected('#sp_speciality', specialities);
                        coreInstance.submitQuery($('#speciality-university'));
                    }
                });
                coreInstance.markSelected('#sp_speciality', specialities);
            },

            initUniversityList: function () {
                $('#sp_university .sp_li').click(function () {
                    var key = $(this).data('id');

                    if (universities.offer(key)) {
                        coreInstance.markSelected('#sp_university', universities);
                        coreInstance.submitQuery($('#speciality-speciality'));
                    }
                });
                coreInstance.markSelected('#sp_university', universities);
            },

            markSelected: function (div, list) {
                $(div + ' .sp_li').removeClass('li_selected');
                $(div + ' .sp_li').removeClass('sp_mn');

                for (var i in list.selected) {
                    if (i == 0) {
                        $(div + ' .sp_' + list.selected[i]).addClass('li_selected sp_mn');
                    } else {
                        $(div + ' .sp_' + list.selected[i]).addClass('li_selected');
                    }
                }
            },
            saveProfile: function () {
                if (specialities.selected.length == 0 || universities.selected.length == 0) {
                    return false;
                }

                var d = new Date();
                var link = document.location.href + '?update=' + d.getMilliseconds() +
                    '&s[]=' + specialities.selected.join('&s[]=') +
                    '&u[]=' + universities.selected.join('&u[]=');

                document.location.href = link;
            },
            chooseProfile: function () {
                if (specialities.selected.length == 0 || universities.selected.length == 0) {
                    return false;
                }

                var d = new Date();
                var link = document.location.href + '?profile=' + d.getMilliseconds() +
                    '&s[]=' + specialities.selected.join('&s[]=') +
                    '&u[]=' + universities.selected.join('&u[]=');

                $.ajax({
                    url: link,
                    success: function (data) {
                        console.log(data);
                        $('#profile_content').html(data.content);
                        $('#user-profile_name').val(data.profile);
                        $('#modal_speciality').modal('hide');
                    }
                });

                return false;
            }
        };

        Core.initialize();
        return this;
    };
}(jQuery));


function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return (rect.bottom > 0 && (rect.top < viewHeight / 2));
}

jQuery.fn.sortElements = (function () {

    var sort = [].sort;

    return function (comparator, getSortable) {

        getSortable = getSortable || function () {
            return this;
        };

        var placements = this.map(function () {

            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,

                // Since the element itself will change position, we have
                // to have some way of storing it's original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );

            return function () {

                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);

            };

        });

        return sort.call(this, comparator).each(function (i) {
            placements[i].call(getSortable.call(this));
        });

    };

})();