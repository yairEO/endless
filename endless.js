////////////////////////////////////////
// endless scroll
(function($){
    jQuery.fn.endless = function(settings, cb){
        return this.each(function(){

            var $el = $(this), // convert window to the HTML element
                endless;

            if( $el.data('_endless') )
                return;

            endless = new Endless($el, settings, cb);

            $el.on('scroll.endless', endless.getScrollPos.bind(endless) ); // you should really use throttling here.. like "_.throttle()"
             //.on('resize.endless', endless.onHeightChange.bind(endless) );

            $el.data('_endless', endless);
        });
    }

    function Endless($el, settings, cb){
        this.el       = $el[0] == window ? $(document.documentElement) : $el;
        this.type     = 'pixels'; //  can be 'pixels' or 'percentages'
        this.settings = $.extend({},settings);
        this.height   = null;
        this.callback = cb || function(){};
        this.stop     = false;
        this.maxScrollSoFar = 0;

        // parse the "offset"
        var offset = this.settings.offset;

        // type percentages
        if( typeof offset == 'string' && offset.charAt(offset.length - 1) == '%' )
            this.type = 'percentages';

        this.offset = this.settings.offset ? parseInt(this.settings.offset) : 0;

        // run once initialized
        this.getScrollPos();
    }

    Endless.prototype = {
        getScrollPos: function(e){
            var scroll,
                ownHeight,
                that = this;

            if( that.stop ) return;

			// fix for iOS Safari not reading "scrollTop" of the HTML element
			scroll = that.el[0] == document.documentElement ? window.pageYOffset : that.el[0].scrollTop;
			// do nothing when scroll up, only down
			if( scroll < that.maxScrollSoFar )
				return;

			that.height = that.el[0].scrollHeight;
			ownHeight   = that.el[0].clientHeight;

			that.maxScrollSoFar = Math.max(that.maxScrollSoFar, scroll) || 0;

			// if reached the "end" point
			if( that.type == 'percentages' && (scroll / (that.height - ownHeight)) * 100 > ( 100 - that.offset ) ){
			   // lock endless scrolling for a brief moment, to let new content change the height of the endless element
				that.stop = true;
				setTimeout(function(){ that.stop = false; that.getScrollPos(); }, 1000);
				that.callback();
			}
			// for pixels distance:
			else if( that.type == 'pixels' && scroll + ownHeight + that.offset >= that.height )
				that.callback();
        }
    }
})(jQuery);