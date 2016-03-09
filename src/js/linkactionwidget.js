(function (toolbox) {
    toolbox.gui.widgets.LinkActionWidget = Marionette.ItemView.extend({
        tagName: 'span',
        template: _.template(
            '<a id="action-link" href="#" class="<%= cssClass %>"><%= displayText %></a>'
        ),
        events: {
            'click #action-link': 'onClick'
        },
        initialize: function (options) {
            this.displayText = options.displayText || '';
            this.cssClass = options.cssClass || '';
            this.action = options.action || undefined;
        },
        onClick: function () {
            if (this.action) {
                this.action();
            }
        },
        templateHelpers: function () {
            return {
                cssClass: this.cssClass,
                displayText: this.displayText
            }
        }
    })
})(window.toolbox);