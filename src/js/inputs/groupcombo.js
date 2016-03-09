(function (toolbox) {

    var ComboItem = Marionette.ItemView.extend({
        model: Backbone.Model,
        tagName: 'option',
        template: _.template('<%= text %>'),
        initialize: function(options){
            this.displayAttribute = options.displayAttribute;
        	this.level = options.level;
        },
        templateHelpers: function(itemModel){
        	return {
        		text: this.model.get(this.displayAttribute),
        	}
        },
        onRender: function () {
            this.$el.val(this.level+'-'+this.model.get('id'));
        }
    });

    var ComboOptGroup = Marionette.CollectionView.extend({
        collection: Backbone.Collection,
        childView: ComboItem,
        tagName: 'optgroup',
        template: _.template(''),
        collectionEvents: {
            "sync": "rerender",
        },
        initialize: function (options) {
          var self = this;
          this.displayAttribute = options.displayAttribute;
          this.displayNull = options.displayNull;
          this.level = options.level;
          this.name = options.name;

          this.collection.comparator = function(m){
            return m.get('id') ? m.get(self.displayAttribute) : '';
          };
        },
        childViewOptions: function(){
            return {
                level : this.level,
                displayAttribute : this.displayAttribute
            }
        },
        rerender: function(){
          if ( this.displayNull ){
            var noObj = { id: ''};
            noObj[this.displayAttribute] = this.displayNull;
            var noModel = new this.collection.model(noObj);
            if(!this.collection.get(noModel))
              this.collection.add(noModel);
          }

          this.triggerMethod('action:rerender');
        },
    });

    toolbox.gui.widgets.GroupCombo = Marionette.LayoutView.extend({
        tagName: 'select',
        attributes: {
            class: 'selectpicker'
        },
        template: _.template(
            '<% for(var i in groups) { %> ' +
            '<%     var group = groups[i] %>' +
                '<optgroup id="<%-group.id%>" label="<%-group.name%>"></optgroup>' +
            '<% } %>' +
        ''),
        events: {
            'change': 'triggerChange'
        },
        childEvents: {
            "action:rerender": "rerender",
        },
        rerender: function(){
            var val = this.getVal() || this.val;
            this.render();
            this.refresh();
            this.setVal(val)
        },
        refresh: function(){
            this.$el.selectpicker('refresh');
        },
        triggerChange: function(){
            this.triggerMethod('change');
        },
        getVal: function () {
            return this.$el.selectpicker('val');
        },
        initialize: function (options) {
          this.groups = options.groups;
          this.searchable = options.searchable ? options.searchable : true;
          this.visibleRowCount = options.visibleRowCount || 10;
        },
        onRender: function () {
            for(var i in this.groups){
                var group = this.groups[i];
                this.addRegion(group.id, '#'+group.id);
                var view = new ComboOptGroup(group)
                this.getRegion(group.id).show(view)
                $(view.$el).replaceWith(view.$el.children())
            }
        },
        onShow: function () {
            this.$el.selectpicker({
                liveSearch: this.searchable,
                size: this.visibleRowCount
            });
        },
        setVal: function (val) {
            this.val = val;
            this.$el.selectpicker('val', val);
        },
        templateHelpers:function(){
            return {
                groups: this.groups
            }
        }
    });
})(window.toolbox);
