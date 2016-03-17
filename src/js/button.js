/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
    var Button = Marionette.LayoutView.extend({
        tagName: 'button',
        attributes: {
          class: 'wood button',
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
          'mousedown':'mouseDown',
          'mouseout': 'mouseOut',
          'click':    'click'
        },
        focusIn : function(e){
          var ripple = this.rippleContainer.currentView;
          ripple.focusIn();
        },
        focusOut : function(e){
          var ripple = this.rippleContainer.currentView;
          ripple.focusOut()
        },
        mouseDown: function(e){
          var x = e.pageX - this.$el.offset().left;
          var y = e.pageY - this.$el.offset().top;
          var ripple = this.rippleContainer.currentView;
          ripple.mouseDown(x, y);
        },
        mouseOut: function(){
          var ripple = this.rippleContainer.currentView;
          ripple.mouseOut();
        },
        click: function(e){
          e.preventDefault();
          var ripple = this.rippleContainer.currentView;
          ripple.click();
          this.triggerMethod("action:click:button");
        },
        defaults:{
          label: 'Button',
        },
        initialize: function(options){
          this.options = _.extend({}, this.defaults, options);
        },
        onRender: function(){
          var ripple = new Wood.Ripple();
          this.rippleContainer.show(ripple);
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
          class: 'wood button flat',
        }
    });

    Wood.RaisedButton = Button.extend({
        attributes: {
          class: 'wood button raised',
        }
    });
})(window.Wood);
