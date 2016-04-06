(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');
// require('./banner');

require('./avatar');
require('./button');
require('./card');
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
require('./tree');

},{"./avatar":2,"./button":3,"./card":4,"./dialog":5,"./form":6,"./icon":7,"./inputs/all":8,"./item":10,"./ripple":11,"./spinner":12,"./table":13,"./toolbar":14,"./tooltip":15,"./tree":16}],2:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
      clickCheckbox: function(){
        if( this.$el.attr('checked') ){
          this.$el.attr('checked', null);
        }else{
          this.$el.attr('checked', true);
        }
      },
      defaults:{
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
      },
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

},{}],8:[function(require,module,exports){
Wood.inputs = {};

require('./text.js');
// require('./combo.js');
// require('./checkbox.js');
// require('./groupcombo.js');
// require('./popovercombo.js');

},{"./text.js":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
})(window.Wood);

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
/**
 * Created by danmurray on 4/5/16.
 */
(function(Wood) {
  Wood.Branch = Marionette.LayoutView.extend({
    tagName: "wood-branch",
    template: _.template(
      '<div id="tree-container"></div>' +
    ''),
    regions: {
      treeContainer: "#tree-container",
    },
    events: {},
    defaults: {
    },
    initialize: function(options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onRender: function() {
      var treeView = new Wood.Tree(this.options);
      this.treeContainer.show(treeView);
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
      var options = _.extend({
        // branches: this.options.branches,
      }, childViewOptions, child.attributes);

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
    },
    onRender: function() {
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {

      });
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
    onRender: function() {
      var item = new this.options.itemView(this.options.itemOptions);
      this.itemContainer.show(item);

      if( this.options.children && this.options.children.length > 0 ){
        var branches = new Wood.Branches({
          collection : new Backbone.Collection(this.options.children)
        });
        this.childrenContainer.show(branches);
      }
    },
    templateHelpers: function() {
      return _.extend({}, this.options, {

      });
    }
  });


})(window.Wood);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9idXR0b24uanMiLCJzcmMvanMvY2FyZC5qcyIsInNyYy9qcy9kaWFsb2cuanMiLCJzcmMvanMvZm9ybS5qcyIsInNyYy9qcy9pY29uLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiLCJzcmMvanMvaXRlbS5qcyIsInNyYy9qcy9yaXBwbGUuanMiLCJzcmMvanMvc3Bpbm5lci5qcyIsInNyYy9qcy90YWJsZS5qcyIsInNyYy9qcy90b29sYmFyLmpzIiwic3JjL2pzL3Rvb2x0aXAuanMiLCJzcmMvanMvdHJlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuV29vZCA9IHt9O1xuXG4vLyBpbmNsdWRlIGJhc2UgY29tbW9uIHdpZGdldHNcbnJlcXVpcmUoJy4vaW5wdXRzL2FsbCcpO1xuLy8gcmVxdWlyZSgnLi9iYW5uZXInKTtcblxucmVxdWlyZSgnLi9hdmF0YXInKTtcbnJlcXVpcmUoJy4vYnV0dG9uJyk7XG5yZXF1aXJlKCcuL2NhcmQnKTtcbi8vIHJlcXVpcmUoJy4vYnV0dG9uJyk7XG5yZXF1aXJlKCcuL2RpYWxvZycpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG5yZXF1aXJlKCcuL2ljb24nKTtcbnJlcXVpcmUoJy4vaXRlbScpO1xuLy8gcmVxdWlyZSgnLi9sYWJlbCcpO1xucmVxdWlyZSgnLi9zcGlubmVyJyk7XG4vLyByZXF1aXJlKCcuL3F1aWNrc2VhcmNoJyk7XG4vLyByZXF1aXJlKCcuL3JlY29yZHRhYmxlJyk7XG5yZXF1aXJlKCcuL3JpcHBsZScpO1xucmVxdWlyZSgnLi90YWJsZScpO1xucmVxdWlyZSgnLi90b29sdGlwJyk7XG5yZXF1aXJlKCcuL3Rvb2xiYXInKTtcbnJlcXVpcmUoJy4vdHJlZScpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLkF2YXRhciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6IFwid29vZC1hdmF0YXJcIixcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFwZSA8JS1zaGFwZSU+IGNvbG9yLTwlLWNvbG9yJT4gYmFja2dyb3VuZENvbG9yLTwlLWJhY2tncm91bmRDb2xvciU+XCI+JyArXG4gICAgICAgICAgICAnPCUgaWYgKGltYWdlKSB7ICU+JyArXG4gICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiaW1nXCIgc3JjPVwiPCUtaW1hZ2UlPlwiPjwvaW1nPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGljb24pIHslPicgK1xuICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJpY29uIGZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGxldHRlcikgeyU+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxldHRlclwiPjwlLWxldHRlciU+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGltYWdlOiBudWxsLFxuICAgICAgICAgIGljb246IG51bGwsXG4gICAgICAgICAgbGV0dGVyOiBudWxsLFxuICAgICAgICAgIHNoYXBlOiBudWxsLFxuICAgICAgICAgIGNvbG9yOiAnaW5oZXJpdCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnaW5oZXJpdCdcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDIvMTcvMTYuXG4gKi9cbihmdW5jdGlvbiAoV29vZCkge1xuICAgIHZhciBMYWJlbCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtbGFiZWwnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImljb24tY29udGFpbmVyXCIgY2xhc3M9XCJpY29uLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidGV4dC13cmFwcGVyXCI+PCUtdGV4dCU+PC9zcGFuPicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczoge1xuICAgICAgICBpY29uQ29udGFpbmVyOiAnI2ljb24tY29udGFpbmVyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgdGV4dDogJ0J1dHRvbicsXG4gICAgICB9LFxuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaWNvbiApe1xuICAgICAgICAgIHZhciB2aWV3ID0gdGhpcy5vcHRpb25zLmljb24udmlldztcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy5pY29uLm9wdGlvbnM7XG4gICAgICAgICAgdmFyIGljb25WaWV3ID0gbmV3IHZpZXcob3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy5pY29uQ29udGFpbmVyLnNob3coaWNvblZpZXcpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB2YXIgQnV0dG9uID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICdidXR0b24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGJ1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGlkPVwicmlwcGxlLWNvbnRhaW5lclwiIGNsYXNzPVwicmlwcGxlLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwibGFiZWwtY29udGFpbmVyXCIgY2xhc3M9XCJsYWJlbC13cmFwcGVyXCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgICBsYWJlbENvbnRhaW5lcjogJyNsYWJlbC1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2ZvY3VzaW4nOiAgJ2ZvY3VzSW4nLFxuICAgICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICAgJ21vdXNlZG93bic6J21vdXNlRG93bicsXG4gICAgICAgICAgJ21vdXNlb3V0JzogJ21vdXNlT3V0JyxcbiAgICAgICAgICAnY2xpY2snOiAgICAnY2xpY2snXG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9jdXNPdXQgOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLmZvY3VzT3V0KClcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB2YXIgeCA9IGUucGFnZVggLSB0aGlzLiRlbC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgIHZhciB5ID0gZS5wYWdlWSAtIHRoaXMuJGVsLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgICAgcmlwcGxlLm1vdXNlRG93bih4LCB5KTtcbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIHJpcHBsZSA9IHRoaXMucmlwcGxlQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICAgIHJpcHBsZS5tb3VzZU91dCgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgICByaXBwbGUuY2xpY2soKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgbGFiZWw6ICdCdXR0b24nLFxuICAgICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiggZGlzYWJsZWQgKXtcbiAgICAgICAgICBpZiggIXRoaXMuX3NhdmluZyApe1xuICAgICAgICAgICAgdGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCBkaXNhYmxlZCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZSh0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgICAgdGhpcy5yaXBwbGVDb250YWluZXIuc2hvdyhyaXBwbGUpO1xuXG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmRpc2FibGUodHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICB2aWV3OiBXb29kLlNwaW5uZXIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IDEyLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiA2LFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuX3NhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShmYWxzZSk7XG4gICAgICAgICAgdmFyIGxhYmVsID0gbmV3IExhYmVsKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5sYWJlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMubGFiZWxDb250YWluZXIuc2hvdyhsYWJlbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy5fc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKGZhbHNlKTtcbiAgICAgICAgICB2YXIgbGFiZWwgPSBuZXcgTGFiZWwoe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLmxhYmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5sYWJlbENvbnRhaW5lci5zaG93KGxhYmVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUNsaWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMuc3RhdGVDaGFuZ2UoJ3NhdmluZycpO1xuICAgICAgICAgIC8vIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOnNhdmVCdXR0b25DbGljaycpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0ZUNoYW5nZTogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICAgIC8vIGlmKCB0aGlzLnN0YXRlICE9IHN0YXRlKXtcbiAgICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBXb29kLkZsYXRCdXR0b24gPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnd29vZCBidXR0b24gZmxhdCcsXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFdvb2QuUmFpc2VkQnV0dG9uID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3dvb2QgYnV0dG9uIHJhaXNlZCcsXG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5Xb29kKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8xNy8xNi5cbiAqL1xuKGZ1bmN0aW9uKFdvb2QpIHtcbiAgV29vZC5DYXJkID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWNhcmRcIixcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXJcIj4nICtcbiAgICAgICc8ZGl2IGlkPVwiYXZhdGFyLXdyYXBwZXJcIiBjbGFzcz1cImF2YXRhci13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PCUtcHJpbWFyeVRleHQlPjwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgaWQ9XCJjYXJkLWNvbnRlbnRcIiBjbGFzcz1cImNhcmQtY29udGVudFwiPjwvZGl2PicgK1xuICAgICAgJzxkaXYgaWQ9XCJjYXJkLWZvb3RlclwiIGNsYXNzPVwiY2FyZC1mb290ZXJcIj48L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBjYXJkSGVhZGVyOiBcIiNjYXJkLWhlYWRlclwiLFxuICAgICAgYXZhdGFyOiBcIiNhdmF0YXItd3JhcHBlclwiLFxuICAgICAgY2FyZENvbnRlbnQ6IFwiI2NhcmQtY29udGVudFwiLFxuICAgICAgY2FyZEZvb3RlcjogXCIjY2FyZC1mb290ZXJcIixcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIHByaW1hcnlUZXh0OiAnQ2FyZCcsXG4gICAgICBoZWFkZXJWaWV3OiBudWxsLFxuICAgICAgaGVhZGVyT3B0aW9uczoge1xuICAgICAgICBpY29uOiAncXVlc3Rpb24nLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZSdcbiAgICAgIH0sXG4gICAgICBjb250ZW50VmlldzogbnVsbCxcbiAgICAgIGNvbnRlbnRPcHRpb25zOiB7fSxcbiAgICAgIGZvb3RlclZpZXc6IG51bGwsXG4gICAgICBmb290ZXJPcHRpb25zOiB7fVxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBvblJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXZhdGFyID0gbmV3IFdvb2QuQXZhdGFyKHRoaXMub3B0aW9ucy5oZWFkZXJPcHRpb25zKTtcbiAgICAgIHRoaXMuYXZhdGFyLnNob3coYXZhdGFyKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250ZW50Vmlldykge1xuICAgICAgICB2YXIgY29udGVudCA9IG5ldyB0aGlzLm9wdGlvbnMuY29udGVudFZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnRPcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2FyZENvbnRlbnQuc2hvdyhjb250ZW50KTtcbiAgICAgIH1cblxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG5cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZGFubXVycmF5IG9uIDE0LzEyLzE1LlxuICovXG4oZnVuY3Rpb24gKGtleXMpIHtcbiAgICBXb29kLkRpYWxvZyA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1kaWFsb2cnLFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgnJyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cImRpYWxvZy1jb250ZW50LWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgICAgIGRpYWxvZ0NvbnRlbnRDb250YWluZXI6ICcjZGlhbG9nLWNvbnRlbnQtY29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdHM6e1xuICAgICAgICAgIHRpdGxlOiAnRGlhbG9nJ1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgdGhpcy5kaWFsb2cgPSBuZXcgQm9vdHN0cmFwRGlhbG9nKHtcbiAgICAgICAgICAgICAgdHlwZTogQm9vdHN0cmFwRGlhbG9nLlRZUEVfUFJJTUFSWSxcbiAgICAgICAgICAgICAgc2l6ZTogQm9vdHN0cmFwRGlhbG9nLlNJWkVfTk9STUFMLFxuICAgICAgICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIHZhciBkaWFsb2dDb250ZW50ID0gdGhpcy5vcHRpb25zLmRpYWxvZ0NvbnRlbnQ7XG4gICAgICAgICAgLy8gaWYoIGRpYWxvZ0NvbnRlbnQgKXt9XG4gICAgICAgICAgLy8gICB0aGlzLmRpYWxvZ0NvbnRlbnRDb250YWluZXIuc2hvdyhuZXcgZGlhbG9nQ29udGVudC52aWV3KGRpYWxvZ0NvbnRlbnQub3B0aW9ucykpO1xuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cuc2V0VGl0bGUodGhpcy5vcHRpb25zLnRpdGxlKTtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLnNldE1lc3NhZ2UodGhpcy4kZWwpXG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgaWYodGhpcy5vbkNsb3NlKVxuICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKVxuICAgICAgICB9LFxuICAgIH0sIHtcbiAgICAgIHNob3c6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB3aWRnZXQgPSBuZXcgdGhpcyhvcHRpb25zKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICB3aWRnZXQub3BlbigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgV29vZC5Gb3JtRGlhbG9nID0gV29vZC5EaWFsb2cuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWZvcm0tZGlhbG9nJyxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgdGl0bGU6ICdEaWFsb2cnLFxuICAgICAgICBmb3JtT3B0aW9uczoge31cbiAgICAgIH0sXG4gICAgICBjaGlsZEV2ZW50czp7XG4gICAgICAgIFwiYWN0aW9uOnN1Ym1pdDpmb3JtXCI6IFwic3VibWl0XCJcbiAgICAgIH0sXG4gICAgICBzdWJtaXQ6IGZ1bmN0aW9uKGZvcm1WaWV3LCBkYXRhKXtcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5vblN1Ym1pdCApe1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vblN1Ym1pdCh0aGlzLCBmb3JtVmlldywgZGF0YSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSBuZXcgV29vZC5Gb3JtKHRoaXMub3B0aW9ucy5mb3JtT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGlhbG9nQ29udGVudENvbnRhaW5lci5zaG93KGZvcm0pO1xuICAgICAgfSxcbiAgICB9KTtcbn0pKHdpbmRvdy5rZXlzKTtcbiIsIihmdW5jdGlvbiAodG9vbGJveCkge1xuICBXb29kLklucHV0TGlzdCA9IE1hcmlvbmV0dGUuQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgICBjaGlsZEV2ZW50czoge1xuICAgICAgXCJhY3Rpb246aW5wdXQ6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgIH0sXG4gICAgb25JbnB1dENoYW5nZTogZnVuY3Rpb24oaW5wdXRWaWV3LCB2YWxpZCl7XG4gICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dHM6Y2hhbmdlJywgIXRoaXMuZXJyb3IoKSk7XG4gICAgfSxcbiAgICBjaGlsZFZpZXc6IFdvb2QuSW5wdXQsXG4gICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICB2YXIgaWQgPSBjaGlsZC5nZXQoJ2lkJyk7XG4gICAgICB2YXIgdmlldyA9IGNoaWxkLmdldCgndmlldycpO1xuICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5nZXQoaWQpIDogJyc7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe30sIGNoaWxkVmlld09wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcblxuICAgICAgLy8gcmV0dXJuIGl0XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGRhdGFbY2hpbGRWaWV3LmlkXSA9IGNoaWxkVmlldy5nZXRWYWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmNoaWxkcmVuLl92aWV3cyApe1xuICAgICAgICB2YXIgY2hpbGRWaWV3ID0gdGhpcy5jaGlsZHJlbi5fdmlld3NbaV07XG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgY2hpbGRWaWV3LmVycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSxcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWxpZCA9IHRydWU7XG4gICAgICBmb3IoIHZhciBpIGluIHRoaXMuY2hpbGRyZW4uX3ZpZXdzICl7XG4gICAgICAgIHZhciBjaGlsZFZpZXcgPSB0aGlzLmNoaWxkcmVuLl92aWV3c1tpXTtcbiAgICAgICAgdmFyIGNoaWxkVmFsaWQgPSBjaGlsZFZpZXcudmFsaWRhdGUoKTtcbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiBjaGlsZFZhbGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH1cbiAgfSk7XG5cbiAgV29vZC5Gb3JtID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnZm9ybScsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGZvcm0nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cImlucHV0LWxpc3QtY29udGFpbmVyXCIgY2xhc3M9XCJpbnB1dC1saXN0XCI+PC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuc1wiPicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwic3VibWl0LWJ0blwiIGNsYXNzPVwic3VibWl0LWJ0blwiPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOiB7XG4gICAgICAgIGlucHV0TGlzdENvbnRhaW5lcjogJyNpbnB1dC1saXN0LWNvbnRhaW5lcicsXG4gICAgICAgIHN1Ym1pdEJ0bkNvbnRhaW5lcjogJyNzdWJtaXQtYnRuJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czp7XG4gICAgICAgIFwic3VibWl0XCI6IFwib25Gb3JtU3VibWl0XCIsXG4gICAgICB9LFxuICAgICAgY2hpbGRFdmVudHM6IHtcbiAgICAgICAgXCJhY3Rpb246Y2xpY2s6YnV0dG9uXCI6IFwic3VibWl0Rm9ybVwiLFxuICAgICAgICBcImFjdGlvbjppbnB1dHM6Y2hhbmdlXCI6IFwib25JbnB1dENoYW5nZVwiLFxuICAgICAgfSxcbiAgICAgIG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGlucHV0TGlzdFZpZXcsIHZhbGlkKXtcbiAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuc3VibWl0QnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3O1xuICAgICAgICBzdWJtaXRCdXR0b24uZGlzYWJsZSghdmFsaWQpO1xuICAgICAgfSxcbiAgICAgIG9uRm9ybVN1Ym1pdDogZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zdWJtaXRGb3JtKCk7XG4gICAgICB9LFxuICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmdldERhdGEoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRMaXN0Q29udGFpbmVyLmN1cnJlbnRWaWV3LmVycm9yKCk7XG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5jdXJyZW50Vmlldy52YWxpZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGUpe1xuICAgICAgICBpZiggdGhpcy52YWxpZGF0ZSgpICl7XG4gICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzdWJtaXQ6Zm9ybScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIGlucHV0czogW10sXG4gICAgICAgIHN1Ym1pdEJ1dHRvbjoge1xuICAgICAgICAgIGxhYmVsOiAnU3VibWl0J1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaW5wdXRMaXN0ID0gbmV3IFdvb2QuSW5wdXRMaXN0KHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5vcHRpb25zLm1vZGVsLFxuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5pbnB1dHMpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0TGlzdENvbnRhaW5lci5zaG93KGlucHV0TGlzdCk7XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24pe1xuICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgV29vZC5SYWlzZWRCdXR0b24oe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMub3B0aW9ucy5zdWJtaXRCdXR0b24ubGFiZWwsXG4gICAgICAgICAgICBkaXNhYmxlZDogISF0aGlzLmVycm9yKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvblNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICB9LFxuICAgICAgb25Qb3N0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gdGhpcy5zdWJtaXRCdG5Db250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5vblBvc3QoKTtcbiAgICAgIH0sXG4gICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uU3VjY2VzcygpO1xuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgc3VibWl0QnV0dG9uLm9uRXJyb3IoKTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgfSk7XG5cbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMi8yNi8xNS5cbiAqL1xuIChmdW5jdGlvbiAodG9vbGJveCkge1xuICAgIFdvb2QuSWNvbiA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1pY29uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgICB9LFxuICAgICAgICBpY29uVGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAnZmEnOiAnPGkgY2xhc3M9XCJmYSBmYS1pY29uIGZhLTwlLWljb24lPiBjb2xvci08JS1jb2xvciU+XCI+PC9pPicsXG4gICAgICAgICAgICAnbWF0ZXJpYWwnOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBjb2xvci08JS1jb2xvciU+XCI+PCUtaWNvbiU+PC9pPidcbiAgICAgICAgfSxcbiAgICAgICAgaWNvblRlbXBsYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0aGlzLmljb25UZW1wbGF0ZXNbdGhpcy5vcHRpb25zLmljb25DbGFzc10pKG9wdGlvbnMpXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czp7XG4gICAgICAgICAgICBpY29uQ2xhc3M6ICdmYScsXG4gICAgICAgICAgICBpY29uOiAnY2lyY2xlLXRoaW4nLFxuICAgICAgICAgICAgY29sb3I6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHRvb2x0aXA6IGZhbHNlLFxuICAgICAgICAgICAgY2xpY2tFdmVudDogJ2FjdGlvbjpjbGljazppY29uJ1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBpY29uVGVtcGxhdGU6IHRoaXMuaWNvblRlbXBsYXRlKHRoaXMub3B0aW9ucylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgV29vZC5JY29uQnV0dG9uID0gV29vZC5JY29uLmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiAnYnV0dG9uJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kLWljb24nLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAnPGRpdiBpZD1cInJpcHBsZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwlPSBpY29uVGVtcGxhdGUgJT4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJ0b29sdGlwLWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgJycpLFxuICAgICAgcmVnaW9uczp7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lcjogJyNyaXBwbGUtY29udGFpbmVyJyxcbiAgICAgICAgdG9vbHRpcENvbnRhaW5lcjogJyN0b29sdGlwLWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICAnZm9jdXNpbic6ICAnZm9jdXNJbicsXG4gICAgICAgICdmb2N1c291dCc6ICdmb2N1c091dCcsXG4gICAgICAgICdtb3VzZWRvd24nOiAnbW91c2VEb3duJyxcbiAgICAgICAgJ21vdXNlbGVhdmUnOidtb3VzZU91dCcsXG4gICAgICAgICdjbGljayc6ICAgICdjbGljaydcbiAgICAgIH0sXG4gICAgICBmb2N1c0luIDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzSW4oKTtcbiAgICAgICAgaWYoIHRoaXMudG9vbHRpcCApe1xuICAgICAgICAgIHRoaXMudG9vbHRpcC5mb2N1c0luKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLmZvY3VzT3V0KCk7XG4gICAgICAgIGlmKCB0aGlzLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAuZm9jdXNPdXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbW91c2VEb3duOiBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5tb3VzZURvd24oKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZU91dDogZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByaXBwbGUgPSB0aGlzLnJpcHBsZUNvbnRhaW5lci5jdXJyZW50VmlldztcbiAgICAgICAgcmlwcGxlLm1vdXNlT3V0KCk7XG4gICAgICB9LFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgcmlwcGxlID0gdGhpcy5yaXBwbGVDb250YWluZXIuY3VycmVudFZpZXc7XG4gICAgICAgIHJpcHBsZS5jbGljaygpO1xuICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QodGhpcy5vcHRpb25zLmNsaWNrRXZlbnQpO1xuICAgICAgfSxcbiAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcmlwcGxlID0gbmV3IFdvb2QuUmlwcGxlKCk7XG4gICAgICAgIHRoaXMucmlwcGxlQ29udGFpbmVyLnNob3cocmlwcGxlKTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnRvb2x0aXAgKXtcbiAgICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgV29vZC5Ub29sdGlwKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy50b29sdGlwXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50b29sdGlwQ29udGFpbmVyLnNob3codGhpcy50b29sdGlwKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFdvb2QuQ2hlY2tib3ggPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgIHRhZ05hbWU6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY2xhc3M6ICd3b29kLWNoZWNrYm94JyxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjaGVjay13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJjaGVjay1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImJveC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgaWQ9XCJib3gtY29udGFpbmVyXCI+PC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICAgIHJlZ2lvbnM6e1xuICAgICAgICBjaGVja0NvbnRhaW5lcjogJyNjaGVjay1jb250YWluZXInLFxuICAgICAgICBib3hDb250YWluZXI6ICcjYm94LWNvbnRhaW5lcidcbiAgICAgIH0sXG4gICAgICBldmVudHM6e1xuICAgICAgICBcInN1Ym1pdFwiOiBcIm9uRm9ybVN1Ym1pdFwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgIFwiYWN0aW9uOmNsaWNrOmNoZWNrYm94XCI6IFwiY2xpY2tDaGVja2JveFwiLFxuICAgICAgfSxcbiAgICAgIGNsaWNrQ2hlY2tib3g6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJykgKXtcbiAgICAgICAgICB0aGlzLiRlbC5hdHRyKCdjaGVja2VkJywgbnVsbCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHRoaXMuJGVsLmF0dHIoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRzOntcbiAgICAgICAgY2hlY2tJY29uVmlldzogV29vZC5JY29uLFxuICAgICAgICBjaGVja0ljb25PcHRpb25zOntcbiAgICAgICAgICBpY29uOiAnY2hlY2stc3F1YXJlJyxcbiAgICAgICAgICBjb2xvcjogJ2JsdWUnXG4gICAgICAgIH0sXG4gICAgICAgIGJveEljb25WaWV3OiBXb29kLkljb25CdXR0b24sXG4gICAgICAgIGJveEljb25PcHRpb25zOntcbiAgICAgICAgICBpY29uOiAnc3F1YXJlLW8nLFxuICAgICAgICAgIGNvbG9yOiAnaW5oZXJpdCcsXG4gICAgICAgICAgY2xpY2tFdmVudDogJ2FjdGlvbjpjbGljazpjaGVja2JveCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucywge1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNoZWNrID0gbmV3IHRoaXMub3B0aW9ucy5jaGVja0ljb25WaWV3KFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5jaGVja0ljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2hlY2tDb250YWluZXIuc2hvdyhjaGVjayk7XG5cbiAgICAgICAgdmFyIGJveCA9IG5ldyB0aGlzLm9wdGlvbnMuYm94SWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmJveEljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYm94Q29udGFpbmVyLnNob3coYm94KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBXb29kLkljb25MaXN0ID0gTWFyaW9uZXR0ZS5Db2xsZWN0aW9uVmlldy5leHRlbmQoe1xuICAgICAgdGFnTmFtZTogJ3dvb2QtaWNvbi1saXN0JyxcbiAgICAgIGNoaWxkVmlldzogV29vZC5JY29uLFxuICAgICAgYnVpbGRDaGlsZFZpZXc6IGZ1bmN0aW9uKGNoaWxkLCBDaGlsZFZpZXdDbGFzcywgY2hpbGRWaWV3T3B0aW9ucyl7XG4gICAgICAgIHZhciBpZCA9IGNoaWxkLmdldCgnaWQnKTtcbiAgICAgICAgdmFyIHZpZXcgPSBjaGlsZC5nZXQoJ3ZpZXcnKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBjaGlsZC5nZXQoJ29wdGlvbnMnKTtcbiAgICAgICAgLy8gYnVpbGQgdGhlIGZpbmFsIGxpc3Qgb2Ygb3B0aW9ucyBmb3IgdGhlIGNoaWxkVmlldyBjbGFzc1xuICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBjaGlsZFZpZXdPcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgICB2YXIgdmlldyA9IG5ldyB2aWV3KG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIHJldHVybiBpdFxuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgfSk7XG5cbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIldvb2QuaW5wdXRzID0ge307XG5cbnJlcXVpcmUoJy4vdGV4dC5qcycpO1xuLy8gcmVxdWlyZSgnLi9jb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9jaGVja2JveC5qcycpO1xuLy8gcmVxdWlyZSgnLi9ncm91cGNvbWJvLmpzJyk7XG4vLyByZXF1aXJlKCcuL3BvcG92ZXJjb21iby5qcycpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5JbnB1dCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xhc3M6ICd3b29kIGlucHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJsYWJlbC1wbGFjZWhvbGRlclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibGFiZWwtdGV4dFwiPjwlLWZsb2F0aW5nTGFiZWxUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImhpbnQtdGV4dFwiPjwlLWhpbnRUZXh0JT48L2Rpdj4nICtcbiAgICAgICAgICAnPGlucHV0IHR5cGU9XCI8JS10eXBlJT5cIiB2YWx1ZT1cIjwlLXZhbHVlJT5cIj48L2lucHV0PicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tLWluYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20tYWN0aXZlXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8ZGl2IGlkPVwiZXJyb3ItdGV4dFwiIGNsYXNzPVwiZXJyb3ItdGV4dFwiPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ2NoYW5nZSBpbnB1dCc6ICdrZXlQcmVzcycsXG4gICAgICAgICAgJ2tleXVwIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAna2V5ZG93biBpbnB1dCc6ICdzZXRGaWxsZWQnLFxuICAgICAgICAgICdmb2N1c2luICBpbnB1dCc6ICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQgaW5wdXQnOiAnZm9jdXNPdXQnXG4gICAgICAgIH0sXG4gICAgICAgIHNldEZpbGxlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICAgIGlmKCB0aGlzLnZhbHVlID09ICcnICl7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZmlsbGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdGhpcy5zZXRGaWxsZWQoKTtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmVycm9yKCk7XG4gICAgICAgICAgaWYoICFlcnJvciApe1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjppbnB1dDpjaGFuZ2UnLCAhZXJyb3IpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c0luIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICBpZiggZXJyb3IgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdlcnJlZCcpO1xuICAgICAgICAgICAgdGhpcy4kKCcjZXJyb3ItdGV4dCcpLnRleHQoZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZXJyZWQnKTtcbiAgICAgICAgICAgIHRoaXMuJCgnI2Vycm9yLXRleHQnKS50ZXh0KCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgICBpZiggdGhpcy5vcHRpb25zLmlzUmVxdWlyZWQgJiYgdmFsdWUgPT0gJycgKXtcbiAgICAgICAgICAgIGVycm9yID0gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICAgIH0gZWxzZSBpZiggdGhpcy5vcHRpb25zLmVycm9yICl7XG4gICAgICAgICAgICBlcnJvciA9IHRoaXMub3B0aW9ucy5lcnJvcih2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5lcnJvcigpO1xuICAgICAgICAgIHRoaXMuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiAhZXJyb3I7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ6ICcnLFxuICAgICAgICAgIGhpbnRUZXh0OiAnJyxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICBpc1JlcXVpcmVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLnNldEZpbGxlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRWYWw6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHRWYWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkl0ZW0gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICB0YWdOYW1lOiAnd29vZC1pdGVtJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS13cmFwcGVyXCI+JyArXG4gICAgICAgICc8JSBpZiAobGVmdEljb24pIHsgJT4nICtcbiAgICAgICAgICAnPGRpdiBpZD1cImxlZnQtaWNvbi1jb250YWluZXJcIiBjbGFzcz1cImxlZnQtaWNvblwiPjwvZGl2PicgK1xuICAgICAgICAnPCV9JT4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIml0ZW0tYm9keVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcmltYXJ5LXRleHRcIj48JS1wcmltYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNlY29uZGFyeS10ZXh0XCI+PCUtc2Vjb25kYXJ5VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8JSBpZiAocmlnaHRJY29uKSB7ICU+JyArXG4gICAgICAgICAgICAnPGRpdiBpZD1cInJpZ2h0LWljb24tY29udGFpbmVyXCIgY2xhc3M9XCJyaWdodC1pY29uXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICcnKSxcbiAgICByZWdpb25zOiB7XG4gICAgICBsZWZ0SWNvbkNvbnRhaW5lcjogJyNsZWZ0LWljb24tY29udGFpbmVyJyxcbiAgICAgIHJpZ2h0SWNvbkNvbnRhaW5lcjogJyNyaWdodC1pY29uLWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICBkZWZhdWx0czoge1xuICAgICAgbGVmdEljb246IGZhbHNlLFxuICAgICAgbGVmdEljb25WaWV3OiBXb29kLkF2YXRhcixcbiAgICAgIGxlZnRJY29uT3B0aW9uczoge30sXG4gICAgICBwcmltYXJ5VGV4dDogbnVsbCxcbiAgICAgIHNlY29uZGFyeVRleHQ6IG51bGwsXG4gICAgICByaWdodEljb246IGZhbHNlLFxuICAgICAgcmlnaHRJY29uVmlldzogbnVsbCxcbiAgICAgIHJpZ2h0SWNvbk9wdGlvbnM6IHt9XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcblxuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZWZ0SWNvbikge1xuICAgICAgICB2YXIgbGVmdEljb24gPSBuZXcgdGhpcy5vcHRpb25zLmxlZnRJY29uVmlldyhcbiAgICAgICAgICB0aGlzLm9wdGlvbnMubGVmdEljb25PcHRpb25zXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubGVmdEljb25Db250YWluZXIuc2hvdyhsZWZ0SWNvbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmlnaHRJY29uKSB7XG4gICAgICAgIHZhciByaWdodEljb24gPSBuZXcgdGhpcy5vcHRpb25zLnJpZ2h0SWNvblZpZXcoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJpZ2h0SWNvbk9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yaWdodEljb25Db250YWluZXIuc2hvdyhyaWdodEljb24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiV29vZC5SaXBwbGUgPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBjbGFzczogJ3dvb2QgcmlwcGxlLXdyYXBwZXInLFxuICB9LFxuICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgJycpLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIHRoaXMuJHJpcHBsZXMgPSBbXTtcbiAgfSxcbiAgcHl0aGFnb3JhczogZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KGEsMikrTWF0aC5wb3coYiwyKSwwLjUpO1xuICB9LFxuICBjcmVhdGVSaXBwbGU6IGZ1bmN0aW9uKGNsYXNzTmFtZSwgeCwgeSl7XG4gICAgdmFyICRyaXBwbGUgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAkcmlwcGxlLmFkZENsYXNzKCdjaXJjbGUgcmlwcGxlICcgKyBjbGFzc05hbWUpO1xuICAgIHZhciBoID0gdGhpcy4kZWwuaGVpZ2h0KCk7XG4gICAgdmFyIHcgPSB0aGlzLiRlbC53aWR0aCgpO1xuICAgIGlmKCB4ID09IHVuZGVmaW5lZCApe1xuICAgICAgeCA9IHcvMjtcbiAgICAgIHkgPSBoLzI7XG4gICAgfVxuICAgIHZhciByID0gdGhpcy5weXRoYWdvcmFzKE1hdGgubWF4KHgsdy14KSwgTWF0aC5tYXgoeSxoLXkpKTtcbiAgICAkcmlwcGxlLmNzcyh7XG4gICAgICAndG9wJzogeSAtIHIsXG4gICAgICAnbGVmdCc6IHggLSByLFxuICAgICAgJ2hlaWdodCc6IDIqcixcbiAgICAgICd3aWR0aCc6IDIqclxuICAgIH0pO1xuICAgIHJldHVybiAkcmlwcGxlO1xuICB9LFxuICBmb2N1c0luOiBmdW5jdGlvbigpe1xuICAgIGlmKCAhdGhpcy4kcHVsc2UgICYmIHRoaXMuJHJpcHBsZXMubGVuZ3RoID09IDApe1xuICAgICAgdmFyICRwdWxzZSA9IHRoaXMuY3JlYXRlUmlwcGxlKCdwdWxzaW5nJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJHB1bHNlKTtcbiAgICAgIHRoaXMuJHB1bHNlID0gJHB1bHNlO1xuICAgIH1cbiAgfSxcbiAgZm9jdXNPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgaWYoIHRoaXMuJHB1bHNlICl7XG4gICAgICB0aGlzLmZhZGUodGhpcy4kcHVsc2UsIDApO1xuICAgICAgdGhpcy4kcHVsc2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9LFxuICBtb3VzZURvd246IGZ1bmN0aW9uKHgsIHkpe1xuICAgIHZhciAkcmlwcGxlID0gdGhpcy5jcmVhdGVSaXBwbGUoJ3Byb3BhZ2F0aW5nJywgeCwgeSk7XG4gICAgdGhpcy4kZWwuYXBwZW5kKCRyaXBwbGUpO1xuICAgIHRoaXMuJHJpcHBsZXMucHVzaCgkcmlwcGxlKTtcbiAgfSxcbiAgbW91c2VPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICB0aGlzLmZhZGUoJHJpcHBsZSk7XG4gICAgfVxuICB9LFxuICBjbGljazogZnVuY3Rpb24oKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRyaXBwbGUgPSB0aGlzLiRyaXBwbGVzLnBvcCgpO1xuICAgIGlmKCAkcmlwcGxlICl7XG4gICAgICB0aGlzLiRyaXBwbGVzLnB1c2goJHJpcHBsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW91c2VEb3duKCk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYubW91c2VPdXQoKTtcbiAgICB9LCAwKTtcbiAgfSxcbiAgZmFkZTogZnVuY3Rpb24ocmlwcGxlLCBkdXJhdGlvbil7XG4gICAgdmFyIGR1cmF0aW9uID0gdHlwZW9mIGR1cmF0aW9uID09ICdudW1iZXInID8gZHVyYXRpb24gOiA1MDA7XG4gICAgcmlwcGxlLmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCl7XG4gICAgICByaXBwbGUucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5TcGlubmVyID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAnd29vZC1zcGlubmVyJyxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxzdmcgY2xhc3M9XCJjaXJjdWxhclwiIHZpZXdCb3g9XCI8JS1yKzUlPiA8JS1yKzUlPiA8JS1kKzEwJT4gPCUtZCsxMCU+XCIgaGVpZ2h0PVwiPCUtZCU+XCIgd2lkdGg9XCI8JS1kJT5cIj4nICtcbiAgICAgICAgICAgICc8Y2lyY2xlIGNsYXNzPVwicGF0aFwiIGN4PVwiPCUtZCsxMCU+XCIgY3k9XCI8JS1kKzEwJT5cIiByPVwiPCUtcmFkaXVzJT5cIiBzdHJva2Utd2lkdGg9XCI8JS1zdHJva2VXaWR0aCU+XCIvPicgK1xuICAgICAgICAgICc8L3N2Zz4nICtcbiAgICAgICAgJycpLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHJhZGl1czogMjAsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6IDJcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHJhZGl1cyA9IHRoaXMub3B0aW9ucy5yYWRpdXM7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIHI6IHJhZGl1cyxcbiAgICAgICAgICAgIGQ6IHJhZGl1cyAqIDJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgIG92ZXJsYXk6IGZ1bmN0aW9uICgkZWwpIHtcbiAgICAgICAgdmFyIHdpZGdldCA9IG5ldyBXb29kLlNwaW5uZXIoKTtcbiAgICAgICAgd2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICAkb3ZlcmxheSA9IHdpZGdldC4kZWw7XG4gICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdvdmVybGF5Jyk7XG5cbiAgICAgICAgJGVsLmFwcGVuZCgkb3ZlcmxheSk7XG4gICAgICAgIHJldHVybiAkb3ZlcmxheTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRPRE9cbiAgICAvLyB0b29sYm94Lmd1aS53aWRnZXRzLklubGluZUxvYWRlciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAvLyAgICAgdGFnTmFtZTogJ2ltZycsXG4gICAgLy8gICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAvLyAgICAgICAgIHNyYzogJy9hc3NldHMvaW1hZ2VzL2xvYWRlcnMvYmFyLmdpZicsXG4gICAgLy8gICAgICAgICBzdHlsZTogJ3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbjphdXRvO3RvcDowO2JvdHRvbTowOydcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycpXG4gICAgLy8gfSk7XG59KSh3aW5kb3cuV29vZCk7XG4iLCIoZnVuY3Rpb24gKFdvb2QpIHtcbiAgICBXb29kLlRhYmxlID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICAgICAgICB0YWdOYW1lOiAndGFibGUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3RhYmxlIHRhYmxlLXN0cmlwZWQnLFxuICAgICAgICAgICAgY2VsbHNwYWNpbmc6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgc3R5bGU6ICdtaW4td2lkdGg6MTAwJTttaW4taGVpZ2h0OjEwMCU7J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0hlYWRlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8JSBpZiAoc2hvd0Zvb3RlcikgeyAlPicgK1xuICAgICAgICAgICAgICAgICc8dGZvb3Q+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHsgJT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRoPjwlPSBjb2x1bW4uZGlzcGxheSAlPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPCUgfSk7ICU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3Rmb290PicgK1xuICAgICAgICAgICAgJzwlIH0gJT4nICtcbiAgICAgICAgICAgICc8dGJvZHk+PC90Ym9keT4nXG4gICAgICAgICksXG4gICAgICAgIGNvbGxlY3REYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChtb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29sdW1uczogZnVuY3Rpb24gKHNjaGVtYSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuXG4gICAgICAgICAgICAvLyBsb2FkIHRoZSBjb2x1bW4gaW5mb3JtYXRpb24gZnJvbSB0aGUgc2NoZW1hXG4gICAgICAgICAgICBpZihzY2hlbWEpe1xuICAgICAgICAgICAgICAgIF8uZWFjaChzY2hlbWEuY29sdW1ucywgZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8udmlzaWJsZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbmZvLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGluZm8uZGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbHVtbkRlZnM6IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgZGVmcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2wsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5yZW5kZXJlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBjb2wucmVuZGVyZXI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhTmFtZSA9IGNvbC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0gY29sLnJlbmRlcmVyT3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICBkZWZzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWRnZXQgPSBzZWxmW3JlbmRlcmVyXShkYXRhLCB0eXBlLCBmdWxsLCBtZXRhLCByZW5kZXJlck9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yod2lkZ2V0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhTmFtZSArICdfJyArIG1ldGEucm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJlcnNbaWRdID0gd2lkZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cInJlbmRlcmVyLWNvbnRhaW5lciB3YWl0aW5nXCI+PC9zcGFuPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZzO1xuICAgICAgICB9LFxuICAgICAgICBnZXRFeHBvcnREYXRhOiBmdW5jdGlvbiAocmVjb3JkLCBmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkXTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X2NvbHVtbnMgPSBzZWxmLmdldENvbHVtbnMoc2VsZi5jb2xsZWN0aW9uLm1vZGVsLnByb3RvdHlwZS5zY2hlbWEpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sdW1uRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdF9jb2x1bW5zID0gXy5maWx0ZXIoZGVmYXVsdF9jb2x1bW5zLCBvcHRpb25zLmNvbHVtbkZpbHRlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjb2xsZWN0aW9uIGZvciB0aGlzIGRhdGF0YWJsZVxuICAgICAgICAgICAgdGhpcy50YWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHNlbGYucmVuZGVyZXJzID0ge307XG4gICAgICAgICAgICBzZWxmLmJhc2VTZWFyY2ggPSBvcHRpb25zLnNlYXJjaCB8fCAnJztcblxuICAgICAgICAgICAgc2VsZi5yb3dIZWlnaHQgPSBvcHRpb25zLnJvd0hlaWdodCB8fCA1OTtcbiAgICAgICAgICAgIHNlbGYubWF4VmlzaWJsZVJvd3MgPSBvcHRpb25zLm1heFZpc2libGVSb3dzIHx8IDEwO1xuICAgICAgICAgICAgc2VsZi5jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgc2VsZi5jb2x1bW5zID0gb3B0aW9ucy5jb2x1bW5zIHx8IGRlZmF1bHRfY29sdW1ucztcbiAgICAgICAgICAgIHNlbGYuY29sdW1uRGVmcyA9IG9wdGlvbnMuY29sdW1uRGVmcyB8fCBzZWxmLmdldENvbHVtbkRlZnMoc2VsZi5jb2x1bW5zKTtcbiAgICAgICAgICAgIHNlbGYuc2hvd0hlYWRlciA9IG9wdGlvbnMuc2hvd0hlYWRlciB8fCB0cnVlO1xuICAgICAgICAgICAgc2VsZi5zaG93Rm9vdGVyID0gb3B0aW9ucy5zaG93Rm9vdGVyIHx8IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5kYXRhVGFibGVPcHRpb25zID0gb3B0aW9ucy5kYXRhVGFibGVPcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgc2VsZi50aXRsZSA9IG9wdGlvbnMudGl0bGU7XG5cblxuICAgICAgICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2l6ZUhlaWdodCgpO1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvblJvd1JlbmRlcjogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQocm93KS5maW5kKCcucmVuZGVyZXItY29udGFpbmVyLndhaXRpbmcnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGhvbGRlciA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgJGhvbGRlci5yZW1vdmVDbGFzcygnd2FpdGluZycpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gc2VsZi5yZW5kZXJlcnNbJGhvbGRlci5hdHRyKCdpZCcpXTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBhIGpxdWVyeSBvYmplY3QgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyZXIgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhvbGRlci5hcHBlbmQocmVuZGVyZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlbmRlciBhIGJhY2tib25lIHZpZXdcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICRob2xkZXIuYXBwZW5kKHJlbmRlcmVyLiRlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdmlydHVhbCBtZXRob2RcbiAgICAgICAgfSxcbiAgICAgICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsb2FkZXIgZm9yIHRoaXMgdGFibGUgdG8gbG9hZCBjb2xsZWN0aW9uIGluZm9ybWF0aW9uXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzY3JvbGxZOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAzODUsXG4gICAgICAgICAgICAgICAgc2Nyb2xsWDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZWZlclJlbmRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb206ICc8XCJ0aXRsZVwiPlpUZnJ0aVMnLFxuICAgICAgICAgICAgICAgIHNjcm9sbENvbGxhcHNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBjb2x1bW5EZWZzOiB0aGlzLmNvbHVtbkRlZnMsXG4gICAgICAgICAgICAgICAgcm93Q2FsbGJhY2s6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm9uUm93UmVuZGVyKHJvdywgZGF0YSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUJ1ZmZlcjogMlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gbmV3IFdvb2QuU3Bpbm5lci5vdmVybGF5KHNlbGYuJGVsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbGxlY3Rpb24uZmV0Y2goe1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kOiBzZWxmLmNvbHVtbnMubWFwKGZ1bmN0aW9uKGMpe3JldHVybiBjLmRhdGF9KS5qb2luKCcsJyksXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh7ZGF0YTogc2VsZi5jb2xsZWN0RGF0YSgpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGFibGVUb29sczoge1xuICAgICAgICAgICAgICAgICAgICBzU3dmUGF0aDogJy9hc3NldHMvc3dmL2NvcHlfY3N2X3hsc19wZGYuc3dmJyxcbiAgICAgICAgICAgICAgICAgICAgYUJ1dHRvbnM6W1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNFeHRlbmRzOiAnY3N2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzQnV0dG9uVGV4dDogJ0V4cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc0J1dHRvbkNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGJ0bi14cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5DZWxsUmVuZGVyOiBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbiwgZG9tUm93LCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHNlbGYuY29sbGVjdGlvbi5hdChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBzZWxmLmNvbHVtbnNbY29sdW1uXS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRFeHBvcnREYXRhKHJlY29yZCwgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB0aGlzLiRlbC5EYXRhVGFibGUoXy5leHRlbmQob3B0aW9ucywgc2VsZi5kYXRhVGFibGVPcHRpb25zKSk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNlYXJjaCh0aGlzLmJhc2VTZWFyY2gpO1xuICAgICAgICAgICAgdGhpcy4kZGF0YVRhYmxlID0gc2VsZi4kZWwuY2xvc2VzdCgnLmRhdGFUYWJsZXNfd3JhcHBlcicpO1xuICAgICAgICAgICAgdGhpcy4kZWwub24oJ3NlYXJjaC5kdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTpzZWFyY2gnLCBzZWxmLnRhYmxlLnNlYXJjaCgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi50aXRsZSkge1xuICAgICAgICAgICAgICAgIHRhYmxlID0gc2VsZjtcbiAgICAgICAgICAgICAgICBzZWxmLiRkYXRhVGFibGUuZmluZCgnZGl2LnRpdGxlJykuYXBwZW5kKHNlbGYudGl0bGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUhlaWdodCgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvdmVybGF5ID0gV29vZC5TcGlubmVyLm92ZXJsYXkodGhpcy4kZWwpO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5hamF4LnJlbG9hZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcm93Q291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpbmZvID0gdGhpcy50YWJsZS5wYWdlLmluZm8oKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvLnJlY29yZHNUb3RhbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SGVpZ2h0OiBmdW5jdGlvbiAoaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLiRkYXRhVGFibGUuZmluZCgnLmRhdGFUYWJsZXNfc2Nyb2xsQm9keScpLmNzcygnbWF4LWhlaWdodCcsIGhlaWdodCArIFwicHhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2l6ZUhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNldEhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkgLSA1NzApXG4gICAgICAgIH0sXG4gICAgICAgIHVuZmlsdGVyZWRSb3dDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnRhYmxlLnBhZ2UuaW5mbygpO1xuICAgICAgICAgICAgcmV0dXJuIGluZm8ucmVjb3Jkc0Rpc3BsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsXG4gICAgICAgICAgICAgICAgc2hvd0hlYWRlcjogdGhpcy5zaG93SGVhZGVyLFxuICAgICAgICAgICAgICAgIHNob3dGb290ZXI6IHRoaXMuc2hvd0Zvb3RlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiKGZ1bmN0aW9uIChXb29kKSB7XG4gICAgV29vZC5Ub29sYmFyID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICB0YWdOYW1lOiBcIndvb2QtdG9vbGJhclwiLFxuICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJycrXG4gICAgICAgICc8ZGl2IGlkPVwibGVmdC1pY29ucy13cmFwcGVyXCIgY2xhc3M9XCJsZWZ0LWljb25zLXdyYXBwZXJcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwlLXRpdGxlJT48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJyaWdodC1pY29ucy13cmFwcGVyXCIgY2xhc3M9XCJyaWdodC1pY29ucy13cmFwcGVyXCI+PC9kaXY+JyArXG4gICAgICAnJyksXG4gICAgICByZWdpb25zOntcbiAgICAgICAgbGVmdEljb25zQ29udGFpbmVyOiBcIiNsZWZ0LWljb25zLXdyYXBwZXJcIixcbiAgICAgICAgcmlnaHRJY29uc0NvbnRhaW5lcjogXCIjcmlnaHQtaWNvbnMtd3JhcHBlclwiLFxuICAgICAgfSxcbiAgICAgIGNoaWxkRXZlbnRzOiB7XG4gICAgICAgICdhY3Rpb246Y2xpY2s6aWNvbic6IFwib25DbGlja0ljb25cIixcbiAgICAgIH0sXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC50aXRsZSc6ICdvbkNsaWNrVGl0bGUnLFxuICAgICAgfSxcbiAgICAgIG9uQ2xpY2tJY29uOiBmdW5jdGlvbihpY29uVmlldyl7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCggJ2FjdGlvbjpjbGljazppY29uJywgaWNvblZpZXcgKTtcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrVGl0bGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMudHJpZ2dlck1ldGhvZCgnYWN0aW9uOmNsaWNrOnRpdGxlJyk7XG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbGVmdEljb25zOiBbXSxcbiAgICAgICAgcmlnaHRJY29uczogW10sXG4gICAgICAgIHRpdGxlOiAnVG9vbGJhcidcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgb25SZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxlZnRJY29uTGlzdCA9IG5ldyBXb29kLkljb25MaXN0KHtcbiAgICAgICAgICBjb2xsZWN0aW9uOiBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbih0aGlzLm9wdGlvbnMubGVmdEljb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sZWZ0SWNvbnNDb250YWluZXIuc2hvdyhsZWZ0SWNvbkxpc3QpO1xuXG4gICAgICAgIHZhciByaWdodEljb25MaXN0ID0gbmV3IFdvb2QuSWNvbkxpc3Qoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5yaWdodEljb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yaWdodEljb25zQ29udGFpbmVyLnNob3cocmlnaHRJY29uTGlzdCk7XG4gICAgICB9LFxuICAgIH0pO1xufSkod2luZG93Lldvb2QpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAzLzExLzE1LlxuICovXG4oZnVuY3Rpb24gKHRvb2xib3gpIHtcbiAgV29vZC5Ub29sdGlwID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgYXR0cmlidXRlczoge1xuICAgICAgY2xhc3M6ICd3b29kIHRvb2x0aXAtYW5jaG9yLXdyYXBwZXInLFxuICAgIH0sXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC13cmFwcGVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3b29kLXRvb2x0aXBcIj48JS0gdGV4dCAlPjwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgJycpLFxuICAgIGRlZmF1bHRzOntcbiAgICAgIHRleHQ6ICcnXG4gICAgfSxcbiAgICBmb2N1c0luOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgfSxcbiAgICBmb2N1c091dDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9LFxuICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gNC81LzE2LlxuICovXG4oZnVuY3Rpb24oV29vZCkge1xuICBXb29kLkJyYW5jaCA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC1icmFuY2hcIixcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICc8ZGl2IGlkPVwidHJlZS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgdHJlZUNvbnRhaW5lcjogXCIjdHJlZS1jb250YWluZXJcIixcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRyZWVWaWV3ID0gbmV3IFdvb2QuVHJlZSh0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy50cmVlQ29udGFpbmVyLnNob3codHJlZVZpZXcpO1xuICAgIH0sXG4gICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuQnJhbmNoZXMgPSBNYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7XG4gICAgdGFnTmFtZTogXCJ3b29kLWJyYW5jaGVzXCIsXG4gICAgY2hpbGRWaWV3OiBXb29kLkJyYW5jaCxcbiAgICBidWlsZENoaWxkVmlldzogZnVuY3Rpb24oY2hpbGQsIENoaWxkVmlld0NsYXNzLCBjaGlsZFZpZXdPcHRpb25zKXtcbiAgICAgIC8vIGJ1aWxkIHRoZSBmaW5hbCBsaXN0IG9mIG9wdGlvbnMgZm9yIHRoZSBjaGlsZFZpZXcgY2xhc3NcbiAgICAgIHZhciBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgICAvLyBicmFuY2hlczogdGhpcy5vcHRpb25zLmJyYW5jaGVzLFxuICAgICAgfSwgY2hpbGRWaWV3T3B0aW9ucywgY2hpbGQuYXR0cmlidXRlcyk7XG5cbiAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGQgdmlldyBpbnN0YW5jZVxuICAgICAgdmFyIHZpZXcgPSBuZXcgQ2hpbGRWaWV3Q2xhc3Mob3B0aW9ucyk7XG5cbiAgICAgIC8vIHJldHVybiBpdFxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfSxcbiAgICBldmVudHM6IHt9LFxuICAgIGRlZmF1bHRzOiB7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0cywgdGhpcy5vcHRpb25zKTtcbiAgICB9LFxuICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB9LFxuICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIFdvb2QuVHJlZSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6IFwid29vZC10cmVlXCIsXG4gICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAnPGRpdiBjbGFzcz1cInRyZWUtd3JhcHBlclwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cInR3aWdcIj48L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgaWQ9XCJpdGVtLWNvbnRhaW5lclwiIGNsYXNzPVwiaXRlbS1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGlkPVwiY2hpbGRyZW4tY29udGFpbmVyXCIgY2xhc3M9XCJjaGlsZHJlbi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAnJyksXG4gICAgcmVnaW9uczoge1xuICAgICAgaXRlbUNvbnRhaW5lcjogXCIjaXRlbS1jb250YWluZXJcIixcbiAgICAgIGNoaWxkcmVuQ29udGFpbmVyOiBcIiNjaGlsZHJlbi1jb250YWluZXJcIixcbiAgICB9LFxuICAgIGV2ZW50czoge30sXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGl0ZW1WaWV3OiBXb29kLkl0ZW0sXG4gICAgICBpdGVtT3B0aW9uczoge30sXG4gICAgICBjaGlsZHJlbjogW11cbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0sXG4gICAgb25SZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZW0gPSBuZXcgdGhpcy5vcHRpb25zLml0ZW1WaWV3KHRoaXMub3B0aW9ucy5pdGVtT3B0aW9ucyk7XG4gICAgICB0aGlzLml0ZW1Db250YWluZXIuc2hvdyhpdGVtKTtcblxuICAgICAgaWYoIHRoaXMub3B0aW9ucy5jaGlsZHJlbiAmJiB0aGlzLm9wdGlvbnMuY2hpbGRyZW4ubGVuZ3RoID4gMCApe1xuICAgICAgICB2YXIgYnJhbmNoZXMgPSBuZXcgV29vZC5CcmFuY2hlcyh7XG4gICAgICAgICAgY29sbGVjdGlvbiA6IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKHRoaXMub3B0aW9ucy5jaGlsZHJlbilcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5Db250YWluZXIuc2hvdyhicmFuY2hlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHtcblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuXG59KSh3aW5kb3cuV29vZCk7XG4iXX0=
