
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

          $(".msgbox").css("width", ((oriWidth1-100)* scale)+"px" );
          $(".msgbox").css("height", ((oriHeight1-130)* scale)+"px" );
          $(".msgbox").css("top",  ($(window).height()-(415* scale))/3+oriHeight* scale +"px");
          $(".msgbox").css("left", ($(window).width()-(oriWidth1* scale))/2 +"px");
          $(".msgbox").css("background-size", (oriWidth1* scale) +"px "+(oriHeight1* scale) +"px");

          $(".btnArea").css("top",  ($(window).height()-(415* scale))/4+((oriHeight+oriHeight1)* scale) +"px");

          oriWidth = 142;
          oriHeight = 49;

          $("#btnStart, #btnReStart").css("width", (oriWidth* scale)+"px" );
          $("#btnStart, #btnReStart").css("height", (oriHeight* scale)+"px" );
          $("#btnStart, #btnReStart").css("background-size", (oriWidth* scale) +"px "+(oriHeight* scale) +"px");
          $("#btnStart, #btnReStart").css("left", ($(window).width()-(oriWidth* scale))/2 +"px");

        }
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
      var API_SERVER = "http://api.kptaipei.tw/v1/";
      var posts = [];

  // STEP 0 --  before game begin
  function hideAll()
  {
      $(".msgbox").hide();
      $(".btnArea").hide();    
  }

  function showBeginPoint()
  {
    hideAll();
    $("#click2begin").fadeIn();
    $("#btnStart").fadeIn();
  }

  function gameStart()
  {
    hideAll();
    userData.gameProcessStep=1;
  }

  function showKPTalk()
  {
    hideAll();
    $("#kpTalk").fadeIn();
    updateKpTalkContent();

    $("#btnReStart").fadeIn();
    


  }

  function updateKpTalkContent()
  {
    if(posts.length==0)
      return;

    var selectedPost = Math.floor(posts.length * Math.random());

    if(selectedPost>=0 && selectedPost<posts.length)
      $("#kpTalk").html("<h2>"+posts[selectedPost].title+"</h2><p>"+posts[selectedPost].plain_content+"</p>");

  }

  var KPDistance=0;

  function showByGameStatus()
  {
    // STEP 0: before game begin
    console.log("showByGameStatus="+KPDistance);

    if(userData.gameProcessStep==0)
    {
      showBeginPoint();
    }
    else if(userData.gameProcessStep==1 && (KPDistance==1 || KPDistance==2) )
    {
      showKPTalk();
    }

    
  }

  beaconManager.onBeaconChanged(function(beaconData) { 

    console.log("beaconManager.isBLESupport()="+beaconManager.isBLESupport());

    KPDistance=0;

    for(var j=0;j<beaconData.length;j++) 
    {    
        console.log("beacon received:"+beaconData[j].name+" px="+beaconData[j].px);

        if(beaconData[j].name=="KP")
        {
          KPDistance = beaconData[j].px;
        }

    }

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
      

      $.get(API_SERVER+"category/40?accessToken=kp53f56da91f5506.26519937",function(results){

        $.each(results.data,function(ind,item){
          posts.push(item);
        });
      });


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
  
      window.console = {
        log   : function(){},
        dir   : function(){},
        info  : function(){},
        error : function(){},
        warn  : function(){}
      };
      */
  });

  