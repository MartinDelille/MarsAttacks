window.jQuery && window.google && (function($, google) {
    var worker,
        jCounterNextAttack,
        jCounterAlienWin,
        centerMap,
        areaToProtect,
        alienWin = 0,

        aliens = [];
    
    // Private functions
    function initializeCounterNextAttack() {
        worker = new Worker("./js/aliens-worker.js");
        worker.addEventListener("message", function(event) {
            switch(event.data.type){
                case "tick":
                    jCounterNextAttack.text(event.data.value + "s");
                    break;
                    
                case "attack":
                    window.setTimeout(attack, 0); // Delay treatment !
                    break;
            }
          
        }, false);
    }
    
    function refreshAlienWinCounter() {
        jCounterAlienWin.text(alienWin);
    }
    
    function attack() {
        console.info("Human detecting. EXTERMINATE !!");
        
        // Add some new aliens
        for(var i = Math.floor(Math.random() * 3) + 1, marker, orientation; i >= 0; --i){
            orientation = Math.floor(Math.random() * 360);
            
            marker = new google.maps.Marker({
                map: map,
                icon: "./img/ufo.png",
                position: google.maps.geometry.spherical.computeOffset(centerMap, 5000, orientation)
            });
            
            marker.orientation = orientation;
            aliens.push(marker);
        }
    }
    
    function moveAliens() {
        window.requestAnimationFrame(moveAliens);
        
        for(var i = aliens.length - 1, distance; i >= 0; --i){
            distance = google.maps.geometry.spherical.computeDistanceBetween(centerMap, aliens[i].getPosition()) - 5;
            aliens[i].setPosition(google.maps.geometry.spherical.computeOffset(centerMap, distance, aliens[i].orientation ));
         
            if(areaToProtect.getBounds().contains(aliens[i].getPosition())){
                aliens[i].setMap(null);
                aliens.splice(i, 1);
                
                alienWin++;
                window.setTimeout(refreshAlienWinCounter, 0);
            }

        }
    }

    // What to do ?
    document.addEventListener("DOMContentLoaded", function() {
        // Get some DOM elements
        jCounterNextAttack = $("#counter-next-attack"),
        jCounterAlienWin = $("#counter-alien-win");
        
        // Wait the DOM-Ready to do some stuff !
        google.maps.event.addDomListener(window, "load", function() {
            centerMap = map.getCenter();
            areaToProtect = new google.maps.Circle({
                map: map,
                center: centerMap,
                clickable: false,
                radius: 200,
                fillColor: "#4096EE",
                fillOpacity: "0.5",
                strokeColor: "#3F4C6B",
                strokeWeight: 2
            });
            initializeCounterNextAttack();
            refreshAlienWinCounter();
            moveAliens();
        });
    });
    
})(jQuery, google);
