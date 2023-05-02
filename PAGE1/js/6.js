var chartPluginUpdate = function () {
    Chart.pluginService.register({
        afterUpdate: function (chart) {
            if (chart.config.options.elements.center) {
                var helpers = Chart.helpers;
                var centerConfig = chart.config.options.elements.center;
                var globalConfig = Chart.defaults.global;
                var ctx = chart.chart.ctx;

                var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
                var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

                if (centerConfig.fontSize)
                    var fontSize = centerConfig.fontSize;
                // figure out the best font size, if one is not specified
                else {
                    ctx.save();
                    var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
                    var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
                    var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

                    do {
                        ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                        var textWidth = ctx.measureText(maxText).width;

                        // check if it fits, is within configured limits and that we are not simply toggling back and forth
                        if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                            fontSize += 1;
                        else {
                            // reverse last step
                            fontSize -= 1;
                            break;
                        }
                    } while (true)
                    ctx.restore();
                }

                // save properties
                chart.center = {
                    font: helpers.fontString(fontSize, fontStyle, fontFamily),
                    fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
                };
            }
        },
        afterDraw: function (chart) {
            if (chart.center) {
                var centerConfig = chart.config.options.elements.center;
                var ctx = chart.chart.ctx;

                ctx.save();
                ctx.font = chart.center.font;
                ctx.fillStyle = chart.center.fillStyle;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                ctx.fillText(centerConfig.text, centerX, centerY);
                ctx.restore();
            }
        }
    })
};
//document.onselectstart = new Function("return false");
if (window.sidebar) {
}
var generateResults = function (resultData) {
    $('.generating').fadeOut();
    $('.f_actions').fadeIn();
    if (resultData.hasOwnProperty('blocks')) {
        chartPluginUpdate();
        var chartCount = 0;
        var colors = ["#15D1C2", "#4A90D9", "#FF6D6D"];

        var $q;
        for (var i in resultData['blocks']) {
            if (!resultData['blocks'].hasOwnProperty(i)) continue;

            if (resultData['blocks'][i].hasOwnProperty('c')) {
                for (var j in resultData['blocks'][i]['c']) {
                    $q = $("#q" + resultData['blocks'][i]['c'][j]);
                    $q.addClass('_sc');
                }
            }

            if (resultData['blocks'][i].hasOwnProperty('w')) {
                for (var j in resultData['blocks'][i]['w']) {
                    $q = $("#q" + resultData['blocks'][i]['w'][j]);
                    $q.addClass('_wr');
                }
            }

            chartCount++;
            var data = resultData['blocks'][i];

            var datasets = {
                labels: data.labels,
                datasets: [
                    {
                        data: data.dataset,
                        backgroundColor: i == 'total' ? colors : [
                            colors[i - 1],
                            "#595959",
                            "#FF6D6D",
                        ],
                        borderWidth: 0
                    }]
            };
            var canvas = document.getElementById("blockChart_" + i);

            if (chartCount == 4 && i == 'total') {
                if (!$('body').hasClass('site_index'))
                    $(canvas).parent().parent().addClass('col-sm-offset-4');
            }

            var ctx = canvas.getContext("2d");

            new Chart(ctx, {
                type: 'doughnut',
                data: datasets,
                options: {
                    cutoutPercentage: 90,
                    drawBorder: false,
                    responsive: true,
                    tooltips: {
                        enabled: false
                    },
                    legend: {
                        display: false,
                    }
                }
            });

            var inner = $("#blockChart_" + i).parent().find('.donut-inner');
            inner.html(data.inner);
            inner.slideDown();
        }
    }
};

(function ($) {
    "use strict";
    $.fn.abtTest = function (totalTime, testData, chartUrl, cfrmMessage) {
        var closed = $(window).width() < 1024;
        var container = this,
            duration = totalTime - (totalTime % 5),
            testQuestions = testData,
            timerDisplay = $('.timer');

        var questionVariants, paginationItems, lastQuestion;
        var actionEnable = true;
        var testCoreInstance;
        var interval;
        var reportModal = $('#modal_report');


        var TestCore = {
            initialize: function () {
                var that = this;
                testCoreInstance = this;

                $('.tfooter').css('min-height', 400);

                $('#close').click(function () {
                    closed = !closed;
                    that.toggleSidebar();
                });

                questionVariants = container.find('.tv');

                container.find('.nx').click(function () {
                    that.moveAnswer($(this).parent());
                });

                questionVariants.click(function () {
                    that.chooseAnswer($(this));
                });

                paginationItems = $('.pagination a');
                paginationItems.click(function () {
                    that.gotoQuestion($(this).attr('dq'), 500);
                    return false;
                });

                this.toggleSidebar();
                if (duration != 0)
                    this.startTimer();
                this.initReport();

                $(document).on('click', '.finish_exam', function () {
                    testCoreInstance.finishExam(!$(this).hasClass('no-confirm'));
                });

                if ($(window).width() < 641) {
                    if (document.querySelector("header") != null) {
                        var headroom = new Headroom(document.querySelector("header"));
                        headroom.init();
                    }
                }
            },
            initReport: function () {
                $('.tt .tr').click(function () {
                    $('#questionreport-q').val($(this).attr('dq'));
                    $('#modal_report .alert').hide();
                    reportModal.modal('show');
                });

                $('#report_close').click(function () {
                    reportModal.modal('hide');
                });
            },

            toggleSidebar: function () {
                $('html').toggleClass('side_close');
                if (lastQuestion != undefined) {
                    //TestCore.gotoQuestion(lastQuestion, 0);
                }
            },

            gotoQuestion: function (id, time) {
                lastQuestion = id;
                $('html,body').animate({
                    scrollTop: $('#q' + lastQuestion).offset().top
                }, time)
            },

            gotoResult: function () {
                $('html,body').animate({
                    scrollTop: $('#progress').offset().top
                }, 500)
            },

            moveAnswer: function (variant) {
                var question = variant.attr('dq');
                var block = variant.attr('db');
                var answer = parseInt(variant.attr('dv'));
                var oldAnswer = parseInt(testQuestions['blocks'][block]['questions'][question]['s']);

                if (answer == oldAnswer) return;

                var after = false;
                var firstFound = false;
                var nextFound = false;
                var nextQ = question;
                if (testQuestions.hasOwnProperty('ids')) {
                    for (var i in testQuestions['ids']) {
                        if (testQuestions['ids'].hasOwnProperty(i)) {
                            qid = testQuestions['ids'][i];
                            if (!after) after = question == qid;
                            if (testQuestions['blocks'][1]['questions'].hasOwnProperty(qid) && qid != question) {
                                if (after) {
                                    if (testQuestions['blocks'][1]['questions'][qid]['s'] == 0) {
                                        nextFound = true;
                                        nextQ = qid;
                                        break;
                                    }
                                } else {
                                    if (testQuestions['blocks'][1]['questions'][qid]['s'] == 0 && !firstFound) {
                                        firstFound = true;
                                        nextQ = qid;
                                    }
                                }
                            }
                            if (nextFound) break;
                        }
                    }
                } else {
                    for (var bid in testQuestions['blocks']) {
                        if (testQuestions['blocks'].hasOwnProperty(bid)) {
                            for (var qid in testQuestions['blocks'][bid]['questions']) {
                                if (!after) after = question == qid;
                                if (testQuestions['blocks'][bid]['questions'].hasOwnProperty(qid) && qid != question) {
                                    if (after) {
                                        if (testQuestions['blocks'][bid]['questions'][qid]['s'] == 0) {
                                            nextFound = true;
                                            nextQ = qid;
                                            break;
                                        }
                                    } else {
                                        if (testQuestions['blocks'][bid]['questions'][qid]['s'] == 0 && !firstFound) {
                                            firstFound = true;
                                            nextQ = qid;
                                        }
                                    }
                                }
                            }
                            if (nextFound) break;
                        }
                    }
                }

                if (firstFound || nextFound) {
                    TestCore.gotoQuestion(nextQ, 500);
                }
            },

            chooseAnswer: function (variant) {
                if (!actionEnable) {
                    return this.gotoResult();
                }
                var block = variant.attr('db');
                var question = variant.attr('dq');
                var answer = parseInt(variant.attr('dv'));
                var progress = $('#tp' + question);
                var oldAnswer = parseInt(testQuestions['blocks'][block]['questions'][question]['s']);

                lastQuestion = question;

                if (answer == oldAnswer) {
                    testQuestions['blocks'][block]['questions'][question]['s'] = 0;
                    variant.removeClass('checked');
                    variant.parent().removeClass('checked');
                    progress.removeClass('checked');
                    testQuestions['blocks'][block]['checked']--;
                } else {
                    testQuestions['blocks'][block]['questions'][question]['s'] = answer;
                    variant.parent().addClass('checked').find('.tv').removeClass('checked');
                    variant.addClass('checked');
                    progress.addClass('checked');
                    if (oldAnswer == 0) {
                        testQuestions['blocks'][block]['checked']++;
                    }
                }
                $('#hp_' + block).text(testQuestions['blocks'][block]['checked'] + "/" + testQuestions['blocks'][block]['total']);

                this.publishProgress(0);
            },

            publishProgress: function (finish) {
                var form = $('#progress-form');
                $('#test_progress').val(JSON.stringify(testQuestions));
                var link = form.attr('action');
                $.post(
                    link + ((link.indexOf('?') == -1) ? ('?finish=' + finish) : ('&finish=' + finish)),
                    form.serialize(),
                    function (response) {
                        if (response.success) {
                            if (response.result) {
                                generateResults(response.result);
                            } else {
                                $('#progress').html(response.form);
                            }
                        }
                        if (response.duration != undefined) {
                            duration = response.duration;
                            var round = duration % 5;
                            if (round > 2) {
                                duration += (5 - round);
                            } else {
                                duration -= round;
                            }
                        }
                    })
            },

            finishExam: function (cfrm) {
                if (cfrm) {
                    if (!confirm(cfrmMessage)) {
                        return false;
                    }
                }
                $('.finish_exam').parent().hide();
                $('.generating').fadeIn();
                clearInterval(interval);
                actionEnable = false;
                testCoreInstance.gotoResult();
                testCoreInstance.publishProgress(1);

            },


            startTimer: function () {
                var hours, minutes, seconds;


                function displayTime() {
                    if (actionEnable) {
                        if (duration > 0) {
                            hours = parseInt(duration / 3600, 10);
                            minutes = parseInt((duration - hours * 3600) / 60, 10);
                            seconds = parseInt((duration - hours * 3600) % 60, 10);

                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            seconds = seconds < 10 ? "0" + seconds : seconds;

                            timerDisplay.html("<span class='dg'>" + hours + "</span>:<span class='dg'>" + minutes + "</span>:<span class='dg'>" + seconds + "</span>");
                        } else {
                            timerDisplay.html("<span class='dg'>0</span>:<span class='dg'>00</span>:<span class='dg'>00</span>");
                        }

                        if (duration <= 0) {
                            clearInterval(interval);
                            testCoreInstance.finishExam(false);
                        }
                    }
                }

                displayTime();
                interval = setInterval(function () {
                    duration = duration - 5;
                    displayTime();
                }, 5000);
            },


        };

        TestCore.initialize();
        return this;
    };


}(jQuery));

