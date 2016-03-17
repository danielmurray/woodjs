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
