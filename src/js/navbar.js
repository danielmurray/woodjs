(function (driver) {
    driver.bolts.Navbar = Marionette.LayoutView.extend({
        tagName: 'nav',
        attributes: {
            class: 'navbar navbar-default navbar-static-top',
            role: 'navigation',
            style: 'margin-bottom:0px'
        },
        template: _.template(''+
          '<div class="container">' +
            '<div class="navbar-wrapper">' +
              '<div class="navbar-header">' +
                '<a class="navbar-brand" href="#">' +
                  '<div class="icon-pair">' +
                    '<div class="icon-shape">' +
                      '<i class="fa fa-icon fa-key"></i>' +
                    '</div>' +
                    '<div class="plus-icon">+</div>' +
                    '<div class="icon-shape">' +
                      '<i class="fa fa-icon fa-briefcase"></i>' +
                    '</div>' +
                  '</div>' +
                  '<div class="logo"></div>' +
                '</a>' +
              '</div>' +
              '<a class="login-menu" href="/login">' +
                '<i class="fa fa-icon fa-sign-in login-icon"></i>' +
              '</a>' +
            '</div>' +
          '</div>' +
        ''),
        regions: {
        },
        events: {
        },
        initialize: function () {
        },
        onRender: function () {
        },
    });
})(window.driver);
