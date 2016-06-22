// TODO change component name
import {Input} from './input.js';
import {List} from './list.js';
import {Popover} from './popover.js';

class DropdownList extends List {
  get childEvents () {
    return {
      'action:click:item': 'onItemClick'
    };
  }

  get hoveredIndex () {
    return this._hoveredIndex;
  }

  set hoveredIndex (index) {
    if (this.hoveredIndex != null) {
      var oldChild = this.getChild(this._hoveredIndex);
      oldChild.$el.removeClass('hover');
    }

    this._hoveredIndex = index;
    if (index !== null) {
      var newChild = this.getChild(index);
      newChild.$el.addClass('hover');
      this.scrollToMe(newChild);
    }
  }

  get searchTerm () {
    return this._searchTerm;
  }

  set searchTerm (term) {
    this.hoveredIndex = null;
    this._searchTerm = term;
    this.render();
  }

  childViewOptions (model, index) {
    return {
      primaryText: model.get('label')
    };
  }

  decrementHoveredIndex () {
    if (this.hoveredIndex !== null) {
      if (this.hoveredIndex > 0) {
        this.hoveredIndex -= 1;
      }
    } else {
      this.hoveredIndex = this.children.length;
    }
  }

  filter (child, index, collection) {
    var childLabel = child.get('label').toLowerCase();
    var searchTerms = this.searchTerm.split(' ').map((s) => s.toLowerCase());
    return searchTerms.every((s) => childLabel.includes(s));
  }

  getValue () {
    var childView = this.getChild(this.hoveredIndex);
    return childView.model;
  }

  getChildView (model, index) {
    return Wood.ItemButton;
  }

  incrementHoveredIndex () {
    if (this.hoveredIndex !== null) {
      if (this.hoveredIndex < this.children.length - 1) {
        this.hoveredIndex += 1;
      }
    } else {
      this.hoveredIndex = 0;
    }
  }

  initialize (options) {
    this.hoveredIndex = options.hoveredIndex || null;
    this.searchTerm = options.searchTerm || '';
  }

  onItemClick (itemView) {
    var itemModel = itemView.model;
    this.triggerMethod('item:select', itemModel);
  }

  scrollToMe (itemView) {
    // TODO make this elegant
    var someWeirdOffest = 266.5;
    var popoverHeight = this.$el.height();
    var popoverTopOffset = this.$el.scrollTop();
    var popoverBottomOffset = popoverTopOffset + popoverHeight;
    var itemHeight = itemView.$el.height();
    var itemTopOffset = itemView.$el.offset().top - someWeirdOffest;
    var itemBottmOffset = itemTopOffset + itemHeight;
    if (itemBottmOffset > popoverBottomOffset) {
      this.$el.scrollTop(itemBottmOffset + popoverTopOffset - popoverHeight);
    } else if (itemTopOffset < 0) {
      this.$el.scrollTop(itemTopOffset + popoverTopOffset);
    }
  }
}

class InputDropdown extends Marionette.LayoutView {
  get childEvents () {
    return {
      'input:change': 'onInputChange'
    };
  }

  get tagName () {
    return 'wood-input-dropdown';
  }

  get template () {
    return _.template(`
      <div id="input-container" class="input-container"></div>
      <div id="popover-container" class="popover-container"></div>
    `);
  }

  get label () {
    if (this._value) {
      return this._value.get('label');
    }
  }

  get value () {
    if (this._value) {
      return value.get('value');
    }
  }

  set value (value) {
    var valueModel = this.dropdownOptions.get(value);
    if (valueModel) {
      this._value = valueModel;
      this.input.value = this.label;
      return true;
    } else {
      return false;
    }
  }

  events () {
    return {
      'keydown': 'keyPress',
      'focusin': 'onFocusIn',
      'focusout': 'onFocusOut'
    };
  }

  keyPress (e) {
    var keynum = e.keyCode;
    if (keynum === 38) {
      // Move selection up
      this.dropdownList.decrementHoveredIndex();
    }

    if (keynum === 40) {
      // Move selection down
      this.dropdownList.incrementHoveredIndex();
    }

    if (keynum === 13) {
      // Act on current selection
      e.stopImmediatePropagation();
      this.value = this.dropdownList.getValue();
    }
  }

  initialize (options) {
    this.inputOptions = {
      id: options.id,
      disabled: options.disabled,
      floatingLabelText: options.floatingLabelText,
      hintText: options.hintText,
      required: options.required,
      type: options.type,
      defaultValue: options.defaultValue
    };
    this._value = options.defaultValue;
    this.dropdownOptions = new Backbone.Collection(options.options);
  }

  onFocusIn () {
    this.popover.show();
  }

  onFocusOut () {
    this.popover.hide();
  }

  onInputChange (inputView, inputValue) {
    this.dropdownList.searchTerm = inputValue;
  }

  onItemHover (itemView) {

  }

  onItemSelect (itemModel) {
    this.value = itemModel;
  }

  onRender () {
    this.input = new Input(_.extend({}, this.inputOptions, {
      value: this.label
    }));
    this.inputContainer.show(this.input);

    this.popover = new Popover({
      contentView: DropdownList,
      contentViewOptions: {
        collection: this.dropdownOptions
      }
    });
    this.popoverContainer.show(this.popover);

    this.dropdownList = this.popover.getContent();
    this.listenTo(this.dropdownList, 'item:select', this.onItemSelect);
  }

  regions () {
    return {
      inputContainer: '#input-container',
      popoverContainer: '#popover-container'
    };
  }

  templateHelpers () {
    return { };
  }
}

export {InputDropdown};
