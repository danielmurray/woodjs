/**
 * Created by danmurray on 4/6/16.
 */
(function(Wood) {
  Wood.Dropdown = Marionette.LayoutView.extend({
    tagName: 'wood-dropdown',
    template: _.template(
      '<div id="button-container" class="button-container"></div>' +
      '<div id="dropdown-container" class="dropdown-container"></div>' +
    ''),
    regions: {
      buttonContainer   : '#button-container',
      dropdownContainer : '#dropdown-container'
    },
    childEvents: {
      'action:dropdown:expand' : 'onDropdownExpand',
      'action:dropdown:collapse' : 'onDropdownCollapse',
      // 'action:button:click'     : 'forkSession',
      // 'action:menubutton:click' : 'onMenuButtonClick',
      // 'action:menuitem:click'   : 'onMenuItemClick',
    },
    onDropdownCollapse: function(){
      this.$('.dropdown-container').removeClass('expanded');
    },
    onDropdownExpand: function(){
      var self = this;
      event.stopPropagation();
      this.$('.dropdown-container').addClass('expanded');

      $('body').bind('mousedown', function(e){
        var target = $(e.target);
        var outDropdown = self.$('#dropdown-container').find(target).length == 0;
        if( outDropdown ) {
          var outButton = self.$('#button-container').find(target).length == 0;
          if( outButton ) {
            self.buttonContainer.currentView.mouseDown(e)
          }
          self.onDropdownCollapse();
          $( this ).unbind(e);
        }
      });
    },
    defaults: {

    },
    initialize: function (options) {
      this.options = _.extend({}, this.defaults, this.options);
    },
    onBeforeDestroy: function(){
      $('body').unbind('click');
    },
    onRender: function () {
      var button = new Wood.DropdownButton(
        this.options.buttonOptions
      );
      this.buttonContainer.show(button);

      if( this.options.contentView ){
        var contentView = new this.options.contentView(
          this.options.contentOptions
        );
        this.dropdownContainer.show(contentView);
      }
    },
    templateHelpers: function(){
      return _.extend({}, this.options, {
      });
    }
  });
})(window.Wood);
