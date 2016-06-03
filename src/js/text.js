export class Header extends Marionette.ItemView{
  constructor (options) {
    super(options);
    this.text = options || '';
  }

  get tagName () {
    return 'wood-header';
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

export {Header};
