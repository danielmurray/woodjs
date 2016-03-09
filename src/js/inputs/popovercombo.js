(function (toolbox) {
    toolbox.gui.widgets.PopoverCombo = Marionette.LayoutView.extend({
        attributes: {
        	class: "popover-combo",
        	tabindex: 0,
        },
        template: _.template(
			'<div class="hidden-popover-container">' +
				'<div id="popover-container" class="popover-container">' +
					'<div id="combo-container" class="combo-container"></div>' +
					'<div id="save-btn" class="btn btn-primary click-btn"><i class="fa fa-check"></i></div>' +
					'<div id="cancel-btn" class="btn btn-default click-btn"><i class="fa fa-times"></i></div>' +
				'</div>' +
			'</div>' +
			'<div id="label-container" class="<%-cssClass%>"><%= text %></div>' +
        ''),
        popoverTemplate: _.template(
            '<div class="popover popover-combo" role="tooltip">' +
                '<div class="arrow"></div>' +
                '<div class="popover-content"></div>' +
            '</div>' +
        ''),
        regions: {
            ComboContainer : '#combo-container',
            LabelContainer : '#label-container',
        },
        events:{
        	'click #label-container' 	: 'togglePopover',
        	'click #cancel-btn' 		: 'hidePopover',
        },
        togglePopover: function(e){
            var self = this;
            this.collection.fetch({
                cache: !this.disableCache,
            });
            this.popover.popover('toggle')
        },
        hidePopover: function(){
          this.popover.popover('hide');
        },
        savePopover: function(){
        	this.popoverContent.find('.btn').attr('disabled', true);
        	var saveObj = {};
        	saveObj[this.name]=this.combo.getVal();
        	this.triggerMethod('action:save', saveObj);
        },
        initialize: function(options){
        	var self = this;
          this.name = options.name;
        	this.cssClass = options.cssClass;
          this.disableCache = options.disableCache || false;
          this.displayAttribute = options.displayAttribute;
        	this.displayNull = options.displayNull;
        },
        templateHelpers: function(itemModel){
        	return {
        		text: this.model.get(this.displayAttribute) || this.displayNull || 'Unknown',
        		cssClass: this.cssClass || 'label-container'
        	}
        },
        onRender: function () {
            var self = this;
            self.combo = new toolbox.gui.widgets.Combo({
                model: this.model,
                collection: self.collection,
                displayAttribute: self.displayAttribute,
                displayNull: self.displayNull,
            })
            self.ComboContainer.show(self.combo);

            this.popoverContent = this.$('#popover-container');

            this.popoverContent.find('#cancel-btn').click(function(){
                self.hidePopover();
            });

            this.popoverContent.find('#save-btn').click(function(){
                self.savePopover();
            });

            $('body').on('click', function (e) {
                var $target = $(e.target);
                var $label = self.$('#label-container');
                if (!$target.is($label) && $('.popover').has($target).length === 0) {
                    self.hidePopover();
                }
            });
        },
        onShow: function(){
            var self = this;

            this.popover = this.$('#label-container').popover({
                html : true,
                container: 'body',
                placement: 'top',
                trigger: 'manual',
                content: function() {
                    return self.popoverContent;
                },
                template: this.popoverTemplate(),
            });
        }
    });

})(window.toolbox);
