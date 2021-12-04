
const prvo = document.getElementById('prvo');
const dva = document.getElementById('dva');
const tri = document.getElementById('tri');
const cetiri = document.getElementById('cetiri');


prvo.addEventListener('click', myFunction1);
dva.addEventListener('click', myFunction2);
tri.addEventListener('click', myFunction3);
cetiri.addEventListener('click', myFunction4);

function myFunction1() {
    document.getElementById('eden').style.width = "102rem";
    document.getElementById('dva').style.width = "6rem";
    document.getElementById('tri').style.width = "6rem";
    document.getElementById('cetiri').style.width = "6rem";

    document.getElementById('prvo').style.display = "none";
    document.getElementById('vtoro').style.display = "grid";
    document.getElementById('treto').style.display = "grid";
    document.getElementById('cetvrto').style.display = "grid";
  
    
  
  };

  function myFunction2() {
    document.getElementById('dva').style.width = "102rem";
    document.getElementById('eden').style.width = "6rem";
    document.getElementById('tri').style.width = "6rem";
    document.getElementById('cetiri').style.width = "6rem";

    document.getElementById('prvo').style.display = "grid";
    document.getElementById('vtoro').style.display = "none";
    document.getElementById('treto').style.display = "grid";
    document.getElementById('cetvrto').style.display = "grid";

 

    //document.getElementById('prvo').style.width = "100%";
    

  };

  function myFunction3() {
    document.getElementById('eden').style.width = "6rem";
    document.getElementById('dva').style.width = "6rem";
    document.getElementById('tri').style.width = "102rem";
    document.getElementById('cetiri').style.width = "6rem";


    document.getElementById('vtoro').style.display = "grid";
    document.getElementById('prvo').style.display = "grid";
    document.getElementById('treto').style.display = "none";
    document.getElementById('cetvrto').style.display = "grid";

  };
  
  function myFunction4() {
    document.getElementById('eden').style.width = "6rem";
    document.getElementById('dva').style.width = "6rem";
    document.getElementById('tri').style.width = "6rem";
    document.getElementById('cetiri').style.width = "102rem";

    document.getElementById('prvo').style.display = "grid";
    document.getElementById('vtoro').style.display = "grid";
    document.getElementById('treto').style.display = "grid";
    document.getElementById('cetvrto').style.display = "none";


  };


