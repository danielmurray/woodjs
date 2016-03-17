(function (Wood) {
    Wood.Item = Marionette.LayoutView.extend({
        attributes: {
            class: 'wood item'
        },
        template: _.template(
          '<div id="left-icon-container" class="left-icon"></div>' +
          '<div class="item-body">' +
            '<div class="primary-text"><%-primaryText%></div>' +
            '<div class="secondary-text"><%-secondaryText%></div>' +
          '</div>' +
        ''),
        regions: {
          leftIconContainer: '#left-icon-container',
        },
        defaults: {
          icon: 'error',
          primaryText: 'Error',
          secondaryText: 'Wrong username or password',
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);

        },
        onRender: function () {
          var avatar = new Wood.Avatar({
            icon: 'exclamation',
            shape: 'circle',
          });
          this.leftIconContainer.show(avatar);
        },
        templateHelpers: function () {
          return _.extend({}, this.options, {
            value: this.value
          });
        }
    });
})(window.Wood);
