const $ = require('jquery'),
    List = require('../src/index');

describe('Parse with nested children', function() {

    describe('Parse class names including nested children', function() {
        var list;
        beforeEach(function() {
            $('body').append($('<div id="parse-list">\
                <div class="list">\
                    <div class="parent-list-item">\
                        <span class="name parent-list-item-property">Jonny</span>\
                        <span class="born parent-list-item-property">1986</span>\
                        <div class="friends parent-list-item-property">\
                            <div class="nested-child-list-item">\
                                <span class="name nested-child-list-item-property">Joe</span>\
                                <span class="born nested-child-list-item-property">1980</span>\
                            </div>\
                            <div class="nested-child-list-item">\
                                <span class="name nested-child-list-item-property">Jive</span>\
                                <span class="born nested-child-list-item-property">1979</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="parent-list-item">\
                        <span class="name parent-list-item-property">Jocke</span>\
                        <span class="born parent-list-item-property">1985</span>\
                        <div class="friends parent-list-item-property">\
                            <div class="nested-child-list-item">\
                                <span class="name nested-child-list-item-property">Clyde</span>\
                                <span class="born nested-child-list-item-property">1960</span>\
                            </div>\
                            <div class="nested-child-list-item">\
                                <span class="name nested-child-list-item-property">Pam</span>\
                                <span class="born nested-child-list-item-property">1975</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>'));

            list = new List('parse-list', {
                valueNames: [
                    'name',
                    'born',
                    {
                        name: 'friends',
                        children: {
                            valueNames: ['name', 'born'],
                            item: '<div class="nested-child-list-item"><span class="name nested-child-list-item-property"></span><span class="born nested-child-list-item-property"></span></div>'
                        }
                    }
                ]
            });
        });

        afterEach(function() {
            $('#parse-list').remove();
        });

        it('should have two items both with two nested items each', function() {
            expect(list.items.length).toEqual(2);

            expect(list.items[0].values().name).toEqual("Jonny");
            expect(list.items[0].values().born).toEqual("1986");
            expect(list.items[0].values().friends[0].name).toEqual("Joe");
            expect(list.items[0].values().friends[0].born).toEqual("1980");
            expect(list.items[0].values().friends[1].name).toEqual("Jive");
            expect(list.items[0].values().friends[1].born).toEqual("1979");

            expect(list.items[1].values().name).toEqual("Jocke");
            expect(list.items[1].values().born).toEqual("1985");
            expect(list.items[1].values().friends[0].name).toEqual("Clyde");
            expect(list.items[1].values().friends[0].born).toEqual("1960");
            expect(list.items[1].values().friends[1].name).toEqual("Pam");
            expect(list.items[1].values().friends[1].born).toEqual("1975");
        });
        it('should add item to parsed list', function() {
            list.add({
                name: "Sven",
                born: 1950,
                friends: [
                    { name: 'Ash', born: 1999 },
                    { name: 'Wick', born: 1972 },
                ]
            });

            expect(list.items.length).toEqual(3);

            expect(list.items[0].values().name).toEqual("Jonny");
            expect(list.items[0].values().born).toEqual("1986");
            expect(list.items[0].values().friends[0].name).toEqual("Joe");
            expect(list.items[0].values().friends[0].born).toEqual("1980");
            expect(list.items[0].values().friends[1].name).toEqual("Jive");
            expect(list.items[0].values().friends[1].born).toEqual("1979");

            expect(list.items[1].values().name).toEqual("Jocke");
            expect(list.items[1].values().born).toEqual("1985");
            expect(list.items[1].values().friends[0].name).toEqual("Clyde");
            expect(list.items[1].values().friends[0].born).toEqual("1960");
            expect(list.items[1].values().friends[1].name).toEqual("Pam");
            expect(list.items[1].values().friends[1].born).toEqual("1975");

            expect(list.items[2].values().name).toEqual("Sven");
            expect(list.items[2].values().born).toEqual(1950);
            expect(list.items[2].values().friends[0].name).toEqual("Ash");
            expect(list.items[2].values().friends[0].born).toEqual(1999);
            expect(list.items[2].values().friends[1].name).toEqual("Wick");
            expect(list.items[2].values().friends[1].born).toEqual(1972);

            var el = $($('#parse-list').find('.list .parent-list-item')[2]);
            expect(el.find('.parent-list-item-property').length).toEqual(3);
            expect(el.find('.parent-list-item-property.name').text()).toEqual('Sven');
            expect(el.find('.parent-list-item-property.born').text()).toEqual('1950');

            var nestedChildEls = el.find('.nested-child-list-item');
            expect(nestedChildEls.length).toEqual(2);

            var nestedChildElOne = $(nestedChildEls[0]);
            expect(nestedChildElOne.find('.nested-child-list-item-property').length).toEqual(2);
            expect(nestedChildElOne.find('.nested-child-list-item-property.name').text()).toEqual('Ash');
            expect(nestedChildElOne.find('.nested-child-list-item-property.born').text()).toEqual('1999');

            var nestedChildElTwo = $(nestedChildEls[1]);
            expect(nestedChildElTwo.find('.nested-child-list-item-property').length).toEqual(2);
            expect(nestedChildElTwo.find('.nested-child-list-item-property.name').text()).toEqual('Wick');
            expect(nestedChildElTwo.find('.nested-child-list-item-property.born').text()).toEqual('1972');
        });
        it('should parsed value always be string while added could be number', function() {
            list.add({
                name: "Sven",
                born: 1950,
                friends: [
                    { name: 'Ash', born: 1999 },
                    { name: 'Wick', born: 1972 },
                ]
            });

            expect(list.items[0].values().born).toEqual("1986");
            expect(list.items[0].values().born).not.toEqual(1986);
            expect(list.items[0].values().friends[0].born).toEqual("1980");
            expect(list.items[0].values().friends[0].born).not.toEqual(1980);
            expect(list.items[0].values().friends[1].born).toEqual("1979");
            expect(list.items[0].values().friends[1].born).not.toEqual(1979);

            expect(list.items[1].values().born).toEqual("1985");
            expect(list.items[1].values().born).not.toEqual(1985);
            expect(list.items[1].values().friends[0].born).toEqual("1960");
            expect(list.items[1].values().friends[0].born).not.toEqual(1960);
            expect(list.items[1].values().friends[1].born).toEqual("1975");
            expect(list.items[1].values().friends[1].born).not.toEqual(1975);

            expect(list.items[2].values().born).toEqual(1950);
            expect(list.items[2].values().born).not.toEqual("1950");
            expect(list.items[2].values().friends[0].born).toEqual(1999);
            expect(list.items[2].values().friends[0].born).not.toEqual("1999");
            expect(list.items[2].values().friends[1].born).toEqual(1972);
            expect(list.items[2].values().friends[1].born).not.toEqual("1972");
        });
        it('should updated nested child items', function() {
            list.items[1].values({
                name: "Jocke",
                born: "1985",
                friends: [
                    { name: "Clyde", born: "1960" },
                    { name: "Pam", born: "1975" },
                    { name: "Rick", born: "1982" }
                ]
            });

            expect(list.items.length).toEqual(2);

            // List.items[0]
            expect(list.items[0].values().name).toEqual("Jonny");
            expect(list.items[0].values().born).toEqual("1986");
            expect(list.items[0].values().friends.length).toEqual(2);
            expect(list.items[0].values().friends[0].name).toEqual("Joe");
            expect(list.items[0].values().friends[0].born).toEqual("1980");
            expect(list.items[0].values().friends[1].name).toEqual("Jive");
            expect(list.items[0].values().friends[1].born).toEqual("1979");

            var elOne = $($('#parse-list').find('.list .parent-list-item')[0]);
            expect(elOne.find('.parent-list-item-property').length).toEqual(3);
            expect(elOne.find('.parent-list-item-property.name').text()).toEqual('Jonny');
            expect(elOne.find('.parent-list-item-property.born').text()).toEqual('1986');

            var elOneNestedChildEls = elOne.find('.nested-child-list-item');
            expect(elOneNestedChildEls.length).toEqual(2);

            var elOneNestedChildElOne = $(elOneNestedChildEls[0]);
            expect(elOneNestedChildElOne.find('.nested-child-list-item-property').length).toEqual(2);
            expect(elOneNestedChildElOne.find('.nested-child-list-item-property.name').text()).toEqual('Joe');
            expect(elOneNestedChildElOne.find('.nested-child-list-item-property.born').text()).toEqual('1980');

            var elOneNestedChildElTwo = $(elOneNestedChildEls[1]);
            expect(elOneNestedChildElTwo.find('.nested-child-list-item-property').length).toEqual(2);
            expect(elOneNestedChildElTwo.find('.nested-child-list-item-property.name').text()).toEqual('Jive');
            expect(elOneNestedChildElTwo.find('.nested-child-list-item-property.born').text()).toEqual('1979');

            // List.items[1]
            expect(list.items[1].values().name).toEqual("Jocke");
            expect(list.items[1].values().born).toEqual("1985");
            expect(list.items[1].values().friends.length).toEqual(3);
            expect(list.items[1].values().friends[0].name).toEqual("Clyde");
            expect(list.items[1].values().friends[0].born).toEqual("1960");
            expect(list.items[1].values().friends[1].name).toEqual("Pam");
            expect(list.items[1].values().friends[1].born).toEqual("1975");
            expect(list.items[1].values().friends[2].name).toEqual("Rick");
            expect(list.items[1].values().friends[2].born).toEqual("1982");

            var elTwo = $($('#parse-list').find('.list .parent-list-item')[1]);
            expect(elTwo.find('.parent-list-item-property').length).toEqual(3);
            expect(elTwo.find('.parent-list-item-property.name').text()).toEqual('Jocke');
            expect(elTwo.find('.parent-list-item-property.born').text()).toEqual('1985');

            var elTwoNestedChildEls = elTwo.find('.nested-child-list-item');
            expect(elTwoNestedChildEls.length).toEqual(3);

            var elTwoNestedChildElOne = $(elTwoNestedChildEls[0]);
            expect(elTwoNestedChildElOne.find('.nested-child-list-item-property').length).toEqual(2);
            expect(elTwoNestedChildElOne.find('.nested-child-list-item-property.name').text()).toEqual('Clyde');
            expect(elTwoNestedChildElOne.find('.nested-child-list-item-property.born').text()).toEqual('1960');

            var elTwoNestedChildElTwo = $(elTwoNestedChildEls[1]);
            expect(elTwoNestedChildElTwo.find('.nested-child-list-item-property').length).toEqual(2);
            expect(elTwoNestedChildElTwo.find('.nested-child-list-item-property.name').text()).toEqual('Pam');
            expect(elTwoNestedChildElTwo.find('.nested-child-list-item-property.born').text()).toEqual('1975');

            var elTwoNestedChildElThree = $(elTwoNestedChildEls[2]);
            expect(elTwoNestedChildElThree.find('.nested-child-list-item-property').length).toEqual(2);
            expect(elTwoNestedChildElThree.find('.nested-child-list-item-property.name').text()).toEqual('Rick');
            expect(elTwoNestedChildElThree.find('.nested-child-list-item-property.born').text()).toEqual('1982');
        });
    });

    // describe('Parse data', function() {
    //
    //     var list;
    //
    //     beforeEach(function() {
    //         $('body').append($('<div id="parse-list">\
    //     <div class="list">\
    //       <div data-id="1">\
    //         <a href="http://lol.com" class="link name">Jonny</a>\
    //         <span class="born timestamp" data-timestamp="54321">1986</span>\
    //         <img class="image" src="usage/boba.jpeg">\
    //         <input class="foo" value="Bar">\
    //       </div>\
    //       <div data-id="2">\
    //         <a href="http://lol.com" class="link name">Jocke</a>\
    //         <span class="born timestamp" data-timestamp="12345">1985</span>\
    //         <img class="image" src="usage/leia.jpeg">\
    //         <input class="foo child" value="Car">\
    //       </div>\
    //     </div>\
    //   </div>'));
    //
    //         list = new List('parse-list', {
    //             valueNames: [
    //                 'name',
    //                 'born',
    //                 { data: [ 'id' ] },
    //                 { attr: 'src', name: 'image'},
    //                 { attr: 'href', name: 'link'},
    //                 { attr: 'value', name: 'foo'},
    //                 { attr: 'data-timestamp', name: 'timestamp' }
    //             ]
    //         });
    //     });
    //
    //     afterEach(function() {
    //         $('#parse-list').remove();
    //     });
    //
    //     it('should get values from class, data, src, value and child els data-attribute', function() {
    //         expect(list.items.length).toEqual(2);
    //         var jonny = list.items[0].values();
    //         expect(jonny.name).toEqual("Jonny");
    //         expect(jonny.born).toEqual("1986");
    //         expect(jonny.id).toEqual("1");
    //         expect(jonny.image).toEqual("usage/boba.jpeg");
    //         expect(jonny.timestamp).toEqual("54321");
    //         expect(jonny.foo).toEqual("Bar");
    //     });
    //     it('should add item to list with class, data and src', function() {
    //         list.add({ name: "Sven", born: 1950, id: 4, image: 'usage/rey.jpeg', link: 'localhost', timestamp: '1337', foo: 'hej' });
    //         expect(list.items.length).toEqual(3);
    //         var sven = list.items[2].values();
    //         expect(sven.name).toEqual("Sven");
    //         expect(sven.born).toEqual(1950);
    //         expect(sven.id).toEqual(4);
    //         expect(sven.image).toEqual("usage/rey.jpeg");
    //         expect(sven.link).toEqual("localhost");
    //         expect(sven.timestamp).toEqual("1337");
    //         expect(sven.foo).toEqual("hej");
    //         var el = $($('#parse-list').find('.list div')[2]);
    //         expect(el.data('id')).toEqual(4);
    //         expect(el.find('.name').text()).toEqual('Sven');
    //         expect(el.find('.born').text()).toEqual('1950');
    //         expect(el.find('.image').attr('src')).toEqual('usage/rey.jpeg');
    //         expect(el.find('.link').attr('href')).toEqual('localhost');
    //         expect(el.find('.timestamp').data('timestamp')).toEqual(1337);
    //         expect(el.find('.foo').val()).toEqual('hej');
    //     });
    // });
});
