$(function () {

    //配置图标
    var icons = {
        104: {
            title: '阴',
            icon: "icon-tianqi-yin"
        },
        101: {
            title: '多云',
            icon: "icon-tianqi-duoyun"
        },
        100: {
            title: '晴',
            icon: "icon-tianqi-qing"
        },
        300: {
            title: '阵雨',
            icon: "icon-tianqi-zhenyu"
        },
        301: {
            title: '阵雨',
            icon: "icon-tianqi-zhenyu"
        },
        302: {
            title: '雷阵雨',
            icon: "icon-tianqi-leizhenyu"
        },
        303: {
            title: '雷阵雨',
            icon: "icon-tianqi-leizhenyu"
        },
        305: {
            title: '小雨',
            icon: "icon-tianqi-xiaoyu"
        },
        306: {
            title: '中雨',
            icon: "icon-tianqi-zhongyu"
        },
        307: {
            title: '大雨',
            icon: "icon-tianqi-dayu"
        },
        310: {
            title: '暴雨',
            icon: "icon-tianqi-baoyu"
        },
        311: {
            title: '大暴雨',
            icon: "icon-tianqi-dabaoyu"
        },
        312: {
            title: '特大暴雨',
            icon: "icon-tianqi-tedabaoyu"
        },
        314: {
            title: '小雨转中雨',
            icon: "icon-tianqi-xiaoyuzhuanzhongyu"
        },
        315: {
            title: '中雨转大雨',
            icon: "icon-tianqi-zhongyuzhuandayu"
        },
        316: {
            title: '大雨转暴雨',
            icon: "icon-tianqi-dayuzhuanbaoyu"
        },
        317: {
            title: '大雨转特大暴雨',
            icon: "icon-tianqi-dayuzhuantedabaoyu"
        },
        399: {
            title: '雨',
            icon: "icon-tianqi-yu"
        },  
        499: {
            title: '雪',
            icon: "icon-tianqi-xue"
        },
        501: {
            title: '雾',
            icon: "icon-tianqi-wu"
        }
      };

    //匹配星期几
    var days = ['日', '一', '二', '三', '四', '五', '六'];

    var nowBoxHeight = $('.now-box').height();
    console.log(nowBoxHeight);

    $('.future-weather').css({
        height: nowBoxHeight - 355 + 'px'
    })

    $('.show-weather').on('click', function () {

        if ($(this).attr('name') == 0) {
            //展开
            $('.future-weather').addClass('show-future-weather').css({
                top: nowBoxHeight - 480 + 'px'
            });
            $(this).attr('name', 1).text('收缩');
        } else {
            //收缩
            $('.future-weather').removeClass('show-future-weather').css({
                top: '355px'
            })
            $(this).attr('name', 0).text('展开');
        }
        
    })

    //获取城市天气
    function getWeather(city) {
        //获取实况天气
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/now',
            data: {
                location: city,
                key: '5cdadaa2b957470ab04f1e968fce3d7c'
            },
            success: function (result) {
                console.log('result ==> ', result);

                //如果不存在城市
                if (result.HeWeather6[0].status !== 'ok') {
                    console.log('没有' + city + '的天气');
                    return;
                }

                $('.weather-status').text(result.HeWeather6[0].now.cond_txt);
                $('.wind-status').text(result.HeWeather6[0].now.wind_dir);
                $('.tmp').text(result.HeWeather6[0].now.tmp + '°');
                var currentDate = new Date(result.HeWeather6[0].update.loc);
                $('.day').text('周' + days[currentDate.getDay()]);
                var m = currentDate.getMonth() + 1;
                var d = currentDate.getDate();
                $('.date').text( (m >= 10 ? m : '0' + m) + ' / ' + (d >= 10 ? d : '0' +d));


                 //获取当前天气和未来9天天气
                 getNineDayWeather(city);

                 //获取24小时天气
                 getHours24Weather(city);
            }
        })
    }

    //获取当前天气和未来9天天气
    function getNineDayWeather(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/forecast',
            data: {
                location: city,
                key: '5cdadaa2b957470ab04f1e968fce3d7c'
            },
            success: function (r) {
                console.log('r ==> ', r);
                var rd = r.HeWeather6[0].daily_forecast;
                $('.min-max-tmp').text(rd[0].tmp_min + '°~' + rd[0].tmp_max + '°');

                //获取当前时间
                var hour = new Date(r.HeWeather6[0].update.loc).getHours();

                //未来9天天气
                for (var i = 1; i < rd.length; i++) {
                    var $li = $(`<li class="clearfix">
                        <div>周${days[new Date(rd[i].date).getDay()]}</div>
                        <div><i class="icon iconfont ${hour >= rd[i].sr.substr(0, 2) && hour < rd[i].ss.substr(0, 2) ? icons[rd[i].cond_code_d].icon :  icons[rd[i].cond_code_n].icon} f32 ic"></i></div>
                        <div class="wi">${hour >= rd[i].sr.substr(0, 2) && hour < rd[i].ss.substr(0, 2) ? rd[i].cond_txt_d : rd[i].cond_txt_n}</div>
                        <div>${rd[i].tmp_min + '°~' + rd[i].tmp_max + '°'}</div>
                    </li>`);

                    $('.fw').append($li);
                }
            }
        })
    }

    //获取24小时天气
    function getHours24Weather(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/hourly',
            data:{
                location: city,
                key: '5cdadaa2b957470ab04f1e968fce3d7c'
            },
            success: function (res) {
                console.log('res ==> ', res);
                var currentHour24Weather = res.HeWeather6[0].hourly.slice(0, 24);

                for (var i = 0; i < currentHour24Weather.length; i++) {
                    var $li = $(`<li>
                        <div>${currentHour24Weather[i].time.slice(-5)}</div>
                        <div><i class="icon iconfont ${icons[currentHour24Weather[i].cond_code].icon} f32"></i></div>
                        <div>${currentHour24Weather[i].tmp + '°'}</div>
                    </li>`);
                    $('.list').append($li);
                }

            }
        })
    }

    //腾讯地图IP定位
    $.ajax({
        type: 'get',
        url: 'https://apis.map.qq.com/ws/location/v1/ip',
        data: {
            key: 'YP5BZ-T2D36-T6ASM-ELYND-WHZVS-FKFTQ',
            output: 'jsonp'
        },

        dataType: 'jsonp',

        success: function (data) {
            console.log('data ==> ', data);
            $('.location-city').text(data.result.ad_info.city);

            
            //获取当前定位城市的天气
            getWeather(data.result.ad_info.city);

        }
    })

    $('.search-city').on('click', function () {

        var city = $('.search-text').val().trim();

        if (city == '') {
            console.log('请输入城市');
            return;
        }

        //清空24小时天气的li
        $('.list').empty();

        //清空未来9天天气的li
        $('.fw').empty();

        //获取搜索城市的天气
        getWeather(city);

        $('.location-city').text(city);
        $('.search-text').val('');

    })
})