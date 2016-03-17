(function (Wood) {
    Wood.Spinner = Marionette.ItemView.extend({
        tagName: 'wood-spinner',
        template: _.template(
          '<svg class="circular" viewBox="25 25 50 50" height="<%-height%>" width="<%-width%>">' +
            '<circle class="path" cx="50" cy="50" r="<%-radius%>" stroke-width="<%-strokeWidth%>"/>' +
          '</svg>' +
        ''),
        defaults: {
          radius: 20,
          strokeWidth: 2
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);
        },
        templateHelpers: function () {
          var radius = this.options.radius;
          return _.extend({}, this.options, {
            height: radius * 2,
            width: radius * 2
          });
        }
    }, {
      overlay: function ($el) {
        //
        // var $overlay = $(
        //     '<div class="text-center fill-height">' +
        //         '<span class="text-middle"></span>' +
        //         '<img src="/assets/images/loaders/gears.gif"/>' +
        //     '</div>'
        // );
        //
        // $overlay.css('padding', '20px');
        // $overlay.css('position', 'absolute');
        // $overlay.css('top', 0);
        // $overlay.css('left', 0);
        // $overlay.css('height', '100%');
        // $overlay.css('width', '100%');
        // $overlay.css('z-index', '1000');
        // $overlay.css('background', '#F9F9F9');
        // $overlay.css('opacity', '0.8');
        // $overlay.css('cursor', 'wait');
        //
        // $el.append($overlay);
        // return $overlay;
      }
    });

    // TODO
    // toolbox.gui.widgets.InlineLoader = Marionette.ItemView.extend({
    //     tagName: 'img',
    //     attributes: {
    //         src: '/assets/images/loaders/bar.gif',
    //         style: 'position:absolute;margin:auto;top:0;bottom:0;'
    //     },
    //     template: _.template('')
    // });
})(window.Wood);
