(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');
// require('./alert');
// require('./banner');

require('./appbar');
require('./avatar');
require('./button');
// require('./card');
// require('./button');
require('./form');
require('./icon');
// require('./label');
// require('./loader');
// require('./quicksearch');
// require('./recordtable');
require('./ripple');
require('./table');
require('./tooltip');

},{"./appbar":2,"./avatar":3,"./button":4,"./form":5,"./icon":6,"./inputs/all":7,"./ripple":9,"./table":10,"./tooltip":11}],2:[function(require,module,exports){
(function (Wood) {
    Wood.AppBar = Marionette.LayoutView.extend({
      tagName: "appbar",
      attributes: {
        class: 'appbar',
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

},{}],5:[function(require,module,exports){
(function (toolbox) {
    Wood.Form = Marionette.LayoutView.extend({
        attributes: {
            class: 'form',
        },
        template: _.template(
          '<div id="alert-container"></div>' +
          '<% ' +
          'for( var i in inputs){ ' +
              'var input = inputs[i];' +
          '%>' +
            '<div id="<%-input.label%>-container"></div>' +
          '<% } %>' +
          '<div class="btns">' +
            '<div id="submit-btn" class="submit-btn"></div>' +
          '</div>' +
        ''),
        regions: {
          alertContainer: '#alert-container',
          submitBtnContainer: '#submit-btn'
        },
        events: {
          'keypress': 'listenForSubmit'
        },
        childEvents: {
          'action:click:button': 'onSubmit'
        },
        listenForSubmit: function (e) {
          if (e.keyCode == 13) {
            this.onSubmit();
            var submitButton = this.submitBtnContainer.currentView;
            submitButton.rippleCenter();
          }
        },
        onSubmit: function(){
          //get form data
          var formData = this.getFormData();
          var formErrors = this.getFormErrors();

          if( _.isEmpty(formErrors) ){
            //trigger form submit
            this.triggerMethod("action:submit:form", formData);
          }else{
            //render errors
            this.triggerMethod("error:submit:form", formErrors);
          }
        },
        initialize: function(options){
          this.options = options;
          this.inputs = this.options.inputs;
        },
        createInputView: function(input){
          var self = this;

          if( input['combo'] ){
            // if( input.collection.url)
            //   input.collection.fetch();
            //
            // if( input.model == undefined && input.models == undefined )
            //   input.model = new Backbone.Model({ id: this.model.get(input.id) });
            //
            // input.view = new toolbox.gui.widgets.Combo(input);
            // return input.view;
          } else if( input['text'] ) {
            return new Wood.inputs.Text( _.extend(input['text'], {
              floatingLabelText: input.label
            }));
          }
        },
        getInput: function(key){
          for( var i in this.inputs ){
            var input = this.inputs[i];
            if( key == input.id )
              return input
          }
        },
        getInputVal: function(input){
          if( input && input.view )
            return input.view.getVal();
        },
        getInputError: function(input){
          if( input && input.required ){
            var inputVal = this.getInputVal(input);
            //TODO implement this as a function of the input
            // aka input.isEmpty() and isValid()
            if( inputVal == '' || inputVal == null)
              return 'empty'
          }
        },
        getFormData: function(){
          var formData = {};
          for( var i in this.inputs ){
            var input = this.inputs[i];
            formData[input['id']] = this.getInputVal(input);
          }
          return formData;
        },
        getFormErrors: function(){
          var formErrors = {};
          for( var i in this.inputs ){
            var input = this.inputs[i];
            var error = this.getInputError(input);
            if( error )
              formErrors[input['id']] = error;
          }
          return formErrors;
        },
        onRender: function(){
          for( var i in this.inputs ){
            var input = this.inputs[i];
            input.view = this.createInputView(input);
            this.addRegion( input.label + 'Container', '#' + input.label + '-container');
            this.getRegion( input.label + 'Container').show(input.view);
          }

          if( this.options.submitButton){
            var submitButton = new Wood.RaisedButton({
              label: this.options.submitButton.label || 'Submit',
            });
            this.submitBtnContainer.show(submitButton);
          }
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
          this.saveBtnContainer.currentView.stateChange('error');
        },
        save: function(){
          // var self = this;
          // var setObj = {};
          // for( var i in this.inputs ){
          //   var input = this.inputs[i];
          //   var inputValue = this.getInputValue(input);
          //   setObj[input.id] = inputValue;
          // }
          // this.model.save(setObj, {
          //     patch: true,
          //     success: function(){
          //       self.onSuccess();
          //     },
          //     error: function(){
          //       self.onError();
          //     }
          // });
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

},{}],7:[function(require,module,exports){
Wood.inputs = {};

require('./text.js');
// require('./combo.js');
// require('./checkbox.js');
// require('./groupcombo.js');
// require('./popovercombo.js');

},{"./text.js":8}],8:[function(require,module,exports){
/**
 * Created by danmurray on 12/9/15.
 */
(function (Wood) {
    Wood.inputs.Text = Marionette.LayoutView.extend({
        attributes: {
          class: 'input-text',
        },
        template: _.template(
          '<div class="label-text"><%-floatingLabelText%></div>' +
          '<div class="hint-text"><%-hintText%></div>' +
          '<input type="<%-type%>" value="<%-defaultValue%>"></input>' +
          '<div class="border-bottom">' +
            '<div class="border-bottom-inactive"></div>' +
            '<div class="border-bottom-active"></div>' +
          '</div>' +
        ''),
        events:{
          'keyup input': 'keyPress',
          'keydown input': 'keyPress',
          'focusin  input': 'focusIn',
          'focusout input': 'focusOut'
        },
        keyPress: function(e){
          if( this.getVal() == '' ){
            this.$el.removeClass('filled');
          }else{
            this.$el.addClass('filled');
          }
        },
        focusIn : function(){
          this.$el.addClass('focused');
        },
        focusOut : function(){
          this.$el.removeClass('focused');
        },
        getVal: function () {
            return this.$('input').val();
        },
        initialize: function (options) {
          var defaultValues = {
            floatingLabelText: '',
            hintText: '',
            defaultValue: '',
            type: 'text'
          };

          this.options = _.extend(defaultValues, options);

          if( this.options.floatingLabelText )
            this.$el.addClass('labeled');
        },
        onRender: function(){
          this.keyPress();
        },
        setVal: function (val) {
            return this.$('input').val(val);
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {
          });
        }
    });
})(window.Wood);

},{}],9:[function(require,module,exports){
Wood.Ripple = Marionette.ItemView.extend({
  attributes: {
    class: 'wood ripple-wrapper',
  },
  template: _.template(
  ''),
  events: {
  },
  initialize: function(){
    this.ripples = [];
  },
  pythagoras: function(a, b){
    return Math.pow(Math.pow(a,2)+Math.pow(b,2),0.5);
  },
  ripple: function(){
    var self = this;
    setTimeout(function(){
      self.propagate();
      self.fade();
    }, 0);
  },
  propagate: function(x, y){
    var self = this;
    var $ripple = $(document.createElement('div'));
    $ripple.addClass('ripple propagating circle');
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
    this.$el.append($ripple);
    this.ripples.push($ripple);
  },
  pulse: function(x,y){
    var self = this;
    var $ripple = $(document.createElement('div'));
    $ripple.addClass('ripple pulsing circle');
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
    this.$el.append($ripple);
    this.ripples.push($ripple);
  },
  fade: function(duration){
    var self = this;
    var ripple = this.ripples.pop();
    this.kill(ripple, duration);
  },
  kill: function(ripple, duration){
    var duration = typeof duration == 'number' ? duration : 500;
    if( ripple ){
      ripple.fadeOut(duration, function(){
        ripple.remove();
      });
    }
  }
});

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
          '<div class="wood tooltip"><%- text %></div>' +
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2FwcGJhci5qcyIsInNyYy9qcy9hdmF0YXIuanMiLCJzcmMvanMvYnV0dG9uLmpzIiwic3JjL2pzL2Zvcm0uanMiLCJzcmMvanMvaWNvbi5qcyIsInNyYy9qcy9pbnB1dHMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy90ZXh0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy90YWJsZS5qcyIsInNyYy9qcy90b29sdGlwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuV29vZCA9IHt9O1xuXG4vLyBpbmNsdWRlIGJhc2UgY29tbW9uIHdpZGdldHNcbnJlcXVpcmUoJy4vaW5wdXRzL2FsbCcpO1xuLy8gcmVxdWlyZSgnLi9hbGVydCcpO1xuLy8gcmVxdWlyZSgnLi9iYW5uZXInKTtcblxucmVxdWlyZSgnLi9hcHBiYXInKTtcbnJlcXVpcmUoJy4vYXZhdGFyJyk7XG5yZXF1aXJlKCcuL2J1dHRvbicpO1xuLy8gcmVxdWlyZSgnLi9jYXJkJyk7XG4vLyByZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG5yZXF1aXJlKCcuL2ljb24nKTtcbi8vIHJlcXVpcmUoJy4vbGFiZWwnKTtcbi8vIHJlcXVpcmUoJy4vbG9hZGVyJyk7XG4vLyByZXF1aXJlKCcuL3F1aWNrc2VhcmNoJyk7XG4vLyByZXF1aXJlKCcuL3JlY29yZHRhYmxlJyk7XG5yZXF1aXJlKCcuL3JpcHBsZScpO1xucmVxdWlyZSgnLi90YWJsZScpO1xucmVxdWlyZSgnLi90b29sdGlwJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkFwcEJhciA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogXCJhcHBiYXJcIixcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICdhcHBiYXInLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImFwcGJhci1icmFuZFwiIGhyZWY9XCIjXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJhdmF0YXItd3JhcHBlclwiIGNsYXNzPVwiYXZhdGFyLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ29cIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ2luLW1lbnVcIiBocmVmPVwiL2xvZ2luXCI+JyArXG4gICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtaWNvbiBmYS1zaWduLWluIGxvZ2luLWljb25cIj48L2k+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBhdmF0YXI6IFwiI2F2YXRhci13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiB7XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdmF0YXIgPSBuZXcgV29vZC5BdmF0YXIoe1xuICAgICAgICAgIGljb246ICdrZXknLFxuICAgICAgICAgIHNoYXBlOiAnaGV4YWdvbi1yb3RhdGUnLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hdmF0YXIuc2hvdyhhdmF0YXIpO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BdmF0YXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYXZhdGFyJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFwZSA8JS1zaGFwZSU+XCI+JyArXG4gICAgICAgICAgICAnPCUgaWYgKGltYWdlKSB7ICU+JyArXG4gICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiaW1nXCIgc3JjPVwiPCUtaW1hZ2UlPlwiPjwvaW1nPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGljb24pIHslPicgK1xuICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJpY29uIGZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGxldHRlcikgeyU+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxldHRlclwiPjwlLWxldHRlciU+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgICAgIGljb246ICcnLFxuICAgICAgICAgICAgbGV0dGVyOiAnJyxcbiAgICAgICAgICAgIHNoYXBlOiAnJ1xuICAgICAgICAgIH0sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgdmFyIEJ1dHRvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnYnV0dG9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCIgY2xhc3M9XCJyaXBwbGUtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG5sYWJlbFwiPjwlLWxhYmVsJT48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0JzogJ2ZvY3VzT3V0JyxcbiAgICAgICAgICAna2V5cHJlc3MnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdtb3VzZWRvd24nOidwcm9wYWdhdGUnLFxuICAgICAgICAgICdtb3VzZXVwJzogICdmYWRlJyxcbiAgICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snLFxuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdGhpcy5yaXBwbGUucHVsc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB0aGlzLnJpcHBsZS5mYWRlKDApXG4gICAgICAgIH0sXG4gICAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLnJpcHBsZS5yaXBwbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHByb3BhZ2F0ZTogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciB4ID0gZS5wYWdlWCAtIHRoaXMuJGVsLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgICAgdmFyIHkgPSBlLnBhZ2VZIC0gdGhpcy4kZWwub2Zmc2V0KCkudG9wO1xuICAgICAgICAgIHRoaXMucmlwcGxlLnByb3BhZ2F0ZSh4LCB5KTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFkZTogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucmlwcGxlLmZhZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5yaXBwbGUuZmFkZSgwKVxuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZChcImFjdGlvbjpjbGljazppY29uXCIpXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICBsYWJlbDogJ0J1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyLnNob3codGhpcy5yaXBwbGUpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzYXZlQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcy5zdGF0ZUNoYW5nZSgnc2F2aW5nJyk7XG4gICAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c2F2ZUJ1dHRvbkNsaWNrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgICAgLy8gaWYoIHRoaXMuc3RhdGUgIT0gc3RhdGUpe1xuICAgICAgICAgIC8vICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIC8vICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRmxhdEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICdidXR0b24gZmxhdCcsXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuUmFpc2VkQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2J1dHRvbiByYWlzZWQnLFxuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgICBXb29kLkZvcm0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICdmb3JtJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgaWQ9XCJhbGVydC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPCUgJyArXG4gICAgICAgICAgJ2ZvciggdmFyIGkgaW4gaW5wdXRzKXsgJyArXG4gICAgICAgICAgICAgICd2YXIgaW5wdXQgPSBpbnB1dHNbaV07JyArXG4gICAgICAgICAgJyU+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cIjwlLWlucHV0LmxhYmVsJT4tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bnNcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwic3VibWl0LWJ0blwiIGNsYXNzPVwic3VibWl0LWJ0blwiPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOiB7XG4gICAgICAgICAgYWxlcnRDb250YWluZXI6ICcjYWxlcnQtY29udGFpbmVyJyxcbiAgICAgICAgICBzdWJtaXRCdG5Db250YWluZXI6ICcjc3VibWl0LWJ0bidcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgJ2tleXByZXNzJzogJ2xpc3RlbkZvclN1Ym1pdCdcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgICAnYWN0aW9uOmNsaWNrOmJ1dHRvbic6ICdvblN1Ym1pdCdcbiAgICAgICAgfSxcbiAgICAgICAgbGlzdGVuRm9yU3VibWl0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgIHRoaXMub25TdWJtaXQoKTtcbiAgICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5yaXBwbGVDZW50ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vZ2V0IGZvcm0gZGF0YVxuICAgICAgICAgIHZhciBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoKTtcbiAgICAgICAgICB2YXIgZm9ybUVycm9ycyA9IHRoaXMuZ2V0Rm9ybUVycm9ycygpO1xuXG4gICAgICAgICAgaWYoIF8uaXNFbXB0eShmb3JtRXJyb3JzKSApe1xuICAgICAgICAgICAgLy90cmlnZ2VyIGZvcm0gc3VibWl0XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246c3VibWl0OmZvcm1cIiwgZm9ybURhdGEpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy9yZW5kZXIgZXJyb3JzXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJlcnJvcjpzdWJtaXQ6Zm9ybVwiLCBmb3JtRXJyb3JzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgdGhpcy5pbnB1dHMgPSB0aGlzLm9wdGlvbnMuaW5wdXRzO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVJbnB1dFZpZXc6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiggaW5wdXRbJ2NvbWJvJ10gKXtcbiAgICAgICAgICAgIC8vIGlmKCBpbnB1dC5jb2xsZWN0aW9uLnVybClcbiAgICAgICAgICAgIC8vICAgaW5wdXQuY29sbGVjdGlvbi5mZXRjaCgpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmKCBpbnB1dC5tb2RlbCA9PSB1bmRlZmluZWQgJiYgaW5wdXQubW9kZWxzID09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICAvLyAgIGlucHV0Lm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHsgaWQ6IHRoaXMubW9kZWwuZ2V0KGlucHV0LmlkKSB9KTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpbnB1dC52aWV3ID0gbmV3IHRvb2xib3guZ3VpLndpZGdldHMuQ29tYm8oaW5wdXQpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIGlucHV0LnZpZXc7XG4gICAgICAgICAgfSBlbHNlIGlmKCBpbnB1dFsndGV4dCddICkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBXb29kLmlucHV0cy5UZXh0KCBfLmV4dGVuZChpbnB1dFsndGV4dCddLCB7XG4gICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiBpbnB1dC5sYWJlbFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5wdXQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmlucHV0cyApe1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dHNbaV07XG4gICAgICAgICAgICBpZigga2V5ID09IGlucHV0LmlkIClcbiAgICAgICAgICAgICAgcmV0dXJuIGlucHV0XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRJbnB1dFZhbDogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICAgIGlmKCBpbnB1dCAmJiBpbnB1dC52aWV3IClcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52aWV3LmdldFZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRJbnB1dEVycm9yOiBmdW5jdGlvbihpbnB1dCl7XG4gICAgICAgICAgaWYoIGlucHV0ICYmIGlucHV0LnJlcXVpcmVkICl7XG4gICAgICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLmdldElucHV0VmFsKGlucHV0KTtcbiAgICAgICAgICAgIC8vVE9ETyBpbXBsZW1lbnQgdGhpcyBhcyBhIGZ1bmN0aW9uIG9mIHRoZSBpbnB1dFxuICAgICAgICAgICAgLy8gYWthIGlucHV0LmlzRW1wdHkoKSBhbmQgaXNWYWxpZCgpXG4gICAgICAgICAgICBpZiggaW5wdXRWYWwgPT0gJycgfHwgaW5wdXRWYWwgPT0gbnVsbClcbiAgICAgICAgICAgICAgcmV0dXJuICdlbXB0eSdcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldEZvcm1EYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBmb3JtRGF0YSA9IHt9O1xuICAgICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5pbnB1dHMgKXtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW2ldO1xuICAgICAgICAgICAgZm9ybURhdGFbaW5wdXRbJ2lkJ11dID0gdGhpcy5nZXRJbnB1dFZhbChpbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmb3JtRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Rm9ybUVycm9yczogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZm9ybUVycm9ycyA9IHt9O1xuICAgICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5pbnB1dHMgKXtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW2ldO1xuICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5nZXRJbnB1dEVycm9yKGlucHV0KTtcbiAgICAgICAgICAgIGlmKCBlcnJvciApXG4gICAgICAgICAgICAgIGZvcm1FcnJvcnNbaW5wdXRbJ2lkJ11dID0gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmb3JtRXJyb3JzO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0c1tpXTtcbiAgICAgICAgICAgIGlucHV0LnZpZXcgPSB0aGlzLmNyZWF0ZUlucHV0VmlldyhpbnB1dCk7XG4gICAgICAgICAgICB0aGlzLmFkZFJlZ2lvbiggaW5wdXQubGFiZWwgKyAnQ29udGFpbmVyJywgJyMnICsgaW5wdXQubGFiZWwgKyAnLWNvbnRhaW5lcicpO1xuICAgICAgICAgICAgdGhpcy5nZXRSZWdpb24oIGlucHV0LmxhYmVsICsgJ0NvbnRhaW5lcicpLnNob3coaW5wdXQudmlldyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IG5ldyBXb29kLlJhaXNlZEJ1dHRvbih7XG4gICAgICAgICAgICAgIGxhYmVsOiB0aGlzLm9wdGlvbnMuc3VibWl0QnV0dG9uLmxhYmVsIHx8ICdTdWJtaXQnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIC8vIHRoaXMuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnc3VjY2VzcycpO1xuICAgICAgICAgIC8vIHZhciBhbGVydCA9IG5ldyB0b29sYm94Lmd1aS53aWRnZXRzLkFsZXJ0KHtcbiAgICAgICAgICAvLyAgICAgdGl0bGU6ICdTdWNjZXNzZnVsbHkgU2F2ZWQhJyxcbiAgICAgICAgICAvLyAgICAgbWVzc2FnZTogJ1NhdmVkIHNldHRpbmdzIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgLy8gICAgIHR5cGU6ICdhbGVydC1zdWNjZXNzJ1xuICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgIC8vIHRoaXMuYWxlcnRDb250YWluZXIuc2hvdyhhbGVydCk7XG4gICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIC8vICAgc2VsZi5zYXZlQnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3LnN0YXRlQ2hhbmdlKCdzYXZlJyk7XG4gICAgICAgICAgLy8gICBzZWxmLmFsZXJ0Q29udGFpbmVyLmN1cnJlbnRWaWV3LiRlbC5mYWRlT3V0KDQwMCk7XG4gICAgICAgICAgLy8gfSwyMDAwKVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnZXJyb3InKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgLy8gdmFyIHNldE9iaiA9IHt9O1xuICAgICAgICAgIC8vIGZvciggdmFyIGkgaW4gdGhpcy5pbnB1dHMgKXtcbiAgICAgICAgICAvLyAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW2ldO1xuICAgICAgICAgIC8vICAgdmFyIGlucHV0VmFsdWUgPSB0aGlzLmdldElucHV0VmFsdWUoaW5wdXQpO1xuICAgICAgICAgIC8vICAgc2V0T2JqW2lucHV0LmlkXSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgLy8gfVxuICAgICAgICAgIC8vIHRoaXMubW9kZWwuc2F2ZShzZXRPYmosIHtcbiAgICAgICAgICAvLyAgICAgcGF0Y2g6IHRydWUsXG4gICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gICAgICAgc2VsZi5vblN1Y2Nlc3MoKTtcbiAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAvLyAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gICAgICAgc2VsZi5vbkVycm9yKCk7XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59KSh3aW5kb3cudG9vbGJveCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMjYvMTUuXG4gKi9cbiAoZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgICBXb29kLkljb24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBpY29uLXdyYXBwZXInLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2ZhJzogJzxpIGNsYXNzPVwiZmEgZmEtaWNvbiBmYS08JS1pY29uJT5cIj48L2k+JyxcbiAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPjwlLWljb24lPjwvaT4nXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZTogZnVuY3Rpb24oaWNvbikge1xuICAgICAgICAgIHJldHVybiBfLnRlbXBsYXRlKHRoaXMuaWNvblRlbXBsYXRlc1t0aGlzLm9wdGlvbnMuaWNvbkNsYXNzXSkoe2ljb246IGljb259KVxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgaWNvbjogJ2NpcmNsZS10aGluJyxcbiAgICAgICAgICB0b29sdGlwOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICBpY29uVGVtcGxhdGU6IHRoaXMuaWNvblRlbXBsYXRlKHRoaXMub3B0aW9ucy5pY29uKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5JY29uQnV0dG9uID0gV29vZC5JY29uLmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICdpY29uLXdyYXBwZXInLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJ0b29sdGlwLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgdG9vbHRpcENvbnRhaW5lcjogJyN0b29sdGlwLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICAnZm9jdXNPdXQnLFxuICAgICAgICAna2V5cHJlc3MnOiAna2V5UHJlc3MnLFxuICAgICAgICAnbW91c2Vkb3duJzogICdwcm9wYWdhdGUnLFxuICAgICAgICAnbW91c2V1cCc6ICAgICdmYWRlJyxcbiAgICAgICAgJ21vdXNlb3V0JzogJ2ZhZGUnXG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB0aGlzLnJpcHBsZS5wdWxzZSgpO1xuICAgICAgICBpZiggdGhpcy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwLmZvY3VzSW4oKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgdGhpcy5yaXBwbGUuZmFkZSgwKVxuICAgICAgICBpZiggdGhpcy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwLmZvY3VzT3V0KClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgIHRoaXMucmlwcGxlLnJpcHBsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcGFnYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnJpcHBsZS5wcm9wYWdhdGUoKTtcbiAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmljb25cIilcbiAgICAgIH0sXG4gICAgICBmYWRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgdGhpcy5yaXBwbGUuZmFkZSgpO1xuICAgICAgICAvLyB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6aWNvblwiKVxuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHRoaXMucmlwcGxlKTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgV29vZC5Ub29sdGlwKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy50b29sdGlwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50b29sdGlwQ29udGFpbmVyLnNob3codGhpcy50b29sdGlwKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uU2hvdzpmdW5jdGlvbigpe1xuICAgICAgfVxuICAgIH0pO1xufSkod2luZG93LnRvb2xib3gpO1xuIiwiV29vZC5pbnB1dHMgPSB7fTtcblxucmVxdWlyZSgnLi90ZXh0LmpzJyk7XG4vLyByZXF1aXJlKCcuL2NvbWJvLmpzJyk7XG4vLyByZXF1aXJlKCcuL2NoZWNrYm94LmpzJyk7XG4vLyByZXF1aXJlKCcuL2dyb3VwY29tYm8uanMnKTtcbi8vIHJlcXVpcmUoJy4vcG9wb3ZlcmNvbWJvLmpzJyk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDEyLzkvMTUuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuaW5wdXRzLlRleHQgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnaW5wdXQtdGV4dCcsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtdGV4dFwiPjwlLWZsb2F0aW5nTGFiZWxUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImhpbnQtdGV4dFwiPjwlLWhpbnRUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGlucHV0IHR5cGU9XCI8JS10eXBlJT5cIiB2YWx1ZT1cIjwlLWRlZmF1bHRWYWx1ZSU+XCI+PC9pbnB1dD4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b21cIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1pbmFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdrZXl1cCBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2tleWRvd24gaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdmb2N1c2luICBpbnB1dCc6ICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQgaW5wdXQnOiAnZm9jdXNPdXQnXG4gICAgICAgIH0sXG4gICAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICBpZiggdGhpcy5nZXRWYWwoKSA9PSAnJyApe1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwoKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlcyA9IHtcbiAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiAnJyxcbiAgICAgICAgICAgIGhpbnRUZXh0OiAnJyxcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoZGVmYXVsdFZhbHVlcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICBpZiggdGhpcy5vcHRpb25zLmZsb2F0aW5nTGFiZWxUZXh0IClcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdsYWJlbGVkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMua2V5UHJlc3MoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmFsOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCh2YWwpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5SaXBwbGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBjbGFzczogJ3dvb2QgcmlwcGxlLXdyYXBwZXInLFxuICB9LFxuICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgJycpLFxuICBldmVudHM6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnJpcHBsZXMgPSBbXTtcbiAgfSxcbiAgcHl0aGFnb3JhczogZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KGEsMikrTWF0aC5wb3coYiwyKSwwLjUpO1xuICB9LFxuICByaXBwbGU6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYucHJvcGFnYXRlKCk7XG4gICAgICBzZWxmLmZhZGUoKTtcbiAgICB9LCAwKTtcbiAgfSxcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbih4LCB5KXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdyaXBwbGUgcHJvcGFnYXRpbmcgY2lyY2xlJyk7XG4gICAgdmFyIGggPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICB2YXIgdyA9IHRoaXMuJGVsLndpZHRoKCk7XG4gICAgaWYoIHggPT0gdW5kZWZpbmVkICl7XG4gICAgICB4ID0gdy8yO1xuICAgICAgeSA9IGgvMjtcbiAgICB9XG4gICAgdmFyIHIgPSB0aGlzLnB5dGhhZ29yYXMoTWF0aC5tYXgoeCx3LXgpLCBNYXRoLm1heCh5LGgteSkpO1xuICAgICRyaXBwbGUuY3NzKHtcbiAgICAgICd0b3AnOiB5IC0gcixcbiAgICAgICdsZWZ0JzogeCAtIHIsXG4gICAgICAnaGVpZ2h0JzogMipyLFxuICAgICAgJ3dpZHRoJzogMipyXG4gICAgfSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKCRyaXBwbGUpO1xuICAgIHRoaXMucmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICB9LFxuICBwdWxzZTogZnVuY3Rpb24oeCx5KXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdyaXBwbGUgcHVsc2luZyBjaXJjbGUnKTtcbiAgICB2YXIgaCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICBpZiggeCA9PSB1bmRlZmluZWQgKXtcbiAgICAgIHggPSB3LzI7XG4gICAgICB5ID0gaC8yO1xuICAgIH1cbiAgICB2YXIgciA9IHRoaXMucHl0aGFnb3JhcyhNYXRoLm1heCh4LHcteCksIE1hdGgubWF4KHksaC15KSk7XG4gICAgJHJpcHBsZS5jc3Moe1xuICAgICAgJ3RvcCc6IHkgLSByLFxuICAgICAgJ2xlZnQnOiB4IC0gcixcbiAgICAgICdoZWlnaHQnOiAyKnIsXG4gICAgICAnd2lkdGgnOiAyKnJcbiAgICB9KTtcbiAgICB0aGlzLiRlbC5hcHBlbmQoJHJpcHBsZSk7XG4gICAgdGhpcy5yaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gIH0sXG4gIGZhZGU6IGZ1bmN0aW9uKGR1cmF0aW9uKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlcy5wb3AoKTtcbiAgICB0aGlzLmtpbGwocmlwcGxlLCBkdXJhdGlvbik7XG4gIH0sXG4gIGtpbGw6IGZ1bmN0aW9uKHJpcHBsZSwgZHVyYXRpb24pe1xuICAgIHZhciBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDogNTAwO1xuICAgIGlmKCByaXBwbGUgKXtcbiAgICAgIHJpcHBsZS5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpe1xuICAgICAgICByaXBwbGUucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5UYWJsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3RhYmxlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd0YWJsZSB0YWJsZS1zdHJpcGVkJyxcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHN0eWxlOiAnbWluLXdpZHRoOjEwMCU7bWluLWhlaWdodDoxMDAlOydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dIZWFkZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dGb290ZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRmb290PicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90Zm9vdD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+J1xuICAgICAgICApLFxuICAgICAgICBjb2xsZWN0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbnM6IGZ1bmN0aW9uIChzY2hlbWEpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcblxuICAgICAgICAgICAgLy8gbG9hZCB0aGUgY29sdW1uIGluZm9ybWF0aW9uIGZyb20gdGhlIHNjaGVtYVxuICAgICAgICAgICAgaWYoc2NoZW1hKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2NoZW1hLmNvbHVtbnMsIGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLnZpc2libGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5mby5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmZvLmRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5EZWZzOiBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICAgICAgdmFyIGRlZnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2wucmVuZGVyZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gY29sLnJlbmRlcmVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YU5hbWUgPSBjb2wuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IGNvbC5yZW5kZXJlck9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2lkZ2V0ID0gc2VsZltyZW5kZXJlcl0oZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSwgcmVuZGVyZXJPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHdpZGdldCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YU5hbWUgKyAnXycgKyBtZXRhLnJvdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzW2lkXSA9IHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJyZW5kZXJlci1jb250YWluZXIgd2FpdGluZ1wiPjwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RXhwb3J0RGF0YTogZnVuY3Rpb24gKHJlY29yZCwgZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQuYXR0cmlidXRlc1tmaWVsZF07XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9jb2x1bW5zID0gc2VsZi5nZXRDb2x1bW5zKHNlbGYuY29sbGVjdGlvbi5tb2RlbC5wcm90b3R5cGUuc2NoZW1hKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbHVtbkZpbHRlcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRfY29sdW1ucyA9IF8uZmlsdGVyKGRlZmF1bHRfY29sdW1ucywgb3B0aW9ucy5jb2x1bW5GaWx0ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgY29sbGVjdGlvbiBmb3IgdGhpcyBkYXRhdGFibGVcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzZWxmLnJlbmRlcmVycyA9IHt9O1xuICAgICAgICAgICAgc2VsZi5iYXNlU2VhcmNoID0gb3B0aW9ucy5zZWFyY2ggfHwgJyc7XG5cbiAgICAgICAgICAgIHNlbGYucm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQgfHwgNTk7XG4gICAgICAgICAgICBzZWxmLm1heFZpc2libGVSb3dzID0gb3B0aW9ucy5tYXhWaXNpYmxlUm93cyB8fCAxMDtcbiAgICAgICAgICAgIHNlbGYuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHNlbGYuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucyB8fCBkZWZhdWx0X2NvbHVtbnM7XG4gICAgICAgICAgICBzZWxmLmNvbHVtbkRlZnMgPSBvcHRpb25zLmNvbHVtbkRlZnMgfHwgc2VsZi5nZXRDb2x1bW5EZWZzKHNlbGYuY29sdW1ucyk7XG4gICAgICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSBvcHRpb25zLnNob3dIZWFkZXIgfHwgdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0Zvb3RlciA9IG9wdGlvbnMuc2hvd0Zvb3RlciB8fCBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuZGF0YVRhYmxlT3B0aW9ucyA9IG9wdGlvbnMuZGF0YVRhYmxlT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuXG5cbiAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNpemVIZWlnaHQoKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Sb3dSZW5kZXI6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkKHJvdykuZmluZCgnLnJlbmRlcmVyLWNvbnRhaW5lci53YWl0aW5nJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRob2xkZXIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICRob2xkZXIucmVtb3ZlQ2xhc3MoJ3dhaXRpbmcnKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IHNlbGYucmVuZGVyZXJzWyRob2xkZXIuYXR0cignaWQnKV07XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBqcXVlcnkgb2JqZWN0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlcmVyIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZW5kZXIgYSBiYWNrYm9uZSB2aWV3XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlci4kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZpcnR1YWwgbWV0aG9kXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbG9hZGVyIGZvciB0aGlzIHRhYmxlIHRvIGxvYWQgY29sbGVjdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsWTogJCh3aW5kb3cpLmhlaWdodCgpIC0gMzg1LFxuICAgICAgICAgICAgICAgIHNjcm9sbFg6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmZXJSZW5kZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOiAnPFwidGl0bGVcIj5aVGZydGlTJyxcbiAgICAgICAgICAgICAgICBzY3JvbGxDb2xsYXBzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgY29sdW1uRGVmczogdGhpcy5jb2x1bW5EZWZzLFxuICAgICAgICAgICAgICAgIHJvd0NhbGxiYWNrOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vblJvd1JlbmRlcihyb3csIGRhdGEsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlCdWZmZXI6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdSZWNvcmRzOiAnPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCIgd2lkdGg9XCIxMDAlXCI+PGltZyBjbGFzcz1cInRleHQtbWlkZGxlXCIgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9nZWFycy5naWZcIi8+PC9kaXY+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRhYmxlVG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc1N3ZlBhdGg6ICcvYXNzZXRzL3N3Zi9jb3B5X2Nzdl94bHNfcGRmLnN3ZicsXG4gICAgICAgICAgICAgICAgICAgIGFCdXR0b25zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzRXh0ZW5kczogJ2NzdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvblRleHQ6ICdFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25DbGFzczogJ2J0biBidG4tZGVmYXVsdCBidG4teHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuQ2VsbFJlbmRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb2x1bW4sIGRvbVJvdywgcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSBzZWxmLmNvbGxlY3Rpb24uYXQocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gc2VsZi5jb2x1bW5zW2NvbHVtbl0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RXhwb3J0RGF0YShyZWNvcmQsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdGhpcy4kZWwuRGF0YVRhYmxlKF8uZXh0ZW5kKG9wdGlvbnMsIHNlbGYuZGF0YVRhYmxlT3B0aW9ucykpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5zZWFyY2godGhpcy5iYXNlU2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZSA9IHNlbGYuJGVsLmNsb3Nlc3QoJy5kYXRhVGFibGVzX3dyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLm9uKCdzZWFyY2guZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6c2VhcmNoJywgc2VsZi50YWJsZS5zZWFyY2goKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0YWJsZSA9IHNlbGY7XG4gICAgICAgICAgICAgICAgc2VsZi4kZGF0YVRhYmxlLmZpbmQoJ2Rpdi50aXRsZScpLmFwcGVuZChzZWxmLnRpdGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gdG9vbGJveC5ndWkud2lkZ2V0cy5Mb2FkZXIub3ZlcmxheSh0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUuYWpheC5yZWxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzVG90YWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEhlaWdodDogZnVuY3Rpb24gKGhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlLmZpbmQoJy5kYXRhVGFibGVzX3Njcm9sbEJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCArIFwicHhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZUhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUpXG4gICAgICAgIH0sXG4gICAgICAgIHVuZmlsdGVyZWRSb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc0Rpc3BsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgc2hvd0hlYWRlcjogdGhpcy5zaG93SGVhZGVyLFxuICAgICAgICAgICAgICAgIHNob3dGb290ZXI6IHRoaXMuc2hvd0Zvb3RlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAzLzExLzE1LlxuICovXG4oZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgV29vZC5Ub29sdGlwID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd3b29kIHRvb2x0aXAtYW5jaG9yLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3b29kIHRvb2x0aXBcIj48JS0gdGV4dCAlPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgJycpLFxuICAgIGRlZmF1bHRzOntcbiAgICAgIHRleHQ6ICcnXG4gICAgfSxcbiAgICBmb2N1c0luOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBmb2N1c091dDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiJdfQ==
