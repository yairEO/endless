// endless scroll - jQuery plugin
// by: Yair Even-or (2014)
// dropthebit.com

(function($){
    jQuery.fn.endless = function(settings){
        return this.each(function(){
            var $el = $(this),
                endless;

            // if element already the pluging bound to it, return
            if( $el.data('_endless') )
                return;

            endless = new Endless($el, settings);

            $el
                //.resize( endless.onHeightChange.bind(endless) )
                .scroll( _.throttle(endless.getScrollPos.bind(endless), 100) );

            $el.data('_endless', endless);
        });
    }

    function Endless($el, settings){
        this.el = $el;
        this.settings = $.extend({},settings);
        this.height = null;
        this.offset = null; // the extra offset before scroll has reached the end
        this.callback = settings.callback ? settings.callback : null;

        this.onHeightChange(); // calculate;
        this.getScrollPos();
    }

    Endless.prototype = {
        onHeightChange: function(){
            var offset = this.settings.offset || 0;
            if( this.el[0] == window )
                this.height = document.documentElement.scrollHeight;
            else
                this.height = this.el[0].scrollHeight;

            this.offset = (typeof offset == 'string') ? this.height * (parseInt(offset) / 100) : offset;

        },
        getScrollPos: function(e){
            var scroll, ownHeight;

            this.onHeightChange();

            if( this.el[0] == window ){
                scroll    = window.pageYOffset || document.documentElement.scrollTop;
                ownHeight = $(window).height();
            }
            else{
                scroll    = this.el[0].scrollTop;
                ownHeight = this.el[0].clientHeight;
            }

            scroll += ownHeight; // add the container's height to get the total scroll from the bottom and not from the top

            // if reached the "end" point
            if( scroll + this.offset >= this.height ){
                if( typeof this.callback == 'function' )
                    this.callback(); // do something once reached the end (load more stuff)

                this.onHeightChange(); // re-calculate height ad offset;
            }
            //  console.log([scroll, this.height], scroll + this.offset );
        }
    }
})(jQuery);