module.exports = function(app, fs, url, isAuthenticated, passport) {
  var router_dashboard = require('./dashboard.js');

  app.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('dashboard.html');
  });
  app.get('/api/dashboard', isAuthenticated, function(req, res) {
    req.accepts('application/json');
    var type = req.query.id;
    var select = req.query.select;
    let data;
    if (type == "refresh") {
      data = router_dashboard.consolelog_serverdata();
      res.send(data);
    } else if (type == "wlan0stopstart") {
      if (select == 0) { //stop 시키는 부분
        data = router_dashboard.wlan0_stop();
        res.send(data);
      } else if (select == 1) { //start 시키는 부분
        data = router_dashboard.wlan0_start();
        res.send(data);
      } else {
        data = router_dashboard.start_stopbutton();
        res.send(data);
      }
    }
  });

  app.get('/i18n_load', isAuthenticated, function(req, res) {
    let data = router_dashboard.i18n_load();
    res.send(data);
  });

  app.get('/i18n_save', isAuthenticated, function(req, res) {
    let data = router_dashboard.i18n_save(req.query.lang);
    res.send(data);
  });
};
