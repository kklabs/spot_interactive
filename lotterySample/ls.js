
  // ********************************************************************
  //
  // Javascript for KKlabs' SPOT Beacon Lottery Sample 
  // Author: Geoffrey Wang
  //
  //  This sample code is under Apache License, Version 2.0 , 
  //    http://www.apache.org/licenses/LICENSE-2.0 
  //
  //  Please refer to http://www.spot.ms for detail of using SPOT Beacon.
  //
  //
  // ********************************************************************

var userData;

var userDataDefault = 
{
  "prized": null,
  "prizeSSN": null,
  "prizeDate": null
};



  // ********************************************************************
  //
  // section: global data
  //
  // ********************************************************************

  // ****  for library use
    var userId="";
    var localeId="zh_tw";
    var localStorageName = "lottrey-your-event-name";

  // ***** orientation change tracking
    var lastScreenWidth=0;

  // ticket falling animation control

   var ticketFallingAnimation=null;

  // ********************************************************************
  //
  // section: shared UI functions
  //
  // ********************************************************************

  function clearUserData()
  {
      window.localStorage.clear(); 
      userData = userDataDefault;
  }


  function saveUserData()
  {
     // remove the remark to enable the one-time-play mechanism 
     //  window.localStorage.setItem(localStorageName, JSON.stringify(userData));
  }


    function viewSizeChanged()
    {
      adjustMainAreaSize();
    }
  

    var detectedWidth=0;
    var detectedHeight=0;

    function adjustMainAreaSize()
    {

        $("body").hide();
        detectedWidth = $(window).width();
        detectedHeight = $(window).height();
        $("body").show();

        if(detectedWidth>detectedHeight)
        {
          $("#plzRotateArea").fadeIn();
        }
        else
        {
          $("#plzRotateArea").hide();

          var oriWidth = 299;
          var oriHeight = 138;

          var scale = detectedWidth/320;

          var oriHeight1 = 245;
          var oriWidth1 = 244;

          $("body").css("font-size", (12* scale)+"px" );
          $("#mainArea").css("width", detectedWidth+"px" );
          $("#mainArea").css("height", detectedHeight+"px" );
          $("#mainArea").css("background-size", detectedWidth+"px "+detectedHeight+"px" );

          $("#mainTitle").css("width", (oriWidth* scale)+"px" );
          $("#mainTitle").css("height", (oriHeight* scale)+"px" );
          $("#mainTitle").css("top",  (detectedHeight-((oriHeight+oriHeight1)* scale))/3 +"px");
          $("#mainTitle").css("left", (detectedWidth-(oriWidth* scale))/2 +"px");
          $("#mainTitle").css("background-size", (oriWidth* scale) +"px "+(oriHeight* scale) +"px");

          //$('#mainMessage').jqFloat("stop");

          $("#mainMessage").css("width", (oriWidth1* scale)+"px" );
          $("#mainMessage").css("height", (oriHeight1* scale)+"px" );
          $("#mainMessage").css("top",  (detectedHeight-((oriHeight+oriHeight1)* scale))/3*2+oriHeight* scale +"px");
          $("#mainMessage").css("left", (detectedWidth-(oriWidth1* scale))/2 +"px");
          $("#mainMessage").css("background-size", (oriWidth1* scale) +"px "+(oriHeight1* scale) +"px");

          $('#mainMessage').jqFloat({
            width: 50,
            height: 0,
            speed: 1000
          });

          //$('#mainMessage').jqFloat("play");

          oriHeight = 409;
          oriWidth = 289;

          $("#ticketResult").css("width", (oriWidth* scale)+"px" );
          $("#ticketResult").css("height", (oriHeight* scale)+"px" );
          $("#ticketResult").css("top",  (detectedHeight-(oriHeight* scale))/3*2 +"px");
          $("#ticketResult").css("left", (detectedWidth-(oriWidth* scale))/2 +"px");
          $("#ticketResult").css("background-size", (oriWidth* scale) +"px "+(oriHeight* scale) +"px");

           oriHeight1 = 180;
           oriWidth1 = 220;

          $("#ticketTop").css("width", (oriWidth1* scale)+"px" );
          $("#ticketTop").css("height", (oriHeight1* scale)+"px" );
          $("#ticketTop").attr("width", (oriWidth1* scale) );
          $("#ticketTop").attr("height", (oriHeight1* scale) );
          $("#ticketTop").css("top",  (detectedHeight-(oriHeight* scale))/3*2+(190*scale) +"px");
          $("#ticketTop").css("left", (detectedWidth-(oriWidth1* scale))/2 +"px");

          fillCoverArea();
          
          var oriHeight2 = 250;
          var oriWidth2 = 250;

          $("#ticketResultText").css("width", (oriWidth2* scale)+"px" );
          $("#ticketResultText").css("height", (oriHeight2* scale)+"px" );
          $("#ticketResultText").css("top",  (detectedHeight-(oriHeight* scale))/3*2+(180*scale) +"px");
          $("#ticketResultText").css("left", (detectedWidth-(oriWidth1* scale))/2 +"px");

          //$("#titleArea").css("background-size", $(window).height()+"px auto");
          //$("#titleArea").css("background-size",$(window).width()+80+"px auto");

          // updateTitleBgAni();
        }
    }

    var titleAniCounter=0;

    function updateTitleBgAni()
    {
      if(titleAniCounter==0)
      {
        // initial postion
        $("#titleArea").css("background-position","0px 0px");
        titleAniCounter++;
      }
      else if(titleAniCounter==80)
      {
        $("#titleArea").css("background-position",(titleAniCounter*-1)+"px "+(titleAniCounter*-1)+"px");
        titleAniCounter=0;
      }
      else
      {
        $("#titleArea").css("background-position",(titleAniCounter*-1)+"px "+(titleAniCounter*-1)+"px");
        titleAniCounter++
      }

      setTimeout(updateTitleBgAni,100)
    }



    function orientModeMonitor()
    {

      if(lastScreenWidth!=$(window).width())
      {
         console.log("orietation changed detected")
         viewSizeChanged();
         lastScreenWidth=$(window).width();
      }

      setTimeout(orientModeMonitor,1000);
    }

    // *** beacon detection handler  *********

  var beaconManager=new spotJsBEL();

  var isReceivedFlying = false;
  var isReceivedStopArea = false;

  beaconManager.onBeaconChanged(function(beaconData) { 

    console.log("beaconManager.isBLESupport()="+beaconManager.isBLESupport());

    var fgReceivedFlying = false;
    var fgReceivedStopArea = false;

    for(var j=0;j<beaconData.length;j++) 
    {    
        console.log("beacon received:"+beaconData[j].name);

        if( (beaconData[j].px==1 || beaconData[j].px==2 || beaconData[j].px==3 ) )
        {
            if(beaconData[j].name=="lotteryInArea")
            {
              fgReceivedFlying=true;
            }
            else if(beaconData[j].name=="lotteryStopArea")
            {
              fgReceivedStopArea=true;
            }
            
        }
        else if (beaconData[j].px==0 )
        {
            if(beaconData[j].name=="lotteryInArea")
            {
              fgReceivedFlying=false;
            }
            else if(beaconData[j].name=="lotteryStopArea")
            {
              fgReceivedStopArea=false;
            }
        }

    }

    isReceivedFlying = fgReceivedFlying;
    isReceivedStopArea = fgReceivedStopArea;

  });


  // ** ticket recover: not for public users

  var secretPass=0;
  var secretCounter=0;

  function clickCorner(event)
  {
    var posx = 0;
    var posy = 0;

    posx = event.originalEvent.touches[0].pageX;
    posy = event.originalEvent.touches[0].pageY;

    var shiftX = posx - $("#ticketResult").position().left;
    var shiftY = posy - $("#ticketResult").position().top;

    //console.log(" click="+shiftX+" "+shiftY);

    if(secretPass==0 && shiftX<50 && shiftY<50)
    {
      secretCounter++;
      console.log("secretCounter="+secretCounter);

      if(secretCounter==5)
      {
          secretCounter=0;
          secretPass=1;
      }
    }
    else if(secretPass==1 && shiftX>$("#ticketResult").width()-50 && shiftY<50)
    {
      secretCounter++;
      console.log("secretCounter="+secretCounter);   

      if(secretCounter==10)
      {
          secretCounter=0;
          secretPass=2;
          console.log("secretCounter Unlocked Success!");
          $("#ticketResult").fadeOut();
          clearUserData();   
      }   
    }
    else
    {
      secretCounter=0;
      secretPass=0;
    }
  }


  // ** mouse touch move event handler, to do scratch off

  var touchPointAarry=[];  // keep scratched points

  function paintOut(event)
  {
    var posx = 0;
    var posy = 0;
    /*
    if (!e) var e = window.event;
    if (e.pageX || e.pageY)
    {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)
    {
        posx = e.clientX;
        posy = e.clientY;
    }
    */

    posx = event.originalEvent.touches[0].pageX;
    posy = event.originalEvent.touches[0].pageY;

    var shiftX = posx - $("#ticketTop").position().left;
    var shiftY = posy - $("#ticketTop").position().top;

    //console.log(" paintOut="+shiftX+" "+shiftY);

    if(shiftX>=0 && shiftY>=0 && shiftX<=$("#ticketTop").width() && shiftY<=$("#ticketTop").height())
    {
        var canvas = document.getElementsByTagName("canvas")[0];
        var ctx = canvas.getContext("2d");

        // Erase some circles (draw them in 0,0,0,0);
        
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(shiftX-10, shiftY-10, 20, 0, Math.PI*2, true);
      
        var para = {x:shiftX, y:shiftY};

        touchPointAarry.push(para);

        ctx.fill();
    }

  }

  // ** fill / refill out the top cover area (銀漆)

  function fillCoverArea()
  {
      var canvas = document.getElementsByTagName("canvas")[0];
      var ctx = canvas.getContext("2d");

      // fill the canvas with black
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      // restore all points

      for(var i=0;i<touchPointAarry.length;i++)
      {
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(touchPointAarry[i].x-10, touchPointAarry[i].y-10, 20, 0, Math.PI*2, true);
        ctx.fill();
      }
  }
  
  // show lottry ticket result

  var prizeText1 = ["殘念！","恭喜得獎！"];
  var prizeText2 = ["請繼續支持!","請於本日活動結束前，"];
  var prizeText3 = ["下次幸運兒就是你。","至活動服務台兌換。"];

  function updateTicketContent()
  {
    $("#ticketResultText").html("<h2>"+prizeText1[userData.prized]+"</h2><p>"+prizeText2[userData.prized]+"</p><p>"+prizeText3[userData.prized]+"</p><h4>序號/"+userData.prizeSSN+"<br/>日期/"+userData.prizeDate+"</h4>");

  }

  var timerAutoOpen=null;

  function showTicket()
  {
    clearInterval(ticketFallingAnimation);

    // TO-DO determine if prize or not

    var isPrized=0;
    var ssn= viaductEssentailAPI.makeId(10);

    var luckNum = Math.random()*5000;

    if(luckNum<35)
    {
      isPrized=1;
    }

    userData.prized = isPrized;
    userData.prizeSSN = ssn;
    var dt = new Date();
    userData.prizeDate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    saveUserData();

    updateTicketContent();

    $("#mainTitle").hide();
    $("#mainMessage").hide();

    $("#ticketTop").show();

    $("#ticketResult").show();
    $("#ticketResultText").show();

    fillCoverArea();

    timerAutoOpen = setTimeout(function(){

      $("#ticketTop").fadeOut();

    },60000)

    $("#ticketTop").on('touchmove', function(e) {
          //$("#ticketTop").hide();

          paintOut(e);
          e.preventDefault();  
      });
   }

  function checkShowTicket()
  {
    console.log("checkShowTicket!");

    if(viaductEssentailAPI.getURLParameter("test")=="true" )
    {
      showTicket();
    }
    else
    {
        // location.href="viaduct://xcall?portaBeaconAPI.setAutoTriggerForceDisable(true);portaBeaconAPI.setCustomUserId('aaa')";
        if(beaconManager.isBLESupport()==true && isReceivedFlying==true && isReceivedStopArea==false && Math.random()>0.6)
        {
          showTicket();
        }
        else
          setTimeout(checkShowTicket, 500);
    }
    
  }

  var goTicketTime=0;
  var goTicketCounter=0;

  function fallingSnow(k) {
    
        if(beaconManager.isBLESupport()==false || isReceivedFlying==false || isReceivedStopArea==true)
          return;

        goTicketCounter++;

        if(goTicketCounter==goTicketTime)
          checkShowTicket();

        var $snowflakes = $(), qt = k;
        
        for (var i = 0; i < k; ++i) {
            var $snowflake = $('<div class="snowflakes ttype'+(i%5)+'"></div>');
            $snowflake.css({
                'left': (Math.random() * $('#mainArea').width()-50) + 'px',
                'top': (- Math.random() * $('#mainArea').height()*1.5-50) + 'px'
            });
            // add this snowflake to the set of snowflakes
            $snowflakes = $snowflakes.add($snowflake);
        }
        $('#mainArea').prepend($snowflakes);
    
        $snowflakes.animate({
            top: $('#mainArea').height()+"px",
            opacity : "0.2",
        }, Math.random() + 5000, function(){
            $(this).remove();
            // run again when all 20 snowflakes hit the floor
            //if (--qt < 1) 
            //    fallingSnow(20);
        });


    }
    

  $( window ).ready(function() {

      // disable all log for production 
      
      window.console = {
        log   : function(){},
        dir   : function(){},
        info  : function(){},
        error : function(){},
        warn  : function(){}
      };

      // start to minitor orientation change (workaround for iOS no detection in iFrame)
      lastScreenWidth=$(window).width();
      setTimeout(orientModeMonitor,1000);

      // == adjust UI to fix the window  ==
      adjustMainAreaSize();
      
      // = check local storage ==
      var beaconTicketUserDataPlain = window.localStorage.getItem(localStorageName);

      if(beaconTicketUserDataPlain==null)
        userData = userDataDefault;
      else 
        userData = JSON.parse(beaconTicketUserDataPlain); 
      
      // == ready to GO! show UI ================

      $("#initArea").fadeOut();

      if(userData.prized!=null)
      {
        // show already played

        $("#mainTitle").hide();
        $("#mainMessage").hide();

        updateTicketContent();
        $("#ticketResultText").show();
        $("#ticketResult").show();

        $("#ticketResult").on('touchstart', function(e) {
          //$("#ticketTop").hide();

           clickCorner(e);
           e.preventDefault();  
        });

      }
      else
      {
        // show not play yet

        $('#mainTitle').jqFloat({
          width: 50,
          height: 60,
          speed: 3000
        });

        beaconManager.init();

        var minWaitingTime = 5 ; // 最短等待時間(2秒)
        var maxWaitingTime = 10 ; // 最長等待時間(2秒)

        goTicketTime = Math.ceil(Math.random()*(maxWaitingTime+navigator.userAgent.length/30))+minWaitingTime ;

        fallingSnow(12);

        ticketFallingAnimation = setInterval(function(){ 

          var ticketNum = Math.ceil((Math.random()*10))+10;
          fallingSnow(ticketNum);

        }, 2000);

      }


      
  });

  