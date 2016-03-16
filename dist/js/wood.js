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
// require('./loader');
// require('./quicksearch');
// require('./recordtable');
require('./ripple');
require('./table');
require('./tooltip');

},{"./appbar":2,"./avatar":3,"./button":4,"./form":5,"./icon":6,"./inputs/all":7,"./item":9,"./ripple":10,"./table":11,"./tooltip":12}],2:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function (toolbox) {
  Wood.InputList = Marionette.CollectionView.extend({
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
    validate: function(){
      var valid = true;
      for( var i in this.children._views ){
        var childView = this.children._views[i];
        valid = valid && childView.validate();
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
        "action:click:button": "submitForm"
      },
      onFormSubmit: function(e){
        e.preventDefault();
        this.submitForm();
      },
      getData: function(){
        return this.inputListContainer.currentView.getData();
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
          });
          this.submitBtnContainer.show(submitButton);
        }
      },
      onShow: function(){
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
          if( !this.error() ){
            this.validate();
          }
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

},{}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2FwcGJhci5qcyIsInNyYy9qcy9hdmF0YXIuanMiLCJzcmMvanMvYnV0dG9uLmpzIiwic3JjL2pzL2Zvcm0uanMiLCJzcmMvanMvaWNvbi5qcyIsInNyYy9qcy9pbnB1dHMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy90ZXh0LmpzIiwic3JjL2pzL2l0ZW0uanMiLCJzcmMvanMvcmlwcGxlLmpzIiwic3JjL2pzL3RhYmxlLmpzIiwic3JjL2pzL3Rvb2x0aXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5Xb29kID0ge307XG5cbi8vIGluY2x1ZGUgYmFzZSBjb21tb24gd2lkZ2V0c1xucmVxdWlyZSgnLi9pbnB1dHMvYWxsJyk7XG4vLyByZXF1aXJlKCcuL2Jhbm5lcicpO1xuXG5yZXF1aXJlKCcuL2FwcGJhcicpO1xucmVxdWlyZSgnLi9hdmF0YXInKTtcbnJlcXVpcmUoJy4vYnV0dG9uJyk7XG4vLyByZXF1aXJlKCcuL2NhcmQnKTtcbi8vIHJlcXVpcmUoJy4vYnV0dG9uJyk7XG5yZXF1aXJlKCcuL2Zvcm0nKTtcbnJlcXVpcmUoJy4vaWNvbicpO1xucmVxdWlyZSgnLi9pdGVtJyk7XG4vLyByZXF1aXJlKCcuL2xhYmVsJyk7XG4vLyByZXF1aXJlKCcuL2xvYWRlcicpO1xuLy8gcmVxdWlyZSgnLi9xdWlja3NlYXJjaCcpO1xuLy8gcmVxdWlyZSgnLi9yZWNvcmR0YWJsZScpO1xucmVxdWlyZSgnLi9yaXBwbGUnKTtcbnJlcXVpcmUoJy4vdGFibGUnKTtcbnJlcXVpcmUoJy4vdG9vbHRpcCcpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BcHBCYXIgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwiYXBwYmFyXCIsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBhcHBiYXInLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImFwcGJhci1icmFuZFwiIGhyZWY9XCIjXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJhdmF0YXItd3JhcHBlclwiIGNsYXNzPVwiYXZhdGFyLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ29cIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ2luLW1lbnVcIiBocmVmPVwiL2xvZ2luXCI+JyArXG4gICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtaWNvbiBmYS1zaWduLWluIGxvZ2luLWljb25cIj48L2k+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBhdmF0YXI6IFwiI2F2YXRhci13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiB7XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdmF0YXIgPSBuZXcgV29vZC5BdmF0YXIoe1xuICAgICAgICAgIGljb246ICdrZXknLFxuICAgICAgICAgIHNoYXBlOiAnaGV4YWdvbi1yb3RhdGUnLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hdmF0YXIuc2hvdyhhdmF0YXIpO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BdmF0YXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYXZhdGFyJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFwZSA8JS1zaGFwZSU+XCI+JyArXG4gICAgICAgICAgICAnPCUgaWYgKGltYWdlKSB7ICU+JyArXG4gICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiaW1nXCIgc3JjPVwiPCUtaW1hZ2UlPlwiPjwvaW1nPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGljb24pIHslPicgK1xuICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJpY29uIGZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGxldHRlcikgeyU+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxldHRlclwiPjwlLWxldHRlciU+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgICAgIGljb246ICcnLFxuICAgICAgICAgICAgbGV0dGVyOiAnJyxcbiAgICAgICAgICAgIHNoYXBlOiAnJ1xuICAgICAgICAgIH0sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgdmFyIEJ1dHRvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24nLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIiBjbGFzcz1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bmxhYmVsXCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdmb2N1c2luJzogICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAgICdtb3VzZWRvd24nOidtb3VzZURvd24nLFxuICAgICAgICAgICdtb3VzZW91dCc6ICdtb3VzZU91dCcsXG4gICAgICAgICAgJ2NsaWNrJzogICAgJ2NsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c091dCgpXG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy4kZWwub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLiRlbC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZURvd24oeCwgeSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlT3V0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VPdXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmNsaWNrKCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmJ1dHRvblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGxhYmVsOiAnQnV0dG9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzYXZlQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcy5zdGF0ZUNoYW5nZSgnc2F2aW5nJyk7XG4gICAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c2F2ZUJ1dHRvbkNsaWNrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgICAgLy8gaWYoIHRoaXMuc3RhdGUgIT0gc3RhdGUpe1xuICAgICAgICAgIC8vICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIC8vICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRmxhdEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBmbGF0JyxcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5SYWlzZWRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gcmFpc2VkJyxcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gIFdvb2QuSW5wdXRMaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgIGNoaWxkVmlldzogV29vZC5JbnB1dCxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgIHZhciB2aWV3ID0gY2hpbGQuZ2V0KCd2aWV3Jyk7XG4gICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnb3B0aW9ucycpO1xuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBpZDogaWRcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICBkYXRhW2NoaWxkVmlldy5pZF0gPSBjaGlsZFZpZXcuZ2V0VmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiYgY2hpbGRWaWV3LnZhbGlkYXRlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkZvcm0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICdmb3JtJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgZm9ybScsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwiaW5wdXQtbGlzdC1jb250YWluZXJcIiBjbGFzcz1cImlucHV0LWxpc3RcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJidG5zXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJzdWJtaXQtYnRuXCIgY2xhc3M9XCJzdWJtaXQtYnRuXCI+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgaW5wdXRMaXN0Q29udGFpbmVyOiAnI2lucHV0LWxpc3QtY29udGFpbmVyJyxcbiAgICAgICAgc3VibWl0QnRuQ29udGFpbmVyOiAnI3N1Ym1pdC1idG4nXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgXCJzdWJtaXRcIjogXCJvbkZvcm1TdWJtaXRcIixcbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czoge1xuICAgICAgICBcImFjdGlvbjpjbGljazpidXR0b25cIjogXCJzdWJtaXRGb3JtXCJcbiAgICAgIH0sXG4gICAgICBvbkZvcm1TdWJtaXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc3VibWl0Rm9ybSgpO1xuICAgICAgfSxcbiAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy5nZXREYXRhKCk7XG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy52YWxpZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy52YWxpZGF0ZSgpICl7XG4gICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgc3VibWl0QnV0dG9uOiB7XG4gICAgICAgICAgbGFiZWw6ICdTdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpbnB1dExpc3QgPSBuZXcgV29vZC5JbnB1dExpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pbnB1dHMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5zaG93KGlucHV0TGlzdCk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24ubGFiZWwsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5zdWJtaXRCdG5Db250YWluZXIuc2hvdyhzdWJtaXRCdXR0b24pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25TaG93OiBmdW5jdGlvbigpe1xuICAgICAgfSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyB0aGlzLnNhdmVCdG5Db250YWluZXIuY3VycmVudFZpZXcuc3RhdGVDaGFuZ2UoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgLy8gdmFyIGFsZXJ0ID0gbmV3IHRvb2xib3guZ3VpLndpZGdldHMuQWxlcnQoe1xuICAgICAgICAvLyAgICAgdGl0bGU6ICdTdWNjZXNzZnVsbHkgU2F2ZWQhJyxcbiAgICAgICAgLy8gICAgIG1lc3NhZ2U6ICdTYXZlZCBzZXR0aW5ncyBzdWNjZXNzZnVsbHknLFxuICAgICAgICAvLyAgICAgdHlwZTogJ2FsZXJ0LXN1Y2Nlc3MnXG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyB0aGlzLmFsZXJ0Q29udGFpbmVyLnNob3coYWxlcnQpO1xuICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgc2VsZi5zYXZlQnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3LnN0YXRlQ2hhbmdlKCdzYXZlJyk7XG4gICAgICAgIC8vICAgc2VsZi5hbGVydENvbnRhaW5lci5jdXJyZW50Vmlldy4kZWwuZmFkZU91dCg0MDApO1xuICAgICAgICAvLyB9LDIwMDApXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gdGhpcy5zYXZlQnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3LnN0YXRlQ2hhbmdlKCdlcnJvcicpO1xuICAgICAgfSxcbiAgICAgIHNhdmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gdmFyIHNldE9iaiA9IHt9O1xuICAgICAgICAvLyBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgIC8vICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dHNbaV07XG4gICAgICAgIC8vICAgdmFyIGlucHV0VmFsdWUgPSB0aGlzLmdldElucHV0VmFsdWUoaW5wdXQpO1xuICAgICAgICAvLyAgIHNldE9ialtpbnB1dC5pZF0gPSBpbnB1dFZhbHVlO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMubW9kZWwuc2F2ZShzZXRPYmosIHtcbiAgICAgICAgLy8gICAgIHBhdGNoOiB0cnVlLFxuICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgICAgc2VsZi5vblN1Y2Nlc3MoKTtcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgICAgc2VsZi5vbkVycm9yKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICB9KTtcblxufSkod2luZG93LnRvb2xib3gpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzI2LzE1LlxuICovXG4gKGZ1bmN0aW9uICh0b29sYm94KSB7XG4gICAgV29vZC5JY29uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgaWNvbi13cmFwcGVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgaWNvblRlbXBsYXRlczoge1xuICAgICAgICAgICdmYSc6ICc8aSBjbGFzcz1cImZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicsXG4gICAgICAgICAgJ21hdGVyaWFsJzogJzxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj48JS1pY29uJT48L2k+J1xuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGU6IGZ1bmN0aW9uKGljb24pIHtcbiAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0aGlzLmljb25UZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmljb25DbGFzc10pKHtpY29uOiBpY29ufSlcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgaWNvbkNsYXNzOiAnZmEnLFxuICAgICAgICAgIGljb246ICdjaXJjbGUtdGhpbicsXG4gICAgICAgICAgdG9vbHRpcDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIGljb25UZW1wbGF0ZTogdGhpcy5pY29uVGVtcGxhdGUodGhpcy5vcHRpb25zLmljb24pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkljb25CdXR0b24gPSBXb29kLkljb24uZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBjbGFzczogJ3dvb2QgaWNvbi13cmFwcGVyJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICc8ZGl2IGlkPVwidG9vbHRpcC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgIHRvb2x0aXBDb250YWluZXI6ICcjdG9vbHRpcC1jb250YWluZXInXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAnbW91c2Vkb3duJzogJ21vdXNlRG93bicsXG4gICAgICAgICdtb3VzZWxlYXZlJzonbW91c2VPdXQnLFxuICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNJbigpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c091dCgpO1xuICAgICAgICBpZiggdGhpcy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwLmZvY3VzT3V0KClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUubW91c2VEb3duKCk7XG4gICAgICB9LFxuICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgfSxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmljb25cIik7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciByaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBXb29kLlRvb2x0aXAoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLnRvb2x0aXBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnRvb2x0aXBDb250YWluZXIuc2hvdyh0aGlzLnRvb2x0aXApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25TaG93OmZ1bmN0aW9uKCl7XG4gICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cudG9vbGJveCk7XG4iLCJXb29kLmlucHV0cyA9IHt9O1xuXG5yZXF1aXJlKCcuL3RleHQuanMnKTtcbi8vIHJlcXVpcmUoJy4vY29tYm8uanMnKTtcbi8vIHJlcXVpcmUoJy4vY2hlY2tib3guanMnKTtcbi8vIHJlcXVpcmUoJy4vZ3JvdXBjb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9wb3BvdmVyY29tYm8uanMnKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuSW5wdXQgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBpbnB1dCcsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtcGxhY2Vob2xkZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXRleHRcIj48JS1mbG9hdGluZ0xhYmVsVGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJoaW50LXRleHRcIj48JS1oaW50VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxpbnB1dCB0eXBlPVwiPCUtdHlwZSU+XCIgdmFsdWU9XCI8JS12YWx1ZSU+XCI+PC9pbnB1dD4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b21cIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1pbmFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImVycm9yLXRleHRcIiBjbGFzcz1cImVycm9yLXRleHRcIj48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdrZXl1cCBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2tleWRvd24gaW5wdXQnOiAnc2V0RmlsbGVkJyxcbiAgICAgICAgICAnZm9jdXNpbiAgaW5wdXQnOiAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0IGlucHV0JzogJ2ZvY3VzT3V0J1xuICAgICAgICB9LFxuICAgICAgICBzZXRGaWxsZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgICBpZiggdGhpcy52YWx1ZSA9PSAnJyApe1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAga2V5UHJlc3M6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHRoaXMuc2V0RmlsbGVkKCk7XG4gICAgICAgICAgaWYoICF0aGlzLmVycm9yKCkgKXtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgIGlmKCBlcnJvciApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2VycmVkJyk7XG4gICAgICAgICAgICB0aGlzLiQoJyNlcnJvci10ZXh0JykudGV4dChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5pc1JlcXVpcmVkICYmIHRoaXMuZ2V0VmFsdWUoKSA9PSAnJyApe1xuICAgICAgICAgICAgZXJyb3IgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5lcnJvcigpO1xuICAgICAgICAgIHRoaXMuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiAhZXJyb3I7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6ICcnLFxuICAgICAgICAgIGhpbnRUZXh0OiAnJyxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICBpc1JlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5JdGVtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGNsYXNzOiAnd29vZCBpdGVtJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBpZD1cImxlZnQtaWNvbi1jb250YWluZXJcIiBjbGFzcz1cImxlZnQtaWNvblwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS1ib2R5XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByaW1hcnktdGV4dFwiPjwlLXByaW1hcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2Vjb25kYXJ5LXRleHRcIj48JS1zZWNvbmRhcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgIGxlZnRJY29uQ29udGFpbmVyOiAnI2xlZnQtaWNvbi1jb250YWluZXInLFxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGljb246ICdlcnJvcicsXG4gICAgICAgICAgcHJpbWFyeVRleHQ6ICdFcnJvcicsXG4gICAgICAgICAgc2Vjb25kYXJ5VGV4dDogJ1dyb25nIHVzZXJuYW1lIG9yIHBhc3N3b3JkJyxcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdmF0YXIgPSBuZXcgV29vZC5BdmF0YXIoe1xuICAgICAgICAgICAgaWNvbjogJ2V4Y2xhbWF0aW9uJyxcbiAgICAgICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxlZnRJY29uQ29udGFpbmVyLnNob3coYXZhdGFyKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIldvb2QuUmlwcGxlID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICBhdHRyaWJ1dGVzOiB7XG4gICAgY2xhc3M6ICd3b29kIHJpcHBsZS13cmFwcGVyJyxcbiAgfSxcbiAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICcnKSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLiRyaXBwbGVzID0gW107XG4gIH0sXG4gIHB5dGhhZ29yYXM6IGZ1bmN0aW9uKGEsIGIpe1xuICAgIHJldHVybiBNYXRoLnBvdyhNYXRoLnBvdyhhLDIpK01hdGgucG93KGIsMiksMC41KTtcbiAgfSxcbiAgY3JlYXRlUmlwcGxlKGNsYXNzTmFtZSwgeCwgeSl7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdjaXJjbGUgcmlwcGxlICcgKyBjbGFzc05hbWUpO1xuICAgIHZhciBoID0gdGhpcy4kZWwuaGVpZ2h0KCk7XG4gICAgdmFyIHcgPSB0aGlzLiRlbC53aWR0aCgpO1xuICAgIGlmKCB4ID09IHVuZGVmaW5lZCApe1xuICAgICAgeCA9IHcvMjtcbiAgICAgIHkgPSBoLzI7XG4gICAgfVxuICAgIHZhciByID0gdGhpcy5weXRoYWdvcmFzKE1hdGgubWF4KHgsdy14KSwgTWF0aC5tYXgoeSxoLXkpKTtcbiAgICAkcmlwcGxlLmNzcyh7XG4gICAgICAndG9wJzogeSAtIHIsXG4gICAgICAnbGVmdCc6IHggLSByLFxuICAgICAgJ2hlaWdodCc6IDIqcixcbiAgICAgICd3aWR0aCc6IDIqclxuICAgIH0pO1xuICAgIHJldHVybiAkcmlwcGxlO1xuICB9LFxuICBmb2N1c0luOiBmdW5jdGlvbigpe1xuICAgIGlmKCAhdGhpcy4kcHVsc2UgICYmIHRoaXMuJHJpcHBsZXMubGVuZ3RoID09IDApe1xuICAgICAgdmFyICRwdWxzZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwdWxzaW5nJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJHB1bHNlKTtcbiAgICAgIHRoaXMuJHB1bHNlID0gJHB1bHNlO1xuICAgIH1cbiAgfSxcbiAgZm9jdXNPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgaWYoIHRoaXMuJHB1bHNlICl7XG4gICAgICB0aGlzLmZhZGUodGhpcy4kcHVsc2UsIDApO1xuICAgICAgdGhpcy4kcHVsc2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9LFxuICBtb3VzZURvd246IGZ1bmN0aW9uKHgsIHkpe1xuICAgIHZhciAkcmlwcGxlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3Byb3BhZ2F0aW5nJywgeCwgeSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKCRyaXBwbGUpO1xuICAgIHRoaXMuJHJpcHBsZXMucHVzaCgkcmlwcGxlKTtcbiAgfSxcbiAgbW91c2VPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICB0aGlzLmZhZGUoJHJpcHBsZSk7XG4gICAgfVxuICB9LFxuICBjbGljazogZnVuY3Rpb24oKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW91c2VEb3duKCk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYubW91c2VPdXQoKTtcbiAgICB9LCAwKTtcbiAgfSxcbiAgZmFkZTogZnVuY3Rpb24ocmlwcGxlLCBkdXJhdGlvbil7XG4gICAgdmFyIGR1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09ICdudW1iZXInID8gZHVyYXRpb24gOiA1MDA7XG4gICAgcmlwcGxlLmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCl7XG4gICAgICByaXBwbGUucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5UYWJsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3RhYmxlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd0YWJsZSB0YWJsZS1zdHJpcGVkJyxcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHN0eWxlOiAnbWluLXdpZHRoOjEwMCU7bWluLWhlaWdodDoxMDAlOydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dIZWFkZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dGb290ZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRmb290PicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90Zm9vdD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+J1xuICAgICAgICApLFxuICAgICAgICBjb2xsZWN0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbnM6IGZ1bmN0aW9uIChzY2hlbWEpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcblxuICAgICAgICAgICAgLy8gbG9hZCB0aGUgY29sdW1uIGluZm9ybWF0aW9uIGZyb20gdGhlIHNjaGVtYVxuICAgICAgICAgICAgaWYoc2NoZW1hKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2NoZW1hLmNvbHVtbnMsIGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLnZpc2libGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5mby5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmZvLmRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5EZWZzOiBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICAgICAgdmFyIGRlZnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2wucmVuZGVyZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gY29sLnJlbmRlcmVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YU5hbWUgPSBjb2wuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IGNvbC5yZW5kZXJlck9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2lkZ2V0ID0gc2VsZltyZW5kZXJlcl0oZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSwgcmVuZGVyZXJPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHdpZGdldCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YU5hbWUgKyAnXycgKyBtZXRhLnJvdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzW2lkXSA9IHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJyZW5kZXJlci1jb250YWluZXIgd2FpdGluZ1wiPjwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RXhwb3J0RGF0YTogZnVuY3Rpb24gKHJlY29yZCwgZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQuYXR0cmlidXRlc1tmaWVsZF07XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9jb2x1bW5zID0gc2VsZi5nZXRDb2x1bW5zKHNlbGYuY29sbGVjdGlvbi5tb2RlbC5wcm90b3R5cGUuc2NoZW1hKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbHVtbkZpbHRlcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRfY29sdW1ucyA9IF8uZmlsdGVyKGRlZmF1bHRfY29sdW1ucywgb3B0aW9ucy5jb2x1bW5GaWx0ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgY29sbGVjdGlvbiBmb3IgdGhpcyBkYXRhdGFibGVcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzZWxmLnJlbmRlcmVycyA9IHt9O1xuICAgICAgICAgICAgc2VsZi5iYXNlU2VhcmNoID0gb3B0aW9ucy5zZWFyY2ggfHwgJyc7XG5cbiAgICAgICAgICAgIHNlbGYucm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQgfHwgNTk7XG4gICAgICAgICAgICBzZWxmLm1heFZpc2libGVSb3dzID0gb3B0aW9ucy5tYXhWaXNpYmxlUm93cyB8fCAxMDtcbiAgICAgICAgICAgIHNlbGYuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHNlbGYuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucyB8fCBkZWZhdWx0X2NvbHVtbnM7XG4gICAgICAgICAgICBzZWxmLmNvbHVtbkRlZnMgPSBvcHRpb25zLmNvbHVtbkRlZnMgfHwgc2VsZi5nZXRDb2x1bW5EZWZzKHNlbGYuY29sdW1ucyk7XG4gICAgICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSBvcHRpb25zLnNob3dIZWFkZXIgfHwgdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0Zvb3RlciA9IG9wdGlvbnMuc2hvd0Zvb3RlciB8fCBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuZGF0YVRhYmxlT3B0aW9ucyA9IG9wdGlvbnMuZGF0YVRhYmxlT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuXG5cbiAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNpemVIZWlnaHQoKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Sb3dSZW5kZXI6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkKHJvdykuZmluZCgnLnJlbmRlcmVyLWNvbnRhaW5lci53YWl0aW5nJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRob2xkZXIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICRob2xkZXIucmVtb3ZlQ2xhc3MoJ3dhaXRpbmcnKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IHNlbGYucmVuZGVyZXJzWyRob2xkZXIuYXR0cignaWQnKV07XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBqcXVlcnkgb2JqZWN0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlcmVyIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZW5kZXIgYSBiYWNrYm9uZSB2aWV3XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlci4kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZpcnR1YWwgbWV0aG9kXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbG9hZGVyIGZvciB0aGlzIHRhYmxlIHRvIGxvYWQgY29sbGVjdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsWTogJCh3aW5kb3cpLmhlaWdodCgpIC0gMzg1LFxuICAgICAgICAgICAgICAgIHNjcm9sbFg6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmZXJSZW5kZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOiAnPFwidGl0bGVcIj5aVGZydGlTJyxcbiAgICAgICAgICAgICAgICBzY3JvbGxDb2xsYXBzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgY29sdW1uRGVmczogdGhpcy5jb2x1bW5EZWZzLFxuICAgICAgICAgICAgICAgIHJvd0NhbGxiYWNrOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vblJvd1JlbmRlcihyb3csIGRhdGEsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlCdWZmZXI6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdSZWNvcmRzOiAnPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCIgd2lkdGg9XCIxMDAlXCI+PGltZyBjbGFzcz1cInRleHQtbWlkZGxlXCIgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9nZWFycy5naWZcIi8+PC9kaXY+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRhYmxlVG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc1N3ZlBhdGg6ICcvYXNzZXRzL3N3Zi9jb3B5X2Nzdl94bHNfcGRmLnN3ZicsXG4gICAgICAgICAgICAgICAgICAgIGFCdXR0b25zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzRXh0ZW5kczogJ2NzdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvblRleHQ6ICdFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25DbGFzczogJ2J0biBidG4tZGVmYXVsdCBidG4teHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuQ2VsbFJlbmRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb2x1bW4sIGRvbVJvdywgcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSBzZWxmLmNvbGxlY3Rpb24uYXQocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gc2VsZi5jb2x1bW5zW2NvbHVtbl0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RXhwb3J0RGF0YShyZWNvcmQsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdGhpcy4kZWwuRGF0YVRhYmxlKF8uZXh0ZW5kKG9wdGlvbnMsIHNlbGYuZGF0YVRhYmxlT3B0aW9ucykpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5zZWFyY2godGhpcy5iYXNlU2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZSA9IHNlbGYuJGVsLmNsb3Nlc3QoJy5kYXRhVGFibGVzX3dyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLm9uKCdzZWFyY2guZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6c2VhcmNoJywgc2VsZi50YWJsZS5zZWFyY2goKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0YWJsZSA9IHNlbGY7XG4gICAgICAgICAgICAgICAgc2VsZi4kZGF0YVRhYmxlLmZpbmQoJ2Rpdi50aXRsZScpLmFwcGVuZChzZWxmLnRpdGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gdG9vbGJveC5ndWkud2lkZ2V0cy5Mb2FkZXIub3ZlcmxheSh0aGlzLiRlbCk7XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUuYWpheC5yZWxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzVG90YWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEhlaWdodDogZnVuY3Rpb24gKGhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlLmZpbmQoJy5kYXRhVGFibGVzX3Njcm9sbEJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCArIFwicHhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZUhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUpXG4gICAgICAgIH0sXG4gICAgICAgIHVuZmlsdGVyZWRSb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc0Rpc3BsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgc2hvd0hlYWRlcjogdGhpcy5zaG93SGVhZGVyLFxuICAgICAgICAgICAgICAgIHNob3dGb290ZXI6IHRoaXMuc2hvd0Zvb3RlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAzLzExLzE1LlxuICovXG4oZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgV29vZC5Ub29sdGlwID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd3b29kIHRvb2x0aXAtYW5jaG9yLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3b29kLXRvb2x0aXBcIj48JS0gdGV4dCAlPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgJycpLFxuICAgIGRlZmF1bHRzOntcbiAgICAgIHRleHQ6ICcnXG4gICAgfSxcbiAgICBmb2N1c0luOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBmb2N1c091dDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiJdfQ==
