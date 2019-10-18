$(function () {
    var audio = $('#audio')[0];
    var url = 'https://music.163.com/song/media/outer/url?id=';
    audio.oncanplay = function () {
        var self = this;
        var $liActive = $('li.active');
        var id = $liActive.data('id');
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:100099/lyric?id=' + id,
            success: function (data) {
                $('.words-box').css({top: wordsBoxTop + 'px'}).empty();
                var lyric = data.lrc.lyric.split(/[\n\r]+/);
                for (var i = 0; i < lyric.length; i++) {
                    var lrc = lyric[i].split(']');
                    var text = lrc[1];
                    if (text) {
                        var time = lrc[0].slice(1).split(':');
                        var second = Number(time[0]) * 60 + Number(time[1]);
                        var $p = $(`<p data-time="${second}">${text}</p>`);
                        $('.words-box').append($p);
                    }
                }
                self.play();
                $animate.find('.line').css({
                    animationPlayState: 'running'
                })
                $liActive.attr('name', 1);
                $('.dtime').text(dealSongTime(self.duration * 1000));
                $('.sing').each(function () {
                    $(this).find('span').eq(0).text($liActive.find('.st').text());
                    $(this).find('span').eq(1).text($liActive.find('.sn').text());
                })
                $('.singer-img').find('img').attr('src', $liActive.data('img'));
                $('.m-play-stop').css({
                    background: 'url("./images/stop.png") no-repeat center center',
                    backgroundSize: 'cover'
                })
            }
        })
    }
    var progressWidth = $('.m-progress').width();
    var $mMask = $('.m-mask');
    var mMaskWidth = $mMask.width();
    var wordsBoxTop = parseFloat($('.words-box').css('top'));
    audio.ontimeupdate = function () {
        var $ps = $('.words-box>p');
        var height = $ps.height();
        $('.ctime').text(dealSongTime(this.currentTime * 1000));
        if (!isTouch) {
            var minLeft = 0;
            var maxLeft = progressWidth - mMaskWidth;
            var x = this.currentTime / $('li.active').data('dt') * (maxLeft);
            var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
            $('.m-mask').css({
                left: left + 'px'
            })
            $('.m-progress-active').css({
                width: x + 'px'
            })
        }
        for (var i = 0; i < $ps.length; i++) {
            var currentTime = $ps.eq(i).data('time');
            var nextTime = $ps.eq(i + 1).data('time');
            if (i + 1 == $ps.length) {
                nextTime = Number.MAX_VALUE;
            }
            if (this.currentTime >= currentTime && this.currentTime < nextTime) {
                $('.words-box').animate({
                    top: wordsBoxTop - height * i + 'px'
                }, 150)
                if (i - 1 >= 0) {
                    $ps.eq(i - 1).removeClass('sactive');
                }
                $ps.eq(i).addClass('sactive');
                break;
            }
        }
    }
    audio.onended = function () {
        $('li.active').find('.line').css({
            animationPlayState: 'paused'
        })
    }
    var isTouch = false;
    var x0 = 0;
    $('.m-event-progress').on('touchstart', function (e) {
        isTouch = true;
        var x = e.touches[0].pageX - mMaskWidth / 2;
        x0 = x;
        var minLeft = 0;
        var maxLeft = progressWidth - mMaskWidth;
        var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
        $('.m-mask').css({
            left: left + 'px'
        })
        $('.m-progress-active').css({
            width: x + 'px'
        })
        audio.currentTime = x / maxLeft * $('li.active').data('dt');
    })
    $('.m-event-progress').on('touchmove', function (e) {
        var x = e.touches[0].pageX;
        x0 = x;
        var minLeft = 0;
        var maxLeft = progressWidth - mMaskWidth;
        var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
        $('.m-mask').css({
            left: left + 'px'
        })
        $('.m-progress-active').css({
            width: x + 'px'
        })
    })
    $('.m-event-progress').on('touchend', function (e) {
        var x = x0;
        var minLeft = 0;
        var maxLeft = progressWidth - mMaskWidth;
        var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
        $('.m-mask').css({
            left: left + 'px'
        })
        $('.m-progress-active').css({
            width: x + 'px'
        })
        audio.currentTime = x / maxLeft * $('li.active').data('dt');
        isTouch = false;
    })
    var songsId = [];
    var songsDetail = [];
    var d = localStorage.songs;
    if (d) {
        d = JSON.parse(d);
        songsDetail = d.playlist.tracks.concat();
        for (var i = 0; i < d.privileges.length; i++) {
            songsId.push(d.privileges[i].id);
        }
        $('.local-song').text('30');
        loadSongs(30, songsDetail);
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:100099/top/list?idx=1',
            success: function (data) {
                localStorage.setItem('songs', JSON.stringify(data))
                songsDetail = data.playlist.tracks.concat();
                for (var i = 0; i < data.privileges.length; i++) {
                    songsId.push(data.privileges[i].id);
                }
                $('.local-song').text(songsId.length);
                songsDetail(30, songsDetail);
            }
        })
    }
    function dealSongTime(time) {
        var second = Math.floor(time / 1000 % 60);
        second = second >= 10 ? second : '0' + second;
        var minute = Math.floor(time / 1000 / 60);
        minute = minute >= 10 ? minute : '0' + minute;
        return minute + ':' + second;
    }
    var previewIds = [];
    var startsIndex = 0;
    var endIndex = 30;
    function loadSongs(length, data) {
        for (var i = 0; i < length; i++) {
            var $li = $(`<li data-id="${data[i].id}" name="0" data-img="${data[i].al.picUrl}" data-dt="${data[i].dt / 1000}">
                                <div class="sg fl">
                                    <img class="auto-img" src="${data[i].al.picUrl}" />
                                </div>
                                <div class="fl info">
                                    <div class="st one-text">${data[i].name}</div>
                                </div>
                                <div class="s-time fr clearfix">
                                   <div class="dt fl">${dealSongTime(data[i].dt)}</div>
                                </div>
                            </li>`);

            var sg = [];
            for (var j = 0; j < data[i].ar.length; j++) {
                sg.push(data[i].ar[j].name);
            }
            var $singers = $(`<div class="sn one-text">${sg.join(' / ')}</div>`);
            $li.find('.info').append($singers);
            $('#current-list').append($li);
        }
    }
    $('#all-list>li').on('click', function () {
        $('.list,.nav').hide();
        $('.read-list').show();
        if (previewIds.length == 0) {
            previewIds = previewIds.concat(songsId.slice(startsIndex, endIndex));
            startsIndex = endIndex;
            endIndex += endIndex;
        }
        if ($(this).data('title') == $('.read-list').data('title')) {
            return;
        }
        $('.read-list').empty();
        loadSongs(previewIds.length, songsDetail);
    })
    var $animate = null;
    $('#current-list').on('click', 'li', function () {
        if (!$(this).hasClass('active')) {
            var $liActive = $('li.active');
            if ($liActive.length > 0) {
                $liActive.removeClass('active');
                if ($liActive.attr('name', 1)) {
                    $liActive.find('.line').css({
                        animationPlayState: 'paused'
                    })
                }
            }
        }
        $animate = $(this).find('.animate');
        $(this).addClass('active');
        var id = $(this).data('id');
        if (id == $(audio).attr('name')) {
            if ($(this).attr('name') == 0) {
                $(this).attr('name', 1);
                audio.play();
                $(this).find('.line').css({
                    animationPlayState: 'running'
                })
                $('.m-play-stop').css({
                    background: 'url("./images/stop.png") no-repeat center center',
                    backgroundSize: 'cover'
                })
            } else {
                $(this).attr('name', 0);
                audio.pause();
                $(this).find('.line').css({
                    animationPlayState: 'paused'
                })
                $('.m-play-stop').css({
                    background: 'url("./images/play.png") no-repeat center center',
                    backgroundSize: 'cover'
                })
            }
        } else {
            $(audio).attr('name', id);
            audio.src = url + id;
        }
    })
    $('.back').on('click', function () {
        $('.list,.nav').show();
        $('.read-list').hide();
    })
    $('.m-play-stop').on('click', function () {
        var $liActive = $('li.active');
        if ($liActive.length == 0) {
            var mode = $('.m-mode').data('value');
            var $lis = $('.read-list li');
            var $li = null;
            if (mode == 1 || mode == 2) {
                $li = $lis.eq(0);
            } else if (mode == 3) {
                $li = $lis.eq(Math.floor(Math.random() * $lis.length));
            }
            var id = $li.data('id');
            audio.src = url + id;
            $animate = $li.find('.animate');
            $li.addClass('active');
            $(audio).attr('name', id);
        } else {
            var name = $liActive.attr('name');
            if (name == 0) {
                $liActive.attr('name', 1).find('.line').css({
                    animationPlayState: 'running'
                })
                $(this).css({
                    background: 'url("./images/stop.png") no-repeat center center',
                    backgroundSize: 'cover'
                })
                audio.play();
            } else {
                $liActive.attr('name', 0).find('.line').css({
                    animationPlayState: 'paused'
                })
                $(this).css({
                    background: 'url("./images/play.png") no-repeat center center',
                    backgroundSize: 'cover'
                })
                audio.pause();
            }
        }
    })
    $('.m-mode').on('click', function () {
        var min = $(this).data('min');
        var max = $(this).data('max');
        var value = $(this).data('value');
        if (value == 3) {
            value = min;
            $(this).data('value', min);
        } else {
            $(this).data('value', ++value);
        }
        $(this).css({
            background: 'url("./images/' + value + '.png") no-repeat center center',
            backgroundSize: 'cover'
        })
    })
    $('.m-prev').on('click', function () {
        var $activeLi = $('li.active');
        var $lis = $('.read-list li');
        if ($activeLi.length == 0) {
            var mode = $('.m-mode').data('value');
            var $li = null;
            if (mode == 1 || mode == 2) {
                $li = $lis.eq(0);
            } else if (mode == 3) {
                $li = $lis.eq(Math.floor(Math.random() * $lis.length));
            }
            var id = $li.data('id');
            audio.src = url + id;
            $animate = $li.find('.animate');
            $li.addClass('active');
            $(audio).attr('name', id);
        } else {
            var index = $activeLi.index();
            var $thisLi = $lis.eq(index);
            var mode = $('.m-mode').data('value');
            if (mode == 1 || mode == 2) {
                if (index == 0) {
                    index = $lis.length - 1;
                } else {
                    index--;
                }
            } else if (mode == 3) {
                index = Math.floor(Math.random() * $lis.length);
            }
            $thisLi.removeClass();
            if ($thisLi.attr('name') == 1) {
                $thisLi.attr('name', 0).find('.line').css({
                    animationPlayState: 'paused'
                })
            }
            var $cLi = $lis.eq(index);
            var id = $cLi.data('id');
            audio.src = url + id;
            $animate = $cLi.find('.animate');
            $cLi.addClass('active');
            $(audio).attr('name', id);
        }
    })
    $('.m-next').on('click', function () {
        var $activeLi = $('li.active');
        var $lis = $('.read-list li');
        if ($activeLi.length == 0) {
            var mode = $('.m-mode').data('value');
            var $li = null;
            if (mode == 1 || mode == 2) {
                $li = $lis.eq(0);
            } else if (mode == 3) {
                $li = $lis.eq(Math.floor(Math.random() * $lis.length));
            }
            var id = $li.data('id');
            audio.src = url + id;
            $animate = $li.find('.animate');
            $li.addClass('active');
            $(audio).attr('name', id);
        } else {
            var index = $activeLi.index();
            var $thisLi = $lis.eq(index);
            var mode = $('.m-mode').data('value');
            if (mode == 1 || mode == 2) {
                if (index == $lis.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
            } else if (mode == 3) {
                index = Math.floor(Math.random() * $lis.length);
            }
            $thisLi.removeClass();
            if ($thisLi.attr('name') == 1) {
                $thisLi.attr('name', 0).find('.line').css({
                    animationPlayState: 'paused'
                })
            }
            var $cLi = $lis.eq(index);
            var id = $cLi.data('id');
            audio.src = url + id;
            $animate = $cLi.find('.animate');
            $cLi.addClass('active');
            $(audio).attr('name', id);
        }
    })
    $('.singer-img').on('click', function () {
        $('.song-word').show();
        $('.content-box').hide();
    })
    $('.close').on('click', function () {
        $('.song-word').hide();
        $('.content-box').show();
    })
})