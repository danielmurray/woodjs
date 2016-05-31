/**
 * Created by danmurray on 2/26/15.
 */
 (function (Wood) {
    Wood.Icon = Marionette.LayoutView.extend({
        attributes: {
            class: 'wood-icon',
        },
        iconTemplates: {
            'fa': '<i class="fa fa-icon fa-<%-icon%> color-<%-color%>"></i>',
            'material': '<i class="material-icons color-<%-color%>"><%-icon%></i>'
        },
        defaults:{
          clickEvent: 'action:click:icon',
          color: 'inherit',
          disabled: false,
          icon: 'circle-thin',
          iconClass: 'fa',
          tooltip: false,
        },
        tagName: 'wood-icon',
        template: _.template(
            '<%= iconTemplate %>' +
        ''),
        iconTemplate: function(options) {
            return _.template(this.iconTemplates[this.options.iconClass])(options)
        },
        initialize: function(options){
            this.options = _.extend({}, this.defaults, options);
        },
        setAttr: function(setObj){
          _.extend(this.options, setObj);
        },
        templateHelpers: function(){
            return _.extend({}, this.options, {
                iconTemplate: this.iconTemplate(this.options)
            });
        },
    });

    Wood.IconButton = Wood.Icon.extend({
      attributes: {
        class: 'wood-icon',
      },
      events:{
        'focusin':  'focusIn',
        'focusout': 'focusOut',
        'mousedown': 'mouseDown',
        'mouseleave':'mouseOut',
        'click':    'click'
      },
      regions:{
        rippleContainer: '#ripple-container',
        tooltipContainer: '#tooltip-container'
      },
      tagName: 'button',
      template: _.template(
        '<div id="ripple-container"></div>' +
        '<%= iconTemplate %>' +
        '<div id="tooltip-container"></div>' +
      ''),
      click: function(e){
        var ripple = this.rippleContainer.currentView;
        ripple.click();
        this.triggerMethod(this.options.clickEvent, e);
      },
      disable: function( disabled ){
        this.$el.attr('disabled', disabled );
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
      initialize: function(options){
        this.options = _.extend({}, this.defaults, options);
        this.disable(this.options.disabled);
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
      onRender: function(){
        var ripple = new Wood.Ripple();
        this.rippleContainer.show(ripple);

        if( this.options.tooltip || this.options.disabled){
          var text = this.options.tooltip || 'Disabled'
          this.tooltip = new Wood.Tooltip({
            text: text
          });
          this.tooltipContainer.show(this.tooltip);
        }
      },
    });

    Wood.Checkbox = Marionette.LayoutView.extend({
      attributes: {
        class: 'wood-checkbox',
      },
      childEvents: {
        "action:click:checkbox": "clickCheckbox",
      },
      defaults:{
        boxIconView: Wood.IconButton,
        boxIconOptions:{
          icon: 'square-o',
          color: 'inherit',
          clickEvent: 'action:click:checkbox'
        },
        checked: false,
        checkIconView: Wood.Icon,
        checkIconOptions:{
          icon: 'check-square',
          color: 'blue'
        },
        disabled: false,
        tooltip: false
      },
      events:{
      },
      regions:{
        checkContainer: '#check-container',
        boxContainer: '#box-container'
      },
      tagName: 'wood-checkbox',
      template: _.template(
        '<div class="check-wrapper">' +
          '<div id="check-container"></div>' +
        '</div>' +
        '<div class="box-wrapper">' +
          '<div id="box-container"></div>' +
        '</div>' +
      ''),
      clickCheckbox: function(child, event){
        event.stopPropagation();
        if( this.$el.attr('checked') ){
          this.options.checked = false;
        }else{
          this.options.checked = true;
        }

        this.$el.attr('checked', this.options.checked);
        this.triggerMethod("action:click:checkbox", this.options.checked)
      },
      disable: function (disabled) {
        this.boxContainer.currentView.disable(disabled);
      },
      focusIn : function(e){
        if( this.tooltip ){
          this.tooltip.focusIn()
        }
      },
      focusOut : function(e){
        if( this.tooltip ){
          this.tooltip.focusOut()
        }
      },
      initialize: function(options){
        //jquery recursive copy
        this.options = $.extend(true, {}, this.defaults, options, {
        });
      },
      onRender: function(){
        var check = new this.options.checkIconView(
          this.options.checkIconOptions
        );
        this.checkContainer.show(check);

        var box = new this.options.boxIconView(
          _.extend({},this.options.boxIconOptions,{
            disabled: this.options.disabled,
            tooltip: this.options.tooltip
          })
        );
        this.boxContainer.show(box);

        this.$el.attr('checked', this.options.checked);
      },
    });

    Wood.Separator = Marionette.ItemView.extend({
      tagName: 'wood-separator',
      template: _.template('')
    });

    Wood.IconList = Marionette.CollectionView.extend({
      childView: Wood.Icon,
      tagName: 'wood-icon-list',
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
      getView: function(id){
        for( var i in this.children._views ){
          var childView = this.children._views[i];
          if( id == childView.id)
            return childView;
        }
      }
    });

})(window.Wood);
