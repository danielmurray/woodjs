(function(Wood) {
  Wood.Item = Marionette.LayoutView.extend({
    tagName: 'wood-item',
    template: _.template(
      '<div class="item-wrapper">' +
        '<% if (leftIcon) { %>' +
          '<div id="left-icon-container" class="left-icon"></div>' +
        '<%}%>' +
          '<div class="item-body">' +
            '<div class="primary-text"><%-primaryText%></div>' +
            '<div class="secondary-text"><%-secondaryText%></div>' +
          '</div>' +
          '<% if (rightIcon) { %>' +
            '<div id="right-icon-container" class="right-icon"></div>' +
          '<%}%>' +
        '</div>' +
      ''),
    regions: {
      leftIconContainer: '#left-icon-container',
      rightIconContainer: '#right-icon-container',
    },
    defaults: {
      leftIcon: false,
      leftIconView: Wood.Avatar,
      leftIconOptions: {},
      primaryText: null,
      secondaryText: null,
      rightIcon: false,
      rightIconView: null,
      rightIconOptions: {}
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);

    },
    onRender: function() {
      if (this.options.leftIcon) {
        var leftIcon = new this.options.leftIconView(
          this.options.leftIconOptions
        );
        this.leftIconContainer.show(leftIcon);
      }

      if (this.options.rightIcon) {
        var rightIcon = new this.options.rightIconView(
          this.options.rightIconOptions
        );
        this.rightIconContainer.show(rightIcon);
      }
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {
        value: this.value
      });
    }
  });
})(window.Wood);
