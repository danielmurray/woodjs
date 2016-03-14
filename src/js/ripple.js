Wood.Ripple = Marionette.ItemView.extend({
  attributes: {
    class: 'wood ripple-wrapper',
  },
  template: _.template(
  ''),
  events: {
  },
  initialize: function(){
    this.ripples = [];
  },
  pythagoras: function(a, b){
    return Math.pow(Math.pow(a,2)+Math.pow(b,2),0.5);
  },
  ripple: function(){
    var self = this;
    setTimeout(function(){
      self.propagate();
      self.fade();
    }, 0);
  },
  propagate: function(x, y){
    var self = this;
    var $ripple = $(document.createElement('div'));
    $ripple.addClass('ripple propagating circle');
    var h = this.$el.height();
    var w = this.$el.width();
    if( x == undefined ){
      x = w/2;
      y = h/2;
    }
    var r = this.pythagoras(Math.max(x,w-x), Math.max(y,h-y));
    $ripple.css({
      'top': y - r,
      'left': x - r,
      'height': 2*r,
      'width': 2*r
    });
    this.$el.append($ripple);
    this.ripples.push($ripple);
  },
  pulse: function(x,y){
    var self = this;
    var $ripple = $(document.createElement('div'));
    $ripple.addClass('ripple pulsing circle');
    var h = this.$el.height();
    var w = this.$el.width();
    if( x == undefined ){
      x = w/2;
      y = h/2;
    }
    var r = this.pythagoras(Math.max(x,w-x), Math.max(y,h-y));
    $ripple.css({
      'top': y - r,
      'left': x - r,
      'height': 2*r,
      'width': 2*r
    });
    this.$el.append($ripple);
    this.ripples.push($ripple);
  },
  fade: function(duration){
    var self = this;
    var ripple = this.ripples.pop();
    this.kill(ripple, duration);
  },
  kill: function(ripple, duration){
    var duration = typeof duration == 'number' ? duration : 500;
    if( ripple ){
      ripple.fadeOut(duration, function(){
        ripple.remove();
      });
    }
  }
});
