import {List} from './list.js';

class InputList extends List {
  get childEvents () {
    return {
      'input:change': 'onInputChange'
    };
  }

  get error () {
    var error = false;
    for (var i in this.children._views) {
      var childView = this.children._views[i];
      error = error || childView.error;
    }
    return error;
  }

  get values () {
    var values = {};
    for (var i in this.children._views) {
      var childView = this.children._views[i];
      values[childView.id] = childView.value;
    }
    return values;
  }

  childViewOptions (model, index) {
    return model.attributes;
  }

  getChildView (model, index) {
    return Wood.Input;
  }

  onInputChange (inputView) {
    console.log(this.error);
    this.triggerMethod('inputs:change', !this.error);
  }

  validate () {
    var valid = true;
    for (var i in this.children._views) {
      var childView = this.children._views[i];
      var childValid = childView.validate();
      valid = valid && childValid;
    }
    return valid;
  }
}

class Form extends Marionette.LayoutView {
  get attributes () {
    return {
      class: 'wood form'
    };
  }

  get childEvents () {
    return {
      'click:button': 'onFormSubmit',
      'inputs:change': 'onInputsChange'
    };
  }

  get error () {
    return this.inputListContainer.currentView.error;
  }

  get inputs () {
    return new Backbone.Collection(this._inputs);
  }

  get submitButtonView () {
    return Wood.RaisedButton;
  }

  get submitButtonViewOptions () {
    return this._submitButtonViewOptions;
  }

  get tagName () {
    return 'form';
  }

  get template () {
    return _.template(`
      <div id="input-list-container" class="input-list"></div>
      <div class="btns">
        <div id="submit-btn" class="submit-btn"></div>
      </div>
    `);
  }

  get values () {
    return this.inputListContainer.currentView.values;
  }

  events () {
    return {
      submit: 'onFormSubmit'
    };
  }

  initialize (options) {
    this._inputs = options.inputs || [];
    this._submitButtonViewOptions = options.submitButton || {label: 'Submit'};
  }

  onError () {
    var submitButton = this.submitBtnContainer.currentView;
    submitButton.onError();
  }

  onFormSubmit (event) {
    event.preventDefault();
    this.submitForm();
  }

  onInputsChange (inputListView, valid) {
    var submitButton = this.submitBtnContainer.currentView;
    submitButton.disable(!valid);
  }

  onPost () {
    var submitButton = this.submitBtnContainer.currentView;
    submitButton.onPost();
  }

  onRender () {
    var inputList = new InputList({
      model: this.model,
      collection: this.inputs
    });
    this.inputListContainer.show(inputList);

    var submitButtonView = new this.submitButtonView( _.extend({},
      this.submitButtonViewOptions, {
        disabled: !!this.error
      })
    );
    this.submitBtnContainer.show(submitButtonView);
  }

  onSuccess () {
    var submitButton = this.submitBtnContainer.currentView;
    submitButton.onSuccess();
  }

  regions () {
    return {
      inputListContainer: '#input-list-container',
      submitBtnContainer: '#submit-btn'
    };
  }

  submitForm () {
    if (this.validate()) {
      var data = this.getData();
      this.triggerMethod('action:submit:form', data);
    }
  }

  validate () {
    return this.inputListContainer.currentView.validate();
  }
}

export {InputList, Form};
