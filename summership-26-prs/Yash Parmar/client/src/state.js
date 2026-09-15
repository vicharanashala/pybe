var State = (function () {
  var _tenants = ['Aarav', 'Fatima', 'Rohan'];
  var _listeners = [];
  function _notify(op, data) { _listeners.forEach(function (fn) { fn(op, data); }); }
  return {
    get tenants() { return _tenants.slice(); },
    subscribe: function (fn) { _listeners.push(fn); },
    setCase: function (n) {
      if (n === 1) { _tenants = ['Aarav', 'Fatima', 'Rohan']; }
      if (n === 2) { _tenants = ['Aarav', 'Fatima', 'Rohan', 'Priya']; }
      if (n === 3) { _tenants = ['Aarav', 'Fatima', 'Rohan', 'Priya']; }
      if (n === 4) { _tenants = ['Aarav', 'Fatima', 'VIP', 'Rohan', 'Priya']; }
      if (n === 5) { _tenants = ['Aarav', 'Fatima', 'VIP', 'Rohan', 'Priya']; }
      if (n === 6) { _tenants = ['Aarav', 'Fatima', 'Priya', 'Rohan', 'VIP']; }
      if (n === 7) { _tenants = ['Aarav', 'Fatima', 'Priya', 'Rohan', 'VIP']; }
      if (n === 8) { _tenants = ['Aarav', 'Fatima', 'Priya', 'Rohan', 'VIP']; }
    },
    addTenant: function (name) {
      if (_tenants.indexOf(name) !== -1) return false;
      _tenants.push(name);
      _notify('add', { name: name });
      return true;
    },
    insertTenant: function (index, name) {
      if (_tenants.indexOf(name) !== -1) return false;
      _tenants.splice(index, 0, name);
      _notify('insert', { index: index, name: name });
      return true;
    },
    removeTenant: function (name) {
      var idx = _tenants.indexOf(name);
      if (idx === -1) return false;
      _tenants.splice(idx, 1);
      _notify('remove', { name: name });
      return true;
    },
    popTenant: function () {
      if (_tenants.length === 0) return null;
      var popped = _tenants.pop();
      _notify('pop', { name: popped });
      return popped;
    },
    sortTenants: function () {
      _tenants.sort();
      _notify('sort');
    },
    countTenants: function () {
      return _tenants.length;
    }
  };
})();
