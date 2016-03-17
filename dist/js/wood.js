(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');
// require('./banner');

require('./appbar');
require('./avatar');
require('./button');
// require('./card');
// require('./button');
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

},{"./appbar":2,"./avatar":3,"./button":4,"./form":5,"./icon":6,"./inputs/all":7,"./item":9,"./ripple":10,"./spinner":11,"./table":12,"./tooltip":13}],2:[function(require,module,exports){
(function (Wood) {
    Wood.AppBar = Marionette.LayoutView.extend({
      tagName: "appbar",
      attributes: {
        class: 'wood appbar',
      },
      template: _.template(''+
        '<div class="appbar-brand" href="#">' +
          '<div id="avatar-wrapper" class="avatar-wrapper"></div>' +
          '<div class="logo"></div>' +
        '</div>' +
        '<div class="login-menu" href="/login">' +
          '<i class="fa fa-icon fa-sign-in login-icon"></i>' +
        '</div>' +
      ''),
      regions:{
        avatar: "#avatar-wrapper",
      },
      events: {
      },
      initialize: function () {
      },
      onRender: function () {
        var avatar = new Wood.Avatar({
          icon: 'key',
          shape: 'hexagon-rotate',
        });
        this.avatar.show(avatar);
      },
    });
})(window.Wood);

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
          this.$el.attr('disabled', disabled );
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
          this.disable(true);
        },
        onSuccess: function(){
          //TODO
        },
        onError: function(){
          //TODO
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
      // build the final list of options for the childView class
      var options = _.extend({}, childViewOptions, options, {
        id: id
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
          // this.triggerMethod('action:submit:form', data);
          this.onPost();
        }
      },
      defaults: {
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
        // var self = this;
        // this.saveBtnContainer.currentView.stateChange('success');
        // var alert = new toolbox.gui.widgets.Alert({
        //     title: 'Successfully Saved!',
        //     message: 'Saved settings successfully',
        //     type: 'alert-success'
        // });
        // this.alertContainer.show(alert);
        // setTimeout(function(){
        //   self.saveBtnContainer.currentView.stateChange('save');
        //   self.alertContainer.currentView.$el.fadeOut(400);
        // },2000)
      },
      onError: function(){
        // this.saveBtnContainer.currentView.stateChange('error');
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
          if( this.options.isRequired && this.getValue() == '' ){
            error = 'This field is required';
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
            value: this.value
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
          '<svg class="circular" viewBox="25 25 50 50" height="<%-height%>" width="<%-width%>">' +
            '<circle class="path" cx="50" cy="50" r="<%-radius%>" stroke-width="<%-strokeWidth%>"/>' +
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
            height: radius * 2,
            width: radius * 2
          });
        }
    }, {
      overlay: function ($el) {
        //
        // var $overlay = $(
        //     '<div class="text-center fill-height">' +
        //         '<span class="text-middle"></span>' +
        //         '<img src="/assets/images/loaders/gears.gif"/>' +
        //     '</div>'
        // );
        //
        // $overlay.css('padding', '20px');
        // $overlay.css('position', 'absolute');
        // $overlay.css('top', 0);
        // $overlay.css('left', 0);
        // $overlay.css('height', '100%');
        // $overlay.css('width', '100%');
        // $overlay.css('z-index', '1000');
        // $overlay.css('background', '#F9F9F9');
        // $overlay.css('opacity', '0.8');
        // $overlay.css('cursor', 'wait');
        //
        // $el.append($overlay);
        // return $overlay;
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
                language: {
                    loadingRecords: '<div class="text-center" width="100%"><img class="text-middle" src="/assets/images/loaders/gears.gif"/></div>'
                },
                ajax: function (data, callback, settings) {
                    return self.collection.fetch({
                        data: {
                            expand: self.columns.map(function(c){return c.data}).join(','),
                        },
                        success: function (collection) {
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

        },
        onDestroy: function (){
            $(window).off("resize");
        },
        refresh: function () {
            var $overlay = toolbox.gui.widgets.Loader.overlay(this.$el);

            this.table.ajax.reload(function () {
                $overlay.remove();
            });
        },
        rowCount: function () {
            var info = this.table.page.info();
            return info.recordsTotal;
        },
        setHeight: function (height) {
            this.$dataTable.find('.dataTables_scrollBody').css('height', height + "px");
        },
        resizeHeight : function(){
            this.setHeight($(window).height() - 385)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2FwcGJhci5qcyIsInNyYy9qcy9hdmF0YXIuanMiLCJzcmMvanMvYnV0dG9uLmpzIiwic3JjL2pzL2Zvcm0uanMiLCJzcmMvanMvaWNvbi5qcyIsInNyYy9qcy9pbnB1dHMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy90ZXh0LmpzIiwic3JjL2pzL2l0ZW0uanMiLCJzcmMvanMvcmlwcGxlLmpzIiwic3JjL2pzL3NwaW5uZXIuanMiLCJzcmMvanMvdGFibGUuanMiLCJzcmMvanMvdG9vbHRpcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuV29vZCA9IHt9O1xuXG4vLyBpbmNsdWRlIGJhc2UgY29tbW9uIHdpZGdldHNcbnJlcXVpcmUoJy4vaW5wdXRzL2FsbCcpO1xuLy8gcmVxdWlyZSgnLi9iYW5uZXInKTtcblxucmVxdWlyZSgnLi9hcHBiYXInKTtcbnJlcXVpcmUoJy4vYXZhdGFyJyk7XG5yZXF1aXJlKCcuL2J1dHRvbicpO1xuLy8gcmVxdWlyZSgnLi9jYXJkJyk7XG4vLyByZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG5yZXF1aXJlKCcuL2ljb24nKTtcbnJlcXVpcmUoJy4vaXRlbScpO1xuLy8gcmVxdWlyZSgnLi9sYWJlbCcpO1xucmVxdWlyZSgnLi9zcGlubmVyJyk7XG4vLyByZXF1aXJlKCcuL3F1aWNrc2VhcmNoJyk7XG4vLyByZXF1aXJlKCcuL3JlY29yZHRhYmxlJyk7XG5yZXF1aXJlKCcuL3JpcHBsZScpO1xucmVxdWlyZSgnLi90YWJsZScpO1xucmVxdWlyZSgnLi90b29sdGlwJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkFwcEJhciA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogXCJhcHBiYXJcIixcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGFwcGJhcicsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycrXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYXBwYmFyLWJyYW5kXCIgaHJlZj1cIiNcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImF2YXRhci13cmFwcGVyXCIgY2xhc3M9XCJhdmF0YXItd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9nb1wiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwibG9naW4tbWVudVwiIGhyZWY9XCIvbG9naW5cIj4nICtcbiAgICAgICAgICAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLXNpZ24taW4gbG9naW4taWNvblwiPjwvaT4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIGF2YXRhcjogXCIjYXZhdGFyLXdyYXBwZXJcIixcbiAgICAgIH0sXG4gICAgICBldmVudHM6IHtcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGF2YXRhciA9IG5ldyBXb29kLkF2YXRhcih7XG4gICAgICAgICAgaWNvbjogJ2tleScsXG4gICAgICAgICAgc2hhcGU6ICdoZXhhZ29uLXJvdGF0ZScsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmF2YXRhci5zaG93KGF2YXRhcik7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkF2YXRhciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBhdmF0YXInLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cInNoYXBlIDwlLXNoYXBlJT5cIj4nICtcbiAgICAgICAgICAgICc8JSBpZiAoaW1hZ2UpIHsgJT4nICtcbiAgICAgICAgICAgICAgJzxpbWcgY2xhc3M9XCJpbWdcIiBzcmM9XCI8JS1pbWFnZSU+XCI+PC9pbWc+JyArXG4gICAgICAgICAgICAnPCV9IGVsc2UgaWYoaWNvbikgeyU+JyArXG4gICAgICAgICAgICAgICc8aSBjbGFzcz1cImljb24gZmEgZmEtaWNvbiBmYS08JS1pY29uJT5cIj48L2k+JyArXG4gICAgICAgICAgICAnPCV9IGVsc2UgaWYobGV0dGVyKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+PCUtbGV0dGVyJT48L3NwYW4+JyArXG4gICAgICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczp7XG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICAgICAgaWNvbjogJycsXG4gICAgICAgICAgICBsZXR0ZXI6ICcnLFxuICAgICAgICAgICAgc2hhcGU6ICcnXG4gICAgICAgICAgfSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICB2YXIgTGFiZWwgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWxhYmVsJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJpY29uLWNvbnRhaW5lclwiIGNsYXNzPVwiaWNvbi13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInRleHQtd3JhcHBlclwiPjwlLXRleHQlPjwvc3Bhbj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgaWNvbkNvbnRhaW5lcjogJyNpY29uLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIHRleHQ6ICdCdXR0b24nLFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICggdGhpcy5vcHRpb25zLmljb24gKXtcbiAgICAgICAgICB2YXIgdmlldyA9IHRoaXMub3B0aW9ucy5pY29uLnZpZXc7XG4gICAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuaWNvbi5vcHRpb25zO1xuICAgICAgICAgIHZhciBpY29uVmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuaWNvbkNvbnRhaW5lci5zaG93KGljb25WaWV3KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdmFyIEJ1dHRvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24nLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIiBjbGFzcz1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImxhYmVsLWNvbnRhaW5lclwiIGNsYXNzPVwibGFiZWwtd3JhcHBlclwiPjwlLWxhYmVsJT48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgICAgbGFiZWxDb250YWluZXI6ICcjbGFiZWwtY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdmb2N1c2luJzogICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAgICdtb3VzZWRvd24nOidtb3VzZURvd24nLFxuICAgICAgICAgICdtb3VzZW91dCc6ICdtb3VzZU91dCcsXG4gICAgICAgICAgJ2NsaWNrJzogICAgJ2NsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c091dCgpXG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy4kZWwub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLiRlbC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZURvd24oeCwgeSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlT3V0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VPdXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmNsaWNrKCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmJ1dHRvblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGxhYmVsOiAnQnV0dG9uJyxcbiAgICAgICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oIGRpc2FibGVkICl7XG4gICAgICAgICAgdGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCBkaXNhYmxlZCApO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKHRoaXMub3B0aW9ucy5kaXNhYmxlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHJpcHBsZSk7XG5cbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBMYWJlbCh7XG4gICAgICAgICAgICBpY29uOiB7XG4gICAgICAgICAgICAgIHZpZXc6IFdvb2QuU3Bpbm5lcixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHJhZGl1czogMTIsXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDYsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMubGFiZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxhYmVsQ29udGFpbmVyLnNob3cobGFiZWwpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vVE9ET1xuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vVE9ET1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzYXZlQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcy5zdGF0ZUNoYW5nZSgnc2F2aW5nJyk7XG4gICAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c2F2ZUJ1dHRvbkNsaWNrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgICAgLy8gaWYoIHRoaXMuc3RhdGUgIT0gc3RhdGUpe1xuICAgICAgICAgIC8vICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIC8vICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRmxhdEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBmbGF0JyxcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5SYWlzZWRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gcmFpc2VkJyxcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gIFdvb2QuSW5wdXRMaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICBcImFjdGlvbjppbnB1dDpjaGFuZ2VcIjogXCJvbklucHV0Q2hhbmdlXCIsXG4gICAgfSxcbiAgICBvbklucHV0Q2hhbmdlOiBmdW5jdGlvbihpbnB1dFZpZXcsIHZhbGlkKXtcbiAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmlucHV0czpjaGFuZ2UnLCAhdGhpcy5lcnJvcigpKTtcbiAgICB9LFxuICAgIGNoaWxkVmlldzogV29vZC5JbnB1dCxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgIHZhciB2aWV3ID0gY2hpbGQuZ2V0KCd2aWV3Jyk7XG4gICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnb3B0aW9ucycpO1xuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBpZDogaWRcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICBkYXRhW2NoaWxkVmlldy5pZF0gPSBjaGlsZFZpZXcuZ2V0VmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZXJyb3IgPSBmYWxzZTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICBlcnJvciA9IGVycm9yIHx8IGNoaWxkVmlldy5lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIHZhciBjaGlsZFZhbGlkID0gY2hpbGRWaWV3LnZhbGlkYXRlKCk7XG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiYgY2hpbGRWYWxpZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuRm9ybSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ2Zvcm0nLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBmb3JtJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJpbnB1dC1saXN0LWNvbnRhaW5lclwiIGNsYXNzPVwiaW5wdXQtbGlzdFwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bnNcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cInN1Ym1pdC1idG5cIiBjbGFzcz1cInN1Ym1pdC1idG5cIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczoge1xuICAgICAgICBpbnB1dExpc3RDb250YWluZXI6ICcjaW5wdXQtbGlzdC1jb250YWluZXInLFxuICAgICAgICBzdWJtaXRCdG5Db250YWluZXI6ICcjc3VibWl0LWJ0bidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICBcInN1Ym1pdFwiOiBcIm9uRm9ybVN1Ym1pdFwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgIFwiYWN0aW9uOmNsaWNrOmJ1dHRvblwiOiBcInN1Ym1pdEZvcm1cIixcbiAgICAgICAgXCJhY3Rpb246aW5wdXRzOmNoYW5nZVwiOiBcIm9uSW5wdXRDaGFuZ2VcIixcbiAgICAgIH0sXG4gICAgICBvbklucHV0Q2hhbmdlOiBmdW5jdGlvbihpbnB1dExpc3RWaWV3LCB2YWxpZCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLmRpc2FibGUoIXZhbGlkKTtcbiAgICAgIH0sXG4gICAgICBvbkZvcm1TdWJtaXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc3VibWl0Rm9ybSgpO1xuICAgICAgfSxcbiAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy5nZXREYXRhKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy5lcnJvcigpO1xuICAgICAgfSxcbiAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcudmFsaWRhdGUoKTtcbiAgICAgIH0sXG4gICAgICBzdWJtaXRGb3JtOiBmdW5jdGlvbihlKXtcbiAgICAgICAgaWYoIHRoaXMudmFsaWRhdGUoKSApe1xuICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c3VibWl0OmZvcm0nLCBkYXRhKTtcbiAgICAgICAgICB0aGlzLm9uUG9zdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgc3VibWl0QnV0dG9uOiB7XG4gICAgICAgICAgbGFiZWw6ICdTdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpbnB1dExpc3QgPSBuZXcgV29vZC5JbnB1dExpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pbnB1dHMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5zaG93KGlucHV0TGlzdCk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24ubGFiZWwsXG4gICAgICAgICAgICBkaXNhYmxlZDogISF0aGlzLmVycm9yKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICB9LFxuICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vblBvc3QoKTtcbiAgICAgICAgXG4gICAgICB9LFxuICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIHRoaXMuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnc3VjY2VzcycpO1xuICAgICAgICAvLyB2YXIgYWxlcnQgPSBuZXcgdG9vbGJveC5ndWkud2lkZ2V0cy5BbGVydCh7XG4gICAgICAgIC8vICAgICB0aXRsZTogJ1N1Y2Nlc3NmdWxseSBTYXZlZCEnLFxuICAgICAgICAvLyAgICAgbWVzc2FnZTogJ1NhdmVkIHNldHRpbmdzIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgIC8vICAgICB0eXBlOiAnYWxlcnQtc3VjY2VzcydcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIHRoaXMuYWxlcnRDb250YWluZXIuc2hvdyhhbGVydCk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICBzZWxmLnNhdmVCdG5Db250YWluZXIuY3VycmVudFZpZXcuc3RhdGVDaGFuZ2UoJ3NhdmUnKTtcbiAgICAgICAgLy8gICBzZWxmLmFsZXJ0Q29udGFpbmVyLmN1cnJlbnRWaWV3LiRlbC5mYWRlT3V0KDQwMCk7XG4gICAgICAgIC8vIH0sMjAwMClcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyB0aGlzLnNhdmVCdG5Db250YWluZXIuY3VycmVudFZpZXcuc3RhdGVDaGFuZ2UoJ2Vycm9yJyk7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gIH0pO1xuXG59KSh3aW5kb3cudG9vbGJveCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMjYvMTUuXG4gKi9cbiAoZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgICBXb29kLkljb24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBpY29uLXdyYXBwZXInLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2ZhJzogJzxpIGNsYXNzPVwiZmEgZmEtaWNvbiBmYS08JS1pY29uJT5cIj48L2k+JyxcbiAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPjwlLWljb24lPjwvaT4nXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZTogZnVuY3Rpb24oaWNvbikge1xuICAgICAgICAgIHJldHVybiBfLnRlbXBsYXRlKHRoaXMuaWNvblRlbXBsYXRlc1t0aGlzLm9wdGlvbnMuaWNvbkNsYXNzXSkoe2ljb246IGljb259KVxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgaWNvbjogJ2NpcmNsZS10aGluJyxcbiAgICAgICAgICB0b29sdGlwOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgaWNvblRlbXBsYXRlOiB0aGlzLmljb25UZW1wbGF0ZSh0aGlzLm9wdGlvbnMuaWNvbilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIFdvb2QuSWNvbkJ1dHRvbiA9IFdvb2QuSWNvbi5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBpY29uLXdyYXBwZXInLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJ0b29sdGlwLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgdG9vbHRpcENvbnRhaW5lcjogJyN0b29sdGlwLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICdtb3VzZWRvd24nOiAnbW91c2VEb3duJyxcbiAgICAgICAgJ21vdXNlbGVhdmUnOidtb3VzZU91dCcsXG4gICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgaWYoIHRoaXMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcC5mb2N1c0luKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzT3V0KCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZURvd24oKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICB9LFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5jbGljaygpO1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6aWNvblwiKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHJpcHBsZSk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwID0gbmV3IFdvb2QuVG9vbHRpcCh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMudG9vbHRpcFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRhaW5lci5zaG93KHRoaXMudG9vbHRpcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6ZnVuY3Rpb24oKXtcbiAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIldvb2QuaW5wdXRzID0ge307XG5cbnJlcXVpcmUoJy4vdGV4dC5qcycpO1xuLy8gcmVxdWlyZSgnLi9jb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9jaGVja2JveC5qcycpO1xuLy8gcmVxdWlyZSgnLi9ncm91cGNvbWJvLmpzJyk7XG4vLyByZXF1aXJlKCcuL3BvcG92ZXJjb21iby5qcycpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5JbnB1dCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGlucHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC1wbGFjZWhvbGRlclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtdGV4dFwiPjwlLWZsb2F0aW5nTGFiZWxUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImhpbnQtdGV4dFwiPjwlLWhpbnRUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGlucHV0IHR5cGU9XCI8JS10eXBlJT5cIiB2YWx1ZT1cIjwlLXZhbHVlJT5cIj48L2lucHV0PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWluYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20tYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwiZXJyb3ItdGV4dFwiIGNsYXNzPVwiZXJyb3ItdGV4dFwiPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2tleXVwIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5ZG93biBpbnB1dCc6ICdzZXRGaWxsZWQnLFxuICAgICAgICAgICdmb2N1c2luICBpbnB1dCc6ICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQgaW5wdXQnOiAnZm9jdXNPdXQnXG4gICAgICAgIH0sXG4gICAgICAgIHNldEZpbGxlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLnZhbHVlID09ICcnICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdGhpcy5zZXRGaWxsZWQoKTtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgaWYoICFlcnJvciApe1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dDpjaGFuZ2UnLCAhZXJyb3IpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICBpZiggZXJyb3IgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZXJyZWQnKTtcbiAgICAgICAgICAgIHRoaXMuJCgnI2Vycm9yLXRleHQnKS50ZXh0KCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuaXNSZXF1aXJlZCAmJiB0aGlzLmdldFZhbHVlKCkgPT0gJycgKXtcbiAgICAgICAgICAgIGVycm9yID0gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZXJyb3IoKTtcbiAgICAgICAgICB0aGlzLnNldEVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gIWVycm9yO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiAnJyxcbiAgICAgICAgICBoaW50VGV4dDogJycsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgaXNSZXF1aXJlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQgKVxuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2xhYmVsZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5zZXRGaWxsZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmFsOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCh2YWwpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuSXRlbSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3dvb2QgaXRlbSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgaWQ9XCJsZWZ0LWljb24tY29udGFpbmVyXCIgY2xhc3M9XCJsZWZ0LWljb25cIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIml0ZW0tYm9keVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmltYXJ5LXRleHRcIj48JS1wcmltYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNlY29uZGFyeS10ZXh0XCI+PCUtc2Vjb25kYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgICBsZWZ0SWNvbkNvbnRhaW5lcjogJyNsZWZ0LWljb24tY29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpY29uOiAnZXJyb3InLFxuICAgICAgICAgIHByaW1hcnlUZXh0OiAnRXJyb3InLFxuICAgICAgICAgIHNlY29uZGFyeVRleHQ6ICdXcm9uZyB1c2VybmFtZSBvciBwYXNzd29yZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXZhdGFyID0gbmV3IFdvb2QuQXZhdGFyKHtcbiAgICAgICAgICAgIGljb246ICdleGNsYW1hdGlvbicsXG4gICAgICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sZWZ0SWNvbkNvbnRhaW5lci5zaG93KGF2YXRhcik7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCJXb29kLlJpcHBsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgYXR0cmlidXRlczoge1xuICAgIGNsYXNzOiAnd29vZCByaXBwbGUtd3JhcHBlcicsXG4gIH0sXG4gIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAnJyksXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy4kcmlwcGxlcyA9IFtdO1xuICB9LFxuICBweXRoYWdvcmFzOiBmdW5jdGlvbihhLCBiKXtcbiAgICByZXR1cm4gTWF0aC5wb3coTWF0aC5wb3coYSwyKStNYXRoLnBvdyhiLDIpLDAuNSk7XG4gIH0sXG4gIGNyZWF0ZVJpcHBsZShjbGFzc05hbWUsIHgsIHkpe1xuICAgIHZhciAkcmlwcGxlID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgJHJpcHBsZS5hZGRDbGFzcygnY2lyY2xlIHJpcHBsZSAnICsgY2xhc3NOYW1lKTtcbiAgICB2YXIgaCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICBpZiggeCA9PSB1bmRlZmluZWQgKXtcbiAgICAgIHggPSB3LzI7XG4gICAgICB5ID0gaC8yO1xuICAgIH1cbiAgICB2YXIgciA9IHRoaXMucHl0aGFnb3JhcyhNYXRoLm1heCh4LHcteCksIE1hdGgubWF4KHksaC15KSk7XG4gICAgJHJpcHBsZS5jc3Moe1xuICAgICAgJ3RvcCc6IHkgLSByLFxuICAgICAgJ2xlZnQnOiB4IC0gcixcbiAgICAgICdoZWlnaHQnOiAyKnIsXG4gICAgICAnd2lkdGgnOiAyKnJcbiAgICB9KTtcbiAgICByZXR1cm4gJHJpcHBsZTtcbiAgfSxcbiAgZm9jdXNJbjogZnVuY3Rpb24oKXtcbiAgICBpZiggIXRoaXMuJHB1bHNlICAmJiB0aGlzLiRyaXBwbGVzLmxlbmd0aCA9PSAwKXtcbiAgICAgIHZhciAkcHVsc2UgPSB0aGlzLmNyZWF0ZVJpcHBsZSgncHVsc2luZycpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kKCRwdWxzZSk7XG4gICAgICB0aGlzLiRwdWxzZSA9ICRwdWxzZTtcbiAgICB9XG4gIH0sXG4gIGZvY3VzT3V0OiBmdW5jdGlvbigpe1xuICAgIGlmKCB0aGlzLiRwdWxzZSApe1xuICAgICAgdGhpcy5mYWRlKHRoaXMuJHB1bHNlLCAwKTtcbiAgICAgIHRoaXMuJHB1bHNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgbW91c2VEb3duOiBmdW5jdGlvbih4LCB5KXtcbiAgICB2YXIgJHJpcHBsZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwcm9wYWdhdGluZycsIHgsIHkpO1xuICAgIHRoaXMuJGVsLmFwcGVuZCgkcmlwcGxlKTtcbiAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gIH0sXG4gIG1vdXNlT3V0OiBmdW5jdGlvbigpe1xuICAgIHZhciAkcmlwcGxlID0gdGhpcy4kcmlwcGxlcy5wb3AoKTtcbiAgICBpZiggJHJpcHBsZSApe1xuICAgICAgdGhpcy5mYWRlKCRyaXBwbGUpO1xuICAgIH1cbiAgfSxcbiAgY2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciAkcmlwcGxlID0gdGhpcy4kcmlwcGxlcy5wb3AoKTtcbiAgICBpZiggJHJpcHBsZSApe1xuICAgICAgdGhpcy4kcmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdXNlRG93bigpO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLm1vdXNlT3V0KCk7XG4gICAgfSwgMCk7XG4gIH0sXG4gIGZhZGU6IGZ1bmN0aW9uKHJpcHBsZSwgZHVyYXRpb24pe1xuICAgIHZhciBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDogNTAwO1xuICAgIHJpcHBsZS5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpe1xuICAgICAgcmlwcGxlLnJlbW92ZSgpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuU3Bpbm5lciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3dvb2Qtc3Bpbm5lcicsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8c3ZnIGNsYXNzPVwiY2lyY3VsYXJcIiB2aWV3Qm94PVwiMjUgMjUgNTAgNTBcIiBoZWlnaHQ9XCI8JS1oZWlnaHQlPlwiIHdpZHRoPVwiPCUtd2lkdGglPlwiPicgK1xuICAgICAgICAgICAgJzxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiPCUtcmFkaXVzJT5cIiBzdHJva2Utd2lkdGg9XCI8JS1zdHJva2VXaWR0aCU+XCIvPicgK1xuICAgICAgICAgICc8L3N2Zz4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHJhZGl1czogMjAsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6IDJcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHJhZGl1cyA9IHRoaXMub3B0aW9ucy5yYWRpdXM7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIGhlaWdodDogcmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiByYWRpdXMgKiAyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICBvdmVybGF5OiBmdW5jdGlvbiAoJGVsKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIHZhciAkb3ZlcmxheSA9ICQoXG4gICAgICAgIC8vICAgICAnPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIGZpbGwtaGVpZ2h0XCI+JyArXG4gICAgICAgIC8vICAgICAgICAgJzxzcGFuIGNsYXNzPVwidGV4dC1taWRkbGVcIj48L3NwYW4+JyArXG4gICAgICAgIC8vICAgICAgICAgJzxpbWcgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9nZWFycy5naWZcIi8+JyArXG4gICAgICAgIC8vICAgICAnPC9kaXY+J1xuICAgICAgICAvLyApO1xuICAgICAgICAvL1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ3BhZGRpbmcnLCAnMjBweCcpO1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICAgIC8vICRvdmVybGF5LmNzcygndG9wJywgMCk7XG4gICAgICAgIC8vICRvdmVybGF5LmNzcygnbGVmdCcsIDApO1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICAgIC8vICRvdmVybGF5LmNzcygnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ3otaW5kZXgnLCAnMTAwMCcpO1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ2JhY2tncm91bmQnLCAnI0Y5RjlGOScpO1xuICAgICAgICAvLyAkb3ZlcmxheS5jc3MoJ29wYWNpdHknLCAnMC44Jyk7XG4gICAgICAgIC8vICRvdmVybGF5LmNzcygnY3Vyc29yJywgJ3dhaXQnKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gJGVsLmFwcGVuZCgkb3ZlcmxheSk7XG4gICAgICAgIC8vIHJldHVybiAkb3ZlcmxheTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRPRE9cbiAgICAvLyB0b29sYm94Lmd1aS53aWRnZXRzLklubGluZUxvYWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAvLyAgICAgdGFnTmFtZTogJ2ltZycsXG4gICAgLy8gICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAvLyAgICAgICAgIHNyYzogJy9hc3NldHMvaW1hZ2VzL2xvYWRlcnMvYmFyLmdpZicsXG4gICAgLy8gICAgICAgICBzdHlsZTogJ3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbjphdXRvO3RvcDowO2JvdHRvbTowOydcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgLy8gfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRhYmxlID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAndGFibGUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3RhYmxlIHRhYmxlLXN0cmlwZWQnLFxuICAgICAgICAgICAgY2VsbHNwYWNpbmc6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgc3R5bGU6ICdtaW4td2lkdGg6MTAwJTttaW4taGVpZ2h0OjEwMCU7J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0hlYWRlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0Zvb3RlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGZvb3Q+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3Rmb290PicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8dGJvZHk+PC90Ym9keT4nXG4gICAgICAgICksXG4gICAgICAgIGNvbGxlY3REYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChtb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uczogZnVuY3Rpb24gKHNjaGVtYSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuXG4gICAgICAgICAgICAvLyBsb2FkIHRoZSBjb2x1bW4gaW5mb3JtYXRpb24gZnJvbSB0aGUgc2NoZW1hXG4gICAgICAgICAgICBpZihzY2hlbWEpe1xuICAgICAgICAgICAgICAgIF8uZWFjaChzY2hlbWEuY29sdW1ucywgZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8udmlzaWJsZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbmZvLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGluZm8uZGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbkRlZnM6IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgZGVmcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5yZW5kZXJlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBjb2wucmVuZGVyZXI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhTmFtZSA9IGNvbC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0gY29sLnJlbmRlcmVyT3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICBkZWZzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWRnZXQgPSBzZWxmW3JlbmRlcmVyXShkYXRhLCB0eXBlLCBmdWxsLCBtZXRhLCByZW5kZXJlck9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yod2lkZ2V0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhTmFtZSArICdfJyArIG1ldGEucm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnNbaWRdID0gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cInJlbmRlcmVyLWNvbnRhaW5lciB3YWl0aW5nXCI+PC9zcGFuPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZzO1xuICAgICAgICB9LFxuICAgICAgICBnZXRFeHBvcnREYXRhOiBmdW5jdGlvbiAocmVjb3JkLCBmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkXTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X2NvbHVtbnMgPSBzZWxmLmdldENvbHVtbnMoc2VsZi5jb2xsZWN0aW9uLm1vZGVsLnByb3RvdHlwZS5zY2hlbWEpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sdW1uRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdF9jb2x1bW5zID0gXy5maWx0ZXIoZGVmYXVsdF9jb2x1bW5zLCBvcHRpb25zLmNvbHVtbkZpbHRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjb2xsZWN0aW9uIGZvciB0aGlzIGRhdGF0YWJsZVxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzID0ge307XG4gICAgICAgICAgICBzZWxmLmJhc2VTZWFyY2ggPSBvcHRpb25zLnNlYXJjaCB8fCAnJztcblxuICAgICAgICAgICAgc2VsZi5yb3dIZWlnaHQgPSBvcHRpb25zLnJvd0hlaWdodCB8fCA1OTtcbiAgICAgICAgICAgIHNlbGYubWF4VmlzaWJsZVJvd3MgPSBvcHRpb25zLm1heFZpc2libGVSb3dzIHx8IDEwO1xuICAgICAgICAgICAgc2VsZi5jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zIHx8IGRlZmF1bHRfY29sdW1ucztcbiAgICAgICAgICAgIHNlbGYuY29sdW1uRGVmcyA9IG9wdGlvbnMuY29sdW1uRGVmcyB8fCBzZWxmLmdldENvbHVtbkRlZnMoc2VsZi5jb2x1bW5zKTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0hlYWRlciA9IG9wdGlvbnMuc2hvd0hlYWRlciB8fCB0cnVlO1xuICAgICAgICAgICAgc2VsZi5zaG93Rm9vdGVyID0gb3B0aW9ucy5zaG93Rm9vdGVyIHx8IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5kYXRhVGFibGVPcHRpb25zID0gb3B0aW9ucy5kYXRhVGFibGVPcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgc2VsZi50aXRsZSA9IG9wdGlvbnMudGl0bGU7XG5cblxuICAgICAgICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2l6ZUhlaWdodCgpO1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblJvd1JlbmRlcjogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQocm93KS5maW5kKCcucmVuZGVyZXItY29udGFpbmVyLndhaXRpbmcnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGhvbGRlciA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgJGhvbGRlci5yZW1vdmVDbGFzcygnd2FpdGluZycpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gc2VsZi5yZW5kZXJlcnNbJGhvbGRlci5hdHRyKCdpZCcpXTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBhIGpxdWVyeSBvYmplY3QgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZXIgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlbmRlciBhIGJhY2tib25lIHZpZXdcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyLiRlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdmlydHVhbCBtZXRob2RcbiAgICAgICAgfSxcbiAgICAgICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsb2FkZXIgZm9yIHRoaXMgdGFibGUgdG8gbG9hZCBjb2xsZWN0aW9uIGluZm9ybWF0aW9uXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzY3JvbGxZOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUsXG4gICAgICAgICAgICAgICAgc2Nyb2xsWDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZWZlclJlbmRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb206ICc8XCJ0aXRsZVwiPlpUZnJ0aVMnLFxuICAgICAgICAgICAgICAgIHNjcm9sbENvbGxhcHNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBjb2x1bW5EZWZzOiB0aGlzLmNvbHVtbkRlZnMsXG4gICAgICAgICAgICAgICAgcm93Q2FsbGJhY2s6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm9uUm93UmVuZGVyKHJvdywgZGF0YSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUJ1ZmZlcjogMlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ1JlY29yZHM6ICc8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIiB3aWR0aD1cIjEwMCVcIj48aW1nIGNsYXNzPVwidGV4dC1taWRkbGVcIiBzcmM9XCIvYXNzZXRzL2ltYWdlcy9sb2FkZXJzL2dlYXJzLmdpZlwiLz48L2Rpdj4nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2ssIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZDogc2VsZi5jb2x1bW5zLm1hcChmdW5jdGlvbihjKXtyZXR1cm4gYy5kYXRhfSkuam9pbignLCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soe2RhdGE6IHNlbGYuY29sbGVjdERhdGEoKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGFibGVUb29sczoge1xuICAgICAgICAgICAgICAgICAgICBzU3dmUGF0aDogJy9hc3NldHMvc3dmL2NvcHlfY3N2X3hsc19wZGYuc3dmJyxcbiAgICAgICAgICAgICAgICAgICAgYUJ1dHRvbnM6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNFeHRlbmRzOiAnY3N2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uVGV4dDogJ0V4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvbkNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGJ0bi14cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5DZWxsUmVuZGVyOiBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbiwgZG9tUm93LCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHNlbGYuY29sbGVjdGlvbi5hdChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBzZWxmLmNvbHVtbnNbY29sdW1uXS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRFeHBvcnREYXRhKHJlY29yZCwgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB0aGlzLiRlbC5EYXRhVGFibGUoXy5leHRlbmQob3B0aW9ucywgc2VsZi5kYXRhVGFibGVPcHRpb25zKSk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNlYXJjaCh0aGlzLmJhc2VTZWFyY2gpO1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlID0gc2VsZi4kZWwuY2xvc2VzdCgnLmRhdGFUYWJsZXNfd3JhcHBlcicpO1xuICAgICAgICAgICAgdGhpcy4kZWwub24oJ3NlYXJjaC5kdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTpzZWFyY2gnLCBzZWxmLnRhYmxlLnNlYXJjaCgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi50aXRsZSkge1xuICAgICAgICAgICAgICAgIHRhYmxlID0gc2VsZjtcbiAgICAgICAgICAgICAgICBzZWxmLiRkYXRhVGFibGUuZmluZCgnZGl2LnRpdGxlJykuYXBwZW5kKHNlbGYudGl0bGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSB0b29sYm94Lmd1aS53aWRnZXRzLkxvYWRlci5vdmVybGF5KHRoaXMuJGVsKTtcblxuICAgICAgICAgICAgdGhpcy50YWJsZS5hamF4LnJlbG9hZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcm93Q291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpbmZvID0gdGhpcy50YWJsZS5wYWdlLmluZm8oKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvLnJlY29yZHNUb3RhbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SGVpZ2h0OiBmdW5jdGlvbiAoaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUuZmluZCgnLmRhdGFUYWJsZXNfc2Nyb2xsQm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0ICsgXCJweFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplSGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2V0SGVpZ2h0KCQod2luZG93KS5oZWlnaHQoKSAtIDM4NSlcbiAgICAgICAgfSxcbiAgICAgICAgdW5maWx0ZXJlZFJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzRGlzcGxheTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBzaG93SGVhZGVyOiB0aGlzLnNob3dIZWFkZXIsXG4gICAgICAgICAgICAgICAgc2hvd0Zvb3RlcjogdGhpcy5zaG93Rm9vdGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDMvMTEvMTUuXG4gKi9cbihmdW5jdGlvbiAodG9vbGJveCkge1xuICBXb29kLlRvb2x0aXAgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgdG9vbHRpcC1hbmNob3Itd3JhcHBlcicsXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1hbmNob3JcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIndvb2QtdG9vbHRpcFwiPjwlLSB0ZXh0ICU+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgZGVmYXVsdHM6e1xuICAgICAgdGV4dDogJydcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xufSkod2luZG93LnRvb2xib3gpO1xuIl19
