(function (toolbox) {
    toolbox.gui.widgets.Label = Marionette.ItemView.extend({
        template: _.template('<span class="<%- cssClass %>"><%- text %></span>'),
        initialize: function (options) {
            options = options || {};
            this.cssClass = options.cssClass | '';
            this.text = options.text;
        },
        templateHelpers: function () {
            return {
                cssClass: this.cssClass,
                text: this.text
            }
        }
    });
})(window.toolbox);