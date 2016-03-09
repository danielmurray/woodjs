/**
 * Created by danmurray on 2/2/16.
 */
(function (toolbox) {
    toolbox.gui.widgets.Checkbox = Marionette.ItemView.extend({
        attributes: {
          class: 'checkbox',
          type: 'checkbox'
        },
        template: _.template(
            '<input type="checkbox" <%-checked%>>' +
        ''),
        events:{
            'change' : 'changeEvent'
        },
        getVal: function () {
          return this.$('input').is(':checked');
        },
        initialize: function (options) {
            var self = this;
            this.id = options.id;
            this.changeEvents = options.changeEvents || false;
            this.disabled = options.disabled;
            this.value = options.value;

          	this.$el.attr('disabled', this.disabled);
        },
        changeEvent: function(){
            if(this.changeEvents)
              this.triggerMethod('change', this.getVal());
        },
        onShow: function () {
        },
        setVal: function (val) {
          this.value = val;
          this.render();
        },
        templateHelpers: function(){
          return {
            checked: this.value ? 'checked' : ''
          }
        }
    });
})(window.toolbox);
