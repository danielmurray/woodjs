// TODO change component name
class Popover extends Marionette.LayoutView {
  get tagName () {
    return 'wood-popover';
  }

  get template () {
    return _.template(`
      <div id="content-container" class="content-container"></div>
    `);
  }

  getContent () {
    return this.content;
  }

  getContentView () {
    return this.contentView;
  }

  getContentViewOptions () {
    return this.contentViewOptions;
  }

  hide () {
    this.$el.removeClass('expanded');
  }

  initialize (options) {
    this.contentView = options.contentView || null;
    this.contentViewOptions = options.contentViewOptions || null;
  }

  onRender () {
    var ContenViewClass = this.getContentView();
    var contenViewOptions = this.getContentViewOptions();
    this.content = new ContenViewClass(contenViewOptions);
    this.contentContainer.show(this.content);
  }

  regions () {
    return {
      contentContainer: '#content-container'
    };
  }

  show () {
    this.$el.addClass('expanded');
  }

  templateHelpers () {
    return { };
  }
}

export {Popover};
