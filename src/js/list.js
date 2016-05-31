class Subheader extends Marionette.ItemView{
  constructor(options) {
    super(options);
    this.text = options.text || '';
  }

  get tagName () {
    return 'wood-subheader';
  }

  get template () {
    return _.template('<%-text%>');
  }

  templateHelpers() {
    return {
      text: this.options.text
    }
  }

}

class Divider extends Marionette.ItemView{
  constructor(options) {
    super(options);
  }

  get tagName () {
    return 'wood-divider';
  }

  get template () {
    return _.template('');
  }
}

class List extends Marionette.CollectionView{
  constructor(options) {
    super(options);
  }

  get childView () {
    return Wood.Item;
  }

  get tagName () {
    return 'wood-list';
  }

  onRender () {

  }
}

class Assistant extends List{
  getChildView (model, index) {
    return model.get('itemView') || this.getOption('childView');
  }

  childViewOptions (model, index) {
    return model.get('itemOptions');
  }

  initialize(options){
    this.options = _.extend({}, this.defaults, options);
    this.collection = new Backbone.Collection(this.options.items);
  }
}

export {Assistant, Divider, List, Subheader}
