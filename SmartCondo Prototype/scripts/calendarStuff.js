$( document ).ready(function() {
    var date1 = new Date();
    var date2 = new Date();
    var date3 = new Date();
    var date4 = new Date();
    var date5 = new Date();
    var date6 = new Date();
    var date7 = new Date();
    var date8 = new Date();
    var date9 = new Date();

    date1.setDate(date1.getDate() - 30);
    date2.setDate(date2.getDate() - 15);
    date3.setDate(date3.getDate() - 13);
    date4.setDate(date4.getDate() - 3);
    date5.setDate(date5.getDate() + 5);
    date6.setDate(date6.getDate() + 6);
    date7.setDate(date7.getDate() + 12);
    date8.setDate(date8.getDate() + 30);
    date9.setDate(date9.getDate() + 38);

    var calEvents = [
    	{"icon": "bars","eid":"someID 1","name":"My event test","url":"#","start":new Date("2014-02-10T08:00:00.000Z"),"end":new Date("2014-02-10T10:00:00.000Z"),"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"someID 1","name":"My event test","url":"#","start":new Date("2014-02-10T17:00:00.000Z"),"end":new Date("2014-02-10T18:00:00.000Z"),"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"someID 1","name":"My event 1","url":"#","start":date1,"end":date1,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"icon": "info","eid":"SomeID 2","name":"My event 2","url":"#","start":date2,"end":date3,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"SomeID 3","name":"My event 3","url":"#","start":date4,"end":date4,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"icon": "alert","eid":"SomeID 4","name":"My event 4","url":"#","start":date5,"end":date6,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"SomeID 5","name":"My event 5","url":"#","start":date7,"end":date7,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"SomeID 6","name":"My event 6","url":"#","start":date8,"end":date8,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    	{"eid":"SomeID 7","name":"My event 7","url":"#","start":date9,"end":date9,"summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet sem risus. Curabitur vehicula lacus eu tincidunt interdum."},
    ];


    $("#calendar").jqmCalendar({
        events : calEvents,
        months : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        days : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        startOfWeek : 1
    });

    /*
    $(".ui-listview").find('.event-item-link').die().live({
        click: function() {
            if ($(this).attr("rel")) {
                alert('Clicked event with ID: ' + $(this).attr("rel"));
            }
        },
    });
    */
});
