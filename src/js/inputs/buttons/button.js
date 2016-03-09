(function (toolbox) {
    var Button = Marionette.LayoutView.extend({
        tagName: 'button',
        attributes: {
          class: 'button',
        },
        template: _.template(
          '<div class="overlay">' +
            '<div class="ripple-container">' +
              '<div class="ripple circle"></div>' +
            '</div>' +
          '</div>' +
          '<div class="btnlabel"><%-label%></div>' +
        ''),
        events:{
          'mousedown':  'mouseDown',
          'focusin':    'focusIn',
          'focusout ':  'focusOut',
        },
        focusIn : function(e){
          this.$el.addClass('focused');
        },
        focusOut : function(e){
          this.$el.removeClass('focused');
        },
        mouseDown: function(event){
          var self = this;

          if (this.rippleTimer){
            clearTimeout(this.rippleTimer);
            this.$el.removeClass('pressed');
          }

          this.$el.removeClass('focused');
          event.preventDefault();
          var x = event.pageX - this.$('.ripple-container').offset().left - 18;
          var y = event.pageY - this.$('.ripple-container').offset().top - 18;
          this.$(".ripple").css('left', x);
          this.$(".ripple").css('top', y);
          this.$el.addClass('pressed');

          this.rippleTimer = setTimeout(function(){
            self.$el.removeClass('pressed');
          }, 350);
        },
        initialize: function(options){
          this.options = options;
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {

          });
        },
        saveClick: function(){
          // this.stateChange('saving');
          // this.triggerMethod('action:saveButtonClick');
        },
        stateChange: function(state){
          // if( this.state != state){
          //   this.state = state;
          //   this.render();
          // }
        }
    });

    Wood.inputs.buttons.Flat = Button.extend({
        attributes: {
          class: 'button flat',
        }
    });

    Wood.inputs.buttons.Raised = Button.extend({
        attributes: {
          class: 'button raised',
        }
    });
})(window.toolbox);
