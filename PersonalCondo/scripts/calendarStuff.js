$( document ).ready(function() {
    var date0 = new Date();
    var date1 = new Date();
    var date2 = new Date();
    var date3 = new Date();
    var date4 = new Date();
    var date5 = new Date();
    var date6 = new Date();
    var date7 = new Date();
    var date8 = new Date();
    var date9 = new Date();

    date0.setDate(date0.getDate() - 0);
    //date1.setDate(date1.getDate() - 30);
    date1.setDate(date1.getDate() + 30);
    //date2.setDate(date2.getDate() - 15);
    date2.setDate(date2.getDate() + 15);
    //date3.setDate(date3.getDate() - 13);
    date3.setDate(date3.getDate() + 13);
    //date4.setDate(date4.getDate() - 3);
    date4.setDate(date4.getDate() + 3);
    date5.setDate(date5.getDate() + 5);
    date6.setDate(date6.getDate() + 6);
    date7.setDate(date7.getDate() + 12);
    date8.setDate(date8.getDate() + 31);
    date9.setDate(date9.getDate() + 38);

    var calEvents = [
    	{"icon": "bars","eid":"someID 1","name":"Festa de Aniversário","url":"#","start":date0/*new Date("2014-02-10T08:00:00.000Z")*/,"end":date0/*new Date("2014-02-10T10:00:00.000Z")*/,"summary":"Das 13 às 15 Hrs (Faltando Assinatura)"},
    	{"eid":"someID 1","name":"Formatura","url":"#","start":date0/*new Date("2014-02-10T17:00:00.000Z")*/,"end":date0/*new Date("2014-02-10T18:00:00.000Z")*/,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"eid":"someID 1","name":"Festa","url":"#","start":date1,"end":date1,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"icon": "info","eid":"SomeID 2","name":"Formatura","url":"#","start":date2,"end":date2,"summary":"Das 15 às 18 Hrs (Não Confirmado)"},
    	{"eid":"SomeID 3","name":"Festa","url":"#","start":date3,"end":date3,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"eid":"SomeID 3","name":"Festa","url":"#","start":date4,"end":date4,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"icon": "alert","eid":"SomeID 4","name":"Festa","url":"#","start":date5,"end":date5,"summary":"Das 15 às 18 Hrs (Reserva Enviada)"},
    	{"eid":"SomeID 5","name":"Festa","url":"#","start":date6,"end":date6,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"eid":"SomeID 5","name":"Festa","url":"#","start":date7,"end":date7,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"eid":"SomeID 6","name":"Festa","url":"#","start":date8,"end":date8,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    	{"eid":"SomeID 7","name":"Festa","url":"#","start":date9,"end":date9,"summary":"Das 16 às 18 Hrs (Confirmado)"},
    ];


    $("#calendar").jqmCalendar({
        events : calEvents,
        months : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
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
