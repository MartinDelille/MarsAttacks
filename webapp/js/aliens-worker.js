var TICK_NEXT_ATTACK = 15,
    counter_next_attack = TICK_NEXT_ATTACK,
    self = this;
    
setInterval(function() {
    counter_next_attack--;
     self.postMessage({ type: "tick", value: counter_next_attack });
    
    if(counter_next_attack === 0){
        self.postMessage({ type: "attack" });
        counter_next_attack = TICK_NEXT_ATTACK;
    }
}, 1000);
