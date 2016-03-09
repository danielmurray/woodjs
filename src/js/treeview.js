/**
 * Created by psuresh on 7/16/15.
 */
(function (toolbox) {
    toolbox.gui.widgets.TreeViewWidget = Marionette.ItemView.extend({
        template: _.template(''),
        initialize: function (options) {
            this.treeRoot = options.treeRoot;
            this.data = options.data;
            this.levels = options.levels;
            this.treeViewOptions = {
                'showCheckbox': true,
                'onNodeChecked': this.defaultOnNodeChecked,
                'onNodeUnchecked': this.defaultOnNodeUnchecked
            };
            this.treeViewOptions = _.extend(this.treeViewOptions, options.treeViewOptions);
        },
        onRender: function () {
            this.treeRoot.treeview({
                data: this.data,
                levels: this.levels,
                showCheckbox: this.treeViewOptions.showCheckbox,
                onNodeChecked: this.treeViewOptions.onNodeChecked,
                onNodeUnchecked: this.treeViewOptions.onNodeUnchecked
            });
        },

        defaultOnNodeChecked: function (event, node) {
            var parent = $(this).data('treeview').getParent(node);
            if (parent != undefined) {
                $(this).data('treeview').checkNode(parent);
            }
        },

        defaultOnNodeUnchecked: function (event, node) {
            var children = [];
            _.each(node.nodes, function (child, index) {
                children[index] = child.nodeId;
            });
            $(this).data('treeview').uncheckNode(children);
        }
    });
})(window.toolbox);
