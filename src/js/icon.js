/**
 * Created by danmurray on 2/26/15.
 */
 (function (Wood) {
    Wood.Icon = Marionette.LayoutView.extend({
        tagName: 'wood-icon',
        attributes: {
            class: 'wood-icon',
        },
        iconTemplates: {
            'fa': '<i class="fa fa-icon fa-<%-icon%> color-<%-color%>"></i>',
            'material': '<i class="material-icons color-<%-color%>"><%-icon%></i>'
        },
        iconTemplate: function(options) {
            return _.template(this.iconTemplates[this.options.iconClass])(options)
        },
        template: _.template(
            '<%= iconTemplate %>' +
        ''),
        defaults:{
            iconClass: 'fa',
            icon: 'circle-thin',
            color: 'inherit',
            tooltip: false,
            clickEvent: 'action:click:icon'
        },
        initialize: function(options){
            this.options = _.extend({}, this.defaults, options);
        },
        templateHelpers: function(){
            return _.extend({}, this.options, {
                iconTemplate: this.iconTemplate(this.options)
            });
        },
    });

    Wood.IconButton = Wood.Icon.extend({
      tagName: 'button',
      attributes: {
        class: 'wood-icon',
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
        this.triggerMethod(this.options.clickEvent, e);
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
    });

    Wood.Checkbox = Marionette.LayoutView.extend({
      tagName: 'wood-checkbox',
      attributes: {
        class: 'wood-checkbox',
      },
      template: _.template(
        '<div class="check-wrapper">' +
          '<div id="check-container"></div>' +
        '</div>' +
        '<div class="box-wrapper">' +
          '<div id="box-container"></div>' +
        '</div>' +
      ''),
      regions:{
        checkContainer: '#check-container',
        boxContainer: '#box-container'
      },
      events:{
        "submit": "onFormSubmit",
      },
      childEvents: {
        "action:click:checkbox": "clickCheckbox",
      },
      clickCheckbox: function(child, event){
        event.stopPropagation();
        if( this.$el.attr('checked') ){
          this.$el.attr('checked', null);
        }else{
          this.$el.attr('checked', true);
        }
      },
      defaults:{
        checkIconView: Wood.Icon,
        checkIconOptions:{
          icon: 'check-square',
          color: 'blue'
        },
        boxIconView: Wood.IconButton,
        boxIconOptions:{
          icon: 'square-o',
          color: 'inherit',
          clickEvent: 'action:click:checkbox'
        }
      },
      initialize: function(options){
        this.options = _.extend({}, this.defaults, options, {
        });
      },
      onRender: function(){
        var check = new this.options.checkIconView(
          this.options.checkIconOptions
        );
        this.checkContainer.show(check);

        var box = new this.options.boxIconView(
          this.options.boxIconOptions
        );
        this.boxContainer.show(box);
      },
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

})(window.Wood);
