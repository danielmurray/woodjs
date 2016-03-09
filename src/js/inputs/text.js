/**
 * Created by danmurray on 12/9/15.
 */
(function (Wood) {
    Wood.inputs.Text = Marionette.LayoutView.extend({
        attributes: {
          class: 'input-text',
        },
        template: _.template(
          '<div class="label-text"><%-floatingLabelText%></div>' +
          '<div class="hint-text"><%-hintText%></div>' +
          '<input type="<%-type%>" value="<%-defaultValue%>"></input>' +
          '<div class="border-bottom">' +
            '<div class="border-bottom-inactive"></div>' +
            '<div class="border-bottom-active"></div>' +
          '</div>' +
        ''),
        events:{
          'keyup input': 'keyPress',
          'keydown input': 'keyPress',
          'focusin  input': 'focusIn',
          'focusout input': 'focusOut'
        },
        keyPress: function(e){
          if( this.getVal() == '' ){
            this.$el.removeClass('filled');
          }else{
            this.$el.addClass('filled');
          }
        },
        focusIn : function(){
          this.$el.addClass('focused');
        },
        focusOut : function(){
          this.$el.removeClass('focused');
        },
        getVal: function () {
            return this.$('input').val();
        },
        initialize: function (options) {
          var defaultValues = {
            floatingLabelText: '',
            hintText: '',
            defaultValue: '',
            type: 'text'
          };

          this.options = _.extend(defaultValues, options);

          if( this.options.floatingLabelText )
            this.$el.addClass('labeled');
        },
        onRender: function(){
          this.keyPress();
        },
        setVal: function (val) {
            return this.$('input').val(val);
        },
        templateHelpers: function(){
          return _.extend({}, this.options, {
          });
        }
    });
})(window.Wood);
