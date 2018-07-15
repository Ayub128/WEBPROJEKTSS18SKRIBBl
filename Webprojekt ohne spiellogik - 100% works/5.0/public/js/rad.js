   var minRad=0.5,
      maxRad=100,
      defRad=5,
      interval=5;
      radSpan=document.getElementById("radval"),
      decrRad=document.getElementById("decrrad"),
      incRad=document.getElementById("incrrad"),;

  var setRadius = function(newRadius){
    if(newRadius<minRad)
      newRadius=minRad;
    else if(newRadius>maxRad)
      newRadius=maxRad;
    radius=newRadius;
    context.lineWidth=radius*2;
    radSpan.innerHTML=radius;
  }

  decrRad.addEventListener("click" ,function(){
    setRadius(radius-interval);
  });
  incRad.addEventListener("click",function(){
    setRadius(radius+interval);
  });
