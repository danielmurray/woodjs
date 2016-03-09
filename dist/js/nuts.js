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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWxsLmpzIiwic3JjL2pzL2F2YXRhci5qcyIsInNyYy9qcy9mb3JtLmpzIiwic3JjL2pzL2lucHV0cy9hbGwuanMiLCJzcmMvanMvaW5wdXRzL2J1dHRvbnMvYWxsLmpzIiwic3JjL2pzL2lucHV0cy9idXR0b25zL2J1dHRvbi5qcyIsInNyYy9qcy9pbnB1dHMvY29tYm8uanMiLCJzcmMvanMvaW5wdXRzL3RleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5OdXRzID0ge307XG5cbi8vIGluY2x1ZGUgYmFzZSBjb21tb24gd2lkZ2V0c1xucmVxdWlyZSgnLi9pbnB1dHMvYWxsJyk7XG4vLyByZXF1aXJlKCcuL2FsZXJ0Jyk7XG4vLyByZXF1aXJlKCcuL2Jhbm5lcicpO1xucmVxdWlyZSgnLi9hdmF0YXInKTtcblxuLy8gcmVxdWlyZSgnLi9jYXJkJyk7XG4vLyByZXF1aXJlKCcuL2J1dHRvbicpO1xucmVxdWlyZSgnLi9mb3JtJyk7XG4vLyByZXF1aXJlKCcuL2xhYmVsJyk7XG4vLyByZXF1aXJlKCcuL2xvYWRlcicpO1xuLy8gcmVxdWlyZSgnLi9xdWlja3NlYXJjaCcpO1xuLy8gcmVxdWlyZSgnLi9yZWNvcmR0YWJsZScpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAyLzE3LzE2LlxuICovXG4oZnVuY3Rpb24gKE51dHMpIHtcbiAgICBOdXRzLkF2YXRhciA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnYXZhdGFyJyxcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFwZSA8JS1zaGFwZSU+XCI+JyArXG4gICAgICAgICAgICAnPCUgaWYgKGltYWdlKSB7ICU+JyArXG4gICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiaW1nXCIgc3JjPVwiPCUtaW1hZ2UlPlwiPjwvaW1nPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGljb24pIHslPicgK1xuICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJpY29uIGZhIGZhLWljb24gZmEtPCUtaWNvbiU+XCI+PC9pPicgK1xuICAgICAgICAgICAgJzwlfSBlbHNlIGlmKGxldHRlcikgeyU+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxldHRlclwiPjwlLWxldHRlciU+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwlfSU+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6e1xuICAgICAgICB9LFxuICAgICAgICBldmVudHM6e1xuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZUhlbHBlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgICAgICAgIGltYWdlOiAnJyxcbiAgICAgICAgICAgIGljb246ICcnLFxuICAgICAgICAgICAgbGV0dGVyOiAnJyxcbiAgICAgICAgICAgIHNoYXBlOiAnJ1xuICAgICAgICAgIH0sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5OdXRzKTtcbiIsIihmdW5jdGlvbiAodG9vbGJveCkge1xuICAgIE51dHMuRm9ybSA9IE1hcmlvbmV0dGUuTGF5b3V0Vmlldy5leHRlbmQoe1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ2Zvcm0nLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBpZD1cImFsZXJ0LWNvbnRhaW5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICc8JSAnICtcbiAgICAgICAgICAnZm9yKCB2YXIgaSBpbiBpbnB1dHMpeyAnICtcbiAgICAgICAgICAgICAgJ3ZhciBpbnB1dCA9IGlucHV0c1tpXTsnICtcbiAgICAgICAgICAnJT4nICtcbiAgICAgICAgICAgICc8ZGl2IGlkPVwiPCUtaW5wdXQubGFiZWwlPi1jb250YWluZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPCUgfSAlPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuc1wiPicgK1xuICAgICAgICAgICAgJzxkaXYgaWQ9XCJzdWJtaXQtYnRuXCIgY2xhc3M9XCJzdWJtaXQtYnRuXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIHJlZ2lvbnM6IHtcbiAgICAgICAgICBhbGVydENvbnRhaW5lcjogJyNhbGVydC1jb250YWluZXInLFxuICAgICAgICAgIHN1Ym1pdEJ0bkNvbnRhaW5lcjogJyNzdWJtaXQtYnRuJ1xuICAgICAgICB9LFxuICAgICAgICBjaGlsZEV2ZW50czoge1xuICAgICAgICAgIFwiYWN0aW9uOnNhdmVCdXR0b25DbGlja1wiOiBcInNhdmVcIlxuICAgICAgICB9LFxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVJbnB1dFZpZXc6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiggaW5wdXRbJ2NvbWJvJ10gKXtcbiAgICAgICAgICAgIC8vIGlmKCBpbnB1dC5jb2xsZWN0aW9uLnVybClcbiAgICAgICAgICAgIC8vICAgaW5wdXQuY29sbGVjdGlvbi5mZXRjaCgpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmKCBpbnB1dC5tb2RlbCA9PSB1bmRlZmluZWQgJiYgaW5wdXQubW9kZWxzID09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICAvLyAgIGlucHV0Lm1vZGVsID0gbmV3IEJhY2tib25lLk1vZGVsKHsgaWQ6IHRoaXMubW9kZWwuZ2V0KGlucHV0LmlkKSB9KTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpbnB1dC52aWV3ID0gbmV3IHRvb2xib3guZ3VpLndpZGdldHMuQ29tYm8oaW5wdXQpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIGlucHV0LnZpZXc7XG4gICAgICAgICAgfSBlbHNlIGlmKCBpbnB1dFsndGV4dCddICkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOdXRzLmlucHV0cy5UZXh0KCBfLmV4dGVuZChpbnB1dFsndGV4dCddLCB7XG4gICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0OiBpbnB1dC5sYWJlbFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICAgIGlmKCBpbnB1dCAmJiBpbnB1dC52aWV3IClcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52aWV3LmdldFZhbCgpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRJbnB1dDogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMuaW5wdXRzICl7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0c1tpXTtcbiAgICAgICAgICAgIGlmKCBrZXkgPT0gaW5wdXQuaWQgKVxuICAgICAgICAgICAgICByZXR1cm4gaW5wdXRcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVuZGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHZhciBzb21ldGhpbmdUb1NhdmUgPSB0aGlzLmlucHV0cy5zb21lKGZ1bmN0aW9uKHgsaSxhKXtcbiAgICAgICAgICAvLyAgIHJldHVybiB4LmRpc2FibGVkICE9IHRydWU7XG4gICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgLy8gaWYgKCBzb21ldGhpbmdUb1NhdmUgKXtcbiAgICAgICAgICAvLyAgIC8vIEF0IGxlYXMgb25lIHZhbHVlIGNhbiBiZSBlZGl0ZWQgYW5kIHNob3VsZCBiZSBzYXZlZFxuICAgICAgICAgIC8vICAgdmFyIHNhdmVCdG4gPSBuZXcgdG9vbGJveC5ndWkud2lkZ2V0cy5TYXZlQnV0dG9uKCk7XG4gICAgICAgICAgLy8gICB0aGlzLnNhdmVCdG5Db250YWluZXIuc2hvdyhzYXZlQnRuKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2hvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgaW5wdXRzID0gdGhpcy5vcHRpb25zLmlucHV0cztcbiAgICAgICAgICBmb3IoIHZhciBpIGluIGlucHV0cyApe1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gaW5wdXRzW2ldO1xuICAgICAgICAgICAgdmFyIGlucHV0VmlldyA9IHRoaXMuY3JlYXRlSW5wdXRWaWV3KGlucHV0KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUmVnaW9uKCBpbnB1dC5sYWJlbCArICdDb250YWluZXInLCAnIycgKyBpbnB1dC5sYWJlbCArICctY29udGFpbmVyJyk7XG4gICAgICAgICAgICB0aGlzLmdldFJlZ2lvbiggaW5wdXQubGFiZWwgKyAnQ29udGFpbmVyJykuc2hvdyhpbnB1dFZpZXcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMuc3VibWl0QnV0dG9uKXtcbiAgICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBuZXcgTnV0cy5pbnB1dHMuYnV0dG9ucy5SYWlzZWQoe1xuICAgICAgICAgICAgICBsYWJlbDogJ1NpZ24gSW4nLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ0bkNvbnRhaW5lci5zaG93KHN1Ym1pdEJ1dHRvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIC8vIHRoaXMuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnc3VjY2VzcycpO1xuICAgICAgICAgIC8vIHZhciBhbGVydCA9IG5ldyB0b29sYm94Lmd1aS53aWRnZXRzLkFsZXJ0KHtcbiAgICAgICAgICAvLyAgICAgdGl0bGU6ICdTdWNjZXNzZnVsbHkgU2F2ZWQhJyxcbiAgICAgICAgICAvLyAgICAgbWVzc2FnZTogJ1NhdmVkIHNldHRpbmdzIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgLy8gICAgIHR5cGU6ICdhbGVydC1zdWNjZXNzJ1xuICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgIC8vIHRoaXMuYWxlcnRDb250YWluZXIuc2hvdyhhbGVydCk7XG4gICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIC8vICAgc2VsZi5zYXZlQnRuQ29udGFpbmVyLmN1cnJlbnRWaWV3LnN0YXRlQ2hhbmdlKCdzYXZlJyk7XG4gICAgICAgICAgLy8gICBzZWxmLmFsZXJ0Q29udGFpbmVyLmN1cnJlbnRWaWV3LiRlbC5mYWRlT3V0KDQwMCk7XG4gICAgICAgICAgLy8gfSwyMDAwKVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuc2F2ZUJ0bkNvbnRhaW5lci5jdXJyZW50Vmlldy5zdGF0ZUNoYW5nZSgnZXJyb3InKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgLy8gdmFyIHNldE9iaiA9IHt9O1xuICAgICAgICAgIC8vIGZvciggdmFyIGkgaW4gdGhpcy5pbnB1dHMgKXtcbiAgICAgICAgICAvLyAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW2ldO1xuICAgICAgICAgIC8vICAgdmFyIGlucHV0VmFsdWUgPSB0aGlzLmdldElucHV0VmFsdWUoaW5wdXQpO1xuICAgICAgICAgIC8vICAgc2V0T2JqW2lucHV0LmlkXSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgLy8gfVxuICAgICAgICAgIC8vIHRoaXMubW9kZWwuc2F2ZShzZXRPYmosIHtcbiAgICAgICAgICAvLyAgICAgcGF0Y2g6IHRydWUsXG4gICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gICAgICAgc2VsZi5vblN1Y2Nlc3MoKTtcbiAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAvLyAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gICAgICAgc2VsZi5vbkVycm9yKCk7XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59KSh3aW5kb3cudG9vbGJveCk7XG4iLCJOdXRzLmlucHV0cyA9IHt9O1xuXG5yZXF1aXJlKCcuL2J1dHRvbnMvYWxsJyk7XG5cbnJlcXVpcmUoJy4vdGV4dC5qcycpO1xucmVxdWlyZSgnLi9jb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9jaGVja2JveC5qcycpO1xuLy8gcmVxdWlyZSgnLi9ncm91cGNvbWJvLmpzJyk7XG4vLyByZXF1aXJlKCcuL3BvcG92ZXJjb21iby5qcycpO1xuIiwiTnV0cy5pbnB1dHMuYnV0dG9ucyA9IHt9O1xuXG5yZXF1aXJlKCcuL2J1dHRvbi5qcycpO1xuLy8gcmVxdWlyZSgnLi9zdWJtaXQuanMnKTtcbi8vIHJlcXVpcmUoJy4vZ3JvdXBjb21iby5qcycpO1xuLy8gcmVxdWlyZSgnLi9wb3BvdmVyY29tYm8uanMnKTtcbiIsIihmdW5jdGlvbiAodG9vbGJveCkge1xuICAgIHZhciBCdXR0b24gPSBNYXJpb25ldHRlLkxheW91dFZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGFnTmFtZTogJ2J1dHRvbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2J1dHRvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwib3ZlcmxheVwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyaXBwbGUtY29udGFpbmVyXCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmlwcGxlIGNpcmNsZVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bmxhYmVsXCI+PCUtbGFiZWwlPjwvZGl2PicgK1xuICAgICAgICAnJyksXG4gICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgJ21vdXNlZG93bic6ICAnbW91c2VEb3duJyxcbiAgICAgICAgICAnZm9jdXNpbic6ICAgICdmb2N1c0luJyxcbiAgICAgICAgICAnZm9jdXNvdXQgJzogICdmb2N1c091dCcsXG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbihlKXtcbiAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBmb2N1c091dCA6IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgIGlmICh0aGlzLnJpcHBsZVRpbWVyKXtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJpcHBsZVRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdwcmVzc2VkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciB4ID0gZXZlbnQucGFnZVggLSB0aGlzLiQoJy5yaXBwbGUtY29udGFpbmVyJykub2Zmc2V0KCkubGVmdCAtIDE4O1xuICAgICAgICAgIHZhciB5ID0gZXZlbnQucGFnZVkgLSB0aGlzLiQoJy5yaXBwbGUtY29udGFpbmVyJykub2Zmc2V0KCkudG9wIC0gMTg7XG4gICAgICAgICAgdGhpcy4kKFwiLnJpcHBsZVwiKS5jc3MoJ2xlZnQnLCB4KTtcbiAgICAgICAgICB0aGlzLiQoXCIucmlwcGxlXCIpLmNzcygndG9wJywgeSk7XG4gICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3ByZXNzZWQnKTtcblxuICAgICAgICAgIHRoaXMucmlwcGxlVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzZWxmLiRlbC5yZW1vdmVDbGFzcygncHJlc3NlZCcpO1xuICAgICAgICAgIH0sIDM1MCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlSGVscGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywge1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNhdmVDbGljazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyB0aGlzLnN0YXRlQ2hhbmdlKCdzYXZpbmcnKTtcbiAgICAgICAgICAvLyB0aGlzLnRyaWdnZXJNZXRob2QoJ2FjdGlvbjpzYXZlQnV0dG9uQ2xpY2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgICAvLyBpZiggdGhpcy5zdGF0ZSAhPSBzdGF0ZSl7XG4gICAgICAgICAgLy8gICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgLy8gICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgTnV0cy5pbnB1dHMuYnV0dG9ucy5GbGF0ID0gQnV0dG9uLmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2J1dHRvbiBmbGF0JyxcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgTnV0cy5pbnB1dHMuYnV0dG9ucy5SYWlzZWQgPSBCdXR0b24uZXh0ZW5kKHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGNsYXNzOiAnYnV0dG9uIHJhaXNlZCcsXG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy50b29sYm94KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBkYW5tdXJyYXkgb24gMTIvOS8xNS5cbiAqL1xuKGZ1bmN0aW9uIChOdXRzKSB7XG4gICAgTnV0cy5pbnB1dHMuQ29tYm8gPSBNYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRhZ05hbWU6ICdzZWxlY3QnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBjbGFzczogJ3NlbGVjdHBpY2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAnPCUgJyArXG4gICAgICAgICAgICAnZm9yKCB2YXIgaSBpbiBvcHRpb25zKXsgJyArXG4gICAgICAgICAgICAgICAgJ3ZhciBvcHRpb24gPSBvcHRpb25zW2ldJyArXG4gICAgICAgICAgICAnJT4nICtcbiAgICAgICAgICAgICAgICAnPG9wdGlvbiB2YWx1ZT1cIjwlLW9wdGlvblswXSU+XCIgZGF0YS1jb250ZW50PVwiPCUtb3B0aW9uWzFdJT5cIj48L29wdGlvbj4nICtcbiAgICAgICAgICAgICc8JSB9ICU+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAgICdjaGFuZ2UnIDogJ2NoYW5nZUV2ZW50J1xuICAgICAgICB9LFxuICAgICAgICBjb2xsZWN0aW9uRXZlbnRzOiB7XG4gICAgICAgICAgICBcInN5bmNcIjogXCJyZXJlbmRlclwiLFxuICAgICAgICB9LFxuICAgICAgICBhZGRNb2RlbHM6IGZ1bmN0aW9uKG1vZGVscyl7XG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gbW9kZWxzKXtcbiAgICAgICAgICAgICAgICB2YXIgbW9kZWwgPSBtb2RlbHNbaV07XG4gICAgICAgICAgICAgICAgaWYoIG1vZGVsIT11bmRlZmluZWQgJiYgbW9kZWwuZ2V0KCdpZCcpKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24uYWRkKHRoaXMubW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmdldFZhbCgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICAgICAgaWYodGhpcy5tdWx0aXBsZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNb2RlbHModGhpcy5tb2RlbHMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGlmKHZhbCl7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNldFZhbCh2YWwpXG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TW9kZWxzKFt0aGlzLm1vZGVsXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRWYWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuc2VsZWN0cGlja2VyKCd2YWwnKSB8fCAodGhpcy5tdWx0aXBsZSA/IFtdIDogbnVsbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRXZlbnRzID0gb3B0aW9ucy5jaGFuZ2VFdmVudHMgfHwgZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBvcHRpb25zLmNvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gb3B0aW9ucy5kaXNhYmxlZDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUF0dHJpYnV0ZSA9IG9wdGlvbnMuZGlzcGxheUF0dHJpYnV0ZTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgICAgICB0aGlzLm1heE9wdGlvbnMgPSBvcHRpb25zLm1heE9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLm1vZGVscyA9IG9wdGlvbnMubW9kZWxzIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5tdWx0aXBsZSA9IG9wdGlvbnMubXVsdGlwbGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlOdWxsID0gb3B0aW9ucy5kaXNwbGF5TnVsbDtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoYWJsZSA9IG9wdGlvbnMuc2VhcmNoYWJsZSAhPSBudWxsID8gb3B0aW9ucy5zZWFyY2hhYmxlIDogdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IHRoaXMuZGlzcGxheU51bGw7XG4gICAgICAgICAgICB0aGlzLnZpc2libGVSb3dDb3VudCA9IG9wdGlvbnMudmlzaWJsZVJvd0NvdW50IHx8IDEwO1xuXG4gICAgICAgICAgXHR0aGlzLiRlbC5hdHRyKCdtdWx0aXBsZScsIHRoaXMubXVsdGlwbGUpO1xuICAgICAgICAgIFx0dGhpcy4kZWwuYXR0cignZGlzYWJsZWQnLCB0aGlzLmRpc2FibGVkKTtcblxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmNvbXBhcmF0b3IgPSBmdW5jdGlvbihtKXtcbiAgICAgICAgICAgICAgcmV0dXJuIG0uZ2V0KCdpZCcpID8gbS5nZXQoc2VsZi5kaXNwbGF5QXR0cmlidXRlKSA6ICcnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5hZGRNb2RlbHMoW3RoaXMubW9kZWxdKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTW9kZWxzKHRoaXMubW9kZWxzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZih0aGlzLmNoYW5nZUV2ZW50cylcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyTWV0aG9kKCdjaGFuZ2UnLCB0aGlzLmdldFZhbCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRWaWV3T3B0aW9uczogZnVuY3Rpb24oKXtcbiAgICAgICAgXHRyZXR1cm4ge1xuICAgICAgICBcdFx0ZGlzcGxheUF0dHJpYnV0ZSA6IHRoaXMuZGlzcGxheUF0dHJpYnV0ZVxuICAgICAgICBcdH1cbiAgICAgICAgfSxcbiAgICAgICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zZWxlY3RwaWNrZXIoe1xuICAgICAgICAgICAgICAgIGRyb3B1cEF1dG86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGxpdmVTZWFyY2g6IHRoaXMuc2VhcmNoYWJsZSxcbiAgICAgICAgICAgICAgICBtYXhPcHRpb25zOiB0aGlzLm1heE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy52aXNpYmxlUm93Q291bnQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYodGhpcy5tdWx0aXBsZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNb2RlbHModGhpcy5tb2RlbHMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNb2RlbHMoW3RoaXMubW9kZWxdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0VmFsOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zZWxlY3RwaWNrZXIoJ3ZhbCcsIHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldE1vZGVsczogZnVuY3Rpb24gKG1vZGVscykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHZhbHMgPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBtb2RlbHMpe1xuICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IG1vZGVsc1tpXTtcbiAgICAgICAgICAgICAgICBpZihtb2RlbCAmJiBtb2RlbC5nZXQoJ2lkJykpXG4gICAgICAgICAgICAgICAgICAgIHZhbHMucHVzaChtb2RlbC5nZXQoJ2lkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5zZXRWYWwodmFscylcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCB0aGlzLmRpc3BsYXlOdWxsICl7XG4gICAgICAgICAgICAgIHZhciBub09iaiA9IHsgaWQ6IG51bGwgfTtcbiAgICAgICAgICAgICAgbm9PYmpbdGhpcy5kaXNwbGF5QXR0cmlidXRlXSA9IHRoaXMuZGlzcGxheU51bGw7XG4gICAgICAgICAgICAgIHZhciBub01vZGVsID0gbmV3IHRoaXMuY29sbGVjdGlvbi5tb2RlbChub09iaik7XG4gICAgICAgICAgICAgIGlmKCF0aGlzLmNvbGxlY3Rpb24uZ2V0KG5vTW9kZWwpKVxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbi5hZGQobm9Nb2RlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gW11cbiAgICAgICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5jb2xsZWN0aW9uLm1vZGVscyl7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jb2xsZWN0aW9uLm1vZGVsc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBtb2RlbC5nZXQoJ2lkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3BsYXlBdHRyaWJ1dGUgPSBtb2RlbC5nZXQodGhpcy5kaXNwbGF5QXR0cmlidXRlKSB8fCBpZDtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5jb250ZW50ICl7XG4gICAgICAgICAgICAgICAgICB2YXIgZGlzcGxheUF0dHJpYnV0ZSA9IHRoaXMuY29udGVudCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUF0dHJpYnV0ZTogZGlzcGxheUF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoICF0aGlzLmZpbHRlciB8fCB0aGlzLmZpbHRlcihtb2RlbCwgaSwgdGhpcy5jb2xsZWN0aW9uKSApXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChbaWQsIGRpc3BsYXlBdHRyaWJ1dGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IG9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93Lk51dHMpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhbm11cnJheSBvbiAxMi85LzE1LlxuICovXG4oZnVuY3Rpb24gKE51dHMpIHtcbiAgICBOdXRzLmlucHV0cy5UZXh0ID0gTWFyaW9uZXR0ZS5MYXlvdXRWaWV3LmV4dGVuZCh7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ2lucHV0LXRleHQnLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZShcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImxhYmVsLXRleHRcIj48JS1mbG9hdGluZ0xhYmVsVGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJoaW50LXRleHRcIj48JS1oaW50VGV4dCU+PC9kaXY+JyArXG4gICAgICAgICAgJzxpbnB1dCB0eXBlPVwiPCUtdHlwZSU+XCIgdmFsdWU9XCI8JS1kZWZhdWx0VmFsdWUlPlwiPjwvaW5wdXQ+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJib3JkZXItYm90dG9tXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvcmRlci1ib3R0b20taW5hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9yZGVyLWJvdHRvbS1hY3RpdmVcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICcnKSxcbiAgICAgICAgZXZlbnRzOntcbiAgICAgICAgICAna2V5dXAgaW5wdXQnOiAna2V5UHJlc3MnLFxuICAgICAgICAgICdrZXlkb3duIGlucHV0JzogJ2tleVByZXNzJyxcbiAgICAgICAgICAnZm9jdXNpbiAgaW5wdXQnOiAnZm9jdXNJbicsXG4gICAgICAgICAgJ2ZvY3Vzb3V0IGlucHV0JzogJ2ZvY3VzT3V0J1xuICAgICAgICB9LFxuICAgICAgICBrZXlQcmVzczogZnVuY3Rpb24oZSl7XG4gICAgICAgICAgaWYoIHRoaXMuZ2V0VmFsKCkgPT0gJycgKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmaWxsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzSW4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzT3V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRWYWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJ2lucHV0JykudmFsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZXMgPSB7XG4gICAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dDogJycsXG4gICAgICAgICAgICBoaW50VGV4dDogJycsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgICAgICAgICAgdHlwZTogJ3RleHQnXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKGRlZmF1bHRWYWx1ZXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5mbG9hdGluZ0xhYmVsVGV4dCApXG4gICAgICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbGFiZWxlZCcpO1xuICAgICAgICB9LFxuICAgICAgICBvblJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICB0aGlzLmtleVByZXNzKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZhbDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCgnaW5wdXQnKS52YWwodmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVIZWxwZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKHdpbmRvdy5OdXRzKTtcbiJdfQ==
