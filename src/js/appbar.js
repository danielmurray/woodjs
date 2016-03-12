(function (Wood) {
    Wood.AppBar = Marionette.LayoutView.extend({
      tagName: "appbar",
      attributes: {
        class: 'appbar',
      },
      template: _.template(''+
        '<div class="appbar-brand" href="#">' +
          '<div id="avatar-wrapper" class="avatar-wrapper"></div>' +
          '<div class="tesla-logo"></div>' +
        '</div>' +
        '<div class="login-menu" href="/login">' +
          '<i class="fa fa-icon fa-sign-in login-icon"></i>' +
        '</div>' +
      ''),
      regions:{
        avatar: "#avatar-wrapper",
      },
      events: {
      },
      initialize: function () {
      },
      onRender: function () {
        var avatar = new Wood.Avatar({
          icon: 'key',
          shape: 'hexagon-rotate',
        });
        this.avatar.show(avatar);
      },
    });
})(window.Wood);
