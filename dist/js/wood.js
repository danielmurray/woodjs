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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvY2FyZC5qcyIsInNyYy9qcy9kaWFsb2cuanMiLCJzcmMvanMvZHJvcGRvd24uanMiLCJzcmMvanMvZm9ybS5qcyIsInNyYy9qcy9pY29uLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiLCJzcmMvanMvaXRlbS5qcyIsInNyYy9qcy9saXN0LmpzIiwic3JjL2pzL3JpcHBsZS5qcyIsInNyYy9qcy9zcGlubmVyLmpzIiwic3JjL2pzL3RhYmxlLmpzIiwic3JjL2pzL3Rvb2xiYXIuanMiLCJzcmMvanMvdG9vbHRpcC5qcyIsInNyYy9qcy90cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5Xb29kID0ge307XG5cbi8vIGluY2x1ZGUgYmFzZSBjb21tb24gd2lkZ2V0c1xucmVxdWlyZSgnLi9pbnB1dHMvYWxsJyk7XG5cbnJlcXVpcmUoJy4vYXZhdGFyJyk7XG5yZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9jYXJkJyk7XG5yZXF1aXJlKCcuL2RpYWxvZycpO1xucmVxdWlyZSgnLi9kcm9wZG93bicpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG5yZXF1aXJlKCcuL2ljb24nKTtcbnJlcXVpcmUoJy4vaXRlbScpO1xucmVxdWlyZSgnLi9saXN0Jyk7XG5yZXF1aXJlKCcuL3NwaW5uZXInKTtcbnJlcXVpcmUoJy4vcmlwcGxlJyk7XG5yZXF1aXJlKCcuL3RhYmxlJyk7XG5yZXF1aXJlKCcuL3Rvb2x0aXAnKTtcbnJlcXVpcmUoJy4vdG9vbGJhcicpO1xucmVxdWlyZSgnLi90cmVlJyk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuQXZhdGFyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogXCJ3b29kLWF2YXRhclwiLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cInNoYXBlIDwlLXNoYXBlJT4gY29sb3ItPCUtY29sb3IlPiBiYWNrZ3JvdW5kQ29sb3ItPCUtYmFja2dyb3VuZENvbG9yJT5cIj4nICtcbiAgICAgICAgICAgICc8JSBpZiAoaW1hZ2UpIHsgJT4nICtcbiAgICAgICAgICAgICAgJzxpbWcgY2xhc3M9XCJpbWdcIiBzcmM9XCI8JS1pbWFnZSU+XCI+PC9pbWc+JyArXG4gICAgICAgICAgICAnPCV9IGVsc2UgaWYoaWNvbikgeyU+JyArXG4gICAgICAgICAgICAgICc8aSBjbGFzcz1cImljb24gZmEgZmEtaWNvbiBmYS08JS1pY29uJT5cIj48L2k+JyArXG4gICAgICAgICAgICAnPCV9IGVsc2UgaWYobGV0dGVyKSB7JT4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+PCUtbGV0dGVyJT48L3NwYW4+JyArXG4gICAgICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgcmVnaW9uczp7XG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW1hZ2U6IG51bGwsXG4gICAgICAgICAgaWNvbjogbnVsbCxcbiAgICAgICAgICBsZXR0ZXI6IG51bGwsXG4gICAgICAgICAgc2hhcGU6IG51bGwsXG4gICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdpbmhlcml0J1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgdmFyIExhYmVsID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1sYWJlbCcsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGlkPVwiaWNvbi1jb250YWluZXJcIiBjbGFzcz1cImljb24td3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0ZXh0LXdyYXBwZXJcIj48JS10ZXh0JT48L3NwYW4+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOiB7XG4gICAgICAgIGljb25Db250YWluZXI6ICcjaWNvbi1jb250YWluZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6e1xuICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgIHRleHQ6ICdCdXR0b24nLFxuICAgICAgICBjb2xvcjogJ2luaGVyaXQnXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaWNvbiApe1xuICAgICAgICAgIHZhciBpY29uVmlldyA9IG5ldyBXb29kLkljb24oe1xuICAgICAgICAgICAgaWNvbjogdGhpcy5vcHRpb25zLmljb24sXG4gICAgICAgICAgICBpY29uQ2xhc3M6IHRoaXMub3B0aW9ucy5pY29uQ2xhc3MsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5pY29uQ29udGFpbmVyLnNob3coaWNvblZpZXcpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB2YXIgQnV0dG9uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lciBiYWNrZ3JvdW5kQ29sb3ItPCUtYmFja2dyb3VuZENvbG9yJT5cIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImxhYmVsLWNvbnRhaW5lclwiIGNsYXNzPVwibGFiZWwtd3JhcHBlciBjb2xvci08JS1jb2xvciU+XCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgICBsYWJlbENvbnRhaW5lcjogJyNsYWJlbC1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICAgJ21vdXNlZG93bic6J21vdXNlRG93bicsXG4gICAgICAgICAgJ21vdXNlb3V0JzogJ21vdXNlT3V0JyxcbiAgICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzT3V0KClcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgeCA9IGUucGFnZVggLSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgIHZhciB5ID0gZS5wYWdlWSAtIHRoaXMuJGVsLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLm1vdXNlRG93bih4LCB5KTtcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGUudG9FbGVtZW50KTtcbiAgICAgICAgICBpZiggdGFyZ2V0LmNsb3Nlc3QodGhpcy4kZWwpLmxlbmd0aCA9PTAgKXtcbiAgICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmNsaWNrKCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKFwiYWN0aW9uOmNsaWNrOmJ1dHRvblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIGljb25DbGFzczogJ2ZhJyxcbiAgICAgICAgICBsYWJlbDogJ0J1dHRvbicsXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnc2Vjb25kYXJ5JyxcbiAgICAgICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oIGRpc2FibGVkICl7XG4gICAgICAgICAgaWYoICF0aGlzLl9zYXZpbmcgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmF0dHIoJ2Rpc2FibGVkJywgZGlzYWJsZWQgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICB0aGlzLmRpc2FibGUodGhpcy5vcHRpb25zLmRpc2FibGVkKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyLnNob3cocmlwcGxlKTtcblxuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBMYWJlbCh7XG4gICAgICAgICAgICBpY29uOiB0aGlzLm9wdGlvbnMuaWNvbixcbiAgICAgICAgICAgIGljb25DbGFzczogdGhpcy5vcHRpb25zLmljb25DbGFzcyxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLm9wdGlvbnMuY29sb3IsXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMubGFiZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxhYmVsQ29udGFpbmVyLnNob3cobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICBvblBvc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKHRydWUpO1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IHRydWU7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIGljb246IHtcbiAgICAgICAgICAgICAgdmlldzogV29vZC5TcGlubmVyLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmFkaXVzOiAxMixcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogNixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLl9zYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRpc2FibGUoZmFsc2UpO1xuICAgICAgICAgIHZhciBsYWJlbCA9IG5ldyBMYWJlbCh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMubGFiZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmxhYmVsQ29udGFpbmVyLnNob3cobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShmYWxzZSk7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNhdmVDbGljazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyB0aGlzLnN0YXRlQ2hhbmdlKCdzYXZpbmcnKTtcbiAgICAgICAgICAvLyB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzYXZlQnV0dG9uQ2xpY2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgICAvLyBpZiggdGhpcy5zdGF0ZSAhPSBzdGF0ZSl7XG4gICAgICAgICAgLy8gICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgLy8gICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5GbGF0QnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gZmxhdCcsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLlJhaXNlZEJ1dHRvbiA9IEJ1dHRvbi5leHRlbmQoe1xuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uIHJhaXNlZCcsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkRyb3Bkb3duQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gZHJvcGRvd24nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIiBjbGFzcz1cInJpcHBsZS1jb250YWluZXIgYmFja2dyb3VuZENvbG9yLTwlLWJhY2tncm91bmRDb2xvciU+XCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGlkPVwibGFiZWwtY29udGFpbmVyXCIgY2xhc3M9XCJsYWJlbC13cmFwcGVyIGNvbG9yLTwlLWNvbG9yJT5cIj48JS1sYWJlbCU+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiY2FyZXQtY29udGFpbmVyXCIgY2xhc3M9XCJjYXJldC13cmFwcGVyIGNvbG9yLTwlLWNvbG9yJT5cIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICAgICAgICB0aGlzLnJlbmRlckNhcmV0KHRoaXMuZXhwYW5kZWQpO1xuICAgICAgfSxcbiAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbihlKXt9LFxuICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXt9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgaWYoIHRoaXMuZXhwYW5kZWQgKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246ZHJvcGRvd246Y29sbGFwc2UnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgQnV0dG9uLnByb3RvdHlwZS5tb3VzZURvd24uY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpkcm9wZG93bjpleHBhbmQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgfSxcbiAgICAgIG1vdXNlT3V0OiBmdW5jdGlvbihlKXt9LFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe30sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgQnV0dG9uLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgQnV0dG9uLnByb3RvdHlwZS5vblJlbmRlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmFkZFJlZ2lvbihcImNhcmV0Q29udGFpbmVyXCIsIFwiI2NhcmV0LWNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5yZW5kZXJDYXJldCh0aGlzLmV4cGFuZGVkKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXJDYXJldDogZnVuY3Rpb24oZXhwYW5kZWQpe1xuICAgICAgICB2YXIgaWNvbiA9IGV4cGFuZGVkID8gJ2FuZ2xlLXVwJyA6ICdhbmdsZS1kb3duJztcbiAgICAgICAgdmFyIGNhcmV0ID0gbmV3IFdvb2QuSWNvbih7XG4gICAgICAgICAgaWNvbjogaWNvbixcbiAgICAgICAgICBjb2xvcjogdGhpcy5vcHRpb25zLmNvbG9yXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhcmV0Q29udGFpbmVyLnNob3coY2FyZXQpO1xuICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkNhcmQgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtY2FyZFwiLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPicgK1xuICAgICAgJzxkaXYgaWQ9XCJhdmF0YXItd3JhcHBlclwiIGNsYXNzPVwiYXZhdGFyLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48JS1wcmltYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBpZD1cImNhcmQtY29udGVudFwiIGNsYXNzPVwiY2FyZC1jb250ZW50XCI+PC9kaXY+JyArXG4gICAgICAnPGRpdiBpZD1cImNhcmQtZm9vdGVyXCIgY2xhc3M9XCJjYXJkLWZvb3RlclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIGNhcmRIZWFkZXI6IFwiI2NhcmQtaGVhZGVyXCIsXG4gICAgICBhdmF0YXI6IFwiI2F2YXRhci13cmFwcGVyXCIsXG4gICAgICBjYXJkQ29udGVudDogXCIjY2FyZC1jb250ZW50XCIsXG4gICAgICBjYXJkRm9vdGVyOiBcIiNjYXJkLWZvb3RlclwiLFxuICAgIH0sXG4gICAgZXZlbnRzOiB7fSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgcHJpbWFyeVRleHQ6ICdDYXJkJyxcbiAgICAgIGhlYWRlclZpZXc6IG51bGwsXG4gICAgICBoZWFkZXJPcHRpb25zOiB7XG4gICAgICAgIGljb246ICdxdWVzdGlvbicsXG4gICAgICAgIHNoYXBlOiAnY2lyY2xlJ1xuICAgICAgfSxcbiAgICAgIGNvbnRlbnRWaWV3OiBudWxsLFxuICAgICAgY29udGVudE9wdGlvbnM6IHt9LFxuICAgICAgZm9vdGVyVmlldzogbnVsbCxcbiAgICAgIGZvb3Rlck9wdGlvbnM6IHt9XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdmF0YXIgPSBuZXcgV29vZC5BdmF0YXIodGhpcy5vcHRpb25zLmhlYWRlck9wdGlvbnMpO1xuICAgICAgdGhpcy5hdmF0YXIuc2hvdyhhdmF0YXIpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRlbnRWaWV3KSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gbmV3IHRoaXMub3B0aW9ucy5jb250ZW50VmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29udGVudE9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jYXJkQ29udGVudC5zaG93KGNvbnRlbnQpO1xuICAgICAgfVxuXG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTQvMTIvMTUuXG4gKiBUT0RPIHJlbW92ZSBib290c3RyYXAgZGVwZW5kZW5jeVxuICovXG4oZnVuY3Rpb24gKGtleXMpIHtcbiAgICBXb29kLkRpYWxvZyA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1kaWFsb2cnLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cImRpYWxvZy1jb250ZW50LWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgICAgIGRpYWxvZ0NvbnRlbnRDb250YWluZXI6ICcjZGlhbG9nLWNvbnRlbnQtY29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIHRpdGxlOiAnRGlhbG9nJ1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgICB0aGlzLmRpYWxvZyA9IG5ldyBCb290c3RyYXBEaWFsb2coe1xuICAgICAgICAgICAgICB0eXBlOiBCb290c3RyYXBEaWFsb2cuVFlQRV9QUklNQVJZLFxuICAgICAgICAgICAgICBzaXplOiBCb290c3RyYXBEaWFsb2cuU0laRV9OT1JNQUwsXG4gICAgICAgICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gdmFyIGRpYWxvZ0NvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZGlhbG9nQ29udGVudDtcbiAgICAgICAgICAvLyBpZiggZGlhbG9nQ29udGVudCApe31cbiAgICAgICAgICAvLyAgIHRoaXMuZGlhbG9nQ29udGVudENvbnRhaW5lci5zaG93KG5ldyBkaWFsb2dDb250ZW50LnZpZXcoZGlhbG9nQ29udGVudC5vcHRpb25zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9wZW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRUaXRsZSh0aGlzLm9wdGlvbnMudGl0bGUpO1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cuc2V0TWVzc2FnZSh0aGlzLiRlbClcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICBpZih0aGlzLm9uQ2xvc2UpXG4gICAgICAgICAgICAgIHRoaXMub25DbG9zZSgpXG4gICAgICAgIH0sXG4gICAgfSwge1xuICAgICAgc2hvdzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHdpZGdldCA9IG5ldyB0aGlzKG9wdGlvbnMpO1xuICAgICAgICB3aWRnZXQucmVuZGVyKCk7XG4gICAgICAgIHdpZGdldC5vcGVuKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZvcm1EaWFsb2cgPSBXb29kLkRpYWxvZy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtZm9ybS1kaWFsb2cnLFxuICAgICAgZGVmYXVsdHM6e1xuICAgICAgICB0aXRsZTogJ0RpYWxvZycsXG4gICAgICAgIGZvcm1PcHRpb25zOiB7fVxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOntcbiAgICAgICAgXCJhY3Rpb246c3VibWl0OmZvcm1cIjogXCJzdWJtaXRcIlxuICAgICAgfSxcbiAgICAgIHN1Ym1pdDogZnVuY3Rpb24oZm9ybVZpZXcsIGRhdGEpe1xuICAgICAgICBpZiggdGhpcy5vcHRpb25zLm9uU3VibWl0ICl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uU3VibWl0KGRhdGEpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246c3VibWl0OmZvcm0nLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSBuZXcgV29vZC5Gb3JtKHRoaXMub3B0aW9ucy5mb3JtT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGlhbG9nQ29udGVudENvbnRhaW5lci5zaG93KGZvcm0pO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5rZXlzKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gNC82LzE2LlxuICovXG4oZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkRyb3Bkb3duID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogJ3dvb2QtZHJvcGRvd24nLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgaWQ9XCJidXR0b24tY29udGFpbmVyXCIgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRyb3Bkb3duLWFuY2hvclwiPicgK1xuICAgICAgICAnPGRpdiBpZD1cImRyb3Bkb3duLWNvbnRhaW5lclwiIGNsYXNzPVwiZHJvcGRvd24tY29udGFpbmVyIDwlLWZsb2F0UmlnaHRDbGFzcyU+XCI+PC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgJycpLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIGJ1dHRvbkNvbnRhaW5lciAgIDogJyNidXR0b24tY29udGFpbmVyJyxcbiAgICAgIGRyb3Bkb3duQ29udGFpbmVyIDogJyNkcm9wZG93bi1jb250YWluZXInXG4gICAgfSxcbiAgICBjaGlsZEV2ZW50czoge1xuICAgICAgJ2FjdGlvbjpkcm9wZG93bjpleHBhbmQnIDogJ29uRHJvcGRvd25FeHBhbmQnLFxuICAgICAgJ2FjdGlvbjpkcm9wZG93bjpjb2xsYXBzZScgOiAnb25Ecm9wZG93bkNvbGxhcHNlJyxcbiAgICAgIC8vICdhY3Rpb246YnV0dG9uOmNsaWNrJyAgICAgOiAnZm9ya1Nlc3Npb24nLFxuICAgICAgLy8gJ2FjdGlvbjptZW51YnV0dG9uOmNsaWNrJyA6ICdvbk1lbnVCdXR0b25DbGljaycsXG4gICAgICAvLyAnYWN0aW9uOm1lbnVpdGVtOmNsaWNrJyAgIDogJ29uTWVudUl0ZW1DbGljaycsXG4gICAgfSxcbiAgICBvbkRyb3Bkb3duQ29sbGFwc2U6IGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLiQoJy5kcm9wZG93bi1jb250YWluZXInKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcbiAgICB9LFxuICAgIG9uRHJvcGRvd25FeHBhbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMuJCgnLmRyb3Bkb3duLWNvbnRhaW5lcicpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXG4gICAgICAkKCdib2R5JykuYmluZCgnbW91c2Vkb3duJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgdmFyIG91dERyb3Bkb3duID0gc2VsZi4kKCcjZHJvcGRvd24tY29udGFpbmVyJykuZmluZCh0YXJnZXQpLmxlbmd0aCA9PSAwO1xuICAgICAgICBpZiggb3V0RHJvcGRvd24gKSB7XG4gICAgICAgICAgdmFyIG91dEJ1dHRvbiA9IHNlbGYuJCgnI2J1dHRvbi1jb250YWluZXInKS5maW5kKHRhcmdldCkubGVuZ3RoID09IDA7XG4gICAgICAgICAgaWYoIG91dEJ1dHRvbiApIHtcbiAgICAgICAgICAgIHNlbGYuYnV0dG9uQ29udGFpbmVyLmN1cnJlbnRWaWV3Lm1vdXNlRG93bihlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLm9uRHJvcGRvd25Db2xsYXBzZSgpO1xuICAgICAgICAgICQoIHRoaXMgKS51bmJpbmQoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGZsb2F0UmlnaHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25CZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpe1xuICAgICAgJCgnYm9keScpLnVuYmluZCgnY2xpY2snKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYnV0dG9uID0gbmV3IFdvb2QuRHJvcGRvd25CdXR0b24oXG4gICAgICAgIHRoaXMub3B0aW9ucy5idXR0b25PcHRpb25zXG4gICAgICApO1xuICAgICAgdGhpcy5idXR0b25Db250YWluZXIuc2hvdyhidXR0b24pO1xuXG4gICAgICBpZiggdGhpcy5vcHRpb25zLmNvbnRlbnRWaWV3ICl7XG4gICAgICAgIHZhciBjb250ZW50VmlldyA9IG5ldyB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnRPcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25Db250YWluZXIuc2hvdyhjb250ZW50Vmlldyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICBmbG9hdFJpZ2h0Q2xhc3M6IHRoaXMub3B0aW9ucy5mbG9hdFJpZ2h0ID8gJ2Zsb2F0UmlnaHQnIDogJydcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgV29vZC5JbnB1dExpc3QgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgY2hpbGRFdmVudHM6IHtcbiAgICAgIFwiYWN0aW9uOmlucHV0OmNoYW5nZVwiOiBcIm9uSW5wdXRDaGFuZ2VcIixcbiAgICB9LFxuICAgIG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGlucHV0VmlldywgdmFsaWQpe1xuICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246aW5wdXRzOmNoYW5nZScsICF0aGlzLmVycm9yKCkpO1xuICAgIH0sXG4gICAgY2hpbGRWaWV3OiBXb29kLklucHV0LFxuICAgIGJ1aWxkQ2hpbGRWaWV3OiBmdW5jdGlvbihjaGlsZCwgQ2hpbGRWaWV3Q2xhc3MsIGNoaWxkVmlld09wdGlvbnMpe1xuICAgICAgdmFyIGlkID0gY2hpbGQuZ2V0KCdpZCcpO1xuICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ3ZpZXcnKTtcbiAgICAgIHZhciBvcHRpb25zID0gY2hpbGQuZ2V0KCdvcHRpb25zJyk7XG4gICAgICB2YXIgZGVmYXVsdFZhbHVlID0gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuZ2V0KGlkKSA6IG9wdGlvbnMuZGVmYXVsdFZhbHVlO1xuXG4gICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICBkYXRhW2NoaWxkVmlldy5pZF0gPSBjaGlsZFZpZXcuZ2V0VmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZXJyb3IgPSBmYWxzZTtcbiAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgdmFyIGNoaWxkVmlldyA9IHRoaXMuY2hpbGRyZW4uX3ZpZXdzW2ldO1xuICAgICAgICBlcnJvciA9IGVycm9yIHx8IGNoaWxkVmlldy5lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH0sXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIHZhciBjaGlsZFZhbGlkID0gY2hpbGRWaWV3LnZhbGlkYXRlKCk7XG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiYgY2hpbGRWYWxpZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuRm9ybSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ2Zvcm0nLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBmb3JtJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJpbnB1dC1saXN0LWNvbnRhaW5lclwiIGNsYXNzPVwiaW5wdXQtbGlzdFwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bnNcIj4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cInN1Ym1pdC1idG5cIiBjbGFzcz1cInN1Ym1pdC1idG5cIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczoge1xuICAgICAgICBpbnB1dExpc3RDb250YWluZXI6ICcjaW5wdXQtbGlzdC1jb250YWluZXInLFxuICAgICAgICBzdWJtaXRCdG5Db250YWluZXI6ICcjc3VibWl0LWJ0bidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICBcInN1Ym1pdFwiOiBcIm9uRm9ybVN1Ym1pdFwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgIFwiYWN0aW9uOmNsaWNrOmJ1dHRvblwiOiBcInN1Ym1pdEZvcm1cIixcbiAgICAgICAgXCJhY3Rpb246aW5wdXRzOmNoYW5nZVwiOiBcIm9uSW5wdXRDaGFuZ2VcIixcbiAgICAgIH0sXG4gICAgICBvbklucHV0Q2hhbmdlOiBmdW5jdGlvbihpbnB1dExpc3RWaWV3LCB2YWxpZCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLmRpc2FibGUoIXZhbGlkKTtcbiAgICAgICAgY29uc29sZS5sb2codmFsaWQpXG4gICAgICB9LFxuICAgICAgb25Gb3JtU3VibWl0OiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnN1Ym1pdEZvcm0oKTtcbiAgICAgIH0sXG4gICAgICBnZXREYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcuZ2V0RGF0YSgpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dExpc3RDb250YWluZXIuY3VycmVudFZpZXcuZXJyb3IoKTtcbiAgICAgIH0sXG4gICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LnZhbGlkYXRlKCk7XG4gICAgICB9LFxuICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmKCB0aGlzLnZhbGlkYXRlKCkgKXtcbiAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnN1Ym1pdDpmb3JtJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgc3VibWl0QnV0dG9uOiB7XG4gICAgICAgICAgbGFiZWw6ICdTdWJtaXQnXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpbnB1dExpc3QgPSBuZXcgV29vZC5JbnB1dExpc3Qoe1xuICAgICAgICAgIG1vZGVsOiB0aGlzLm9wdGlvbnMubW9kZWwsXG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLmlucHV0cylcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLnNob3coaW5wdXRMaXN0KTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnN1Ym1pdEJ1dHRvbil7XG4gICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IG5ldyBXb29kLlJhaXNlZEJ1dHRvbih7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5vcHRpb25zLnN1Ym1pdEJ1dHRvbi5sYWJlbCxcbiAgICAgICAgICAgIGRpc2FibGVkOiAhIXRoaXMuZXJyb3IoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLnNob3coc3VibWl0QnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uU2hvdzogZnVuY3Rpb24oKXtcbiAgICAgIH0sXG4gICAgICBvblBvc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uUG9zdCgpO1xuICAgICAgfSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24ub25TdWNjZXNzKCk7XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24ub25FcnJvcigpO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8yNi8xNS5cbiAqL1xuIChmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuSWNvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1pY29uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnZmEnOiAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLTwlLWljb24lPiBjb2xvci08JS1jb2xvciU+XCI+PC9pPicsXG4gICAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBjb2xvci08JS1jb2xvciU+XCI+PCUtaWNvbiU+PC9pPidcbiAgICAgICAgfSxcbiAgICAgICAgaWNvblRlbXBsYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0aGlzLmljb25UZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmljb25DbGFzc10pKG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgICBpY29uOiAnY2lyY2xlLXRoaW4nLFxuICAgICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHRvb2x0aXA6IGZhbHNlLFxuICAgICAgICAgICAgY2xpY2tFdmVudDogJ2FjdGlvbjpjbGljazppY29uJ1xuICAgICAgICB9LFxuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbihzZXRPYmope1xuICAgICAgICAgIF8uZXh0ZW5kKHRoaXMub3B0aW9ucywgc2V0T2JqKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgaWNvblRlbXBsYXRlOiB0aGlzLmljb25UZW1wbGF0ZSh0aGlzLm9wdGlvbnMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIFdvb2QuSWNvbkJ1dHRvbiA9IFdvb2QuSWNvbi5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1pY29uJyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgaWQ9XCJyaXBwbGUtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8JT0gaWNvblRlbXBsYXRlICU+JyArXG4gICAgICAgICc8ZGl2IGlkPVwidG9vbHRpcC1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICByaXBwbGVDb250YWluZXI6ICcjcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgICAgIHRvb2x0aXBDb250YWluZXI6ICcjdG9vbHRpcC1jb250YWluZXInXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAnZm9jdXNvdXQnOiAnZm9jdXNPdXQnLFxuICAgICAgICAnbW91c2Vkb3duJzogJ21vdXNlRG93bicsXG4gICAgICAgICdtb3VzZWxlYXZlJzonbW91c2VPdXQnLFxuICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICB9LFxuICAgICAgZm9jdXNJbiA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c0luKCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNJbigpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5mb2N1c091dCgpO1xuICAgICAgICBpZiggdGhpcy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwLmZvY3VzT3V0KClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUubW91c2VEb3duKCk7XG4gICAgICB9LFxuICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgfSxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKHRoaXMub3B0aW9ucy5jbGlja0V2ZW50LCBlKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHJpcHBsZSA9IG5ldyBXb29kLlJpcHBsZSgpO1xuICAgICAgICB0aGlzLnJpcHBsZUNvbnRhaW5lci5zaG93KHJpcHBsZSk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy50b29sdGlwICl7XG4gICAgICAgICAgdGhpcy50b29sdGlwID0gbmV3IFdvb2QuVG9vbHRpcCh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLm9wdGlvbnMudG9vbHRpcFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRhaW5lci5zaG93KHRoaXMudG9vbHRpcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkNoZWNrYm94ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1jaGVja2JveCcsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGNsYXNzOiAnd29vZC1jaGVja2JveCcsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY2hlY2std3JhcHBlclwiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwiY2hlY2stY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJib3gtd3JhcHBlclwiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwiYm94LWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOntcbiAgICAgICAgY2hlY2tDb250YWluZXI6ICcjY2hlY2stY29udGFpbmVyJyxcbiAgICAgICAgYm94Q29udGFpbmVyOiAnI2JveC1jb250YWluZXInXG4gICAgICB9LFxuICAgICAgZXZlbnRzOntcbiAgICAgICAgXCJzdWJtaXRcIjogXCJvbkZvcm1TdWJtaXRcIixcbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czoge1xuICAgICAgICBcImFjdGlvbjpjbGljazpjaGVja2JveFwiOiBcImNsaWNrQ2hlY2tib3hcIixcbiAgICAgIH0sXG4gICAgICBjbGlja0NoZWNrYm94OiBmdW5jdGlvbihjaGlsZCwgZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYoIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnKSApe1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnLCB0aGlzLm9wdGlvbnMuY2hlY2tlZCk7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZChcImFjdGlvbjpjbGljazpjaGVja2JveFwiLCB0aGlzLm9wdGlvbnMuY2hlY2tlZClcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czp7XG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlLFxuICAgICAgICBjaGVja0ljb25WaWV3OiBXb29kLkljb24sXG4gICAgICAgIGNoZWNrSWNvbk9wdGlvbnM6e1xuICAgICAgICAgIGljb246ICdjaGVjay1zcXVhcmUnLFxuICAgICAgICAgIGNvbG9yOiAnYmx1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgYm94SWNvblZpZXc6IFdvb2QuSWNvbkJ1dHRvbixcbiAgICAgICAgYm94SWNvbk9wdGlvbnM6e1xuICAgICAgICAgIGljb246ICdzcXVhcmUtbycsXG4gICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICBjbGlja0V2ZW50OiAnYWN0aW9uOmNsaWNrOmNoZWNrYm94J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY2hlY2sgPSBuZXcgdGhpcy5vcHRpb25zLmNoZWNrSWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNoZWNrSWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jaGVja0NvbnRhaW5lci5zaG93KGNoZWNrKTtcblxuICAgICAgICB2YXIgYm94ID0gbmV3IHRoaXMub3B0aW9ucy5ib3hJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYm94SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ib3hDb250YWluZXIuc2hvdyhib3gpO1xuXG4gICAgICAgIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnLCB0aGlzLm9wdGlvbnMuY2hlY2tlZCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5TZXBhcmF0b3IgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnd29vZC1zZXBhcmF0b3InLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgfSk7XG4gICAgLy9cbiAgICBXb29kLkljb25MaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtaWNvbi1saXN0JyxcbiAgICAgIGNoaWxkVmlldzogV29vZC5JY29uLFxuICAgICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIHJldHVybiBpdFxuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgICBnZXRWaWV3OiBmdW5jdGlvbihpZCl7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jaGlsZHJlbi5fdmlld3MgKXtcbiAgICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgICAgaWYoIGlkID09IGNoaWxkVmlldy5pZClcbiAgICAgICAgICAgIHJldHVybiBjaGlsZFZpZXc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5pbnB1dHMgPSB7fTtcblxucmVxdWlyZSgnLi90ZXh0LmpzJyk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLklucHV0ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgaW5wdXQnLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXBsYWNlaG9sZGVyXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC10ZXh0XCI+PCUtZmxvYXRpbmdMYWJlbFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGludC10ZXh0XCI+PCUtaGludFRleHQlPjwvZGl2PicgK1xuICAgICAgICAgICc8aW5wdXQgdHlwZT1cIjwlLXR5cGUlPlwiIHZhbHVlPVwiPCUtdmFsdWUlPlwiPjwvaW5wdXQ+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20taW5hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJlcnJvci10ZXh0XCIgY2xhc3M9XCJlcnJvci10ZXh0XCI+PC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAnY2hhbmdlIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5dXAgaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdrZXlkb3duIGlucHV0JzogJ3NldEZpbGxlZCcsXG4gICAgICAgICAgJ2ZvY3VzaW4gIGlucHV0JzogJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCBpbnB1dCc6ICdmb2N1c091dCdcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RmlsbGVkOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgICAgaWYoIHRoaXMudmFsdWUgPT0gJycgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGtleVByZXNzOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZXJyb3IoKTtcbiAgICAgICAgICBpZiggIWVycm9yICl7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmlucHV0OmNoYW5nZScsICFlcnJvcik7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kKCdpbnB1dCcpLnZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgIGlmKCBlcnJvciApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2VycmVkJyk7XG4gICAgICAgICAgICB0aGlzLiQoJyNlcnJvci10ZXh0JykudGV4dChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuaXNSZXF1aXJlZCAmJiB2YWx1ZSA9PSAnJyApe1xuICAgICAgICAgICAgZXJyb3IgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgICAgfSBlbHNlIGlmKCB0aGlzLm9wdGlvbnMuZXJyb3IgKXtcbiAgICAgICAgICAgIGVycm9yID0gdGhpcy5vcHRpb25zLmVycm9yKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuICFlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogJycsXG4gICAgICAgICAgaGludFRleHQ6ICcnLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJycsXG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG5cbiAgICAgICAgICBpZiggdGhpcy5vcHRpb25zLmZsb2F0aW5nTGFiZWxUZXh0IClcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdsYWJlbGVkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuc2V0RmlsbGVkKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZhbDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwodmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuSXRlbSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICd3b29kLWl0ZW0nLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJpdGVtLXdyYXBwZXJcIj4nICtcbiAgICAgICAgJzwlIGlmIChsZWZ0SWNvbikgeyAlPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwibGVmdC1pY29uLWNvbnRhaW5lclwiIGNsYXNzPVwibGVmdC1pY29uXCI+PC9kaXY+JyArXG4gICAgICAgICc8JX0lPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS1ib2R5XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByaW1hcnktdGV4dFwiPjwlLXByaW1hcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2Vjb25kYXJ5LXRleHRcIj48JS1zZWNvbmRhcnlUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzwlIGlmIChyaWdodEljb24pIHsgJT4nICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwicmlnaHQtaWNvbi1jb250YWluZXJcIiBjbGFzcz1cInJpZ2h0LWljb25cIj48L2Rpdj4nICtcbiAgICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJycpLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIGxlZnRJY29uQ29udGFpbmVyOiAnI2xlZnQtaWNvbi1jb250YWluZXInLFxuICAgICAgcmlnaHRJY29uQ29udGFpbmVyOiAnI3JpZ2h0LWljb24tY29udGFpbmVyJyxcbiAgICB9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBsZWZ0SWNvbjogZmFsc2UsXG4gICAgICBsZWZ0SWNvblZpZXc6IFdvb2QuQXZhdGFyLFxuICAgICAgbGVmdEljb25PcHRpb25zOiB7fSxcbiAgICAgIHByaW1hcnlUZXh0OiBudWxsLFxuICAgICAgc2Vjb25kYXJ5VGV4dDogbnVsbCxcbiAgICAgIHJpZ2h0SWNvbjogZmFsc2UsXG4gICAgICByaWdodEljb25WaWV3OiBudWxsLFxuICAgICAgcmlnaHRJY29uT3B0aW9uczoge31cbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZWZ0SWNvbikge1xuICAgICAgICB2YXIgbGVmdEljb24gPSBuZXcgdGhpcy5vcHRpb25zLmxlZnRJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMubGVmdEljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubGVmdEljb25Db250YWluZXIuc2hvdyhsZWZ0SWNvbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmlnaHRJY29uKSB7XG4gICAgICAgIHZhciByaWdodEljb24gPSBuZXcgdGhpcy5vcHRpb25zLnJpZ2h0SWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJpZ2h0SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yaWdodEljb25Db250YWluZXIuc2hvdyhyaWdodEljb24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuSXRlbUJ1dHRvbiA9IFdvb2QuSXRlbS5leHRlbmQoe1xuICAgIGF0dHJpYnV0ZXM6e1xuICAgICAgY2xhc3M6ICdidXR0b24nXG4gICAgfSxcbiAgICBldmVudHM6e1xuICAgICAgJ2NsaWNrJzogJ2NsaWNrJ1xuICAgIH0sXG4gICAgZGVmYXVsdHM6IF8uZXh0ZW5kKHt9LCBXb29kLkl0ZW0ucHJvdG90eXBlLmRlZmF1bHRzLCB7XG4gICAgICBjbGlja0V2ZW50OiAnYWN0aW9uOmNsaWNrOml0ZW0nLFxuICAgICAgY2xpY2tFdmVudEFyZzogbnVsbFxuICAgIH0pLFxuICAgIGNsaWNrOiBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCh0aGlzLm9wdGlvbnMuY2xpY2tFdmVudCwgdGhpcy5vcHRpb25zLmNsaWNrRXZlbnRBcmcpO1xuICAgIH0sXG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gIFdvb2QuRGl2aWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1kaXZpZGVyJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJyksXG4gIH0pO1xuXG4gIFdvb2QuTGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1saXN0JyxcbiAgICBjaGlsZEV2ZW50czoge1xuICAgIH0sXG4gICAgY2hpbGRWaWV3OiBXb29kLkl0ZW0sXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgnaXRlbVZpZXcnKSB8fCBDaGlsZFZpZXdDbGFzcztcbiAgICAgIHZhciBvcHRpb25zID0gY2hpbGQuZ2V0KCdpdGVtT3B0aW9ucycpO1xuXG4gICAgICAvLyBidWlsZCB0aGUgZmluYWwgbGlzdCBvZiBvcHRpb25zIGZvciB0aGUgY2hpbGRWaWV3IGNsYXNzXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICB9KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZCB2aWV3IGluc3RhbmNlXG4gICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAvLyByZXR1cm4gaXRcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMuaXRlbXMpO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24oV29vZCkge1xuICBXb29kLlJpcHBsZSA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgcmlwcGxlLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgJycpLFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLiRyaXBwbGVzID0gW107XG4gICAgfSxcbiAgICBweXRoYWdvcmFzOiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhNYXRoLnBvdyhhLDIpK01hdGgucG93KGIsMiksMC41KTtcbiAgICB9LFxuICAgIGNyZWF0ZVJpcHBsZTogZnVuY3Rpb24oY2xhc3NOYW1lLCB4LCB5KXtcbiAgICAgIHZhciAkcmlwcGxlID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAkcmlwcGxlLmFkZENsYXNzKCdjaXJjbGUgcmlwcGxlICcgKyBjbGFzc05hbWUpO1xuICAgICAgdmFyIGggPSB0aGlzLiRlbC5oZWlnaHQoKTtcbiAgICAgIHZhciB3ID0gdGhpcy4kZWwud2lkdGgoKTtcbiAgICAgIGlmKCB4ID09IHVuZGVmaW5lZCApe1xuICAgICAgICB4ID0gdy8yO1xuICAgICAgICB5ID0gaC8yO1xuICAgICAgfVxuICAgICAgdmFyIHIgPSB0aGlzLnB5dGhhZ29yYXMoTWF0aC5tYXgoeCx3LXgpLCBNYXRoLm1heCh5LGgteSkpO1xuICAgICAgJHJpcHBsZS5jc3Moe1xuICAgICAgICAndG9wJzogeSAtIHIsXG4gICAgICAgICdsZWZ0JzogeCAtIHIsXG4gICAgICAgICdoZWlnaHQnOiAyKnIsXG4gICAgICAgICd3aWR0aCc6IDIqclxuICAgICAgfSk7XG4gICAgICByZXR1cm4gJHJpcHBsZTtcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCl7XG4gICAgICBpZiggIXRoaXMuJHB1bHNlICAmJiB0aGlzLiRyaXBwbGVzLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgdmFyICRwdWxzZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwdWxzaW5nJyk7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkcHVsc2UpO1xuICAgICAgICB0aGlzLiRwdWxzZSA9ICRwdWxzZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpe1xuICAgICAgaWYoIHRoaXMuJHB1bHNlICl7XG4gICAgICAgIHRoaXMuZmFkZSh0aGlzLiRwdWxzZSwgMCk7XG4gICAgICAgIHRoaXMuJHB1bHNlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VEb3duOiBmdW5jdGlvbih4LCB5KXtcbiAgICAgIHZhciAkcmlwcGxlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3Byb3BhZ2F0aW5nJywgeCwgeSk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJHJpcHBsZSk7XG4gICAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gICAgfSxcbiAgICBtb3VzZU91dDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciAkcmlwcGxlID0gdGhpcy4kcmlwcGxlcy5wb3AoKTtcbiAgICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICAgIHRoaXMuZmFkZSgkcmlwcGxlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgICAgaWYoICRyaXBwbGUgKXtcbiAgICAgICAgdGhpcy4kcmlwcGxlcy5wdXNoKCRyaXBwbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3VzZURvd24oKTtcbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgc2VsZi5tb3VzZU91dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfSxcbiAgICBmYWRlOiBmdW5jdGlvbihyaXBwbGUsIGR1cmF0aW9uKXtcbiAgICAgIHZhciBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDogNTAwO1xuICAgICAgcmlwcGxlLmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCl7XG4gICAgICAgIHJpcHBsZS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlNwaW5uZXIgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd3b29kLXNwaW5uZXInLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPHN2ZyBjbGFzcz1cImNpcmN1bGFyXCIgdmlld0JveD1cIjwlLXIrNSU+IDwlLXIrNSU+IDwlLWQrMTAlPiA8JS1kKzEwJT5cIiBoZWlnaHQ9XCI8JS1kJT5cIiB3aWR0aD1cIjwlLWQlPlwiPicgK1xuICAgICAgICAgICAgJzxjaXJjbGUgY2xhc3M9XCJwYXRoXCIgY3g9XCI8JS1kKzEwJT5cIiBjeT1cIjwlLWQrMTAlPlwiIHI9XCI8JS1yYWRpdXMlPlwiIHN0cm9rZS13aWR0aD1cIjwlLXN0cm9rZVdpZHRoJT5cIi8+JyArXG4gICAgICAgICAgJzwvc3ZnPicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcmFkaXVzOiAyMCxcbiAgICAgICAgICBzdHJva2VXaWR0aDogMlxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmFkaXVzID0gdGhpcy5vcHRpb25zLnJhZGl1cztcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgcjogcmFkaXVzLFxuICAgICAgICAgICAgZDogcmFkaXVzICogMlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgb3ZlcmxheTogZnVuY3Rpb24gKCRlbCkge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gbmV3IFdvb2QuU3Bpbm5lcigpO1xuICAgICAgICB3aWRnZXQucmVuZGVyKCk7XG4gICAgICAgICRvdmVybGF5ID0gd2lkZ2V0LiRlbDtcbiAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ292ZXJsYXknKTtcblxuICAgICAgICAkZWwuYXBwZW5kKCRvdmVybGF5KTtcbiAgICAgICAgcmV0dXJuICRvdmVybGF5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ET1xuICAgIC8vIFdvb2QuSW5saW5lTG9hZGVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgIC8vICAgICB0YWdOYW1lOiAnaW1nJyxcbiAgICAvLyAgICAgYXR0cmlidXRlczoge1xuICAgIC8vICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pbWFnZXMvbG9hZGVycy9iYXIuZ2lmJyxcbiAgICAvLyAgICAgICAgIHN0eWxlOiAncG9zaXRpb246YWJzb2x1dGU7bWFyZ2luOmF1dG87dG9wOjA7Ym90dG9tOjA7J1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJylcbiAgICAvLyB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTQvMTIvMTUuXG4gKiBUT0RPIHJlbW92ZSBkYXRhdGFibGVzIGRlcGVuZGVuY3lcbiAqL1xuIChmdW5jdGlvbiAoV29vZCkge1xuICAgIFdvb2QuVGFibGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICd0YWJsZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGNsYXNzOiAndGFibGUgdGFibGUtc3RyaXBlZCcsXG4gICAgICAgICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBzdHlsZTogJ21pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTsnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlIGlmIChzaG93SGVhZGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzwlIGlmIChzaG93Rm9vdGVyKSB7ICU+JyArXG4gICAgICAgICAgICAgICAgJzx0Zm9vdD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikgeyAlPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGg+PCU9IGNvbHVtbi5kaXNwbGF5ICU+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8JSB9KTsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGZvb3Q+JyArXG4gICAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PidcbiAgICAgICAgKSxcbiAgICAgICAgY29sbGVjdERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG1vZGVsLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDb2x1bW5zOiBmdW5jdGlvbiAoc2NoZW1hKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgIC8vIGxvYWQgdGhlIGNvbHVtbiBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzY2hlbWFcbiAgICAgICAgICAgIGlmKHNjaGVtYSl7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHNjaGVtYS5jb2x1bW5zLCBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby52aXNpYmxlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGluZm8uZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5mby5kaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uRGVmczogZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciBkZWZzID0gW107XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9IGNvbC5yZW5kZXJlcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFOYW1lID0gY29sLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSBjb2wucmVuZGVyZXJPcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZGlzcGxheScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpZGdldCA9IHNlbGZbcmVuZGVyZXJdKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEsIHJlbmRlcmVyT3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZih3aWRnZXQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IGRhdGFOYW1lICsgJ18nICsgbWV0YS5yb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlcmVyc1tpZF0gPSB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwicmVuZGVyZXItY29udGFpbmVyIHdhaXRpbmdcIj48L3NwYW4+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEV4cG9ydERhdGE6IGZ1bmN0aW9uIChyZWNvcmQsIGZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRdO1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRfY29sdW1ucyA9IHNlbGYuZ2V0Q29sdW1ucyhzZWxmLmNvbGxlY3Rpb24ubW9kZWwucHJvdG90eXBlLnNjaGVtYSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2x1bW5GaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbHVtbnMgPSBfLmZpbHRlcihkZWZhdWx0X2NvbHVtbnMsIG9wdGlvbnMuY29sdW1uRmlsdGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGNvbGxlY3Rpb24gZm9yIHRoaXMgZGF0YXRhYmxlXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnMgPSB7fTtcbiAgICAgICAgICAgIHNlbGYuYmFzZVNlYXJjaCA9IG9wdGlvbnMuc2VhcmNoIHx8ICcnO1xuXG4gICAgICAgICAgICBzZWxmLnJvd0hlaWdodCA9IG9wdGlvbnMucm93SGVpZ2h0IHx8IDU5O1xuICAgICAgICAgICAgc2VsZi5tYXhWaXNpYmxlUm93cyA9IG9wdGlvbnMubWF4VmlzaWJsZVJvd3MgfHwgMTA7XG4gICAgICAgICAgICBzZWxmLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgICAgICAgICBzZWxmLmNvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnMgfHwgZGVmYXVsdF9jb2x1bW5zO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5EZWZzID0gb3B0aW9ucy5jb2x1bW5EZWZzIHx8IHNlbGYuZ2V0Q29sdW1uRGVmcyhzZWxmLmNvbHVtbnMpO1xuICAgICAgICAgICAgc2VsZi5zaG93SGVhZGVyID0gb3B0aW9ucy5zaG93SGVhZGVyIHx8IHRydWU7XG4gICAgICAgICAgICBzZWxmLnNob3dGb290ZXIgPSBvcHRpb25zLnNob3dGb290ZXIgfHwgZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmRhdGFUYWJsZU9wdGlvbnMgPSBvcHRpb25zLmRhdGFUYWJsZU9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBzZWxmLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcblxuXG4gICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUm93UmVuZGVyOiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJChyb3cpLmZpbmQoJy5yZW5kZXJlci1jb250YWluZXIud2FpdGluZycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkaG9sZGVyID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAkaG9sZGVyLnJlbW92ZUNsYXNzKCd3YWl0aW5nJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBzZWxmLnJlbmRlcmVyc1skaG9sZGVyLmF0dHIoJ2lkJyldO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEganF1ZXJ5IG9iamVjdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlciBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAkaG9sZGVyLmFwcGVuZChyZW5kZXJlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyIGEgYmFja2JvbmUgdmlld1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIuJGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB2aXJ0dWFsIG1ldGhvZFxuICAgICAgICB9LFxuICAgICAgICBvblNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSBkZWZhdWx0IGxvYWRlciBmb3IgdGhpcyB0YWJsZSB0byBsb2FkIGNvbGxlY3Rpb24gaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNjcm9sbFk6ICQod2luZG93KS5oZWlnaHQoKSAtIDM4NSxcbiAgICAgICAgICAgICAgICBzY3JvbGxYOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlZmVyUmVuZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvbTogJzxcInRpdGxlXCI+WlRmcnRpUycsXG4gICAgICAgICAgICAgICAgc2Nyb2xsQ29sbGFwc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zLFxuICAgICAgICAgICAgICAgIGNvbHVtbkRlZnM6IHRoaXMuY29sdW1uRGVmcyxcbiAgICAgICAgICAgICAgICByb3dDYWxsYmFjazogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYub25Sb3dSZW5kZXIocm93LCBkYXRhLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGxlcjoge1xuICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5QnVmZmVyOiAyXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4OiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2ssIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBuZXcgV29vZC5TcGlubmVyLm92ZXJsYXkoc2VsZi4kZWwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmQ6IHNlbGYuY29sdW1ucy5tYXAoZnVuY3Rpb24oYyl7cmV0dXJuIGMuZGF0YX0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtkYXRhOiBzZWxmLmNvbGxlY3REYXRhKCl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0YWJsZVRvb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNTd2ZQYXRoOiAnL2Fzc2V0cy9zd2YvY29weV9jc3ZfeGxzX3BkZi5zd2YnLFxuICAgICAgICAgICAgICAgICAgICBhQnV0dG9uczpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0V4dGVuZHM6ICdjc3YnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNCdXR0b25UZXh0OiAnRXhwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uQ2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgYnRuLXhzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkNlbGxSZW5kZXI6IGZ1bmN0aW9uICh2YWx1ZSwgY29sdW1uLCBkb21Sb3csIHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gc2VsZi5jb2xsZWN0aW9uLmF0KHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHNlbGYuY29sdW1uc1tjb2x1bW5dLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldEV4cG9ydERhdGEocmVjb3JkLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHRoaXMuJGVsLkRhdGFUYWJsZShfLmV4dGVuZChvcHRpb25zLCBzZWxmLmRhdGFUYWJsZU9wdGlvbnMpKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2VhcmNoKHRoaXMuYmFzZVNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUgPSBzZWxmLiRlbC5jbG9zZXN0KCcuZGF0YVRhYmxlc193cmFwcGVyJyk7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbignc2VhcmNoLmR0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOnNlYXJjaCcsIHNlbGYudGFibGUuc2VhcmNoKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdGFibGUgPSBzZWxmO1xuICAgICAgICAgICAgICAgIHNlbGYuJGRhdGFUYWJsZS5maW5kKCdkaXYudGl0bGUnKS5hcHBlbmQoc2VsZi50aXRsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzaXplSGVpZ2h0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG92ZXJsYXkgPSBXb29kLlNwaW5uZXIub3ZlcmxheSh0aGlzLiRlbCk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLmFqYXgucmVsb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc1RvdGFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXRIZWlnaHQ6IGZ1bmN0aW9uIChoZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuJGRhdGFUYWJsZS5maW5kKCcuZGF0YVRhYmxlc19zY3JvbGxCb2R5JykuY3NzKCdtYXgtaGVpZ2h0JywgaGVpZ2h0ICsgXCJweFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzaXplSGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2V0SGVpZ2h0KCQod2luZG93KS5oZWlnaHQoKSAtIDU3MClcbiAgICAgICAgfSxcbiAgICAgICAgdW5maWx0ZXJlZFJvd0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMudGFibGUucGFnZS5pbmZvKCk7XG4gICAgICAgICAgICByZXR1cm4gaW5mby5yZWNvcmRzRGlzcGxheTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBzaG93SGVhZGVyOiB0aGlzLnNob3dIZWFkZXIsXG4gICAgICAgICAgICAgICAgc2hvd0Zvb3RlcjogdGhpcy5zaG93Rm9vdGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRvb2xiYXIgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwid29vZC10b29sYmFyXCIsXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJytcbiAgICAgICAgJzxkaXYgaWQ9XCJsZWZ0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cImxlZnQtaWNvbnMtd3JhcHBlclwiPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PCUtdGl0bGUlPjwvZGl2PicgK1xuICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb25zLXdyYXBwZXJcIiBjbGFzcz1cInJpZ2h0LWljb25zLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBsZWZ0SWNvbnNDb250YWluZXI6IFwiI2xlZnQtaWNvbnMtd3JhcHBlclwiLFxuICAgICAgICByaWdodEljb25zQ29udGFpbmVyOiBcIiNyaWdodC1pY29ucy13cmFwcGVyXCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgJ2FjdGlvbjpjbGljazppY29uJzogXCJvbkNsaWNrSWNvblwiLFxuICAgICAgfSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgLnRpdGxlJzogJ29uQ2xpY2tUaXRsZScsXG4gICAgICB9LFxuICAgICAgb25DbGlja0ljb246IGZ1bmN0aW9uKGljb25WaWV3KXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCAnYWN0aW9uOmNsaWNrOmljb24nLCBpY29uVmlldyApO1xuICAgICAgfSxcbiAgICAgIG9uQ2xpY2tUaXRsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdhY3Rpb246Y2xpY2s6dGl0bGUnKTtcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBsZWZ0SWNvbnM6IFtdLFxuICAgICAgICByaWdodEljb25zOiBbXSxcbiAgICAgICAgdGl0bGU6ICdUb29sYmFyJyxcbiAgICAgICAgY29sb3I6ICdibGFjaycsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXktbGlnaHQnLFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRJY29uOiBmdW5jdGlvbihpY29uSWQpe1xuICAgICAgICB2YXIgYSA9IHRoaXMubGVmdEljb25zQ29udGFpbmVyLmN1cnJlbnRWaWV3LmdldFZpZXcoaWNvbklkKTtcbiAgICAgICAgdmFyIGIgPSB0aGlzLnJpZ2h0SWNvbnNDb250YWluZXIuY3VycmVudFZpZXcuZ2V0VmlldyhpY29uSWQpO1xuICAgICAgICByZXR1cm4gYSB8fCBiO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjb2xvci0nK3RoaXMub3B0aW9ucy5jb2xvcik7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdiYWNrZ3JvdW5kQ29sb3ItJyt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKTtcblxuICAgICAgICB2YXIgbGVmdEljb25MaXN0ID0gbmV3IFdvb2QuSWNvbkxpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5sZWZ0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxlZnRJY29uc0NvbnRhaW5lci5zaG93KGxlZnRJY29uTGlzdCk7XG5cbiAgICAgICAgdmFyIHJpZ2h0SWNvbkxpc3QgPSBuZXcgV29vZC5JY29uTGlzdCh7XG4gICAgICAgICAgY29sbGVjdGlvbjogbmV3IEJhY2tib25lLkNvbGxlY3Rpb24odGhpcy5vcHRpb25zLnJpZ2h0SWNvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJpZ2h0SWNvbnNDb250YWluZXIuc2hvdyhyaWdodEljb25MaXN0KTtcbiAgICAgIH0sXG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDMvMTEvMTUuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICBXb29kLlRvb2x0aXAgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBjbGFzczogJ3dvb2QgdG9vbHRpcC1hbmNob3Itd3JhcHBlcicsXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1hbmNob3JcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLXdyYXBwZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIndvb2QtdG9vbHRpcFwiPjwlLSB0ZXh0ICU+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAnJyksXG4gICAgZGVmYXVsdHM6e1xuICAgICAgdGV4dDogJydcbiAgICB9LFxuICAgIGZvY3VzSW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICB9LFxuICAgIGZvY3VzT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiA0LzUvMTYuXG4gKi9cbihmdW5jdGlvbihXb29kKSB7XG4gIFdvb2QuQnJhbmNoID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWJyYW5jaFwiLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgaWQ9XCJ0cmVlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICcnKSxcbiAgICBjaGlsZEV2ZW50czp7XG4gICAgfSxcbiAgICByZWdpb25zOiB7XG4gICAgICB0cmVlQ29udGFpbmVyOiBcIiN0cmVlLWNvbnRhaW5lclwiLFxuICAgIH0sXG4gICAgZGVmYXVsdHM6IHtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy50cmVlID0gdGhpcy5vcHRpb25zLnRyZWVcbiAgICB9LFxuICAgIGdldFRyZWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy50cmVlLmdldFRyZWUodGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIGJ1YmJsZUNoaWxkRXZlbnQ6IGZ1bmN0aW9uKGNoaWxkRXZlbnROYW1lKXtcbiAgICAgIHRoaXMuY2hpbGRFdmVudHNbY2hpbGRFdmVudE5hbWVdID0gZnVuY3Rpb24oY2hpbGQsIGFyZ3Mpe1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoY2hpbGRFdmVudE5hbWUsIGFyZ3MpXG4gICAgICB9XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdHJlZSA9IHRoaXMuZ2V0VHJlZSgpO1xuICAgICAgdGhpcy50cmVlQ29udGFpbmVyLnNob3codHJlZSk7XG5cbiAgICAgIGZvciggY2hpbGRFdmVudE5hbWUgaW4gdHJlZS5jaGlsZEV2ZW50cyApe1xuICAgICAgICB0aGlzLmJ1YmJsZUNoaWxkRXZlbnQoY2hpbGRFdmVudE5hbWUpXG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5CcmFuY2hlcyA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtYnJhbmNoZXNcIixcbiAgICBjaGlsZFZpZXc6IFdvb2QuQnJhbmNoLFxuICAgIGJ1aWxkQ2hpbGRWaWV3OiBmdW5jdGlvbihjaGlsZCwgQ2hpbGRWaWV3Q2xhc3MsIGNoaWxkVmlld09wdGlvbnMpe1xuICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgdmFyIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgY2hpbGRWaWV3T3B0aW9ucywgY2hpbGQuYXR0cmlidXRlcywge1xuICAgICAgICB0cmVlOiB0aGlzLnRyZWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkIHZpZXcgaW5zdGFuY2VcbiAgICAgIHZhciB2aWV3ID0gbmV3IENoaWxkVmlld0NsYXNzKG9wdGlvbnMpO1xuXG4gICAgICAvLyByZXR1cm4gaXRcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH0sXG4gICAgZXZlbnRzOiB7fSxcbiAgICBkZWZhdWx0czoge1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnRyZWUgPSB0aGlzLm9wdGlvbnMudHJlZTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbil7XG4gICAgICByZXR1cm4gdGhpcy50cmVlLmZpbHRlcihjaGlsZCwgaW5kZXgsIGNvbGxlY3Rpb24pXG4gICAgfVxuICB9KTtcblxuICBXb29kLlRyZWUgPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiBcIndvb2QtdHJlZVwiLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgJzxkaXYgY2xhc3M9XCJ0cmVlLXdyYXBwZXJcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0d2lnXCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGlkPVwiaXRlbS1jb250YWluZXJcIiBjbGFzcz1cIml0ZW0tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBpZD1cImNoaWxkcmVuLWNvbnRhaW5lclwiIGNsYXNzPVwiY2hpbGRyZW4tY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgJycpLFxuICAgIHJlZ2lvbnM6IHtcbiAgICAgIGl0ZW1Db250YWluZXI6IFwiI2l0ZW0tY29udGFpbmVyXCIsXG4gICAgICBjaGlsZHJlbkNvbnRhaW5lcjogXCIjY2hpbGRyZW4tY29udGFpbmVyXCIsXG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBpdGVtVmlldzogV29vZC5JdGVtLFxuICAgICAgaXRlbU9wdGlvbnM6IHt9LFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24oY2hpbGQsIGluZGV4LCBjb2xsZWN0aW9uKXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZ2V0Q29sbGVjdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMuY2hpbGRyZW4pO1xuICAgIH0sXG4gICAgZ2V0SXRlbTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5vcHRpb25zLml0ZW1WaWV3KHRoaXMub3B0aW9ucy5pdGVtT3B0aW9ucyk7XG4gICAgfSxcbiAgICBnZXRUcmVlOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIHJldHVybiBuZXcgV29vZC5UcmVlKG9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oKTtcbiAgICAgIHRoaXMuaXRlbUNvbnRhaW5lci5zaG93KGl0ZW0pO1xuXG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLmdldENvbGxlY3Rpb24oKTtcbiAgICAgIGlmKCB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCApe1xuICAgICAgICB2YXIgYnJhbmNoZXMgPSBuZXcgV29vZC5CcmFuY2hlcyh7XG4gICAgICAgICAgdHJlZTogdGhpcyxcbiAgICAgICAgICBjb2xsZWN0aW9uIDogdGhpcy5jb2xsZWN0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoaWxkcmVuQ29udGFpbmVyLnNob3coYnJhbmNoZXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuQXJib3Jpc3QgPSBXb29kLlRyZWUuZXh0ZW5kKHtcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCwgY29sbGVjdGlvbil7XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbi5nZXQodGhpcy5vcHRpb25zLnJvb3QpO1xuICAgICAgcmV0dXJuIGNoaWxkLmdldCgncGFyZW50JykgPT0gbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH0sXG4gICAgZ2V0Q29sbGVjdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICB9LFxuICAgIGdldEl0ZW06IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzLm9wdGlvbnMuY29sbGVjdGlvbi5nZXQodGhpcy5vcHRpb25zLnJvb3QpXG4gICAgICByZXR1cm4gbmV3IFdvb2QuSXRlbSh7XG4gICAgICAgIHByaW1hcnlUZXh0OiBtb2RlbC5nZXQoJ2lkJyksXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0VHJlZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICByZXR1cm4gbmV3IFdvb2QuQXJib3Jpc3Qoe1xuICAgICAgICByb290OiBvcHRpb25zLmlkLFxuICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmNvbGxlY3Rpb25cbiAgICAgIH0pO1xuICAgIH0sXG4gIH0pO1xuXG5cbn0pKHdpbmRvdy5Xb29kKTtcbiJdfQ==
