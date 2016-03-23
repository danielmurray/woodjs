/**
 * Created by danmurray on 2/26/15.
 */
 (function (toolbox) {
    Wood.Icon = Marionette.LayoutView.extend({
      tagName: 'wood-icon',
        attributes: {
          class: 'wood icon-wrapper',
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
          this.options = _.extend({}, this.defaults, options);
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
        class: 'wood icon-wrapper',
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
        'focusout': 'focusOut',
        'mousedown': 'mouseDown',
        'mouseleave':'mouseOut',
        'click':    'click'
      },
      focusIn : function(e){
        var ripple = this.rippleContainer.currentView;
        ripple.focusIn();
        if( this.tooltip ){
          this.tooltip.focusIn()
        }
      },
      focusOut : function(e){
        var ripple = this.rippleContainer.currentView;
        ripple.focusOut();
        if( this.tooltip ){
          this.tooltip.focusOut()
        }
      },
      mouseDown: function(e){
        e.preventDefault();
        var ripple = this.rippleContainer.currentView;
        ripple.mouseDown();
      },
      mouseOut: function(e){
        var ripple = this.rippleContainer.currentView;
        ripple.mouseOut();
      },
      click: function(e){
        var ripple = this.rippleContainer.currentView;
        ripple.click();
        this.triggerMethod("action:click:icon");
      },
      onRender: function(){
        var ripple = new Wood.Ripple();
        this.rippleContainer.show(ripple);

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

    Wood.IconList = Marionette.CollectionView.extend({
      tagName: 'wood-icon-list',
      childView: Wood.Icon,
      buildChildView: function(child, ChildViewClass, childViewOptions){
        var id = child.get('id');
        var view = child.get('view');
        var options = child.get('options');
        // build the final list of options for the childView class
        var options = _.extend({}, childViewOptions, options, {
          id: id
        });

        // create the child view instance
        var view = new view(options);

        // return it
        return view;
      },
    });
})(window.toolbox);
