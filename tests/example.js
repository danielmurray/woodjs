/**
 * Created by danmurray on 3/10/15.
 */
(function (Wood) {
    Wood.ExamplePage = Marionette.LayoutView.extend({
      attributes:{
        class: 'example-page'
      },
      template: _.template(
        '<div class="icons display-row">' +
          '<div id="icon"></div>' +
          '<div id="icon-button"></div>' +
          '<div id="icon-tooltip"></div>' +
          '<div id="icon-material"></div>' +
        '</div>' +
        '<div class="buttons display-row">' +
          '<div id="flat-button"></div>' +
          '<div id="raised-button"></div>' +
        '</div>' +
        '<div id="form-container"></div>' +
      ''),
      regions:{
        iconContainer:          '#icon',
        iconButtonContainer:    '#icon-button',
        iconTooltipContainer:   '#icon-tooltip',
        iconMaterialContainer:  '#icon-material',
        flatButtonContainer:    '#flat-button',
        raisedButtonContainer:  '#raised-button',
        formContainer:          '#form-container',
      },
      events:{
      },
      initialize: function (options) {

      },
      onRender: function(){
        // // Icons
        var icon = new Wood.Icon({
          icon: 'check'
        });
        this.iconContainer.show(icon);
        var iconButton = new Wood.IconButton({
          icon: 'check'
        });
        this.iconButtonContainer.show(iconButton);
        var iconTooltip = new Wood.IconButton({
          icon: 'check',
          tooltip: 'Tooltip'
        });
        this.iconTooltipContainer.show(iconTooltip);
        var iconMaterial = new Wood.IconButton({
          iconClass: 'material',
          icon: 'android',
          tooltip: 'Material Icon'
        });
        this.iconMaterialContainer.show(iconMaterial);

        // Buttons
        var flatButton = new Wood.FlatButton();
        this.flatButtonContainer.show(flatButton)
        var raisedButton = new Wood.RaisedButton();
        this.raisedButtonContainer.show(raisedButton);

        // Form
        var form = new Wood.Form({
          inputs: [{
            id: 'username',
            view: Wood.Input,
            options: {
              floatingLabelText: 'Username',
              hintText: 'Are you the Keymaster?',
              isRequired: true
            }
          },{
            id: 'password',
            view: Wood.Input,
            options: {
              floatingLabelText: 'Password',
              hintText: 'I am the Gatekeeper.',
              type: 'password',
              isRequired: true
            },
          }],
          submitButton: {
            label: 'Sign In'
          }
        });
        this.formContainer.show(form)

      },
      templateHelpers: function(){
      }
    });
})(window.Wood);
