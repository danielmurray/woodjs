(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');
// require('./banner');

require('./avatar');
require('./button');
// require('./card');
// require('./button');
require('./dialog');
require('./form');
require('./icon');
require('./item');
// require('./label');
require('./spinner');
// require('./quicksearch');
// require('./recordtable');
require('./ripple');
require('./table');
require('./tooltip');
require('./toolbar');

},{"./avatar":2,"./button":3,"./dialog":4,"./form":5,"./icon":6,"./inputs/all":7,"./item":9,"./ripple":10,"./spinner":11,"./table":12,"./toolbar":13,"./tooltip":14}],2:[function(require,module,exports){
/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
    Wood.Avatar = Marionette.ItemView.extend({
        attributes: {
          class: 'wood avatar',
        },
        template: _.template(
          '<div class="shape <%-shape%>">' +
            '<% if (image) { %>' +
              '<img class="img" src="<%-image%>"></img>' +
            '<%} else if(icon) {%>' +
              '<i class="icon fa fa-icon fa-<%-icon%>"></i>' +
            '<%} else if(letter) {%>' +
              '<span class="letter"><%-letter%></span>' +
            '<%}%>' +
          '</div>' +
        ''),
        regions:{
        },
        events:{
        },
        initialize: function (options) {
          this.options = options;
        },
        onRender: function(){
        },
        templateHelpers: function(){
          return _.extend({
            image: '',
            icon: '',
            letter: '',
            shape: ''
          }, this.options, {

          });
        }
    });
})(window.Wood);

},{}],3:[function(require,module,exports){
/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
    var Label = Marionette.LayoutView.extend({
      tagName: 'wood-label',
      attributes: {
      },
      template: _.template(
        '<div id="icon-container" class="icon-wrapper"></div>' +
        '<span class="text-wrapper"><%-text%></span>' +
      ''),
      regions: {
        iconContainer: '#icon-container'
      },
      defaults:{
        text: 'Button',
      },
      initialize: function(options){
        this.options = _.extend({}, this.defaults, options);
      },
      onRender: function(){
        if ( this.options.icon ){
          var view = this.options.icon.view;
          var options = this.options.icon.options;
          var iconView = new view(options);
          this.iconContainer.show(iconView);
        }
      },
      templateHelpers: function(){
        return _.extend({}, this.options, {
        });
      },
    });

    var Button = Marionette.LayoutView.extend({
        tagName: 'button',
        attributes: {
          class: 'wood button',
        },
        template: _.template(
          '<div id="ripple-container" class="ripple-container"></div>' +
          '<div id="label-container" class="label-wrapper"><%-label%></div>' +
        ''),
        regions:{
          rippleContainer: '#ripple-container',
          labelContainer: '#label-container'
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
          disabled: false
        },
        disable: function( disabled ){
          if( !this._saving ){
            this.$el.attr('disabled', disabled );
          }
        },
        initialize: function(options){
          this.options = _.extend({}, this.defaults, options);
          this.disable(this.options.disabled);
        },
        onRender: function(){
          var ripple = new Wood.Ripple();
          this.rippleContainer.show(ripple);

          var label = new Label({
            text: this.options.label
          });
          this.labelContainer.show(label);
        },
        onPost: function(){
          this.disable(true);
          this._saving = true;
          var label = new Label({
            icon: {
              view: Wood.Spinner,
              options: {
                radius: 12,
                strokeWidth: 6,
              }
            },
            text: this.options.label
          });
          this.labelContainer.show(label);
        },
        onSuccess: function(){
          this._saving = false;
          this.disable(false);
          var label = new Label({
            text: this.options.label
          });
          this.labelContainer.show(label);
        },
        onError: function(){
          this._saving = false;
          this.disable(false);
          var label = new Label({
            text: this.options.label
          });
          this.labelContainer.show(label);
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

},{}],4:[function(require,module,exports){
/**
 * Created by danmurray on 14/12/15.
 */
(function (keys) {
    Wood.Dialog = Marionette.LayoutView.extend({
        tagName: 'wood-dialog',
        template: _.template('' +
            '<div id="dialog-content-container"></div>' +
        ''),
        regions: {
            dialogContentContainer: '#dialog-content-container',
        },
        defaults:{
          title: 'Dialog'
        },
        initialize: function(options){
          var self = this;
          this.options = _.extend({}, this.defaults, options);

          this.dialog = new BootstrapDialog({
              type: BootstrapDialog.TYPE_PRIMARY,
              size: BootstrapDialog.SIZE_NORMAL,
              html: true,
          });
        },
        onRender: function () {
          // var dialogContent = this.options.dialogContent;
          // if( dialogContent ){}
          //   this.dialogContentContainer.show(new dialogContent.view(dialogContent.options));
        },
        open: function(){
            this.dialog.setTitle(this.options.title);
            this.dialog.setMessage(this.$el)
            this.dialog.open();
        },
        close: function(){
          this.dialog.close();
          if(this.onClose)
              this.onClose()
        },
    }, {
      show: function (options) {
        var widget = new this(options);
        widget.render();
        widget.open();
      }
    });

    Wood.FormDialog = Wood.Dialog.extend({
      tagName: 'wood-form-dialog',
      defaults:{
        title: 'Dialog',
        formOptions: {}
      },
      childEvents:{
        "action:submit:form": "submit"
      },
      submit: function(formView, data){
        if( this.options.onSubmit ){
          this.options.onSubmit(this, formView, data);
        }else {
          this.triggerMethod('action:submit:form', data);
        }
      },
      onRender: function () {
        var form = new Wood.Form(this.options.formOptions);
        this.dialogContentContainer.show(form);
      },
    });
})(window.keys);

},{}],5:[function(require,module,exports){
(function (toolbox) {
  Wood.InputList = Marionette.CollectionView.extend({
    childEvents: {
      "action:input:change": "onInputChange",
    },
    onInputChange: function(inputView, valid){
      this.triggerMethod('action:inputs:change', !this.error());
    },
    childView: Wood.Input,
    buildChildView: function(child, ChildViewClass, childViewOptions){
      var id = child.get('id');
      var view = child.get('view');
      var options = child.get('options');
      var defaultValue = this.model ? this.model.get(id) : '';

      // build the final list of options for the childView class
      var options = _.extend({}, childViewOptions, options, {
        id: id,
        defaultValue: defaultValue
      });

      // create the child view instance
      var view = new view(options);

      // return it
      return view;
    },
    getData: function(){
      var data = {};
      for( var i in this.children._views ){
        var childView = this.children._views[i];
        data[childView.id] = childView.getValue();
      }
      return data;
    },
    error: function(){
      var error = false;
      for( var i in this.children._views ){
        var childView = this.children._views[i];
        error = error || childView.error();
      }
      return error;
    },
    validate: function(){
      var valid = true;
      for( var i in this.children._views ){
        var childView = this.children._views[i];
        var childValid = childView.validate();
        valid = valid && childValid;
      }
      return valid;
    }
  });

  Wood.Form = Marionette.LayoutView.extend({
      tagName: 'form',
      attributes: {
          class: 'wood form',
      },
      template: _.template(
        '<div id="input-list-container" class="input-list"></div>' +
        '<div class="btns">' +
          '<div id="submit-btn" class="submit-btn"></div>' +
        '</div>' +
      ''),
      regions: {
        inputListContainer: '#input-list-container',
        submitBtnContainer: '#submit-btn'
      },
      events:{
        "submit": "onFormSubmit",
      },
      childEvents: {
        "action:click:button": "submitForm",
        "action:inputs:change": "onInputChange",
      },
      onInputChange: function(inputListView, valid){
        var submitButton = this.submitBtnContainer.currentView;
        submitButton.disable(!valid);
      },
      onFormSubmit: function(e){
        e.preventDefault();
        this.submitForm();
      },
      getData: function(){
        return this.inputListContainer.currentView.getData();
      },
      error: function(){
        return this.inputListContainer.currentView.error();
      },
      validate: function(){
        return this.inputListContainer.currentView.validate();
      },
      submitForm: function(e){
        if( this.validate() ){
          var data = this.getData();
          this.triggerMethod('action:submit:form', data);
        }
      },
      defaults: {
        model: null,
        inputs: [],
        submitButton: {
          label: 'Submit'
        },
      },
      initialize: function (options) {
        this.options = _.extend({}, this.defaults, this.options);
      },
      onRender: function(){
        var inputList = new Wood.InputList({
          model: this.options.model,
          collection: new Backbone.Collection(this.options.inputs)
        });
        this.inputListContainer.show(inputList);

        if( this.options.submitButton){
          var submitButton = new Wood.RaisedButton({
            label: this.options.submitButton.label,
            disabled: !!this.error()
          });
          this.submitBtnContainer.show(submitButton);
        }
      },
      onShow: function(){
      },
      onPost: function(){
        var submitButton = this.submitBtnContainer.currentView;
        submitButton.onPost();
      },
      onSuccess: function(){
        var submitButton = this.submitBtnContainer.currentView;
        submitButton.onSuccess();
      },
      onError: function(){
        var submitButton = this.submitBtnContainer.currentView;
        submitButton.onError();
      },
      templateHelpers: function(){
        return _.extend({}, this.options, {
        });
      },
  });

})(window.toolbox);

},{}],6:[function(require,module,exports){
/**
 * Created by danmurray on 2/26/15.
 */
 (function (toolbox) {
    Wood.Icon = Marionette.LayoutView.extend({
        tagName: 'wood-icon',
        attributes: {
            class: 'wood-icon',
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
            tooltip: false,
            clickEvent: 'action:click:icon'
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
        this.triggerMethod(this.options.clickEvent);
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

},{}],7:[function(require,module,exports){
Wood.inputs = {};

require('./text.js');
// require('./combo.js');
// require('./checkbox.js');
// require('./groupcombo.js');
// require('./popovercombo.js');

},{"./text.js":8}],8:[function(require,module,exports){
(function (Wood) {
    Wood.Input = Marionette.LayoutView.extend({
        attributes: {
          class: 'wood input',
        },
        template: _.template(
          '<div class="label-placeholder"></div>' +
          '<div class="label-text"><%-floatingLabelText%></div>' +
          '<div class="hint-text"><%-hintText%></div>' +
          '<input type="<%-type%>" value="<%-value%>"></input>' +
          '<div class="border-bottom">' +
            '<div class="border-bottom-inactive"></div>' +
            '<div class="border-bottom-active"></div>' +
          '</div>' +
          '<div id="error-text" class="error-text"></div>' +
        ''),
        events:{
          'change input': 'keyPress',
          'keyup input': 'keyPress',
          'keydown input': 'setFilled',
          'focusin  input': 'focusIn',
          'focusout input': 'focusOut'
        },
        setFilled: function(){
          this.value = this.getValue();
          if( this.value == '' ){
            this.$el.removeClass('filled');
          }else{
            this.$el.addClass('filled');
          }
        },
        keyPress: function(e){
          this.setFilled();
          var error = this.error();
          if( !error ){
            this.validate();
          }
          this.triggerMethod('action:input:change', !error);
        },
        focusIn : function(){
          this.$el.addClass('focused');
        },
        focusOut : function(){
          this.$el.removeClass('focused');
          this.validate();
        },
        getValue: function () {
          return this.$('input').val();
        },
        setError: function(error){
          if( error ){
            this.$el.addClass('erred');
            this.$('#error-text').text(error);
          } else {
            this.$el.removeClass('erred');
            this.$('#error-text').text('');
          }
        },
        error: function(){
          var error = false;
          var value = this.getValue();
          if( this.options.isRequired && value == '' ){
            error = 'This field is required';
          } else if( this.options.error ){
            error = this.options.error(value);
          }
          return error;
        },
        validate: function(){
          var error = this.error();
          this.setError(error);
          return !error;
        },
        defaults: {
          floatingLabelText: '',
          hintText: '',
          defaultValue: '',
          type: 'text',
          isRequired: false
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);

          if( this.options.floatingLabelText )
            this.$el.addClass('labeled');
        },
        onRender: function(){
          this.setFilled();
        },
        setVal: function (val) {
            return this.$('input').val(val);
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {
            value: this.value || this.options.defaultValue
          });
        }
    });
})(window.Wood);

},{}],9:[function(require,module,exports){
(function (Wood) {
    Wood.Item = Marionette.LayoutView.extend({
        attributes: {
            class: 'wood item'
        },
        template: _.template(
          '<div id="left-icon-container" class="left-icon"></div>' +
          '<div class="item-body">' +
            '<div class="primary-text"><%-primaryText%></div>' +
            '<div class="secondary-text"><%-secondaryText%></div>' +
          '</div>' +
        ''),
        regions: {
          leftIconContainer: '#left-icon-container',
        },
        defaults: {
          icon: 'error',
          primaryText: 'Error',
          secondaryText: 'Wrong username or password',
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);

        },
        onRender: function () {
          var avatar = new Wood.Avatar({
            icon: 'exclamation',
            shape: 'circle',
          });
          this.leftIconContainer.show(avatar);
        },
        templateHelpers: function () {
          return _.extend({}, this.options, {
            value: this.value
          });
        }
    });
})(window.Wood);

},{}],10:[function(require,module,exports){
Wood.Ripple = Marionette.ItemView.extend({
  attributes: {
    class: 'wood ripple-wrapper',
  },
  template: _.template(
  ''),
  initialize: function(){
    this.$ripples = [];
  },
  pythagoras: function(a, b){
    return Math.pow(Math.pow(a,2)+Math.pow(b,2),0.5);
  },
  createRipple: function(className, x, y){
    var $ripple = $(document.createElement('div'));
    $ripple.addClass('circle ripple ' + className);
    var h = this.$el.height();
    var w = this.$el.width();
    if( x == undefined ){
      x = w/2;
      y = h/2;
    }
    var r = this.pythagoras(Math.max(x,w-x), Math.max(y,h-y));
    $ripple.css({
      'top': y - r,
      'left': x - r,
      'height': 2*r,
      'width': 2*r
    });
    return $ripple;
  },
  focusIn: function(){
    if( !this.$pulse  && this.$ripples.length == 0){
      var $pulse = this.createRipple('pulsing');
      this.$el.append($pulse);
      this.$pulse = $pulse;
    }
  },
  focusOut: function(){
    if( this.$pulse ){
      this.fade(this.$pulse, 0);
      this.$pulse = undefined;
    }
  },
  mouseDown: function(x, y){
    var $ripple = this.createRipple('propagating', x, y);
    this.$el.append($ripple);
    this.$ripples.push($ripple);
  },
  mouseOut: function(){
    var $ripple = this.$ripples.pop();
    if( $ripple ){
      this.fade($ripple);
    }
  },
  click: function(){
    var self = this;
    var $ripple = this.$ripples.pop();
    if( $ripple ){
      this.$ripples.push($ripple);
    } else {
      this.mouseDown();
    }
    setTimeout(function(){
      self.mouseOut();
    }, 0);
  },
  fade: function(ripple, duration){
    var duration = typeof duration == 'number' ? duration : 500;
    ripple.fadeOut(duration, function(){
      ripple.remove();
    });
  }
});

},{}],11:[function(require,module,exports){
(function (Wood) {
    Wood.Spinner = Marionette.ItemView.extend({
        tagName: 'wood-spinner',
        template: _.template(
          '<svg class="circular" viewBox="<%-r+5%> <%-r+5%> <%-d+10%> <%-d+10%>" height="<%-d%>" width="<%-d%>">' +
            '<circle class="path" cx="<%-d+10%>" cy="<%-d+10%>" r="<%-radius%>" stroke-width="<%-strokeWidth%>"/>' +
          '</svg>' +
        ''),
        defaults: {
          radius: 20,
          strokeWidth: 2
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);
        },
        templateHelpers: function () {
          var radius = this.options.radius;
          return _.extend({}, this.options, {
            r: radius,
            d: radius * 2
          });
        }
    }, {
      overlay: function ($el) {
        var widget = new Wood.Spinner();
        widget.render();
        $overlay = widget.$el;
        $overlay.addClass('overlay');

        $el.append($overlay);
        return $overlay;
      }
    });

    // TODO
    // toolbox.gui.widgets.InlineLoader = Marionette.ItemView.extend({
    //     tagName: 'img',
    //     attributes: {
    //         src: '/assets/images/loaders/bar.gif',
    //         style: 'position:absolute;margin:auto;top:0;bottom:0;'
    //     },
    //     template: _.template('')
    // });
})(window.Wood);

},{}],12:[function(require,module,exports){
(function (Wood) {
    Wood.Table = Marionette.ItemView.extend({
        tagName: 'table',
        attributes: {
            class: 'table table-striped',
            cellspacing: 0,
            width: '100%',
            style: 'min-width:100%;min-height:100%;'
        },
        template: _.template(
            '<% if (showHeader) { %>' +
                '<thead>' +
                    '<tr>' +
                        '<% _.each(columns, function (column) { %>' +
                            '<th><%= column.display %></th>' +
                        '<% }); %>' +
                    '</tr>' +
                '</thead>' +
            '<% } %>' +
            '<% if (showFooter) { %>' +
                '<tfoot>' +
                    '<tr>' +
                        '<% _.each(columns, function (column) { %>' +
                            '<th><%= column.display %></th>' +
                        '<% }); %>' +
                    '</tr>' +
                '</tfoot>' +
            '<% } %>' +
            '<tbody></tbody>'
        ),
        collectData: function () {
            var output = [];
            this.collection.each(function (model) {
                output.push(model.attributes);
            });
            return output;
        },
        getColumns: function (schema) {
            var output = [];

            // load the column information from the schema
            if(schema){
                _.each(schema.columns, function (info) {
                    if (info.visible !== false) {
                        output.push({
                            data: info.field,
                            display: info.display
                        });
                    }
                });
            }
            return output;
        },
        getColumnDefs: function (columns) {
            var defs = [];
            var self = this;
            _.each(columns, function (col, index) {
                if (col.renderer) {
                    var renderer = col.renderer;
                    var dataName = col.data;
                    var rendererOptions = col.rendererOptions;

                    defs.push({
                        targets: index,
                        data: dataName,
                        render: function (data, type, full, meta) {
                            if (type === 'display') {
                                var widget = self[renderer](data, type, full, meta, rendererOptions);

                                if (typeof(widget) === 'string') {
                                    return widget;
                                } else {
                                    var id = dataName + '_' + meta.row;
                                    self.renderers[id] = widget;
                                    return '<span id="' + id + '" class="renderer-container waiting"></span>'
                                }

                            } else {
                                return data;
                            }
                        }
                    });
                }
            });
            return defs;
        },
        getExportData: function (record, field) {
            return record.attributes[field];
        },
        initialize: function (options) {
            var self = this;
            var default_columns = self.getColumns(self.collection.model.prototype.schema);
            if (options.columnFilter) {
                default_columns = _.filter(default_columns, options.columnFilter);
            }

            // store the collection for this datatable
            this.table = undefined;
            self.renderers = {};
            self.baseSearch = options.search || '';

            self.rowHeight = options.rowHeight || 59;
            self.maxVisibleRows = options.maxVisibleRows || 10;
            self.collection = options.collection;
            self.columns = options.columns || default_columns;
            self.columnDefs = options.columnDefs || self.getColumnDefs(self.columns);
            self.showHeader = options.showHeader || true;
            self.showFooter = options.showFooter || false;
            self.dataTableOptions = options.dataTableOptions || {};
            self.title = options.title;


             $(window).on("resize", function (){
                self.resizeHeight();
             });
        },
        onRowRender: function (row, data, index) {
            var self = this;
            $(row).find('.renderer-container.waiting').each(function () {
                var $holder = $(this);
                $holder.removeClass('waiting');

                var renderer = self.renderers[$holder.attr('id')];

                // add a jquery object directly
                if (renderer instanceof jQuery) {
                    $holder.append(renderer);
                }

                // render a backbone view
                else {
                    renderer.render();
                    $holder.append(renderer.$el);
                }
            });
        },
        onLoad: function () {
            // virtual method
        },
        onShow: function () {
            var self = this;

            // set the default loader for this table to load collection information
            var options = {
                scrollY: $(window).height() - 385,
                scrollX: true,
                deferRender: true,
                dom: '<"title">ZTfrtiS',
                scrollCollapse: true,
                columns: this.columns,
                columnDefs: this.columnDefs,
                rowCallback: function (row, data, index) {
                    return self.onRowRender(row, data, index);
                },
                scroller: {
                    rowHeight: this.rowHeight,
                    displayBuffer: 2
                },
                ajax: function (data, callback, settings) {
                  var $overlay = new Wood.Spinner.overlay(self.$el);
                  return self.collection.fetch({
                      data: {
                          expand: self.columns.map(function(c){return c.data}).join(','),
                      },
                      success: function (collection) {
                        $overlay.remove();
                        callback({data: self.collectData()});
                        self.onLoad();
                      }
                  });
                },
                tableTools: {
                    sSwfPath: '/assets/swf/copy_csv_xls_pdf.swf',
                    aButtons:[
                        {
                            sExtends: 'csv',
                            sButtonText: 'Export',
                            sButtonClass: 'btn btn-default btn-xs',
                            fnCellRender: function (value, column, domRow, row) {
                                var record = self.collection.at(row);
                                var field = self.columns[column].data;
                                return self.getExportData(record, field);
                            }
                        }
                    ]
                }
            };

            this.table = this.$el.DataTable(_.extend(options, self.dataTableOptions));
            this.table.search(this.baseSearch);
            this.$dataTable = self.$el.closest('.dataTables_wrapper');
            this.$el.on('search.dt', function () {
                self.trigger('change:search', self.table.search());
            });

            if (self.title) {
                table = self;
                self.$dataTable.find('div.title').append(self.title);
            }

            this.resizeHeight();
        },
        onDestroy: function (){
            $(window).off("resize");
        },
        refresh: function () {
            var $overlay = Wood.Spinner.overlay(this.$el);
            this.table.ajax.reload(function () {
                $overlay.remove();
            });
        },
        rowCount: function () {
            var info = this.table.page.info();
            return info.recordsTotal;
        },
        setHeight: function (height) {
            this.$dataTable.find('.dataTables_scrollBody').css('max-height', height + "px");
        },
        resizeHeight : function(){
            this.setHeight($(window).height() - 570)
        },
        unfilteredRowCount: function () {
            var info = this.table.page.info();
            return info.recordsDisplay;
        },
        templateHelpers: function () {
            return {
                columns: this.columns,
                showHeader: this.showHeader,
                showFooter: this.showFooter
            };
        }
    });
})(window.Wood);

},{}],13:[function(require,module,exports){
(function (Wood) {
    Wood.Toolbar = Marionette.LayoutView.extend({
      tagName: "wood-toolbar",
      template: _.template(''+
        '<div id="left-icons-wrapper" class="left-icons-wrapper"></div>' +
        '<div class="title"><%-title%></div>' +
        '<div id="right-icons-wrapper" class="right-icons-wrapper"></div>' +
      ''),
      regions:{
        leftIconsContainer: "#left-icons-wrapper",
        rightIconsContainer: "#right-icons-wrapper",
      },
      childEvents: {
        'action:click:icon': "onClickIcon",
      },
      events: {
        'click .title': 'onClickTitle',
      },
      onClickIcon: function(iconView){
        this.triggerMethod( 'action:click:icon', iconView );
      },
      onClickTitle: function(){
        this.triggerMethod('action:click:title');
      },
      defaults: {
        leftIcons: [],
        rightIcons: [],
        title: 'Toolbar'
      },
      initialize: function () {
        this.options = _.extend({}, this.defaults, this.options);
      },
      templateHelpers: function(){
        return _.extend({}, this.options, {
        });
      },
      onRender: function () {
        var leftIconList = new Wood.IconList({
          collection: new Backbone.Collection(this.options.leftIcons)
        });
        this.leftIconsContainer.show(leftIconList);

        var rightIconList = new Wood.IconList({
          collection: new Backbone.Collection(this.options.rightIcons)
        });
        this.rightIconsContainer.show(rightIconList);
      },
    });
})(window.Wood);

},{}],14:[function(require,module,exports){
/**
 * Created by danmurray on 3/11/15.
 */
(function (toolbox) {
  Wood.Tooltip = Marionette.LayoutView.extend({
    attributes: {
      class: 'wood tooltip-anchor-wrapper',
    },
    template: _.template(
      '<div class="tooltip-anchor">' +
        '<div class="tooltip-wrapper">' +
          '<div class="wood-tooltip"><%- text %></div>' +
        '</div>' +
      '</div>' +
    ''),
    defaults:{
      text: ''
    },
    focusIn: function() {
      this.$el.addClass('focused');
    },
    focusOut: function() {
      this.$el.removeClass('focused');
    },
    initialize: function(options){
      this.options = _.extend({}, this.defaults, this.options);
    },
    templateHelpers: function(){
      return _.extend({}, this.options, {
      });
    },
  });
})(window.toolbox);

},{}]},{},[1]);
