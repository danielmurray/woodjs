window.Wood = {};

// include base common widgets
require('./avatar');
require('./button');
require('./card');
require('./dialog');
require('./dropdown');
require('./icon');
require('./input');
require('./item');
require('./spinner');
require('./ripple');
require('./table');
require('./tooltip');
require('./toolbar');
require('./tree');

// ES2015 Components
import {InputList, Form} from './form.js';
import {Input} from './input.js';
import {Assistant, Divider, List, Subheader} from './list.js';
import {Header} from './text.js';

Wood.Assistant = Assistant;
Wood.Divider = Divider;
Wood.Form = Form;
Wood.Input = Input;
Wood.InputList = InputList;
Wood.List = List;
Wood.Subheader = Subheader;
Wood.Header = Header;

export default Wood;
