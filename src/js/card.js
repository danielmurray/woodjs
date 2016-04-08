/**
 * Created by danmurray on 2/17/16.
 */
(function(Wood) {
  Wood.Card = Marionette.LayoutView.extend({
    tagName: "wood-card",
    template: _.template(
      '<div class="card-header">' +
      '<div id="avatar-wrapper" class="avatar-wrapper"></div>' +
      '<div class="title"><%-primaryText%></div>' +
      '</div>' +
      '<div id="card-content" class="card-content"></div>' +
      '<div id="card-footer" class="card-footer"></div>' +
      ''),
    regions: {
      cardHeader: "#card-header",
      avatar: "#avatar-wrapper",
      cardContent: "#card-content",
      cardFooter: "#card-footer",
    },
    events: {},
    defaults: {
      primaryText: 'Card',
      headerView: null,
      headerOptions: {
        icon: 'question',
        shape: 'circle'
      },
      contentView: null,
      contentOptions: {},
      footerView: null,
      footerOptions: {}
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onRender: function() {
      var avatar = new Wood.Avatar(this.options.headerOptions);
      this.avatar.show(avatar);

      if (this.options.contentView) {
        var content = new this.options.contentView(
          this.options.contentOptions
        );
        this.cardContent.show(content);
      }

    },
    templateHelpers: function() {
      return _.extend({}, this.options, {

      });
    }
  });
})(window.Wood);
