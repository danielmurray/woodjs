(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');

require('./avatar');
require('./button');
require('./card');
require('./dialog');
require('./dropdown');
require('./form');
require('./icon');
require('./item');
require('./list');
require('./spinner');
require('./ripple');
require('./table');
require('./tooltip');
require('./toolbar');
require('./tree');

},{"./avatar":2,"./button":3,"./card":4,"./dialog":5,"./dropdown":6,"./form":7,"./icon":8,"./inputs/all":9,"./item":11,"./list":12,"./ripple":13,"./spinner":14,"./table":15,"./toolbar":16,"./tooltip":17,"./tree":18}],2:[function(require,module,exports){
/**
 * Created by danmurray on 2/17/16.
 */
(function (Wood) {
    Wood.Avatar = Marionette.ItemView.extend({
      tagName: "wood-avatar",
        template: _.template(
          '<div class="shape <%-shape%> color-<%-color%> backgroundColor-<%-backgroundColor%>">' +
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
        defaults: {
          image: null,
          icon: null,
          letter: null,
          shape: null,
          color: 'inherit',
          backgroundColor: 'inherit'
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);
        },
        onRender: function(){
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {
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
        iconClass: 'fa',
        text: 'Button',
        color: 'inherit'
      },
      initialize: function(options){
        this.options = _.extend({}, this.defaults, options);
      },
      onRender: function(){
        if ( this.options.icon ){
          var iconView = new Wood.Icon({
            icon: this.options.icon,
            iconClass: this.options.iconClass,
            color: this.options.color
          });
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
          '<div id="ripple-container" class="ripple-container backgroundColor-<%-backgroundColor%>"></div>' +
          '<div id="label-container" class="label-wrapper color-<%-color%>"><%-label%></div>' +
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
        mouseOut: function(e){
          var target = $(e.toElement);
          if( target.closest(this.$el).length ==0 ){
            var ripple = this.rippleContainer.currentView;
            ripple.mouseOut();
          }
        },
        click: function(e){
          e.preventDefault();
          var ripple = this.rippleContainer.currentView;
          ripple.click();
          this.triggerMethod("action:click:button");
        },
        defaults:{
          iconClass: 'fa',
          label: 'Button',
          color: 'white',
          backgroundColor: 'secondary',
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
            icon: this.options.icon,
            iconClass: this.options.iconClass,
            color: this.options.color,
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

    Wood.DropdownButton = Button.extend({
      attributes: {
        class: 'wood button dropdown',
      },
      template: _.template(
        '<div id="ripple-container" class="ripple-container backgroundColor-<%-backgroundColor%>"></div>' +
        '<div id="label-container" class="label-wrapper color-<%-color%>"><%-label%></div>' +
        '<div id="caret-container" class="caret-wrapper color-<%-color%>"></div>' +
      ''),
      toggle: function(){
        this.expanded = !this.expanded;
        this.renderCaret(this.expanded);
      },
      focusIn : function(e){},
      focusOut : function(e){},
      mouseDown: function(e){
        if( this.expanded ){
          var ripple = this.rippleContainer.currentView;
          ripple.mouseOut();
          this.triggerMethod('action:dropdown:collapse');
        }else{
          Button.prototype.mouseDown.call(this, e);
          this.triggerMethod('action:dropdown:expand');
        }
        this.toggle();
      },
      mouseOut: function(e){},
      click: function(e){},
      initialize: function(options){
        Button.prototype.initialize.call(this, options);
        this.expanded = false;
      },
      onRender: function(){
        Button.prototype.onRender.call(this);
        this.addRegion("caretContainer", "#caret-container");
        this.renderCaret(this.expanded);
      },
      renderCaret: function(expanded){
        var icon = expanded ? 'angle-up' : 'angle-down';
        var caret = new Wood.Icon({
          icon: icon,
          color: this.options.color
        });
        this.caretContainer.show(caret);
      }
    });
})(window.Wood);

},{}],4:[function(require,module,exports){
/**
 * Created by danmurray on 2/17/16.
 */
(function(Wood) {
  Wood.Card = Marionette.LayoutView.extend({
    tagName: "wood-card",
    template: _.template(
      '<div class="card-header">' +
      '<div id="avatar-wrapper" class="avatar-wrapper"></div>' +
      '<div class="title"><%-primaryText%></div>' +
      '</div>' +
      '<div id="card-content" class="card-content"></div>' +
      '<div id="card-footer" class="card-footer"></div>' +
      ''),
    regions: {
      cardHeader: "#card-header",
      avatar: "#avatar-wrapper",
      cardContent: "#card-content",
      cardFooter: "#card-footer",
    },
    events: {},
    defaults: {
      primaryText: 'Card',
      headerView: null,
      headerOptions: {
        icon: 'question',
        shape: 'circle'
      },
      contentView: null,
      contentOptions: {},
      footerView: null,
      footerOptions: {}
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onRender: function() {
      var avatar = new Wood.Avatar(this.options.headerOptions);
      this.avatar.show(avatar);

      if (this.options.contentView) {
        var content = new this.options.contentView(
          this.options.contentOptions
        );
        this.cardContent.show(content);
      }

    },
    templateHelpers: function() {
      return _.extend({}, this.options, {

      });
    }
  });
})(window.Wood);

},{}],5:[function(require,module,exports){
/**
 * Created by danmurray on 14/12/15.
 * TODO remove bootstrap dependency
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
          this.options.onSubmit(data);
        }else {
          this.triggerMethod('action:submit:form', data);
        }
        this.close();
      },
      onRender: function () {
        var form = new Wood.Form(this.options.formOptions);
        this.dialogContentContainer.show(form);
      },
    });
})(window.keys);

},{}],6:[function(require,module,exports){
/**
 * Created by danmurray on 4/6/16.
 */
(function(Wood) {
  Wood.Dropdown = Marionette.LayoutView.extend({
    tagName: 'wood-dropdown',
    template: _.template(
      '<div id="button-container" class="button-container"></div>' +
      '<div class="dropdown-anchor">' +
        '<div id="dropdown-container" class="dropdown-container <%-floatRightClass%>"></div>' +
      '</div>' +
    ''),
    regions: {
      buttonContainer   : '#button-container',
      dropdownContainer : '#dropdown-container'
    },
    childEvents: {
      'action:dropdown:expand' : 'onDropdownExpand',
      'action:dropdown:collapse' : 'onDropdownCollapse',
      // 'action:button:click'     : 'forkSession',
      // 'action:menubutton:click' : 'onMenuButtonClick',
      // 'action:menuitem:click'   : 'onMenuItemClick',
    },
    onDropdownCollapse: function(){
      this.$('.dropdown-container').removeClass('expanded');
    },
    onDropdownExpand: function(){
      var self = this;
      event.stopPropagation();
      this.$('.dropdown-container').addClass('expanded');

      $('body').bind('mousedown', function(e){
        var target = $(e.target);
        var outDropdown = self.$('#dropdown-container').find(target).length == 0;
        if( outDropdown ) {
          var outButton = self.$('#button-container').find(target).length == 0;
          if( outButton ) {
            self.buttonContainer.currentView.mouseDown(e)
          }
          self.onDropdownCollapse();
          $( this ).unbind(e);
        }
      });
    },
    defaults: {
      floatRight: false,
    },
    initialize: function (options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onBeforeDestroy: function(){
      $('body').unbind('click');
    },
    onRender: function () {
      var button = new Wood.DropdownButton(
        this.options.buttonOptions
      );
      this.buttonContainer.show(button);

      if( this.options.contentView ){
        var contentView = new this.options.contentView(
          this.options.contentOptions
        );
        this.dropdownContainer.show(contentView);
      }
    },
    templateHelpers: function(){
      return _.extend({}, this.options, {
        floatRightClass: this.options.floatRight ? 'floatRight' : ''
      });
    }
  });
})(window.Wood);

},{}],7:[function(require,module,exports){
(function (Wood) {
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
      var defaultValue = this.model ? this.model.get(id) : options.defaultValue;

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
})(window.Wood);

},{}],8:[function(require,module,exports){
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

        if( this.options.tooltip ){
          var text = this.options.disabled ? 'Disabled' : this.options.tooltip;
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
        }
      },
      events:{
        "submit": "onFormSubmit",
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
          this.options.boxIconOptions
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

},{}],9:[function(require,module,exports){
Wood.inputs = {};

require('./text.js');

},{"./text.js":10}],10:[function(require,module,exports){
(function (Wood) {
    Wood.Input = Marionette.LayoutView.extend({
        attributes: {
          class: 'wood input',
        },
        template: _.template(
          '<div class="label-placeholder"></div>' +
          '<div class="label-text"><%-floatingLabelText%></div>' +
          '<div class="hint-text"><%-hintText%></div>' +
          '<input type="<%-type%>" value="<%-value%>" <%-attributeString%>></input>' +
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
          attributes : [],
          defaultValue: '',
          floatingLabelText: '',
          hintText: '',
          isRequired: false,
          type: 'text'
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
          var attributeString = $.map(this.options.inputAttributes,
            function( value, key) {
              return key + '=' + value
            }).join(' ')
          return _.extend({}, this.options, {
            value: this.value || this.options.defaultValue,
            attributeString: attributeString
          });
        }
    });
})(window.Wood);

},{}],11:[function(require,module,exports){
(function(Wood) {
  Wood.Item = Marionette.LayoutView.extend({
    tagName: 'wood-item',
    template: _.template(
      '<div class="item-wrapper">' +
        '<% if (leftIcon) { %>' +
          '<div id="left-icon-container" class="left-icon"></div>' +
        '<%}%>' +
          '<div class="item-body">' +
            '<div class="primary-text"><%=primaryText%></div>' +
            '<div class="secondary-text"><%-secondaryText%></div>' +
          '</div>' +
          '<% if (rightIcon) { %>' +
            '<div id="right-icon-container" class="right-icon"></div>' +
          '<%}%>' +
        '</div>' +
      ''),
    regions: {
      leftIconContainer: '#left-icon-container',
      rightIconContainer: '#right-icon-container',
    },
    defaults: {
      leftIcon: false,
      leftIconView: Wood.Avatar,
      leftIconOptions: {},
      primaryText: null,
      secondaryText: null,
      rightIcon: false,
      rightIconView: null,
      rightIconOptions: {}
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onRender: function() {
      if (this.options.leftIcon) {
        var leftIcon = new this.options.leftIconView(
          this.options.leftIconOptions
        );
        this.leftIconContainer.show(leftIcon);
      }

      if (this.options.rightIcon) {
        var rightIcon = new this.options.rightIconView(
          this.options.rightIconOptions
        );
        this.rightIconContainer.show(rightIcon);
      }
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {
        value: this.value
      });
    }
  });

  Wood.ItemButton = Wood.Item.extend({
    attributes:{
      class: 'button'
    },
    events:{
      'click': 'click'
    },
    defaults: _.extend({}, Wood.Item.prototype.defaults, {
      clickEvent: 'action:click:item',
      clickEventArg: null
    }),
    click: function(e){
      this.triggerMethod(this.options.clickEvent, this.options.clickEventArg);
    },
  });
})(window.Wood);

},{}],12:[function(require,module,exports){
(function (Wood) {
  Wood.Divider = Marionette.ItemView.extend({
    tagName: 'wood-divider',
    template: _.template(''),
  });

  Wood.List = Marionette.CollectionView.extend({
    tagName: 'wood-list',
    childEvents: {
    },
    childView: Wood.Item,
    buildChildView: function(child, ChildViewClass, childViewOptions){
      var view = child.get('itemView') || ChildViewClass;
      var options = child.get('itemOptions');

      // build the final list of options for the childView class
      var options = _.extend({}, childViewOptions, options, {
      });

      // create the child view instance
      var view = new view(options);

      // return it
      return view;
    },
    initialize: function(options){
      this.options = _.extend({}, this.defaults, options);
      this.collection = new Backbone.Collection(this.options.items);
    }
  });
})(window.Wood);

},{}],13:[function(require,module,exports){
(function(Wood) {
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
})(window.Wood);

},{}],14:[function(require,module,exports){
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
      overlay: function ($el, options) {
        var widget = new Wood.Spinner(options);
        widget.render();
        $overlay = widget.$el;
        $overlay.addClass('overlay');

        $el.append($overlay);
        return $overlay;
      }
    });

    Wood.SpinnerOverlay = Marionette.LayoutView.extend({
        tagName: 'wood-spinner-overlay',
        template: _.template(
          '<div class="overlay backgroundColor-<%-backgroundColor%>">' +
            '<div id="spinner-container"></div>' +
          '</div>' +
        ''),
        defaults: {
          backgroundColor: 'transparent'
        },
        events: {
          'click': 'preventDefault'
        },
        regions: {
          spinnerContainer: '#spinner-container'
        },
        initialize: function (options) {
          this.options = _.extend({}, this.defaults, this.options);
        },
        onRender: function(){
          var spinner = new Wood.Spinner();
          this.spinnerContainer.show(spinner)
        },
        preventDefault: function(e){
          e.preventDefault();
        },
        templateHelpers: function () {
          return _.extend({}, this.options, {
          });
        }
    }, {
      show: function ($el, options) {
        var overlay = new Wood.SpinnerOverlay(options);
        overlay.render();

        $el.append(overlay.$el);
        return overlay.$el;
      }
    });

    // TODO
    // Wood.InlineLoader = Marionette.ItemView.extend({
    //     tagName: 'img',
    //     attributes: {
    //         src: '/assets/images/loaders/bar.gif',
    //         style: 'position:absolute;margin:auto;top:0;bottom:0;'
    //     },
    //     template: _.template('')
    // });
})(window.Wood);

},{}],15:[function(require,module,exports){
/**
 * Created by danmurray on 14/12/15.
 * TODO remove datatables dependency
 */
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

},{}],16:[function(require,module,exports){
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
        title: 'Toolbar',
        color: 'black',
        backgroundColor: 'grey-light',
      },
      initialize: function () {
        this.options = _.extend({}, this.defaults, this.options);
      },
      templateHelpers: function(){
        return _.extend({}, this.options, {
        });
      },
      getIcon: function(iconId){
        var a = this.leftIconsContainer.currentView.getView(iconId);
        var b = this.rightIconsContainer.currentView.getView(iconId);
        return a || b;
      },
      onRender: function () {
        this.$el.addClass('color-'+this.options.color);
        this.$el.addClass('backgroundColor-'+this.options.backgroundColor);

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

},{}],17:[function(require,module,exports){
/**
 * Created by danmurray on 3/11/15.
 */
(function (Wood) {
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
})(window.Wood);

},{}],18:[function(require,module,exports){
/**
 * Created by danmurray on 4/5/16.
 */
(function(Wood) {
  Wood.Branch = Marionette.LayoutView.extend({
    tagName: "wood-branch",
    template: _.template(
      '<div id="tree-container"></div>' +
    ''),
    childEvents:{
    },
    regions: {
      treeContainer: "#tree-container",
    },
    defaults: {
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
      this.tree = this.options.tree
    },
    getTree: function(){
      return this.tree.getTree(this.options);
    },
    bubbleChildEvent: function(childEventName){
      this.childEvents[childEventName] = function(child, args){
        this.triggerMethod(childEventName, args)
      }
    },
    onRender: function() {
      var tree = this.getTree();
      this.treeContainer.show(tree);

      for( childEventName in tree.childEvents ){
        this.bubbleChildEvent(childEventName)
      }
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {
      });
    }
  });

  Wood.Branches = Marionette.CollectionView.extend({
    tagName: "wood-branches",
    childView: Wood.Branch,
    buildChildView: function(child, ChildViewClass, childViewOptions){
      // build the final list of options for the childView class
      var options = _.extend({}, childViewOptions, child.attributes, {
        tree: this.tree
      });

      // create the child view instance
      var view = new ChildViewClass(options);

      // return it
      return view;
    },
    events: {},
    defaults: {
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
      this.tree = this.options.tree;
    },
    onRender: function() {
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {
      });
    },
    filter: function(child, index, collection){
      return this.tree.filter(child, index, collection)
    }
  });

  Wood.Tree = Marionette.LayoutView.extend({
    tagName: "wood-tree",
    template: _.template(
      '<div class="tree-wrapper">' +
        '<div class="twig"></div>' +
        '<div id="item-container" class="item-container"></div>' +
      '</div>' +
      '<div id="children-container" class="children-container"></div>' +
    ''),
    regions: {
      itemContainer: "#item-container",
      childrenContainer: "#children-container",
    },
    events: {},
    defaults: {
      itemView: Wood.Item,
      itemOptions: {},
      children: []
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    filter: function(child, index, collection){
      return true;
    },
    getCollection: function(){
      return new Backbone.Collection(this.options.children);
    },
    getItem: function(){
      return new this.options.itemView(this.options.itemOptions);
    },
    getTree: function(options){
      return new Wood.Tree(options);
    },
    onRender: function() {
      var item = this.getItem();
      this.itemContainer.show(item);

      this.collection = this.getCollection();
      if( this.collection.length > 0 ){
        var branches = new Wood.Branches({
          tree: this,
          collection : this.collection
        });
        this.childrenContainer.show(branches);
      }
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {
      });
    }
  });

  Wood.Arborist = Wood.Tree.extend({
    filter: function(child, index, collection){
      var model = this.options.collection.get(this.options.root);
      return child.get('parent') == model.get('id');
    },
    getCollection: function(){
      return this.options.collection;
    },
    getItem: function(){
      var model = this.options.collection.get(this.options.root)
      return new Wood.Item({
        primaryText: model.get('id'),
      })
    },
    getTree: function(options){
      return new Wood.Arborist({
        root: options.id,
        collection: this.collection
      });
    },
  });


})(window.Wood);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvY2FyZC5qcyIsInNyYy9qcy9kaWFsb2cuanMiLCJzcmMvanMvZHJvcGRvd24uanMiLCJzcmMvanMvZm9ybS5qcyIsInNyYy9qcy9pY29uLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiLCJzcmMvanMvaXRlbS5qcyIsInNyYy9qcy9saXN0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy9zcGlubmVyLmpzIiwic3JjL2pzL3RhYmxlLmpzIiwic3JjL2pzL3Rvb2xiYXIuanMiLCJzcmMvanMvdG9vbHRpcC5qcyIsInNyYy9qcy90cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93Lldvb2QgPSB7fTtcblxuLy8gaW5jbHVkZSBiYXNlIGNvbW1vbiB3aWRnZXRzXG5yZXF1aXJlKCcuL2lucHV0cy9hbGwnKTtcblxucmVxdWlyZSgnLi9hdmF0YXInKTtcbnJlcXVpcmUoJy4vYnV0dG9uJyk7XG5yZXF1aXJlKCcuL2NhcmQnKTtcbnJlcXVpcmUoJy4vZGlhbG9nJyk7XG5yZXF1aXJlKCcuL2Ryb3Bkb3duJyk7XG5yZXF1aXJlKCcuL2Zvcm0nKTtcbnJlcXVpcmUoJy4vaWNvbicpO1xucmVxdWlyZSgnLi9pdGVtJyk7XG5yZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vc3Bpbm5lcicpO1xucmVxdWlyZSgnLi9yaXBwbGUnKTtcbnJlcXVpcmUoJy4vdGFibGUnKTtcbnJlcXVpcmUoJy4vdG9vbHRpcCcpO1xucmVxdWlyZSgnLi90b29sYmFyJyk7XG5yZXF1aXJlKCcuL3RyZWUnKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BdmF0YXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiBcIndvb2QtYXZhdGFyXCIsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2hhcGUgPCUtc2hhcGUlPiBjb2xvci08JS1jb2xvciU+IGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPicgK1xuICAgICAgICAgICAgJzwlIGlmIChpbWFnZSkgeyAlPicgK1xuICAgICAgICAgICAgICAnPGltZyBjbGFzcz1cImltZ1wiIHNyYz1cIjwlLWltYWdlJT5cIj48L2ltZz4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihpY29uKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiaWNvbiBmYSBmYS1pY29uIGZhLTwlLWljb24lPlwiPjwvaT4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihsZXR0ZXIpIHslPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj48JS1sZXR0ZXIlPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8JX0lPicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbWFnZTogbnVsbCxcbiAgICAgICAgICBpY29uOiBudWxsLFxuICAgICAgICAgIGxldHRlcjogbnVsbCxcbiAgICAgICAgICBzaGFwZTogbnVsbCxcbiAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2luaGVyaXQnXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICB2YXIgTGFiZWwgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWxhYmVsJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJpY29uLWNvbnRhaW5lclwiIGNsYXNzPVwiaWNvbi13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInRleHQtd3JhcHBlclwiPjwlLXRleHQlPjwvc3Bhbj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgaWNvbkNvbnRhaW5lcjogJyNpY29uLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIGljb25DbGFzczogJ2ZhJyxcbiAgICAgICAgdGV4dDogJ0J1dHRvbicsXG4gICAgICAgIGNvbG9yOiAnaW5oZXJpdCdcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5pY29uICl7XG4gICAgICAgICAgdmFyIGljb25WaWV3ID0gbmV3IFdvb2QuSWNvbih7XG4gICAgICAgICAgICBpY29uOiB0aGlzLm9wdGlvbnMuaWNvbixcbiAgICAgICAgICAgIGljb25DbGFzczogdGhpcy5vcHRpb25zLmljb25DbGFzcyxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmljb25Db250YWluZXIuc2hvdyhpY29uVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHZhciBCdXR0b24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCIgY2xhc3M9XCJyaXBwbGUtY29udGFpbmVyIGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwibGFiZWwtY29udGFpbmVyXCIgY2xhc3M9XCJsYWJlbC13cmFwcGVyIGNvbG9yLTwlLWNvbG9yJT5cIj48JS1sYWJlbCU+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczp7XG4gICAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICAgIGxhYmVsQ29udGFpbmVyOiAnI2xhYmVsLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0JzogJ2ZvY3VzT3V0JyxcbiAgICAgICAgICAnbW91c2Vkb3duJzonbW91c2VEb3duJyxcbiAgICAgICAgICAnbW91c2VvdXQnOiAnbW91c2VPdXQnLFxuICAgICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuZm9jdXNJbigpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuZm9jdXNPdXQoKVxuICAgICAgICB9LFxuICAgICAgICBtb3VzZURvd246IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciB4ID0gZS5wYWdlWCAtIHRoaXMuJGVsLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgICAgdmFyIHkgPSBlLnBhZ2VZIC0gdGhpcy4kZWwub2Zmc2V0KCkudG9wO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VEb3duKHgsIHkpO1xuICAgICAgICB9LFxuICAgICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50b0VsZW1lbnQpO1xuICAgICAgICAgIGlmKCB0YXJnZXQuY2xvc2VzdCh0aGlzLiRlbCkubGVuZ3RoID09MCApe1xuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgaWNvbkNsYXNzOiAnZmEnLFxuICAgICAgICAgIGxhYmVsOiAnQnV0dG9uJyxcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdzZWNvbmRhcnknLFxuICAgICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiggZGlzYWJsZWQgKXtcbiAgICAgICAgICBpZiggIXRoaXMuX3NhdmluZyApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCBkaXNhYmxlZCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIGljb246IHRoaXMub3B0aW9ucy5pY29uLFxuICAgICAgICAgICAgaWNvbkNsYXNzOiB0aGlzLm9wdGlvbnMuaWNvbkNsYXNzLFxuICAgICAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5jb2xvcixcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpc2FibGUodHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICB2aWV3OiBXb29kLlNwaW5uZXIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IDEyLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiA2LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShmYWxzZSk7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKGZhbHNlKTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMuc3RhdGVDaGFuZ2UoJ3NhdmluZycpO1xuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnNhdmVCdXR0b25DbGljaycpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICAgIC8vIGlmKCB0aGlzLnN0YXRlICE9IHN0YXRlKXtcbiAgICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZsYXRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBmbGF0JyxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuUmFpc2VkQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gcmFpc2VkJyxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRHJvcGRvd25CdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBkcm9wZG93bicsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lciBiYWNrZ3JvdW5kQ29sb3ItPCUtYmFja2dyb3VuZENvbG9yJT5cIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJsYWJlbC1jb250YWluZXJcIiBjbGFzcz1cImxhYmVsLXdyYXBwZXIgY29sb3ItPCUtY29sb3IlPlwiPjwlLWxhYmVsJT48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJjYXJldC1jb250YWluZXJcIiBjbGFzcz1cImNhcmV0LXdyYXBwZXIgY29sb3ItPCUtY29sb3IlPlwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FyZXQodGhpcy5leHBhbmRlZCk7XG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBtb3VzZURvd246IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy5leHBhbmRlZCApe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VPdXQoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpkcm9wZG93bjpjb2xsYXBzZScpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBCdXR0b24ucHJvdG90eXBlLm1vdXNlRG93bi5jYWxsKHRoaXMsIGUpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmRyb3Bkb3duOmV4cGFuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICB9LFxuICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBjbGljazogZnVuY3Rpb24oZSl7fSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICBCdXR0b24ucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICBCdXR0b24ucHJvdG90eXBlLm9uUmVuZGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuYWRkUmVnaW9uKFwiY2FyZXRDb250YWluZXJcIiwgXCIjY2FyZXQtY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLnJlbmRlckNhcmV0KHRoaXMuZXhwYW5kZWQpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlckNhcmV0OiBmdW5jdGlvbihleHBhbmRlZCl7XG4gICAgICAgIHZhciBpY29uID0gZXhwYW5kZWQgPyAnYW5nbGUtdXAnIDogJ2FuZ2xlLWRvd24nO1xuICAgICAgICB2YXIgY2FyZXQgPSBuZXcgV29vZC5JY29uKHtcbiAgICAgICAgICBpY29uOiBpY29uLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuY29sb3JcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FyZXRDb250YWluZXIuc2hvdyhjYXJldCk7XG4gICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuQ2FyZCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC1jYXJkXCIsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBpZD1cImF2YXRhci13cmFwcGVyXCIgY2xhc3M9XCJhdmF0YXItd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwlLXByaW1hcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2FyZC1jb250ZW50XCIgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2FyZC1mb290ZXJcIiBjbGFzcz1cImNhcmQtZm9vdGVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgY2FyZEhlYWRlcjogXCIjY2FyZC1oZWFkZXJcIixcbiAgICAgIGF2YXRhcjogXCIjYXZhdGFyLXdyYXBwZXJcIixcbiAgICAgIGNhcmRDb250ZW50OiBcIiNjYXJkLWNvbnRlbnRcIixcbiAgICAgIGNhcmRGb290ZXI6IFwiI2NhcmQtZm9vdGVyXCIsXG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBwcmltYXJ5VGV4dDogJ0NhcmQnLFxuICAgICAgaGVhZGVyVmlldzogbnVsbCxcbiAgICAgIGhlYWRlck9wdGlvbnM6IHtcbiAgICAgICAgaWNvbjogJ3F1ZXN0aW9uJyxcbiAgICAgICAgc2hhcGU6ICdjaXJjbGUnXG4gICAgICB9LFxuICAgICAgY29udGVudFZpZXc6IG51bGwsXG4gICAgICBjb250ZW50T3B0aW9uczoge30sXG4gICAgICBmb290ZXJWaWV3OiBudWxsLFxuICAgICAgZm9vdGVyT3B0aW9uczoge31cbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF2YXRhciA9IG5ldyBXb29kLkF2YXRhcih0aGlzLm9wdGlvbnMuaGVhZGVyT3B0aW9ucyk7XG4gICAgICB0aGlzLmF2YXRhci5zaG93KGF2YXRhcik7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGVudFZpZXcpIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBuZXcgdGhpcy5vcHRpb25zLmNvbnRlbnRWaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb250ZW50T3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmNhcmRDb250ZW50LnNob3coY29udGVudCk7XG4gICAgICB9XG5cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAxNC8xMi8xNS5cbiAqIFRPRE8gcmVtb3ZlIGJvb3RzdHJhcCBkZXBlbmRlbmN5XG4gKi9cbihmdW5jdGlvbiAoa2V5cykge1xuICAgIFdvb2QuRGlhbG9nID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWRpYWxvZycsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwiZGlhbG9nLWNvbnRlbnQtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgICAgZGlhbG9nQ29udGVudENvbnRhaW5lcjogJyNkaWFsb2ctY29udGVudC1jb250YWluZXInLFxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgdGl0bGU6ICdEaWFsb2cnXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICAgIHRoaXMuZGlhbG9nID0gbmV3IEJvb3RzdHJhcERpYWxvZyh7XG4gICAgICAgICAgICAgIHR5cGU6IEJvb3RzdHJhcERpYWxvZy5UWVBFX1BSSU1BUlksXG4gICAgICAgICAgICAgIHNpemU6IEJvb3RzdHJhcERpYWxvZy5TSVpFX05PUk1BTCxcbiAgICAgICAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyB2YXIgZGlhbG9nQ29udGVudCA9IHRoaXMub3B0aW9ucy5kaWFsb2dDb250ZW50O1xuICAgICAgICAgIC8vIGlmKCBkaWFsb2dDb250ZW50ICl7fVxuICAgICAgICAgIC8vICAgdGhpcy5kaWFsb2dDb250ZW50Q29udGFpbmVyLnNob3cobmV3IGRpYWxvZ0NvbnRlbnQudmlldyhkaWFsb2dDb250ZW50Lm9wdGlvbnMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLnNldFRpdGxlKHRoaXMub3B0aW9ucy50aXRsZSk7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRNZXNzYWdlKHRoaXMuJGVsKVxuICAgICAgICAgICAgdGhpcy5kaWFsb2cub3BlbigpO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIGlmKHRoaXMub25DbG9zZSlcbiAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlKClcbiAgICAgICAgfSxcbiAgICB9LCB7XG4gICAgICBzaG93OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IHRoaXMob3B0aW9ucyk7XG4gICAgICAgIHdpZGdldC5yZW5kZXIoKTtcbiAgICAgICAgd2lkZ2V0Lm9wZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRm9ybURpYWxvZyA9IFdvb2QuRGlhbG9nLmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1mb3JtLWRpYWxvZycsXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIHRpdGxlOiAnRGlhbG9nJyxcbiAgICAgICAgZm9ybU9wdGlvbnM6IHt9XG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6e1xuICAgICAgICBcImFjdGlvbjpzdWJtaXQ6Zm9ybVwiOiBcInN1Ym1pdFwiXG4gICAgICB9LFxuICAgICAgc3VibWl0OiBmdW5jdGlvbihmb3JtVmlldywgZGF0YSl7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMub25TdWJtaXQgKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25TdWJtaXQoZGF0YSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IG5ldyBXb29kLkZvcm0odGhpcy5vcHRpb25zLmZvcm1PcHRpb25zKTtcbiAgICAgICAgdGhpcy5kaWFsb2dDb250ZW50Q29udGFpbmVyLnNob3coZm9ybSk7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93LmtleXMpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiA0LzYvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuRHJvcGRvd24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1kcm9wZG93bicsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBpZD1cImJ1dHRvbi1jb250YWluZXJcIiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZHJvcGRvd24tYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiZHJvcGRvd24tY29udGFpbmVyXCIgY2xhc3M9XCJkcm9wZG93bi1jb250YWluZXIgPCUtZmxvYXRSaWdodENsYXNzJT5cIj48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgYnV0dG9uQ29udGFpbmVyICAgOiAnI2J1dHRvbi1jb250YWluZXInLFxuICAgICAgZHJvcGRvd25Db250YWluZXIgOiAnI2Ryb3Bkb3duLWNvbnRhaW5lcidcbiAgICB9LFxuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmV4cGFuZCcgOiAnb25Ecm9wZG93bkV4cGFuZCcsXG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmNvbGxhcHNlJyA6ICdvbkRyb3Bkb3duQ29sbGFwc2UnLFxuICAgICAgLy8gJ2FjdGlvbjpidXR0b246Y2xpY2snICAgICA6ICdmb3JrU2Vzc2lvbicsXG4gICAgICAvLyAnYWN0aW9uOm1lbnVidXR0b246Y2xpY2snIDogJ29uTWVudUJ1dHRvbkNsaWNrJyxcbiAgICAgIC8vICdhY3Rpb246bWVudWl0ZW06Y2xpY2snICAgOiAnb25NZW51SXRlbUNsaWNrJyxcbiAgICB9LFxuICAgIG9uRHJvcGRvd25Db2xsYXBzZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJCgnLmRyb3Bkb3duLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgIH0sXG4gICAgb25Ecm9wZG93bkV4cGFuZDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy4kKCcuZHJvcGRvd24tY29udGFpbmVyJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cbiAgICAgICQoJ2JvZHknKS5iaW5kKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgICB2YXIgb3V0RHJvcGRvd24gPSBzZWxmLiQoJyNkcm9wZG93bi1jb250YWluZXInKS5maW5kKHRhcmdldCkubGVuZ3RoID09IDA7XG4gICAgICAgIGlmKCBvdXREcm9wZG93biApIHtcbiAgICAgICAgICB2YXIgb3V0QnV0dG9uID0gc2VsZi4kKCcjYnV0dG9uLWNvbnRhaW5lcicpLmZpbmQodGFyZ2V0KS5sZW5ndGggPT0gMDtcbiAgICAgICAgICBpZiggb3V0QnV0dG9uICkge1xuICAgICAgICAgICAgc2VsZi5idXR0b25Db250YWluZXIuY3VycmVudFZpZXcubW91c2VEb3duKGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYub25Ecm9wZG93bkNvbGxhcHNlKCk7XG4gICAgICAgICAgJCggdGhpcyApLnVuYmluZChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgZmxvYXRSaWdodDogZmFsc2UsXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvbkJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAkKCdib2R5JykudW5iaW5kKCdjbGljaycpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBidXR0b24gPSBuZXcgV29vZC5Ecm9wZG93bkJ1dHRvbihcbiAgICAgICAgdGhpcy5vcHRpb25zLmJ1dHRvbk9wdGlvbnNcbiAgICAgICk7XG4gICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5zaG93KGJ1dHRvbik7XG5cbiAgICAgIGlmKCB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcgKXtcbiAgICAgICAgdmFyIGNvbnRlbnRWaWV3ID0gbmV3IHRoaXMub3B0aW9ucy5jb250ZW50VmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29udGVudE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcm9wZG93bkNvbnRhaW5lci5zaG93KGNvbnRlbnRWaWV3KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIGZsb2F0UmlnaHRDbGFzczogdGhpcy5vcHRpb25zLmZsb2F0UmlnaHQgPyAnZmxvYXRSaWdodCcgOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLklucHV0TGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBjaGlsZEV2ZW50czoge1xuICAgICAgXCJhY3Rpb246aW5wdXQ6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgIH0sXG4gICAgb25JbnB1dENoYW5nZTogZnVuY3Rpb24oaW5wdXRWaWV3LCB2YWxpZCl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dHM6Y2hhbmdlJywgIXRoaXMuZXJyb3IoKSk7XG4gICAgfSxcbiAgICBjaGlsZFZpZXc6IFdvb2QuSW5wdXQsXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgaWQgPSBjaGlsZC5nZXQoJ2lkJyk7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5nZXQoaWQpIDogb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGRhdGFbY2hpbGRWaWV3LmlkXSA9IGNoaWxkVmlldy5nZXRWYWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgY2hpbGRWaWV3LmVycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWxpZCA9IHRydWU7XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgdmFyIGNoaWxkVmFsaWQgPSBjaGlsZFZpZXcudmFsaWRhdGUoKTtcbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiBjaGlsZFZhbGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5Gb3JtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnZm9ybScsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGZvcm0nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImlucHV0LWxpc3QtY29udGFpbmVyXCIgY2xhc3M9XCJpbnB1dC1saXN0XCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuc1wiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwic3VibWl0LWJ0blwiIGNsYXNzPVwic3VibWl0LWJ0blwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOiB7XG4gICAgICAgIGlucHV0TGlzdENvbnRhaW5lcjogJyNpbnB1dC1saXN0LWNvbnRhaW5lcicsXG4gICAgICAgIHN1Ym1pdEJ0bkNvbnRhaW5lcjogJyNzdWJtaXQtYnRuJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCI6IFwic3VibWl0Rm9ybVwiLFxuICAgICAgICBcImFjdGlvbjppbnB1dHM6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgICAgfSxcbiAgICAgIG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGlucHV0TGlzdFZpZXcsIHZhbGlkKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24uZGlzYWJsZSghdmFsaWQpO1xuICAgICAgfSxcbiAgICAgIG9uRm9ybVN1Ym1pdDogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zdWJtaXRGb3JtKCk7XG4gICAgICB9LFxuICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmdldERhdGEoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmVycm9yKCk7XG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy52YWxpZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy52YWxpZGF0ZSgpICl7XG4gICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIGlucHV0czogW10sXG4gICAgICAgIHN1Ym1pdEJ1dHRvbjoge1xuICAgICAgICAgIGxhYmVsOiAnU3VibWl0J1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaW5wdXRMaXN0ID0gbmV3IFdvb2QuSW5wdXRMaXN0KHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5vcHRpb25zLm1vZGVsLFxuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pbnB1dHMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5zaG93KGlucHV0TGlzdCk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24ubGFiZWwsXG4gICAgICAgICAgICBkaXNhYmxlZDogISF0aGlzLmVycm9yKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICB9LFxuICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vblBvc3QoKTtcbiAgICAgIH0sXG4gICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uU3VjY2VzcygpO1xuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uRXJyb3IoKTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMjYvMTUuXG4gKi9cbiAoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkljb24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnZmEnOiAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLTwlLWljb24lPiBjb2xvci08JS1jb2xvciU+XCI+PC9pPicsXG4gICAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBjb2xvci08JS1jb2xvciU+XCI+PCUtaWNvbiU+PC9pPidcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6aWNvbicsXG4gICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgICAgaWNvbjogJ2NpcmNsZS10aGluJyxcbiAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgdG9vbHRpcDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWljb24nLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgaWNvblRlbXBsYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0aGlzLmljb25UZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmljb25DbGFzc10pKG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbihzZXRPYmope1xuICAgICAgICAgIF8uZXh0ZW5kKHRoaXMub3B0aW9ucywgc2V0T2JqKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBpY29uVGVtcGxhdGU6IHRoaXMuaWNvblRlbXBsYXRlKHRoaXMub3B0aW9ucylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5JY29uQnV0dG9uID0gV29vZC5JY29uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1pY29uJyxcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICdtb3VzZWRvd24nOiAnbW91c2VEb3duJyxcbiAgICAgICAgJ21vdXNlbGVhdmUnOidtb3VzZU91dCcsXG4gICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgIH0sXG4gICAgICByZWdpb25zOntcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICB0b29sdGlwQ29udGFpbmVyOiAnI3Rvb2x0aXAtY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnPGRpdiBpZD1cInRvb2x0aXAtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmNsaWNrKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCh0aGlzLm9wdGlvbnMuY2xpY2tFdmVudCwgZSk7XG4gICAgICB9LFxuICAgICAgZGlzYWJsZTogZnVuY3Rpb24oIGRpc2FibGVkICl7XG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2Rpc2FibGVkJywgZGlzYWJsZWQgKTtcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgaWYoIHRoaXMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcC5mb2N1c0luKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzT3V0KCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlKHRoaXMub3B0aW9ucy5kaXNhYmxlZCk7XG4gICAgICB9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZURvd24oKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciByaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMudG9vbHRpcCApe1xuICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vcHRpb25zLmRpc2FibGVkID8gJ0Rpc2FibGVkJyA6IHRoaXMub3B0aW9ucy50b29sdGlwO1xuICAgICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBXb29kLlRvb2x0aXAoe1xuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRhaW5lci5zaG93KHRoaXMudG9vbHRpcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkNoZWNrYm94ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1jaGVja2JveCcsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6Y2hlY2tib3hcIjogXCJjbGlja0NoZWNrYm94XCIsXG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6e1xuICAgICAgICBib3hJY29uVmlldzogV29vZC5JY29uQnV0dG9uLFxuICAgICAgICBib3hJY29uT3B0aW9uczp7XG4gICAgICAgICAgaWNvbjogJ3NxdWFyZS1vJyxcbiAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6Y2hlY2tib3gnXG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlLFxuICAgICAgICBjaGVja0ljb25WaWV3OiBXb29kLkljb24sXG4gICAgICAgIGNoZWNrSWNvbk9wdGlvbnM6e1xuICAgICAgICAgIGljb246ICdjaGVjay1zcXVhcmUnLFxuICAgICAgICAgIGNvbG9yOiAnYmx1ZSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIGNoZWNrQ29udGFpbmVyOiAnI2NoZWNrLWNvbnRhaW5lcicsXG4gICAgICAgIGJveENvbnRhaW5lcjogJyNib3gtY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIHRhZ05hbWU6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBjbGFzcz1cImNoZWNrLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImNoZWNrLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYm94LXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImJveC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgY2xpY2tDaGVja2JveDogZnVuY3Rpb24oY2hpbGQsIGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmKCB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJykgKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJywgdGhpcy5vcHRpb25zLmNoZWNrZWQpO1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6Y2hlY2tib3hcIiwgdGhpcy5vcHRpb25zLmNoZWNrZWQpXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIC8vanF1ZXJ5IHJlY3Vyc2l2ZSBjb3B5XG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY2hlY2sgPSBuZXcgdGhpcy5vcHRpb25zLmNoZWNrSWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNoZWNrSWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jaGVja0NvbnRhaW5lci5zaG93KGNoZWNrKTtcblxuICAgICAgICB2YXIgYm94ID0gbmV3IHRoaXMub3B0aW9ucy5ib3hJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYm94SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ib3hDb250YWluZXIuc2hvdyhib3gpO1xuXG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnLCB0aGlzLm9wdGlvbnMuY2hlY2tlZCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5TZXBhcmF0b3IgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1zZXBhcmF0b3InLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgfSk7XG5cbiAgICBXb29kLkljb25MaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgICAgY2hpbGRWaWV3OiBXb29kLkljb24sXG4gICAgICB0YWdOYW1lOiAnd29vZC1pY29uLWxpc3QnLFxuICAgICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIHJldHVybiBpdFxuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgICBnZXRWaWV3OiBmdW5jdGlvbihpZCl7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgICAgaWYoIGlkID09IGNoaWxkVmlldy5pZClcbiAgICAgICAgICAgIHJldHVybiBjaGlsZFZpZXc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5pbnB1dHMgPSB7fTtcblxucmVxdWlyZSgnLi90ZXh0LmpzJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLklucHV0ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgaW5wdXQnLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXBsYWNlaG9sZGVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC10ZXh0XCI+PCUtZmxvYXRpbmdMYWJlbFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGludC10ZXh0XCI+PCUtaGludFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8aW5wdXQgdHlwZT1cIjwlLXR5cGUlPlwiIHZhbHVlPVwiPCUtdmFsdWUlPlwiIDwlLWF0dHJpYnV0ZVN0cmluZyU+PjwvaW5wdXQ+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20taW5hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJlcnJvci10ZXh0XCIgY2xhc3M9XCJlcnJvci10ZXh0XCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnY2hhbmdlIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5dXAgaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdrZXlkb3duIGlucHV0JzogJ3NldEZpbGxlZCcsXG4gICAgICAgICAgJ2ZvY3VzaW4gIGlucHV0JzogJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCBpbnB1dCc6ICdmb2N1c091dCdcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RmlsbGVkOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgaWYoIHRoaXMudmFsdWUgPT0gJycgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZXJyb3IoKTtcbiAgICAgICAgICBpZiggIWVycm9yICl7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmlucHV0OmNoYW5nZScsICFlcnJvcik7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgIGlmKCBlcnJvciApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2VycmVkJyk7XG4gICAgICAgICAgICB0aGlzLiQoJyNlcnJvci10ZXh0JykudGV4dChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuaXNSZXF1aXJlZCAmJiB2YWx1ZSA9PSAnJyApe1xuICAgICAgICAgICAgZXJyb3IgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgICAgfSBlbHNlIGlmKCB0aGlzLm9wdGlvbnMuZXJyb3IgKXtcbiAgICAgICAgICAgIGVycm9yID0gdGhpcy5vcHRpb25zLmVycm9yKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuICFlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzIDogW10sXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogJycsXG4gICAgICAgICAgaGludFRleHQ6ICcnLFxuICAgICAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgYXR0cmlidXRlU3RyaW5nID0gJC5tYXAodGhpcy5vcHRpb25zLmlucHV0QXR0cmlidXRlcyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCB2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBrZXkgKyAnPScgKyB2YWx1ZVxuICAgICAgICAgICAgfSkuam9pbignICcpXG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0VmFsdWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVTdHJpbmc6IGF0dHJpYnV0ZVN0cmluZ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkl0ZW0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1pdGVtJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS13cmFwcGVyXCI+JyArXG4gICAgICAgICc8JSBpZiAobGVmdEljb24pIHsgJT4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImxlZnQtaWNvbi1jb250YWluZXJcIiBjbGFzcz1cImxlZnQtaWNvblwiPjwvZGl2PicgK1xuICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIml0ZW0tYm9keVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmltYXJ5LXRleHRcIj48JT1wcmltYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNlY29uZGFyeS10ZXh0XCI+PCUtc2Vjb25kYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8JSBpZiAocmlnaHRJY29uKSB7ICU+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb24tY29udGFpbmVyXCIgY2xhc3M9XCJyaWdodC1pY29uXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBsZWZ0SWNvbkNvbnRhaW5lcjogJyNsZWZ0LWljb24tY29udGFpbmVyJyxcbiAgICAgIHJpZ2h0SWNvbkNvbnRhaW5lcjogJyNyaWdodC1pY29uLWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgbGVmdEljb246IGZhbHNlLFxuICAgICAgbGVmdEljb25WaWV3OiBXb29kLkF2YXRhcixcbiAgICAgIGxlZnRJY29uT3B0aW9uczoge30sXG4gICAgICBwcmltYXJ5VGV4dDogbnVsbCxcbiAgICAgIHNlY29uZGFyeVRleHQ6IG51bGwsXG4gICAgICByaWdodEljb246IGZhbHNlLFxuICAgICAgcmlnaHRJY29uVmlldzogbnVsbCxcbiAgICAgIHJpZ2h0SWNvbk9wdGlvbnM6IHt9XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGVmdEljb24pIHtcbiAgICAgICAgdmFyIGxlZnRJY29uID0gbmV3IHRoaXMub3B0aW9ucy5sZWZ0SWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmxlZnRJY29uT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmxlZnRJY29uQ29udGFpbmVyLnNob3cobGVmdEljb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJpZ2h0SWNvbikge1xuICAgICAgICB2YXIgcmlnaHRJY29uID0gbmV3IHRoaXMub3B0aW9ucy5yaWdodEljb25WaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5yaWdodEljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmlnaHRJY29uQ29udGFpbmVyLnNob3cocmlnaHRJY29uKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkl0ZW1CdXR0b24gPSBXb29kLkl0ZW0uZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOntcbiAgICAgIGNsYXNzOiAnYnV0dG9uJ1xuICAgIH0sXG4gICAgZXZlbnRzOntcbiAgICAgICdjbGljayc6ICdjbGljaydcbiAgICB9LFxuICAgIGRlZmF1bHRzOiBfLmV4dGVuZCh7fSwgV29vZC5JdGVtLnByb3RvdHlwZS5kZWZhdWx0cywge1xuICAgICAgY2xpY2tFdmVudDogJ2FjdGlvbjpjbGljazppdGVtJyxcbiAgICAgIGNsaWNrRXZlbnRBcmc6IG51bGxcbiAgICB9KSxcbiAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QodGhpcy5vcHRpb25zLmNsaWNrRXZlbnQsIHRoaXMub3B0aW9ucy5jbGlja0V2ZW50QXJnKTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLkRpdmlkZXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3dvb2QtZGl2aWRlcicsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpLFxuICB9KTtcblxuICBXb29kLkxpc3QgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3dvb2QtbGlzdCcsXG4gICAgY2hpbGRFdmVudHM6IHtcbiAgICB9LFxuICAgIGNoaWxkVmlldzogV29vZC5JdGVtLFxuICAgIGJ1aWxkQ2hpbGRWaWV3OiBmdW5jdGlvbihjaGlsZCwgQ2hpbGRWaWV3Q2xhc3MsIGNoaWxkVmlld09wdGlvbnMpe1xuICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ2l0ZW1WaWV3JykgfHwgQ2hpbGRWaWV3Q2xhc3M7XG4gICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnaXRlbU9wdGlvbnMnKTtcblxuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uID0gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLml0ZW1zKTtcbiAgICB9XG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uKFdvb2QpIHtcbiAgV29vZC5SaXBwbGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd3b29kIHJpcHBsZS13cmFwcGVyJyxcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICcnKSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgICAgdGhpcy4kcmlwcGxlcyA9IFtdO1xuICAgIH0sXG4gICAgcHl0aGFnb3JhczogZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gTWF0aC5wb3coTWF0aC5wb3coYSwyKStNYXRoLnBvdyhiLDIpLDAuNSk7XG4gICAgfSxcbiAgICBjcmVhdGVSaXBwbGU6IGZ1bmN0aW9uKGNsYXNzTmFtZSwgeCwgeSl7XG4gICAgICB2YXIgJHJpcHBsZSA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgJHJpcHBsZS5hZGRDbGFzcygnY2lyY2xlIHJpcHBsZSAnICsgY2xhc3NOYW1lKTtcbiAgICAgIHZhciBoID0gdGhpcy4kZWwuaGVpZ2h0KCk7XG4gICAgICB2YXIgdyA9IHRoaXMuJGVsLndpZHRoKCk7XG4gICAgICBpZiggeCA9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgeCA9IHcvMjtcbiAgICAgICAgeSA9IGgvMjtcbiAgICAgIH1cbiAgICAgIHZhciByID0gdGhpcy5weXRoYWdvcmFzKE1hdGgubWF4KHgsdy14KSwgTWF0aC5tYXgoeSxoLXkpKTtcbiAgICAgICRyaXBwbGUuY3NzKHtcbiAgICAgICAgJ3RvcCc6IHkgLSByLFxuICAgICAgICAnbGVmdCc6IHggLSByLFxuICAgICAgICAnaGVpZ2h0JzogMipyLFxuICAgICAgICAnd2lkdGgnOiAyKnJcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuICRyaXBwbGU7XG4gICAgfSxcbiAgICBmb2N1c0luOiBmdW5jdGlvbigpe1xuICAgICAgaWYoICF0aGlzLiRwdWxzZSAgJiYgdGhpcy4kcmlwcGxlcy5sZW5ndGggPT0gMCl7XG4gICAgICAgIHZhciAkcHVsc2UgPSB0aGlzLmNyZWF0ZVJpcHBsZSgncHVsc2luZycpO1xuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJHB1bHNlKTtcbiAgICAgICAgdGhpcy4kcHVsc2UgPSAkcHVsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBmb2N1c091dDogZnVuY3Rpb24oKXtcbiAgICAgIGlmKCB0aGlzLiRwdWxzZSApe1xuICAgICAgICB0aGlzLmZhZGUodGhpcy4kcHVsc2UsIDApO1xuICAgICAgICB0aGlzLiRwdWxzZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlRG93bjogZnVuY3Rpb24oeCwgeSl7XG4gICAgICB2YXIgJHJpcHBsZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwcm9wYWdhdGluZycsIHgsIHkpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kKCRyaXBwbGUpO1xuICAgICAgdGhpcy4kcmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICAgIH0sXG4gICAgbW91c2VPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgJHJpcHBsZSA9IHRoaXMuJHJpcHBsZXMucG9wKCk7XG4gICAgICBpZiggJHJpcHBsZSApe1xuICAgICAgICB0aGlzLmZhZGUoJHJpcHBsZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGljazogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciAkcmlwcGxlID0gdGhpcy4kcmlwcGxlcy5wb3AoKTtcbiAgICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICAgIHRoaXMuJHJpcHBsZXMucHVzaCgkcmlwcGxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW91c2VEb3duKCk7XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHNlbGYubW91c2VPdXQoKTtcbiAgICAgIH0sIDApO1xuICAgIH0sXG4gICAgZmFkZTogZnVuY3Rpb24ocmlwcGxlLCBkdXJhdGlvbil7XG4gICAgICB2YXIgZHVyYXRpb24gPSB0eXBlb2YgZHVyYXRpb24gPT0gJ251bWJlcicgPyBkdXJhdGlvbiA6IDUwMDtcbiAgICAgIHJpcHBsZS5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpe1xuICAgICAgICByaXBwbGUucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5TcGlubmVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1zcGlubmVyJyxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHZpZXdCb3g9XCI8JS1yKzUlPiA8JS1yKzUlPiA8JS1kKzEwJT4gPCUtZCsxMCU+XCIgaGVpZ2h0PVwiPCUtZCU+XCIgd2lkdGg9XCI8JS1kJT5cIj4nICtcbiAgICAgICAgICAgICc8Y2lyY2xlIGNsYXNzPVwicGF0aFwiIGN4PVwiPCUtZCsxMCU+XCIgY3k9XCI8JS1kKzEwJT5cIiByPVwiPCUtcmFkaXVzJT5cIiBzdHJva2Utd2lkdGg9XCI8JS1zdHJva2VXaWR0aCU+XCIvPicgK1xuICAgICAgICAgICc8L3N2Zz4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHJhZGl1czogMjAsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6IDJcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHJhZGl1cyA9IHRoaXMub3B0aW9ucy5yYWRpdXM7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHI6IHJhZGl1cyxcbiAgICAgICAgICAgIGQ6IHJhZGl1cyAqIDJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgIG92ZXJsYXk6IGZ1bmN0aW9uICgkZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHdpZGdldCA9IG5ldyBXb29kLlNwaW5uZXIob3B0aW9ucyk7XG4gICAgICAgIHdpZGdldC5yZW5kZXIoKTtcbiAgICAgICAgJG92ZXJsYXkgPSB3aWRnZXQuJGVsO1xuICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnb3ZlcmxheScpO1xuXG4gICAgICAgICRlbC5hcHBlbmQoJG92ZXJsYXkpO1xuICAgICAgICByZXR1cm4gJG92ZXJsYXk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLlNwaW5uZXJPdmVybGF5ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLXNwaW5uZXItb3ZlcmxheScsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwib3ZlcmxheSBiYWNrZ3JvdW5kQ29sb3ItPCUtYmFja2dyb3VuZENvbG9yJT5cIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwic3Bpbm5lci1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgJ2NsaWNrJzogJ3ByZXZlbnREZWZhdWx0J1xuICAgICAgICB9LFxuICAgICAgICByZWdpb25zOiB7XG4gICAgICAgICAgc3Bpbm5lckNvbnRhaW5lcjogJyNzcGlubmVyLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIHNwaW5uZXIgPSBuZXcgV29vZC5TcGlubmVyKCk7XG4gICAgICAgICAgdGhpcy5zcGlubmVyQ29udGFpbmVyLnNob3coc3Bpbm5lcilcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHNob3c6IGZ1bmN0aW9uICgkZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG92ZXJsYXkgPSBuZXcgV29vZC5TcGlubmVyT3ZlcmxheShvcHRpb25zKTtcbiAgICAgICAgb3ZlcmxheS5yZW5kZXIoKTtcblxuICAgICAgICAkZWwuYXBwZW5kKG92ZXJsYXkuJGVsKTtcbiAgICAgICAgcmV0dXJuIG92ZXJsYXkuJGVsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ET1xuICAgIC8vIFdvb2QuSW5saW5lTG9hZGVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgIC8vICAgICB0YWdOYW1lOiAnaW1nJyxcbiAgICAvLyAgICAgYXR0cmlidXRlczoge1xuICAgIC8vICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9iYXIuZ2lmJyxcbiAgICAvLyAgICAgICAgIHN0eWxlOiAncG9zaXRpb246YWJzb2x1dGU7bWFyZ2luOmF1dG87dG9wOjA7Ym90dG9tOjA7J1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJylcbiAgICAvLyB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTQvMTIvMTUuXG4gKiBUT0RPIHJlbW92ZSBkYXRhdGFibGVzIGRlcGVuZGVuY3lcbiAqL1xuIChmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuVGFibGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd0YWJsZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGNsYXNzOiAndGFibGUgdGFibGUtc3RyaXBlZCcsXG4gICAgICAgICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBzdHlsZTogJ21pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTsnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlIGlmIChzaG93SGVhZGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzwlIGlmIChzaG93Rm9vdGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0Zm9vdD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGZvb3Q+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PidcbiAgICAgICAgKSxcbiAgICAgICAgY29sbGVjdERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5zOiBmdW5jdGlvbiAoc2NoZW1hKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgIC8vIGxvYWQgdGhlIGNvbHVtbiBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzY2hlbWFcbiAgICAgICAgICAgIGlmKHNjaGVtYSl7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHNjaGVtYS5jb2x1bW5zLCBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby52aXNpYmxlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGluZm8uZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5mby5kaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uRGVmczogZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciBkZWZzID0gW107XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IGNvbC5yZW5kZXJlcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFOYW1lID0gY29sLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSBjb2wucmVuZGVyZXJPcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZGlzcGxheScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpZGdldCA9IHNlbGZbcmVuZGVyZXJdKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEsIHJlbmRlcmVyT3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZih3aWRnZXQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IGRhdGFOYW1lICsgJ18nICsgbWV0YS5yb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlcmVyc1tpZF0gPSB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwicmVuZGVyZXItY29udGFpbmVyIHdhaXRpbmdcIj48L3NwYW4+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEV4cG9ydERhdGE6IGZ1bmN0aW9uIChyZWNvcmQsIGZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRdO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRfY29sdW1ucyA9IHNlbGYuZ2V0Q29sdW1ucyhzZWxmLmNvbGxlY3Rpb24ubW9kZWwucHJvdG90eXBlLnNjaGVtYSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2x1bW5GaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbHVtbnMgPSBfLmZpbHRlcihkZWZhdWx0X2NvbHVtbnMsIG9wdGlvbnMuY29sdW1uRmlsdGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGNvbGxlY3Rpb24gZm9yIHRoaXMgZGF0YXRhYmxlXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnMgPSB7fTtcbiAgICAgICAgICAgIHNlbGYuYmFzZVNlYXJjaCA9IG9wdGlvbnMuc2VhcmNoIHx8ICcnO1xuXG4gICAgICAgICAgICBzZWxmLnJvd0hlaWdodCA9IG9wdGlvbnMucm93SGVpZ2h0IHx8IDU5O1xuICAgICAgICAgICAgc2VsZi5tYXhWaXNpYmxlUm93cyA9IG9wdGlvbnMubWF4VmlzaWJsZVJvd3MgfHwgMTA7XG4gICAgICAgICAgICBzZWxmLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgICAgICAgICBzZWxmLmNvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnMgfHwgZGVmYXVsdF9jb2x1bW5zO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5EZWZzID0gb3B0aW9ucy5jb2x1bW5EZWZzIHx8IHNlbGYuZ2V0Q29sdW1uRGVmcyhzZWxmLmNvbHVtbnMpO1xuICAgICAgICAgICAgc2VsZi5zaG93SGVhZGVyID0gb3B0aW9ucy5zaG93SGVhZGVyIHx8IHRydWU7XG4gICAgICAgICAgICBzZWxmLnNob3dGb290ZXIgPSBvcHRpb25zLnNob3dGb290ZXIgfHwgZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmRhdGFUYWJsZU9wdGlvbnMgPSBvcHRpb25zLmRhdGFUYWJsZU9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBzZWxmLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcblxuXG4gICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUm93UmVuZGVyOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJChyb3cpLmZpbmQoJy5yZW5kZXJlci1jb250YWluZXIud2FpdGluZycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkaG9sZGVyID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkaG9sZGVyLnJlbW92ZUNsYXNzKCd3YWl0aW5nJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBzZWxmLnJlbmRlcmVyc1skaG9sZGVyLmF0dHIoJ2lkJyldO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEganF1ZXJ5IG9iamVjdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlciBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyIGEgYmFja2JvbmUgdmlld1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIuJGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB2aXJ0dWFsIG1ldGhvZFxuICAgICAgICB9LFxuICAgICAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSBkZWZhdWx0IGxvYWRlciBmb3IgdGhpcyB0YWJsZSB0byBsb2FkIGNvbGxlY3Rpb24gaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNjcm9sbFk6ICQod2luZG93KS5oZWlnaHQoKSAtIDM4NSxcbiAgICAgICAgICAgICAgICBzY3JvbGxYOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlZmVyUmVuZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvbTogJzxcInRpdGxlXCI+WlRmcnRpUycsXG4gICAgICAgICAgICAgICAgc2Nyb2xsQ29sbGFwc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zLFxuICAgICAgICAgICAgICAgIGNvbHVtbkRlZnM6IHRoaXMuY29sdW1uRGVmcyxcbiAgICAgICAgICAgICAgICByb3dDYWxsYmFjazogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYub25Sb3dSZW5kZXIocm93LCBkYXRhLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGxlcjoge1xuICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5QnVmZmVyOiAyXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2ssIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBuZXcgV29vZC5TcGlubmVyLm92ZXJsYXkoc2VsZi4kZWwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0YWJsZVRvb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNTd2ZQYXRoOiAnL2Fzc2V0cy9zd2YvY29weV9jc3ZfeGxzX3BkZi5zd2YnLFxuICAgICAgICAgICAgICAgICAgICBhQnV0dG9uczpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0V4dGVuZHM6ICdjc3YnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25UZXh0OiAnRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uQ2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgYnRuLXhzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkNlbGxSZW5kZXI6IGZ1bmN0aW9uICh2YWx1ZSwgY29sdW1uLCBkb21Sb3csIHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gc2VsZi5jb2xsZWN0aW9uLmF0KHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHNlbGYuY29sdW1uc1tjb2x1bW5dLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldEV4cG9ydERhdGEocmVjb3JkLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHRoaXMuJGVsLkRhdGFUYWJsZShfLmV4dGVuZChvcHRpb25zLCBzZWxmLmRhdGFUYWJsZU9wdGlvbnMpKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2VhcmNoKHRoaXMuYmFzZVNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUgPSBzZWxmLiRlbC5jbG9zZXN0KCcuZGF0YVRhYmxlc193cmFwcGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbignc2VhcmNoLmR0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOnNlYXJjaCcsIHNlbGYudGFibGUuc2VhcmNoKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdGFibGUgPSBzZWxmO1xuICAgICAgICAgICAgICAgIHNlbGYuJGRhdGFUYWJsZS5maW5kKCdkaXYudGl0bGUnKS5hcHBlbmQoc2VsZi50aXRsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBXb29kLlNwaW5uZXIub3ZlcmxheSh0aGlzLiRlbCk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLmFqYXgucmVsb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc1RvdGFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXRIZWlnaHQ6IGZ1bmN0aW9uIChoZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZS5maW5kKCcuZGF0YVRhYmxlc19zY3JvbGxCb2R5JykuY3NzKCdtYXgtaGVpZ2h0JywgaGVpZ2h0ICsgXCJweFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplSGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2V0SGVpZ2h0KCQod2luZG93KS5oZWlnaHQoKSAtIDU3MClcbiAgICAgICAgfSxcbiAgICAgICAgdW5maWx0ZXJlZFJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzRGlzcGxheTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBzaG93SGVhZGVyOiB0aGlzLnNob3dIZWFkZXIsXG4gICAgICAgICAgICAgICAgc2hvd0Zvb3RlcjogdGhpcy5zaG93Rm9vdGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRvb2xiYXIgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwid29vZC10b29sYmFyXCIsXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJytcbiAgICAgICAgJzxkaXYgaWQ9XCJsZWZ0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cImxlZnQtaWNvbnMtd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PCUtdGl0bGUlPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cInJpZ2h0LWljb25zLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBsZWZ0SWNvbnNDb250YWluZXI6IFwiI2xlZnQtaWNvbnMtd3JhcHBlclwiLFxuICAgICAgICByaWdodEljb25zQ29udGFpbmVyOiBcIiNyaWdodC1pY29ucy13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgJ2FjdGlvbjpjbGljazppY29uJzogXCJvbkNsaWNrSWNvblwiLFxuICAgICAgfSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgLnRpdGxlJzogJ29uQ2xpY2tUaXRsZScsXG4gICAgICB9LFxuICAgICAgb25DbGlja0ljb246IGZ1bmN0aW9uKGljb25WaWV3KXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCAnYWN0aW9uOmNsaWNrOmljb24nLCBpY29uVmlldyApO1xuICAgICAgfSxcbiAgICAgIG9uQ2xpY2tUaXRsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246Y2xpY2s6dGl0bGUnKTtcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBsZWZ0SWNvbnM6IFtdLFxuICAgICAgICByaWdodEljb25zOiBbXSxcbiAgICAgICAgdGl0bGU6ICdUb29sYmFyJyxcbiAgICAgICAgY29sb3I6ICdibGFjaycsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXktbGlnaHQnLFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRJY29uOiBmdW5jdGlvbihpY29uSWQpe1xuICAgICAgICB2YXIgYSA9IHRoaXMubGVmdEljb25zQ29udGFpbmVyLmN1cnJlbnRWaWV3LmdldFZpZXcoaWNvbklkKTtcbiAgICAgICAgdmFyIGIgPSB0aGlzLnJpZ2h0SWNvbnNDb250YWluZXIuY3VycmVudFZpZXcuZ2V0VmlldyhpY29uSWQpO1xuICAgICAgICByZXR1cm4gYSB8fCBiO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjb2xvci0nK3RoaXMub3B0aW9ucy5jb2xvcik7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdiYWNrZ3JvdW5kQ29sb3ItJyt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKTtcblxuICAgICAgICB2YXIgbGVmdEljb25MaXN0ID0gbmV3IFdvb2QuSWNvbkxpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5sZWZ0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxlZnRJY29uc0NvbnRhaW5lci5zaG93KGxlZnRJY29uTGlzdCk7XG5cbiAgICAgICAgdmFyIHJpZ2h0SWNvbkxpc3QgPSBuZXcgV29vZC5JY29uTGlzdCh7XG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLnJpZ2h0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJpZ2h0SWNvbnNDb250YWluZXIuc2hvdyhyaWdodEljb25MaXN0KTtcbiAgICAgIH0sXG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDMvMTEvMTUuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLlRvb2x0aXAgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgdG9vbHRpcC1hbmNob3Itd3JhcHBlcicsXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1hbmNob3JcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIndvb2QtdG9vbHRpcFwiPjwlLSB0ZXh0ICU+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgZGVmYXVsdHM6e1xuICAgICAgdGV4dDogJydcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiA0LzUvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuQnJhbmNoID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWJyYW5jaFwiLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgaWQ9XCJ0cmVlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICcnKSxcbiAgICBjaGlsZEV2ZW50czp7XG4gICAgfSxcbiAgICByZWdpb25zOiB7XG4gICAgICB0cmVlQ29udGFpbmVyOiBcIiN0cmVlLWNvbnRhaW5lclwiLFxuICAgIH0sXG4gICAgZGVmYXVsdHM6IHtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy50cmVlID0gdGhpcy5vcHRpb25zLnRyZWVcbiAgICB9LFxuICAgIGdldFRyZWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy50cmVlLmdldFRyZWUodGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIGJ1YmJsZUNoaWxkRXZlbnQ6IGZ1bmN0aW9uKGNoaWxkRXZlbnROYW1lKXtcbiAgICAgIHRoaXMuY2hpbGRFdmVudHNbY2hpbGRFdmVudE5hbWVdID0gZnVuY3Rpb24oY2hpbGQsIGFyZ3Mpe1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoY2hpbGRFdmVudE5hbWUsIGFyZ3MpXG4gICAgICB9XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdHJlZSA9IHRoaXMuZ2V0VHJlZSgpO1xuICAgICAgdGhpcy50cmVlQ29udGFpbmVyLnNob3codHJlZSk7XG5cbiAgICAgIGZvciggY2hpbGRFdmVudE5hbWUgaW4gdHJlZS5jaGlsZEV2ZW50cyApe1xuICAgICAgICB0aGlzLmJ1YmJsZUNoaWxkRXZlbnQoY2hpbGRFdmVudE5hbWUpXG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5CcmFuY2hlcyA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtYnJhbmNoZXNcIixcbiAgICBjaGlsZFZpZXc6IFdvb2QuQnJhbmNoLFxuICAgIGJ1aWxkQ2hpbGRWaWV3OiBmdW5jdGlvbihjaGlsZCwgQ2hpbGRWaWV3Q2xhc3MsIGNoaWxkVmlld09wdGlvbnMpe1xuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgY2hpbGQuYXR0cmlidXRlcywge1xuICAgICAgICB0cmVlOiB0aGlzLnRyZWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IENoaWxkVmlld0NsYXNzKG9wdGlvbnMpO1xuXG4gICAgICAvLyByZXR1cm4gaXRcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgZXZlbnRzOiB7fSxcbiAgICBkZWZhdWx0czoge1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnRyZWUgPSB0aGlzLm9wdGlvbnMudHJlZTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbil7XG4gICAgICByZXR1cm4gdGhpcy50cmVlLmZpbHRlcihjaGlsZCwgaW5kZXgsIGNvbGxlY3Rpb24pXG4gICAgfVxuICB9KTtcblxuICBXb29kLlRyZWUgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtdHJlZVwiLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJ0cmVlLXdyYXBwZXJcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0d2lnXCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiaXRlbS1jb250YWluZXJcIiBjbGFzcz1cIml0ZW0tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBpZD1cImNoaWxkcmVuLWNvbnRhaW5lclwiIGNsYXNzPVwiY2hpbGRyZW4tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgJycpLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIGl0ZW1Db250YWluZXI6IFwiI2l0ZW0tY29udGFpbmVyXCIsXG4gICAgICBjaGlsZHJlbkNvbnRhaW5lcjogXCIjY2hpbGRyZW4tY29udGFpbmVyXCIsXG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBpdGVtVmlldzogV29vZC5JdGVtLFxuICAgICAgaXRlbU9wdGlvbnM6IHt9LFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24oY2hpbGQsIGluZGV4LCBjb2xsZWN0aW9uKXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZ2V0Q29sbGVjdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMuY2hpbGRyZW4pO1xuICAgIH0sXG4gICAgZ2V0SXRlbTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5vcHRpb25zLml0ZW1WaWV3KHRoaXMub3B0aW9ucy5pdGVtT3B0aW9ucyk7XG4gICAgfSxcbiAgICBnZXRUcmVlOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHJldHVybiBuZXcgV29vZC5UcmVlKG9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oKTtcbiAgICAgIHRoaXMuaXRlbUNvbnRhaW5lci5zaG93KGl0ZW0pO1xuXG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLmdldENvbGxlY3Rpb24oKTtcbiAgICAgIGlmKCB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCApe1xuICAgICAgICB2YXIgYnJhbmNoZXMgPSBuZXcgV29vZC5CcmFuY2hlcyh7XG4gICAgICAgICAgdHJlZTogdGhpcyxcbiAgICAgICAgICBjb2xsZWN0aW9uIDogdGhpcy5jb2xsZWN0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoaWxkcmVuQ29udGFpbmVyLnNob3coYnJhbmNoZXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuQXJib3Jpc3QgPSBXb29kLlRyZWUuZXh0ZW5kKHtcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbil7XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbi5nZXQodGhpcy5vcHRpb25zLnJvb3QpO1xuICAgICAgcmV0dXJuIGNoaWxkLmdldCgncGFyZW50JykgPT0gbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH0sXG4gICAgZ2V0Q29sbGVjdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICB9LFxuICAgIGdldEl0ZW06IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbi5nZXQodGhpcy5vcHRpb25zLnJvb3QpXG4gICAgICByZXR1cm4gbmV3IFdvb2QuSXRlbSh7XG4gICAgICAgIHByaW1hcnlUZXh0OiBtb2RlbC5nZXQoJ2lkJyksXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0VHJlZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICByZXR1cm4gbmV3IFdvb2QuQXJib3Jpc3Qoe1xuICAgICAgICByb290OiBvcHRpb25zLmlkLFxuICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmNvbGxlY3Rpb25cbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xuXG5cbn0pKHdpbmRvdy5Xb29kKTtcbiJdfQ==
