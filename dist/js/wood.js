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
  Wood.Subheader = Marionette.ItemView.extend({
    tagName: 'wood-subheader',
    template: _.template(
      '<%-text%>' +
    ''),
    defaults:{
      text: ''
    },
    initialize: function (options) {
      this.options = _.extend({}, this.defaults, options);
    },
    templateHelpers: function () {
      return {
        text: this.options.text
      }
    }
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvY2FyZC5qcyIsInNyYy9qcy9kaWFsb2cuanMiLCJzcmMvanMvZHJvcGRvd24uanMiLCJzcmMvanMvZm9ybS5qcyIsInNyYy9qcy9pY29uLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiLCJzcmMvanMvaXRlbS5qcyIsInNyYy9qcy9saXN0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy9zcGlubmVyLmpzIiwic3JjL2pzL3RhYmxlLmpzIiwic3JjL2pzL3Rvb2xiYXIuanMiLCJzcmMvanMvdG9vbHRpcC5qcyIsInNyYy9qcy90cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93Lldvb2QgPSB7fTtcblxuLy8gaW5jbHVkZSBiYXNlIGNvbW1vbiB3aWRnZXRzXG5yZXF1aXJlKCcuL2lucHV0cy9hbGwnKTtcblxucmVxdWlyZSgnLi9hdmF0YXInKTtcbnJlcXVpcmUoJy4vYnV0dG9uJyk7XG5yZXF1aXJlKCcuL2NhcmQnKTtcbnJlcXVpcmUoJy4vZGlhbG9nJyk7XG5yZXF1aXJlKCcuL2Ryb3Bkb3duJyk7XG5yZXF1aXJlKCcuL2Zvcm0nKTtcbnJlcXVpcmUoJy4vaWNvbicpO1xucmVxdWlyZSgnLi9pdGVtJyk7XG5yZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vc3Bpbm5lcicpO1xucmVxdWlyZSgnLi9yaXBwbGUnKTtcbnJlcXVpcmUoJy4vdGFibGUnKTtcbnJlcXVpcmUoJy4vdG9vbHRpcCcpO1xucmVxdWlyZSgnLi90b29sYmFyJyk7XG5yZXF1aXJlKCcuL3RyZWUnKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5BdmF0YXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiBcIndvb2QtYXZhdGFyXCIsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2hhcGUgPCUtc2hhcGUlPiBjb2xvci08JS1jb2xvciU+IGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPicgK1xuICAgICAgICAgICAgJzwlIGlmIChpbWFnZSkgeyAlPicgK1xuICAgICAgICAgICAgICAnPGltZyBjbGFzcz1cImltZ1wiIHNyYz1cIjwlLWltYWdlJT5cIj48L2ltZz4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihpY29uKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiaWNvbiBmYSBmYS1pY29uIGZhLTwlLWljb24lPlwiPjwvaT4nICtcbiAgICAgICAgICAgICc8JX0gZWxzZSBpZihsZXR0ZXIpIHslPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj48JS1sZXR0ZXIlPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8JX0lPicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbWFnZTogbnVsbCxcbiAgICAgICAgICBpY29uOiBudWxsLFxuICAgICAgICAgIGxldHRlcjogbnVsbCxcbiAgICAgICAgICBzaGFwZTogbnVsbCxcbiAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2luaGVyaXQnXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICB2YXIgTGFiZWwgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWxhYmVsJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJpY29uLWNvbnRhaW5lclwiIGNsYXNzPVwiaWNvbi13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInRleHQtd3JhcHBlclwiPjwlLXRleHQlPjwvc3Bhbj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgaWNvbkNvbnRhaW5lcjogJyNpY29uLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIGljb25DbGFzczogJ2ZhJyxcbiAgICAgICAgdGV4dDogJ0J1dHRvbicsXG4gICAgICAgIGNvbG9yOiAnaW5oZXJpdCdcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5pY29uICl7XG4gICAgICAgICAgdmFyIGljb25WaWV3ID0gbmV3IFdvb2QuSWNvbih7XG4gICAgICAgICAgICBpY29uOiB0aGlzLm9wdGlvbnMuaWNvbixcbiAgICAgICAgICAgIGljb25DbGFzczogdGhpcy5vcHRpb25zLmljb25DbGFzcyxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmljb25Db250YWluZXIuc2hvdyhpY29uVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHZhciBCdXR0b24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCIgY2xhc3M9XCJyaXBwbGUtY29udGFpbmVyIGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwibGFiZWwtY29udGFpbmVyXCIgY2xhc3M9XCJsYWJlbC13cmFwcGVyIGNvbG9yLTwlLWNvbG9yJT5cIj48JS1sYWJlbCU+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczp7XG4gICAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICAgIGxhYmVsQ29udGFpbmVyOiAnI2xhYmVsLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0JzogJ2ZvY3VzT3V0JyxcbiAgICAgICAgICAnbW91c2Vkb3duJzonbW91c2VEb3duJyxcbiAgICAgICAgICAnbW91c2VvdXQnOiAnbW91c2VPdXQnLFxuICAgICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuZm9jdXNJbigpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuZm9jdXNPdXQoKVxuICAgICAgICB9LFxuICAgICAgICBtb3VzZURvd246IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciB4ID0gZS5wYWdlWCAtIHRoaXMuJGVsLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgICAgdmFyIHkgPSBlLnBhZ2VZIC0gdGhpcy4kZWwub2Zmc2V0KCkudG9wO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VEb3duKHgsIHkpO1xuICAgICAgICB9LFxuICAgICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50b0VsZW1lbnQpO1xuICAgICAgICAgIGlmKCB0YXJnZXQuY2xvc2VzdCh0aGlzLiRlbCkubGVuZ3RoID09MCApe1xuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgaWNvbkNsYXNzOiAnZmEnLFxuICAgICAgICAgIGxhYmVsOiAnQnV0dG9uJyxcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdzZWNvbmRhcnknLFxuICAgICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiggZGlzYWJsZWQgKXtcbiAgICAgICAgICBpZiggIXRoaXMuX3NhdmluZyApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCBkaXNhYmxlZCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIGljb246IHRoaXMub3B0aW9ucy5pY29uLFxuICAgICAgICAgICAgaWNvbkNsYXNzOiB0aGlzLm9wdGlvbnMuaWNvbkNsYXNzLFxuICAgICAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5jb2xvcixcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpc2FibGUodHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICB2aWV3OiBXb29kLlNwaW5uZXIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IDEyLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiA2LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShmYWxzZSk7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKGZhbHNlKTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMuc3RhdGVDaGFuZ2UoJ3NhdmluZycpO1xuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnNhdmVCdXR0b25DbGljaycpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICAgIC8vIGlmKCB0aGlzLnN0YXRlICE9IHN0YXRlKXtcbiAgICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZsYXRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBmbGF0JyxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuUmFpc2VkQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gcmFpc2VkJyxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRHJvcGRvd25CdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiBkcm9wZG93bicsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lciBiYWNrZ3JvdW5kQ29sb3ItPCUtYmFja2dyb3VuZENvbG9yJT5cIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJsYWJlbC1jb250YWluZXJcIiBjbGFzcz1cImxhYmVsLXdyYXBwZXIgY29sb3ItPCUtY29sb3IlPlwiPjwlLWxhYmVsJT48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJjYXJldC1jb250YWluZXJcIiBjbGFzcz1cImNhcmV0LXdyYXBwZXIgY29sb3ItPCUtY29sb3IlPlwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FyZXQodGhpcy5leHBhbmRlZCk7XG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBtb3VzZURvd246IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy5leHBhbmRlZCApe1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUubW91c2VPdXQoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpkcm9wZG93bjpjb2xsYXBzZScpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBCdXR0b24ucHJvdG90eXBlLm1vdXNlRG93bi5jYWxsKHRoaXMsIGUpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmRyb3Bkb3duOmV4cGFuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICB9LFxuICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBjbGljazogZnVuY3Rpb24oZSl7fSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICBCdXR0b24ucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICBCdXR0b24ucHJvdG90eXBlLm9uUmVuZGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuYWRkUmVnaW9uKFwiY2FyZXRDb250YWluZXJcIiwgXCIjY2FyZXQtY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLnJlbmRlckNhcmV0KHRoaXMuZXhwYW5kZWQpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlckNhcmV0OiBmdW5jdGlvbihleHBhbmRlZCl7XG4gICAgICAgIHZhciBpY29uID0gZXhwYW5kZWQgPyAnYW5nbGUtdXAnIDogJ2FuZ2xlLWRvd24nO1xuICAgICAgICB2YXIgY2FyZXQgPSBuZXcgV29vZC5JY29uKHtcbiAgICAgICAgICBpY29uOiBpY29uLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuY29sb3JcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2FyZXRDb250YWluZXIuc2hvdyhjYXJldCk7XG4gICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuQ2FyZCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC1jYXJkXCIsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBpZD1cImF2YXRhci13cmFwcGVyXCIgY2xhc3M9XCJhdmF0YXItd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwlLXByaW1hcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2FyZC1jb250ZW50XCIgY2xhc3M9XCJjYXJkLWNvbnRlbnRcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2FyZC1mb290ZXJcIiBjbGFzcz1cImNhcmQtZm9vdGVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgY2FyZEhlYWRlcjogXCIjY2FyZC1oZWFkZXJcIixcbiAgICAgIGF2YXRhcjogXCIjYXZhdGFyLXdyYXBwZXJcIixcbiAgICAgIGNhcmRDb250ZW50OiBcIiNjYXJkLWNvbnRlbnRcIixcbiAgICAgIGNhcmRGb290ZXI6IFwiI2NhcmQtZm9vdGVyXCIsXG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBwcmltYXJ5VGV4dDogJ0NhcmQnLFxuICAgICAgaGVhZGVyVmlldzogbnVsbCxcbiAgICAgIGhlYWRlck9wdGlvbnM6IHtcbiAgICAgICAgaWNvbjogJ3F1ZXN0aW9uJyxcbiAgICAgICAgc2hhcGU6ICdjaXJjbGUnXG4gICAgICB9LFxuICAgICAgY29udGVudFZpZXc6IG51bGwsXG4gICAgICBjb250ZW50T3B0aW9uczoge30sXG4gICAgICBmb290ZXJWaWV3OiBudWxsLFxuICAgICAgZm9vdGVyT3B0aW9uczoge31cbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF2YXRhciA9IG5ldyBXb29kLkF2YXRhcih0aGlzLm9wdGlvbnMuaGVhZGVyT3B0aW9ucyk7XG4gICAgICB0aGlzLmF2YXRhci5zaG93KGF2YXRhcik7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGVudFZpZXcpIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBuZXcgdGhpcy5vcHRpb25zLmNvbnRlbnRWaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb250ZW50T3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmNhcmRDb250ZW50LnNob3coY29udGVudCk7XG4gICAgICB9XG5cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAxNC8xMi8xNS5cbiAqIFRPRE8gcmVtb3ZlIGJvb3RzdHJhcCBkZXBlbmRlbmN5XG4gKi9cbihmdW5jdGlvbiAoa2V5cykge1xuICAgIFdvb2QuRGlhbG9nID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWRpYWxvZycsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwiZGlhbG9nLWNvbnRlbnQtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgICAgZGlhbG9nQ29udGVudENvbnRhaW5lcjogJyNkaWFsb2ctY29udGVudC1jb250YWluZXInLFxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgdGl0bGU6ICdEaWFsb2cnXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICAgIHRoaXMuZGlhbG9nID0gbmV3IEJvb3RzdHJhcERpYWxvZyh7XG4gICAgICAgICAgICAgIHR5cGU6IEJvb3RzdHJhcERpYWxvZy5UWVBFX1BSSU1BUlksXG4gICAgICAgICAgICAgIHNpemU6IEJvb3RzdHJhcERpYWxvZy5TSVpFX05PUk1BTCxcbiAgICAgICAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyB2YXIgZGlhbG9nQ29udGVudCA9IHRoaXMub3B0aW9ucy5kaWFsb2dDb250ZW50O1xuICAgICAgICAgIC8vIGlmKCBkaWFsb2dDb250ZW50ICl7fVxuICAgICAgICAgIC8vICAgdGhpcy5kaWFsb2dDb250ZW50Q29udGFpbmVyLnNob3cobmV3IGRpYWxvZ0NvbnRlbnQudmlldyhkaWFsb2dDb250ZW50Lm9wdGlvbnMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLnNldFRpdGxlKHRoaXMub3B0aW9ucy50aXRsZSk7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRNZXNzYWdlKHRoaXMuJGVsKVxuICAgICAgICAgICAgdGhpcy5kaWFsb2cub3BlbigpO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIGlmKHRoaXMub25DbG9zZSlcbiAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlKClcbiAgICAgICAgfSxcbiAgICB9LCB7XG4gICAgICBzaG93OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IHRoaXMob3B0aW9ucyk7XG4gICAgICAgIHdpZGdldC5yZW5kZXIoKTtcbiAgICAgICAgd2lkZ2V0Lm9wZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRm9ybURpYWxvZyA9IFdvb2QuRGlhbG9nLmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1mb3JtLWRpYWxvZycsXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIHRpdGxlOiAnRGlhbG9nJyxcbiAgICAgICAgZm9ybU9wdGlvbnM6IHt9XG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6e1xuICAgICAgICBcImFjdGlvbjpzdWJtaXQ6Zm9ybVwiOiBcInN1Ym1pdFwiXG4gICAgICB9LFxuICAgICAgc3VibWl0OiBmdW5jdGlvbihmb3JtVmlldywgZGF0YSl7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMub25TdWJtaXQgKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25TdWJtaXQoZGF0YSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IG5ldyBXb29kLkZvcm0odGhpcy5vcHRpb25zLmZvcm1PcHRpb25zKTtcbiAgICAgICAgdGhpcy5kaWFsb2dDb250ZW50Q29udGFpbmVyLnNob3coZm9ybSk7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93LmtleXMpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiA0LzYvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuRHJvcGRvd24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1kcm9wZG93bicsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBpZD1cImJ1dHRvbi1jb250YWluZXJcIiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZHJvcGRvd24tYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiZHJvcGRvd24tY29udGFpbmVyXCIgY2xhc3M9XCJkcm9wZG93bi1jb250YWluZXIgPCUtZmxvYXRSaWdodENsYXNzJT5cIj48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgYnV0dG9uQ29udGFpbmVyICAgOiAnI2J1dHRvbi1jb250YWluZXInLFxuICAgICAgZHJvcGRvd25Db250YWluZXIgOiAnI2Ryb3Bkb3duLWNvbnRhaW5lcidcbiAgICB9LFxuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmV4cGFuZCcgOiAnb25Ecm9wZG93bkV4cGFuZCcsXG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmNvbGxhcHNlJyA6ICdvbkRyb3Bkb3duQ29sbGFwc2UnLFxuICAgICAgLy8gJ2FjdGlvbjpidXR0b246Y2xpY2snICAgICA6ICdmb3JrU2Vzc2lvbicsXG4gICAgICAvLyAnYWN0aW9uOm1lbnVidXR0b246Y2xpY2snIDogJ29uTWVudUJ1dHRvbkNsaWNrJyxcbiAgICAgIC8vICdhY3Rpb246bWVudWl0ZW06Y2xpY2snICAgOiAnb25NZW51SXRlbUNsaWNrJyxcbiAgICB9LFxuICAgIG9uRHJvcGRvd25Db2xsYXBzZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJCgnLmRyb3Bkb3duLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgIH0sXG4gICAgb25Ecm9wZG93bkV4cGFuZDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy4kKCcuZHJvcGRvd24tY29udGFpbmVyJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cbiAgICAgICQoJ2JvZHknKS5iaW5kKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgICB2YXIgb3V0RHJvcGRvd24gPSBzZWxmLiQoJyNkcm9wZG93bi1jb250YWluZXInKS5maW5kKHRhcmdldCkubGVuZ3RoID09IDA7XG4gICAgICAgIGlmKCBvdXREcm9wZG93biApIHtcbiAgICAgICAgICB2YXIgb3V0QnV0dG9uID0gc2VsZi4kKCcjYnV0dG9uLWNvbnRhaW5lcicpLmZpbmQodGFyZ2V0KS5sZW5ndGggPT0gMDtcbiAgICAgICAgICBpZiggb3V0QnV0dG9uICkge1xuICAgICAgICAgICAgc2VsZi5idXR0b25Db250YWluZXIuY3VycmVudFZpZXcubW91c2VEb3duKGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYub25Ecm9wZG93bkNvbGxhcHNlKCk7XG4gICAgICAgICAgJCggdGhpcyApLnVuYmluZChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgZmxvYXRSaWdodDogZmFsc2UsXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvbkJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAkKCdib2R5JykudW5iaW5kKCdjbGljaycpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBidXR0b24gPSBuZXcgV29vZC5Ecm9wZG93bkJ1dHRvbihcbiAgICAgICAgdGhpcy5vcHRpb25zLmJ1dHRvbk9wdGlvbnNcbiAgICAgICk7XG4gICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5zaG93KGJ1dHRvbik7XG5cbiAgICAgIGlmKCB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcgKXtcbiAgICAgICAgdmFyIGNvbnRlbnRWaWV3ID0gbmV3IHRoaXMub3B0aW9ucy5jb250ZW50VmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29udGVudE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcm9wZG93bkNvbnRhaW5lci5zaG93KGNvbnRlbnRWaWV3KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIGZsb2F0UmlnaHRDbGFzczogdGhpcy5vcHRpb25zLmZsb2F0UmlnaHQgPyAnZmxvYXRSaWdodCcgOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLklucHV0TGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBjaGlsZEV2ZW50czoge1xuICAgICAgXCJhY3Rpb246aW5wdXQ6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgIH0sXG4gICAgb25JbnB1dENoYW5nZTogZnVuY3Rpb24oaW5wdXRWaWV3LCB2YWxpZCl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dHM6Y2hhbmdlJywgIXRoaXMuZXJyb3IoKSk7XG4gICAgfSxcbiAgICBjaGlsZFZpZXc6IFdvb2QuSW5wdXQsXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgaWQgPSBjaGlsZC5nZXQoJ2lkJyk7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5nZXQoaWQpIDogb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGRhdGFbY2hpbGRWaWV3LmlkXSA9IGNoaWxkVmlldy5nZXRWYWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgY2hpbGRWaWV3LmVycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWxpZCA9IHRydWU7XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgdmFyIGNoaWxkVmFsaWQgPSBjaGlsZFZpZXcudmFsaWRhdGUoKTtcbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiBjaGlsZFZhbGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5Gb3JtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnZm9ybScsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGZvcm0nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImlucHV0LWxpc3QtY29udGFpbmVyXCIgY2xhc3M9XCJpbnB1dC1saXN0XCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuc1wiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwic3VibWl0LWJ0blwiIGNsYXNzPVwic3VibWl0LWJ0blwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOiB7XG4gICAgICAgIGlucHV0TGlzdENvbnRhaW5lcjogJyNpbnB1dC1saXN0LWNvbnRhaW5lcicsXG4gICAgICAgIHN1Ym1pdEJ0bkNvbnRhaW5lcjogJyNzdWJtaXQtYnRuJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCI6IFwic3VibWl0Rm9ybVwiLFxuICAgICAgICBcImFjdGlvbjppbnB1dHM6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgICAgfSxcbiAgICAgIG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGlucHV0TGlzdFZpZXcsIHZhbGlkKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24uZGlzYWJsZSghdmFsaWQpO1xuICAgICAgfSxcbiAgICAgIG9uRm9ybVN1Ym1pdDogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zdWJtaXRGb3JtKCk7XG4gICAgICB9LFxuICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmdldERhdGEoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmVycm9yKCk7XG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy52YWxpZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy52YWxpZGF0ZSgpICl7XG4gICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIGlucHV0czogW10sXG4gICAgICAgIHN1Ym1pdEJ1dHRvbjoge1xuICAgICAgICAgIGxhYmVsOiAnU3VibWl0J1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaW5wdXRMaXN0ID0gbmV3IFdvb2QuSW5wdXRMaXN0KHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5vcHRpb25zLm1vZGVsLFxuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pbnB1dHMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5zaG93KGlucHV0TGlzdCk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24ubGFiZWwsXG4gICAgICAgICAgICBkaXNhYmxlZDogISF0aGlzLmVycm9yKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICB9LFxuICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vblBvc3QoKTtcbiAgICAgIH0sXG4gICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uU3VjY2VzcygpO1xuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uRXJyb3IoKTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMjYvMTUuXG4gKi9cbiAoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkljb24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnZmEnOiAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLTwlLWljb24lPiBjb2xvci08JS1jb2xvciU+XCI+PC9pPicsXG4gICAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBjb2xvci08JS1jb2xvciU+XCI+PCUtaWNvbiU+PC9pPidcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6aWNvbicsXG4gICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgICAgaWNvbjogJ2NpcmNsZS10aGluJyxcbiAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgdG9vbHRpcDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWljb24nLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgaWNvblRlbXBsYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0aGlzLmljb25UZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmljb25DbGFzc10pKG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbihzZXRPYmope1xuICAgICAgICAgIF8uZXh0ZW5kKHRoaXMub3B0aW9ucywgc2V0T2JqKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBpY29uVGVtcGxhdGU6IHRoaXMuaWNvblRlbXBsYXRlKHRoaXMub3B0aW9ucylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5JY29uQnV0dG9uID0gV29vZC5JY29uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1pY29uJyxcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICdtb3VzZWRvd24nOiAnbW91c2VEb3duJyxcbiAgICAgICAgJ21vdXNlbGVhdmUnOidtb3VzZU91dCcsXG4gICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgIH0sXG4gICAgICByZWdpb25zOntcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyOiAnI3JpcHBsZS1jb250YWluZXInLFxuICAgICAgICB0b29sdGlwQ29udGFpbmVyOiAnI3Rvb2x0aXAtY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnPGRpdiBpZD1cInRvb2x0aXAtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmNsaWNrKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCh0aGlzLm9wdGlvbnMuY2xpY2tFdmVudCwgZSk7XG4gICAgICB9LFxuICAgICAgZGlzYWJsZTogZnVuY3Rpb24oIGRpc2FibGVkICl7XG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2Rpc2FibGVkJywgZGlzYWJsZWQgKTtcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgaWYoIHRoaXMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcC5mb2N1c0luKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzT3V0KCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlKHRoaXMub3B0aW9ucy5kaXNhYmxlZCk7XG4gICAgICB9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZURvd24oKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciByaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMudG9vbHRpcCApe1xuICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vcHRpb25zLmRpc2FibGVkID8gJ0Rpc2FibGVkJyA6IHRoaXMub3B0aW9ucy50b29sdGlwO1xuICAgICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBXb29kLlRvb2x0aXAoe1xuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRhaW5lci5zaG93KHRoaXMudG9vbHRpcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkNoZWNrYm94ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1jaGVja2JveCcsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6Y2hlY2tib3hcIjogXCJjbGlja0NoZWNrYm94XCIsXG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6e1xuICAgICAgICBib3hJY29uVmlldzogV29vZC5JY29uQnV0dG9uLFxuICAgICAgICBib3hJY29uT3B0aW9uczp7XG4gICAgICAgICAgaWNvbjogJ3NxdWFyZS1vJyxcbiAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6Y2hlY2tib3gnXG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlLFxuICAgICAgICBjaGVja0ljb25WaWV3OiBXb29kLkljb24sXG4gICAgICAgIGNoZWNrSWNvbk9wdGlvbnM6e1xuICAgICAgICAgIGljb246ICdjaGVjay1zcXVhcmUnLFxuICAgICAgICAgIGNvbG9yOiAnYmx1ZSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIGNoZWNrQ29udGFpbmVyOiAnI2NoZWNrLWNvbnRhaW5lcicsXG4gICAgICAgIGJveENvbnRhaW5lcjogJyNib3gtY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIHRhZ05hbWU6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBjbGFzcz1cImNoZWNrLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImNoZWNrLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYm94LXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImJveC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgY2xpY2tDaGVja2JveDogZnVuY3Rpb24oY2hpbGQsIGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmKCB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJykgKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJywgdGhpcy5vcHRpb25zLmNoZWNrZWQpO1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6Y2hlY2tib3hcIiwgdGhpcy5vcHRpb25zLmNoZWNrZWQpXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIC8vanF1ZXJ5IHJlY3Vyc2l2ZSBjb3B5XG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY2hlY2sgPSBuZXcgdGhpcy5vcHRpb25zLmNoZWNrSWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNoZWNrSWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jaGVja0NvbnRhaW5lci5zaG93KGNoZWNrKTtcblxuICAgICAgICB2YXIgYm94ID0gbmV3IHRoaXMub3B0aW9ucy5ib3hJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYm94SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ib3hDb250YWluZXIuc2hvdyhib3gpO1xuXG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnLCB0aGlzLm9wdGlvbnMuY2hlY2tlZCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5TZXBhcmF0b3IgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1zZXBhcmF0b3InLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgfSk7XG5cbiAgICBXb29kLkljb25MaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgICAgY2hpbGRWaWV3OiBXb29kLkljb24sXG4gICAgICB0YWdOYW1lOiAnd29vZC1pY29uLWxpc3QnLFxuICAgICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIHJldHVybiBpdFxuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgICBnZXRWaWV3OiBmdW5jdGlvbihpZCl7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgICAgaWYoIGlkID09IGNoaWxkVmlldy5pZClcbiAgICAgICAgICAgIHJldHVybiBjaGlsZFZpZXc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5pbnB1dHMgPSB7fTtcblxucmVxdWlyZSgnLi90ZXh0LmpzJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLklucHV0ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgaW5wdXQnLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXBsYWNlaG9sZGVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC10ZXh0XCI+PCUtZmxvYXRpbmdMYWJlbFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGludC10ZXh0XCI+PCUtaGludFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8aW5wdXQgdHlwZT1cIjwlLXR5cGUlPlwiIHZhbHVlPVwiPCUtdmFsdWUlPlwiIDwlLWF0dHJpYnV0ZVN0cmluZyU+PjwvaW5wdXQ+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20taW5hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJlcnJvci10ZXh0XCIgY2xhc3M9XCJlcnJvci10ZXh0XCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnY2hhbmdlIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5dXAgaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdrZXlkb3duIGlucHV0JzogJ3NldEZpbGxlZCcsXG4gICAgICAgICAgJ2ZvY3VzaW4gIGlucHV0JzogJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCBpbnB1dCc6ICdmb2N1c091dCdcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RmlsbGVkOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgaWYoIHRoaXMudmFsdWUgPT0gJycgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZXJyb3IoKTtcbiAgICAgICAgICBpZiggIWVycm9yICl7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmlucHV0OmNoYW5nZScsICFlcnJvcik7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgIGlmKCBlcnJvciApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2VycmVkJyk7XG4gICAgICAgICAgICB0aGlzLiQoJyNlcnJvci10ZXh0JykudGV4dChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuaXNSZXF1aXJlZCAmJiB2YWx1ZSA9PSAnJyApe1xuICAgICAgICAgICAgZXJyb3IgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgICAgfSBlbHNlIGlmKCB0aGlzLm9wdGlvbnMuZXJyb3IgKXtcbiAgICAgICAgICAgIGVycm9yID0gdGhpcy5vcHRpb25zLmVycm9yKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuICFlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzIDogW10sXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogJycsXG4gICAgICAgICAgaGludFRleHQ6ICcnLFxuICAgICAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgYXR0cmlidXRlU3RyaW5nID0gJC5tYXAodGhpcy5vcHRpb25zLmlucHV0QXR0cmlidXRlcyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCB2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBrZXkgKyAnPScgKyB2YWx1ZVxuICAgICAgICAgICAgfSkuam9pbignICcpXG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0VmFsdWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVTdHJpbmc6IGF0dHJpYnV0ZVN0cmluZ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkl0ZW0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1pdGVtJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS13cmFwcGVyXCI+JyArXG4gICAgICAgICc8JSBpZiAobGVmdEljb24pIHsgJT4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImxlZnQtaWNvbi1jb250YWluZXJcIiBjbGFzcz1cImxlZnQtaWNvblwiPjwvZGl2PicgK1xuICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIml0ZW0tYm9keVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmltYXJ5LXRleHRcIj48JT1wcmltYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNlY29uZGFyeS10ZXh0XCI+PCUtc2Vjb25kYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8JSBpZiAocmlnaHRJY29uKSB7ICU+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb24tY29udGFpbmVyXCIgY2xhc3M9XCJyaWdodC1pY29uXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBsZWZ0SWNvbkNvbnRhaW5lcjogJyNsZWZ0LWljb24tY29udGFpbmVyJyxcbiAgICAgIHJpZ2h0SWNvbkNvbnRhaW5lcjogJyNyaWdodC1pY29uLWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgbGVmdEljb246IGZhbHNlLFxuICAgICAgbGVmdEljb25WaWV3OiBXb29kLkF2YXRhcixcbiAgICAgIGxlZnRJY29uT3B0aW9uczoge30sXG4gICAgICBwcmltYXJ5VGV4dDogbnVsbCxcbiAgICAgIHNlY29uZGFyeVRleHQ6IG51bGwsXG4gICAgICByaWdodEljb246IGZhbHNlLFxuICAgICAgcmlnaHRJY29uVmlldzogbnVsbCxcbiAgICAgIHJpZ2h0SWNvbk9wdGlvbnM6IHt9XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGVmdEljb24pIHtcbiAgICAgICAgdmFyIGxlZnRJY29uID0gbmV3IHRoaXMub3B0aW9ucy5sZWZ0SWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmxlZnRJY29uT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmxlZnRJY29uQ29udGFpbmVyLnNob3cobGVmdEljb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJpZ2h0SWNvbikge1xuICAgICAgICB2YXIgcmlnaHRJY29uID0gbmV3IHRoaXMub3B0aW9ucy5yaWdodEljb25WaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5yaWdodEljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmlnaHRJY29uQ29udGFpbmVyLnNob3cocmlnaHRJY29uKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkl0ZW1CdXR0b24gPSBXb29kLkl0ZW0uZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOntcbiAgICAgIGNsYXNzOiAnYnV0dG9uJ1xuICAgIH0sXG4gICAgZXZlbnRzOntcbiAgICAgICdjbGljayc6ICdjbGljaydcbiAgICB9LFxuICAgIGRlZmF1bHRzOiBfLmV4dGVuZCh7fSwgV29vZC5JdGVtLnByb3RvdHlwZS5kZWZhdWx0cywge1xuICAgICAgY2xpY2tFdmVudDogJ2FjdGlvbjpjbGljazppdGVtJyxcbiAgICAgIGNsaWNrRXZlbnRBcmc6IG51bGxcbiAgICB9KSxcbiAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QodGhpcy5vcHRpb25zLmNsaWNrRXZlbnQsIHRoaXMub3B0aW9ucy5jbGlja0V2ZW50QXJnKTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLlN1YmhlYWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1zdWJoZWFkZXInLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzwlLXRleHQlPicgK1xuICAgICcnKSxcbiAgICBkZWZhdWx0czp7XG4gICAgICB0ZXh0OiAnJ1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLnRleHRcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuRGl2aWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1kaXZpZGVyJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJyksXG4gIH0pO1xuXG4gIFdvb2QuTGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1saXN0JyxcbiAgICBjaGlsZEV2ZW50czoge1xuICAgIH0sXG4gICAgY2hpbGRWaWV3OiBXb29kLkl0ZW0sXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgnaXRlbVZpZXcnKSB8fCBDaGlsZFZpZXdDbGFzcztcbiAgICAgIHZhciBvcHRpb25zID0gY2hpbGQuZ2V0KCdpdGVtT3B0aW9ucycpO1xuXG4gICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICB9KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAvLyByZXR1cm4gaXRcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMuaXRlbXMpO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24oV29vZCkge1xuICBXb29kLlJpcHBsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgcmlwcGxlLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgJycpLFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLiRyaXBwbGVzID0gW107XG4gICAgfSxcbiAgICBweXRoYWdvcmFzOiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhNYXRoLnBvdyhhLDIpK01hdGgucG93KGIsMiksMC41KTtcbiAgICB9LFxuICAgIGNyZWF0ZVJpcHBsZTogZnVuY3Rpb24oY2xhc3NOYW1lLCB4LCB5KXtcbiAgICAgIHZhciAkcmlwcGxlID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAkcmlwcGxlLmFkZENsYXNzKCdjaXJjbGUgcmlwcGxlICcgKyBjbGFzc05hbWUpO1xuICAgICAgdmFyIGggPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICAgIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICAgIGlmKCB4ID09IHVuZGVmaW5lZCApe1xuICAgICAgICB4ID0gdy8yO1xuICAgICAgICB5ID0gaC8yO1xuICAgICAgfVxuICAgICAgdmFyIHIgPSB0aGlzLnB5dGhhZ29yYXMoTWF0aC5tYXgoeCx3LXgpLCBNYXRoLm1heCh5LGgteSkpO1xuICAgICAgJHJpcHBsZS5jc3Moe1xuICAgICAgICAndG9wJzogeSAtIHIsXG4gICAgICAgICdsZWZ0JzogeCAtIHIsXG4gICAgICAgICdoZWlnaHQnOiAyKnIsXG4gICAgICAgICd3aWR0aCc6IDIqclxuICAgICAgfSk7XG4gICAgICByZXR1cm4gJHJpcHBsZTtcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCl7XG4gICAgICBpZiggIXRoaXMuJHB1bHNlICAmJiB0aGlzLiRyaXBwbGVzLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgdmFyICRwdWxzZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwdWxzaW5nJyk7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkcHVsc2UpO1xuICAgICAgICB0aGlzLiRwdWxzZSA9ICRwdWxzZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpe1xuICAgICAgaWYoIHRoaXMuJHB1bHNlICl7XG4gICAgICAgIHRoaXMuZmFkZSh0aGlzLiRwdWxzZSwgMCk7XG4gICAgICAgIHRoaXMuJHB1bHNlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VEb3duOiBmdW5jdGlvbih4LCB5KXtcbiAgICAgIHZhciAkcmlwcGxlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3Byb3BhZ2F0aW5nJywgeCwgeSk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJHJpcHBsZSk7XG4gICAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gICAgfSxcbiAgICBtb3VzZU91dDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciAkcmlwcGxlID0gdGhpcy4kcmlwcGxlcy5wb3AoKTtcbiAgICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICAgIHRoaXMuZmFkZSgkcmlwcGxlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgICAgaWYoICRyaXBwbGUgKXtcbiAgICAgICAgdGhpcy4kcmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3VzZURvd24oKTtcbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgc2VsZi5tb3VzZU91dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfSxcbiAgICBmYWRlOiBmdW5jdGlvbihyaXBwbGUsIGR1cmF0aW9uKXtcbiAgICAgIHZhciBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDogNTAwO1xuICAgICAgcmlwcGxlLmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJpcHBsZS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlNwaW5uZXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLXNwaW5uZXInLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld0JveD1cIjwlLXIrNSU+IDwlLXIrNSU+IDwlLWQrMTAlPiA8JS1kKzEwJT5cIiBoZWlnaHQ9XCI8JS1kJT5cIiB3aWR0aD1cIjwlLWQlPlwiPicgK1xuICAgICAgICAgICAgJzxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI8JS1kKzEwJT5cIiBjeT1cIjwlLWQrMTAlPlwiIHI9XCI8JS1yYWRpdXMlPlwiIHN0cm9rZS13aWR0aD1cIjwlLXN0cm9rZVdpZHRoJT5cIi8+JyArXG4gICAgICAgICAgJzwvc3ZnPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcmFkaXVzOiAyMCxcbiAgICAgICAgICBzdHJva2VXaWR0aDogMlxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmFkaXVzID0gdGhpcy5vcHRpb25zLnJhZGl1cztcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgcjogcmFkaXVzLFxuICAgICAgICAgICAgZDogcmFkaXVzICogMlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgb3ZlcmxheTogZnVuY3Rpb24gKCRlbCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IFdvb2QuU3Bpbm5lcihvcHRpb25zKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICAkb3ZlcmxheSA9IHdpZGdldC4kZWw7XG4gICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdvdmVybGF5Jyk7XG5cbiAgICAgICAgJGVsLmFwcGVuZCgkb3ZlcmxheSk7XG4gICAgICAgIHJldHVybiAkb3ZlcmxheTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuU3Bpbm5lck92ZXJsYXkgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3dvb2Qtc3Bpbm5lci1vdmVybGF5JyxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJvdmVybGF5IGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPicgK1xuICAgICAgICAgICAgJzxkaXYgaWQ9XCJzcGlubmVyLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAnY2xpY2snOiAncHJldmVudERlZmF1bHQnXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgICBzcGlubmVyQ29udGFpbmVyOiAnI3NwaW5uZXItY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgc3Bpbm5lciA9IG5ldyBXb29kLlNwaW5uZXIoKTtcbiAgICAgICAgICB0aGlzLnNwaW5uZXJDb250YWluZXIuc2hvdyhzcGlubmVyKVxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgc2hvdzogZnVuY3Rpb24gKCRlbCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgb3ZlcmxheSA9IG5ldyBXb29kLlNwaW5uZXJPdmVybGF5KG9wdGlvbnMpO1xuICAgICAgICBvdmVybGF5LnJlbmRlcigpO1xuXG4gICAgICAgICRlbC5hcHBlbmQob3ZlcmxheS4kZWwpO1xuICAgICAgICByZXR1cm4gb3ZlcmxheS4kZWw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUT0RPXG4gICAgLy8gV29vZC5JbmxpbmVMb2FkZXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgLy8gICAgIHRhZ05hbWU6ICdpbWcnLFxuICAgIC8vICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgLy8gICAgICAgICBzcmM6ICcvYXNzZXRzL2ltYWdlcy9sb2FkZXJzL2Jhci5naWYnLFxuICAgIC8vICAgICAgICAgc3R5bGU6ICdwb3NpdGlvbjphYnNvbHV0ZTttYXJnaW46YXV0bzt0b3A6MDtib3R0b206MDsnXG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnKVxuICAgIC8vIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAxNC8xMi8xNS5cbiAqIFRPRE8gcmVtb3ZlIGRhdGF0YWJsZXMgZGVwZW5kZW5jeVxuICovXG4gKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5UYWJsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3RhYmxlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd0YWJsZSB0YWJsZS1zdHJpcGVkJyxcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHN0eWxlOiAnbWluLXdpZHRoOjEwMCU7bWluLWhlaWdodDoxMDAlOydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dIZWFkZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPCUgaWYgKHNob3dGb290ZXIpIHsgJT4nICtcbiAgICAgICAgICAgICAgICAnPHRmb290PicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0aD48JT0gY29sdW1uLmRpc3BsYXkgJT48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwlIH0pOyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90Zm9vdD4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+J1xuICAgICAgICApLFxuICAgICAgICBjb2xsZWN0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gobW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbnM6IGZ1bmN0aW9uIChzY2hlbWEpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcblxuICAgICAgICAgICAgLy8gbG9hZCB0aGUgY29sdW1uIGluZm9ybWF0aW9uIGZyb20gdGhlIHNjaGVtYVxuICAgICAgICAgICAgaWYoc2NoZW1hKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2NoZW1hLmNvbHVtbnMsIGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLnZpc2libGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5mby5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmZvLmRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5EZWZzOiBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICAgICAgdmFyIGRlZnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2wucmVuZGVyZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gY29sLnJlbmRlcmVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YU5hbWUgPSBjb2wuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IGNvbC5yZW5kZXJlck9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2lkZ2V0ID0gc2VsZltyZW5kZXJlcl0oZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSwgcmVuZGVyZXJPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHdpZGdldCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YU5hbWUgKyAnXycgKyBtZXRhLnJvdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzW2lkXSA9IHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJyZW5kZXJlci1jb250YWluZXIgd2FpdGluZ1wiPjwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RXhwb3J0RGF0YTogZnVuY3Rpb24gKHJlY29yZCwgZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQuYXR0cmlidXRlc1tmaWVsZF07XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9jb2x1bW5zID0gc2VsZi5nZXRDb2x1bW5zKHNlbGYuY29sbGVjdGlvbi5tb2RlbC5wcm90b3R5cGUuc2NoZW1hKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbHVtbkZpbHRlcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRfY29sdW1ucyA9IF8uZmlsdGVyKGRlZmF1bHRfY29sdW1ucywgb3B0aW9ucy5jb2x1bW5GaWx0ZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgY29sbGVjdGlvbiBmb3IgdGhpcyBkYXRhdGFibGVcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzZWxmLnJlbmRlcmVycyA9IHt9O1xuICAgICAgICAgICAgc2VsZi5iYXNlU2VhcmNoID0gb3B0aW9ucy5zZWFyY2ggfHwgJyc7XG5cbiAgICAgICAgICAgIHNlbGYucm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQgfHwgNTk7XG4gICAgICAgICAgICBzZWxmLm1heFZpc2libGVSb3dzID0gb3B0aW9ucy5tYXhWaXNpYmxlUm93cyB8fCAxMDtcbiAgICAgICAgICAgIHNlbGYuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHNlbGYuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucyB8fCBkZWZhdWx0X2NvbHVtbnM7XG4gICAgICAgICAgICBzZWxmLmNvbHVtbkRlZnMgPSBvcHRpb25zLmNvbHVtbkRlZnMgfHwgc2VsZi5nZXRDb2x1bW5EZWZzKHNlbGYuY29sdW1ucyk7XG4gICAgICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSBvcHRpb25zLnNob3dIZWFkZXIgfHwgdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0Zvb3RlciA9IG9wdGlvbnMuc2hvd0Zvb3RlciB8fCBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuZGF0YVRhYmxlT3B0aW9ucyA9IG9wdGlvbnMuZGF0YVRhYmxlT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuXG5cbiAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNpemVIZWlnaHQoKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Sb3dSZW5kZXI6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkKHJvdykuZmluZCgnLnJlbmRlcmVyLWNvbnRhaW5lci53YWl0aW5nJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRob2xkZXIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICRob2xkZXIucmVtb3ZlQ2xhc3MoJ3dhaXRpbmcnKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IHNlbGYucmVuZGVyZXJzWyRob2xkZXIuYXR0cignaWQnKV07XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBqcXVlcnkgb2JqZWN0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlcmVyIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZW5kZXIgYSBiYWNrYm9uZSB2aWV3XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlci4kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZpcnR1YWwgbWV0aG9kXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbG9hZGVyIGZvciB0aGlzIHRhYmxlIHRvIGxvYWQgY29sbGVjdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsWTogJCh3aW5kb3cpLmhlaWdodCgpIC0gMzg1LFxuICAgICAgICAgICAgICAgIHNjcm9sbFg6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmZXJSZW5kZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOiAnPFwidGl0bGVcIj5aVGZydGlTJyxcbiAgICAgICAgICAgICAgICBzY3JvbGxDb2xsYXBzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgY29sdW1uRGVmczogdGhpcy5jb2x1bW5EZWZzLFxuICAgICAgICAgICAgICAgIHJvd0NhbGxiYWNrOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vblJvd1JlbmRlcihyb3csIGRhdGEsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlCdWZmZXI6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFqYXg6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaywgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgIHZhciAkb3ZlcmxheSA9IG5ldyBXb29kLlNwaW5uZXIub3ZlcmxheShzZWxmLiRlbCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb2xsZWN0aW9uLmZldGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZDogc2VsZi5jb2x1bW5zLm1hcChmdW5jdGlvbihjKXtyZXR1cm4gYy5kYXRhfSkuam9pbignLCcpLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soe2RhdGE6IHNlbGYuY29sbGVjdERhdGEoKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRhYmxlVG9vbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc1N3ZlBhdGg6ICcvYXNzZXRzL3N3Zi9jb3B5X2Nzdl94bHNfcGRmLnN3ZicsXG4gICAgICAgICAgICAgICAgICAgIGFCdXR0b25zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzRXh0ZW5kczogJ2NzdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvblRleHQ6ICdFeHBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25DbGFzczogJ2J0biBidG4tZGVmYXVsdCBidG4teHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuQ2VsbFJlbmRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb2x1bW4sIGRvbVJvdywgcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSBzZWxmLmNvbGxlY3Rpb24uYXQocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gc2VsZi5jb2x1bW5zW2NvbHVtbl0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RXhwb3J0RGF0YShyZWNvcmQsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdGhpcy4kZWwuRGF0YVRhYmxlKF8uZXh0ZW5kKG9wdGlvbnMsIHNlbGYuZGF0YVRhYmxlT3B0aW9ucykpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5zZWFyY2godGhpcy5iYXNlU2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZSA9IHNlbGYuJGVsLmNsb3Nlc3QoJy5kYXRhVGFibGVzX3dyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLm9uKCdzZWFyY2guZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6c2VhcmNoJywgc2VsZi50YWJsZS5zZWFyY2goKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0YWJsZSA9IHNlbGY7XG4gICAgICAgICAgICAgICAgc2VsZi4kZGF0YVRhYmxlLmZpbmQoJ2Rpdi50aXRsZScpLmFwcGVuZChzZWxmLnRpdGxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXNpemVIZWlnaHQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJyZXNpemVcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkb3ZlcmxheSA9IFdvb2QuU3Bpbm5lci5vdmVybGF5KHRoaXMuJGVsKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUuYWpheC5yZWxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzVG90YWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEhlaWdodDogZnVuY3Rpb24gKGhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlLmZpbmQoJy5kYXRhVGFibGVzX3Njcm9sbEJvZHknKS5jc3MoJ21heC1oZWlnaHQnLCBoZWlnaHQgKyBcInB4XCIpO1xuICAgICAgICB9LFxuICAgICAgICByZXNpemVIZWlnaHQgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5zZXRIZWlnaHQoJCh3aW5kb3cpLmhlaWdodCgpIC0gNTcwKVxuICAgICAgICB9LFxuICAgICAgICB1bmZpbHRlcmVkUm93Q291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpbmZvID0gdGhpcy50YWJsZS5wYWdlLmluZm8oKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvLnJlY29yZHNEaXNwbGF5O1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zLFxuICAgICAgICAgICAgICAgIHNob3dIZWFkZXI6IHRoaXMuc2hvd0hlYWRlcixcbiAgICAgICAgICAgICAgICBzaG93Rm9vdGVyOiB0aGlzLnNob3dGb290ZXJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuVG9vbGJhciA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogXCJ3b29kLXRvb2xiYXJcIixcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnK1xuICAgICAgICAnPGRpdiBpZD1cImxlZnQtaWNvbnMtd3JhcHBlclwiIGNsYXNzPVwibGVmdC1pY29ucy13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48JS10aXRsZSU+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGlkPVwicmlnaHQtaWNvbnMtd3JhcHBlclwiIGNsYXNzPVwicmlnaHQtaWNvbnMtd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIGxlZnRJY29uc0NvbnRhaW5lcjogXCIjbGVmdC1pY29ucy13cmFwcGVyXCIsXG4gICAgICAgIHJpZ2h0SWNvbnNDb250YWluZXI6IFwiI3JpZ2h0LWljb25zLXdyYXBwZXJcIixcbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czoge1xuICAgICAgICAnYWN0aW9uOmNsaWNrOmljb24nOiBcIm9uQ2xpY2tJY29uXCIsXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayAudGl0bGUnOiAnb25DbGlja1RpdGxlJyxcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrSWNvbjogZnVuY3Rpb24oaWNvblZpZXcpe1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoICdhY3Rpb246Y2xpY2s6aWNvbicsIGljb25WaWV3ICk7XG4gICAgICB9LFxuICAgICAgb25DbGlja1RpdGxlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpjbGljazp0aXRsZScpO1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGxlZnRJY29uczogW10sXG4gICAgICAgIHJpZ2h0SWNvbnM6IFtdLFxuICAgICAgICB0aXRsZTogJ1Rvb2xiYXInLFxuICAgICAgICBjb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ3JleS1saWdodCcsXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdldEljb246IGZ1bmN0aW9uKGljb25JZCl7XG4gICAgICAgIHZhciBhID0gdGhpcy5sZWZ0SWNvbnNDb250YWluZXIuY3VycmVudFZpZXcuZ2V0VmlldyhpY29uSWQpO1xuICAgICAgICB2YXIgYiA9IHRoaXMucmlnaHRJY29uc0NvbnRhaW5lci5jdXJyZW50Vmlldy5nZXRWaWV3KGljb25JZCk7XG4gICAgICAgIHJldHVybiBhIHx8IGI7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NvbG9yLScrdGhpcy5vcHRpb25zLmNvbG9yKTtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2JhY2tncm91bmRDb2xvci0nK3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpO1xuXG4gICAgICAgIHZhciBsZWZ0SWNvbkxpc3QgPSBuZXcgV29vZC5JY29uTGlzdCh7XG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLmxlZnRJY29ucylcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubGVmdEljb25zQ29udGFpbmVyLnNob3cobGVmdEljb25MaXN0KTtcblxuICAgICAgICB2YXIgcmlnaHRJY29uTGlzdCA9IG5ldyBXb29kLkljb25MaXN0KHtcbiAgICAgICAgICBjb2xsZWN0aW9uOiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMucmlnaHRJY29ucylcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmlnaHRJY29uc0NvbnRhaW5lci5zaG93KHJpZ2h0SWNvbkxpc3QpO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMy8xMS8xNS5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gIFdvb2QuVG9vbHRpcCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIGNsYXNzOiAnd29vZCB0b29sdGlwLWFuY2hvci13cmFwcGVyJyxcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLWFuY2hvclwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtd3JhcHBlclwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwid29vZC10b29sdGlwXCI+PCUtIHRleHQgJT48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICcnKSxcbiAgICBkZWZhdWx0czp7XG4gICAgICB0ZXh0OiAnJ1xuICAgIH0sXG4gICAgZm9jdXNJbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgZm9jdXNPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfSxcbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDQvNS8xNi5cbiAqL1xuKGZ1bmN0aW9uKFdvb2QpIHtcbiAgV29vZC5CcmFuY2ggPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtYnJhbmNoXCIsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBpZD1cInRyZWUtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgJycpLFxuICAgIGNoaWxkRXZlbnRzOntcbiAgICB9LFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIHRyZWVDb250YWluZXI6IFwiI3RyZWUtY29udGFpbmVyXCIsXG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnRyZWUgPSB0aGlzLm9wdGlvbnMudHJlZVxuICAgIH0sXG4gICAgZ2V0VHJlZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuZ2V0VHJlZSh0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgYnViYmxlQ2hpbGRFdmVudDogZnVuY3Rpb24oY2hpbGRFdmVudE5hbWUpe1xuICAgICAgdGhpcy5jaGlsZEV2ZW50c1tjaGlsZEV2ZW50TmFtZV0gPSBmdW5jdGlvbihjaGlsZCwgYXJncyl7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZChjaGlsZEV2ZW50TmFtZSwgYXJncylcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0cmVlID0gdGhpcy5nZXRUcmVlKCk7XG4gICAgICB0aGlzLnRyZWVDb250YWluZXIuc2hvdyh0cmVlKTtcblxuICAgICAgZm9yKCBjaGlsZEV2ZW50TmFtZSBpbiB0cmVlLmNoaWxkRXZlbnRzICl7XG4gICAgICAgIHRoaXMuYnViYmxlQ2hpbGRFdmVudChjaGlsZEV2ZW50TmFtZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkJyYW5jaGVzID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC1icmFuY2hlc1wiLFxuICAgIGNoaWxkVmlldzogV29vZC5CcmFuY2gsXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBjaGlsZC5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIHRyZWU6IHRoaXMudHJlZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgQ2hpbGRWaWV3Q2xhc3Mob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMudHJlZSA9IHRoaXMub3B0aW9ucy50cmVlO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24oY2hpbGQsIGluZGV4LCBjb2xsZWN0aW9uKXtcbiAgICAgIHJldHVybiB0aGlzLnRyZWUuZmlsdGVyKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbilcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuVHJlZSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC10cmVlXCIsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRyZWUtd3JhcHBlclwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInR3aWdcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJpdGVtLWNvbnRhaW5lclwiIGNsYXNzPVwiaXRlbS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2hpbGRyZW4tY29udGFpbmVyXCIgY2xhc3M9XCJjaGlsZHJlbi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgaXRlbUNvbnRhaW5lcjogXCIjaXRlbS1jb250YWluZXJcIixcbiAgICAgIGNoaWxkcmVuQ29udGFpbmVyOiBcIiNjaGlsZHJlbi1jb250YWluZXJcIixcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGl0ZW1WaWV3OiBXb29kLkl0ZW0sXG4gICAgICBpdGVtT3B0aW9uczoge30sXG4gICAgICBjaGlsZHJlbjogW11cbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgsIGNvbGxlY3Rpb24pe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBnZXRDb2xsZWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5jaGlsZHJlbik7XG4gICAgfSxcbiAgICBnZXRJdGVtOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLm9wdGlvbnMuaXRlbVZpZXcodGhpcy5vcHRpb25zLml0ZW1PcHRpb25zKTtcbiAgICB9LFxuICAgIGdldFRyZWU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgcmV0dXJuIG5ldyBXb29kLlRyZWUob3B0aW9ucyk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSgpO1xuICAgICAgdGhpcy5pdGVtQ29udGFpbmVyLnNob3coaXRlbSk7XG5cbiAgICAgIHRoaXMuY29sbGVjdGlvbiA9IHRoaXMuZ2V0Q29sbGVjdGlvbigpO1xuICAgICAgaWYoIHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPiAwICl7XG4gICAgICAgIHZhciBicmFuY2hlcyA9IG5ldyBXb29kLkJyYW5jaGVzKHtcbiAgICAgICAgICB0cmVlOiB0aGlzLFxuICAgICAgICAgIGNvbGxlY3Rpb24gOiB0aGlzLmNvbGxlY3Rpb25cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5Db250YWluZXIuc2hvdyhicmFuY2hlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5BcmJvcmlzdCA9IFdvb2QuVHJlZS5leHRlbmQoe1xuICAgIGZpbHRlcjogZnVuY3Rpb24oY2hpbGQsIGluZGV4LCBjb2xsZWN0aW9uKXtcbiAgICAgIHZhciBtb2RlbCA9IHRoaXMub3B0aW9ucy5jb2xsZWN0aW9uLmdldCh0aGlzLm9wdGlvbnMucm9vdCk7XG4gICAgICByZXR1cm4gY2hpbGQuZ2V0KCdwYXJlbnQnKSA9PSBtb2RlbC5nZXQoJ2lkJyk7XG4gICAgfSxcbiAgICBnZXRDb2xsZWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIH0sXG4gICAgZ2V0SXRlbTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBtb2RlbCA9IHRoaXMub3B0aW9ucy5jb2xsZWN0aW9uLmdldCh0aGlzLm9wdGlvbnMucm9vdClcbiAgICAgIHJldHVybiBuZXcgV29vZC5JdGVtKHtcbiAgICAgICAgcHJpbWFyeVRleHQ6IG1vZGVsLmdldCgnaWQnKSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRUcmVlOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHJldHVybiBuZXcgV29vZC5BcmJvcmlzdCh7XG4gICAgICAgIHJvb3Q6IG9wdGlvbnMuaWQsXG4gICAgICAgIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvblxuICAgICAgfSk7XG4gICAgfSxcbiAgfSk7XG5cblxufSkod2luZG93Lldvb2QpO1xuIl19
