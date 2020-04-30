/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function (e) {
    
    // Vars & Refs
    var startingDate = moment('2018-01-01');
    var monthLabel = $('.month-label');
    var monthlyList = $('.monthly-list');

    // Init Handlebars
    var sourceDay = $('#test').html();
    var sourceHoliday = $('#holiday-temp').html();
    var templateDay = Handlebars.compile(sourceDay);
    var templateHoliday = Handlebars.compile(sourceHoliday);

    activeDate = monthlyCal(startingDate, templateDay);
    applyHolidays(startingDate);
    checkMonth(startingDate); 
    
    
    $(document).on('click','.next', function() { 
        activeDate = moment(activeDate.add(1, 'month'));
        $('.monthly-list > *').remove();
        monthlyCal(activeDate, templateDay);
        applyHolidays(activeDate);
        checkMonth(activeDate);
    });

    $(document).on('click','.prev', function() {
        activeDate = moment(activeDate.subtract(1, 'month'));
        $('.monthly-list > *').remove();
        monthlyCal(activeDate, templateDay);
        applyHolidays(activeDate);
        checkMonth(activeDate);
    });

    /*************************************
        FUNCTIONS
    *************************************/

    function monthlyCal(date, template) {
        var daysInMonth = date.daysInMonth();    
        monthLabel.html(date.format('MMMM YYYY')); //  setta header
        monthLabel.attr('data-fulldate', date.format('YYYY-MM-DD'));
        
        var activeMonthLabel = date.format('MMMM').toLowerCase();
        var activeMonthNumber = addZero(date.format('M'));
        var backgroundUrl = 'url("img/bkg_' + activeMonthNumber + '_' + activeMonthLabel + '.jpg")';
        
        $('.header').css('background-image', backgroundUrl);
        
        var startingWeekDay = date.weekday();
        for( var i = 0; i < startingWeekDay; i++) {
            var data = {
                dayNumber: '',
                fullDate: ''
            };

            monthlyList.append(template(data));
        }

        for(var i = 0; i < daysInMonth; i++) {
            var thisDate = moment({
                year: date.year(),
                month: date.month(),
                day: i + 1
            });

            var data = {
                dayNumber: thisDate.format('D'),
                fullDate: thisDate.format('YYYY-MM-DD')
            };

            monthlyList.append(template(data));
        }

        return date;
    }

    function applyHolidays(date) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
            method: 'GET',
            data: {
                year: date.year(),
                month: date.month()
            },
            success: function(dataHolidays) {
                var holidays = dataHolidays.response;

                for (var i = 0; i < holidays.length; i++) {
                    var thisHoliday = holidays[i];
                    var listItem = $('.day[data-fulldate="' + thisHoliday.date + '"]');

                    if(listItem) {
                        var data = {
                            holidayName: thisHoliday.name
                        }
                        listItem.append(templateHoliday(data));
                    }
                }
            },
            error: function() {
                console.log('Errore chiamata festività'); 
            }
        });
    }

    function checkMonth (date) {
        var currentMonth = date.month();
        if(currentMonth == '0')  $('.prev').hide(); else $('.prev').show(); 
        if(currentMonth == '11') $('.next').hide(); else $('.next').show();
    }

    function addZero(num) {
        return (num < 10 ? ('0' + num) : num);
    }

}); // <-- End doc ready