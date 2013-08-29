jQuery(document).ready(function($){
  var defaultDaysBefore = 7;
  
  /* Datepicker */
  var date = new Date();
  jQuery( "#sendgrid-start-date" ).datepicker({
    dateFormat: "yy-mm-dd",
    changeMonth: true,
    maxDate: _dateToYMD(new Date()),
    onClose: function( selectedDate ) {
      $( "#sendgrid-end-date" ).datepicker( "option", "minDate", selectedDate );
    }
  });
  var startDate = new Date(date.getFullYear(),date.getMonth(),date.getDate() - defaultDaysBefore);
  $('#sendgrid-start-date').datepicker("setDate", startDate);
  jQuery( "#sendgrid-end-date" ).datepicker({
    dateFormat: "yy-mm-dd",
    changeMonth: true,
    maxDate: _dateToYMD(new Date()),
    onClose: function( selectedDate ) {
      $( "#sendgrid-start-date" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
  var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
  $('#sendgrid-end-date').datepicker("setDate", endDate);
  
  /* Apply filter */
  jQuery("#sendgrid-apply-filter").click(function(event) {
    event.preventDefault();
    getStats(jQuery("#sendgrid-start-date").val(), jQuery("#sendgrid-end-date").val(), 'sendgrid_get_stats');
  });
  
  /* Chart responsive */
  jQuery("#collapse-menu, input[name='screen_columns']").click(function(event) {
    getStats(jQuery("#sendgrid-start-date").val(), jQuery("#sendgrid-end-date").val(), 'sendgrid_get_stats');
  });
  window.onresize = function(event) {
    getStats(jQuery("#sendgrid-start-date").val(), jQuery("#sendgrid-end-date").val(), 'sendgrid_get_stats');
  };
  
  /* Get Statistics and show chart */
  getStats(_dateToYMD(startDate), _dateToYMD(endDate), 'sendgrid_get_stats');
  function getStats(startDate, endDate, action)
  {
    $(".sendgrid-container .sendgrid-stats").html("");
    $(".sendgrid-container .loading").show();
    
    data = {
      action: action,
      start_date: startDate,
      end_date:   endDate,
      sendgrid_nonce: sendgrid_vars.sendgrid_nonce
    };

    $.post(ajaxurl, data, function(response) {
      var requestStats     = [];
      var deliveredStats   = [];
      var openStats        = [];
      var uniqueOpenStats  = [];
      var clickStats       = [];
      var uniqueClickStats = [];
      var unsubscribeStats = [];
      var bounceStats      = [];
      var spamreportStats  = [];
      var dropStats        = [];
      var blockStats     = [];

      var requests           = 0;
      var opens              = 0;
      var clicks             = 0;
      var deliveres          = 0;
      var bounces            = 0;
      var unsubscribes       = 0;
      var spamReports        = 0;
      var spamDrop           = 0;
      var repeatBounces      = 0;
      var repeatSpamreports  = 0;
      var repeatUnsubscribes = 0;
      var drops              = 0;
      var blocks             = 0;
      var uniqueOpens        = 0;

      response = jQuery.parseJSON(response);
      jQuery.each(response, function(key, value) {
        var dateString                = _splitDate(value.date);
        var date                      = Date.UTC(dateString[0], dateString[1], dateString[2]);
        var requestsThisDay           = value.requests ? value.requests : 0;
        var opensThisDay              = value.opens ? value.opens : 0;
        var clicksThisDay             = value.clicks ? value.clicks : 0;
        var deliveresThisDay          = value.delivered ? value.delivered : 0;
        var uniqueOpensThisDay        = value.unique_opens ? value.unique_opens : 0;
        var uniqueClicksThisDay       = value.unique_clicks ? value.unique_clicks : 0;
        var unsubscribersThisDay      = value.unsubscribes ? value.unsubscribes : 0;
        var bouncesThisDay            = value.bounces ? value.bounces : 0;
        var spamReportsThisDay        = value.spamreports ? value.spamreports : 0;
        var spamDropThisDay           = value.spam_drop ? value.spam_drop : 0;
        var repeatBouncesThisDay      = value.repeat_bounces ? value.repeat_bounces : 0;
        var repeatSpamreportsThisDay  = value.repeat_spamreports ? value.repeat_spamreports : 0;
        var repeatUnsubscribesThisDay = value.repeat_unsubscribes ? value.repeat_unsubscribes : 0;
        var blocksThisDay = value.blocked ? value.blocked : 0;

        requests           += requestsThisDay;
        deliveres          += deliveresThisDay;
        opens              += opensThisDay;
        clicks             += clicksThisDay;
        bounces            += bouncesThisDay;
        unsubscribes       += unsubscribersThisDay;
        spamReports        += spamReportsThisDay;
        spamDrop           += spamDropThisDay;
        repeatBounces      += repeatBouncesThisDay;
        repeatSpamreports  += repeatSpamreportsThisDay;
        repeatUnsubscribes += repeatUnsubscribesThisDay;
        drops              += spamDrop + repeatBounces + repeatSpamreports + repeatUnsubscribes;
        blocks             += blocksThisDay;
        uniqueOpens        += uniqueOpensThisDay;
       
        requestStats.push([date, requestsThisDay]);
        deliveredStats.push([date, deliveresThisDay]);
        openStats.push([date, opensThisDay]);
        uniqueOpenStats.push([date, uniqueOpensThisDay]);
        clickStats.push([date, clicksThisDay]);
        uniqueClickStats.push([date, uniqueClicksThisDay]);
        unsubscribeStats.push([date, unsubscribersThisDay]);
        bounceStats.push([date, bouncesThisDay]);
        spamreportStats.push([date, spamReportsThisDay]);
        dropStats.push([date, repeatUnsubscribesThisDay]);
        blockStats.push([date, blocksThisDay]);
      });
      
      // Config chart
      var dataDeliveries = [
        {
          label : 'Requests',
          data  : requestStats,
          points: { symbol: "circle" }
        },
        {
          label : 'Drops',
          data  : dropStats,
          points: { symbol: "square" }
        },
        {
          label : 'Delivered',
          data  : deliveredStats,
          points: { symbol: "diamond" }
        }];
      
      var dataCompliance = [
        {
          label : 'Spam reports',
          data  : spamreportStats,
          points: { symbol: "circle" }
        },
        {
          label : 'Bounces',
          data  : bounceStats,
          points: { symbol: "square" }
        },
        {
          label : 'Blocked',
          data  : blockStats,
          points: { symbol: "diamond" }
        }
      ];
      
      var dataEngagement = [
        {
          label : 'Unsubscribes',
          data  : unsubscribeStats,
          points: { symbol: "diamond" }
        },
        {
          label : 'Unique Opens',
          data  : uniqueOpenStats,
          points: { symbol: "triangle" }
        },
        {
          label : 'Opens',
          data  : openStats,
          points: { symbol: "square" }
        },
        {
          label : 'Clicks',
          data  : clickStats,
          points: { symbol: "cross" }
        }
      ];

      showChart("#deliveries-container", "#deliveries-container-legend", startDate, 
                endDate, dataDeliveries, ["#328701", "#bcd516", "#fba617"]);
      showChart("#compliance-container", "#compliance-container-legend", startDate, 
                endDate, dataCompliance, ["#fbe500", "#1185c1", "#bcd0d1"]);
      showChart("#engagement-container", "#engagement-container-legend", startDate, 
                endDate, dataEngagement, ["#3e44c0", "#ff00e0", "#e04428", "#328701"]);          
      
      /* Show info in widgets */
      /* Deliveries */
      var dropsRate        = _round(((drops * 100) / requests), 2) + "%";
      var deliveresRate    = _round(((deliveres * 100) / requests), 2) + "%";
      $(".sendgrid-container #deliveries #requests").html(requests);
      $(".sendgrid-container #deliveries #drop").html((dropsRate === "NaN%") ? "0%" : dropsRate);
      $(".sendgrid-container #deliveries #delivered").html((deliveresRate === "NaN%") ? "0%" : deliveresRate);
      
      /* Compliance */
      var spamReportsRate  = _round(((spamReports * 100) / deliveres), 2) + "%";
      var bouncesRate      = _round(((bounces * 100) / deliveres), 2) + "%";
      var blocksRate      = _round(((blocks * 100) / requests), 2) + "%";
      $(".sendgrid-container #compliance #spam-reports").html((spamReportsRate === "NaN%") ? "0%" : spamReportsRate);
      $(".sendgrid-container #compliance #bounces").html((bouncesRate === "NaN%") ? "0%" : bouncesRate);
      $(".sendgrid-container #compliance #blocks").html((blocksRate === "NaN%") ? "0%" : blocksRate);
      
      /* Engagement */
      var unsubscribesRate = _round(((unsubscribes * 100) / deliveres), 2) + "%";
      var uniqueOpensRate  = _round(((uniqueOpens * 100) / deliveres), 2) + "%";
      var opensRate        = _round(((opens * 100) / deliveres), 2) + "%";
      var clicksRate       = _round(((clicks * 100) / deliveres), 2) + "%";
      $(".sendgrid-container #engagement #unsubscribes").html((unsubscribesRate === "NaN%") ? "0%" : unsubscribesRate);
      $(".sendgrid-container #engagement #unique-opens").html((uniqueOpensRate === "NaN%") ? "0%" : uniqueOpensRate);
      $(".sendgrid-container #engagement #opens").html((opensRate === "NaN%") ? "0%" : opensRate);
      $(".sendgrid-container #engagement #clicks").html((clicksRate === "NaN%") ? "0%" : clicksRate);
      
      $(".sendgrid-container .loading").hide();
    });
  }
  
  /* Display chart function */
  function showChart(cssSelector, legendSelector, startDate, endDate, data, colors)
  {
    var startDateArray = _splitDate(startDate);
    var endDateArray = _splitDate(endDate);

    $.plot(cssSelector, data, {
        xaxis: {
          mode: "time",
          minTickSize: [1, "day"],
          tickLength: 0,
          min: Date.UTC(startDateArray[0], startDateArray[1], startDateArray[2]),
          max: Date.UTC(endDateArray[0], endDateArray[1], endDateArray[2]),
          timeformat: "%b %d",
          reserveSpace: true,
          labelWidth: 50
        },
        series: {
            lines: { show: true },
            points: { 
              radius: 4,
              show: true
            }
        },
        grid: {
          hoverable: true,
          borderWidth: 0
        },
        legend: {
          noColumns: 0,
          container: $(legendSelector)
        },
        //colors: ["#328701", "#bcd516", "#fba617", "#fbe500", "#1185c1", "#bcd0d1", "#3e44c0", "#ff00e0", "#e04428"]
        colors: colors
    });
    showInfo();
  }
  
  /* Flop chart tooltop */
  function showInfo()
  {
    var previousPoint = null;
    var previousLabel = null;

    $("#sendgrid-stats").bind("plothover", function (event, pos, item) {
      if (item) {
        if ((previousPoint !== item.dataIndex) || (previousLabel !== item.series.label)) {
          previousPoint = item.dataIndex;
          previousLabel = item.series.label;

          $("#flot-tooltip").remove();
          var date = _convertMonthToString(item.datapoint[0]);
          var value = item.datapoint[1];
          var color = item.series.color;

          showTooltip(item.pageX, item.pageY, 
                      "<b>" + date + "</b><br />" + item.series.label + ": " + value ,
                      color);
          }
      } else {
          $("#flot-tooltip").remove();
          previousPoint = null;
      }
    });
  }

  function showTooltip(x, y, contents, z) 
  {
    $('<div id="flot-tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 30,
        left: x + 30,
        border: '2px solid',
        padding: '2px',
        'background-color': '#FFF',
        opacity: 0.80,
        'border-color': z,
        '-moz-border-radius': '5px',
        '-webkit-border-radius': '5px',
        '-khtml-border-radius': '5px',
        'border-radius': '5px'
      }).appendTo("body").fadeIn(200);
  }
  
  /**** Helpers ****/
  function _round(value, places) 
  {
    var multiplier = Math.pow(10, places);

    return (Math.round(value * multiplier) / multiplier);
  }
  
  function _dateToYMD(date) 
  {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }
  
  function _convertMonthToString(timestamp) 
  {
    var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var newDate = new Date(timestamp);
    var dateString = month_names[newDate.getMonth()] + " " + newDate.getDate();

    return dateString;
  }
  
  function _splitDate(date) 
  {
    return date.split("-");
  }
});