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
