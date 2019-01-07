var Templater = function(list) {
  var itemSource,
    templater = this;

  var init = function() {
    itemSource = templater.getItemSource(list.item);
    if (itemSource) {
      itemSource = templater.clearSourceItem(itemSource, list.valueNames);
    }
  };

  this.clearSourceItem = function(el, valueNames) {
    for(var i = 0, il = valueNames.length; i < il; i++) {
      var elm;
      if (valueNames[i].data) {
        for (var j = 0, jl = valueNames[i].data.length; j < jl; j++) {
          el.setAttribute('data-'+valueNames[i].data[j], '');
        }
      } else if (valueNames[i].attr && valueNames[i].name) {
        elm = list.utils.getByClass(el, valueNames[i].name, true);
        if (elm) {
          elm.setAttribute(valueNames[i].attr, "");
        }
      } else {
        elm = list.utils.getByClass(el, valueNames[i], true);
        if (elm) {
          elm.innerHTML = "";
        }
      }
      elm = undefined;
    }
    return el;
  };

  this.getItemSource = function(item) {
    if (item === undefined) {
      var nodes = list.list.childNodes,
        items = [];

      for (var i = 0, il = nodes.length; i < il; i++) {
        // Only textnodes have a data attribute
        if (nodes[i].data === undefined) {
          return nodes[i].cloneNode(true);
        }
      }
    } else if (/<tr[\s>]/g.exec(item)) {
      var tbody = document.createElement('tbody');
      tbody.innerHTML = item;
      return tbody.firstChild;
    } else if (item.indexOf("<") !== -1) {
      var div = document.createElement('div');
      div.innerHTML = item;
      return div.firstChild;
    } else {
      var source = document.getElementById(list.item);
      if (source) {
        return source;
      }
    }
    return undefined;
  };

  this.get = function(item, valueNames) {
    templater.create(item);
    var values = {};
    for(var i = 0, il = valueNames.length; i < il; i++) {
      var elm;
      if (valueNames[i].data) {
        for (var j = 0, jl = valueNames[i].data.length; j < jl; j++) {
          values[valueNames[i].data[j]] = list.utils.getAttribute(item.elm, 'data-'+valueNames[i].data[j]);
        }
      } else if (valueNames[i].attr && valueNames[i].name) {
        elm = list.utils.getByClass(item.elm, valueNames[i].name, true);
        values[valueNames[i].name] = elm ? list.utils.getAttribute(elm, valueNames[i].attr) : "";
      } else if (valueNames[i].children && valueNames[i].name) {

        /********************************************************
         * UPDATE added here to getting of item children values.
         */
        // If the valueName has children specified.
        // Then we expect an array of data.
        values[valueNames[i].name] = [];
        // Find the container of the children.
        elm = list.utils.getByClass(item.elm, valueNames[i].name, true);
        if (elm) {
          // If the container exists then we create the child element and get its <tag> name.
          // NOTE this means that a HTML representation of the child needs to be supplied
          // on valueNames[i].children.item. This decision is for brevity. Maybe if it
          // becomes necessary we can look for a child template by ID or find the
          // first child but for now we won't.
          var div = document.createElement('div');
          div.innerHTML = valueNames[i].children.item;
          var childItemTagName = div.firstChild.tagName;
          // Loop through all the elements childNodes and for any elements matching
          // the tag name we get the values from them.
          var nodes = elm.childNodes;
          for (var k = 0, kl = nodes.length; k < kl; k++) {
            var childValues = null;
            // Only textnodes have a data attribute.
            // If the childItemTagName matches the childNode.tag name then
            // we know it is an element of interest and therefore will
            // extract the childValues from it.
            if (nodes[k].data === undefined && nodes[k].tagName === childItemTagName) {
              childValues = {};
              for (var s = 0, sl = valueNames[i].children.valueNames.length; s < sl; s++) {
                var valueName = valueNames[i].children.valueNames;
                var childElm;
                if (valueName.data) {
                  for (var p = 0, pl = valueName.data.length; p < pl; p++) {
                    childValues[valueName.data[p]] = list.utils.getAttribute(nodes[k], 'data-'+valueName.data[p]);
                  }
                } else if (valueName.attr && valueName.name) {
                  childElm = list.utils.getByClass(nodes[k], valueName.name, true);
                  childValues[valueName.name] = childElm ? list.utils.getAttribute(childElm, valueName.attr) : "";
                } else {
                  childElm = list.utils.getByClass(nodes[k], valueName, true);
                  childValues[valueName] = childElm ? childElm.innerHTML : "";
                }
                childElm = undefined;
              }
            }
            if(childValues) {
              values[valueNames[i].name].push(childValues);
            }
          }
        }
        /********************************************************
         * END UPDATE
         */

      } else {
        elm = list.utils.getByClass(item.elm, valueNames[i], true);
        values[valueNames[i]] = elm ? elm.innerHTML : "";
      }
      elm = undefined;
    }
    return values;
  };

  this.set = function(item, values) {
    var getValueName = function(name, valueNames) {
      for (var i = 0, il = valueNames.length; i < il; i++) {
        if (valueNames[i].data) {
          var data = valueNames[i].data;
          for (var j = 0, jl = data.length; j < jl; j++) {
            if (data[j] === name) {
              return { data: name };
            }
          }
        } else if (valueNames[i].attr && valueNames[i].name && valueNames[i].name == name) {
          return valueNames[i];
        } else if (valueNames[i].children && valueNames[i].name && valueNames[i].name == name) {
            return valueNames[i];
        } else if (valueNames[i] === name) {
          return name;
        }
      }
    };
    var setValue = function(name, value) {
      var elm;
      var valueName = getValueName(name, list.valueNames);
      if (!valueName)
        return;
      if (valueName.data) {
        item.elm.setAttribute('data-'+valueName.data, value);
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(item.elm, valueName.name, true);
        if (elm) {
          elm.setAttribute(valueName.attr, value);
        }
      } else if (valueName.children && valueName.name) {

        /********************************************************
         * UPDATE added here to allow rendering of item children
         */
        elm = list.utils.getByClass(item.elm, valueName.name, true);
        if (elm) {
          var div = document.createElement('div');
          div.innerHTML = valueName.children.item;
          var childItem = div.firstChild;
          var childItemTagName = childItem.tagName;
          var elmChildNodes = elm.getElementsByTagName(childItemTagName);
          for (var i = 0, il = value.length; i < il; i++) {
            var childNodeAlreadyExists = false;
            var childNode;
            if (elmChildNodes.item(i) !== null) {
              childNodeAlreadyExists = true;
              childNode = elmChildNodes.item(i);
            } else {
              childNode = childItem.cloneNode(true);
            }
            for(var v in value[i]) {
              if (value[i].hasOwnProperty(v)) {
                var childNodeElm;
                var childValueName = getValueName(v, valueName.children.valueNames);
                if (!childValueName)
                    return;
                if (childValueName.data) {
                    childNode.setAttribute('data-'+childValueName.data, value[i][v]);
                } else if (childValueName.attr && childValueName.name) {
                    childNodeElm = list.utils.getByClass(childNode, childValueName.name, true);
                    if (childNodeElm) {
                        childNodeElm.setAttribute(childValueName.attr, value[i][v]);
                    }
                } else {
                    childNodeElm = list.utils.getByClass(childNode, childValueName, true);
                    if (childNodeElm) {
                        childNodeElm.innerHTML = value[i][v];
                    }
                }
                childNodeElm = undefined;
              }
            }
            if (!childNodeAlreadyExists) {
              elm.appendChild(childNode);
            }
            childNode = undefined;
          }
        }
        /********************************************************
         * END UPDATE
         */

      } else {
        elm = list.utils.getByClass(item.elm, valueName, true);
        if (elm) {
          elm.innerHTML = value;
        }
      }
      elm = undefined;
    };
    if (!templater.create(item)) {
      for(var v in values) {
        if (values.hasOwnProperty(v)) {
          setValue(v, values[v]);
        }
      }
    }
  };

  this.create = function(item) {
    if (item.elm !== undefined) {
      return false;
    }
    if (itemSource === undefined) {
      throw new Error("The list needs to have at least one item on init otherwise you'll have to add a template.");
    }
    /* If item source does not exists, use the first item in list as
    source for new items */
    var newItem = itemSource.cloneNode(true);
    newItem.removeAttribute('id');
    item.elm = newItem;
    templater.set(item, item.values());
    return true;
  };
  this.remove = function(item) {
    if (item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.show = function(item) {
    templater.create(item);
    list.list.appendChild(item.elm);
  };
  this.hide = function(item) {
    if (item.elm !== undefined && item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.clear = function() {
    /* .innerHTML = ''; fucks up IE */
    if (list.list.hasChildNodes()) {
      while (list.list.childNodes.length >= 1)
      {
        list.list.removeChild(list.list.firstChild);
      }
    }
  };

  init();
};

module.exports = function(list) {
  return new Templater(list);
};
