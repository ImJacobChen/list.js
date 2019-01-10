const $ = require('jquery'),
    List = require('../src/index');

describe('Create with nested children valueNames', function() {

    describe('With HTML items containing nested children values', function() {
        var listEl = $('<div id="list">\
          <ul class="list">\
            <li class="top-level-list-item">\
                <span class="name top-level-list-item-property">Jonny</span>\
                <ul class="friends top-level-list-item-property">\
                    <li class="nested-child-list-item">\
                        <span class="name">Fred</span>\
                    </li>\
                    <li class="nested-child-list-item">\
                        <span class="name">John</span>\
                    </li>\
                </ul>\
            </li>\
          </ul>\
        </div>');

        $(document.body).append(listEl);

        var list = new List('list', {
            valueNames: [
                'name',
                {
                    name: 'friends',
                    children: {
                        valueNames: ['name'],
                        item: '<li class="nested-child-list-item"><span class="name"></span></li>'
                    }
                }
            ]
        });

        it('should contain one item and two nested children', function() {
            expect(list.items.length).toEqual(1);
            expect(listEl.find('.top-level-list-item').length).toEqual(1);
            expect(list.items[0].values().name).toEqual("Jonny");

            expect(listEl.find('.nested-child-list-item').length).toEqual(2);
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Fred");
            expect(list.items[0].values().friends[1].name).toEqual("John");
        });

        it('should contain two items each with two nested children', function() {
            list.add({
                name: 'Jonas' ,
                friends: [
                    { name: 'Jack' },
                    { name: 'Joe' }
                ]
            });
            expect(list.items.length).toEqual(2);
            expect(listEl.find('.top-level-list-item').length).toEqual(2);
            expect(listEl.find('.nested-child-list-item').length).toEqual(4);

            // <ul class="list"> <li></li>(0) </ul>
            let firstListItemEl = $(listEl.find('.top-level-list-item')[0]);
            expect($(firstListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonny");
            expect(list.items[0].values().name).toEqual("Jonny");

            let firstListItemsNestedChildItems = firstListItemEl.find('.nested-child-list-item');
            expect($(firstListItemsNestedChildItems[0]).find('span').text()).toEqual('Fred');
            expect($(firstListItemsNestedChildItems[1]).find('span').text()).toEqual('John');
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Fred");
            expect(list.items[0].values().friends[1].name).toEqual("John");

            // <ul class="list"> <li></li>(1) </ul>
            let secondListItemEl = $(listEl.find('.top-level-list-item')[1]);
            expect($(secondListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonas");
            expect(list.items[1].values().name).toEqual("Jonas");

            let secondListItemsNestedChildItems = secondListItemEl.find('.nested-child-list-item');
            expect($(secondListItemsNestedChildItems[0]).find('span').text()).toEqual('Jack');
            expect($(secondListItemsNestedChildItems[1]).find('span').text()).toEqual('Joe');
            expect(list.items[1].values().friends.length).toEqual(2);
            expect(list.items[1].values().friends[0].name).toEqual("Jack");
            expect(list.items[1].values().friends[1].name).toEqual("Joe");
        });

        listEl.remove();
    });

    describe('Without items and with string template', function() {
        var listEl = $('<div id="list">\
            <ul class="list"></ul>\
        </div>');

        $(document.body).append(listEl);

        var list = new List('list', {
            valueNames: [
                'name',
                {
                    name: 'friends',
                    children: {
                        valueNames: ['name'],
                        item: '<li class="nested-child-list-item"><span class="name nested-child-list-item-property"></span></li>'
                    }
                }
            ],
            item: '<li class="top-level-list-item"><span class="name top-level-list-item-property"></span><ul class="friends top-level-list-item-property"></ul></li>'
        }, [
            {
                name: 'Jonny',
                friends: [
                    { name: 'Berg' },
                    { name: 'Lisa' },
                ]
            }
        ]);

        it('should contain one item with two nested children', function() {
            expect(list.items.length).toEqual(1);
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(listEl.find('.top-level-list-item').length).toEqual(1);
            expect(listEl.find('.nested-child-list-item').length).toEqual(2);

            // <ul class="list"> <li></li>(0) </ul>
            let firstListItemEl = $(listEl.find('.top-level-list-item')[0]);
            expect($(firstListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonny");
            expect(list.items[0].values().name).toEqual("Jonny");

            let firstListItemsNestedChildItems = firstListItemEl.find('.nested-child-list-item');
            expect($(firstListItemsNestedChildItems[0]).find('span').text()).toEqual('Berg');
            expect($(firstListItemsNestedChildItems[1]).find('span').text()).toEqual('Lisa');
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Berg");
            expect(list.items[0].values().friends[1].name).toEqual("Lisa");
        });

        it('should contain two items both with two nested children', function() {
            list.add({
                name: 'Jonas' ,
                friends: [
                    { name: 'Jack' },
                    { name: 'Joe' }
                ]
            });

            expect(list.items.length).toEqual(2);
            expect(listEl.find('.top-level-list-item').length).toEqual(2);
            expect(listEl.find('.nested-child-list-item').length).toEqual(4);

            // <ul class="list"> <li></li>(0) </ul>
            let firstListItemEl = $(listEl.find('.top-level-list-item')[0]);
            expect($(firstListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonny");
            expect(list.items[0].values().name).toEqual("Jonny");

            let firstListItemsNestedChildItems = firstListItemEl.find('.nested-child-list-item');
            expect($(firstListItemsNestedChildItems[0]).find('span').text()).toEqual('Berg');
            expect($(firstListItemsNestedChildItems[1]).find('span').text()).toEqual('Lisa');
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Berg");
            expect(list.items[0].values().friends[1].name).toEqual("Lisa");

            // <ul class="list"> <li></li>(1) </ul>
            let secondListItemEl = $(listEl.find('.top-level-list-item')[1]);
            expect($(secondListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonas");
            expect(list.items[1].values().name).toEqual("Jonas");

            let secondListItemsNestedChildItems = secondListItemEl.find('.nested-child-list-item');
            expect($(secondListItemsNestedChildItems[0]).find('span').text()).toEqual('Jack');
            expect($(secondListItemsNestedChildItems[1]).find('span').text()).toEqual('Joe');
            expect(list.items[1].values().friends.length).toEqual(2);
            expect(list.items[1].values().friends[0].name).toEqual("Jack");
            expect(list.items[1].values().friends[1].name).toEqual("Joe");
        });

        listEl.remove();
    });

    describe('without items and or template', function() {

        it('should not throw error on init', function() {
            var listEl = $('<div id="list">\
                <ul class="list"></ul>\
            </div>');

            $(document.body).append(listEl);

            var list = new List('list', {
                valueNames: [
                    'name',
                    {
                        name: 'friends',
                        children: {
                            valueNames: ['name'],
                            item: '<li class="nested-child-list-item"><span class="name"></span></li>'
                        }
                    }
                ]
            });

            listEl.remove();
        });

        it('should throw error when created items', function() {
            var listEl = $('<div id="list">\
                <ul class="list"></ul>\
            </div>');

            $(document.body).append(listEl);

            var list = new List('list', {
                valueNames: [
                    'name',
                    {
                        name: 'friends',
                        children: {
                            valueNames: ['name'],
                            item: '<li class="nested-child-list-item"><span class="name"></span></li>'
                        }
                    }
                ]
            });

            expect(function() {
                list.add({
                    name: 'Jonas' ,
                    friends: [
                        { name: 'Jack' },
                        { name: 'Joe' }
                    ]
                });
            }).toThrow();

            listEl.remove();
        });
    });

    describe('Without items and with HTML template', function() {
        var listEl = $('<div id="list">\
            <ul class="list"></ul>\
        </div>');

        var templateEl = $('<li id="template-item" class="top-level-list-item"><span class="name top-level-list-item-property"></span><ul class="friends top-level-list-item-property"></ul></li>');

        $(document.body).append(listEl);
        $(document.body).append(templateEl);

        var list = new List('list', {
            valueNames: [
                'name',
                {
                    name: 'friends',
                    children: {
                        valueNames: ['name'],
                        item: '<li class="nested-child-list-item"><span class="name nested-child-list-item-property"></span></li>'
                    }
                }
            ],
            item: 'template-item'
        }, [
            {
                name: 'Jonny',
                friends: [
                    { name: 'Berg' },
                    { name: 'Lisa' },
                ]
            }
        ]);

        it('should contain one item with two nested children items', function() {
            expect(list.items.length).toEqual(1);
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(listEl.find('.top-level-list-item').length).toEqual(1);
            expect(listEl.find('.nested-child-list-item').length).toEqual(2);

            // <ul class="list"> <li></li>(0) </ul>
            let firstListItemEl = $(listEl.find('.top-level-list-item')[0]);
            expect($(firstListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonny");
            expect(list.items[0].values().name).toEqual("Jonny");

            let firstListItemsNestedChildItems = firstListItemEl.find('.nested-child-list-item');
            expect($(firstListItemsNestedChildItems[0]).find('span').text()).toEqual('Berg');
            expect($(firstListItemsNestedChildItems[1]).find('span').text()).toEqual('Lisa');
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Berg");
            expect(list.items[0].values().friends[1].name).toEqual("Lisa");
        });

        it('should contain two items both with two nested children items', function() {
            list.add({
                name: 'Jonas' ,
                friends: [
                    { name: 'Jack' },
                    { name: 'Joe' }
                ]
            });

            expect(list.items.length).toEqual(2);
            expect(listEl.find('.top-level-list-item').length).toEqual(2);
            expect(listEl.find('.nested-child-list-item').length).toEqual(4);

            // <ul class="list"> <li></li>(0) </ul>
            let firstListItemEl = $(listEl.find('.top-level-list-item')[0]);
            expect($(firstListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonny");
            expect(list.items[0].values().name).toEqual("Jonny");

            let firstListItemsNestedChildItems = firstListItemEl.find('.nested-child-list-item');
            expect($(firstListItemsNestedChildItems[0]).find('span').text()).toEqual('Berg');
            expect($(firstListItemsNestedChildItems[1]).find('span').text()).toEqual('Lisa');
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Berg");
            expect(list.items[0].values().friends[1].name).toEqual("Lisa");

            // <ul class="list"> <li></li>(1) </ul>
            let secondListItemEl = $(listEl.find('.top-level-list-item')[1]);
            expect($(secondListItemEl.find('.top-level-list-item-property')[0]).text()).toEqual("Jonas");
            expect(list.items[1].values().name).toEqual("Jonas");

            let secondListItemsNestedChildItems = secondListItemEl.find('.nested-child-list-item');
            expect($(secondListItemsNestedChildItems[0]).find('span').text()).toEqual('Jack');
            expect($(secondListItemsNestedChildItems[1]).find('span').text()).toEqual('Joe');
            expect(list.items[1].values().friends.length).toEqual(2);
            expect(list.items[1].values().friends[0].name).toEqual("Jack");
            expect(list.items[1].values().friends[1].name).toEqual("Joe");
        });

        listEl.remove();
        templateEl.remove();
    });

    // TODO update this list to include nested children.
    // describe('Asyn index with existing list', function() {
    //     var listEl = $('<div id="list">\
    //   <ul class="list">\
    //     <li><span class="name">Jonny</span></li><li><span class="name">Sven</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //     <li><span class="name">Anna</span></li><li><span class="name">Lisa</span></li>\
    //     <li><span class="name">Egon</span></li><li><span class="name">Frida</span></li>\
    //     <li><span class="name">Maj-britt</span></li><li><span class="name">Fredrik</span></li>\
    //     <li><span class="name">Torbjorn</span></li><li><span class="name">Lolzor</span></li>\
    //     <li><span class="name">Sandra</span></li><li><span class="name">Gottfrid</span></li>\
    //     <li><span class="name">Tobias</span></li><li><span class="name">Martina</span></li>\
    //     <li><span class="name">Johannes</span></li><li><span class="name">Ted</span></li>\
    //     <li><span class="name">Malin</span></li><li><span class="name">Filippa</span></li>\
    //     <li><span class="name">Imma</span></li><li><span class="name">Hasse</span></li>\
    //     <li><span class="name">Robert</span></li><li><span class="name">Mona</span></li>\
    //   </ul>\
    // </div>');
    //
    //     it('should contain one hundred and sixty two items', function(done) {
    //         $(document.body).append(listEl);
    //         var list = new List('list', {
    //             valueNames: ['name'],
    //             indexAsync: true,
    //             parseComplete: function(list) {
    //                 expect(listEl.find('li').length).toEqual(162);
    //                 listEl.remove();
    //                 done();
    //             }
    //         });
    //     });
    // });

});
