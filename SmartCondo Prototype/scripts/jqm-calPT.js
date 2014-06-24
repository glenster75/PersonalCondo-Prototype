(function($) {
	$.jqmCalendar = function(element, options) {
		var defaults = {
			events : [],
			begin : "start",
			end : "end",
			summary : "name",
			icon: "icon", // http://demos.jquerymobile.com/1.3.2/widgets/icons/
			url: "url",
			allDayTimeString: '',
			headerTheme : "b",
            theme : "b",
			dataTheme : "d",
			dividerTheme : "b",
			date : new Date(),
			dateFormatTitle : "dd MMMM, yyyy", // http://github.com/phstc/jquery-dateFormat
			dateFormat : "dd MMMM, yyyy", 
			version: "1.2.1",
			months : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
			days : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
			weeksInMonth : 6,
			startOfWeek : 1,
			listItemFormatter : listItemFormatter,
			monthItemsFormatter : monthItemsFormatter,
			transposeTimezone: transposeTimezone
		};
		var plugin = this;
			plugin.settings = null;
		var $element = $(element).addClass("jqm-cal-wrapper"),
			$table,
			$header,
			$tbody,
			$listview,
			$previous,
			$next;

		function init() {
			plugin.settings = $.extend({}, defaults, options);
			$table = $("<table/>");
			
			var $thead = $("<thead/>").appendTo($table),
				$tr = $("<tr/>").appendTo($thead),
				$th = $("<th class='ui-bar-" + plugin.settings.headerTheme + " header' colspan='7'/>");

			$previous = $("<a href='#' data-role='button' data-icon='arrow-l' data-iconpos='notext' class='previous-btn'>Anterior</a>")
						.data('date', _skipMonth(plugin.settings.date, -1))
						.appendTo($th);

			$header = $("<span/>").appendTo($th);

			$next = $("<a href='#' data-role='button' data-icon='arrow-r' data-iconpos='notext' class='next-btn'>Próximo</a>")
						.data('date', _skipMonth(plugin.settings.date, 1))
						.appendTo($th);

			$previous.click(function(event) { 
							var date = $(this).data('date');
							refresh(date, true);
							$next.data('date', _skipMonth(date, 1));
							$(this).data('date', _skipMonth(date, -1));
						});

			$next.click(function(event) { 
							var date = $(this).data('date');
							refresh(date, true);
							$previous.data('date', _skipMonth(date, -1));
							$(this).data('date', _skipMonth(date, 1));
						});

			$th.appendTo($tr);
			$tr = $("<tr/>").appendTo($thead);
			for ( var i = 0, days = [].concat(plugin.settings.days, plugin.settings.days).splice(plugin.settings.startOfWeek, 7); i < 7; i++ ) {
				$tr.append("<th class='ui-bar-" + plugin.settings.theme + " dayName'>"  + days[i] + "</th>");
			}
			$tbody = $("<tbody/>").appendTo($table);
			$table.appendTo($element);
			$listview = $("<ul data-role='listview' data-theme='" + plugin.settings.dataTheme + "' data-divider-theme='" + plugin.settings.dividerTheme + "' />").insertAfter($table);
			plugin.settings.transposeTimezone(plugin.settings.events);
			refresh(plugin.settings.date, true);    
		}

		function transposeTimezone(events){
			for(var i=0, event; event=plugin.settings.events[i];i++){
				plugin.settings.events[i].start = new Date(plugin.settings.events[i].start.getTime() - plugin.settings.events[i].start.getTimezoneOffset() + (new Date()).getTimezoneOffset()*60000);
				plugin.settings.events[i].end = new Date(plugin.settings.events[i].end.getTime() - plugin.settings.events[i].end.getTimezoneOffset() + (new Date()).getTimezoneOffset()*60000);
			}
		}

		function _skipMonth(date, month){
			return ( new Date(date.getFullYear(), date.getMonth()+month, 1) );
		}

		function _firstDayOfMonth(date) {
			return ( new Date(date.getFullYear(), date.getMonth(), 1) ).getDay();
		}

		function _daysBefore(date, fim) {
			var firstDayInMonth = ( fim || _firstDayOfMonth(date) ),
			diff = firstDayInMonth - plugin.settings.startOfWeek;
			return ( diff > 0 ) ? diff : ( 7 + diff );
		}

		function _daysInMonth(date) {
			return ( new Date ( date.getFullYear(), date.getMonth() + 1, 0 )).getDate();
		}

		function _daysAfter(date, wim, dim, db) {
			return    (( wim || _weeksInMonth(date) ) * 7 ) - ( dim || _daysInMonth(date) ) - ( db || _daysBefore(date));
		}

		function _weeksInMonth(date, dim, db) {
			return ( plugin.settings.weeksInMonth ) ? plugin.settings.weeksInMonth : Math.ceil( ( ( dim || _daysInMonth(date) ) + ( db || _daysBefore(date)) ) / 7 );
		}

		function addCell($row, date, hidden, selected) {
			var $td = $("<td class='ui-body-" + plugin.settings.theme + "'/>").appendTo($row),
				$a = $("<a href='#' class='ui-btn ui-btn-up-" + plugin.settings.theme + "'/>")
					.html(date.getDate().toString())
					.data('date', date)
					.click(cellClickHandler)
					.appendTo($td);
					
				if ( selected ) $a.click();
				if ( hidden ) {
					$td.addClass("lowres");
				} else {
					var importance = 0;

				for ( var i = 0, event, 
				begin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0), 
				end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
				event = plugin.settings.events[i]; i++ ) {
					
					if ( event[plugin.settings.end].getTime() >= begin.getTime() && event[plugin.settings.begin].getTime() < end.getTime() ) {
						importance++;
						break;
					}
				}

				if ( importance > 0 ) {
					$a.addClass("hasEvent");
				}
				var today = new Date();
				if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()){
					$a.addClass("ui-btn-today");
				}
			}
		}

		function cellClickHandler(event) {
			var $this = $(this),
				date = $this.data('date');
			$tbody.find("a.ui-btn-active").removeClass("ui-btn-active");
			$this.addClass("ui-btn-active");

			if ( date.getMonth() !== plugin.settings.date.getMonth() ) {
				refresh(date, false);
				$previous.data('date', _skipMonth(date, -1));
				$next.data('date', _skipMonth(date, 1));
			} else {
				$element.trigger('change', date);
			}
		}

		function refresh(date, userChangedMonth) {
			plugin.settings.date = date = date ||  plugin.settings.date || new Date();
			var year = date.getFullYear(),
				month = date.getMonth(),
				daysBefore = _daysBefore(date),
				daysInMonth = _daysInMonth(date),
				weeksInMonth = plugin.settings.weeksInMonth || _weeksInMonth(date, daysInMonth, daysBefore);

			if (((daysInMonth + daysBefore) / 7 ) - weeksInMonth === 0)
				weeksInMonth++;
			$tbody.empty();
			$header.html( plugin.settings.months[month] + " " + year.toString() );

			for (var weekIndex = 0,
				daysInMonthCount = 1,
				daysAfterCount = 1; weekIndex < weeksInMonth; weekIndex++ ) {

				var daysInWeekCount = 0,
					row = $("<tr/>").appendTo($tbody);

				while ( daysBefore > 0 ) {
					addCell(row, new Date(year, month, 1 - daysBefore), true);
					daysBefore--;
					daysInWeekCount++;
				}

				while ( daysInWeekCount < 7 && daysInMonthCount <= daysInMonth ) {
					addCell(row, new Date(year, month, daysInMonthCount), false, !userChangedMonth && daysInMonthCount === date.getDate() );
					daysInWeekCount++;
					daysInMonthCount++;
				}

				while ( daysInMonthCount > daysInMonth && daysInWeekCount < 7 ) {
					addCell(row, new Date(year, month, daysInMonth + daysAfterCount), true);
					daysInWeekCount++;
					daysAfterCount++;
				}
			}
            
            if(userChangedMonth)
				plugin.settings.monthItemsFormatter(eventsInMonth(date));

			$element.trigger('create');
		}

		function eventsInMonth(date){
			var events=[];
			for ( var i = 0, event, 
				begin = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0), 
				end = new Date(date.getFullYear(), date.getMonth(), _daysInMonth(date), 23, 59, 59, 999);
				event = plugin.settings.events[i]; i++ ) {

				if ( event[plugin.settings.end] >= begin && event[plugin.settings.begin] < end ) {
					events.push(event);
				}
			}
			events.sort(function(a, b) {
                return (a['start'] > b['start']) ? 1 : ((a['start'] < b['start']) ? -1 : 0);        			
    		});
			return events;
		}

		$element.bind('change', function(event, begin) {
			var end = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate() + 1, 0,0,0,0);
			var found = false;
			$listview.empty();
			$('<li data-role="list-divider">'+ DateFormat.format.date(begin, plugin.settings.dateFormatTitle) + '</li>').appendTo($listview);
			for ( var i = 0, event; event = plugin.settings.events[i]; i++ ) {
				if ( event[plugin.settings.end] >= begin && event[plugin.settings.begin] < end ) {
					var $listItem  = $("<li class='ui-event-item'><a href='#' class='event-item-link' rel='"+ event.eid +"'><h3></h3><p></p></a></li>").appendTo($listview);
					plugin.settings.listItemFormatter( $listItem, event );
					found = true;
				}
			}
			if(!found)
				var $listItem  = $("<li class='ui-event-item'><p style='padding-top:0.65em;'><strong>Nada marcado para esse dia.</strong></p></li>").appendTo($listview);
			$listview.trigger('create').filter(".ui-listview").listview('refresh');
		});

		function listItemFormatter($listItem, event) {
            $listItem.find('h3').append(event.name);
			var startDate = DateFormat.format.date(event.start, plugin.settings.dateFormat);
			var endDate = DateFormat.format.date(event.end, plugin.settings.dateFormat);
			if(startDate == endDate) {
				$listItem.find('p').append('<strong>' + event.summary + '</strong> </p><p>'+ startDate);
			} else {
				$listItem.find('p').append('<strong>' + event.summary + '</strong> </p><p>'+ startDate  + "&nbsp;&nbsp;&rarr;&nbsp;&nbsp;" + endDate);
			}
			if (event[plugin.settings.icon]) {
				$listItem.attr('data-icon', event.icon);
			}
		}

		function monthItemsFormatter(events){
			$listview.empty();
			if(events.length){
				var tr_date='';
				for ( var i = 0, event; event = events[i]; i++ ) {
					if ( tr_date != DateFormat.format.date(event.start, "yyyyMMMMdd")) {
						var $liDivider = $('<li data-role="list-divider">'+ DateFormat.format.date(event.start, plugin.settings.dateFormatTitle) +'</li>').appendTo($listview);
						tr_date = DateFormat.format.date(event.start, "yyyyMMMMdd");
					}
					var $listItem  = $("<li class='ui-event-item'><a href='#' class='event-item-link' rel='"+ event.eid +"'><h3></h3><p></p></a></li>").appendTo($listview);
					plugin.settings.listItemFormatter( $listItem, event );	
				}
			} else {
				var $listItem  = $("<li class='ui-event-item'><p style='padding-top:0.65em;'><strong>Nada maracado para esse mês.</strong></p></li>").appendTo($listview);
			}
			$listview.trigger('create').filter(".ui-listview").listview('refresh');
		}

		$element.bind('refresh', function(event, date) {
			refresh(date);
		});
		init();
	};

	$.fn.jqmCalendar = function(options) {
		return this.each(function() {
			if (!$(this).data('jqmCalendar')) {
				$(this).data('jqmCalendar', new $.jqmCalendar(this, options));
			}
		});
	};
})(jQuery);