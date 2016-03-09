/**
 * Created by danmurray on 12/9/15.
 */
(function (Wood) {
    Wood.inputs.Combo = Marionette.ItemView.extend({
        tagName: 'select',
        attributes: {
            class: 'selectpicker'
        },
        template: _.template(
            '<% ' +
            'for( var i in options){ ' +
                'var option = options[i]' +
            '%>' +
                '<option value="<%-option[0]%>" data-content="<%-option[1]%>"></option>' +
            '<% } %>' +
        ''),
        events:{
            'change' : 'changeEvent'
        },
        collectionEvents: {
            "sync": "rerender",
        },
        addModels: function(models){
            for(var i in models){
                var model = models[i];
                if( model!=undefined && model.get('id'))
                    this.collection.add(this.model);
            }
        },
        rerender: function(){
            var val = this.getVal();
            this.render();
            this.refresh();
            if(this.multiple){
                this.setModels(this.models);
            }else{
              if(val){
                  this.setVal(val)
              }else{
                this.setModels([this.model]);
              }
            }
        },
        refresh: function(){
            this.$el.selectpicker('refresh');
        },
        getVal: function () {
          return this.$el.selectpicker('val') || (this.multiple ? [] : null);
        },
        initialize: function (options) {
            var self = this;
            this.id = options.id;
            this.changeEvents = options.changeEvents || false;
            this.content = options.content;
            this.disabled = options.disabled;
            this.displayAttribute = options.displayAttribute;
            this.filter = options.filter;
            this.maxOptions = options.maxOptions;
            this.models = options.models || [];
            this.multiple = options.multiple;
            this.displayNull = options.displayNull;
            this.searchable = options.searchable != null ? options.searchable : true;
            this.title = options.title || this.displayNull;
            this.visibleRowCount = options.visibleRowCount || 10;

          	this.$el.attr('multiple', this.multiple);
          	this.$el.attr('disabled', this.disabled);

            this.collection.comparator = function(m){
              return m.get('id') ? m.get(self.displayAttribute) : '';
            };

            this.addModels([this.model]);
            this.addModels(this.models);
        },
        changeEvent: function(){
            if(this.changeEvents)
              this.triggerMethod('change', this.getVal());
        },
        childViewOptions: function(){
        	return {
        		displayAttribute : this.displayAttribute
        	}
        },
        onShow: function () {
            this.$el.selectpicker({
                dropupAuto: false,
                liveSearch: this.searchable,
                maxOptions: this.maxOptions,
                size: this.visibleRowCount,
                title: this.title,
            });

            if(this.multiple){
                this.setModels(this.models);
            }else{
                this.setModels([this.model]);
            }
        },
        setVal: function (val) {
            this.$el.selectpicker('val', val);
        },
        setModels: function (models) {
            var self = this;
            var vals = [];
            for(var i in models){
                var model = models[i];
                if(model && model.get('id'))
                    vals.push(model.get('id'));
            }
            self.setVal(vals)
        },
        templateHelpers: function(){
            if ( this.displayNull ){
              var noObj = { id: null };
              noObj[this.displayAttribute] = this.displayNull;
              var noModel = new this.collection.model(noObj);
              if(!this.collection.get(noModel))
                this.collection.add(noModel);
            }

            var options = []
            for( var i in this.collection.models){
                var model = this.collection.models[i];
                var id = model.get('id');
                var displayAttribute = model.get(this.displayAttribute) || id;
                if( this.content ){
                  var displayAttribute = this.content({
                    id: id,
                    displayAttribute: displayAttribute
                  })
                }
                if( !this.filter || this.filter(model, i, this.collection) )
                    options.push([id, displayAttribute]);
            }
            return {
                options : options
            }
        }
    });
})(window.Wood);
