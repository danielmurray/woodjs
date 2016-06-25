/**
 * Created by danmurray on 3/10/15.
 */
(function(Wood) {
  var IconDemo = Marionette.LayoutView.extend({
    template: _.template(
      '<div class="icons display-row">' +
        '<div id="icon"></div>' +
        '<div id="icon-button"></div>' +
        '<div id="icon-tooltip"></div>' +
        '<div id="icon-material"></div>' +
      '</div>' +
    ''),
    regions: {
      iconContainer: '#icon',
      iconButtonContainer: '#icon-button',
      iconTooltipContainer: '#icon-tooltip',
      iconMaterialContainer: '#icon-material',
    },
    onRender: function () {
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
    }
  });

  var ButtonDemo = Marionette.LayoutView.extend({
    template: _.template(
      '<div class="buttons display-row">' +
        '<div id="flat-button"></div>' +
        '<div id="raised-button"></div>' +
      '</div>' +
    ''),
    regions: {
      flatButtonContainer: '#flat-button',
      raisedButtonContainer: '#raised-button',
    },
    onRender: function () {
      // Buttons
      var flatButton = new Wood.FlatButton();
      this.flatButtonContainer.show(flatButton);
      var raisedButton = new Wood.RaisedButton();
      this.raisedButtonContainer.show(raisedButton);
    }
  });

  Wood.DemoPage = Marionette.LayoutView.extend({
    attributes: {
      class: 'demo-page'
    },
    template: _.template(
      '<div id="icon-demo"></div>' +
      '<div id="button-demo"></div>' +
      '<div id="form-demo"></div>' +
      '<div id="list-demo"></div>' +
      '<div id="spinner-demo"></div>' +
      ''),
    regions: {
      iconDemo: '#icon-demo',
      buttonDemo: '#button-demo',
      formDemo: '#form-demo',
      listDemo: '#list-demo',
      spinnerDemo: '#spinner-demo',
    },
    events: {},
    initialize: function (options) {

    },
    onRender: function () {

      var iconDemoCard = new Wood.Card({
        primaryText: 'Icons',
        headerOptions: {
          icon: 'car',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: IconDemo
      });
      this.iconDemo.show(iconDemoCard);

      var buttonDemoCard = new Wood.Card({
        primaryText: 'Buttons',
        headerOptions: {
          icon: 'hand-pointer-o',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: ButtonDemo
      });
      this.buttonDemo.show(buttonDemoCard);

      // Card & Form
      var formDemoCard = new Wood.Card({
        primaryText: 'Form',
        headerOptions: {
          icon: 'question',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: Wood.Assistant,
        contentOptions: {
          items: [{
            itemView: Wood.InputDropdown,
            itemOptions: {
              // defaultValue: 'smart_and_final',
              floatingLabelText: 'Select',
              hintText: 'A Store',
              options: [
                {
                  value: 'safeway',
                  label: 'Safeway'
                }, {
                  value: 'whole_foods',
                  label: 'Whole Foods'
                }, {
                  value: 'fresh_and_easy',
                  label: 'Fresh & Easy'
                }, {
                  value: 'stop_n_save',
                  label: 'Stop N Save'
                }, {
                  value: 'smart_and_final',
                  label: 'Smart & Final'
                }, {
                  value: 'grocery_outlet',
                  label: 'Grocery Outlet'
                }
              ]
            }
          }, {
            itemView: Wood.Input,
            itemOptions: {
              id: 'username',
              floatingLabelText: 'Username',
              hintText: 'Are you the Keymaster?'
            }
          }, {
            itemView: Wood.Input,
            itemOptions: {
              id: 'password',
              floatingLabelText: 'Password',
              hintText: 'I am the Gatekeeper.',
              defaultValue: 'password',
              type: 'password',
              required: true
            }
          }, {
            itemView: Wood.Input,
            itemOptions: {
              id: 'social_security',
              floatingLabelText: 'Social Security',
              defaultValue: 'This is disabled',
              disabled: true
            }
          }, {
            itemView: Wood.Item,
            itemOptions: {
              rightIcon: true,
              rightIconView: Wood.Checkbox,
              rightIconOptions: {
                checked: false,
              },
              primaryText: 'Checkbox',
            }
          }, {
            itemView: Wood.RaisedButton,
            itemOptions: {
              label: 'Submit'
            }
          }]
        }
      });
      this.formDemo.show(formDemoCard);

      // Card & List
      var listDemo = new Wood.Card({
        primaryText: 'List',
        headerOptions: {
          icon: 'list',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: Wood.Assistant,
        contentOptions: {
          items: [{
            itemView: Wood.Subheader,
            itemOptions: {
              text: 'Multiple Lines'
            }
          }, {
            itemOptions: {
              primaryText: 'Single Line'
            }
          }, {
            itemOptions: {
              primaryText: 'Two Lines',
              secondaryText: 'Look at all this content!'
            }
          }, {
            itemOptions: {
              primaryText: 'Three Lines',
              secondaryText: 'Holy cow this is awesome, I never knew we could include so much information! I am so excited'
            }
          }, {
            itemView: Wood.Subheader,
            itemOptions: {
              text: 'Avatars'
            }
          }, {
            itemOptions: {
              leftIcon: true,
              leftIconView: Wood.Avatar,
              leftIconOptions: {
                letter: 'T',
                shape: 'circle',
                backgroundColor: 'grey-light'
              },
              primaryText: 'Character'
            }
          }, {
            itemOptions: {
              leftIcon: true,
              leftIconView: Wood.Avatar,
              leftIconOptions: {
                icon: 'thumbs-o-up',
                shape: 'circle',
                backgroundColor: 'grey-light'
              },
              primaryText: 'Icon'
            }
          }]
        }
      });
      this.listDemo.show(listDemo);

      // Card & List
      var spinnerDemo = new Wood.Card({
        primaryText: 'Spinner',
        headerOptions: {
          icon: 'spinner',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: Wood.Spinner
      });
      this.spinnerDemo.show(spinnerDemo);
    },
    templateHelpers: function () {}
  });
})(window.Wood);
