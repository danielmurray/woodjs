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
        console.log(valid)
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
        console.log('hello world')
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
        console.log('hello world')
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
        setAttr: function(setObj){
          _.extend(this.options, setObj);
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
          this.options.checked = false;
        }else{
          this.options.checked = true;
        }

        this.$el.attr('checked', this.options.checked);
        this.triggerMethod("action:click:checkbox", this.options.checked)
      },
      defaults:{
        checked: false,
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

        this.$el.attr('checked', this.options.checked);
      },
    });

    Wood.Separator = Marionette.ItemView.extend({
      tagName: 'wood-separator',
      template: _.template('')
    });
    //
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
            '<div class="primary-text"><%-primaryText%></div>' +
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvY2FyZC5qcyIsInNyYy9qcy9kaWFsb2cuanMiLCJzcmMvanMvZHJvcGRvd24uanMiLCJzcmMvanMvZm9ybS5qcyIsInNyYy9qcy9pY29uLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiLCJzcmMvanMvaXRlbS5qcyIsInNyYy9qcy9saXN0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy9zcGlubmVyLmpzIiwic3JjL2pzL3RhYmxlLmpzIiwic3JjL2pzL3Rvb2xiYXIuanMiLCJzcmMvanMvdG9vbHRpcC5qcyIsInNyYy9qcy90cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuV29vZCA9IHt9O1xuXG4vLyBpbmNsdWRlIGJhc2UgY29tbW9uIHdpZGdldHNcbnJlcXVpcmUoJy4vaW5wdXRzL2FsbCcpO1xuXG5yZXF1aXJlKCcuL2F2YXRhcicpO1xucmVxdWlyZSgnLi9idXR0b24nKTtcbnJlcXVpcmUoJy4vY2FyZCcpO1xucmVxdWlyZSgnLi9kaWFsb2cnKTtcbnJlcXVpcmUoJy4vZHJvcGRvd24nKTtcbnJlcXVpcmUoJy4vZm9ybScpO1xucmVxdWlyZSgnLi9pY29uJyk7XG5yZXF1aXJlKCcuL2l0ZW0nKTtcbnJlcXVpcmUoJy4vbGlzdCcpO1xucmVxdWlyZSgnLi9zcGlubmVyJyk7XG5yZXF1aXJlKCcuL3JpcHBsZScpO1xucmVxdWlyZSgnLi90YWJsZScpO1xucmVxdWlyZSgnLi90b29sdGlwJyk7XG5yZXF1aXJlKCcuL3Rvb2xiYXInKTtcbnJlcXVpcmUoJy4vdHJlZScpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkF2YXRhciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwid29vZC1hdmF0YXJcIixcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFwZSA8JS1zaGFwZSU+IGNvbG9yLTwlLWNvbG9yJT4gYmFja2dyb3VuZENvbG9yLTwlLWJhY2tncm91bmRDb2xvciU+XCI+JyArXG4gICAgICAgICAgICAnPCUgaWYgKGltYWdlKSB7ICU+JyArXG4gICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiaW1nXCIgc3JjPVwiPCUtaW1hZ2UlPlwiPjwvaW1nPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGljb24pIHslPicgK1xuICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJpY29uIGZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGxldHRlcikgeyU+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxldHRlclwiPjwlLWxldHRlciU+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGltYWdlOiBudWxsLFxuICAgICAgICAgIGljb246IG51bGwsXG4gICAgICAgICAgbGV0dGVyOiBudWxsLFxuICAgICAgICAgIHNoYXBlOiBudWxsLFxuICAgICAgICAgIGNvbG9yOiAnaW5oZXJpdCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnaW5oZXJpdCdcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIHZhciBMYWJlbCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtbGFiZWwnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImljb24tY29udGFpbmVyXCIgY2xhc3M9XCJpY29uLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidGV4dC13cmFwcGVyXCI+PCUtdGV4dCU+PC9zcGFuPicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczoge1xuICAgICAgICBpY29uQ29udGFpbmVyOiAnI2ljb24tY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgaWNvbkNsYXNzOiAnZmEnLFxuICAgICAgICB0ZXh0OiAnQnV0dG9uJyxcbiAgICAgICAgY29sb3I6ICdpbmhlcml0J1xuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICggdGhpcy5vcHRpb25zLmljb24gKXtcbiAgICAgICAgICB2YXIgaWNvblZpZXcgPSBuZXcgV29vZC5JY29uKHtcbiAgICAgICAgICAgIGljb246IHRoaXMub3B0aW9ucy5pY29uLFxuICAgICAgICAgICAgaWNvbkNsYXNzOiB0aGlzLm9wdGlvbnMuaWNvbkNsYXNzLFxuICAgICAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5jb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuaWNvbkNvbnRhaW5lci5zaG93KGljb25WaWV3KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdmFyIEJ1dHRvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24nLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIiBjbGFzcz1cInJpcHBsZS1jb250YWluZXIgYmFja2dyb3VuZENvbG9yLTwlLWJhY2tncm91bmRDb2xvciU+XCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJsYWJlbC1jb250YWluZXJcIiBjbGFzcz1cImxhYmVsLXdyYXBwZXIgY29sb3ItPCUtY29sb3IlPlwiPjwlLWxhYmVsJT48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOntcbiAgICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgICAgbGFiZWxDb250YWluZXI6ICcjbGFiZWwtY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdmb2N1c2luJzogICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAgICdtb3VzZWRvd24nOidtb3VzZURvd24nLFxuICAgICAgICAgICdtb3VzZW91dCc6ICdtb3VzZU91dCcsXG4gICAgICAgICAgJ2NsaWNrJzogICAgJ2NsaWNrJ1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5mb2N1c091dCgpXG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIHggPSBlLnBhZ2VYIC0gdGhpcy4kZWwub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgICB2YXIgeSA9IGUucGFnZVkgLSB0aGlzLiRlbC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZURvd24oeCwgeSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlT3V0OiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRvRWxlbWVudCk7XG4gICAgICAgICAgaWYoIHRhcmdldC5jbG9zZXN0KHRoaXMuJGVsKS5sZW5ndGggPT0wICl7XG4gICAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgICByaXBwbGUubW91c2VPdXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5jbGljaygpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZChcImFjdGlvbjpjbGljazpidXR0b25cIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgbGFiZWw6ICdCdXR0b24nLFxuICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3NlY29uZGFyeScsXG4gICAgICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKCBkaXNhYmxlZCApe1xuICAgICAgICAgIGlmKCAhdGhpcy5fc2F2aW5nICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5hdHRyKCdkaXNhYmxlZCcsIGRpc2FibGVkICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKHRoaXMub3B0aW9ucy5kaXNhYmxlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciByaXBwbGUgPSBuZXcgV29vZC5SaXBwbGUoKTtcbiAgICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHJpcHBsZSk7XG5cbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgaWNvbjogdGhpcy5vcHRpb25zLmljb24sXG4gICAgICAgICAgICBpY29uQ2xhc3M6IHRoaXMub3B0aW9ucy5pY29uQ2xhc3MsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmNvbG9yLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0cnVlKTtcbiAgICAgICAgICB0aGlzLl9zYXZpbmcgPSB0cnVlO1xuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBMYWJlbCh7XG4gICAgICAgICAgICBpY29uOiB7XG4gICAgICAgICAgICAgIHZpZXc6IFdvb2QuU3Bpbm5lcixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHJhZGl1czogMTIsXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDYsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMubGFiZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxhYmVsQ29udGFpbmVyLnNob3cobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKGZhbHNlKTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLl9zYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRpc2FibGUoZmFsc2UpO1xuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBMYWJlbCh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMubGFiZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxhYmVsQ29udGFpbmVyLnNob3cobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBzYXZlQ2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcy5zdGF0ZUNoYW5nZSgnc2F2aW5nJyk7XG4gICAgICAgICAgLy8gdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c2F2ZUJ1dHRvbkNsaWNrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlQ2hhbmdlOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgICAgLy8gaWYoIHRoaXMuc3RhdGUgIT0gc3RhdGUpe1xuICAgICAgICAgIC8vICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIC8vICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuRmxhdEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uIGZsYXQnLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5SYWlzZWRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbiByYWlzZWQnLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5Ecm9wZG93bkJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uIGRyb3Bkb3duJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCIgY2xhc3M9XCJyaXBwbGUtY29udGFpbmVyIGJhY2tncm91bmRDb2xvci08JS1iYWNrZ3JvdW5kQ29sb3IlPlwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cImxhYmVsLWNvbnRhaW5lclwiIGNsYXNzPVwibGFiZWwtd3JhcHBlciBjb2xvci08JS1jb2xvciU+XCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cImNhcmV0LWNvbnRhaW5lclwiIGNsYXNzPVwiY2FyZXQtd3JhcHBlciBjb2xvci08JS1jb2xvciU+XCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICB0b2dnbGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgICAgICAgdGhpcy5yZW5kZXJDYXJldCh0aGlzLmV4cGFuZGVkKTtcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7fSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7fSxcbiAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKCB0aGlzLmV4cGFuZGVkICl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmRyb3Bkb3duOmNvbGxhcHNlJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIEJ1dHRvbi5wcm90b3R5cGUubW91c2VEb3duLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246ZHJvcGRvd246ZXhwYW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7fSxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbihlKXt9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIEJ1dHRvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIEJ1dHRvbi5wcm90b3R5cGUub25SZW5kZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGRSZWdpb24oXCJjYXJldENvbnRhaW5lclwiLCBcIiNjYXJldC1jb250YWluZXJcIik7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FyZXQodGhpcy5leHBhbmRlZCk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyQ2FyZXQ6IGZ1bmN0aW9uKGV4cGFuZGVkKXtcbiAgICAgICAgdmFyIGljb24gPSBleHBhbmRlZCA/ICdhbmdsZS11cCcgOiAnYW5nbGUtZG93bic7XG4gICAgICAgIHZhciBjYXJldCA9IG5ldyBXb29kLkljb24oe1xuICAgICAgICAgIGljb246IGljb24sXG4gICAgICAgICAgY29sb3I6IHRoaXMub3B0aW9ucy5jb2xvclxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYXJldENvbnRhaW5lci5zaG93KGNhcmV0KTtcbiAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uKFdvb2QpIHtcbiAgV29vZC5DYXJkID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWNhcmRcIixcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj4nICtcbiAgICAgICc8ZGl2IGlkPVwiYXZhdGFyLXdyYXBwZXJcIiBjbGFzcz1cImF2YXRhci13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PCUtcHJpbWFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgaWQ9XCJjYXJkLWNvbnRlbnRcIiBjbGFzcz1cImNhcmQtY29udGVudFwiPjwvZGl2PicgK1xuICAgICAgJzxkaXYgaWQ9XCJjYXJkLWZvb3RlclwiIGNsYXNzPVwiY2FyZC1mb290ZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBjYXJkSGVhZGVyOiBcIiNjYXJkLWhlYWRlclwiLFxuICAgICAgYXZhdGFyOiBcIiNhdmF0YXItd3JhcHBlclwiLFxuICAgICAgY2FyZENvbnRlbnQ6IFwiI2NhcmQtY29udGVudFwiLFxuICAgICAgY2FyZEZvb3RlcjogXCIjY2FyZC1mb290ZXJcIixcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIHByaW1hcnlUZXh0OiAnQ2FyZCcsXG4gICAgICBoZWFkZXJWaWV3OiBudWxsLFxuICAgICAgaGVhZGVyT3B0aW9uczoge1xuICAgICAgICBpY29uOiAncXVlc3Rpb24nLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZSdcbiAgICAgIH0sXG4gICAgICBjb250ZW50VmlldzogbnVsbCxcbiAgICAgIGNvbnRlbnRPcHRpb25zOiB7fSxcbiAgICAgIGZvb3RlclZpZXc6IG51bGwsXG4gICAgICBmb290ZXJPcHRpb25zOiB7fVxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXZhdGFyID0gbmV3IFdvb2QuQXZhdGFyKHRoaXMub3B0aW9ucy5oZWFkZXJPcHRpb25zKTtcbiAgICAgIHRoaXMuYXZhdGFyLnNob3coYXZhdGFyKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250ZW50Vmlldykge1xuICAgICAgICB2YXIgY29udGVudCA9IG5ldyB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnRPcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2FyZENvbnRlbnQuc2hvdyhjb250ZW50KTtcbiAgICAgIH1cblxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDE0LzEyLzE1LlxuICogVE9ETyByZW1vdmUgYm9vdHN0cmFwIGRlcGVuZGVuY3lcbiAqL1xuKGZ1bmN0aW9uIChrZXlzKSB7XG4gICAgV29vZC5EaWFsb2cgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3dvb2QtZGlhbG9nJyxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycgK1xuICAgICAgICAgICAgJzxkaXYgaWQ9XCJkaWFsb2ctY29udGVudC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICByZWdpb25zOiB7XG4gICAgICAgICAgICBkaWFsb2dDb250ZW50Q29udGFpbmVyOiAnI2RpYWxvZy1jb250ZW50LWNvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICB0aXRsZTogJ0RpYWxvZydcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgdGhpcy5kaWFsb2cgPSBuZXcgQm9vdHN0cmFwRGlhbG9nKHtcbiAgICAgICAgICAgICAgdHlwZTogQm9vdHN0cmFwRGlhbG9nLlRZUEVfUFJJTUFSWSxcbiAgICAgICAgICAgICAgc2l6ZTogQm9vdHN0cmFwRGlhbG9nLlNJWkVfTk9STUFMLFxuICAgICAgICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIHZhciBkaWFsb2dDb250ZW50ID0gdGhpcy5vcHRpb25zLmRpYWxvZ0NvbnRlbnQ7XG4gICAgICAgICAgLy8gaWYoIGRpYWxvZ0NvbnRlbnQgKXt9XG4gICAgICAgICAgLy8gICB0aGlzLmRpYWxvZ0NvbnRlbnRDb250YWluZXIuc2hvdyhuZXcgZGlhbG9nQ29udGVudC52aWV3KGRpYWxvZ0NvbnRlbnQub3B0aW9ucykpO1xuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cuc2V0VGl0bGUodGhpcy5vcHRpb25zLnRpdGxlKTtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLnNldE1lc3NhZ2UodGhpcy4kZWwpXG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgaWYodGhpcy5vbkNsb3NlKVxuICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKVxuICAgICAgICB9LFxuICAgIH0sIHtcbiAgICAgIHNob3c6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB3aWRnZXQgPSBuZXcgdGhpcyhvcHRpb25zKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICB3aWRnZXQub3BlbigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5Gb3JtRGlhbG9nID0gV29vZC5EaWFsb2cuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWZvcm0tZGlhbG9nJyxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgdGl0bGU6ICdEaWFsb2cnLFxuICAgICAgICBmb3JtT3B0aW9uczoge31cbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czp7XG4gICAgICAgIFwiYWN0aW9uOnN1Ym1pdDpmb3JtXCI6IFwic3VibWl0XCJcbiAgICAgIH0sXG4gICAgICBzdWJtaXQ6IGZ1bmN0aW9uKGZvcm1WaWV3LCBkYXRhKXtcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5vblN1Ym1pdCApe1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vblN1Ym1pdChkYXRhKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnN1Ym1pdDpmb3JtJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IG5ldyBXb29kLkZvcm0odGhpcy5vcHRpb25zLmZvcm1PcHRpb25zKTtcbiAgICAgICAgdGhpcy5kaWFsb2dDb250ZW50Q29udGFpbmVyLnNob3coZm9ybSk7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93LmtleXMpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiA0LzYvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuRHJvcGRvd24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1kcm9wZG93bicsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBpZD1cImJ1dHRvbi1jb250YWluZXJcIiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZHJvcGRvd24tYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiZHJvcGRvd24tY29udGFpbmVyXCIgY2xhc3M9XCJkcm9wZG93bi1jb250YWluZXIgPCUtZmxvYXRSaWdodENsYXNzJT5cIj48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgYnV0dG9uQ29udGFpbmVyICAgOiAnI2J1dHRvbi1jb250YWluZXInLFxuICAgICAgZHJvcGRvd25Db250YWluZXIgOiAnI2Ryb3Bkb3duLWNvbnRhaW5lcidcbiAgICB9LFxuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmV4cGFuZCcgOiAnb25Ecm9wZG93bkV4cGFuZCcsXG4gICAgICAnYWN0aW9uOmRyb3Bkb3duOmNvbGxhcHNlJyA6ICdvbkRyb3Bkb3duQ29sbGFwc2UnLFxuICAgICAgLy8gJ2FjdGlvbjpidXR0b246Y2xpY2snICAgICA6ICdmb3JrU2Vzc2lvbicsXG4gICAgICAvLyAnYWN0aW9uOm1lbnVidXR0b246Y2xpY2snIDogJ29uTWVudUJ1dHRvbkNsaWNrJyxcbiAgICAgIC8vICdhY3Rpb246bWVudWl0ZW06Y2xpY2snICAgOiAnb25NZW51SXRlbUNsaWNrJyxcbiAgICB9LFxuICAgIG9uRHJvcGRvd25Db2xsYXBzZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJCgnLmRyb3Bkb3duLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgIH0sXG4gICAgb25Ecm9wZG93bkV4cGFuZDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy4kKCcuZHJvcGRvd24tY29udGFpbmVyJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cbiAgICAgICQoJ2JvZHknKS5iaW5kKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgICB2YXIgb3V0RHJvcGRvd24gPSBzZWxmLiQoJyNkcm9wZG93bi1jb250YWluZXInKS5maW5kKHRhcmdldCkubGVuZ3RoID09IDA7XG4gICAgICAgIGlmKCBvdXREcm9wZG93biApIHtcbiAgICAgICAgICB2YXIgb3V0QnV0dG9uID0gc2VsZi4kKCcjYnV0dG9uLWNvbnRhaW5lcicpLmZpbmQodGFyZ2V0KS5sZW5ndGggPT0gMDtcbiAgICAgICAgICBpZiggb3V0QnV0dG9uICkge1xuICAgICAgICAgICAgc2VsZi5idXR0b25Db250YWluZXIuY3VycmVudFZpZXcubW91c2VEb3duKGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYub25Ecm9wZG93bkNvbGxhcHNlKCk7XG4gICAgICAgICAgJCggdGhpcyApLnVuYmluZChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgZmxvYXRSaWdodDogZmFsc2UsXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvbkJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAkKCdib2R5JykudW5iaW5kKCdjbGljaycpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBidXR0b24gPSBuZXcgV29vZC5Ecm9wZG93bkJ1dHRvbihcbiAgICAgICAgdGhpcy5vcHRpb25zLmJ1dHRvbk9wdGlvbnNcbiAgICAgICk7XG4gICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5zaG93KGJ1dHRvbik7XG5cbiAgICAgIGlmKCB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcgKXtcbiAgICAgICAgdmFyIGNvbnRlbnRWaWV3ID0gbmV3IHRoaXMub3B0aW9ucy5jb250ZW50VmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29udGVudE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcm9wZG93bkNvbnRhaW5lci5zaG93KGNvbnRlbnRWaWV3KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIGZsb2F0UmlnaHRDbGFzczogdGhpcy5vcHRpb25zLmZsb2F0UmlnaHQgPyAnZmxvYXRSaWdodCcgOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLklucHV0TGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBjaGlsZEV2ZW50czoge1xuICAgICAgXCJhY3Rpb246aW5wdXQ6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgIH0sXG4gICAgb25JbnB1dENoYW5nZTogZnVuY3Rpb24oaW5wdXRWaWV3LCB2YWxpZCl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dHM6Y2hhbmdlJywgIXRoaXMuZXJyb3IoKSk7XG4gICAgfSxcbiAgICBjaGlsZFZpZXc6IFdvb2QuSW5wdXQsXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgaWQgPSBjaGlsZC5nZXQoJ2lkJyk7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5nZXQoaWQpIDogJyc7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGRhdGFbY2hpbGRWaWV3LmlkXSA9IGNoaWxkVmlldy5nZXRWYWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgY2hpbGRWaWV3LmVycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWxpZCA9IHRydWU7XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgdmFyIGNoaWxkVmFsaWQgPSBjaGlsZFZpZXcudmFsaWRhdGUoKTtcbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiBjaGlsZFZhbGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5Gb3JtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnZm9ybScsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGZvcm0nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImlucHV0LWxpc3QtY29udGFpbmVyXCIgY2xhc3M9XCJpbnB1dC1saXN0XCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuc1wiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwic3VibWl0LWJ0blwiIGNsYXNzPVwic3VibWl0LWJ0blwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOiB7XG4gICAgICAgIGlucHV0TGlzdENvbnRhaW5lcjogJyNpbnB1dC1saXN0LWNvbnRhaW5lcicsXG4gICAgICAgIHN1Ym1pdEJ0bkNvbnRhaW5lcjogJyNzdWJtaXQtYnRuJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCI6IFwic3VibWl0Rm9ybVwiLFxuICAgICAgICBcImFjdGlvbjppbnB1dHM6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgICAgfSxcbiAgICAgIG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGlucHV0TGlzdFZpZXcsIHZhbGlkKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24uZGlzYWJsZSghdmFsaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyh2YWxpZClcbiAgICAgIH0sXG4gICAgICBvbkZvcm1TdWJtaXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc3VibWl0Rm9ybSgpO1xuICAgICAgfSxcbiAgICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy5nZXREYXRhKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy5lcnJvcigpO1xuICAgICAgfSxcbiAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcudmFsaWRhdGUoKTtcbiAgICAgIH0sXG4gICAgICBzdWJtaXRGb3JtOiBmdW5jdGlvbihlKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvIHdvcmxkJylcbiAgICAgICAgaWYoIHRoaXMudmFsaWRhdGUoKSApe1xuICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c3VibWl0OmZvcm0nLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICBpbnB1dHM6IFtdLFxuICAgICAgICBzdWJtaXRCdXR0b246IHtcbiAgICAgICAgICBsYWJlbDogJ1N1Ym1pdCdcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8gd29ybGQnKVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGlucHV0TGlzdCA9IG5ldyBXb29kLklucHV0TGlzdCh7XG4gICAgICAgICAgbW9kZWw6IHRoaXMub3B0aW9ucy5tb2RlbCxcbiAgICAgICAgICBjb2xsZWN0aW9uOiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMuaW5wdXRzKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dExpc3RDb250YWluZXIuc2hvdyhpbnB1dExpc3QpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuc3VibWl0QnV0dG9uKXtcbiAgICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gbmV3IFdvb2QuUmFpc2VkQnV0dG9uKHtcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLm9wdGlvbnMuc3VibWl0QnV0dG9uLmxhYmVsLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICEhdGhpcy5lcnJvcigpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5zdWJtaXRCdG5Db250YWluZXIuc2hvdyhzdWJtaXRCdXR0b24pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25TaG93OiBmdW5jdGlvbigpe1xuICAgICAgfSxcbiAgICAgIG9uUG9zdDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24ub25Qb3N0KCk7XG4gICAgICB9LFxuICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vblN1Y2Nlc3MoKTtcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vbkVycm9yKCk7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzI2LzE1LlxuICovXG4gKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5JY29uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLWljb24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3dvb2QtaWNvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGljb25UZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICdmYSc6ICc8aSBjbGFzcz1cImZhIGZhLWljb24gZmEtPCUtaWNvbiU+IGNvbG9yLTwlLWNvbG9yJT5cIj48L2k+JyxcbiAgICAgICAgICAgICdtYXRlcmlhbCc6ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGNvbG9yLTwlLWNvbG9yJT5cIj48JS1pY29uJT48L2k+J1xuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnRlbXBsYXRlKHRoaXMuaWNvblRlbXBsYXRlc1t0aGlzLm9wdGlvbnMuaWNvbkNsYXNzXSkob3B0aW9ucylcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCU9IGljb25UZW1wbGF0ZSAlPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgICAgIGljb25DbGFzczogJ2ZhJyxcbiAgICAgICAgICAgIGljb246ICdjaXJjbGUtdGhpbicsXG4gICAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdG9vbHRpcDogZmFsc2UsXG4gICAgICAgICAgICBjbGlja0V2ZW50OiAnYWN0aW9uOmNsaWNrOmljb24nXG4gICAgICAgIH0sXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uKHNldE9iail7XG4gICAgICAgICAgXy5leHRlbmQodGhpcy5vcHRpb25zLCBzZXRPYmopO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBpY29uVGVtcGxhdGU6IHRoaXMuaWNvblRlbXBsYXRlKHRoaXMub3B0aW9ucylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5JY29uQnV0dG9uID0gV29vZC5JY29uLmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJ0b29sdGlwLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgdG9vbHRpcENvbnRhaW5lcjogJyN0b29sdGlwLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICdtb3VzZWRvd24nOiAnbW91c2VEb3duJyxcbiAgICAgICAgJ21vdXNlbGVhdmUnOidtb3VzZU91dCcsXG4gICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgaWYoIHRoaXMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcC5mb2N1c0luKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzT3V0KCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZURvd24oKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICB9LFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5jbGljaygpO1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QodGhpcy5vcHRpb25zLmNsaWNrRXZlbnQsIGUpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyLnNob3cocmlwcGxlKTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgV29vZC5Ub29sdGlwKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy50b29sdGlwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50b29sdGlwQ29udGFpbmVyLnNob3codGhpcy50b29sdGlwKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFdvb2QuQ2hlY2tib3ggPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjaGVjay13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJjaGVjay1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImJveC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJib3gtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBjaGVja0NvbnRhaW5lcjogJyNjaGVjay1jb250YWluZXInLFxuICAgICAgICBib3hDb250YWluZXI6ICcjYm94LWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICBcInN1Ym1pdFwiOiBcIm9uRm9ybVN1Ym1pdFwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgIFwiYWN0aW9uOmNsaWNrOmNoZWNrYm94XCI6IFwiY2xpY2tDaGVja2JveFwiLFxuICAgICAgfSxcbiAgICAgIGNsaWNrQ2hlY2tib3g6IGZ1bmN0aW9uKGNoaWxkLCBldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiggdGhpcy4kZWwuYXR0cignY2hlY2tlZCcpICl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kZWwuYXR0cignY2hlY2tlZCcsIHRoaXMub3B0aW9ucy5jaGVja2VkKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmNoZWNrYm94XCIsIHRoaXMub3B0aW9ucy5jaGVja2VkKVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgY2hlY2tlZDogZmFsc2UsXG4gICAgICAgIGNoZWNrSWNvblZpZXc6IFdvb2QuSWNvbixcbiAgICAgICAgY2hlY2tJY29uT3B0aW9uczp7XG4gICAgICAgICAgaWNvbjogJ2NoZWNrLXNxdWFyZScsXG4gICAgICAgICAgY29sb3I6ICdibHVlJ1xuICAgICAgICB9LFxuICAgICAgICBib3hJY29uVmlldzogV29vZC5JY29uQnV0dG9uLFxuICAgICAgICBib3hJY29uT3B0aW9uczp7XG4gICAgICAgICAgaWNvbjogJ3NxdWFyZS1vJyxcbiAgICAgICAgICBjb2xvcjogJ2luaGVyaXQnLFxuICAgICAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6Y2hlY2tib3gnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjaGVjayA9IG5ldyB0aGlzLm9wdGlvbnMuY2hlY2tJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2hlY2tJY29uT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmNoZWNrQ29udGFpbmVyLnNob3coY2hlY2spO1xuXG4gICAgICAgIHZhciBib3ggPSBuZXcgdGhpcy5vcHRpb25zLmJveEljb25WaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5ib3hJY29uT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLmJveENvbnRhaW5lci5zaG93KGJveCk7XG5cbiAgICAgICAgdGhpcy4kZWwuYXR0cignY2hlY2tlZCcsIHRoaXMub3B0aW9ucy5jaGVja2VkKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLlNlcGFyYXRvciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLXNlcGFyYXRvcicsXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJylcbiAgICB9KTtcbiAgICAvL1xuICAgIFdvb2QuSWNvbkxpc3QgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1pY29uLWxpc3QnLFxuICAgICAgY2hpbGRWaWV3OiBXb29kLkljb24sXG4gICAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgICAgdmFyIGlkID0gY2hpbGQuZ2V0KCdpZCcpO1xuICAgICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGNoaWxkLmdldCgnb3B0aW9ucycpO1xuICAgICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgfSxcbiAgICAgIGdldFZpZXc6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgICBpZiggaWQgPT0gY2hpbGRWaWV3LmlkKVxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkVmlldztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG59KSh3aW5kb3cuV29vZCk7XG4iLCJXb29kLmlucHV0cyA9IHt9O1xuXG5yZXF1aXJlKCcuL3RleHQuanMnKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuSW5wdXQgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBpbnB1dCcsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtcGxhY2Vob2xkZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXRleHRcIj48JS1mbG9hdGluZ0xhYmVsVGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJoaW50LXRleHRcIj48JS1oaW50VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxpbnB1dCB0eXBlPVwiPCUtdHlwZSU+XCIgdmFsdWU9XCI8JS12YWx1ZSU+XCI+PC9pbnB1dD4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b21cIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1pbmFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWFjdGl2ZVwiPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImVycm9yLXRleHRcIiBjbGFzcz1cImVycm9yLXRleHRcIj48L2Rpdj4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBldmVudHM6e1xuICAgICAgICAgICdjaGFuZ2UgaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdrZXl1cCBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2tleWRvd24gaW5wdXQnOiAnc2V0RmlsbGVkJyxcbiAgICAgICAgICAnZm9jdXNpbiAgaW5wdXQnOiAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0IGlucHV0JzogJ2ZvY3VzT3V0J1xuICAgICAgICB9LFxuICAgICAgICBzZXRGaWxsZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgICBpZiggdGhpcy52YWx1ZSA9PSAnJyApe1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZpbGxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAga2V5UHJlc3M6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHRoaXMuc2V0RmlsbGVkKCk7XG4gICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5lcnJvcigpO1xuICAgICAgICAgIGlmKCAhZXJyb3IgKXtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246aW5wdXQ6Y2hhbmdlJywgIWVycm9yKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEVycm9yOiBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgaWYoIGVycm9yICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZXJyZWQnKTtcbiAgICAgICAgICAgIHRoaXMuJCgnI2Vycm9yLXRleHQnKS50ZXh0KGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2VycmVkJyk7XG4gICAgICAgICAgICB0aGlzLiQoJyNlcnJvci10ZXh0JykudGV4dCgnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5pc1JlcXVpcmVkICYmIHZhbHVlID09ICcnICl7XG4gICAgICAgICAgICBlcnJvciA9ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJztcbiAgICAgICAgICB9IGVsc2UgaWYoIHRoaXMub3B0aW9ucy5lcnJvciApe1xuICAgICAgICAgICAgZXJyb3IgPSB0aGlzLm9wdGlvbnMuZXJyb3IodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZXJyb3IoKTtcbiAgICAgICAgICB0aGlzLnNldEVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gIWVycm9yO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiAnJyxcbiAgICAgICAgICBoaW50VGV4dDogJycsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgaXNSZXF1aXJlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQgKVxuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2xhYmVsZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5zZXRGaWxsZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmFsOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCh2YWwpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0VmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uKFdvb2QpIHtcbiAgV29vZC5JdGVtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3dvb2QtaXRlbScsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cIml0ZW0td3JhcHBlclwiPicgK1xuICAgICAgICAnPCUgaWYgKGxlZnRJY29uKSB7ICU+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJsZWZ0LWljb24tY29udGFpbmVyXCIgY2xhc3M9XCJsZWZ0LWljb25cIj48L2Rpdj4nICtcbiAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJpdGVtLWJvZHlcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJpbWFyeS10ZXh0XCI+PCUtcHJpbWFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzZWNvbmRhcnktdGV4dFwiPjwlLXNlY29uZGFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPCUgaWYgKHJpZ2h0SWNvbikgeyAlPicgK1xuICAgICAgICAgICAgJzxkaXYgaWQ9XCJyaWdodC1pY29uLWNvbnRhaW5lclwiIGNsYXNzPVwicmlnaHQtaWNvblwiPjwvZGl2PicgK1xuICAgICAgICAgICc8JX0lPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgbGVmdEljb25Db250YWluZXI6ICcjbGVmdC1pY29uLWNvbnRhaW5lcicsXG4gICAgICByaWdodEljb25Db250YWluZXI6ICcjcmlnaHQtaWNvbi1jb250YWluZXInLFxuICAgIH0sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGxlZnRJY29uOiBmYWxzZSxcbiAgICAgIGxlZnRJY29uVmlldzogV29vZC5BdmF0YXIsXG4gICAgICBsZWZ0SWNvbk9wdGlvbnM6IHt9LFxuICAgICAgcHJpbWFyeVRleHQ6IG51bGwsXG4gICAgICBzZWNvbmRhcnlUZXh0OiBudWxsLFxuICAgICAgcmlnaHRJY29uOiBmYWxzZSxcbiAgICAgIHJpZ2h0SWNvblZpZXc6IG51bGwsXG4gICAgICByaWdodEljb25PcHRpb25zOiB7fVxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxlZnRJY29uKSB7XG4gICAgICAgIHZhciBsZWZ0SWNvbiA9IG5ldyB0aGlzLm9wdGlvbnMubGVmdEljb25WaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5sZWZ0SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sZWZ0SWNvbkNvbnRhaW5lci5zaG93KGxlZnRJY29uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yaWdodEljb24pIHtcbiAgICAgICAgdmFyIHJpZ2h0SWNvbiA9IG5ldyB0aGlzLm9wdGlvbnMucmlnaHRJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucmlnaHRJY29uT3B0aW9uc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLnJpZ2h0SWNvbkNvbnRhaW5lci5zaG93KHJpZ2h0SWNvbik7XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5JdGVtQnV0dG9uID0gV29vZC5JdGVtLmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczp7XG4gICAgICBjbGFzczogJ2J1dHRvbidcbiAgICB9LFxuICAgIGV2ZW50czp7XG4gICAgICAnY2xpY2snOiAnY2xpY2snXG4gICAgfSxcbiAgICBkZWZhdWx0czogXy5leHRlbmQoe30sIFdvb2QuSXRlbS5wcm90b3R5cGUuZGVmYXVsdHMsIHtcbiAgICAgIGNsaWNrRXZlbnQ6ICdhY3Rpb246Y2xpY2s6aXRlbScsXG4gICAgICBjbGlja0V2ZW50QXJnOiBudWxsXG4gICAgfSksXG4gICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKHRoaXMub3B0aW9ucy5jbGlja0V2ZW50LCB0aGlzLm9wdGlvbnMuY2xpY2tFdmVudEFyZyk7XG4gICAgfSxcbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgV29vZC5EaXZpZGVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICd3b29kLWRpdmlkZXInLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCcnKSxcbiAgfSk7XG5cbiAgV29vZC5MaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICd3b29kLWxpc3QnLFxuICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgfSxcbiAgICBjaGlsZFZpZXc6IFdvb2QuSXRlbSxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIHZhciB2aWV3ID0gY2hpbGQuZ2V0KCdpdGVtVmlldycpIHx8IENoaWxkVmlld0NsYXNzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ2l0ZW1PcHRpb25zJyk7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pdGVtcyk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuUmlwcGxlID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIGNsYXNzOiAnd29vZCByaXBwbGUtd3JhcHBlcicsXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAnJyksXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJHJpcHBsZXMgPSBbXTtcbiAgICB9LFxuICAgIHB5dGhhZ29yYXM6IGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KGEsMikrTWF0aC5wb3coYiwyKSwwLjUpO1xuICAgIH0sXG4gICAgY3JlYXRlUmlwcGxlOiBmdW5jdGlvbihjbGFzc05hbWUsIHgsIHkpe1xuICAgICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgICRyaXBwbGUuYWRkQ2xhc3MoJ2NpcmNsZSByaXBwbGUgJyArIGNsYXNzTmFtZSk7XG4gICAgICB2YXIgaCA9IHRoaXMuJGVsLmhlaWdodCgpO1xuICAgICAgdmFyIHcgPSB0aGlzLiRlbC53aWR0aCgpO1xuICAgICAgaWYoIHggPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHggPSB3LzI7XG4gICAgICAgIHkgPSBoLzI7XG4gICAgICB9XG4gICAgICB2YXIgciA9IHRoaXMucHl0aGFnb3JhcyhNYXRoLm1heCh4LHcteCksIE1hdGgubWF4KHksaC15KSk7XG4gICAgICAkcmlwcGxlLmNzcyh7XG4gICAgICAgICd0b3AnOiB5IC0gcixcbiAgICAgICAgJ2xlZnQnOiB4IC0gcixcbiAgICAgICAgJ2hlaWdodCc6IDIqcixcbiAgICAgICAgJ3dpZHRoJzogMipyXG4gICAgICB9KTtcbiAgICAgIHJldHVybiAkcmlwcGxlO1xuICAgIH0sXG4gICAgZm9jdXNJbjogZnVuY3Rpb24oKXtcbiAgICAgIGlmKCAhdGhpcy4kcHVsc2UgICYmIHRoaXMuJHJpcHBsZXMubGVuZ3RoID09IDApe1xuICAgICAgICB2YXIgJHB1bHNlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3B1bHNpbmcnKTtcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kKCRwdWxzZSk7XG4gICAgICAgIHRoaXMuJHB1bHNlID0gJHB1bHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZm9jdXNPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZiggdGhpcy4kcHVsc2UgKXtcbiAgICAgICAgdGhpcy5mYWRlKHRoaXMuJHB1bHNlLCAwKTtcbiAgICAgICAgdGhpcy4kcHVsc2UgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZURvd246IGZ1bmN0aW9uKHgsIHkpe1xuICAgICAgdmFyICRyaXBwbGUgPSB0aGlzLmNyZWF0ZVJpcHBsZSgncHJvcGFnYXRpbmcnLCB4LCB5KTtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZCgkcmlwcGxlKTtcbiAgICAgIHRoaXMuJHJpcHBsZXMucHVzaCgkcmlwcGxlKTtcbiAgICB9LFxuICAgIG1vdXNlT3V0OiBmdW5jdGlvbigpe1xuICAgICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgICAgaWYoICRyaXBwbGUgKXtcbiAgICAgICAgdGhpcy5mYWRlKCRyaXBwbGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgJHJpcHBsZSA9IHRoaXMuJHJpcHBsZXMucG9wKCk7XG4gICAgICBpZiggJHJpcHBsZSApe1xuICAgICAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdXNlRG93bigpO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBzZWxmLm1vdXNlT3V0KCk7XG4gICAgICB9LCAwKTtcbiAgICB9LFxuICAgIGZhZGU6IGZ1bmN0aW9uKHJpcHBsZSwgZHVyYXRpb24pe1xuICAgICAgdmFyIGR1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09ICdudW1iZXInID8gZHVyYXRpb24gOiA1MDA7XG4gICAgICByaXBwbGUuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKXtcbiAgICAgICAgcmlwcGxlLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuU3Bpbm5lciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ3dvb2Qtc3Bpbm5lcicsXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8c3ZnIGNsYXNzPVwiY2lyY3VsYXJcIiB2aWV3Qm94PVwiPCUtcis1JT4gPCUtcis1JT4gPCUtZCsxMCU+IDwlLWQrMTAlPlwiIGhlaWdodD1cIjwlLWQlPlwiIHdpZHRoPVwiPCUtZCU+XCI+JyArXG4gICAgICAgICAgICAnPGNpcmNsZSBjbGFzcz1cInBhdGhcIiBjeD1cIjwlLWQrMTAlPlwiIGN5PVwiPCUtZCsxMCU+XCIgcj1cIjwlLXJhZGl1cyU+XCIgc3Ryb2tlLXdpZHRoPVwiPCUtc3Ryb2tlV2lkdGglPlwiLz4nICtcbiAgICAgICAgICAnPC9zdmc+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICByYWRpdXM6IDIwLFxuICAgICAgICAgIHN0cm9rZVdpZHRoOiAyXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciByYWRpdXMgPSB0aGlzLm9wdGlvbnMucmFkaXVzO1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICByOiByYWRpdXMsXG4gICAgICAgICAgICBkOiByYWRpdXMgKiAyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICBvdmVybGF5OiBmdW5jdGlvbiAoJGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB3aWRnZXQgPSBuZXcgV29vZC5TcGlubmVyKG9wdGlvbnMpO1xuICAgICAgICB3aWRnZXQucmVuZGVyKCk7XG4gICAgICAgICRvdmVybGF5ID0gd2lkZ2V0LiRlbDtcbiAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ292ZXJsYXknKTtcblxuICAgICAgICAkZWwuYXBwZW5kKCRvdmVybGF5KTtcbiAgICAgICAgcmV0dXJuICRvdmVybGF5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5TcGlubmVyT3ZlcmxheSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1zcGlubmVyLW92ZXJsYXknLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIm92ZXJsYXkgYmFja2dyb3VuZENvbG9yLTwlLWJhY2tncm91bmRDb2xvciU+XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cInNwaW5uZXItY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICdjbGljayc6ICdwcmV2ZW50RGVmYXVsdCdcbiAgICAgICAgfSxcbiAgICAgICAgcmVnaW9uczoge1xuICAgICAgICAgIHNwaW5uZXJDb250YWluZXI6ICcjc3Bpbm5lci1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBzcGlubmVyID0gbmV3IFdvb2QuU3Bpbm5lcigpO1xuICAgICAgICAgIHRoaXMuc3Bpbm5lckNvbnRhaW5lci5zaG93KHNwaW5uZXIpXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbihlKXtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICBzaG93OiBmdW5jdGlvbiAoJGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBvdmVybGF5ID0gbmV3IFdvb2QuU3Bpbm5lck92ZXJsYXkob3B0aW9ucyk7XG4gICAgICAgIG92ZXJsYXkucmVuZGVyKCk7XG5cbiAgICAgICAgJGVsLmFwcGVuZChvdmVybGF5LiRlbCk7XG4gICAgICAgIHJldHVybiBvdmVybGF5LiRlbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRPRE9cbiAgICAvLyBXb29kLklubGluZUxvYWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAvLyAgICAgdGFnTmFtZTogJ2ltZycsXG4gICAgLy8gICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAvLyAgICAgICAgIHNyYzogJy9hc3NldHMvaW1hZ2VzL2xvYWRlcnMvYmFyLmdpZicsXG4gICAgLy8gICAgICAgICBzdHlsZTogJ3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbjphdXRvO3RvcDowO2JvdHRvbTowOydcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgLy8gfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDE0LzEyLzE1LlxuICogVE9ETyByZW1vdmUgZGF0YXRhYmxlcyBkZXBlbmRlbmN5XG4gKi9cbiAoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRhYmxlID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAndGFibGUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3RhYmxlIHRhYmxlLXN0cmlwZWQnLFxuICAgICAgICAgICAgY2VsbHNwYWNpbmc6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgc3R5bGU6ICdtaW4td2lkdGg6MTAwJTttaW4taGVpZ2h0OjEwMCU7J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0hlYWRlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0Zvb3RlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGZvb3Q+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3Rmb290PicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8dGJvZHk+PC90Ym9keT4nXG4gICAgICAgICksXG4gICAgICAgIGNvbGxlY3REYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChtb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uczogZnVuY3Rpb24gKHNjaGVtYSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuXG4gICAgICAgICAgICAvLyBsb2FkIHRoZSBjb2x1bW4gaW5mb3JtYXRpb24gZnJvbSB0aGUgc2NoZW1hXG4gICAgICAgICAgICBpZihzY2hlbWEpe1xuICAgICAgICAgICAgICAgIF8uZWFjaChzY2hlbWEuY29sdW1ucywgZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8udmlzaWJsZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbmZvLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGluZm8uZGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbkRlZnM6IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgZGVmcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5yZW5kZXJlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBjb2wucmVuZGVyZXI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhTmFtZSA9IGNvbC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0gY29sLnJlbmRlcmVyT3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICBkZWZzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWRnZXQgPSBzZWxmW3JlbmRlcmVyXShkYXRhLCB0eXBlLCBmdWxsLCBtZXRhLCByZW5kZXJlck9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yod2lkZ2V0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhTmFtZSArICdfJyArIG1ldGEucm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnNbaWRdID0gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cInJlbmRlcmVyLWNvbnRhaW5lciB3YWl0aW5nXCI+PC9zcGFuPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZzO1xuICAgICAgICB9LFxuICAgICAgICBnZXRFeHBvcnREYXRhOiBmdW5jdGlvbiAocmVjb3JkLCBmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkXTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X2NvbHVtbnMgPSBzZWxmLmdldENvbHVtbnMoc2VsZi5jb2xsZWN0aW9uLm1vZGVsLnByb3RvdHlwZS5zY2hlbWEpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sdW1uRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdF9jb2x1bW5zID0gXy5maWx0ZXIoZGVmYXVsdF9jb2x1bW5zLCBvcHRpb25zLmNvbHVtbkZpbHRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjb2xsZWN0aW9uIGZvciB0aGlzIGRhdGF0YWJsZVxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzID0ge307XG4gICAgICAgICAgICBzZWxmLmJhc2VTZWFyY2ggPSBvcHRpb25zLnNlYXJjaCB8fCAnJztcblxuICAgICAgICAgICAgc2VsZi5yb3dIZWlnaHQgPSBvcHRpb25zLnJvd0hlaWdodCB8fCA1OTtcbiAgICAgICAgICAgIHNlbGYubWF4VmlzaWJsZVJvd3MgPSBvcHRpb25zLm1heFZpc2libGVSb3dzIHx8IDEwO1xuICAgICAgICAgICAgc2VsZi5jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zIHx8IGRlZmF1bHRfY29sdW1ucztcbiAgICAgICAgICAgIHNlbGYuY29sdW1uRGVmcyA9IG9wdGlvbnMuY29sdW1uRGVmcyB8fCBzZWxmLmdldENvbHVtbkRlZnMoc2VsZi5jb2x1bW5zKTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0hlYWRlciA9IG9wdGlvbnMuc2hvd0hlYWRlciB8fCB0cnVlO1xuICAgICAgICAgICAgc2VsZi5zaG93Rm9vdGVyID0gb3B0aW9ucy5zaG93Rm9vdGVyIHx8IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5kYXRhVGFibGVPcHRpb25zID0gb3B0aW9ucy5kYXRhVGFibGVPcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgc2VsZi50aXRsZSA9IG9wdGlvbnMudGl0bGU7XG5cblxuICAgICAgICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2l6ZUhlaWdodCgpO1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblJvd1JlbmRlcjogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQocm93KS5maW5kKCcucmVuZGVyZXItY29udGFpbmVyLndhaXRpbmcnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGhvbGRlciA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgJGhvbGRlci5yZW1vdmVDbGFzcygnd2FpdGluZycpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gc2VsZi5yZW5kZXJlcnNbJGhvbGRlci5hdHRyKCdpZCcpXTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBhIGpxdWVyeSBvYmplY3QgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZXIgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlbmRlciBhIGJhY2tib25lIHZpZXdcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyLiRlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdmlydHVhbCBtZXRob2RcbiAgICAgICAgfSxcbiAgICAgICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsb2FkZXIgZm9yIHRoaXMgdGFibGUgdG8gbG9hZCBjb2xsZWN0aW9uIGluZm9ybWF0aW9uXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzY3JvbGxZOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUsXG4gICAgICAgICAgICAgICAgc2Nyb2xsWDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZWZlclJlbmRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb206ICc8XCJ0aXRsZVwiPlpUZnJ0aVMnLFxuICAgICAgICAgICAgICAgIHNjcm9sbENvbGxhcHNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBjb2x1bW5EZWZzOiB0aGlzLmNvbHVtbkRlZnMsXG4gICAgICAgICAgICAgICAgcm93Q2FsbGJhY2s6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm9uUm93UmVuZGVyKHJvdywgZGF0YSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUJ1ZmZlcjogMlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gbmV3IFdvb2QuU3Bpbm5lci5vdmVybGF5KHNlbGYuJGVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kOiBzZWxmLmNvbHVtbnMubWFwKGZ1bmN0aW9uKGMpe3JldHVybiBjLmRhdGF9KS5qb2luKCcsJyksXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh7ZGF0YTogc2VsZi5jb2xsZWN0RGF0YSgpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGFibGVUb29sczoge1xuICAgICAgICAgICAgICAgICAgICBzU3dmUGF0aDogJy9hc3NldHMvc3dmL2NvcHlfY3N2X3hsc19wZGYuc3dmJyxcbiAgICAgICAgICAgICAgICAgICAgYUJ1dHRvbnM6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNFeHRlbmRzOiAnY3N2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uVGV4dDogJ0V4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvbkNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGJ0bi14cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5DZWxsUmVuZGVyOiBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbiwgZG9tUm93LCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHNlbGYuY29sbGVjdGlvbi5hdChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBzZWxmLmNvbHVtbnNbY29sdW1uXS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRFeHBvcnREYXRhKHJlY29yZCwgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB0aGlzLiRlbC5EYXRhVGFibGUoXy5leHRlbmQob3B0aW9ucywgc2VsZi5kYXRhVGFibGVPcHRpb25zKSk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNlYXJjaCh0aGlzLmJhc2VTZWFyY2gpO1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlID0gc2VsZi4kZWwuY2xvc2VzdCgnLmRhdGFUYWJsZXNfd3JhcHBlcicpO1xuICAgICAgICAgICAgdGhpcy4kZWwub24oJ3NlYXJjaC5kdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTpzZWFyY2gnLCBzZWxmLnRhYmxlLnNlYXJjaCgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi50aXRsZSkge1xuICAgICAgICAgICAgICAgIHRhYmxlID0gc2VsZjtcbiAgICAgICAgICAgICAgICBzZWxmLiRkYXRhVGFibGUuZmluZCgnZGl2LnRpdGxlJykuYXBwZW5kKHNlbGYudGl0bGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUhlaWdodCgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gV29vZC5TcGlubmVyLm92ZXJsYXkodGhpcy4kZWwpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5hamF4LnJlbG9hZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcm93Q291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpbmZvID0gdGhpcy50YWJsZS5wYWdlLmluZm8oKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvLnJlY29yZHNUb3RhbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SGVpZ2h0OiBmdW5jdGlvbiAoaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUuZmluZCgnLmRhdGFUYWJsZXNfc2Nyb2xsQm9keScpLmNzcygnbWF4LWhlaWdodCcsIGhlaWdodCArIFwicHhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZUhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkgLSA1NzApXG4gICAgICAgIH0sXG4gICAgICAgIHVuZmlsdGVyZWRSb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc0Rpc3BsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgc2hvd0hlYWRlcjogdGhpcy5zaG93SGVhZGVyLFxuICAgICAgICAgICAgICAgIHNob3dGb290ZXI6IHRoaXMuc2hvd0Zvb3RlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5Ub29sYmFyID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiBcIndvb2QtdG9vbGJhclwiLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycrXG4gICAgICAgICc8ZGl2IGlkPVwibGVmdC1pY29ucy13cmFwcGVyXCIgY2xhc3M9XCJsZWZ0LWljb25zLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwlLXRpdGxlJT48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJyaWdodC1pY29ucy13cmFwcGVyXCIgY2xhc3M9XCJyaWdodC1pY29ucy13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOntcbiAgICAgICAgbGVmdEljb25zQ29udGFpbmVyOiBcIiNsZWZ0LWljb25zLXdyYXBwZXJcIixcbiAgICAgICAgcmlnaHRJY29uc0NvbnRhaW5lcjogXCIjcmlnaHQtaWNvbnMtd3JhcHBlclwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgICdhY3Rpb246Y2xpY2s6aWNvbic6IFwib25DbGlja0ljb25cIixcbiAgICAgIH0sXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC50aXRsZSc6ICdvbkNsaWNrVGl0bGUnLFxuICAgICAgfSxcbiAgICAgIG9uQ2xpY2tJY29uOiBmdW5jdGlvbihpY29uVmlldyl7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCggJ2FjdGlvbjpjbGljazppY29uJywgaWNvblZpZXcgKTtcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrVGl0bGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmNsaWNrOnRpdGxlJyk7XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbGVmdEljb25zOiBbXSxcbiAgICAgICAgcmlnaHRJY29uczogW10sXG4gICAgICAgIHRpdGxlOiAnVG9vbGJhcicsXG4gICAgICAgIGNvbG9yOiAnYmxhY2snLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5LWxpZ2h0JyxcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZ2V0SWNvbjogZnVuY3Rpb24oaWNvbklkKXtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmxlZnRJY29uc0NvbnRhaW5lci5jdXJyZW50Vmlldy5nZXRWaWV3KGljb25JZCk7XG4gICAgICAgIHZhciBiID0gdGhpcy5yaWdodEljb25zQ29udGFpbmVyLmN1cnJlbnRWaWV3LmdldFZpZXcoaWNvbklkKTtcbiAgICAgICAgcmV0dXJuIGEgfHwgYjtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY29sb3ItJyt0aGlzLm9wdGlvbnMuY29sb3IpO1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnYmFja2dyb3VuZENvbG9yLScrdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcik7XG5cbiAgICAgICAgdmFyIGxlZnRJY29uTGlzdCA9IG5ldyBXb29kLkljb25MaXN0KHtcbiAgICAgICAgICBjb2xsZWN0aW9uOiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMubGVmdEljb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sZWZ0SWNvbnNDb250YWluZXIuc2hvdyhsZWZ0SWNvbkxpc3QpO1xuXG4gICAgICAgIHZhciByaWdodEljb25MaXN0ID0gbmV3IFdvb2QuSWNvbkxpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5yaWdodEljb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yaWdodEljb25zQ29udGFpbmVyLnNob3cocmlnaHRJY29uTGlzdCk7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAzLzExLzE1LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgV29vZC5Ub29sdGlwID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd3b29kIHRvb2x0aXAtYW5jaG9yLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3b29kLXRvb2x0aXBcIj48JS0gdGV4dCAlPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgJycpLFxuICAgIGRlZmF1bHRzOntcbiAgICAgIHRleHQ6ICcnXG4gICAgfSxcbiAgICBmb2N1c0luOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBmb2N1c091dDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gNC81LzE2LlxuICovXG4oZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkJyYW5jaCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC1icmFuY2hcIixcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGlkPVwidHJlZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAnJyksXG4gICAgY2hpbGRFdmVudHM6e1xuICAgIH0sXG4gICAgcmVnaW9uczoge1xuICAgICAgdHJlZUNvbnRhaW5lcjogXCIjdHJlZS1jb250YWluZXJcIixcbiAgICB9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMudHJlZSA9IHRoaXMub3B0aW9ucy50cmVlXG4gICAgfSxcbiAgICBnZXRUcmVlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMudHJlZS5nZXRUcmVlKHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBidWJibGVDaGlsZEV2ZW50OiBmdW5jdGlvbihjaGlsZEV2ZW50TmFtZSl7XG4gICAgICB0aGlzLmNoaWxkRXZlbnRzW2NoaWxkRXZlbnROYW1lXSA9IGZ1bmN0aW9uKGNoaWxkLCBhcmdzKXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKGNoaWxkRXZlbnROYW1lLCBhcmdzKVxuICAgICAgfVxuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRyZWUgPSB0aGlzLmdldFRyZWUoKTtcbiAgICAgIHRoaXMudHJlZUNvbnRhaW5lci5zaG93KHRyZWUpO1xuXG4gICAgICBmb3IoIGNoaWxkRXZlbnROYW1lIGluIHRyZWUuY2hpbGRFdmVudHMgKXtcbiAgICAgICAgdGhpcy5idWJibGVDaGlsZEV2ZW50KGNoaWxkRXZlbnROYW1lKVxuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuQnJhbmNoZXMgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWJyYW5jaGVzXCIsXG4gICAgY2hpbGRWaWV3OiBXb29kLkJyYW5jaCxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIGNoaWxkLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgdHJlZTogdGhpcy50cmVlXG4gICAgICB9KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICB2YXIgdmlldyA9IG5ldyBDaGlsZFZpZXdDbGFzcyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy50cmVlID0gdGhpcy5vcHRpb25zLnRyZWU7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgsIGNvbGxlY3Rpb24pe1xuICAgICAgcmV0dXJuIHRoaXMudHJlZS5maWx0ZXIoY2hpbGQsIGluZGV4LCBjb2xsZWN0aW9uKVxuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5UcmVlID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLXRyZWVcIixcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwidHJlZS13cmFwcGVyXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidHdpZ1wiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cIml0ZW0tY29udGFpbmVyXCIgY2xhc3M9XCJpdGVtLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgaWQ9XCJjaGlsZHJlbi1jb250YWluZXJcIiBjbGFzcz1cImNoaWxkcmVuLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBpdGVtQ29udGFpbmVyOiBcIiNpdGVtLWNvbnRhaW5lclwiLFxuICAgICAgY2hpbGRyZW5Db250YWluZXI6IFwiI2NoaWxkcmVuLWNvbnRhaW5lclwiLFxuICAgIH0sXG4gICAgZXZlbnRzOiB7fSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgaXRlbVZpZXc6IFdvb2QuSXRlbSxcbiAgICAgIGl0ZW1PcHRpb25zOiB7fSxcbiAgICAgIGNoaWxkcmVuOiBbXVxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbil7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGdldENvbGxlY3Rpb246IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLmNoaWxkcmVuKTtcbiAgICB9LFxuICAgIGdldEl0ZW06IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gbmV3IHRoaXMub3B0aW9ucy5pdGVtVmlldyh0aGlzLm9wdGlvbnMuaXRlbU9wdGlvbnMpO1xuICAgIH0sXG4gICAgZ2V0VHJlZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICByZXR1cm4gbmV3IFdvb2QuVHJlZShvcHRpb25zKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKCk7XG4gICAgICB0aGlzLml0ZW1Db250YWluZXIuc2hvdyhpdGVtKTtcblxuICAgICAgdGhpcy5jb2xsZWN0aW9uID0gdGhpcy5nZXRDb2xsZWN0aW9uKCk7XG4gICAgICBpZiggdGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgdmFyIGJyYW5jaGVzID0gbmV3IFdvb2QuQnJhbmNoZXMoe1xuICAgICAgICAgIHRyZWU6IHRoaXMsXG4gICAgICAgICAgY29sbGVjdGlvbiA6IHRoaXMuY29sbGVjdGlvblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbkNvbnRhaW5lci5zaG93KGJyYW5jaGVzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBXb29kLkFyYm9yaXN0ID0gV29vZC5UcmVlLmV4dGVuZCh7XG4gICAgZmlsdGVyOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgsIGNvbGxlY3Rpb24pe1xuICAgICAgdmFyIG1vZGVsID0gdGhpcy5vcHRpb25zLmNvbGxlY3Rpb24uZ2V0KHRoaXMub3B0aW9ucy5yb290KTtcbiAgICAgIHJldHVybiBjaGlsZC5nZXQoJ3BhcmVudCcpID09IG1vZGVsLmdldCgnaWQnKTtcbiAgICB9LFxuICAgIGdldENvbGxlY3Rpb246IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbGxlY3Rpb247XG4gICAgfSxcbiAgICBnZXRJdGVtOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIG1vZGVsID0gdGhpcy5vcHRpb25zLmNvbGxlY3Rpb24uZ2V0KHRoaXMub3B0aW9ucy5yb290KVxuICAgICAgcmV0dXJuIG5ldyBXb29kLkl0ZW0oe1xuICAgICAgICBwcmltYXJ5VGV4dDogbW9kZWwuZ2V0KCdpZCcpLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdldFRyZWU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgcmV0dXJuIG5ldyBXb29kLkFyYm9yaXN0KHtcbiAgICAgICAgcm9vdDogb3B0aW9ucy5pZCxcbiAgICAgICAgY29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9uXG4gICAgICB9KTtcbiAgICB9LFxuICB9KTtcblxuXG59KSh3aW5kb3cuV29vZCk7XG4iXX0=
