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
        var widget = new Wood.Dialog(options);
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
    }, {
      show: function (options) {
        var widget = new Wood.FormDialog(options);
        widget.render();
        widget.open();
      }
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
  createRipple(className, x, y){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvZGlhbG9nLmpzIiwic3JjL2pzL2Zvcm0uanMiLCJzcmMvanMvaWNvbi5qcyIsInNyYy9qcy9pbnB1dHMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy90ZXh0LmpzIiwic3JjL2pzL2l0ZW0uanMiLCJzcmMvanMvcmlwcGxlLmpzIiwic3JjL2pzL3NwaW5uZXIuanMiLCJzcmMvanMvdGFibGUuanMiLCJzcmMvanMvdG9vbGJhci5qcyIsInNyYy9qcy90b29sdGlwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93Lldvb2QgPSB7fTtcblxuLy8gaW5jbHVkZSBiYXNlIGNvbW1vbiB3aWRnZXRzXG5yZXF1aXJlKCcuL2lucHV0cy9hbGwnKTtcbi8vIHJlcXVpcmUoJy4vYmFubmVyJyk7XG5cbnJlcXVpcmUoJy4vYXZhdGFyJyk7XG5yZXF1aXJlKCcuL2J1dHRvbicpO1xuLy8gcmVxdWlyZSgnLi9jYXJkJyk7XG4vLyByZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9kaWFsb2cnKTtcbnJlcXVpcmUoJy4vZm9ybScpO1xucmVxdWlyZSgnLi9pY29uJyk7XG5yZXF1aXJlKCcuL2l0ZW0nKTtcbi8vIHJlcXVpcmUoJy4vbGFiZWwnKTtcbnJlcXVpcmUoJy4vc3Bpbm5lcicpO1xuLy8gcmVxdWlyZSgnLi9xdWlja3NlYXJjaCcpO1xuLy8gcmVxdWlyZSgnLi9yZWNvcmR0YWJsZScpO1xucmVxdWlyZSgnLi9yaXBwbGUnKTtcbnJlcXVpcmUoJy4vdGFibGUnKTtcbnJlcXVpcmUoJy4vdG9vbHRpcCcpO1xucmVxdWlyZSgnLi90b29sYmFyJyk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuQXZhdGFyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGF2YXRhcicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2hhcGUgPCUtc2hhcGUlPlwiPicgK1xuICAgICAgICAgICAgJzwlIGlmIChpbWFnZSkgeyAlPicgK1xuICAgICAgICAgICAgICAnPGltZyBjbGFzcz1cImltZ1wiIHNyYz1cIjwlLWltYWdlJT5cIj48L2ltZz4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihpY29uKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiaWNvbiBmYSBmYS1pY29uIGZhLTwlLWljb24lPlwiPjwvaT4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihsZXR0ZXIpIHslPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj48JS1sZXR0ZXIlPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8JX0lPicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICAgICAgICBpbWFnZTogJycsXG4gICAgICAgICAgICBpY29uOiAnJyxcbiAgICAgICAgICAgIGxldHRlcjogJycsXG4gICAgICAgICAgICBzaGFwZTogJydcbiAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIHZhciBMYWJlbCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtbGFiZWwnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImljb24tY29udGFpbmVyXCIgY2xhc3M9XCJpY29uLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidGV4dC13cmFwcGVyXCI+PCUtdGV4dCU+PC9zcGFuPicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczoge1xuICAgICAgICBpY29uQ29udGFpbmVyOiAnI2ljb24tY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgdGV4dDogJ0J1dHRvbicsXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaWNvbiApe1xuICAgICAgICAgIHZhciB2aWV3ID0gdGhpcy5vcHRpb25zLmljb24udmlldztcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy5pY29uLm9wdGlvbnM7XG4gICAgICAgICAgdmFyIGljb25WaWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy5pY29uQ29udGFpbmVyLnNob3coaWNvblZpZXcpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB2YXIgQnV0dG9uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwibGFiZWwtY29udGFpbmVyXCIgY2xhc3M9XCJsYWJlbC13cmFwcGVyXCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgICBsYWJlbENvbnRhaW5lcjogJyNsYWJlbC1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICAgJ21vdXNlZG93bic6J21vdXNlRG93bicsXG4gICAgICAgICAgJ21vdXNlb3V0JzogJ21vdXNlT3V0JyxcbiAgICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzT3V0KClcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgeCA9IGUucGFnZVggLSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgIHZhciB5ID0gZS5wYWdlWSAtIHRoaXMuJGVsLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLm1vdXNlRG93bih4LCB5KTtcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgbGFiZWw6ICdCdXR0b24nLFxuICAgICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiggZGlzYWJsZWQgKXtcbiAgICAgICAgICBpZiggIXRoaXMuX3NhdmluZyApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCBkaXNhYmxlZCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpc2FibGUodHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICB2aWV3OiBXb29kLlNwaW5uZXIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IDEyLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiA2LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShmYWxzZSk7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKGZhbHNlKTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMuc3RhdGVDaGFuZ2UoJ3NhdmluZycpO1xuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnNhdmVCdXR0b25DbGljaycpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICAgIC8vIGlmKCB0aGlzLnN0YXRlICE9IHN0YXRlKXtcbiAgICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZsYXRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gZmxhdCcsXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuUmFpc2VkQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uIHJhaXNlZCcsXG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTQvMTIvMTUuXG4gKi9cbihmdW5jdGlvbiAoa2V5cykge1xuICAgIFdvb2QuRGlhbG9nID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWRpYWxvZycsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwiZGlhbG9nLWNvbnRlbnQtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgICAgZGlhbG9nQ29udGVudENvbnRhaW5lcjogJyNkaWFsb2ctY29udGVudC1jb250YWluZXInLFxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgdGl0bGU6ICdEaWFsb2cnXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgICB0aGlzLmRpYWxvZyA9IG5ldyBCb290c3RyYXBEaWFsb2coe1xuICAgICAgICAgICAgICB0eXBlOiBCb290c3RyYXBEaWFsb2cuVFlQRV9QUklNQVJZLFxuICAgICAgICAgICAgICBzaXplOiBCb290c3RyYXBEaWFsb2cuU0laRV9OT1JNQUwsXG4gICAgICAgICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gdmFyIGRpYWxvZ0NvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZGlhbG9nQ29udGVudDtcbiAgICAgICAgICAvLyBpZiggZGlhbG9nQ29udGVudCApe31cbiAgICAgICAgICAvLyAgIHRoaXMuZGlhbG9nQ29udGVudENvbnRhaW5lci5zaG93KG5ldyBkaWFsb2dDb250ZW50LnZpZXcoZGlhbG9nQ29udGVudC5vcHRpb25zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9wZW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRUaXRsZSh0aGlzLm9wdGlvbnMudGl0bGUpO1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cuc2V0TWVzc2FnZSh0aGlzLiRlbClcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICBpZih0aGlzLm9uQ2xvc2UpXG4gICAgICAgICAgICAgIHRoaXMub25DbG9zZSgpXG4gICAgICAgIH0sXG4gICAgfSwge1xuICAgICAgc2hvdzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHdpZGdldCA9IG5ldyBXb29kLkRpYWxvZyhvcHRpb25zKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICB3aWRnZXQub3BlbigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5Gb3JtRGlhbG9nID0gV29vZC5EaWFsb2cuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWZvcm0tZGlhbG9nJyxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgdGl0bGU6ICdEaWFsb2cnLFxuICAgICAgICBmb3JtT3B0aW9uczoge31cbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czp7XG4gICAgICAgIFwiYWN0aW9uOnN1Ym1pdDpmb3JtXCI6IFwic3VibWl0XCJcbiAgICAgIH0sXG4gICAgICBzdWJtaXQ6IGZ1bmN0aW9uKGZvcm1WaWV3LCBkYXRhKXtcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5vblN1Ym1pdCApe1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vblN1Ym1pdCh0aGlzLCBmb3JtVmlldywgZGF0YSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSBuZXcgV29vZC5Gb3JtKHRoaXMub3B0aW9ucy5mb3JtT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGlhbG9nQ29udGVudENvbnRhaW5lci5zaG93KGZvcm0pO1xuICAgICAgfSxcbiAgICB9LCB7XG4gICAgICBzaG93OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IFdvb2QuRm9ybURpYWxvZyhvcHRpb25zKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICB3aWRnZXQub3BlbigpO1xuICAgICAgfVxuICAgIH0pO1xufSkod2luZG93LmtleXMpO1xuIiwiKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gIFdvb2QuSW5wdXRMaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICBcImFjdGlvbjppbnB1dDpjaGFuZ2VcIjogXCJvbklucHV0Q2hhbmdlXCIsXG4gICAgfSxcbiAgICBvbklucHV0Q2hhbmdlOiBmdW5jdGlvbihpbnB1dFZpZXcsIHZhbGlkKXtcbiAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmlucHV0czpjaGFuZ2UnLCAhdGhpcy5lcnJvcigpKTtcbiAgICB9LFxuICAgIGNoaWxkVmlldzogV29vZC5JbnB1dCxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgIHZhciB2aWV3ID0gY2hpbGQuZ2V0KCd2aWV3Jyk7XG4gICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnb3B0aW9ucycpO1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IHRoaXMubW9kZWwgPyB0aGlzLm1vZGVsLmdldChpZCkgOiAnJztcblxuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlXG4gICAgICB9KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAvLyByZXR1cm4gaXRcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBkYXRhID0ge307XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgZGF0YVtjaGlsZFZpZXcuaWRdID0gY2hpbGRWaWV3LmdldFZhbHVlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgZXJyb3IgPSBlcnJvciB8fCBjaGlsZFZpZXcuZXJyb3IoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9LFxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICB2YXIgY2hpbGRWYWxpZCA9IGNoaWxkVmlldy52YWxpZGF0ZSgpO1xuICAgICAgICB2YWxpZCA9IHZhbGlkICYmIGNoaWxkVmFsaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkZvcm0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICdmb3JtJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgZm9ybScsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwiaW5wdXQtbGlzdC1jb250YWluZXJcIiBjbGFzcz1cImlucHV0LWxpc3RcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJidG5zXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJzdWJtaXQtYnRuXCIgY2xhc3M9XCJzdWJtaXQtYnRuXCI+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgaW5wdXRMaXN0Q29udGFpbmVyOiAnI2lucHV0LWxpc3QtY29udGFpbmVyJyxcbiAgICAgICAgc3VibWl0QnRuQ29udGFpbmVyOiAnI3N1Ym1pdC1idG4nXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgXCJzdWJtaXRcIjogXCJvbkZvcm1TdWJtaXRcIixcbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czoge1xuICAgICAgICBcImFjdGlvbjpjbGljazpidXR0b25cIjogXCJzdWJtaXRGb3JtXCIsXG4gICAgICAgIFwiYWN0aW9uOmlucHV0czpjaGFuZ2VcIjogXCJvbklucHV0Q2hhbmdlXCIsXG4gICAgICB9LFxuICAgICAgb25JbnB1dENoYW5nZTogZnVuY3Rpb24oaW5wdXRMaXN0VmlldywgdmFsaWQpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5kaXNhYmxlKCF2YWxpZCk7XG4gICAgICB9LFxuICAgICAgb25Gb3JtU3VibWl0OiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnN1Ym1pdEZvcm0oKTtcbiAgICAgIH0sXG4gICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcuZ2V0RGF0YSgpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcuZXJyb3IoKTtcbiAgICAgIH0sXG4gICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LnZhbGlkYXRlKCk7XG4gICAgICB9LFxuICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKCB0aGlzLnZhbGlkYXRlKCkgKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnN1Ym1pdDpmb3JtJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgc3VibWl0QnV0dG9uOiB7XG4gICAgICAgICAgbGFiZWw6ICdTdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpbnB1dExpc3QgPSBuZXcgV29vZC5JbnB1dExpc3Qoe1xuICAgICAgICAgIG1vZGVsOiB0aGlzLm9wdGlvbnMubW9kZWwsXG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLmlucHV0cylcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLnNob3coaW5wdXRMaXN0KTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnN1Ym1pdEJ1dHRvbil7XG4gICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IG5ldyBXb29kLlJhaXNlZEJ1dHRvbih7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5vcHRpb25zLnN1Ym1pdEJ1dHRvbi5sYWJlbCxcbiAgICAgICAgICAgIGRpc2FibGVkOiAhIXRoaXMuZXJyb3IoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLnNob3coc3VibWl0QnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uU2hvdzogZnVuY3Rpb24oKXtcbiAgICAgIH0sXG4gICAgICBvblBvc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uUG9zdCgpO1xuICAgICAgfSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24ub25TdWNjZXNzKCk7XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24ub25FcnJvcigpO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICB9KTtcblxufSkod2luZG93LnRvb2xib3gpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzI2LzE1LlxuICovXG4gKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gICAgV29vZC5JY29uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWljb24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3dvb2QtaWNvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICdmYSc6ICc8aSBjbGFzcz1cImZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicsXG4gICAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPjwlLWljb24lPjwvaT4nXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZTogZnVuY3Rpb24oaWNvbikge1xuICAgICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUodGhpcy5pY29uVGVtcGxhdGVzW3RoaXMub3B0aW9ucy5pY29uQ2xhc3NdKSh7aWNvbjogaWNvbn0pXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgICBpY29uOiAnY2lyY2xlLXRoaW4nLFxuICAgICAgICAgICAgdG9vbHRpcDogZmFsc2UsXG4gICAgICAgICAgICBjbGlja0V2ZW50OiAnYWN0aW9uOmNsaWNrOmljb24nXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGljb25UZW1wbGF0ZTogdGhpcy5pY29uVGVtcGxhdGUodGhpcy5vcHRpb25zLmljb24pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIFdvb2QuSWNvbkJ1dHRvbiA9IFdvb2QuSWNvbi5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1pY29uJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICc8ZGl2IGlkPVwidG9vbHRpcC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgIHRvb2x0aXBDb250YWluZXI6ICcjdG9vbHRpcC1jb250YWluZXInXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAnbW91c2Vkb3duJzogJ21vdXNlRG93bicsXG4gICAgICAgICdtb3VzZWxlYXZlJzonbW91c2VPdXQnLFxuICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNJbigpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c091dCgpO1xuICAgICAgICBpZiggdGhpcy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwLmZvY3VzT3V0KClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUubW91c2VEb3duKCk7XG4gICAgICB9LFxuICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgfSxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKHRoaXMub3B0aW9ucy5jbGlja0V2ZW50KTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHJpcHBsZSk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwID0gbmV3IFdvb2QuVG9vbHRpcCh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMudG9vbHRpcFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRhaW5lci5zaG93KHRoaXMudG9vbHRpcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6ZnVuY3Rpb24oKXtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuSWNvbkxpc3QgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1pY29uLWxpc3QnLFxuICAgICAgY2hpbGRWaWV3OiBXb29kLkljb24sXG4gICAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgICAgdmFyIGlkID0gY2hpbGQuZ2V0KCdpZCcpO1xuICAgICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnb3B0aW9ucycpO1xuICAgICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIldvb2QuaW5wdXRzID0ge307XG5cbnJlcXVpcmUoJy4vdGV4dC5qcycpO1xuLy8gcmVxdWlyZSgnLi9jb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9jaGVja2JveC5qcycpO1xuLy8gcmVxdWlyZSgnLi9ncm91cGNvbWJvLmpzJyk7XG4vLyByZXF1aXJlKCcuL3BvcG92ZXJjb21iby5qcycpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5JbnB1dCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGlucHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC1wbGFjZWhvbGRlclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtdGV4dFwiPjwlLWZsb2F0aW5nTGFiZWxUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImhpbnQtdGV4dFwiPjwlLWhpbnRUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGlucHV0IHR5cGU9XCI8JS10eXBlJT5cIiB2YWx1ZT1cIjwlLXZhbHVlJT5cIj48L2lucHV0PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWluYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20tYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwiZXJyb3ItdGV4dFwiIGNsYXNzPVwiZXJyb3ItdGV4dFwiPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2NoYW5nZSBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2tleXVwIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5ZG93biBpbnB1dCc6ICdzZXRGaWxsZWQnLFxuICAgICAgICAgICdmb2N1c2luICBpbnB1dCc6ICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQgaW5wdXQnOiAnZm9jdXNPdXQnXG4gICAgICAgIH0sXG4gICAgICAgIHNldEZpbGxlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLnZhbHVlID09ICcnICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdGhpcy5zZXRGaWxsZWQoKTtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgaWYoICFlcnJvciApe1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dDpjaGFuZ2UnLCAhZXJyb3IpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICBpZiggZXJyb3IgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZXJyZWQnKTtcbiAgICAgICAgICAgIHRoaXMuJCgnI2Vycm9yLXRleHQnKS50ZXh0KCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgICBpZiggdGhpcy5vcHRpb25zLmlzUmVxdWlyZWQgJiYgdmFsdWUgPT0gJycgKXtcbiAgICAgICAgICAgIGVycm9yID0gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICAgIH0gZWxzZSBpZiggdGhpcy5vcHRpb25zLmVycm9yICl7XG4gICAgICAgICAgICBlcnJvciA9IHRoaXMub3B0aW9ucy5lcnJvcih2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5lcnJvcigpO1xuICAgICAgICAgIHRoaXMuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiAhZXJyb3I7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6ICcnLFxuICAgICAgICAgIGhpbnRUZXh0OiAnJyxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICBpc1JlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHRWYWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkl0ZW0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd3b29kIGl0ZW0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwibGVmdC1pY29uLWNvbnRhaW5lclwiIGNsYXNzPVwibGVmdC1pY29uXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJpdGVtLWJvZHlcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJpbWFyeS10ZXh0XCI+PCUtcHJpbWFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzZWNvbmRhcnktdGV4dFwiPjwlLXNlY29uZGFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOiB7XG4gICAgICAgICAgbGVmdEljb25Db250YWluZXI6ICcjbGVmdC1pY29uLWNvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaWNvbjogJ2Vycm9yJyxcbiAgICAgICAgICBwcmltYXJ5VGV4dDogJ0Vycm9yJyxcbiAgICAgICAgICBzZWNvbmRhcnlUZXh0OiAnV3JvbmcgdXNlcm5hbWUgb3IgcGFzc3dvcmQnLFxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF2YXRhciA9IG5ldyBXb29kLkF2YXRhcih7XG4gICAgICAgICAgICBpY29uOiAnZXhjbGFtYXRpb24nLFxuICAgICAgICAgICAgc2hhcGU6ICdjaXJjbGUnLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGVmdEljb25Db250YWluZXIuc2hvdyhhdmF0YXIpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5SaXBwbGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBjbGFzczogJ3dvb2QgcmlwcGxlLXdyYXBwZXInLFxuICB9LFxuICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgJycpLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIHRoaXMuJHJpcHBsZXMgPSBbXTtcbiAgfSxcbiAgcHl0aGFnb3JhczogZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KGEsMikrTWF0aC5wb3coYiwyKSwwLjUpO1xuICB9LFxuICBjcmVhdGVSaXBwbGUoY2xhc3NOYW1lLCB4LCB5KXtcbiAgICB2YXIgJHJpcHBsZSA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICRyaXBwbGUuYWRkQ2xhc3MoJ2NpcmNsZSByaXBwbGUgJyArIGNsYXNzTmFtZSk7XG4gICAgdmFyIGggPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICB2YXIgdyA9IHRoaXMuJGVsLndpZHRoKCk7XG4gICAgaWYoIHggPT0gdW5kZWZpbmVkICl7XG4gICAgICB4ID0gdy8yO1xuICAgICAgeSA9IGgvMjtcbiAgICB9XG4gICAgdmFyIHIgPSB0aGlzLnB5dGhhZ29yYXMoTWF0aC5tYXgoeCx3LXgpLCBNYXRoLm1heCh5LGgteSkpO1xuICAgICRyaXBwbGUuY3NzKHtcbiAgICAgICd0b3AnOiB5IC0gcixcbiAgICAgICdsZWZ0JzogeCAtIHIsXG4gICAgICAnaGVpZ2h0JzogMipyLFxuICAgICAgJ3dpZHRoJzogMipyXG4gICAgfSk7XG4gICAgcmV0dXJuICRyaXBwbGU7XG4gIH0sXG4gIGZvY3VzSW46IGZ1bmN0aW9uKCl7XG4gICAgaWYoICF0aGlzLiRwdWxzZSAgJiYgdGhpcy4kcmlwcGxlcy5sZW5ndGggPT0gMCl7XG4gICAgICB2YXIgJHB1bHNlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3B1bHNpbmcnKTtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZCgkcHVsc2UpO1xuICAgICAgdGhpcy4kcHVsc2UgPSAkcHVsc2U7XG4gICAgfVxuICB9LFxuICBmb2N1c091dDogZnVuY3Rpb24oKXtcbiAgICBpZiggdGhpcy4kcHVsc2UgKXtcbiAgICAgIHRoaXMuZmFkZSh0aGlzLiRwdWxzZSwgMCk7XG4gICAgICB0aGlzLiRwdWxzZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0sXG4gIG1vdXNlRG93bjogZnVuY3Rpb24oeCwgeSl7XG4gICAgdmFyICRyaXBwbGUgPSB0aGlzLmNyZWF0ZVJpcHBsZSgncHJvcGFnYXRpbmcnLCB4LCB5KTtcbiAgICB0aGlzLiRlbC5hcHBlbmQoJHJpcHBsZSk7XG4gICAgdGhpcy4kcmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICB9LFxuICBtb3VzZU91dDogZnVuY3Rpb24oKXtcbiAgICB2YXIgJHJpcHBsZSA9IHRoaXMuJHJpcHBsZXMucG9wKCk7XG4gICAgaWYoICRyaXBwbGUgKXtcbiAgICAgIHRoaXMuZmFkZSgkcmlwcGxlKTtcbiAgICB9XG4gIH0sXG4gIGNsaWNrOiBmdW5jdGlvbigpe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgJHJpcHBsZSA9IHRoaXMuJHJpcHBsZXMucG9wKCk7XG4gICAgaWYoICRyaXBwbGUgKXtcbiAgICAgIHRoaXMuJHJpcHBsZXMucHVzaCgkcmlwcGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3VzZURvd24oKTtcbiAgICB9XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi5tb3VzZU91dCgpO1xuICAgIH0sIDApO1xuICB9LFxuICBmYWRlOiBmdW5jdGlvbihyaXBwbGUsIGR1cmF0aW9uKXtcbiAgICB2YXIgZHVyYXRpb24gPSB0eXBlb2YgZHVyYXRpb24gPT0gJ251bWJlcicgPyBkdXJhdGlvbiA6IDUwMDtcbiAgICByaXBwbGUuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKXtcbiAgICAgIHJpcHBsZS5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlNwaW5uZXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLXNwaW5uZXInLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld0JveD1cIjwlLXIrNSU+IDwlLXIrNSU+IDwlLWQrMTAlPiA8JS1kKzEwJT5cIiBoZWlnaHQ9XCI8JS1kJT5cIiB3aWR0aD1cIjwlLWQlPlwiPicgK1xuICAgICAgICAgICAgJzxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI8JS1kKzEwJT5cIiBjeT1cIjwlLWQrMTAlPlwiIHI9XCI8JS1yYWRpdXMlPlwiIHN0cm9rZS13aWR0aD1cIjwlLXN0cm9rZVdpZHRoJT5cIi8+JyArXG4gICAgICAgICAgJzwvc3ZnPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcmFkaXVzOiAyMCxcbiAgICAgICAgICBzdHJva2VXaWR0aDogMlxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmFkaXVzID0gdGhpcy5vcHRpb25zLnJhZGl1cztcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgcjogcmFkaXVzLFxuICAgICAgICAgICAgZDogcmFkaXVzICogMlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgb3ZlcmxheTogZnVuY3Rpb24gKCRlbCkge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IFdvb2QuU3Bpbm5lcigpO1xuICAgICAgICB3aWRnZXQucmVuZGVyKCk7XG4gICAgICAgICRvdmVybGF5ID0gd2lkZ2V0LiRlbDtcbiAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ292ZXJsYXknKTtcblxuICAgICAgICAkZWwuYXBwZW5kKCRvdmVybGF5KTtcbiAgICAgICAgcmV0dXJuICRvdmVybGF5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ET1xuICAgIC8vIHRvb2xib3guZ3VpLndpZGdldHMuSW5saW5lTG9hZGVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgIC8vICAgICB0YWdOYW1lOiAnaW1nJyxcbiAgICAvLyAgICAgYXR0cmlidXRlczoge1xuICAgIC8vICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9iYXIuZ2lmJyxcbiAgICAvLyAgICAgICAgIHN0eWxlOiAncG9zaXRpb246YWJzb2x1dGU7bWFyZ2luOmF1dG87dG9wOjA7Ym90dG9tOjA7J1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJylcbiAgICAvLyB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuVGFibGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd0YWJsZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGNsYXNzOiAndGFibGUgdGFibGUtc3RyaXBlZCcsXG4gICAgICAgICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBzdHlsZTogJ21pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTsnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlIGlmIChzaG93SGVhZGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzwlIGlmIChzaG93Rm9vdGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0Zm9vdD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGZvb3Q+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PidcbiAgICAgICAgKSxcbiAgICAgICAgY29sbGVjdERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5zOiBmdW5jdGlvbiAoc2NoZW1hKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgIC8vIGxvYWQgdGhlIGNvbHVtbiBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzY2hlbWFcbiAgICAgICAgICAgIGlmKHNjaGVtYSl7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHNjaGVtYS5jb2x1bW5zLCBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby52aXNpYmxlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGluZm8uZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5mby5kaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uRGVmczogZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciBkZWZzID0gW107XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IGNvbC5yZW5kZXJlcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFOYW1lID0gY29sLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSBjb2wucmVuZGVyZXJPcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZGlzcGxheScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpZGdldCA9IHNlbGZbcmVuZGVyZXJdKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEsIHJlbmRlcmVyT3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZih3aWRnZXQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IGRhdGFOYW1lICsgJ18nICsgbWV0YS5yb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlcmVyc1tpZF0gPSB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwicmVuZGVyZXItY29udGFpbmVyIHdhaXRpbmdcIj48L3NwYW4+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEV4cG9ydERhdGE6IGZ1bmN0aW9uIChyZWNvcmQsIGZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRdO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRfY29sdW1ucyA9IHNlbGYuZ2V0Q29sdW1ucyhzZWxmLmNvbGxlY3Rpb24ubW9kZWwucHJvdG90eXBlLnNjaGVtYSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2x1bW5GaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbHVtbnMgPSBfLmZpbHRlcihkZWZhdWx0X2NvbHVtbnMsIG9wdGlvbnMuY29sdW1uRmlsdGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGNvbGxlY3Rpb24gZm9yIHRoaXMgZGF0YXRhYmxlXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnMgPSB7fTtcbiAgICAgICAgICAgIHNlbGYuYmFzZVNlYXJjaCA9IG9wdGlvbnMuc2VhcmNoIHx8ICcnO1xuXG4gICAgICAgICAgICBzZWxmLnJvd0hlaWdodCA9IG9wdGlvbnMucm93SGVpZ2h0IHx8IDU5O1xuICAgICAgICAgICAgc2VsZi5tYXhWaXNpYmxlUm93cyA9IG9wdGlvbnMubWF4VmlzaWJsZVJvd3MgfHwgMTA7XG4gICAgICAgICAgICBzZWxmLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgICAgICAgICBzZWxmLmNvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnMgfHwgZGVmYXVsdF9jb2x1bW5zO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5EZWZzID0gb3B0aW9ucy5jb2x1bW5EZWZzIHx8IHNlbGYuZ2V0Q29sdW1uRGVmcyhzZWxmLmNvbHVtbnMpO1xuICAgICAgICAgICAgc2VsZi5zaG93SGVhZGVyID0gb3B0aW9ucy5zaG93SGVhZGVyIHx8IHRydWU7XG4gICAgICAgICAgICBzZWxmLnNob3dGb290ZXIgPSBvcHRpb25zLnNob3dGb290ZXIgfHwgZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmRhdGFUYWJsZU9wdGlvbnMgPSBvcHRpb25zLmRhdGFUYWJsZU9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBzZWxmLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcblxuXG4gICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUm93UmVuZGVyOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJChyb3cpLmZpbmQoJy5yZW5kZXJlci1jb250YWluZXIud2FpdGluZycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkaG9sZGVyID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkaG9sZGVyLnJlbW92ZUNsYXNzKCd3YWl0aW5nJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBzZWxmLnJlbmRlcmVyc1skaG9sZGVyLmF0dHIoJ2lkJyldO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEganF1ZXJ5IG9iamVjdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlciBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyIGEgYmFja2JvbmUgdmlld1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIuJGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB2aXJ0dWFsIG1ldGhvZFxuICAgICAgICB9LFxuICAgICAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSBkZWZhdWx0IGxvYWRlciBmb3IgdGhpcyB0YWJsZSB0byBsb2FkIGNvbGxlY3Rpb24gaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNjcm9sbFk6ICQod2luZG93KS5oZWlnaHQoKSAtIDM4NSxcbiAgICAgICAgICAgICAgICBzY3JvbGxYOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlZmVyUmVuZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvbTogJzxcInRpdGxlXCI+WlRmcnRpUycsXG4gICAgICAgICAgICAgICAgc2Nyb2xsQ29sbGFwc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zLFxuICAgICAgICAgICAgICAgIGNvbHVtbkRlZnM6IHRoaXMuY29sdW1uRGVmcyxcbiAgICAgICAgICAgICAgICByb3dDYWxsYmFjazogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYub25Sb3dSZW5kZXIocm93LCBkYXRhLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGxlcjoge1xuICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5QnVmZmVyOiAyXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2ssIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBuZXcgV29vZC5TcGlubmVyLm92ZXJsYXkoc2VsZi4kZWwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0YWJsZVRvb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNTd2ZQYXRoOiAnL2Fzc2V0cy9zd2YvY29weV9jc3ZfeGxzX3BkZi5zd2YnLFxuICAgICAgICAgICAgICAgICAgICBhQnV0dG9uczpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0V4dGVuZHM6ICdjc3YnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25UZXh0OiAnRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uQ2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgYnRuLXhzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkNlbGxSZW5kZXI6IGZ1bmN0aW9uICh2YWx1ZSwgY29sdW1uLCBkb21Sb3csIHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gc2VsZi5jb2xsZWN0aW9uLmF0KHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHNlbGYuY29sdW1uc1tjb2x1bW5dLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldEV4cG9ydERhdGEocmVjb3JkLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHRoaXMuJGVsLkRhdGFUYWJsZShfLmV4dGVuZChvcHRpb25zLCBzZWxmLmRhdGFUYWJsZU9wdGlvbnMpKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2VhcmNoKHRoaXMuYmFzZVNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUgPSBzZWxmLiRlbC5jbG9zZXN0KCcuZGF0YVRhYmxlc193cmFwcGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbignc2VhcmNoLmR0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOnNlYXJjaCcsIHNlbGYudGFibGUuc2VhcmNoKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdGFibGUgPSBzZWxmO1xuICAgICAgICAgICAgICAgIHNlbGYuJGRhdGFUYWJsZS5maW5kKCdkaXYudGl0bGUnKS5hcHBlbmQoc2VsZi50aXRsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBXb29kLlNwaW5uZXIub3ZlcmxheSh0aGlzLiRlbCk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLmFqYXgucmVsb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc1RvdGFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXRIZWlnaHQ6IGZ1bmN0aW9uIChoZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZS5maW5kKCcuZGF0YVRhYmxlc19zY3JvbGxCb2R5JykuY3NzKCdtYXgtaGVpZ2h0JywgaGVpZ2h0ICsgXCJweFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplSGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2V0SGVpZ2h0KCQod2luZG93KS5oZWlnaHQoKSAtIDU3MClcbiAgICAgICAgfSxcbiAgICAgICAgdW5maWx0ZXJlZFJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzRGlzcGxheTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBzaG93SGVhZGVyOiB0aGlzLnNob3dIZWFkZXIsXG4gICAgICAgICAgICAgICAgc2hvd0Zvb3RlcjogdGhpcy5zaG93Rm9vdGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRvb2xiYXIgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwid29vZC10b29sYmFyXCIsXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJytcbiAgICAgICAgJzxkaXYgaWQ9XCJsZWZ0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cImxlZnQtaWNvbnMtd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PCUtdGl0bGUlPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cInJpZ2h0LWljb25zLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBsZWZ0SWNvbnNDb250YWluZXI6IFwiI2xlZnQtaWNvbnMtd3JhcHBlclwiLFxuICAgICAgICByaWdodEljb25zQ29udGFpbmVyOiBcIiNyaWdodC1pY29ucy13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgJ2FjdGlvbjpjbGljazppY29uJzogXCJvbkNsaWNrSWNvblwiLFxuICAgICAgfSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgLnRpdGxlJzogJ29uQ2xpY2tUaXRsZScsXG4gICAgICB9LFxuICAgICAgb25DbGlja0ljb246IGZ1bmN0aW9uKGljb25WaWV3KXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCAnYWN0aW9uOmNsaWNrOmljb24nLCBpY29uVmlldyApO1xuICAgICAgfSxcbiAgICAgIG9uQ2xpY2tUaXRsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246Y2xpY2s6dGl0bGUnKTtcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBsZWZ0SWNvbnM6IFtdLFxuICAgICAgICByaWdodEljb25zOiBbXSxcbiAgICAgICAgdGl0bGU6ICdUb29sYmFyJ1xuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGVmdEljb25MaXN0ID0gbmV3IFdvb2QuSWNvbkxpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5sZWZ0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxlZnRJY29uc0NvbnRhaW5lci5zaG93KGxlZnRJY29uTGlzdCk7XG5cbiAgICAgICAgdmFyIHJpZ2h0SWNvbkxpc3QgPSBuZXcgV29vZC5JY29uTGlzdCh7XG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLnJpZ2h0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJpZ2h0SWNvbnNDb250YWluZXIuc2hvdyhyaWdodEljb25MaXN0KTtcbiAgICAgIH0sXG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDMvMTEvMTUuXG4gKi9cbihmdW5jdGlvbiAodG9vbGJveCkge1xuICBXb29kLlRvb2x0aXAgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgdG9vbHRpcC1hbmNob3Itd3JhcHBlcicsXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1hbmNob3JcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIndvb2QtdG9vbHRpcFwiPjwlLSB0ZXh0ICU+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgZGVmYXVsdHM6e1xuICAgICAgdGV4dDogJydcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xufSkod2luZG93LnRvb2xib3gpO1xuIl19
