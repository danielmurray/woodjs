class Input extends Marionette.LayoutView {

  get attributes () {
    return {
      class: 'wood input'
    };
  }

  get childEvents () {
    return {
      'click:button': 'onFormSubmit',
      'inputs:change': 'onInputsChange'
    };
  }

  get disabled () {
    return this._disabled;
  }

  set disabled (disabled) {
    if (disabled) {
      this.$el.addClass('disabled');
    } else {
      this.$el.removeClass('disabled');
    }
    this._disabled = disabled;
  }

  get error () {
    return this._error;
  }

  set error (error) {
    if (error) {
      this.$el.addClass('erred');
      this.$('#error-text').text(error);
    } else {
      this.$el.removeClass('erred');
      this.$('#error-text').text('');
    }
    this._error = error;
  }

  get filled () {
    return this._filled;
  }

  set filled (filled) {
    if (filled) {
      this.$el.addClass('filled');
    } else {
      this.$el.removeClass('filled');
    }
    this._filled = filled;
  }

  get floatingLabelText () {
    return this._floatingLabelText;
  }

  set floatingLabelText (floatingLabelText) {
    if (floatingLabelText) {
      this.$el.addClass('labeled');
    }
    this._floatingLabelText = floatingLabelText;
  }

  get template () {
    return _.template(`
      <div class="label-placeholder"></div>
      <div class="label-text"><%-floatingLabelText%></div>
      <div class="hint-text"><%-hintText%></div>
      <input type="<%-type%>" value="<%-value%>" <%-disabled%>"></input>
      <div class="border-bottom">
        <div class="border-bottom-inactive"></div>
        <div class="border-bottom-active"></div>
      </div>
      <div id="error-text" class="error-text"></div>
    `);
  }

  get value () {
    return this.$('input').val();
  }

  set value (value) {
    this._value = value;
    if (this._value === '') {
      this.$el.removeClass('filled');
    } else {
      this.$el.addClass('filled');
    }
    return this.$('input').val(value);
  }

  errorMessage () {
    return false;
  }

  events () {
    return {
      'change input': 'keyPress',
      'keyup input': 'keyPress',
      'keydown input': 'keyPress',
      'focusin  input': 'onFocusIn',
      'focusout input': 'onFocusOut'
    };
  }

  initialize (options) {
    this.id = options.id || null;
    this.disabled = options.disabled || false;
    this.floatingLabelText = options.floatingLabelText || '';
    this.hintText = options.hintText || '';
    this.required = options.required || false;
    this.type = options.type || 'text';
    this.value = options.defaultValue || '';
  }

  keyPress (event) {
    this.filled = this.value !== '';
    this.onChange();
    this.triggerMethod('input:change');
  }

  onChange () {

  }

  onFocusIn () {
    this.$el.addClass('focused');
  }

  onFocusOut () {
    this.$el.removeClass('focused');
    this.validate();
    this.triggerMethod('input:change');
  }

  templateHelpers () {
    return {
      disabled: this.disabled ? 'disabled=true' : '',
      floatingLabelText: this.floatingLabelText,
      hintText: this.hintText,
      value: this.value,
      type: this.type
    };
  }

  validate () {
    var error = false;
    if (this.required && this.value === '') {
      error = 'This field is required';
    }
    this.error = error || this.errorMessage(this.value);
  }
}

export {Input};
