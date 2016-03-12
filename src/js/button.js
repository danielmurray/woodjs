/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
    var Button = Marionette.LayoutView.extend({
        tagName: 'button',
        attributes: {
          class: 'button',
        },
        template: _.template(
          '<div id="ripple-container" class="ripple-container"></div>' +
          '<div class="btnlabel"><%-label%></div>' +
        ''),
        regions:{
          rippleContainer: '#ripple-container'
        },
        events:{
          'focusin':  'focusIn',
          'focusout': 'focusOut',
          'keypress': 'keyPress',
          'mousedown':'propagate',
          'mouseup':  'fade',
          'click':    'click',
        },
        focusIn : function(e){
          this.ripple.pulse();
        },
        focusOut : function(e){
          this.ripple.fade(0)
        },
        keyPress: function(e){
          if (e.keyCode == 13) {
            this.ripple.ripple();
          }
        },
        propagate: function(e){
          e.preventDefault();
          var x = e.pageX - this.$el.offset().left;
          var y = e.pageY - this.$el.offset().top;
          this.ripple.propagate(x, y);
        },
        fade: function(e){
          e.preventDefault();
          this.ripple.fade();
        },
        click: function(){
          this.ripple.fade(0)
          // this.triggerMethod("action:click:icon")
        },
        defaults:{
          label: 'Button',
        },
        initialize: function(options){
          this.options = _.extend({}, this.defaults, this.options);
        },
        onRender: function(){
          this.ripple = new Wood.Ripple();
          this.rippleContainer.show(this.ripple);
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

    Wood.FlatButton = Button.extend({
        attributes: {
          class: 'button flat',
        }
    });

    Wood.RaisedButton = Button.extend({
        attributes: {
          class: 'button raised',
        }
    });
})(window.Wood);
