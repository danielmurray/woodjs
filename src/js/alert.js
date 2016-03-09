(function (toolbox) {
    toolbox.gui.widgets.Alert = Marionette.ItemView.extend({
        tagName: 'div',
        attributes: {
            class: 'alert alert-dismissable'
        },
        template: _.template(
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '<strong><%= title %></strong> <%= message %>'
        ),
        initialize: function (options) {
            this.title = options.title || 'Warning!';
            this.message = options.message || '';
            this.alertType = options.type || 'alert-danger';
        },
        onRender: function () {
            this.$el.addClass(this.alertType);
        },
        templateHelpers: function () {
            return {
                title: this.title,
                message: this.message
            };
        }
    });
})(window.toolbox);