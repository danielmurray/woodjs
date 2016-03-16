/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
  Wood.card = Marionette.LayoutView.extend({
      attributes: {
        class: 'wood card',
      },
      template: _.template(
        '<div class="card-header">' +
          '<div id="avatar-wrapper" class="avatar-wrapper"></div>' +
          '<div class="title">Log In</div>' +
        '</div>' +
        '<div id="card-content" class="card-content"></div>' +
        '<div id="card-footer" class="card-footer"></div>' +
      ''),
      regions:{
        cardHeader: "#card-header",
        avatar: "#avatar-wrapper",
        cardContent: "#card-content",
        cardFooter: "#card-footer",
      },
      events:{
      },
      initialize: function (options) {
        this.options = options;
      },
      onRender: function(){
        var avatar = new Wood.avatar({
          icon: 'key',
          shape: 'circle',
        });
        this.avatar.show(avatar);
      },
      templateHelpers: function(){
        return _.extend({}, this.options, {

        });
      }
  });
})(window.Wood);
