/**
 * Created by danmurray on 3/10/15.
 */
(function(Wood) {
  Wood.ExamplePage = Marionette.LayoutView.extend({
    attributes: {
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
      '<div id="card-form-container"></div>' +
      '<div id="card-tree-container"></div>' +
      ''),
    regions: {
      iconContainer: '#icon',
      iconButtonContainer: '#icon-button',
      iconTooltipContainer: '#icon-tooltip',
      iconMaterialContainer: '#icon-material',
      flatButtonContainer: '#flat-button',
      raisedButtonContainer: '#raised-button',
      cardFormContainer: '#card-form-container',
      cardTreeContainer: '#card-tree-container',
    },
    events: {},
    initialize: function(options) {

    },
    onRender: function() {
      // // Icons
      var icon = new Wood.Icon({
        icon: 'check'
      });
      // this.iconContainer.show(icon);
      var iconButton = new Wood.IconButton({
        icon: 'check'
      });
      // this.iconButtonContainer.show(iconButton);
      var iconTooltip = new Wood.IconButton({
        icon: 'check',
        tooltip: 'Tooltip'
      });
      // this.iconTooltipContainer.show(iconTooltip);
      var iconMaterial = new Wood.IconButton({
        iconClass: 'material',
        icon: 'android',
        tooltip: 'Material Icon'
      });
      // this.iconMaterialContainer.show(iconMaterial);

      // Buttons
      var flatButton = new Wood.FlatButton();
      // this.flatButtonContainer.show(flatButton)
      var raisedButton = new Wood.RaisedButton();
      // this.raisedButtonContainer.show(raisedButton);

      // Card & Form
      var card = new Wood.Card({
        primaryText: 'Sign In',
        headerOptions: {
          icon: 'sign-in',
          shape: 'circle',
          backgroundColor: 'white',
        },
        contentView: Wood.Form,
        contentOptions: {
          inputs: [{
            id: 'username',
            view: Wood.Input,
            options: {
              floatingLabelText: 'Username',
              hintText: 'Are you the Keymaster?',
              isRequired: true
            }
          }, {
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
        }
      });
      // this.cardFormContainer.show(card)

      // Card & Tree
      var card = new Wood.Card({
        primaryText: 'Tree',
        headerOptions: {
          icon: 'tree',
        },
        contentView: Wood.Tree,
        contentOptions: {
          itemOptions: {
            leftIcon: true,
            leftIconOptions: {
              icon: 'empire',
            },
            primaryText: 'Anakin Skywalker',
            secondaryText: 'Darth Vader',
            rightIcon: true,
            rightIconView: Wood.Checkbox
          },
          children: [{
            itemOptions: {
              leftIcon: true,
              leftIconOptions: {
                icon: 'rebel',
              },
              primaryText: 'Leia Organa Solo',
              secondaryText: 'Princess Leia',
              rightIcon: true,
              rightIconView: Wood.Checkbox
            },
            children: [{
              itemOptions: {
                leftIcon: true,
                leftIconOptions: {
                  icon: 'rebel',
                },
                primaryText: 'Jaina Solo',
                secondaryText: 'Definitely Kylo Ren',
                rightIcon: true,
                rightIconView: Wood.Checkbox
              },
              children: [],
            }, {
              itemOptions: {
                leftIcon: true,
                leftIconOptions: {
                  icon: 'empire',
                },
                primaryText: 'Jacen Solo',
                secondaryText: 'Darth Caedus',
                rightIcon: true,
                rightIconView: Wood.Checkbox
              },
              children: [],
            }, {
              itemOptions: {
                leftIcon: true,
                leftIconOptions: {
                  icon: 'rebel',
                },
                primaryText: 'Anakin Solo',
                secondaryText: 'Lil\' Ani',
                rightIcon: true,
                rightIconView: Wood.Checkbox
              },
              children: [],
            }],
          }, {
            itemOptions: {
              leftIcon: true,
              leftIconOptions: {
                icon: 'rebel',
              },
              primaryText: 'Luke Skywalker',
              secondaryText: 'A New Hope',
              rightIcon: true,
              rightIconView: Wood.Checkbox
            },
            children: [],
          }],
        }
      });
      this.cardTreeContainer.show(card)

    },
    templateHelpers: function() {}
  });
})(window.Wood);
