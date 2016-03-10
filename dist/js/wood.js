(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Wood = {};

// include base common widgets
require('./inputs/all');
// require('./alert');
// require('./banner');
require('./avatar');

// require('./card');
// require('./button');
require('./form');
// require('./label');
// require('./loader');
// require('./quicksearch');
// require('./recordtable');

},{"./avatar":2,"./form":3,"./inputs/all":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
        childEvents: {
          "action:saveButtonClick": "save"
        },
        initialize: function(options){
          this.options = options;
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
        getInputValue: function(input){
          if( input && input.view )
            return input.view.getVal();
        },
        getInput: function(key){
          for( var i in this.inputs ){
            var input = this.inputs[i];
            if( key == input.id )
              return input
          }
        },
        onRender: function(){
          // var somethingToSave = this.inputs.some(function(x,i,a){
          //   return x.disabled != true;
          // });
          // if ( somethingToSave ){
          //   // At leas one value can be edited and should be saved
          //   var saveBtn = new toolbox.gui.widgets.SaveButton();
          //   this.saveBtnContainer.show(saveBtn);
          // }
        },
        onShow: function(){
          var inputs = this.options.inputs;
          for( var i in inputs ){
            var input = inputs[i];
            var inputView = this.createInputView(input);
            this.addRegion( input.label + 'Container', '#' + input.label + '-container');
            this.getRegion( input.label + 'Container').show(inputView);
          }

          if( this.options.submitButton){
            var submitButton = new Wood.inputs.buttons.Raised({
              label: 'Sign In',
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

},{}],4:[function(require,module,exports){
Wood.inputs = {};

require('./buttons/all');

require('./text.js');
require('./combo.js');
// require('./checkbox.js');
// require('./groupcombo.js');
// require('./popovercombo.js');

},{"./buttons/all":5,"./combo.js":7,"./text.js":8}],5:[function(require,module,exports){
Wood.inputs.buttons = {};

require('./button.js');
// require('./submit.js');
// require('./groupcombo.js');
// require('./popovercombo.js');

},{"./button.js":6}],6:[function(require,module,exports){
(function (toolbox) {
    var Button = Marionette.LayoutView.extend({
        tagName: 'button',
        attributes: {
          class: 'button',
        },
        template: _.template(
          '<div class="overlay">' +
            '<div class="ripple-container">' +
              '<div class="ripple circle"></div>' +
            '</div>' +
          '</div>' +
          '<div class="btnlabel"><%-label%></div>' +
        ''),
        events:{
          'mousedown':  'mouseDown',
          'focusin':    'focusIn',
          'focusout ':  'focusOut',
        },
        focusIn : function(e){
          this.$el.addClass('focused');
        },
        focusOut : function(e){
          this.$el.removeClass('focused');
        },
        mouseDown: function(event){
          var self = this;

          if (this.rippleTimer){
            clearTimeout(this.rippleTimer);
            this.$el.removeClass('pressed');
          }

          this.$el.removeClass('focused');
          event.preventDefault();
          var x = event.pageX - this.$('.ripple-container').offset().left - 18;
          var y = event.pageY - this.$('.ripple-container').offset().top - 18;
          this.$(".ripple").css('left', x);
          this.$(".ripple").css('top', y);
          this.$el.addClass('pressed');

          this.rippleTimer = setTimeout(function(){
            self.$el.removeClass('pressed');
          }, 350);
        },
        initialize: function(options){
          this.options = options;
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

    Wood.inputs.buttons.Flat = Button.extend({
        attributes: {
          class: 'button flat',
        }
    });

    Wood.inputs.buttons.Raised = Button.extend({
        attributes: {
          class: 'button raised',
        }
    });
})(window.toolbox);

},{}],7:[function(require,module,exports){
/**
 * Created by danmurray on 12/9/15.
 */
(function (Wood) {
    Wood.inputs.Combo = Marionette.ItemView.extend({
        tagName: 'select',
        attributes: {
            class: 'selectpicker'
        },
        template: _.template(
            '<% ' +
            'for( var i in options){ ' +
                'var option = options[i]' +
            '%>' +
                '<option value="<%-option[0]%>" data-content="<%-option[1]%>"></option>' +
            '<% } %>' +
        ''),
        events:{
            'change' : 'changeEvent'
        },
        collectionEvents: {
            "sync": "rerender",
        },
        addModels: function(models){
            for(var i in models){
                var model = models[i];
                if( model!=undefined && model.get('id'))
                    this.collection.add(this.model);
            }
        },
        rerender: function(){
            var val = this.getVal();
            this.render();
            this.refresh();
            if(this.multiple){
                this.setModels(this.models);
            }else{
              if(val){
                  this.setVal(val)
              }else{
                this.setModels([this.model]);
              }
            }
        },
        refresh: function(){
            this.$el.selectpicker('refresh');
        },
        getVal: function () {
          return this.$el.selectpicker('val') || (this.multiple ? [] : null);
        },
        initialize: function (options) {
            var self = this;
            this.id = options.id;
            this.changeEvents = options.changeEvents || false;
            this.content = options.content;
            this.disabled = options.disabled;
            this.displayAttribute = options.displayAttribute;
            this.filter = options.filter;
            this.maxOptions = options.maxOptions;
            this.models = options.models || [];
            this.multiple = options.multiple;
            this.displayNull = options.displayNull;
            this.searchable = options.searchable != null ? options.searchable : true;
            this.title = options.title || this.displayNull;
            this.visibleRowCount = options.visibleRowCount || 10;

          	this.$el.attr('multiple', this.multiple);
          	this.$el.attr('disabled', this.disabled);

            this.collection.comparator = function(m){
              return m.get('id') ? m.get(self.displayAttribute) : '';
            };

            this.addModels([this.model]);
            this.addModels(this.models);
        },
        changeEvent: function(){
            if(this.changeEvents)
              this.triggerMethod('change', this.getVal());
        },
        childViewOptions: function(){
        	return {
        		displayAttribute : this.displayAttribute
        	}
        },
        onShow: function () {
            this.$el.selectpicker({
                dropupAuto: false,
                liveSearch: this.searchable,
                maxOptions: this.maxOptions,
                size: this.visibleRowCount,
                title: this.title,
            });

            if(this.multiple){
                this.setModels(this.models);
            }else{
                this.setModels([this.model]);
            }
        },
        setVal: function (val) {
            this.$el.selectpicker('val', val);
        },
        setModels: function (models) {
            var self = this;
            var vals = [];
            for(var i in models){
                var model = models[i];
                if(model && model.get('id'))
                    vals.push(model.get('id'));
            }
            self.setVal(vals)
        },
        templateHelpers: function(){
            if ( this.displayNull ){
              var noObj = { id: null };
              noObj[this.displayAttribute] = this.displayNull;
              var noModel = new this.collection.model(noObj);
              if(!this.collection.get(noModel))
                this.collection.add(noModel);
            }

            var options = []
            for( var i in this.collection.models){
                var model = this.collection.models[i];
                var id = model.get('id');
                var displayAttribute = model.get(this.displayAttribute) || id;
                if( this.content ){
                  var displayAttribute = this.content({
                    id: id,
                    displayAttribute: displayAttribute
                  })
                }
                if( !this.filter || this.filter(model, i, this.collection) )
                    options.push([id, displayAttribute]);
            }
            return {
                options : options
            }
        }
    });
})(window.Wood);

},{}],8:[function(require,module,exports){
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

},{}]},{},[1]);
