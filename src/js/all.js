window.Wood = {};

// include base common widgets
require('./avatar');
require('./button');
require('./card');
require('./dialog');
require('./dropdown');
require('./form');
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
import {Assistant, Divider, List, Subheader} from './list.js'
import {Header} from './text.js'

Wood.Assistant = Assistant;
Wood.Divider = Divider;
Wood.List = List;
Wood.Subheader = Subheader;
Wood.Header = Header;

export default Wood
