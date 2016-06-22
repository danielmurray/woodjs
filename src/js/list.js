class Subheader extends Marionette.ItemView {
  constructor (options) {
    super(options);
    this.text = options.text || '';
  }

  get tagName () {
    return 'wood-subheader';
  }

  get template () {
    return _.template('<%-text%>');
  }

  templateHelpers () {
    return {
      text: this.options.text
    };
  }
}

class Divider extends Marionette.ItemView {
  get tagName () {
    return 'wood-divider';
  }

  get template () {
    return _.template('');
  }
}

class List extends Marionette.CollectionView{
  get tagName () {
    return 'wood-list';
  }

  getChild (index) {
    return this.children.find(function (view) {
      return view._index === index;
    });
  }

  getChildView (model, index) {
    return Wood.Item;
  }
}

class Assistant extends List {
  getChildView (model, index) {
    return model.get('itemView') || this.getOption('childView') || Wood.Item;
  }

  childViewOptions (model, index) {
    return model.get('itemOptions');
  }

  initialize (options) {
    this.options = _.extend({}, this.defaults, options);
    this.collection = new Backbone.Collection(this.options.items);
  }
}

export {Assistant, Divider, List, Subheader};
