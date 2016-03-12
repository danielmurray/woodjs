/**
 * Created by danmurray on 2/26/15.
 */
 (function (toolbox) {
    Wood.Icon = Marionette.LayoutView.extend({
        attributes: {
          class: 'icon-wrapper',
        },
        iconTemplates: {
          'fa': '<i class="fa fa-icon fa-<%-icon%>"></i>',
          'material': '<i class="material-icons"><%-icon%></i>'
        },
        iconTemplate: function(icon) {
          return _.template(this.iconTemplates[this.options.iconClass])({icon: icon})
        },
        template: _.template(
          '<%= iconTemplate %>' +
        ''),
        defaults:{
          iconClass: 'fa',
          icon: 'circle-thin',
          tooltip: false
        },
        initialize: function(options){
          this.options = _.extend({}, this.defaults, this.options);
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {
            iconTemplate: this.iconTemplate(this.options.icon)
          });
        },
    });

    Wood.IconButton = Wood.Icon.extend({
      tagName: 'button',
      attributes: {
        class: 'icon-wrapper',
      },
      template: _.template(
        '<div id="ripple-container"></div>' +
        '<%= iconTemplate %>' +
        '<div id="tooltip-container"></div>' +
      ''),
      regions:{
        rippleContainer: '#ripple-container',
        tooltipContainer: '#tooltip-container'
      },
      events:{
        'focusin':  'focusIn',
        'focusout':  'focusOut',
        'keypress': 'keyPress',
        'mousedown':  'propagate',
        'mouseup':    'fade',
        'mouseout': 'fade'
      },
      focusIn : function(e){
        this.ripple.pulse();
        if( this.tooltip ){
          this.tooltip.focusIn()
        }
      },
      focusOut : function(e){
        this.ripple.fade(0)
        if( this.tooltip ){
          this.tooltip.focusOut()
        }
      },
      keyPress: function(e){
        if (e.keyCode == 13) {
          this.ripple.ripple();
        }
      },
      propagate: function(){
        event.preventDefault();
        this.ripple.propagate();
        // this.triggerMethod("action:click:icon")
      },
      fade: function(){
         this.ripple.fade();
        // this.triggerMethod("action:click:icon")
      },
      onRender: function(){
        this.ripple = new Wood.Ripple();
        this.rippleContainer.show(this.ripple);

        if( this.options.tooltip ){
          this.tooltip = new Wood.Tooltip({
            text: this.options.tooltip
          });
          this.tooltipContainer.show(this.tooltip);
        }
      },
      onShow:function(){
      }
    });
})(window.toolbox);
