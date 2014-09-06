

  // ********************************************************************
  //
  // Javascript for Viaduct_essential_lib
  // Author: Geoffrey Wang
  // v0.2 (2014/9/3)
  //
  // provide common and useful javascript function to kklabs html5 project

  // API List:
  //
  //  - makeId
  //  - getURLParameter
  //  - callNativeMethod
  //  - audioPlayByUrl
  //  - audioPlayChannel02
  //  - adjustImgFitInParent
  // 
  // resivion:
  //   v0.1:    split from kk7common.js (porta project)
  //
  // ********************************************************************

  
  function viaductEssentail()
  {

      var myAudioChannel1;
      var myAudioChannel1playingCallback;
      var myAudioChannel1errCallback;
      var myAudioChannel2=null;

      // API function: adjustImgFitInParent

      this.adjustImgFitInParent = function (name)
      { 

          var outterWidth=0;
          var otterHeight=0;
          if($(name).parent().parent().prop("tagName")=="BODY")
          {
            outterWidth = $(window).width();
            otterHeight = $(window).height();
          }
          else
          {
            outterWidth = $(name).parent().parent().width();
            otterHeight = $(name).parent().parent().height();
          }

          console.log("adjustImgFitInParent="+outterWidth);
          //console.log("adjustImgFitInParent()="+name);
          if($(name).width() > $(name).height())
          {
            // for landscape resource

            if(( outterWidth / otterHeight )>($(name).width()/$(name).height()))
            {
               
               $(name).css("width",outterWidth+"px");
               $(name).css("height","auto");
               $(name).parent().css("top","-"+ ($(name).height()-otterHeight)/2+"px");
               $(name).parent().css("left","0px");
            }
            else 
            {
               $(name).css("height",otterHeight+"px");
               $(name).css("width","auto");
               $(name).parent().css("left","-"+ ($(name).width()-outterWidth)/2+"px");
               $(name).parent().css("top","0px");
            }
          }
          else
          {
            // for portrait resource
            //console.log("start to adjust portrait resource:"+name+" img ratio="+($(name).height()/$(name).width())+" screen ratio="+(outterWidth/otterHeight));

            if( (otterHeight / outterWidth )>($(name).height()/$(name).width()))
            {  

             $(name).css("width","auto");
             $(name).css("height",otterHeight+"px");
             $(name).parent().css("left","-"+ ($(name).width()-outterWidth )/2+"px");
             $(name).parent().css("top","0px");
            }
            else
            {
              
             $(name).css("width",outterWidth+"px");
             $(name).css("height","auto");
             $(name).parent().css("top","-"+ ($(name).height()-otterHeight )/2+"px");
             $(name).parent().css("left","0px");


            }
          }

          $(name).parent().css("height",$(name).height()+"px");
          $(name).parent().css("width",$(name).width()+"px");

      }
      // API function: this.getURLParameter
      this.getURLParameter =function (name) 
      {
        return decodeURI(
                  (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
              );
      };

      // API function: callNativeMethod
      this.callNativeMethod =function (m)
      { 
            console.log(m+" called");
            
            // determine if mobile device webview
            if( this.getURLParameter("simu")=="null" && ( navigator.userAgent.search('Android')!=-1 || navigator.userAgent.search('iPhone')!=-1 || navigator.userAgent.search('iPad')!=-1 ) )
            {
              location.href="viaduct://"+m;
            }
            else
            {

                if(m=="startBeaconDetect")
                {
                    // simulator BLE device
                    /*
                    portaBeaconAPI.setBLEStatus(1);

                    if(this.getURLParameter("bid")!="null" && this.getURLParameter("px")!="null"){
                      var param = [{
                        id:this.getURLParameter("bid"),
                        px:this.getURLParameter("px"),
                      }];
                      portaBeaconAPI.updateBeaconList(param);
                    }
                      //portaBeaconAPI.updateBeaconList([{"id":this.getURLParameter("bid"),"px":2}]);
                    else
                      portaBeaconAPI.updateBeaconList([]);
                    */
                    

                }
            }
      
      };

      // API section: audio: this.audioPlayByUrl (dynamic ) / audioPlayChannel02 (static)
  
      // API function: audioPlayByUrl
      this.audioPlayByUrl = function (url, onplayfunction,onerrfunction)
      {
         this.audioStop();
         
         if(myAudioChannel1 == null)
         {
              myAudioChannel1 = document.getElementById("audioChannel01");
              myAudioChannel1.addEventListener('canplaythrough', 
                function() {
                   myAudioChannel1.play();
                 }
              , false);

              myAudioChannel1.addEventListener('playing', 
                function() {
                   if(myAudioChannel1playingCallback!=null)
                    myAudioChannel1playingCallback();
                 }
              , false);

              myAudioChannel1.addEventListener('error', 
                function() {
                   console.log("audio playback error!");
                   if(myAudioChannel1errCallback!=null)
                        myAudioChannel1errCallback();
                 }
              , false);
          }
         

         myAudioChannel1.src = url;
         myAudioChannel1playingCallback = onplayfunction;
         myAudioChannel1errCallback = onerrfunction;
         myAudioChannel1.load();
      }


      // API: audioPlayChannel02
      this.audioPlayChannel02 = function()
      {   
         if(myAudioChannel2 == null)
              myAudioChannel2 = document.getElementById("audioChannel02");

          myAudioChannel2.play();
      }


      // API function: audioStop
     this.audioStop = function ()
     {
            if(myAudioChannel1 !=null )
            {
               if(myAudioChannel1.readyState>1 && myAudioChannel1.paused==false)
               {
                 myAudioChannel1.currentTime=0;
                 myAudioChannel1.pause();
               }
               else
               {
                 myAudioChannel1.pause();
               }
             }

            if(myAudioChannel2 !=null )
            {
               if(myAudioChannel2.readyState>1 && myAudioChannel2.paused==false)
               {
                 myAudioChannel2.currentTime=0;
                 myAudioChannel2.pause();
               }
               else
               {
                 myAudioChannel2.pause();
               }
             }
      }


      this.makeId =  function (n)
      {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for( var i=0; i < n; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
      }

  }

  // load library
  var viaductEssentailAPI = new viaductEssentail();


  