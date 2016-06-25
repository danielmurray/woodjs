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
      '<div id="card-list-container" style="width:300px;"></div>' +
      '<div id="list-container" style="width:300px;"></div>' +
      '<div id="dropdown-tree-container"></div>' +
      '<div id="dropdown-arbor-container"></div>' +
      ''),
    regions: {
      iconContainer: '#icon',
      iconButtonContainer: '#icon-button',
      iconTooltipContainer: '#icon-tooltip',
      iconMaterialContainer: '#icon-material',
      flatButtonContainer: '#flat-button',
      raisedButtonContainer: '#raised-button',
      cardFormContainer: '#card-form-container',
      cardListContainer: '#card-list-container',
      listContainer: '#list-container',
      dropdownTreeContainer: '#dropdown-tree-container',
      dropdownArborContainer: '#dropdown-arbor-container'
    },
    events: {},
    initialize: function (options) {

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

      // Buttons
      var flatButton = new Wood.FlatButton();
      this.flatButtonContainer.show(flatButton);
      var raisedButton = new Wood.RaisedButton();
      this.raisedButtonContainer.show(raisedButton);

      // Card & Form
      // var card = new Wood.Card({
      //   primaryText: 'Sign In',
      //   headerOptions: {
      //     icon: 'sign-in',
      //     shape: 'circle',
      //     backgroundColor: 'white'
      //   },
      //   contentView: Wood.Assistant,
      //   contentOptions: {
      //     inputs: [{
      //       id: 'username',
      //       floatingLabelText: 'Username',
      //       hintText: 'Are you the Keymaster?',
      //       defaultValue: 'username',
      //       required: true,
      //       disabled: true
      //     }, {
      //       id: 'password',
      //       floatingLabelText: 'Password',
      //       hintText: 'I am the Gatekeeper.',
      //       defaultValue: 'password',
      //       type: 'password',
      //       required: true
      //     }],
      //     submitButton: {
      //       label: 'Sign In'
      //     }
      //   }
      // });
      // this.cardFormContainer.show(card);

      // Wood.FormDialog.show({
      //   title: 'Specify a Date',
      //   onSubmit: function (data) {
      //     console.log(data);
      //   },
      //   formOptions: {
      //     inputs: [{
      //       id: 'startdate',
      //       view: Wood.Input,
      //       options: {
      //         floatingLabelText: '',
      //         type: 'datetime-local',
      //         isRequired: true
      //       }
      //     }, {
      //       id: 'enddate',
      //       view: Wood.Input,
      //       options: {
      //         floatingLabelText: '',
      //         type: 'datetime-local',
      //         isRequired: true
      //       }
      //     }],
      //     submitButton: {
      //       label: 'Submit'
      //     }
      //   }
      // });

      // Card & List
      var cardList = new Wood.Card({
        primaryText: 'To Do',
        headerOptions: {
          icon: 'lightbulb-o',
          shape: 'circle',
          backgroundColor: 'white'
        },
        contentView: Wood.Assistant,
        contentOptions: {
          items: [{
            itemView: Wood.Subheader,
            itemOptions: {
              text: 'Ingredients'
            }
          }, {
            itemView: Wood.InputDropdown,
            itemOptions: {
              // defaultValue: 'smart_and_final',
              floatingLabelText: 'Store',
              hintText: 'Where are we going?',
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
              defaultValue: 'danmurray',
              floatingLabelText: 'Username',
              hintText: 'Who are you?'
            }
          }, {
            itemOptions: {
              rightIcon: true,
              rightIconView: Wood.Checkbox,
              rightIconOptions: {
                checked: false,
                disabled: true,
                tooltip: 'hello world'
              },
              primaryText: 'Eggs',
              secondaryText: 'Caged free for me'
            }
          }, {
            itemOptions: {
              rightIcon: true,
              rightIconView: Wood.Checkbox,
              rightIconOptions: {
                checked: true,
                disabled: false
              },
              primaryText: 'Milk',
              secondaryText: 'Lowfat or skim'
            }
          }, {
            itemOptions: {
              rightIcon: true,
              rightIconView: Wood.Checkbox,
              rightIconOptions: {
                checked: false,
                disabled: true
              },
              primaryText: 'Butter',
              secondaryText: 'I can\'t beleive it\'s butter'
            }
          }, {
            itemOptions: {
              rightIcon: true,
              rightIconView: Wood.Checkbox,
              rightIconOptions: {
                checked: false,
                disabled: true,
                tooltip: 'hello world'
              },
              primaryText: 'Bread',
              secondaryText: 'Wheat not white'
            }
          }]
        }
      });
      this.cardListContainer.show(cardList);

      // List
      // var list = new Wood.Assistant({
      //   items: [{
      //     itemView: Wood.Subheader,
      //     itemOptions: {
      //       text: 'Ingredients'
      //     }
      //   }, {
      //     itemView: Wood.InputDropdown,
      //     itemOptions: {
      //       // defaultValue: 'smart_and_final',
      //       floatingLabelText: 'Store',
      //       hintText: 'Where are we going?',
      //       options: [
      //         {
      //           value: 'safeway',
      //           label: 'Safeway'
      //         }, {
      //           value: 'whole_foods',
      //           label: 'Whole Foods'
      //         }, {
      //           value: 'fresh_and_easy',
      //           label: 'Fresh & Easy'
      //         }, {
      //           value: 'stop_n_save',
      //           label: 'Stop N Save'
      //         }, {
      //           value: 'smart_and_final',
      //           label: 'Smart & Final'
      //         }, {
      //           value: 'grocery_outlet',
      //           label: 'Grocery Outlet'
      //         }
      //       ]
      //     }
      //   }, {
      //     itemView: Wood.Input,
      //     itemOptions: {
      //       defaultValue: 'danmurray',
      //       floatingLabelText: 'Username',
      //       hintText: 'Who are you?'
      //     }
      //   }, {
      //     itemOptions: {
      //       rightIcon: true,
      //       rightIconView: Wood.Checkbox,
      //       rightIconOptions: {
      //         checked: false,
      //         disabled: true,
      //         tooltip: 'hello world'
      //       },
      //       primaryText: 'Eggs',
      //       secondaryText: 'Caged free for me'
      //     }
      //   }, {
      //     itemOptions: {
      //       rightIcon: true,
      //       rightIconView: Wood.Checkbox,
      //       rightIconOptions: {
      //         checked: true,
      //         disabled: false
      //       },
      //       primaryText: 'Milk',
      //       secondaryText: 'Lowfat or skim'
      //     }
      //   }, {
      //     itemOptions: {
      //       rightIcon: true,
      //       rightIconView: Wood.Checkbox,
      //       rightIconOptions: {
      //         checked: false,
      //         disabled: true
      //       },
      //       primaryText: 'Butter',
      //       secondaryText: 'I can\'t beleive it\'s butter'
      //     }
      //   }, {
      //     itemOptions: {
      //       rightIcon: true,
      //       rightIconView: Wood.Checkbox,
      //       rightIconOptions: {
      //         checked: false,
      //         disabled: true,
      //         tooltip: 'hello world'
      //       },
      //       primaryText: 'Bread',
      //       secondaryText: 'Wheat not white'
      //     }
      //   }]
      // });
      // this.listContainer.show(list);

      // Dropdown & Tree
      // var dropdown = new Wood.Dropdown({
      //   buttonOptions: {
      //     icon: 'skyatlas',
      //     label: 'Skywalkers',
      //     color: 'black',
      //     backgroundColor: 'white'
      //   },
      //   contentView: Wood.List,
      //   contentOptions: {
      //     items: [{
      //       itemView: Wood.Tree,
      //       itemOptions: {
      //         itemOptions: {
      //           leftIcon: true,
      //           leftIconOptions: {
      //             icon: 'empire'
      //           },
      //           primaryText: 'Anakin Skywalker',
      //           secondaryText: 'Darth Vader',
      //           rightIcon: true,
      //           rightIconView: Wood.Checkbox
      //         },
      //         children: [{
      //           itemOptions: {
      //             leftIcon: true,
      //             leftIconOptions: {
      //               icon: 'rebel'
      //             },
      //             primaryText: 'Leia Organa Solo',
      //             secondaryText: 'Princess Leia',
      //             rightIcon: true,
      //             rightIconView: Wood.Checkbox
      //           },
      //           children: [{
      //             itemOptions: {
      //               leftIcon: true,
      //               leftIconOptions: {
      //                 icon: 'rebel'
      //               },
      //               primaryText: 'Jaina Solo',
      //               secondaryText: 'Definitely Kylo Ren',
      //               rightIcon: true,
      //               rightIconView: Wood.Checkbox
      //             },
      //             children: []
      //           }, {
      //             itemOptions: {
      //               leftIcon: true,
      //               leftIconOptions: {
      //                 icon: 'empire'
      //               },
      //               primaryText: 'Jacen Solo',
      //               secondaryText: 'Darth Caedus',
      //               rightIcon: true,
      //               rightIconView: Wood.Checkbox
      //             },
      //             children: []
      //           }, {
      //             itemOptions: {
      //               leftIcon: true,
      //               leftIconOptions: {
      //                 icon: 'rebel'
      //               },
      //               primaryText: 'Anakin Solo',
      //               secondaryText: 'Lil\' Ani',
      //               rightIcon: true,
      //               rightIconView: Wood.Checkbox
      //             },
      //             children: []
      //           }]
      //         }, {
      //           itemOptions: {
      //             leftIcon: true,
      //             leftIconOptions: {
      //               icon: 'rebel'
      //             },
      //             primaryText: 'Luke Skywalker',
      //             secondaryText: 'A New Hope',
      //             rightIcon: true,
      //             rightIconView: Wood.Checkbox
      //           },
      //           children: []
      //         }]
      //       }
      //     }, {
      //       itemView: Wood.Item,
      //       itemOptions: {
      //         leftIcon: true,
      //         leftIconOptions: {
      //           icon: 'code-fork'
      //         },
      //         primaryText: 'Fork Session',
      //         color: 'black'
      //       }
      //     }]
      //   }
      // });
      // this.dropdownTreeContainer.show(dropdown)
      //
      // var dropdown = new Wood.Dropdown({
      //   buttonOptions: {
      //     icon: 'code-fork',
      //     label: 'Fork Session',
      //     color: 'black',
      //     backgroundColor: 'white'
      //   },
      //   contentView: Wood.List,
      //   contentOptions: {
      //     items: [{
      //       itemView: Wood.Arbor,
      //       itemOptions: {
      //         root: 17,
      //         collection: new Backbone.Collection([{
      //           'description': 'Grandpa',
      //           'id': 17,
      //           'parent': null
      //         }, {
      //           'description': 'Father',
      //           'id': 71919,
      //           'parent': 17
      //         }, {
      //           'description': 'Grandson',
      //           'id': 71921,
      //           'parent': 71919
      //         }, {
      //           'description': 'Granddaughter',
      //           'id': 71922,
      //           'parent': 71919
      //         }, {
      //           'description': 'Cousin',
      //           'id': 71923,
      //           'parent': 71920
      //         }, {
      //           'description': 'Uncle',
      //           'id': 71920,
      //           'parent': 17
      //         }])
      //       }
      //     }, {
      //       itemView: Wood.Item,
      //       itemOptions: {
      //         leftIcon: true,
      //         leftIconOptions: {
      //           icon: 'code-fork'
      //         },
      //         primaryText: 'Fork Session',
      //         color: 'black'
      //       }
      //     }]
      //   }
      // });
      // this.dropdownArborContainer.show(dropdown);
    },
    templateHelpers: function () {}
  });
})(window.Wood);
