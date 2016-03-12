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
          '<div class="tesla-logo"></div>' +
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
          class: 'avatar',
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
    class: 'ripple-wrapper',
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
      class: 'tooltip-anchor-wrapper',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2FwcGJhci5qcyIsInNyYy9qcy9hdmF0YXIuanMiLCJzcmMvanMvYnV0dG9uLmpzIiwic3JjL2pzL2Zvcm0uanMiLCJzcmMvanMvaWNvbi5qcyIsInNyYy9qcy9pbnB1dHMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy90ZXh0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy90YWJsZS5qcyIsInNyYy9qcy90b29sdGlwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuV29vZCA9IHt9O1xuXG4vLyBpbmNsdWRlIGJhc2UgY29tbW9uIHdpZGdldHNcbnJlcXVpcmUoJy4vaW5wdXRzL2FsbCcpO1xuLy8gcmVxdWlyZSgnLi9hbGVydCcpO1xuLy8gcmVxdWlyZSgnLi9iYW5uZXInKTtcblxucmVxdWlyZSgnLi9hcHBiYXInKTtcbnJlcXVpcmUoJy4vYXZhdGFyJyk7XG5yZXF1aXJlKCcuL2J1dHRvbicpO1xuLy8gcmVxdWlyZSgnLi9jYXJkJyk7XG4vLyByZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG5yZXF1aXJlKCcuL2ljb24nKTtcbi8vIHJlcXVpcmUoJy4vbGFiZWwnKTtcbi8vIHJlcXVpcmUoJy4vbG9hZGVyJyk7XG4vLyByZXF1aXJlKCcuL3F1aWNrc2VhcmNoJyk7XG4vLyByZXF1aXJlKCcuL3JlY29yZHRhYmxlJyk7XG5yZXF1aXJlKCcuL3JpcHBsZScpO1xucmVxdWlyZSgnLi90YWJsZScpO1xucmVxdWlyZSgnLi90b29sdGlwJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkFwcEJhciA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogXCJhcHBiYXJcIixcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICdhcHBiYXInLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImFwcGJhci1icmFuZFwiIGhyZWY9XCIjXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJhdmF0YXItd3JhcHBlclwiIGNsYXNzPVwiYXZhdGFyLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cInRlc2xhLWxvZ29cIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ2luLW1lbnVcIiBocmVmPVwiL2xvZ2luXCI+JyArXG4gICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtaWNvbiBmYS1zaWduLWluIGxvZ2luLWljb25cIj48L2k+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBhdmF0YXI6IFwiI2F2YXRhci13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiB7XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdmF0YXIgPSBuZXcgV29vZC5BdmF0YXIoe1xuICAgICAgICAgIGljb246ICdrZXknLFxuICAgICAgICAgIHNoYXBlOiAnaGV4YWdvbi1yb3RhdGUnLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hdmF0YXIuc2hvdyhhdmF0YXIpO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BdmF0YXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2F2YXRhcicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2hhcGUgPCUtc2hhcGUlPlwiPicgK1xuICAgICAgICAgICAgJzwlIGlmIChpbWFnZSkgeyAlPicgK1xuICAgICAgICAgICAgICAnPGltZyBjbGFzcz1cImltZ1wiIHNyYz1cIjwlLWltYWdlJT5cIj48L2ltZz4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihpY29uKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiaWNvbiBmYSBmYS1pY29uIGZhLTwlLWljb24lPlwiPjwvaT4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihsZXR0ZXIpIHslPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj48JS1sZXR0ZXIlPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8JX0lPicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICAgICAgICBpbWFnZTogJycsXG4gICAgICAgICAgICBpY29uOiAnJyxcbiAgICAgICAgICAgIGxldHRlcjogJycsXG4gICAgICAgICAgICBzaGFwZTogJydcbiAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIHZhciBCdXR0b24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2J1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnRubGFiZWxcIj48JS1sYWJlbCU+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczp7XG4gICAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICAgJ2tleXByZXNzJzogJ2tleVByZXNzJyxcbiAgICAgICAgICAnbW91c2Vkb3duJzoncHJvcGFnYXRlJyxcbiAgICAgICAgICAnbW91c2V1cCc6ICAnZmFkZScsXG4gICAgICAgICAgJ2NsaWNrJzogICAgJ2NsaWNrJyxcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHRoaXMucmlwcGxlLnB1bHNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdGhpcy5yaXBwbGUuZmFkZSgwKVxuICAgICAgICB9LFxuICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgdGhpcy5yaXBwbGUucmlwcGxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwcm9wYWdhdGU6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgeCA9IGUucGFnZVggLSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgIHZhciB5ID0gZS5wYWdlWSAtIHRoaXMuJGVsLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICB0aGlzLnJpcHBsZS5wcm9wYWdhdGUoeCwgeSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhZGU6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnJpcHBsZS5mYWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMucmlwcGxlLmZhZGUoMClcbiAgICAgICAgICAvLyB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6aWNvblwiKVxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgbGFiZWw6ICdCdXR0b24nLFxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5yaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHRoaXMucmlwcGxlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMuc3RhdGVDaGFuZ2UoJ3NhdmluZycpO1xuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnNhdmVCdXR0b25DbGljaycpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICAgIC8vIGlmKCB0aGlzLnN0YXRlICE9IHN0YXRlKXtcbiAgICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZsYXRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnYnV0dG9uIGZsYXQnLFxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLlJhaXNlZEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICdidXR0b24gcmFpc2VkJyxcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gICAgV29vZC5Gb3JtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGNsYXNzOiAnZm9ybScsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwiYWxlcnQtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwlICcgK1xuICAgICAgICAgICdmb3IoIHZhciBpIGluIGlucHV0cyl7ICcgK1xuICAgICAgICAgICAgICAndmFyIGlucHV0ID0gaW5wdXRzW2ldOycgK1xuICAgICAgICAgICclPicgK1xuICAgICAgICAgICAgJzxkaXYgaWQ9XCI8JS1pbnB1dC5sYWJlbCU+LWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG5zXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cInN1Ym1pdC1idG5cIiBjbGFzcz1cInN1Ym1pdC1idG5cIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgIGFsZXJ0Q29udGFpbmVyOiAnI2FsZXJ0LWNvbnRhaW5lcicsXG4gICAgICAgICAgc3VibWl0QnRuQ29udGFpbmVyOiAnI3N1Ym1pdC1idG4nXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICdrZXlwcmVzcyc6ICdsaXN0ZW5Gb3JTdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgICAgJ2FjdGlvbjpjbGljazpidXR0b24nOiAnb25TdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICAgIGxpc3RlbkZvclN1Ym1pdDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLm9uU3VibWl0KCk7XG4gICAgICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgICBzdWJtaXRCdXR0b24ucmlwcGxlQ2VudGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvL2dldCBmb3JtIGRhdGFcbiAgICAgICAgICB2YXIgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCk7XG4gICAgICAgICAgdmFyIGZvcm1FcnJvcnMgPSB0aGlzLmdldEZvcm1FcnJvcnMoKTtcblxuICAgICAgICAgIGlmKCBfLmlzRW1wdHkoZm9ybUVycm9ycykgKXtcbiAgICAgICAgICAgIC8vdHJpZ2dlciBmb3JtIHN1Ym1pdFxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOnN1Ym1pdDpmb3JtXCIsIGZvcm1EYXRhKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIC8vcmVuZGVyIGVycm9yc1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiZXJyb3I6c3VibWl0OmZvcm1cIiwgZm9ybUVycm9ycyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgIHRoaXMuaW5wdXRzID0gdGhpcy5vcHRpb25zLmlucHV0cztcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlSW5wdXRWaWV3OiBmdW5jdGlvbihpbnB1dCl7XG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgaWYoIGlucHV0Wydjb21ibyddICl7XG4gICAgICAgICAgICAvLyBpZiggaW5wdXQuY29sbGVjdGlvbi51cmwpXG4gICAgICAgICAgICAvLyAgIGlucHV0LmNvbGxlY3Rpb24uZmV0Y2goKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpZiggaW5wdXQubW9kZWwgPT0gdW5kZWZpbmVkICYmIGlucHV0Lm1vZGVscyA9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgLy8gICBpbnB1dC5tb2RlbCA9IG5ldyBCYWNrYm9uZS5Nb2RlbCh7IGlkOiB0aGlzLm1vZGVsLmdldChpbnB1dC5pZCkgfSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gaW5wdXQudmlldyA9IG5ldyB0b29sYm94Lmd1aS53aWRnZXRzLkNvbWJvKGlucHV0KTtcbiAgICAgICAgICAgIC8vIHJldHVybiBpbnB1dC52aWV3O1xuICAgICAgICAgIH0gZWxzZSBpZiggaW5wdXRbJ3RleHQnXSApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgV29vZC5pbnB1dHMuVGV4dCggXy5leHRlbmQoaW5wdXRbJ3RleHQnXSwge1xuICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogaW5wdXQubGFiZWxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldElucHV0OiBmdW5jdGlvbihrZXkpe1xuICAgICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5pbnB1dHMgKXtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW2ldO1xuICAgICAgICAgICAgaWYoIGtleSA9PSBpbnB1dC5pZCApXG4gICAgICAgICAgICAgIHJldHVybiBpbnB1dFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5wdXRWYWw6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgICBpZiggaW5wdXQgJiYgaW5wdXQudmlldyApXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudmlldy5nZXRWYWwoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5wdXRFcnJvcjogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICAgIGlmKCBpbnB1dCAmJiBpbnB1dC5yZXF1aXJlZCApe1xuICAgICAgICAgICAgdmFyIGlucHV0VmFsID0gdGhpcy5nZXRJbnB1dFZhbChpbnB1dCk7XG4gICAgICAgICAgICAvL1RPRE8gaW1wbGVtZW50IHRoaXMgYXMgYSBmdW5jdGlvbiBvZiB0aGUgaW5wdXRcbiAgICAgICAgICAgIC8vIGFrYSBpbnB1dC5pc0VtcHR5KCkgYW5kIGlzVmFsaWQoKVxuICAgICAgICAgICAgaWYoIGlucHV0VmFsID09ICcnIHx8IGlucHV0VmFsID09IG51bGwpXG4gICAgICAgICAgICAgIHJldHVybiAnZW1wdHknXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRGb3JtRGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZm9ybURhdGEgPSB7fTtcbiAgICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0c1tpXTtcbiAgICAgICAgICAgIGZvcm1EYXRhW2lucHV0WydpZCddXSA9IHRoaXMuZ2V0SW5wdXRWYWwoaW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZm9ybURhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEZvcm1FcnJvcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGZvcm1FcnJvcnMgPSB7fTtcbiAgICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0c1tpXTtcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZ2V0SW5wdXRFcnJvcihpbnB1dCk7XG4gICAgICAgICAgICBpZiggZXJyb3IgKVxuICAgICAgICAgICAgICBmb3JtRXJyb3JzW2lucHV0WydpZCddXSA9IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZm9ybUVycm9ycztcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmlucHV0cyApe1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dHNbaV07XG4gICAgICAgICAgICBpbnB1dC52aWV3ID0gdGhpcy5jcmVhdGVJbnB1dFZpZXcoaW5wdXQpO1xuICAgICAgICAgICAgdGhpcy5hZGRSZWdpb24oIGlucHV0LmxhYmVsICsgJ0NvbnRhaW5lcicsICcjJyArIGlucHV0LmxhYmVsICsgJy1jb250YWluZXInKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVnaW9uKCBpbnB1dC5sYWJlbCArICdDb250YWluZXInKS5zaG93KGlucHV0LnZpZXcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuc3VibWl0QnV0dG9uKXtcbiAgICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgICBsYWJlbDogdGhpcy5vcHRpb25zLnN1Ym1pdEJ1dHRvbi5sYWJlbCB8fCAnU3VibWl0JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdG5Db250YWluZXIuc2hvdyhzdWJtaXRCdXR0b24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAvLyB0aGlzLnNhdmVCdG5Db250YWluZXIuY3VycmVudFZpZXcuc3RhdGVDaGFuZ2UoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAvLyB2YXIgYWxlcnQgPSBuZXcgdG9vbGJveC5ndWkud2lkZ2V0cy5BbGVydCh7XG4gICAgICAgICAgLy8gICAgIHRpdGxlOiAnU3VjY2Vzc2Z1bGx5IFNhdmVkIScsXG4gICAgICAgICAgLy8gICAgIG1lc3NhZ2U6ICdTYXZlZCBzZXR0aW5ncyBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgIC8vICAgICB0eXBlOiAnYWxlcnQtc3VjY2VzcydcbiAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAvLyB0aGlzLmFsZXJ0Q29udGFpbmVyLnNob3coYWxlcnQpO1xuICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyAgIHNlbGYuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnc2F2ZScpO1xuICAgICAgICAgIC8vICAgc2VsZi5hbGVydENvbnRhaW5lci5jdXJyZW50Vmlldy4kZWwuZmFkZU91dCg0MDApO1xuICAgICAgICAgIC8vIH0sMjAwMClcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNhdmVCdG5Db250YWluZXIuY3VycmVudFZpZXcuc3RhdGVDaGFuZ2UoJ2Vycm9yJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNhdmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIC8vIHZhciBzZXRPYmogPSB7fTtcbiAgICAgICAgICAvLyBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgICAgLy8gICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0c1tpXTtcbiAgICAgICAgICAvLyAgIHZhciBpbnB1dFZhbHVlID0gdGhpcy5nZXRJbnB1dFZhbHVlKGlucHV0KTtcbiAgICAgICAgICAvLyAgIHNldE9ialtpbnB1dC5pZF0gPSBpbnB1dFZhbHVlO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgICAvLyB0aGlzLm1vZGVsLnNhdmUoc2V0T2JqLCB7XG4gICAgICAgICAgLy8gICAgIHBhdGNoOiB0cnVlLFxuICAgICAgICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vICAgICAgIHNlbGYub25TdWNjZXNzKCk7XG4gICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgLy8gICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vICAgICAgIHNlbGYub25FcnJvcigpO1xuICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgLy8gfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xufSkod2luZG93LnRvb2xib3gpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzI2LzE1LlxuICovXG4gKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gICAgV29vZC5JY29uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2ljb24td3JhcHBlcicsXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnZmEnOiAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLTwlLWljb24lPlwiPjwvaT4nLFxuICAgICAgICAgICdtYXRlcmlhbCc6ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+PCUtaWNvbiU+PC9pPidcbiAgICAgICAgfSxcbiAgICAgICAgaWNvblRlbXBsYXRlOiBmdW5jdGlvbihpY29uKSB7XG4gICAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUodGhpcy5pY29uVGVtcGxhdGVzW3RoaXMub3B0aW9ucy5pY29uQ2xhc3NdKSh7aWNvbjogaWNvbn0pXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGljb25DbGFzczogJ2ZhJyxcbiAgICAgICAgICBpY29uOiAnY2lyY2xlLXRoaW4nLFxuICAgICAgICAgIHRvb2x0aXA6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIGljb25UZW1wbGF0ZTogdGhpcy5pY29uVGVtcGxhdGUodGhpcy5vcHRpb25zLmljb24pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkljb25CdXR0b24gPSBXb29kLkljb24uZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBjbGFzczogJ2ljb24td3JhcHBlcicsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnPGRpdiBpZD1cInRvb2x0aXAtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOntcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICB0b29sdGlwQ29udGFpbmVyOiAnI3Rvb2x0aXAtY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgICdmb2N1c2luJzogICdmb2N1c0luJyxcbiAgICAgICAgJ2ZvY3Vzb3V0JzogICdmb2N1c091dCcsXG4gICAgICAgICdrZXlwcmVzcyc6ICdrZXlQcmVzcycsXG4gICAgICAgICdtb3VzZWRvd24nOiAgJ3Byb3BhZ2F0ZScsXG4gICAgICAgICdtb3VzZXVwJzogICAgJ2ZhZGUnLFxuICAgICAgICAnbW91c2VvdXQnOiAnZmFkZSdcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHRoaXMucmlwcGxlLnB1bHNlKCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNJbigpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB0aGlzLnJpcHBsZS5mYWRlKDApXG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAga2V5UHJlc3M6IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgdGhpcy5yaXBwbGUucmlwcGxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wYWdhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMucmlwcGxlLnByb3BhZ2F0ZSgpO1xuICAgICAgICAvLyB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6aWNvblwiKVxuICAgICAgfSxcbiAgICAgIGZhZGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICB0aGlzLnJpcHBsZS5mYWRlKCk7XG4gICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZChcImFjdGlvbjpjbGljazppY29uXCIpXG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMucmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyLnNob3codGhpcy5yaXBwbGUpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBXb29kLlRvb2x0aXAoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLnRvb2x0aXBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnRvb2x0aXBDb250YWluZXIuc2hvdyh0aGlzLnRvb2x0aXApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25TaG93OmZ1bmN0aW9uKCl7XG4gICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cudG9vbGJveCk7XG4iLCJXb29kLmlucHV0cyA9IHt9O1xuXG5yZXF1aXJlKCcuL3RleHQuanMnKTtcbi8vIHJlcXVpcmUoJy4vY29tYm8uanMnKTtcbi8vIHJlcXVpcmUoJy4vY2hlY2tib3guanMnKTtcbi8vIHJlcXVpcmUoJy4vZ3JvdXBjb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9wb3BvdmVyY29tYm8uanMnKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTIvOS8xNS5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5pbnB1dHMuVGV4dCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICdpbnB1dC10ZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC10ZXh0XCI+PCUtZmxvYXRpbmdMYWJlbFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGludC10ZXh0XCI+PCUtaGludFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8aW5wdXQgdHlwZT1cIjwlLXR5cGUlPlwiIHZhbHVlPVwiPCUtZGVmYXVsdFZhbHVlJT5cIj48L2lucHV0PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWluYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20tYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2tleXVwIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5ZG93biBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2ZvY3VzaW4gIGlucHV0JzogJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCBpbnB1dCc6ICdmb2N1c091dCdcbiAgICAgICAgfSxcbiAgICAgICAga2V5UHJlc3M6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGlmKCB0aGlzLmdldFZhbCgpID09ICcnICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWVzID0ge1xuICAgICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6ICcnLFxuICAgICAgICAgICAgaGludFRleHQ6ICcnLFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZChkZWZhdWx0VmFsdWVzLCBvcHRpb25zKTtcblxuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQgKVxuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2xhYmVsZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5rZXlQcmVzcygpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCJXb29kLlJpcHBsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgYXR0cmlidXRlczoge1xuICAgIGNsYXNzOiAncmlwcGxlLXdyYXBwZXInLFxuICB9LFxuICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgJycpLFxuICBldmVudHM6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnJpcHBsZXMgPSBbXTtcbiAgfSxcbiAgcHl0aGFnb3JhczogZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KGEsMikrTWF0aC5wb3coYiwyKSwwLjUpO1xuICB9LFxuICByaXBwbGU6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYucHJvcGFnYXRlKCk7XG4gICAgICBzZWxmLmZhZGUoKTtcbiAgICB9LCAwKTtcbiAgfSxcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbih4LCB5KXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdyaXBwbGUgcHJvcGFnYXRpbmcgY2lyY2xlJyk7XG4gICAgdmFyIGggPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICB2YXIgdyA9IHRoaXMuJGVsLndpZHRoKCk7XG4gICAgaWYoIHggPT0gdW5kZWZpbmVkICl7XG4gICAgICB4ID0gdy8yO1xuICAgICAgeSA9IGgvMjtcbiAgICB9XG4gICAgdmFyIHIgPSB0aGlzLnB5dGhhZ29yYXMoTWF0aC5tYXgoeCx3LXgpLCBNYXRoLm1heCh5LGgteSkpO1xuICAgICRyaXBwbGUuY3NzKHtcbiAgICAgICd0b3AnOiB5IC0gcixcbiAgICAgICdsZWZ0JzogeCAtIHIsXG4gICAgICAnaGVpZ2h0JzogMipyLFxuICAgICAgJ3dpZHRoJzogMipyXG4gICAgfSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKCRyaXBwbGUpO1xuICAgIHRoaXMucmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICB9LFxuICBwdWxzZTogZnVuY3Rpb24oeCx5KXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdyaXBwbGUgcHVsc2luZyBjaXJjbGUnKTtcbiAgICB2YXIgaCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICBpZiggeCA9PSB1bmRlZmluZWQgKXtcbiAgICAgIHggPSB3LzI7XG4gICAgICB5ID0gaC8yO1xuICAgIH1cbiAgICB2YXIgciA9IHRoaXMucHl0aGFnb3JhcyhNYXRoLm1heCh4LHcteCksIE1hdGgubWF4KHksaC15KSk7XG4gICAgJHJpcHBsZS5jc3Moe1xuICAgICAgJ3RvcCc6IHkgLSByLFxuICAgICAgJ2xlZnQnOiB4IC0gcixcbiAgICAgICdoZWlnaHQnOiAyKnIsXG4gICAgICAnd2lkdGgnOiAyKnJcbiAgICB9KTtcbiAgICB0aGlzLiRlbC5hcHBlbmQoJHJpcHBsZSk7XG4gICAgdGhpcy5yaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gIH0sXG4gIGZhZGU6IGZ1bmN0aW9uKGR1cmF0aW9uKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlcy5wb3AoKTtcbiAgICB0aGlzLmtpbGwocmlwcGxlLCBkdXJhdGlvbik7XG4gIH0sXG4gIGtpbGw6IGZ1bmN0aW9uKHJpcHBsZSwgZHVyYXRpb24pe1xuICAgIHZhciBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDogNTAwO1xuICAgIGlmKCByaXBwbGUgKXtcbiAgICAgIHJpcHBsZS5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpe1xuICAgICAgICByaXBwbGUucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5UYWJsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3RhYmxlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd0YWJsZSB0YWJsZS1zdHJpcGVkJyxcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHN0eWxlOiAnbWluLXdpZHRoOjEwMCU7bWluLWhlaWdodDoxMDAlOydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dIZWFkZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dGb290ZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRmb290PicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90Zm9vdD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+J1xuICAgICAgICApLFxuICAgICAgICBjb2xsZWN0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbnM6IGZ1bmN0aW9uIChzY2hlbWEpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcblxuICAgICAgICAgICAgLy8gbG9hZCB0aGUgY29sdW1uIGluZm9ybWF0aW9uIGZyb20gdGhlIHNjaGVtYVxuICAgICAgICAgICAgaWYoc2NoZW1hKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2NoZW1hLmNvbHVtbnMsIGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLnZpc2libGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5mby5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmZvLmRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5EZWZzOiBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICAgICAgdmFyIGRlZnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2wucmVuZGVyZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gY29sLnJlbmRlcmVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YU5hbWUgPSBjb2wuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IGNvbC5yZW5kZXJlck9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2lkZ2V0ID0gc2VsZltyZW5kZXJlcl0oZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSwgcmVuZGVyZXJPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHdpZGdldCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YU5hbWUgKyAnXycgKyBtZXRhLnJvdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzW2lkXSA9IHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJyZW5kZXJlci1jb250YWluZXIgd2FpdGluZ1wiPjwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RXhwb3J0RGF0YTogZnVuY3Rpb24gKHJlY29yZCwgZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQuYXR0cmlidXRlc1tmaWVsZF07XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9jb2x1bW5zID0gc2VsZi5nZXRDb2x1bW5zKHNlbGYuY29sbGVjdGlvbi5tb2RlbC5wcm90b3R5cGUuc2NoZW1hKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbHVtbkZpbHRlcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRfY29sdW1ucyA9IF8uZmlsdGVyKGRlZmF1bHRfY29sdW1ucywgb3B0aW9ucy5jb2x1bW5GaWx0ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgY29sbGVjdGlvbiBmb3IgdGhpcyBkYXRhdGFibGVcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzZWxmLnJlbmRlcmVycyA9IHt9O1xuICAgICAgICAgICAgc2VsZi5iYXNlU2VhcmNoID0gb3B0aW9ucy5zZWFyY2ggfHwgJyc7XG5cbiAgICAgICAgICAgIHNlbGYucm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQgfHwgNTk7XG4gICAgICAgICAgICBzZWxmLm1heFZpc2libGVSb3dzID0gb3B0aW9ucy5tYXhWaXNpYmxlUm93cyB8fCAxMDtcbiAgICAgICAgICAgIHNlbGYuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHNlbGYuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucyB8fCBkZWZhdWx0X2NvbHVtbnM7XG4gICAgICAgICAgICBzZWxmLmNvbHVtbkRlZnMgPSBvcHRpb25zLmNvbHVtbkRlZnMgfHwgc2VsZi5nZXRDb2x1bW5EZWZzKHNlbGYuY29sdW1ucyk7XG4gICAgICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSBvcHRpb25zLnNob3dIZWFkZXIgfHwgdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0Zvb3RlciA9IG9wdGlvbnMuc2hvd0Zvb3RlciB8fCBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuZGF0YVRhYmxlT3B0aW9ucyA9IG9wdGlvbnMuZGF0YVRhYmxlT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuXG5cbiAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNpemVIZWlnaHQoKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Sb3dSZW5kZXI6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkKHJvdykuZmluZCgnLnJlbmRlcmVyLWNvbnRhaW5lci53YWl0aW5nJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRob2xkZXIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICRob2xkZXIucmVtb3ZlQ2xhc3MoJ3dhaXRpbmcnKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IHNlbGYucmVuZGVyZXJzWyRob2xkZXIuYXR0cignaWQnKV07XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBqcXVlcnkgb2JqZWN0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlcmVyIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZW5kZXIgYSBiYWNrYm9uZSB2aWV3XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlci4kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZpcnR1YWwgbWV0aG9kXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbG9hZGVyIGZvciB0aGlzIHRhYmxlIHRvIGxvYWQgY29sbGVjdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsWTogJCh3aW5kb3cpLmhlaWdodCgpIC0gMzg1LFxuICAgICAgICAgICAgICAgIHNjcm9sbFg6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmZXJSZW5kZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOiAnPFwidGl0bGVcIj5aVGZydGlTJyxcbiAgICAgICAgICAgICAgICBzY3JvbGxDb2xsYXBzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgY29sdW1uRGVmczogdGhpcy5jb2x1bW5EZWZzLFxuICAgICAgICAgICAgICAgIHJvd0NhbGxiYWNrOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vblJvd1JlbmRlcihyb3csIGRhdGEsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlCdWZmZXI6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdSZWNvcmRzOiAnPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCIgd2lkdGg9XCIxMDAlXCI+PGltZyBjbGFzcz1cInRleHQtbWlkZGxlXCIgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9nZWFycy5naWZcIi8+PC9kaXY+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRhYmxlVG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc1N3ZlBhdGg6ICcvYXNzZXRzL3N3Zi9jb3B5X2Nzdl94bHNfcGRmLnN3ZicsXG4gICAgICAgICAgICAgICAgICAgIGFCdXR0b25zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzRXh0ZW5kczogJ2NzdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvblRleHQ6ICdFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25DbGFzczogJ2J0biBidG4tZGVmYXVsdCBidG4teHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuQ2VsbFJlbmRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb2x1bW4sIGRvbVJvdywgcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSBzZWxmLmNvbGxlY3Rpb24uYXQocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gc2VsZi5jb2x1bW5zW2NvbHVtbl0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RXhwb3J0RGF0YShyZWNvcmQsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdGhpcy4kZWwuRGF0YVRhYmxlKF8uZXh0ZW5kKG9wdGlvbnMsIHNlbGYuZGF0YVRhYmxlT3B0aW9ucykpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5zZWFyY2godGhpcy5iYXNlU2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZSA9IHNlbGYuJGVsLmNsb3Nlc3QoJy5kYXRhVGFibGVzX3dyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLm9uKCdzZWFyY2guZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6c2VhcmNoJywgc2VsZi50YWJsZS5zZWFyY2goKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0YWJsZSA9IHNlbGY7XG4gICAgICAgICAgICAgICAgc2VsZi4kZGF0YVRhYmxlLmZpbmQoJ2Rpdi50aXRsZScpLmFwcGVuZChzZWxmLnRpdGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gdG9vbGJveC5ndWkud2lkZ2V0cy5Mb2FkZXIub3ZlcmxheSh0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUuYWpheC5yZWxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzVG90YWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEhlaWdodDogZnVuY3Rpb24gKGhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlLmZpbmQoJy5kYXRhVGFibGVzX3Njcm9sbEJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCArIFwicHhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZUhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUpXG4gICAgICAgIH0sXG4gICAgICAgIHVuZmlsdGVyZWRSb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc0Rpc3BsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgc2hvd0hlYWRlcjogdGhpcy5zaG93SGVhZGVyLFxuICAgICAgICAgICAgICAgIHNob3dGb290ZXI6IHRoaXMuc2hvd0Zvb3RlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAzLzExLzE1LlxuICovXG4oZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgV29vZC5Ub29sdGlwID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd0b29sdGlwLWFuY2hvci13cmFwcGVyJyxcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLWFuY2hvclwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtd3JhcHBlclwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwid29vZC10b29sdGlwXCI+PCUtIHRleHQgJT48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICcnKSxcbiAgICBkZWZhdWx0czp7XG4gICAgICB0ZXh0OiAnJ1xuICAgIH0sXG4gICAgZm9jdXNJbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgZm9jdXNPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfSxcbiAgfSk7XG59KSh3aW5kb3cudG9vbGJveCk7XG4iXX0=
