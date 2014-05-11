simlpeGrid
========

Fires a callback when scroll has reached the end

## How to use:
    // can be bound to any scrollable element or the `window` itself
    $(window).endless({offset:'20%', callback: someFunc });
	
	function someFunc(){
		// reached the end
	}