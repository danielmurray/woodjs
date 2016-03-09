(function (toolbox) {
    toolbox.gui.widgets.Banner = Marionette.ItemView.extend({
        tagName: 'div',
        attributes: {
            class: 'alert',
            role: 'alert',
            style: 'margin-bottom:0; text-align:center'
        },
        template: _.template(
            '<strong>Warning!</strong> ' +
            '<% if (production) { %>' +
            'You are using unstable code, which may contain bugs.  Please report any bugs you may find to ' +
            '<a href="mailto:toolbox-web@teslamotors.com">toolbox-web@teslamotors.com</a>.  <a href="https://toolbox.teslamotors.com<%= location.pathname %>">Click here</a> ' +
            'to go to the production website.' +
            '<% } else { %>' +
            'You are using early-access code, which <strong>will NOT save your data</strong> and may contain bugs.  Please ' +
            'report any bugs you may find to <a href="mailto:toolbox-web@teslamotors.com">toolbox-web@teslamotors.com</a>.' +
            '  <a href="https://toolbox.teslamotors.com<%= location.pathname %>">Click here</a> to go to the production website.' +
            '<% } %>'
        ),
        initialize: function (options) {
            this.production = options.production || false;
        },
        onRender: function () {
            this.$el.addClass('alert-' + ((this.production) ? 'warning' : 'danger'));
        },
        templateHelpers: function () {
            return {
                production: this.production
            };
        }
    });

    toolbox.gui.widgets.ChromeBanner = Marionette.ItemView.extend({
        tagName: 'div',
        attributes: {
            class: 'alert alert-info',
            role: 'alert',
            style: 'margin-bottom:0; text-align:center'
        },
        template: _.template(
            '<strong>Howdy!</strong> ' +
            'Looks like you using an unsupported browser, that\'s okay, all you got to do is' +
            '<a class="btn btn-sm btn-success" href="https://www.google.com/chrome/browser/desktop/" style="margin:0px 10px;">Download Chrome Here!</a>' +
            // 'Some functionality will be broken while on an unsupported browser, if you see any bugs make sure you' +
            // '<a class="btn btn-sm btn-danger" href="/help/request?type=bug" style="margin:0px 10px;">Report Bugs Here!</a>' +
        ''),
    });
})(window.toolbox);