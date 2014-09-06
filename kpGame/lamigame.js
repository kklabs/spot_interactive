
  // ********************************************************************
  //
  // Javascript for readmooolove-app local
  // Author: Geoffrey Wang
  //
  // local function for readmoo html5 App
  // 
  // v1.0  fisrt release
  //
  //
  // ********************************************************************

var userData;

var userDataDefault = 
{
  "prized": null,
  "prizeSSN": null,
  "prizeDate": null,
  "gameProcessStep":0
};

// http://maps.apple.com/?q=


  // ********************************************************************
  //
  // section: global data
  //
  // ********************************************************************

  // ****  for library use
    var userId="";
    var localeId="zh_tw";

  // *****

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
      window.localStorage.setItem('beaconGameData', JSON.stringify(userData));
  }


    function viewSizeChanged()
    {
      adjustMainAreaSize();
    }
  
    function adjustMainAreaSize()
    {

        if($(window).width()>$(window).height())
        {
          $("#plzRotateArea").fadeIn();
        }
        else
        {
          $("#plzRotateArea").fadeOut();

          var oriWidth = 293;
          var oriHeight = 93;

          var scale = $(window).width()/320;

          var oriWidth1 = 293;
          var oriHeight1 = 308;


          $("body").css("font-size", (12* scale)+"px" );

          $("#mainTitle").css("width", (oriWidth* scale)+"px" );
          $("#mainTitle").css("height", (oriHeight* scale)+"px" );
          $("#mainTitle").css("top",  ($(window).height()-415*scale)/3 +"px");
          $("#mainTitle").css("left", ($(window).width()-(oriWidth* scale))/2 +"px");
          $("#mainTitle").css("background-size", (oriWidth* scale) +"px "+(oriHeight* scale) +"px");

          $(".msgbox").css("width", (oriWidth1* scale)+"px" );
          $(".msgbox").css("height", (oriHeight1* scale)+"px" );
          $(".msgbox").css("top",  ($(window).height()-(415* scale))/3+oriHeight* scale +"px");
          $(".msgbox").css("left", ($(window).width()-(oriWidth1* scale))/2 +"px");
          $(".msgbox").css("background-size", (oriWidth1* scale) +"px "+(oriHeight1* scale) +"px");

          $(".btnArea").css("top",  ($(window).height()-(415* scale))/4+((oriHeight+oriHeight1)* scale) +"px");

          oriWidth = 142;
          oriHeight = 49;

          $("#btnStart").css("width", (oriWidth* scale)+"px" );
          $("#btnStart").css("height", (oriHeight* scale)+"px" );
          $("#btnStart").css("background-size", (oriWidth* scale) +"px "+(oriHeight* scale) +"px");
          $("#btnStart").css("left", ($(window).width()-(oriWidth* scale))/2 +"px");

          updateTitleBgAni();
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

    var orientModeValue=0;
    
    function orientModeMonitor()
    {
      var newOrientModeValue=0;

      if($(window).width()<$(window).height())
      {
        newOrientModeValue=1;
      }

      if(newOrientModeValue!=orientModeValue)
      {
         console.log("orietation changed detected")
         viewSizeChanged();
         orientModeValue = newOrientModeValue;
      }

      setTimeout(orientModeMonitor,1000);
    }

  var beaconManager=new spotJsBEL();

  var isReceivedGameStart = false;
  var isInArea=[false,false,false,false,false,false,false];

  // STEP 0 --  before game begin

  function hideAll()
  {
      $(".msgbox").hide();
      $(".btnArea").hide();    
  }

  function showGoBeginPoint()
  {
    hideAll();
    $("#go2begin").fadeIn();

  }

  function showBeginPoint()
  {
    hideAll();
    $("#click2begin").fadeIn();
    $("#btnStart").fadeIn();
  }

  function showByGameStatus()
  {
    // STEP 0: before game begin
    if(userData.gameProcessStep==0)
    {
      if(isInArea[0]==false)
      {
        showGoBeginPoint();
      }
      else
      {
        showBeginPoint();
      }
    }
    
  }

  beaconManager.onBeaconChanged(function(beaconData) { 

    console.log("beaconManager.isBLESupport()="+beaconManager.isBLESupport());

    var fgReceivedGameStart = false;
    var fgInArea=[false,false,false,false,false,false,false];

    for(var j=0;j<beaconData.length;j++) 
    {    
        console.log("beacon received:"+beaconData[j].name+" px="+beaconData[j].px);

        if( (beaconData[j].px==1 || beaconData[j].px==2  ) )
        {
            if(beaconData[j].name=="gameSPGo")
            {
              fgReceivedGameStart=true;
            }
            else if(beaconData[j].name=="gameSP")
            {
              fgInArea[0]=true;
            }
            else if(beaconData[j].name=="gameP1")
            {
              fgInArea[1]=true;
            }
            else if(beaconData[j].name=="gameP2")
            {
              fgInArea[2]=true;
            }
            else if(beaconData[j].name=="gameP3")
            {
              fgInArea[3]=true;
            }
            else if(beaconData[j].name=="gameP4")
            {
              fgInArea[4]=true;
            }
            else if(beaconData[j].name=="gameP5")
            {
              fgInArea[5]=true;
            }
            else if(beaconData[j].name=="gameP6")
            {
              fgInArea[6]=true;
            }
            
            
        }
        else if (beaconData[j].px==0 || beaconData[j].px==3 )
        {
            if(beaconData[j].name=="gameSPGo")
            {
              fgReceivedGameStart=false;
            }
            else if(beaconData[j].name=="gameSP")
            {
              fgInArea[0]=false;
            }
            else if(beaconData[j].name=="gameP1")
            {
              fgInArea[1]=false;
            }
            else if(beaconData[j].name=="gameP2")
            {
              fgInArea[2]=false;
            }
            else if(beaconData[j].name=="gameP3")
            {
              fgInArea[3]=false;
            }
            else if(beaconData[j].name=="gameP4")
            {
              fgInArea[4]=false;
            }
            else if(beaconData[j].name=="gameP5")
            {
              fgInArea[5]=false;
            }
            else if(beaconData[j].name=="gameP6")
            {
              fgInArea[6]=false;
            }

        }

    }

    isReceivedGameStart = fgReceivedGameStart;

    isInArea[0] = fgInArea[0];
    isInArea[1] = fgInArea[1];
    isInArea[2] = fgInArea[2];
    isInArea[3] = fgInArea[3];
    isInArea[4] = fgInArea[4];
    isInArea[5] = fgInArea[5];
    isInArea[6] = fgInArea[6];

    showByGameStatus();

  });

  $( window ).ready(function() {

      
      if($(window).width()<$(window).height())
         orientModeValue=1;

      setTimeout(orientModeMonitor,1000);

      // == adjust UI to fix the window  ===================
      adjustMainAreaSize();
      
      // check local storage
      
      var beaconTicketUserDataPlain = window.localStorage.getItem('beaconGameData');

      if(beaconTicketUserDataPlain==null)
        userData = userDataDefault;
      else 
        userData = JSON.parse(beaconTicketUserDataPlain); 
      
      // == ready to GO!  ===================

      $("#initArea").fadeOut();

      if(userData.prized !=null)
      {
        // show prize

      }
      else
      {
        beaconManager.init();

        showByGameStatus();
        
      }

      /*
      if(  navigator.userAgent.search('Android')!=-1 || navigator.userAgent.search('iPhone')!=-1 || navigator.userAgent.search('iPad')!=-1  )
      {
        location.href="viaduct://xcall?portaBeaconAPI.setAutoTriggerForceDisable(true);portaBeaconAPI.setCustomUserId('aaa')";
      }
      // Disable console log for production
      */

      /*
  
      window.console = {
        log   : function(){},
        dir   : function(){},
        info  : function(){},
        error : function(){},
        warn  : function(){}
      };
      */
  });

  