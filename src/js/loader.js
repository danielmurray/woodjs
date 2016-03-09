(function (toolbox) {
    toolbox.gui.widgets.Loader = Marionette.ItemView.extend({
        tagName: 'div',
        attributes: {
            class: 'text-center fill-height',
        },
        template: _.template(
            '<span class="text-middle"></span>' +
            '<img src="/assets/images/loaders/<%= loader %>.gif"/>'
        ),
        initialize: function (options) {
            this.loader = options.loader || 'gears';
        },
        templateHelpers: function () {
            return {loader: this.loader};
        }
    }, {
        overlay: function ($el) {
            var $overlay = $(
                '<div class="text-center fill-height">' +
                    '<span class="text-middle"></span>' +
                    '<img src="/assets/images/loaders/gears.gif"/>' +
                '</div>'
            );

            $overlay.css('padding', '20px');
            $overlay.css('position', 'absolute');
            $overlay.css('top', 0);
            $overlay.css('left', 0);
            $overlay.css('height', '100%');
            $overlay.css('width', '100%');
            $overlay.css('z-index', '1000');
            $overlay.css('background', '#F9F9F9');
            $overlay.css('opacity', '0.8');
            $overlay.css('cursor', 'wait');

            $el.append($overlay);
            return $overlay;
        }
    });

    toolbox.gui.widgets.InlineLoader = Marionette.ItemView.extend({
        tagName: 'img',
        attributes: {
            src: '/assets/images/loaders/bar.gif',
            style: 'position:absolute;margin:auto;top:0;bottom:0;'
        },
        template: _.template('')
    });
})(window.toolbox);
