(function (Wood) {
    Wood.Spinner = Marionette.ItemView.extend({
        tagName: 'wood-spinner',
        template: _.template(
          '<svg class="circular" viewBox="<%-r+5%> <%-r+5%> <%-d+10%> <%-d+10%>" height="<%-d%>" width="<%-d%>">' +
            '<circle class="path" cx="<%-d+10%>" cy="<%-d+10%>" r="<%-radius%>" stroke-width="<%-strokeWidth%>"/>' +
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
            r: radius,
            d: radius * 2
          });
        }
    }, {
      overlay: function ($el, options) {
        var widget = new Wood.Spinner(options);
        widget.render();
        var $overlay = widget.$el;
        $overlay.addClass('overlay');

        $el.append($overlay);
        return $overlay;
      }
    });

    Wood.SpinnerOverlay = Marionette.LayoutView.extend({
        tagName: 'wood-spinner-overlay',
        template: _.template(
          '<div class="overlay backgroundColor-<%-backgroundColor%>">' +
            '<div id="spinner-container"></div>' +
          '</div>' +
        ''),
        defaults: {
          backgroundColor: 'transparent'
        },
        events: {
          'click': 'preventDefault'
        },
        regions: {
          spinnerContainer: '#spinner-container'
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);
        },
        onRender: function(){
          var spinner = new Wood.Spinner();
          this.spinnerContainer.show(spinner)
        },
        preventDefault: function(e){
          e.preventDefault();
        },
        templateHelpers: function () {
          return _.extend({}, this.options, {
          });
        }
    }, {
      show: function ($el, options) {
        var overlay = new Wood.SpinnerOverlay(options);
        overlay.render();

        $el.append(overlay.$el);
        return overlay.$el;
      }
    });

    // TODO
    // Wood.InlineLoader = Marionette.ItemView.extend({
    //     tagName: 'img',
    //     attributes: {
    //         src: '/assets/images/loaders/bar.gif',
    //         style: 'position:absolute;margin:auto;top:0;bottom:0;'
    //     },
    //     template: _.template('')
    // });
})(window.Wood);
